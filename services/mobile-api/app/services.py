from __future__ import annotations

import secrets
from datetime import UTC, datetime, timedelta

from fastapi import HTTPException, status
from sqlalchemy import and_, func, not_, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import Settings
from app.models import Course, JobPosting, User, UserRole, UserStatus
from app.schemas import (
    CourseDetailOut,
    CourseOut,
    JobDetailOut,
    JobOut,
    LoginRequest,
    RegisterRequest,
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
    token = create_access_token(
        user_id=user.id,
        email=user.email,
        role=_role_value(user),
        settings=settings,
    )
    return TokenResponse(
        access_token=token,
        expires_in_minutes=settings.mobile_jwt_expire_minutes,
        user=user_to_out(user),
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
    token = create_access_token(
        user_id=user.id,
        email=user.email,
        role=_role_value(user),
        settings=settings,
    )
    return TokenResponse(
        access_token=token,
        expires_in_minutes=settings.mobile_jwt_expire_minutes,
        user=user_to_out(user),
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
    limit: int = 50,
) -> list[JobOut]:
    limit = max(1, min(limit, 100))
    now = datetime.now(UTC).replace(tzinfo=None)
    cutoff = now - ACTIVE_JOB_MAX_AGE
    anchor = func.coalesce(JobPosting.posted_at, JobPosting.fetched_at)

    keyword_filters = [
        or_(
            JobPosting.title.ilike(f"%{kw}%"),
            JobPosting.description.ilike(f"%{kw}%"),
        )
        for kw in JS_NODE_KEYWORDS
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
