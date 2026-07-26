# Guía Adolfo ↔ AI Ops (HVAC / AI-first ops)

> **Fuente:** JD “AI-powered operations” (HVAC Florida) — n8n, agentes LLM, integraciones business, webhooks.  
> **Objetivo:** convertir Adolfo en **sandbox + portfolio** defendible para roles AI Ops / Automation (no solo Senior Frontend).  
> **Relacionado:** `jobs/ai-automation-path-plan.md`, `/learn/ai-practitioner-path`, `/learn/ai-agents`.

---

## 1. Fit rápido vs JD

| Área JD | Adolfo hoy | Gap |
|---------|------------|-----|
| 5+ yrs software | ✅ CV | — |
| TypeScript | ✅ Next.js / Prisma | — |
| REST APIs | ✅ | — |
| Webhooks | ✅ Ualá (`/api/webhooks/uala`, firma, idempotencia) | Documentar en README/portfolio |
| PostgreSQL | ✅ Prisma | — |
| Git/GitHub | ✅ | — |
| LLM (Gemini) | ⚠️ Provider + uso en app | OpenAI + Claude + Bedrock |
| English | ✅ | — |
| **n8n advanced** | ❌ Solo plan | **Crítico** |
| Docker | ⚠️ Parcial / no stack ops | Compose: n8n (+ Postgres opcional) |
| AWS | ❌ | Preferido: S3 ya en env; Bedrock demo |
| Dashboards / KPIs ops | ⚠️ Jobs/analytics UI | KPIs de automatización |
| CRM / QB / Twilio / Slack / M365 | ❌ | Mocks + 1–2 reales |
| Dispatch / scheduling | ❌ | Mini dominio “jobs/field” |
| Estimating / proposals / invoicing | ❌ | Flujo AI docs |
| LangGraph / MCP / RAG / vectors | ⚠️ Curso MS; sin prod | Bonus prioritario |
| HVAC / construction | ❌ | Dominio simulado OK |

**Regla de honestidad en forms:** n8n = learning/side project hasta tener export JSON + 2 workflows reales. Webhooks/LLM = Adolfo + Krunchbox (streaming).

---

## 2. Qué falta incluir en Adolfo (backlog)

### P0 — Bloqueantes para el JD (2–4 semanas)

| # | Entregable | Dónde | Done when |
|---|------------|-------|-----------|
| P0.1 | **n8n self-host** (Docker Compose) | `docker/n8n/` o root `compose` | `localhost:5678` up |
| P0.2 | Workflow: **webhook → Adolfo API** | `docs/n8n/*.json` | Cron/Remotive → `POST /api/jobs/ingest` |
| P0.3 | Workflow: **LLM node** (OpenAI o Claude) | mismo | Resume/JD → summary JSON |
| P0.4 | Second LLM provider | `src/services/ai/` | `AI_PROVIDER=openai\|claude\|gemini` |
| P0.5 | Doc ops 1-pager | `docs/ai-ops-stack.md` | Diagrama n8n ↔ Adolfo ↔ DB |

### P1 — Portfolio “AI ops backbone” (4–8 semanas)

| # | Entregable | Analogía HVAC JD | Done when |
|---|------------|------------------|-----------|
| P1.1 | **Dispatch lite** | Automated dispatch/scheduling | Modelo `WorkOrder` + estados + assign |
| P1.2 | **CS workflow** | AI customer service | Inbox mock → agent reply → Slack/email |
| P1.3 | **Proposal generator** | Estimating / proposals | Prompt + PDF/MD from brief |
| P1.4 | **Ops dashboard** | KPIs | Panel: jobs processed, webhook latency, agent runs |
| P1.5 | Integraciones mock | CRM / QB / Twilio | Adapters + fixtures; 1 real (Slack o Twilio) |
| P1.6 | Runbooks | Document systems / SOPs | `docs/runbooks/*.md` |

### P2 — Bonus skills (paralelo)

| # | Skill JD | Entregable Adolfo |
|---|----------|-------------------|
| P2.1 | RAG + vector DB | PGVector o Chroma: docs SOPs → `/api/ai/rag` |
| P2.2 | MCP | 1 MCP server (jobs/orders tools) usable from Cursor |
| P2.3 | LangGraph | 1 grafo: intake → enrich → draft → human approve |
| P2.4 | AWS Bedrock | Provider opcional + nota en doc |
| P2.5 | Prompt library | `jobs/prompts/` versionados |

---

## 3. Mapa Responsabilidades JD → Feature Adolfo

| Responsabilidad JD | Feature / módulo sugerido |
|--------------------|---------------------------|
| Own AI-powered operations | `/ops` (interno) + n8n como orquestador |
| AI workflows n8n | `docs/n8n/` + Compose |
| Agents OpenAI / Claude / Bedrock | `AiProvider` multi-vendor |
| Integrate CRM, QB, Google, Twilio, Slack, M365 | `src/services/integrations/*` (interface + mock) |
| Dispatch & scheduling | `WorkOrder` + calendar/slots |
| AI customer service | Ticket → agent → template reply |
| Estimating, proposals, purchasing, invoicing | Generators + estados Order/Invoice |
| Dashboards & KPIs | `/ops/metrics` |
| Field ops automation | Status sync via webhook from “field” mock |
| Internal tools | Admin actions que antes eran manuales |
| Document systems | Runbooks + screenshots |
| Work with founders | Narrative en CV: “built ops backbone from scratch” |

---

## 4. Skills checklist (formulario / entrevista)

### Required — qué decir hoy vs tras P0

| Skill | Hoy | Tras P0–P1 |
|-------|-----|------------|
| Advanced n8n | Learning path only | “Built X workflows self-hosted; exports in repo” |
| Python **or** TypeScript | TS strong | Keep TS; Python only if needed for LangGraph |
| REST + webhooks | Adolfo Ualá | + n8n inbound/outbound |
| PostgreSQL | Prisma | + PGVector opcional |
| Docker | Weak | Compose n8n documented |
| AWS | Weak | S3 storage + Bedrock demo |
| LLMs | Gemini + Krunchbox streaming | + OpenAI/Claude + agent flows |
| English | OK | OK |

### Bonus — orden de ataque

1. Prompt engineering (ya usás) → librería  
2. AI agents (curso MS) → 1 en n8n + 1 en código  
3. RAG + vectors  
4. MCP  
5. LangGraph  
6. Twilio / Slack reales  
7. QuickBooks / CRM (mock suficiente al inicio)

---

## 5. Sprint sugerido (6 semanas)

| Semana | Foco | Output visible en GitHub |
|--------|------|---------------------------|
| 1 | Docker + n8n + webhook → ingest | `docs/n8n/01-jobs-ingest.json` |
| 2 | OpenAI/Claude provider + n8n LLM node | Multi-provider + workflow 02 |
| 3 | WorkOrder + dashboard KPIs mínimo | `/ops` + Prisma models |
| 4 | CS agent flow (Slack o email) | Workflow 03 + adapter |
| 5 | Proposal generator + runbook | `/ops/proposals` + `docs/runbooks/` |
| 6 | RAG SOPs + pitch README | `/api/ai/rag` + sección portfolio |

---

## 6. Textos listos (forms)

**n8n (hasta tener P0):**  
> Personal learning path aligned to Adolfo: designing webhook-driven automations (job ingest, alerts). Building self-hosted n8n workflows as portfolio deliverables—not yet client production.

**n8n (después de P0):**  
> Self-hosted n8n (Docker) integrated with Adolfo: cron/webhook pipelines to REST APIs, LLM nodes for summarization, exports and runbooks in-repo.

**Webhooks:**  
> Adolfo: Ualá payment webhooks — HTTPS endpoint, signature verification, idempotent order updates; plus n8n↔API webhook bridges.

**LLM:**  
> Krunchbox (AI assistant + streaming UI) and Adolfo (Gemini provider abstraction; expanding to OpenAI/Claude for ops agents and n8n workflows).

**Adolfo one-liner (portfolio):**  
> AI-ops sandbox: Next.js + Postgres + webhooks + multi-LLM providers, orchestrated with n8n for business automations (ingest, agents, KPIs)—portfolio for AI-first operations roles.

---

## 7. Red flags / no inventar

- No “advanced n8n” sin JSON export + demo.  
- No HVAC real → “simulated field-service / work-order domain”.  
- No QuickBooks/Twilio en prod → adapters + 1 integración real.  
- Rol es **AI Ops / automation**, no puro Frontend: el pitch del CV debe incluir este track.

---

## 8. Definition of Done (candidatura creíble)

- [x] 2+ workflows n8n en `docs/n8n/` (01 ingest, 02 LLM, 03 Python)
- [x] Compose n8n documentado (`docker compose --profile ops`)
- [x] ≥2 LLM providers en código (gemini + openai + claude + python HTTP)
- [ ] 1 dominio ops (WorkOrder o proposals) en UI
- [ ] 1 dashboard KPI
- [ ] 1 runbook SOP
- [ ] README portfolio sección “AI Operations”

### Ya en repo (P0 parcial)

| Pieza | Path |
|-------|------|
| n8n + ai-python Compose | `docker-compose.yml` (profiles `ops`, `ai-python`) |
| Workflows | `docs/n8n/*.json` |
| OpenAI / Claude / HTTP | `src/services/ai/*` |
| Endpoint n8n → LLM | `POST /api/ai/generate` |
| FastAPI Python | `ai-python/` |

Cuando WorkOrder + KPIs estén, el form del JD se responde con **evidencia en repo**, no solo interés.
