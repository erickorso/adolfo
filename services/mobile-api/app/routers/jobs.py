from __future__ import annotations

import httpx
from fastapi import APIRouter, Body, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.db import get_db
from app.schemas import IngestRequest, IngestResponse, JobDetailOut, JobOut
from app.services import get_public_job, list_public_jobs, trigger_jobs_ingest

router = APIRouter(prefix="/api/v1/jobs", tags=["jobs"])


@router.get("", response_model=list[JobOut])
async def list_jobs(
    q: str | None = Query(default=None, description="Filtro título/empresa"),
    keywords: str | None = Query(
        default=None,
        description="CSV de keywords de scope (reemplaza filtro JS/Node)",
    ),
    limit: int = Query(default=50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
) -> list[JobOut]:
    kw_list = (
        [k.strip() for k in keywords.split(",") if k.strip()] if keywords else None
    )
    return await list_public_jobs(db, q=q, keywords=kw_list, limit=limit)


@router.post("/ingest", response_model=IngestResponse)
async def ingest_jobs(
    body: IngestRequest | None = Body(default=None),
) -> IngestResponse:
    """Proxy a Adolfo `POST /api/jobs/ingest` con scope opcional."""
    settings = get_settings()
    try:
        return await trigger_jobs_ingest(settings, body)
    except httpx.HTTPStatusError as exc:
        detail = exc.response.text[:500] or exc.response.reason_phrase
        raise HTTPException(
            status_code=exc.response.status_code,
            detail=detail,
        ) from exc
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"No se pudo contactar Adolfo ingest: {exc}",
        ) from exc
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc


@router.get("/{job_id}", response_model=JobDetailOut)
async def job_detail(
    job_id: str,
    db: AsyncSession = Depends(get_db),
) -> JobDetailOut:
    return await get_public_job(db, job_id)
