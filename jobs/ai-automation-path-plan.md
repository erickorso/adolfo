# Path IA + automatización — Plan de aprendizaje e implementación

> **Contexto:** sandbox Adolfo + búsqueda laboral remoto (Senior React/Next.js) + curso Microsoft AI Agents ya integrado.  
> **Horizonte:** 12–16 semanas · ~8–10 h/semana  
> **Regla:** cada paso termina con un **entregable verificable** en Adolfo, en GitHub o en tu pipeline de empleo.

---

## Mapa del path (12 pasos)

| # | Paso | Foco | Entregable en Adolfo / portfolio |
|---|---|---|---|
| 1 | Claude Code | IDE agentic (Cursor + Claude) | Skill/hook + doc de workflow |
| 2 | n8n | Automatización visual | Webhook → ingesta jobs / alertas |
| 3 | Perplexity AI Computer | Research agent | Script semanal de ofertas + resumen |
| 4 | OpenAI CLI / API | Assistants, tools, API | Endpoint o action en Adolfo |
| 5 | Manus | Agente autónomo multi-paso | 1 tarea real delegada (research) |
| 6 | Segundo cerebro IA | PKM + RAG personal | Módulo notas / contexto CV-jobs |
| 7 | Prompt engineering | Prompts reutilizables | Librería en `jobs/` + Gemini |
| 8 | Nicho | Posicionamiento | 1 página “pitch” clara |
| 9 | Full-funnel validado | Embudo contenido → lead | Landing + CTA en Adolfo |
| 10 | Cartera de contenido | Demos públicas | 3 piezas (post, demo, repo) |
| 11 | Avatar IA + contenido | Video/voz sintética | 1 clip 60–90 s del sandbox 3D |
| 12 | Prospección en frío | Outreach sistemático | CRM ligero + 20 contactos/semana |

---

## Fase 0 — Base (semana 0, ya hecho / en curso)

- [x] Adolfo deployado (Vercel) + sandbox 3D
- [x] Módulo `/learn/ai-agents` (Microsoft)
- [x] Pipeline empleos: `/jobs`, `/account/applications`, CV Gemini
- [ ] Completar lecciones 0–4 del curso AI Agents (setup → tool use)

---

## Fase 1 — Herramientas agentic (semanas 1–3)

### 1. Aprende Claude Code (semana 1)

**Objetivo:** dominar flujo agentic en Cursor (rules, skills, MCP, terminal).

| Día | Acción |
|---|---|
| 1–2 | Revisar docs Cursor: Agent, Rules, Skills, MCP |
| 3 | Crear/afinar `AGENTS.md` + skill de validación (typecheck/lint) |
| 4 | Automatizar tarea repetitiva: generar `.txt` de cover letters desde plantilla |
| 5 | Entregable: `docs/claude-code-workflow.md` en repo |

**Criterio done:** una feature en Adolfo hecha 80% con agent (ej. progreso lecciones AI Agents).

---

### 2. Aprende n8n (semana 2)

**Objetivo:** automatizar ingesta/alertas sin código pesado.

| Día | Acción |
|---|---|
| 1 | n8n self-host (Docker) o n8n.cloud free tier |
| 2 | Workflow: Remotive API → POST `/api/jobs/ingest` (cron L–V) |
| 3 | Workflow: filtro React/Frontend → email o Telegram |
| 4 | Documentar env vars (`JOBS_INGEST_SECRET`) |
| 5 | Entregable: diagrama + export JSON del workflow en `docs/n8n/` |

**Criterio done:** 1 alerta real recibida con oferta < 24 h de publicada.

---

### 3. Perplexity AI Computer (semana 3)

**Objetivo:** research acelerado (empresas, stacks, salarios).

| Día | Acción |
|---|---|
| 1 | Configurar Perplexity Pro / Computer si aplica |
| 2 | Plantilla prompt: “Remote Senior React EU — company + stack + red flags” |
| 3 | Correr research para 5 empresas de tu pipeline |
| 4 | Volcar resultados en `jobs/progress.md` |
| 5 | Entregable: `jobs/research-template.md` |

**Criterio done:** 5 fichas empresa antes de aplicar (1 página cada una).

---

## Fase 2 — Modelos y agentes (semanas 4–6)

### 4. Despliega OpenAI CLI / API (semana 4)

**Nota:** en la imagen dice “CLM”; interpretación práctica: **OpenAI API + Assistants/tools** (o CLI oficial si usás Codex CLI).

| Día | Acción |
|---|---|
| 1 | API key en `.env` (nunca commitear) |
| 2 | Comparar: Gemini (ya en Adolfo) vs OpenAI para rewrite CV |
| 3 | Opcional: route `/api/ai/openai` con zod + rate limit |
| 4 | Tool calling simple: “extrae skills del JD → JSON” |
| 5 | Entregable: feature flag `OPENAI_API_KEY` en `.env.example` |

**Criterio done:** mismo JD procesado con Gemini y OpenAI; elegir default.

---

### 5. Familiarízate con Manus (semana 5)

**Objetivo:** agente autónomo para tareas multi-paso (research, borradores).

| Día | Acción |
|---|---|
| 1 | Cuenta Manus + 1 tarea guiada |
| 2 | Delegar: “Lista 10 ofertas Remote React publicadas esta semana” |
| 3 | Contrastar output con n8n + Remotive |
| 4 | Documentar cuándo usar Manus vs n8n vs Cursor |
| 5 | Entregable: tabla comparativa en este doc (sección abajo) |

**Criterio done:** 1 informe Manus exportado a `jobs/weekly-research-YYYY-MM-DD.md`.

---

### 6. Segundo cerebro con IA (semana 6)

**Objetivo:** contexto persistente para CV, covers y entrevistas.

| Opción | Stack |
|---|---|
| A (rápida) | Carpeta `jobs/` + Adolfo `/account/applications` + notas por empresa |
| B (RAG) | Embeddings de CV + form-answers + lecciones → búsqueda en UI |
| C (externa) | Obsidian / Notion + sync |

**Implementación mínima en Adolfo (recomendada):**

1. Modelo `UserNote` o ampliar `JobApplication.notes`
2. Página `/account/brain` — notas + tags (empresa, stack, preguntas)
3. Botón “usar contexto en Gemini” al mejorar CV

**Criterio done:** 10 notas estructuradas; 1 apply con cover generada usando ese contexto.

---

## Fase 3 — Skill + posicionamiento (semanas 7–8)

### 7. Prompt engineering (semana 7)

**Objetivo:** librería de prompts versionada, no one-offs.

```
jobs/prompts/
  cover-letter-en.md
  cover-letter-es.md
  jd-analyze.md
  interview-prep.md
  linkedin-outreach.md
```

Cada prompt: rol, contexto, formato salida, límites, ejemplo.

**Integración Adolfo:** leer prompts desde FS en server action (como resume service).

**Criterio done:** 5 prompts documentados + test manual en 3 JD reales.

---

### 8. Encuentra un nicho (semana 8)

**Tu ventaja (Erick):**

| Nicho | Por qué |
|---|---|
| **Senior React/Next.js + dashboards/ag-Grid** | JPM + Krunchbox, pocos lo tienen |
| **Frontend + 3D web (R3F)** | Diferenciador en landings/product |
| **Remote EU desde España** | Legal, timezone, inglés fluido |

**Entregable:** 1 párrafo pitch + headline LinkedIn + pin GitHub `adolfo` + sandbox 3D.

**Evitar:** “full stack genérico”, “React Native sin experiencia”, presencial junior.

---

## Fase 4 — Funnel y contenido (semanas 9–11)

### 9. Reproduce un full-funnel validado (semana 9)

**Modelo simple (validado en dev freelance):**

```
Contenido (LinkedIn/GitHub)
    → Demo live (Adolfo /sandbox/3d o /jobs)
        → CTA (DM / email / calendly)
            → Call → propuesta
```

**En Adolfo:**

- Landing `/es` o sección hero con CTA claro
- UTM en links de LinkedIn
- Track clicks (opcional: evento simple en DB)

**Criterio done:** 1 post con link demo + 1 conversación iniciada.

---

### 10. Cartera de contenido enfocada (semana 10)

**3 piezas mínimas:**

| # | Pieza | Canal |
|---|---|---|
| 1 | “Cómo hice Pluvia responsive con 100k filas” (thread/post) | LinkedIn |
| 2 | Demo GIF sandbox 3D video tour | GitHub README + LinkedIn |
| 3 | Repo público `erickorso/erickorso` profile README | GitHub |

**Cadencia:** 1 pieza cada 3–4 días durante 2 semanas.

---

### 11. Avatar IA + contenido (semana 11)

**Objetivo:** video corto sin grabar studio.

| Herramienta | Uso |
|---|---|
| HeyGen / Synthesia / D-ID | Avatar + script |
| ElevenLabs | Solo voz EN para intro |

**Script (60 s):** quién sos → stack → demo Adolfo 3D → CTA remoto EU.

**Criterio done:** 1 video publicado (LinkedIn o GitHub profile).

---

## Fase 5 — Prospección (semana 12+)

### 12. Sistema de prospección en frío (ongoing)

**Stack ligero (sin over-engineering):**

| Componente | Herramienta |
|---|---|
| Lista targets | `jobs/progress.md` + spreadsheet |
| Research | Perplexity + LinkedIn |
| Mensaje | Plantillas `linkedin-apply.md` |
| Follow-up | n8n reminder o calendario |
| Métricas | Tabla semanal en progress.md |

**Ritmo semanal:**

| Día | Meta |
|---|---|
| Lun | 5 empresas research + actualizar pipeline |
| Mar–Jue | 5 outreach/día (recruiter o hiring manager) |
| Vie | 2–3 applies quality (Remotive, EuropeRemotely, Get on Board) |
| Dom | 1 post contenido (opcional) |

**Plantilla outreach (EN):**

```
Hi [Name] — I'm a Senior Frontend Lead (React/Next.js, 14+ yrs, ex-JPMorgan).
I saw [Company] is hiring for [Role]. Happy to share a 2-min demo:
https://adolfo-nine.vercel.app/es/sandbox/3d
Open to remote from Spain. Worth a quick chat?
```

**Criterio done:** 20 contactos/semana × 4 semanas; ≥10% respuesta o ≥2 screens.

---

## Comparativa rápida de herramientas (paso 5)

| Tarea | Cursor/Claude | n8n | Manus | Perplexity |
|---|---|---|---|---|
| Codificar feature Adolfo | ✅ | ❌ | ❌ | ❌ |
| Cron ingest jobs | ⚠️ | ✅ | ❌ | ❌ |
| Research empresa | ⚠️ | ❌ | ✅ | ✅ |
| Cover letter 1-off | ✅ | ❌ | ✅ | ⚠️ |
| Cold email batch | ❌ | ✅ | ✅ | ❌ |

---

## Orden recomendado vs imagen original

La imagen lista 1→12 lineal. **Ajuste para tu situación:**

1. **Primero:** 7 (prompts) + 8 (nicho) — aceleran todo lo demás  
2. **Paralelo:** curso AI Agents (Microsoft) + pasos 1–2  
3. **Después:** 9–12 cuando tengas demo + pitch claros  

```
Semanas 1–3:  1, 2, 3 + AI Agents L0–6
Semanas 4–6:  4, 5, 6 + AI Agents L7–12
Semanas 7–8:  7, 8
Semanas 9–12: 9, 10, 11, 12
```

---

## Próximos módulos Adolfo (backlog)

| Módulo | Path | Prioridad |
|---|---|---|
| Progreso lecciones AI Agents | `/learn/ai-agents` + DB | Alta |
| n8n webhook docs | `docs/n8n/` | Alta |
| Segundo cerebro | `/account/brain` | Media |
| OpenAI provider alternativo | `/api/ai/` | Media |
| Landing funnel CTA | `/` hero | Media |

---

## Métricas (actualizar viernes)

| Semana | Lecciones AI | n8n flows | Outreach | Applies | Respuestas |
|---|---|---|---|---|---|
| 1 | | | | | |
| 2 | | | | | |

---

*Creado: 2026-06-20 · Proyecto Adolfo · erickorso@gmail.com*
