from fastapi import APIRouter, Depends, Header
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.db import get_db
from app.models import User
from app.schemas import (
    CoachChatRequest,
    CoachChatResponse,
    CoachConversationDetail,
    CoachConversationOut,
)
from app.security import get_current_user
from app.services import (
    coach_chat,
    create_coach_conversation,
    delete_coach_conversation,
    get_coach_conversation,
    list_coach_conversations,
)

router = APIRouter(prefix="/api/v1/coach", tags=["coach"])


@router.get("/conversations", response_model=list[CoachConversationOut])
async def conversations(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[CoachConversationOut]:
    return await list_coach_conversations(db, user.id)


@router.post("/conversations", response_model=CoachConversationOut)
async def new_conversation(
    locale: str | None = None,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> CoachConversationOut:
    return await create_coach_conversation(db, user.id, locale=locale)


@router.get("/conversations/{conversation_id}", response_model=CoachConversationDetail)
async def conversation_detail(
    conversation_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> CoachConversationDetail:
    return await get_coach_conversation(db, user.id, conversation_id)


@router.delete("/conversations/{conversation_id}", status_code=204)
async def conversation_delete(
    conversation_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    await delete_coach_conversation(db, user.id, conversation_id)


@router.post("/chat", response_model=CoachChatResponse)
async def chat(
    body: CoachChatRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    x_user_gemini_key: str | None = Header(default=None, alias="X-User-Gemini-Key"),
) -> CoachChatResponse:
    return await coach_chat(
        db,
        user,
        body,
        get_settings(),
        user_gemini_key=x_user_gemini_key,
    )
