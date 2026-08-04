from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.schemas import JobDetailOut, JobOut
from app.services import get_public_job, list_public_jobs

router = APIRouter(prefix="/api/v1/jobs", tags=["jobs"])


@router.get("", response_model=list[JobOut])
async def list_jobs(
    q: str | None = Query(default=None, description="Filtro título/empresa"),
    limit: int = Query(default=50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
) -> list[JobOut]:
    return await list_public_jobs(db, q=q, limit=limit)


@router.get("/{job_id}", response_model=JobDetailOut)
async def job_detail(
    job_id: str,
    db: AsyncSession = Depends(get_db),
) -> JobDetailOut:
    return await get_public_job(db, job_id)
