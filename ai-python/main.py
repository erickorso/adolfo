"""
Adolfo AI Python — microservicio LLM para n8n / ops.
Levantar local:  uvicorn main:app --reload --port 8000
Docker:          docker compose --profile ai-python up -d ai-python
"""

from __future__ import annotations

import os
from typing import Literal

import httpx
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(title="Adolfo AI Python", version="0.1.0")

ProviderName = Literal["openai", "claude"]


class GenerateRequest(BaseModel):
    prompt: str = Field(min_length=1)
    system: str | None = None
    max_tokens: int = Field(default=2048, ge=1, le=8192)
    temperature: float = Field(default=0.4, ge=0, le=2)
    provider: ProviderName | None = None


class GenerateResponse(BaseModel):
    text: str
    model: str
    provider: str


def _default_provider() -> ProviderName:
    raw = os.getenv("AI_PYTHON_DEFAULT_PROVIDER", "openai").lower()
    return "claude" if raw == "claude" else "openai"


async def _openai_generate(body: GenerateRequest) -> GenerateResponse:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="Falta OPENAI_API_KEY")
    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    messages: list[dict[str, str]] = []
    if body.system:
        messages.append({"role": "system", "content": body.system})
    messages.append({"role": "user", "content": body.prompt})

    async with httpx.AsyncClient(timeout=60.0) as client:
        res = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={"Authorization": f"Bearer {api_key}"},
            json={
                "model": model,
                "messages": messages,
                "max_tokens": body.max_tokens,
                "temperature": body.temperature,
            },
        )
    if res.status_code >= 400:
        raise HTTPException(status_code=502, detail=res.text)
    data = res.json()
    text = (data.get("choices") or [{}])[0].get("message", {}).get("content")
    if not text:
        raise HTTPException(status_code=502, detail="OpenAI respuesta vacía")
    return GenerateResponse(text=text.strip(), model=model, provider="openai")


async def _claude_generate(body: GenerateRequest) -> GenerateResponse:
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="Falta ANTHROPIC_API_KEY")
    model = os.getenv("ANTHROPIC_MODEL", "claude-sonnet-4-20250514")
    payload: dict = {
        "model": model,
        "max_tokens": body.max_tokens,
        "temperature": body.temperature,
        "messages": [{"role": "user", "content": body.prompt}],
    }
    if body.system:
        payload["system"] = body.system

    async with httpx.AsyncClient(timeout=60.0) as client:
        res = await client.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": api_key,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            json=payload,
        )
    if res.status_code >= 400:
        raise HTTPException(status_code=502, detail=res.text)
    data = res.json()
    parts = [
        block.get("text", "")
        for block in data.get("content") or []
        if block.get("type") == "text"
    ]
    text = "".join(parts).strip()
    if not text:
        raise HTTPException(status_code=502, detail="Claude respuesta vacía")
    return GenerateResponse(text=text, model=model, provider="claude")


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/v1/generate", response_model=GenerateResponse)
async def generate(body: GenerateRequest) -> GenerateResponse:
    provider = body.provider or _default_provider()
    if provider == "claude":
        return await _claude_generate(body)
    return await _openai_generate(body)
