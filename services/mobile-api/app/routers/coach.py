from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.db import get_db
from app.models import User
from app.schemas import CoachChatRequest, CoachChatResponse
from app.security import get_current_user
from app.services import coach_chat

router = APIRouter(prefix="/api/v1/coach", tags=["coach"])


@router.post("/chat", response_model=CoachChatResponse)
async def chat(
    body: CoachChatRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> CoachChatResponse:
    return await coach_chat(db, user, body, get_settings())
