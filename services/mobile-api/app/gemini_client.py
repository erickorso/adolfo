"""Llamada directa a Gemini (BYOK user key)."""

from __future__ import annotations

import httpx
from fastapi import HTTPException, status

GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models"


def validate_user_gemini_key(raw: str | None) -> str | None:
    if raw is None:
        return None
    key = raw.strip()
    if not key:
        return None
    if len(key) < 20 or not key.startswith("AIza"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "code": "INVALID_USER_GEMINI_KEY",
                "message": "API key Gemini inválida (esperada AIza…)",
            },
        )
    return key


async def gemini_generate_text(
    *,
    api_key: str,
    model: str,
    system: str | None,
    prompt: str,
    max_output_tokens: int = 1200,
    temperature: float = 0.4,
) -> tuple[str, str]:
    """Devuelve (text, provider_id)."""
    url = f"{GEMINI_BASE}/{model}:generateContent"
    body: dict = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "maxOutputTokens": max_output_tokens,
            "temperature": temperature,
        },
    }
    if system:
        body["systemInstruction"] = {"parts": [{"text": system}]}

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            res = await client.post(
                url,
                headers={
                    "Content-Type": "application/json",
                    "x-goog-api-key": api_key,
                },
                json=body,
            )
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"No se pudo contactar Gemini: {exc}",
        ) from exc

    detail_text = res.text[:400]
    lower = detail_text.lower()
    if res.status_code == 400 and (
        "api key" in lower or "api_key" in lower or "invalid" in lower
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "code": "INVALID_USER_GEMINI_KEY",
                "message": "API key Gemini rechazada por Google",
            },
        )
    if res.status_code == 403 and ("api key" in lower or "permission" in lower):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "code": "INVALID_USER_GEMINI_KEY",
                "message": "API key Gemini sin permiso",
            },
        )
    if res.status_code == 429 or "resource_exhausted" in lower or "quota" in lower:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail={
                "code": "AI_QUOTA",
                "message": "Cuota de tu Gemini agotada. Probá más tarde o otra key.",
            },
        )
    if not res.is_success:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Gemini respondió {res.status_code}: {detail_text}",
        )

    data = res.json()
    parts = (
        data.get("candidates") or [{}]
    )[0].get("content", {}).get("parts") or []
    text = "".join(p.get("text") or "" for p in parts).strip()
    if not text:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Gemini devolvió respuesta vacía",
        )
    return text, f"gemini-byok:{model}"
