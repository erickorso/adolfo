from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.models import User
from app.schemas import SearchScopeOut, SearchScopeUpdate
from app.security import get_current_user
from app.services import get_user_scope, upsert_user_scope

router = APIRouter(prefix="/api/v1/me", tags=["me"])


@router.get("/scope", response_model=SearchScopeOut)
async def read_scope(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> SearchScopeOut:
    return await get_user_scope(db, user.id)


@router.put("/scope", response_model=SearchScopeOut)
async def write_scope(
    body: SearchScopeUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> SearchScopeOut:
    return await upsert_user_scope(db, user.id, body)
