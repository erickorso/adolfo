# n8n ↔ Adolfo

Workflows de automatización para el track **AI Ops** (`jobs/adolfo-hvac-ai-ops-guide.md`).

## Levantar n8n

```bash
# Postgres + n8n
docker compose --profile ops up -d

# UI
open http://localhost:5678
```

Desde contenedores, Adolfo en el host = `http://host.docker.internal:3000`.

## Secrets en n8n

Crear credenciales / variables:

| Nombre | Valor |
|--------|--------|
| `ADOLFO_BASE_URL` | `http://host.docker.internal:3000` |
| `JOBS_INGEST_SECRET` | mismo que `.env` de Adolfo |
| (opcional) `AI_GENERATE_SECRET` | si está seteado en Adolfo |

## Workflows en esta carpeta

| Archivo | Qué hace |
|---------|----------|
| `01-jobs-ingest.json` | Manual/Cron → `GET/POST /api/jobs/ingest` |
| `02-llm-generate.json` | Manual → `POST /api/ai/generate` (LLM via Adolfo) |
| `03-llm-python.json` | Manual → `POST http://host.docker.internal:8000/v1/generate` |

## Importar

1. n8n → **Workflows** → **Import from File**
2. Pegá el JSON
3. Ajustá Bearer y URL si hace falta
4. **Execute** / activá schedule

## Criterio “advanced n8n” (forms)

Tras importar + ejecutar al menos `01` y `02` con éxito, podés decir:

> Self-hosted n8n (Docker) integrated with Adolfo: webhook/cron → REST ingest and LLM generate endpoints; workflow exports in `docs/n8n/`.
