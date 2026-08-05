from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import __version__
from app.config import get_settings
from app.db import engine
from app.routers import auth, coach, courses, health, jobs, me


@asynccontextmanager
async def lifespan(_app: FastAPI):
    yield
    await engine.dispose()


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title="Adolfo Mobile API",
        description="BFF FastAPI para React Native / Flutter — auth, jobs, courses.",
        version=__version__,
        lifespan=lifespan,
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(health.router)
    app.include_router(auth.router)
    app.include_router(me.router)
    app.include_router(coach.router)
    app.include_router(jobs.router)
    app.include_router(courses.router)
    return app


app = create_app()
