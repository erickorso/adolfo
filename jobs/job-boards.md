# Job boards — remoto (fuera de LinkedIn/Indeed)

> Perfil: **Senior React/Next.js**, remoto, EU/LATAM/Global · base **España**  
> Actualizado: **2026-07-19** · Búsqueda activa reiniciada (ver `progress.md`)

---

## Resumen rápido

| Acción | Portales |
|--------|----------|
| **Activo hoy** | Landbot (applied 19 jul) · rutina LinkedIn + Get on Board + EuropeRemotely + Remotive |
| **Ya usados (histórico)** | Get on Board, Remotive, Workable, empleo.qindel.com, LinkedIn inbound |
| **Ingesta automática en Adolfo** (`/es/jobs`) | Remotive, RemoteOK, Arbeitnow, Hacker News, Greenhouse |
| **Explorar próxima tanda** | EuropeRemotely, Dynamite Jobs, Wellfound, WWR, Built In, Remote 100k |
| **Evitar / baja prioridad** | GitHub Jobs (cerrado 2017), RezPass (pago — revisar antes) |

---

## Portales usados — detalle

| Portal | URL | Región | Cómo aplicar | Estado | Notas |
|--------|-----|--------|--------------|--------|-------|
| **Get on Board** | https://www.getonbrd.com | LATAM + ES + US | Formulario en portal | **Activo** — 8 applies (jun 2026) | Mejor fit LATAM remoto desde España. Filtros: Programming, Remote, React |
| **Remotive** | https://remotive.com | Global remote | Web + ingesta Adolfo | **Activo** — Lemon.io apply | API pública → `/api/jobs/ingest`. Filtro Dev / React |
| **LinkedIn** | https://linkedin.com | Global | Easy Apply + DM recruiters | **Activo** — inbound Thaloz | Ver `linkedin-apply.md`, `linkedin-outreach-short.txt` |
| **Workable** | https://apply.workable.com | Global (ATS) | Link directo empresa | **1 apply** — Intellectsoft | Portal embebido por empresa |
| **Qindel empleo** | https://empleo.qindel.com | España (A Coruña) | Web empresa | **1 apply** — Tech Lead React | Híbrido/presencial posible — revisar remoto |
| **Indeed** | https://es.indeed.com | Global | Web | Sin applies recientes | Backup; más ruido que nichos |

### Get on Board — applies registrados

| Empresa | Rol | Fecha | Estado |
|---------|-----|-------|--------|
| Improving South America | React SSR Adv | 2026-06-25 | `applied` |
| **Mediastream** | Full-Stack Senior (Analytics) | 2026-06-25 | **`tech`** — entrevista 6 jul |
| Blazestack | Senior Frontend L5/L6 | 2026-06-25 | `applied` |
| Sanctuary Computer / garden3d | Senior Frontend | 2026-06-25 | `applied` |
| 2BRAINS (Acid Labs) | Frontend / Full-Stack | 2026-06-25 | `applied` |
| BuildWithin | Frontend / SW Engineer | 2026-06-25 | `applied` |
| Verve IT | Mid Full-Stack | 2026-06-25 | `applied` |

Respuestas formulario: [`form-answers.md`](./form-answers.md)

---

## Ingesta automática (app Adolfo)

| Fuente | URL feed / API | En `/es/jobs` | Comando |
|--------|----------------|---------------|---------|
| **Remotive** | https://remotive.com/api/remote-jobs | Sí | `npm run jobs:ingest` |
| **RemoteOK** | https://remoteok.com/api | Sí | idem |
| **Arbeitnow** | https://arbeitnow.com/api/job-board-api | Sí | idem (EU remoto) |
| **Hacker News Jobs** | https://hnrss.org/jobs.jsonfeed (+ Firebase fallback) | Sí | idem (cron semanal Vercel) |
| **Greenhouse** | boards por empresa (`JOBS_GREENHOUSE_BOARDS` o defaults) | Sí | gitlab, figma, vercel, discord, stripe |

Keywords ingest: React, Next.js, TypeScript, frontend, full stack, tech lead — ver `src/services/jobs/job-ingest.config.ts`.

---

## Portales recomendados — lista Michael Lykins + video (jun 2026)

Prioridad exploración: **Senior React/Next**, remoto, EU/Global desde España.

| # | Portal | URL | Región / fit | Tipo | Prioridad | Notas |
|---|--------|-----|--------------|------|-----------|-------|
| 1 | **EuropeRemotely** | https://europeremotely.com | **EU remoto** | Curated | **Alta** | Mejor fit legal/timezone desde España |
| 2 | **Remotive** | https://jobs.remotive.io | Global | Agregador | **Alta** | Ya integrado en app |
| 3 | **Dynamite Jobs** | https://dynamitejobs.com | Remote-first | Curated | **Alta** | Filtros por stack |
| 4 | **We Work Remotely** | https://weworkremotely.com | Global | Clásico remote | **Alta** | Programming → Front-End |
| 5 | **Wellfound** | https://wellfound.com | US/LATAM startups | Startup jobs | **Media** | Antes AngelList Talent |
| 6 | **RemoteOK** | https://remoteok.com | Global | Agregador | **Media** | Mucho volumen; filtrar senior |
| 7 | **Built In** | https://builtin.com | US hubs + algo EU | Tech hubs | **Media** | Empresas medianas/grandes |
| 8 | **Remote 100k** | https://remote100k.com | Global $100k+ | Senior/lead | **Media** | Verificar elegibilidad España |
| 9 | **Career Hound** | https://careerhound.io | Global | Agregador | **Media** | Multi-board search |
| 10 | **Jobspresso** | https://jobspresso.co | Global | Curated | **Media** | |
| 11 | **Otta** | https://otta.com | UK/EU/US | Curated | **Media** | Buen UX, roles quality |
| 12 | **Hacker News Jobs** | https://news.ycombinator.com/jobs | US/YC | Startups | **Media** | Ya ingesta Adolfo; muchos on-site SF |
| 13 | **SkipTheDrive** | https://skipthedrive.com | US-centric | WFH clásico | Baja | |
| 14 | **Pangian** | https://pangian.com | Global | Comunidad + jobs | Baja | |
| 15 | **Outsourcely** | https://outsourcely.com | Global | Freelance long-term | Baja | |
| 16 | **Virtual Vocations** | https://virtualvocations.com | US | Remoto verificado | Baja | |
| 17 | **CloudPeeps** | https://cloudpeeps.com | Global | Freelance | Baja | |
| 18 | **GitHub Jobs** | https://jobs.github.com | — | **Cerrado 2017** | — | Usar [GitHub Careers](https://github.com/about/careers) |

### Herramientas (no son job boards)

| Herramienta | URL | Notas |
|-------------|-----|-------|
| RezPass | https://rezpass.com | Apply helper — revisar antes de pagar |
| Build Your Own X | https://github.com/codecrafters-io/build-your-own-x | Tutoriales portfolio — ver [`build-your-own-x-resources.md`](./build-your-own-x-resources.md) |

---

## Staffing LATAM → US (canal aparte)

| Empresa | URL | Notas |
|---------|-----|-------|
| Thaloz | https://www.thaloz.com | Inbound Nayla (abr 2026) — **reactivar** |
| BairesDev | https://www.bairesdev.com | Staff aug |
| Globant | https://www.globant.com | Enterprise |
| Toptal | https://www.toptal.com | Screening duro |

---

## Rutina sugerida (2×/semana)

1. **Get on Board** + **EuropeRemotely** + **Remotive** — 2–3 applies quality
2. Revisar **`/es/jobs`** en Adolfo (ingesta fresca)
3. Anotar en [`progress.md`](./progress.md)
4. Alertas email/RSS donde existan

## Búsquedas útiles (todos los portales)

```
React
Next.js
Frontend
Senior Frontend
TypeScript
Frontend Lead
Full Stack
```

## Links de búsqueda directa

| Portal | Query sugerida |
|--------|----------------|
| Get on Board | https://www.getonbrd.com/jobs?query=react&remote=true |
| Remotive | https://remotive.com/remote-jobs/software-development |
| Wellfound | https://wellfound.com/jobs?roles=Frontend+Developer |
| WWR | https://weworkremotely.com/categories/remote-programming-jobs |
| EuropeRemotely | https://europeremotely.com/?search=react |

---

*Fuentes: video Michael Lykins (jun 2026) · lista Wellfound/WWR/Built In/Remote 100k (2026-07-03) · pipeline real en `progress.md`*
