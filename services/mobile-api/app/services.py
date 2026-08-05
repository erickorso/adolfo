from __future__ import annotations

import json
import secrets
from datetime import UTC, datetime, timedelta

import httpx
from fastapi import HTTPException, status
from sqlalchemy import and_, func, not_, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import Settings
from app.gemini_client import gemini_generate_text, validate_user_gemini_key
from app.models import (
    CoachConversation,
    CoachMessage,
    Course,
    JobPosting,
    User,
    UserRole,
    UserSearchScope,
    UserStatus,
)
from app.schemas import (
    CourseDetailOut,
    CourseOut,
    CoachChatRequest,
    CoachChatResponse,
    CoachConversationDetail,
    CoachConversationOut,
    CoachCourseRef,
    CoachJobRef,
    CoachMessageOut,
    CoachRefs,
    IngestRequest,
    IngestResponse,
    JobDetailOut,
    JobOut,
    LoginRequest,
    RegisterRequest,
    SearchScopeOut,
    SearchScopeUpdate,
    TokenResponse,
    UserOut,
)
from app.security import create_access_token, hash_password, verify_password

JS_NODE_KEYWORDS = (
    "javascript",
    "typescript",
    "react",
    "next.js",
    "nextjs",
    "node",
    "node.js",
    "nodejs",
    "frontend",
    "front-end",
    "full stack",
    "fullstack",
)

DEFAULT_JOB_KEYWORDS = [
    "javascript",
    "typescript",
    "react",
    "next.js",
    "node",
    "frontend",
    "full stack",
]

ACTIVE_JOB_MAX_AGE = timedelta(days=10)


def user_to_out(user: User) -> UserOut:
    role = user.role if isinstance(user.role, str) else user.role.value
    return UserOut(
        id=user.id,
        email=user.email,
        name=user.name,
        image=user.image,
        role=role,
    )


def _role_value(user: User) -> str:
    return user.role if isinstance(user.role, str) else user.role.value


def _normalize_keywords(raw: object) -> list[str]:
    if not isinstance(raw, list):
        return []
    out: list[str] = []
    for item in raw:
        if isinstance(item, str):
            kw = item.strip()
            if kw and kw not in out:
                out.append(kw)
    return out[:40]


def scope_to_out(row: UserSearchScope | None) -> SearchScopeOut:
    if row is None:
        return SearchScopeOut(
            job_keywords=list(DEFAULT_JOB_KEYWORDS),
            job_query="",
            course_query="",
        )
    keywords = _normalize_keywords(row.job_keywords)
    return SearchScopeOut(
        job_keywords=keywords or list(DEFAULT_JOB_KEYWORDS),
        job_query=row.job_query or "",
        course_query=row.course_query or "",
    )


async def get_user_scope(db: AsyncSession, user_id: str) -> SearchScopeOut:
    result = await db.execute(
        select(UserSearchScope).where(UserSearchScope.user_id == user_id)
    )
    return scope_to_out(result.scalar_one_or_none())


async def upsert_user_scope(
    db: AsyncSession,
    user_id: str,
    body: SearchScopeUpdate,
) -> SearchScopeOut:
    result = await db.execute(
        select(UserSearchScope).where(UserSearchScope.user_id == user_id)
    )
    row = result.scalar_one_or_none()
    now = datetime.now(UTC).replace(tzinfo=None)

    if row is None:
        keywords = (
            _normalize_keywords(body.job_keywords)
            if body.job_keywords is not None
            else list(DEFAULT_JOB_KEYWORDS)
        )
        row = UserSearchScope(
            id=f"s{secrets.token_hex(12)}",
            user_id=user_id,
            job_keywords=keywords or list(DEFAULT_JOB_KEYWORDS),
            job_query=(body.job_query or "").strip()[:200],
            course_query=(body.course_query or "").strip()[:200],
            created_at=now,
            updated_at=now,
        )
        db.add(row)
    else:
        if body.job_keywords is not None:
            keywords = _normalize_keywords(body.job_keywords)
            row.job_keywords = keywords or list(DEFAULT_JOB_KEYWORDS)
        if body.job_query is not None:
            row.job_query = body.job_query.strip()[:200]
        if body.course_query is not None:
            row.course_query = body.course_query.strip()[:200]
        row.updated_at = now

    await db.commit()
    await db.refresh(row)
    return scope_to_out(row)


async def _token_with_scope_ingest(
    *,
    db: AsyncSession,
    user: User,
    settings: Settings,
    run_ingest: bool,
) -> TokenResponse:
    scope = await get_user_scope(db, user.id)
    token = create_access_token(
        user_id=user.id,
        email=user.email,
        role=_role_value(user),
        settings=settings,
    )
    ingest: IngestResponse | None = None
    ingest_error: str | None = None
    if run_ingest and scope.job_keywords:
        try:
            ingest = await trigger_jobs_ingest(
                settings,
                IngestRequest(keywords=scope.job_keywords, remote_only=True),
            )
        except Exception as exc:  # noqa: BLE001 — login no debe fallar por ingest
            if isinstance(exc, httpx.HTTPStatusError):
                ingest_error = (
                    exc.response.text[:300] or exc.response.reason_phrase
                )
            else:
                ingest_error = str(exc)

    return TokenResponse(
        access_token=token,
        expires_in_minutes=settings.mobile_jwt_expire_minutes,
        user=user_to_out(user),
        scope=scope,
        ingest=ingest,
        ingest_error=ingest_error,
    )


async def login_user(
    db: AsyncSession,
    body: LoginRequest,
    settings: Settings,
) -> TokenResponse:
    email = str(body.email).lower()
    result = await db.execute(select(User).where(func.lower(User.email) == email))
    user = result.scalar_one_or_none()
    if user is None or not user.password_hash:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
        )
    if user.status == UserStatus.BANNED:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cuenta bloqueada",
        )
    if not verify_password(body.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
        )
    return await _token_with_scope_ingest(
        db=db,
        user=user,
        settings=settings,
        run_ingest=True,
    )


async def register_user(
    db: AsyncSession,
    body: RegisterRequest,
    settings: Settings,
) -> TokenResponse:
    email = str(body.email).lower()
    existing = await db.execute(
        select(User).where(func.lower(User.email) == email)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email ya registrado",
        )
    now = datetime.now(UTC).replace(tzinfo=None)
    user = User(
        id=f"c{secrets.token_hex(12)}",
        email=email,
        name=body.name,
        password_hash=hash_password(body.password),
        role=UserRole.CUSTOMER,
        status=UserStatus.ACTIVE,
        created_at=now,
        updated_at=now,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    await upsert_user_scope(
        db,
        user.id,
        SearchScopeUpdate(job_keywords=list(DEFAULT_JOB_KEYWORDS)),
    )
    return await _token_with_scope_ingest(
        db=db,
        user=user,
        settings=settings,
        run_ingest=True,
    )


def _job_to_out(job: JobPosting) -> JobOut:
    return JobOut(
        id=job.id,
        source=job.source,
        company=job.company,
        title=job.title,
        location=job.location,
        remote=job.remote,
        url=job.url,
        posted_at=job.posted_at,
    )


def _job_to_detail(job: JobPosting) -> JobDetailOut:
    base = _job_to_out(job)
    return JobDetailOut(**base.model_dump(), description=job.description)


async def list_public_jobs(
    db: AsyncSession,
    *,
    q: str | None = None,
    keywords: list[str] | None = None,
    limit: int = 50,
) -> list[JobOut]:
    limit = max(1, min(limit, 100))
    now = datetime.now(UTC).replace(tzinfo=None)
    cutoff = now - ACTIVE_JOB_MAX_AGE
    anchor = func.coalesce(JobPosting.posted_at, JobPosting.fetched_at)

    scope = [k for k in (keywords or []) if k.strip()] or list(JS_NODE_KEYWORDS)
    keyword_filters = [
        or_(
            JobPosting.title.ilike(f"%{kw}%"),
            JobPosting.description.ilike(f"%{kw}%"),
        )
        for kw in scope
    ]

    conditions = [
        JobPosting.hidden.is_(False),
        JobPosting.remote.is_(True),
        anchor >= cutoff,
        not_(
            or_(
                JobPosting.location.ilike("%madrid%"),
                JobPosting.title.ilike("%madrid%"),
            )
        ),
        or_(*keyword_filters),
    ]

    if q and q.strip():
        term = f"%{q.strip()}%"
        conditions.append(
            or_(
                JobPosting.title.ilike(term),
                JobPosting.company.ilike(term),
                JobPosting.description.ilike(term),
            )
        )

    stmt = (
        select(JobPosting)
        .where(and_(*conditions))
        .order_by(JobPosting.posted_at.desc().nulls_last(), JobPosting.fetched_at.desc())
        .limit(limit)
    )
    result = await db.execute(stmt)
    return [_job_to_out(row) for row in result.scalars().all()]


async def trigger_jobs_ingest(
    settings: Settings,
    body: IngestRequest | None = None,
) -> IngestResponse:
    secret = settings.adolfo_bearer_secret
    if not secret:
        raise ValueError("JOBS_INGEST_SECRET (o AI_GENERATE_SECRET) no configurado")

    payload: dict = {}
    if body:
        if body.keywords:
            payload["keywords"] = body.keywords
        if body.remote_only is not None:
            payload["remoteOnly"] = body.remote_only

    base = settings.adolfo_base_url.rstrip("/")
    async with httpx.AsyncClient(timeout=120.0) as client:
        res = await client.post(
            f"{base}/api/jobs/ingest",
            headers={
                "Authorization": f"Bearer {secret}",
                "Content-Type": "application/json",
            },
            json=payload if payload else {},
        )
        res.raise_for_status()
        data = res.json()

    return IngestResponse(
        ingested=int(data.get("ingested", 0)),
        sources=data.get("sources"),
        query=data.get("query"),
        imagen_semana=data.get("imagenSemana"),
    )


def _as_naive_utc(value: datetime) -> datetime:
    if value.tzinfo is not None:
        return value.astimezone(UTC).replace(tzinfo=None)
    return value


async def get_public_job(db: AsyncSession, job_id: str) -> JobDetailOut:
    result = await db.execute(select(JobPosting).where(JobPosting.id == job_id))
    job = result.scalar_one_or_none()
    if job is None or job.hidden or not job.remote:
        raise HTTPException(status_code=404, detail="Vacante no encontrada")
    now = datetime.now(UTC).replace(tzinfo=None)
    anchor = _as_naive_utc(job.posted_at or job.fetched_at)
    if anchor < now - ACTIVE_JOB_MAX_AGE:
        raise HTTPException(status_code=404, detail="Vacante no encontrada")
    loc = f"{job.location or ''} {job.title}".lower()
    if "madrid" in loc:
        raise HTTPException(status_code=404, detail="Vacante no encontrada")
    return _job_to_detail(job)


def _course_to_out(row: Course) -> CourseOut:
    return CourseOut(
        id=row.id,
        title=row.title,
        provider=row.provider,
        url=row.url,
        hours=row.hours,
        modality=row.modality,
        sector=row.sector,
        location=row.location,
        target_audience=row.target_audience,
        free=row.free,
    )


def _course_to_detail(row: Course) -> CourseDetailOut:
    base = _course_to_out(row)
    return CourseDetailOut(
        **base.model_dump(),
        description=row.description,
        source=row.source,
        external_id=row.external_id,
    )


async def search_courses(
    db: AsyncSession,
    *,
    q: str | None = None,
    min_hours: int | None = None,
    location: str | None = None,
    modality: str | None = None,
    limit: int = 50,
) -> list[CourseOut]:
    limit = max(1, min(limit, 100))
    conditions = [Course.hidden.is_(False)]
    if min_hours is not None:
        conditions.append(Course.hours >= min_hours)
    if location:
        conditions.append(Course.location.ilike(f"%{location.strip()}%"))
    if modality:
        conditions.append(Course.modality.ilike(modality.strip()))
    if q and q.strip():
        term = f"%{q.strip()}%"
        conditions.append(
            or_(
                Course.title.ilike(term),
                Course.description.ilike(term),
                Course.provider.ilike(term),
                Course.sector.ilike(term),
            )
        )

    stmt = (
        select(Course)
        .where(and_(*conditions))
        .order_by(Course.hours.desc(), Course.title.asc())
        .limit(limit)
    )
    result = await db.execute(stmt)
    return [_course_to_out(row) for row in result.scalars().all()]


async def get_course(db: AsyncSession, course_id: str) -> CourseDetailOut:
    result = await db.execute(
        select(Course).where(Course.id == course_id, Course.hidden.is_(False))
    )
    row = result.scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=404, detail="Curso no encontrado")
    return _course_to_detail(row)


COACH_SYSTEM_ES = """Sos el Career Coach de Adolfo (app mobile de jobs + cursos).
Reglas:
- Respondé en español, claro y accionable (bullets cortos).
- Usá SOLO vacantes y cursos del bloque CONTEXT. No inventes IDs, empresas ni URLs.
- Si el contexto está vacío o no alcanza, pedí ajustar Scope (keywords / search).
- Relacioná gaps del usuario con cursos del catálogo y vacantes concretas por título.
- No digas que sos un modelo genérico; sos el coach del producto.
"""

COACH_SYSTEM_EN = """You are Adolfo's Career Coach (mobile app for jobs + courses).
Rules:
- Reply in English, clear and actionable (short bullets).
- Use ONLY openings and courses from the CONTEXT block. Do not invent IDs, companies, or URLs.
- If context is empty or insufficient, ask the user to adjust Scope (keywords / search).
- Relate user gaps to catalog courses and concrete openings by title.
- Do not say you are a generic model; you are the product coach.
"""


def coach_system_prompt(locale: str | None) -> str:
    lang = (locale or "es").strip().lower()[:2]
    return COACH_SYSTEM_EN if lang == "en" else COACH_SYSTEM_ES


def _clip(text: str | None, n: int = 400) -> str:
    if not text:
        return ""
    t = " ".join(text.split())
    return t if len(t) <= n else t[: n - 1] + "…"


async def _coach_job_rows(
    db: AsyncSession,
    *,
    keywords: list[str],
    q: str,
    limit: int = 8,
) -> list[JobPosting]:
    now = datetime.now(UTC).replace(tzinfo=None)
    cutoff = now - ACTIVE_JOB_MAX_AGE
    anchor = func.coalesce(JobPosting.posted_at, JobPosting.fetched_at)
    scope = [k for k in keywords if k.strip()] or list(JS_NODE_KEYWORDS)
    keyword_filters = [
        or_(
            JobPosting.title.ilike(f"%{kw}%"),
            JobPosting.description.ilike(f"%{kw}%"),
        )
        for kw in scope
    ]
    conditions = [
        JobPosting.hidden.is_(False),
        JobPosting.remote.is_(True),
        anchor >= cutoff,
        not_(
            or_(
                JobPosting.location.ilike("%madrid%"),
                JobPosting.title.ilike("%madrid%"),
            )
        ),
        or_(*keyword_filters),
    ]
    if q.strip():
        term = f"%{q.strip()}%"
        conditions.append(
            or_(
                JobPosting.title.ilike(term),
                JobPosting.company.ilike(term),
                JobPosting.description.ilike(term),
            )
        )
    stmt = (
        select(JobPosting)
        .where(and_(*conditions))
        .order_by(JobPosting.posted_at.desc().nulls_last(), JobPosting.fetched_at.desc())
        .limit(limit)
    )
    result = await db.execute(stmt)
    return list(result.scalars().all())


def _title_from_message(text: str) -> str:
    t = " ".join(text.strip().split())
    if not t:
        return "New chat"
    return t if len(t) <= 72 else t[:71] + "…"


def _refs_from_meta(meta: object | None) -> CoachRefs | None:
    if not isinstance(meta, dict):
        return None
    jobs_raw = meta.get("jobs") or []
    courses_raw = meta.get("courses") or []
    jobs: list[CoachJobRef] = []
    courses: list[CoachCourseRef] = []
    if isinstance(jobs_raw, list):
        for j in jobs_raw:
            if isinstance(j, dict) and j.get("id") and j.get("title"):
                jobs.append(
                    CoachJobRef(
                        id=str(j["id"]),
                        title=str(j["title"]),
                        company=str(j.get("company") or ""),
                        url=str(j.get("url") or ""),
                    )
                )
    if isinstance(courses_raw, list):
        for c in courses_raw:
            if isinstance(c, dict) and c.get("id") and c.get("title"):
                courses.append(
                    CoachCourseRef(
                        id=str(c["id"]),
                        title=str(c["title"]),
                        provider=str(c.get("provider") or ""),
                        hours=int(c.get("hours") or 0),
                        url=str(c.get("url") or ""),
                    )
                )
    if not jobs and not courses:
        return None
    return CoachRefs(jobs=jobs, courses=courses)


async def list_coach_conversations(
    db: AsyncSession,
    user_id: str,
    *,
    limit: int = 40,
) -> list[CoachConversationOut]:
    stmt = (
        select(CoachConversation)
        .where(CoachConversation.user_id == user_id)
        .order_by(CoachConversation.updated_at.desc())
        .limit(limit)
    )
    rows = list((await db.execute(stmt)).scalars().all())
    out: list[CoachConversationOut] = []
    for row in rows:
        count = await db.scalar(
            select(func.count())
            .select_from(CoachMessage)
            .where(CoachMessage.conversation_id == row.id)
        )
        out.append(
            CoachConversationOut(
                id=row.id,
                title=row.title,
                locale=row.locale,
                created_at=row.created_at,
                updated_at=row.updated_at,
                message_count=int(count or 0),
            )
        )
    return out


async def get_coach_conversation(
    db: AsyncSession,
    user_id: str,
    conversation_id: str,
) -> CoachConversationDetail:
    conv = await db.get(CoachConversation, conversation_id)
    if conv is None or conv.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversación no encontrada",
        )
    msgs = list(
        (
            await db.execute(
                select(CoachMessage)
                .where(CoachMessage.conversation_id == conversation_id)
                .order_by(CoachMessage.created_at.asc())
            )
        )
        .scalars()
        .all()
    )
    messages: list[CoachMessageOut] = []
    for m in msgs:
        refs = _refs_from_meta(m.meta)
        provider = None
        if isinstance(m.meta, dict):
            provider = m.meta.get("provider")
            if provider is not None:
                provider = str(provider)
        messages.append(
            CoachMessageOut(
                id=m.id,
                role=m.role,
                content=m.content,
                created_at=m.created_at,
                refs=refs,
                provider=provider,
            )
        )
    return CoachConversationDetail(
        id=conv.id,
        title=conv.title,
        locale=conv.locale,
        created_at=conv.created_at,
        updated_at=conv.updated_at,
        messages=messages,
    )


async def create_coach_conversation(
    db: AsyncSession,
    user_id: str,
    *,
    locale: str | None = None,
    title: str | None = None,
) -> CoachConversationOut:
    now = datetime.now(UTC).replace(tzinfo=None)
    lang = (locale or "es").strip().lower()[:2] or "es"
    row = CoachConversation(
        id=f"cc{secrets.token_hex(12)}",
        user_id=user_id,
        title=(title or ("Nuevo chat" if lang == "es" else "New chat")).strip()[:120],
        locale=lang,
        created_at=now,
        updated_at=now,
    )
    db.add(row)
    await db.commit()
    await db.refresh(row)
    return CoachConversationOut(
        id=row.id,
        title=row.title,
        locale=row.locale,
        created_at=row.created_at,
        updated_at=row.updated_at,
        message_count=0,
    )


async def delete_coach_conversation(
    db: AsyncSession,
    user_id: str,
    conversation_id: str,
) -> None:
    conv = await db.get(CoachConversation, conversation_id)
    if conv is None or conv.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversación no encontrada",
        )
    await db.delete(conv)
    await db.commit()


async def _get_or_create_conversation(
    db: AsyncSession,
    user_id: str,
    conversation_id: str | None,
    locale: str | None,
) -> CoachConversation:
    if conversation_id:
        conv = await db.get(CoachConversation, conversation_id)
        if conv is None or conv.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversación no encontrada",
            )
        return conv
    created = await create_coach_conversation(db, user_id, locale=locale)
    conv = await db.get(CoachConversation, created.id)
    assert conv is not None
    return conv


async def coach_chat(
    db: AsyncSession,
    user: User,
    body: CoachChatRequest,
    settings: Settings,
    user_gemini_key: str | None = None,
) -> CoachChatResponse:
    byok_key = validate_user_gemini_key(user_gemini_key)
    secret = settings.adolfo_bearer_secret
    if not byok_key and not secret:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI no configurada (AI_GENERATE_SECRET o JOBS_INGEST_SECRET)",
        )

    conv = await _get_or_create_conversation(
        db, user.id, body.conversation_id, body.locale
    )
    if body.locale:
        conv.locale = body.locale.strip().lower()[:2] or conv.locale

    # Historial: preferir DB (últimos 8); fallback al body del cliente.
    db_msgs = list(
        (
            await db.execute(
                select(CoachMessage)
                .where(CoachMessage.conversation_id == conv.id)
                .order_by(CoachMessage.created_at.asc())
            )
        )
        .scalars()
        .all()
    )
    if db_msgs:
        history_source = [
            {"role": m.role, "content": m.content}
            for m in db_msgs
            if m.role in ("user", "assistant")
        ][-8:]
    else:
        history_source = [
            {"role": h.role, "content": h.content} for h in body.history[-8:]
        ]

    scope = await get_user_scope(db, user.id)
    job_rows = await _coach_job_rows(
        db,
        keywords=scope.job_keywords,
        q=scope.job_query or "",
        limit=8,
    )
    courses = await search_courses(
        db,
        q=scope.course_query or None,
        limit=6,
    )

    jobs_ctx = [
        {
            "id": j.id,
            "title": j.title,
            "company": j.company,
            "url": j.url,
            "location": j.location,
            "description": _clip(j.description),
        }
        for j in job_rows
    ]
    courses_ctx = [
        {
            "id": c.id,
            "title": c.title,
            "provider": c.provider,
            "hours": c.hours,
            "url": c.url,
            "modality": c.modality,
            "free": c.free,
        }
        for c in courses
    ]

    context = {
        "scope": scope.model_dump(),
        "jobs": jobs_ctx,
        "courses": courses_ctx,
    }
    history_lines = []
    for turn in history_source:
        history_lines.append(f"{turn['role'].upper()}: {turn['content'].strip()}")

    reply_instruction = (
        "Reply to the USER using the CONTEXT."
        if (body.locale or conv.locale or "es").strip().lower()[:2] == "en"
        else "Respondé al USER usando el CONTEXT."
    )
    prompt = (
        "CONTEXT (JSON):\n"
        f"{json.dumps(context, ensure_ascii=False)}\n\n"
        + ("CHAT:\n" + "\n".join(history_lines) + "\n\n" if history_lines else "")
        + f"USER: {body.message.strip()}\n\n"
        + reply_instruction
    )
    system = coach_system_prompt(body.locale or conv.locale)

    if byok_key:
        reply, provider = await gemini_generate_text(
            api_key=byok_key,
            model=settings.gemini_model,
            system=system,
            prompt=prompt,
            max_output_tokens=1200,
            temperature=0.4,
        )
    else:
        base = settings.adolfo_base_url.rstrip("/")
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                res = await client.post(
                    f"{base}/api/ai/generate",
                    headers={
                        "Authorization": f"Bearer {secret}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "system": system,
                        "prompt": prompt,
                        "maxOutputTokens": 1200,
                        "temperature": 0.4,
                    },
                )
        except httpx.RequestError as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"No se pudo contactar Adolfo AI: {exc}",
            ) from exc

        if res.status_code == 429:
            try:
                payload = res.json()
            except Exception:
                payload = {}
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail={
                    "code": "AI_QUOTA",
                    "message": payload.get("error")
                    or "Cuota de IA de Adolfo agotada. Agregá tu API key Gemini.",
                    "retryAfterSec": payload.get("retryAfterSec"),
                },
            )
        if not res.is_success:
            detail = res.text[:400] or res.reason_phrase
            try:
                payload = res.json()
                if payload.get("code") == "AI_QUOTA":
                    raise HTTPException(
                        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                        detail={
                            "code": "AI_QUOTA",
                            "message": payload.get("error")
                            or "Cuota de IA de Adolfo agotada.",
                            "retryAfterSec": payload.get("retryAfterSec"),
                        },
                    )
            except HTTPException:
                raise
            except Exception:
                pass
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"AI generate falló: {detail}",
            )

        data = res.json()
        reply = (data.get("text") or "").strip()
        provider = data.get("provider")
        if not reply:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="AI devolvió respuesta vacía",
            )

    refs = CoachRefs(
        jobs=[
            CoachJobRef(
                id=j.id,
                title=j.title,
                company=j.company,
                url=j.url,
            )
            for j in job_rows
        ],
        courses=[
            CoachCourseRef(
                id=c.id,
                title=c.title,
                provider=c.provider,
                hours=c.hours,
                url=c.url,
            )
            for c in courses
        ],
    )

    now = datetime.now(UTC).replace(tzinfo=None)
    is_first = len(db_msgs) == 0
    user_msg = CoachMessage(
        id=f"cm{secrets.token_hex(12)}",
        conversation_id=conv.id,
        role="user",
        content=body.message.strip(),
        meta=None,
        created_at=now,
    )
    assistant_msg = CoachMessage(
        id=f"cm{secrets.token_hex(12)}",
        conversation_id=conv.id,
        role="assistant",
        content=reply,
        meta={
            "jobs": [j.model_dump() for j in refs.jobs],
            "courses": [c.model_dump() for c in refs.courses],
            "provider": provider,
        },
        created_at=now,
    )
    db.add(user_msg)
    db.add(assistant_msg)
    if is_first or conv.title in ("New chat", "Nuevo chat"):
        conv.title = _title_from_message(body.message)
    conv.updated_at = now
    await db.commit()

    return CoachChatResponse(
        reply=reply,
        refs=refs,
        provider=provider,
        conversation_id=conv.id,
    )
