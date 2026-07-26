# Adolfo AI Python

Microservicio FastAPI para generación LLM (OpenAI / Claude). Pensado para:

- n8n (HTTP Request → `POST /v1/generate`)
- Next.js con `AI_PROVIDER=python` + `AI_PYTHON_URL=http://localhost:8000`

## Local (sin Docker)

```bash
cd ai-python
python -m venv .venv
# Windows: .venv\Scripts\activate
source .venv/bin/activate
pip install -r requirements.txt
export OPENAI_API_KEY=sk-...
uvicorn main:app --reload --port 8000
```

## Docker

```bash
# Desde la raíz del repo (keys en .env del host)
docker compose --profile ai-python up -d --build ai-python
curl http://localhost:8000/health
```

## Ejemplo

```bash
curl -s http://localhost:8000/v1/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Resume este JD en 3 bullets","system":"Sé conciso"}'
```
