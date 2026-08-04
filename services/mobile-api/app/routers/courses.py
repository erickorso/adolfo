from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.schemas import CourseDetailOut, CourseOut
from app.services import get_course, search_courses

router = APIRouter(prefix="/api/v1/courses", tags=["courses"])


@router.get("", response_model=list[CourseOut])
async def list_courses(
    q: str | None = Query(default=None),
    min_hours: int | None = Query(default=None, ge=0),
    location: str | None = Query(default=None),
    modality: str | None = Query(default=None),
    limit: int = Query(default=50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
) -> list[CourseOut]:
    return await search_courses(
        db,
        q=q,
        min_hours=min_hours,
        location=location,
        modality=modality,
        limit=limit,
    )


@router.get("/{course_id}", response_model=CourseDetailOut)
async def course_detail(
    course_id: str,
    db: AsyncSession = Depends(get_db),
) -> CourseDetailOut:
    return await get_course(db, course_id)
