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


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in_minutes: int
    user: UserOut


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
