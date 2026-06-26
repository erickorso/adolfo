# Plan Verve IT — MSP SaaS + IA integrada

> Objetivo: demostrar en portfolio **todo lo que prometiste** en la postulación a Verve IT y convertirte en referencia en **IA integrada en apps productivas** (no solo prompts sueltos).
>
> **Proyecto demo:** [`../projects/msp-time-review/`](../projects/msp-time-review/) (monorepo a crear)  
> **Referencia oferta:** [Verve IT · Full-Stack · Get on Board](https://www.getonbrd.com/jobs/programming/mid-level-full-stack-developer-verve-it-remote)

---

## Decisión de stack (dos demos)

| Demo | ORM + Auth | Para qué |
|---|---|---|
| **MSP Time Review** (`projects/msp-time-review/`) | **Drizzle + NextAuth** | SaaS multi-tenant · Stripe · IA · stack cercano a Verve IT |
| **Adolfo** (repo raíz) | **Prisma + NextAuth** | E-commerce, jobs kanban, Ualá — otro demo, no mezclar |

**Prisma** y **Better Auth** se dejan para otros demos / si la oferta lo exige en entrevista.  
NextAuth + `tenantId` en sesión alcanza para multi-tenant en el MSP demo.

**¿Cuándo sí migrar a Better Auth?** Solo si necesitás org/memberships/SSO Entra out-of-the-box como Verve IT — no es bloqueante para el portfolio.

---

## Qué pide Verve IT vs qué vas a construir

| Requisito Verve IT | En tu cover letter | Entregable en el proyecto |
|---|---|---|
| Next.js en Vercel | ✅ | App `apps/web` — App Router, Server Components, API routes |
| TypeScript end-to-end | ✅ | TS strict en web + contratos OpenAPI compartidos |
| Postgres + ORM | Adolfo usa Prisma → **Drizzle solo en MSP demo** | Schema multi-tenant, migraciones, queries optimizadas |
| Multi-tenant + auth | **NextAuth** (mismo que Adolfo) | Google OAuth + `organizationId` en sesión + aislamiento por tenant |
| Stripe | Ualá en Adolfo → **Stripe en MSP demo** | Suscripción por tenant, webhooks |
| Integraciones API externas | ✅ | Mock **ConnectWise** + webhooks entrantes |
| Servicios IA internos | Parcial (UI asistente Krunchbox) | **2 microservicios IA** (Python + Java) |
| CI/CD + prod | GitHub Actions en Adolfo | Deploy Vercel + pipelines + smoke tests |
| Async / ownership E2E | ✅ | Features completas: UI → API → DB → IA → billing |

---

## Nombre y concepto del proyecto

**MSP Time Review** — SaaS multi-tenant que ayuda a MSPs a **revisar entradas de tiempo** antes de facturar: detecta inconsistencias, categorías dudosas y texto poco claro usando IA.

Dominio real (como Verve IT), acotado para portfolio:

1. Técnico importa time entries desde ConnectWise (mock).
2. Usuario revisa lista + detalle en Next.js.
3. Botón **“AI Review”** llama al servicio IA (Python *o* Java, configurable).
4. Respuesta estructurada: score, flags, sugerencia de corrección, reasoning breve.
5. Auditoría guardada en Postgres por tenant.

---

## Arquitectura propuesta

```
projects/msp-time-review/
├── apps/
│   └── web/                 # Next.js 16 · Vercel
├── packages/
│   ├── db/                  # Drizzle schema + migrations
│   ├── auth/                # NextAuth config (copiar/adaptar de Adolfo)
│   └── contracts/           # OpenAPI / Zod schemas compartidos
├── services/
│   ├── ai-python/           # FastAPI · OpenAI/Gemini · LangGraph opcional
│   └── ai-java/             # Spring Boot 3 · mismo contrato REST
├── integrations/
│   └── connectwise-mock/    # API fake + seed de time entries
├── docker-compose.yml       # Postgres + ai-python + ai-java
└── README.md
```

### Flujo de IA (comparación Python vs Java)

```
[Next.js API route] ──POST /api/time-entries/:id/review──►
        │
        ├── AI_PROVIDER=python ──► http://ai-python:8000/v1/review
        └── AI_PROVIDER=java   ──► http://ai-java:8080/v1/review
                    │
                    ▼
            { score, flags[], suggestion, model, latencyMs }
                    │
                    ▼
            Persist en `ai_reviews` (tenantId, provider, payload)
```

**¿Python + Java para comparar?** Sí, tiene sentido para portfolio:

| Criterio | Python (`ai-python`) | Java (`ai-java`) |
|---|---|---|
| Velocidad de iterar prompts | ⭐⭐⭐ | ⭐⭐ |
| Ecosistema LLM (SDKs, LangGraph) | ⭐⭐⭐ | ⭐⭐ |
| Tipado/contratos en enterprise | ⭐⭐ | ⭐⭐⭐ |
| Latencia cold start (serverless) | Mejor en always-on container | JVM warmup |
| Fit con equipos MSP/enterprise US | Común en data/ML | Común en backends corporativos |

**Regla:** mismo **contrato OpenAPI** (`POST /v1/review`), mismos tests de golden files, métricas en tabla `ai_reviews` para comparar latencia/calidad/costo.

---

## Roadmap por fases (12 semanas · ~8–10 h/semana)

### Fase 0 — Setup (Semana 1)

- [ ] Crear monorepo `projects/msp-time-review/` (Turborepo opcional).
- [ ] Postgres local + Drizzle + primera migración (`tenants`, `users`, `memberships`).
- [ ] README con `docker compose up` y `.env.example`.
- [ ] Copiar patterns de Adolfo: ESLint, Vitest, Playwright, **NextAuth** (adaptar a Drizzle).

**Criterio de done:** `npm run dev` levanta web + DB; health check OK.

---

### Fase 1 — Multi-tenant + NextAuth (Semanas 2–3)

- [ ] NextAuth: login Google + sesión (reutilizar setup de Adolfo).
- [ ] Modelo `organization` / `tenantId` en Drizzle + tabla `memberships`.
- [ ] Extender sesión JWT con `activeOrganizationId`.
- [ ] Middleware: aislar datos por tenant (row-level en queries).
- [ ] UI: switch de org + settings básicos.

**Skills:** auth SaaS, SSO, tenant isolation (crítico en Verve IT).

**Criterio de done:** Usuario A no ve time entries de Usuario B (otro tenant). E2E Playwright.

---

### Fase 2 — Core producto sin IA (Semanas 4–5)

- [ ] Tablas: `time_entries`, `projects`, `technicians` (mock ConnectWise IDs).
- [ ] Mock ConnectWise: `POST /sync` importa CSV/JSON seed.
- [ ] UI: lista filtrable, detalle, estados (`pending`, `approved`, `flagged`).
- [ ] API routes REST + validación Zod.

**Criterio de done:** Import → listar → aprobar manualmente. Tests de integración API.

---

### Fase 3 — Stripe (Semana 6)

- [ ] Planes: Free (50 reviews/mo) · Pro (ilimitado).
- [ ] Checkout + Customer Portal.
- [ ] Webhook `invoice.paid` / `subscription.updated`.
- [ ] Guard en API: límite por plan.

**Criterio de done:** Upgrade en Stripe sandbox refleja límites en app.

---

### Fase 4 — IA Python (Semanas 7–8)

- [ ] FastAPI + Pydantic: `POST /v1/review`.
- [ ] Prompt versionado en `prompts/v1.yaml` (git-tracked).
- [ ] Salida **JSON estricta** (structured output / response schema).
- [ ] Next.js: selector env `AI_PROVIDER=python`.
- [ ] Logging: `model`, `tokens`, `latencyMs`, `promptVersion`.

**Stack IA Python sugerido:**

- FastAPI + httpx
- OpenAI **o** Gemini (elige uno primero; abstracción `LLMProvider`)
- LangGraph **solo si** necesitas multi-step (clasificar → explicar → sugerir); empieza con 1 call

**Criterio de done:** 10 time entries de prueba → reviews consistentes; golden tests.

---

### Fase 5 — IA Java (Semanas 9–10)

- [ ] Spring Boot 3 + WebClient al mismo LLM.
- [ ] Mismo OpenAPI generado desde `packages/contracts`.
- [ ] Feature flag `AI_PROVIDER=java`.
- [ ] Benchmark script: 50 reviews × Python vs Java → CSV comparativo.

**Stack IA Java sugerido:**

- Spring Boot 3 + Java 21
- Spring AI (OpenAI/Gemini adapters) **o** REST directo al API
- Mismos golden tests (JUnit) importando fixtures JSON

**Criterio de done:** Tabla/dashboard interno “Python vs Java” con latencia p50/p95 y coste estimado.

---

### Fase 6 — Producción (Semanas 11–12)

- [ ] Deploy web en **Vercel** (Preview + Production).
- [ ] Postgres: Neon/Supabase.
- [ ] AI services: Railway/Fly.io (containers always-on).
- [ ] GitHub Actions: lint, typecheck, test, migrate, deploy.
- [ ] Sentry o similar + health endpoints.
- [ ] README público + demo GIF + post LinkedIn.

**Criterio de done:** URL pública + video 2 min mostrando flujo completo.

---

## Plan para volverte pro en IA integrada en apps

> No es “saber usar ChatGPT”. Es **diseñar, operar y medir** IA dentro de un producto.

### Nivel 1 — Fundamentos (Semanas 1–4, en paralelo al proyecto)

| Tema | Acción concreta | Recurso |
|---|---|---|
| Prompt engineering estructurado | System + user + JSON schema; versionar prompts | OpenAI / Gemini docs · *Prompt Engineering Guide* |
| APIs LLM | Streaming vs complete; retries; timeouts | Implementar en `ai-python` primero |
| Coste y límites | Calcular $/1k reviews; rate limit por tenant | Hoja en Notion + campo en DB |
| Seguridad | No loguear PII; redactar nombres clientes en prompts | Checklist pre-prod |

### Nivel 2 — Integración producto (Semanas 5–8)

| Tema | Acción concreta |
|---|---|
| Contratos estables | OpenAPI + Zod; breaking changes = version bump |
| UX de IA | Loading states, streaming opcional, “retry”, explicabilidad |
| Fallbacks | Si IA falla → reglas heurísticas + cola retry |
| Evaluación | 20 casos golden + score humano 1–5; iterar prompt |
| Observabilidad | `latencyMs`, `tokens`, `provider`, `promptVersion` por request |

### Nivel 3 — Sistemas (Semanas 9–12)

| Tema | Acción concreta |
|---|---|
| Multi-step agents | LangGraph (Python): clasificar entry → generar sugerencia |
| RAG (opcional fase 2) | Embeddings de políticas MSP del tenant → contexto en review |
| Comparación runtimes | Python vs Java bajo misma carga (script benchmark) |
| Compliance mindset | Audit log inmutable; quién aprobó qué IA sugirió |

### Nivel 4 — Senior / entrevista (post-proyecto)

- [ ] Artículo corto: *“Building MSP Time Review: dual AI backends in Python and Java”*.
- [ ] Slide de arquitectura para entrevistas Verve IT / similar.
- [ ] Respuesta preparada: *“When would I pick Python vs Java for AI inference?”* con datos del benchmark.

---

## Ritmo semanal sugerido

| Día | Bloque | Horas |
|---|---|---|
| Lun | Teoría IA (1h) + issue del proyecto (1h) | 2h |
| Mar–Jue | Implementación feature activa | 2h/día |
| Vie | Tests + doc + commit | 2h |
| **Total** | | **~10h/semana** |

---

## Métricas de progreso (tracker)

| Semana | Fase | Demo grabable | LinkedIn |
|---|---|---|---|
| W1 | Setup | DB + login local | — |
| W3 | Auth multi-tenant | Switch org | — |
| W5 | Time entries | Import + approve | — |
| W6 | Stripe | Upgrade plan | — |
| W8 | IA Python | AI Review end-to-end | Post borrador |
| W10 | IA Java | Benchmark publicado | Post benchmark |
| W12 | Prod | URL live | Post launch |

Actualizar también [`progress.md`](./progress.md) cuando cierres cada fase.

---

## Enlaces internos

| Archivo | Uso |
|---|---|
| [`form-answers.md`](./form-answers.md) | Cover letter Verve IT |
| [`../projects/msp-time-review/`](../projects/msp-time-review/) | Código del demo (crear en Fase 0) |
| Adolfo (`/`) | Demo **Prisma + NextAuth** — copiar auth y CI; ORM distinto (Drizzle) |

---

## Decisión: ¿Python + Java?

**Sí — con un límite claro:**

1. **Primero Python** hasta que el flujo producto funcione (Fases 0–4).
2. **Después Java** como drop-in con mismo contrato (Fase 5).
3. No dupliques lógica de negocio en ambos; solo **adaptador IA + HTTP**.

Así demuestras breadth (full-stack + polyglot) sin duplicar el 80% del SaaS.

---

## Próximo paso inmediato

```bash
mkdir -p projects/msp-time-review
cd projects/msp-time-review
# Fase 0: npx create-next-app@latest apps/web --typescript --app --tailwind
# + docker compose con Postgres
```

Cuando quieras, arrancamos **Fase 0** en el repo y scaffold del monorepo.
