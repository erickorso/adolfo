"""ORM mapeado a tablas Prisma existentes (solo lectura + auth)."""

from datetime import datetime
from enum import StrEnum

from sqlalchemy import Boolean, DateTime, Enum, Integer, String, Text, false
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


class UserRole(StrEnum):
    CUSTOMER = "CUSTOMER"
    ADMIN = "ADMIN"
    SUPERADMIN = "SUPERADMIN"


class UserStatus(StrEnum):
    ACTIVE = "ACTIVE"
    BANNED = "BANNED"


user_role_enum = Enum(
    UserRole,
    name="UserRole",
    native_enum=True,
    create_type=False,
    values_callable=lambda x: [e.value for e in x],
)
user_status_enum = Enum(
    UserStatus,
    name="UserStatus",
    native_enum=True,
    create_type=False,
    values_callable=lambda x: [e.value for e in x],
)


class User(Base):
    __tablename__ = "User"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    name: Mapped[str | None] = mapped_column(String, nullable=True)
    image: Mapped[str | None] = mapped_column(String, nullable=True)
    password_hash: Mapped[str | None] = mapped_column("passwordHash", String, nullable=True)
    role: Mapped[UserRole] = mapped_column(user_role_enum, default=UserRole.CUSTOMER)
    status: Mapped[UserStatus] = mapped_column(user_status_enum, default=UserStatus.ACTIVE)
    created_at: Mapped[datetime] = mapped_column("createdAt", DateTime)
    updated_at: Mapped[datetime] = mapped_column("updatedAt", DateTime)


class JobPosting(Base):
    __tablename__ = "JobPosting"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    source: Mapped[str] = mapped_column(String)
    external_id: Mapped[str] = mapped_column("externalId", String)
    company: Mapped[str] = mapped_column(String)
    title: Mapped[str] = mapped_column(String)
    location: Mapped[str | None] = mapped_column(String, nullable=True)
    remote: Mapped[bool] = mapped_column(Boolean, default=False)
    hidden: Mapped[bool] = mapped_column(Boolean, default=False, server_default=false())
    url: Mapped[str] = mapped_column(String)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    posted_at: Mapped[datetime | None] = mapped_column("postedAt", DateTime, nullable=True)
    fetched_at: Mapped[datetime] = mapped_column("fetchedAt", DateTime)


class Course(Base):
    __tablename__ = "Course"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    source: Mapped[str] = mapped_column(String)
    external_id: Mapped[str | None] = mapped_column("externalId", String, nullable=True)
    title: Mapped[str] = mapped_column(String)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    provider: Mapped[str] = mapped_column(String)
    url: Mapped[str] = mapped_column(String)
    hours: Mapped[int] = mapped_column(Integer)
    modality: Mapped[str] = mapped_column(String, default="online")
    sector: Mapped[str | None] = mapped_column(String, nullable=True)
    location: Mapped[str | None] = mapped_column(String, nullable=True)
    target_audience: Mapped[str | None] = mapped_column(
        "targetAudience", String, nullable=True
    )
    free: Mapped[bool] = mapped_column(Boolean, default=True)
    hidden: Mapped[bool] = mapped_column(Boolean, default=False, server_default=false())
