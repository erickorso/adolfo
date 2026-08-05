from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    name: str | None = Field(default=None, max_length=120)


class UserOut(BaseModel):
    id: str
    email: EmailStr
    name: str | None
    image: str | None
    role: str

    model_config = {"from_attributes": True}


class SearchScopeOut(BaseModel):
    job_keywords: list[str] = Field(default_factory=list)
    job_query: str = ""
    course_query: str = ""


class SearchScopeUpdate(BaseModel):
    job_keywords: list[str] | None = Field(default=None, max_length=40)
    job_query: str | None = Field(default=None, max_length=200)
    course_query: str | None = Field(default=None, max_length=200)


class IngestRequest(BaseModel):
    keywords: list[str] | None = Field(default=None, min_length=1, max_length=40)
    remote_only: bool | None = None


class IngestResponse(BaseModel):
    ingested: int
    sources: list[str] | None = None
    query: dict | None = None
    imagen_semana: object | None = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in_minutes: int
    user: UserOut
    scope: SearchScopeOut | None = None
    ingest: IngestResponse | None = None
    ingest_error: str | None = None


class JobOut(BaseModel):
    id: str
    source: str
    company: str
    title: str
    location: str | None
    remote: bool
    url: str
    posted_at: datetime | None

    model_config = {"from_attributes": True}


class JobDetailOut(JobOut):
    description: str | None


class CourseOut(BaseModel):
    id: str
    title: str
    provider: str
    url: str
    hours: int
    modality: str
    sector: str | None
    location: str | None
    target_audience: str | None
    free: bool

    model_config = {"from_attributes": True}


class CourseDetailOut(CourseOut):
    description: str | None
    source: str
    external_id: str | None


class ChatMessage(BaseModel):
    role: str = Field(pattern="^(user|assistant)$")
    content: str = Field(min_length=1, max_length=4000)


class CoachChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    history: list[ChatMessage] = Field(default_factory=list, max_length=8)
    locale: str | None = Field(default=None, max_length=8)
    conversation_id: str | None = Field(default=None, max_length=64)


class CoachJobRef(BaseModel):
    id: str
    title: str
    company: str
    url: str


class CoachCourseRef(BaseModel):
    id: str
    title: str
    provider: str
    hours: int
    url: str


class CoachRefs(BaseModel):
    jobs: list[CoachJobRef] = Field(default_factory=list)
    courses: list[CoachCourseRef] = Field(default_factory=list)


class CoachChatResponse(BaseModel):
    reply: str
    refs: CoachRefs
    provider: str | None = None
    conversation_id: str


class CoachConversationOut(BaseModel):
    id: str
    title: str
    locale: str
    created_at: datetime
    updated_at: datetime
    message_count: int = 0


class CoachMessageOut(BaseModel):
    id: str
    role: str
    content: str
    created_at: datetime
    refs: CoachRefs | None = None
    provider: str | None = None


class CoachConversationDetail(BaseModel):
    id: str
    title: str
    locale: str
    created_at: datetime
    updated_at: datetime
    messages: list[CoachMessageOut]
