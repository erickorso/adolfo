# Mediastream — Plan de prep (entrevista + prueba técnica)

> **Rol:** Desarrollador Full-Stack Senior · equipo **Analytics** · remoto  
> **Contacto:** Inti Vargas (`ivargas@mediastre.am`)  
> **JD:** `jobs/mediastream-full-stack-senior.md` · respuestas: `jobs/form-answers.md` (sección Mediastream)

---

## Fechas clave

| Evento | Cuándo | Hora |
|--------|--------|------|
| **Entrevista virtual (30 min)** | **Lunes 6 jul 2026** | **11:00 Chile** = **17:00 España (CEST)** |
| **Prueba técnica (1 h)** | Tras entrevista o async (confirmar con Inti) | Bloquear 1 h sin interrupciones |

**Checklist día D (lunes):**
- [ ] Link Zoom/Meet probado 15 min antes
- [ ] Cámara, mic, auriculares
- [ ] Agua, cuaderno, segunda pantalla si tenés
- [ ] Repo limpio + Node 20 + `npm run dev` probado por si piden compartir pantalla
- [ ] Pitch de 2 min en inglés ensayado (ver abajo)

---

## Objetivo del proceso

Mediastream Analytics busca alguien que entregue **end-to-end**:

```
eventos / ingesta → pipeline → API Node.js → DB (SQL/NoSQL) → dashboard React
```

Tu ventaja: **14+ años**, **Pluvia/ag-Grid/SSRM**, **JPM dashboards**, **Spark AMC+** (media/streaming).  
Tu gap a preparar: **pipelines/Kafka**, **Node puro** (no solo Next.js), **MongoDB en profundidad**.

---

## Calendario de estudio (vie 4 → dom 6)

### Viernes 4 jul (~2 h) — Narrativa + gaps

| Bloque | Tiempo | Qué hacer |
|--------|--------|-----------|
| Pitch + historia Pluvia | 45 min | Ensayar en voz alta (ES + EN). Usar texto de `form-answers.md` |
| Mapa de gaps | 30 min | Leer sección “Gaps” abajo; anotar respuestas honestas |
| Empresa | 45 min | [mediastre.am](https://www.mediastre.am/) · productos OTT, Live, Audience, MoAI |

### Sábado 5 jul (~4 h) — Simulacro fullstack

| Bloque | Tiempo | Qué hacer |
|--------|--------|-----------|
| **Simulacro 1** | 60 min | Ejercicio A (API + dashboard) — cronometrar |
| Descanso + review | 30 min | Qué falló, qué repetir |
| SQL + agregaciones | 90 min | Ejercicio B — queries + índices |
| Node.js repaso | 60 min | Express mínimo, validación Zod, paginación, errores |

### Domingo 6 jul (~3 h) — Pulido + descanso

| Bloque | Tiempo | Qué hacer |
|--------|--------|-----------|
| **Simulacro 2** | 60 min | Ejercicio C (diseño pipeline + código parcial) |
| Cheat sheet | 45 min | Escribir a mano: SSRM, SQL patterns, API contract |
| Mock entrevista | 45 min | 5 preguntas difíciles (abajo) — respuestas cortas |
| **Tarde libre** | — | No estudiar después de las 20:00 |

### Lunes 6 jul (mañana, ~1 h)

- Repaso cheat sheet 20 min
- Pitch 2 min × 2
- Comida ligera antes de las 17:00
- Entrevista 17:00 → anotar instrucciones exactas de la prueba

**Total estimado:** ~10 h

---

## Pitch 2 min (inglés — entrevista)

```
I'm Erick, Senior Frontend Lead with 14+ years in React and TypeScript, based in Spain, fully remote.

Most recently at Krunchbox I architect Pluvia, a B2B retail analytics product—100k+ rows per view with ag-Grid Server-Side Row Model, stable API contracts with the backend, and sub-300ms filter UX. Before that, two years at J.P. Morgan on financial dashboards, and Spark Digital on AMC+ and Dow Jones—media and high-traffic frontends.

I'm strongest where React meets analytics: turning complex consumption or business data into clear, performant UIs. I also ship Node APIs, PostgreSQL, testing, and CI/CD. I'm excited about Mediastream because you combine OTT/streaming with audience intelligence—that's the same intersection I've been working in, at product scale.

I'm happy to go deeper on architecture, team leadership, or hands-on code.
```

---

## Formato probable de la prueba (1 h)

Basado en el JD y equipo Analytics. Prepararse para **una o combinación** de:

| Tipo | Probabilidad | Qué evalúan |
|------|--------------|-------------|
| **A. API Node + UI React** | Alta | REST, paginación, filtros, tabla/gráfico simple |
| **B. SQL / modelado analítico** | Alta | Aggregations, time-series, índices, EXPLAIN |
| **C. Diseño pipeline** | Media | Diagrama + pseudocódigo: eventos → cola → agregación → API |
| **D. Take-home async** | Media | Mismo stack, 24–48 h (instrucciones en entrevista) |

No asumir solo frontend. El rol pide **Node + datos + React**.

---

## Simulacros (hacer en sábado y domingo)

### Ejercicio A — “Streaming metrics API” (60 min)

**Enunciado inventado (mismo espíritu que Mediastream):**

> Dado un CSV/JSON de eventos `play` (`userId`, `contentId`, `timestamp`, `durationSec`, `country`), implementar:
> 1. API Node/Express: `GET /metrics/top-content?from=&to=&limit=`
> 2. React: tabla top 10 + total plays
> 3. Paginación y filtro por país

**Entregables mínimos:**
- Validación de query params
- Agregación en memoria o SQL
- Componente React con loading/error states
- 1 test (API o componente)

**Stack sugerido para practicar:** Express + Zod + React (o Next API route si preferís).

---

### Ejercicio B — SQL analítico (45 min)

Dataset mental: `events(id, user_id, content_id, event_type, created_at, country_code)`.

Escribir y explicar:

```sql
-- Top 5 contenidos por plays últimos 7 días
-- Plays por hora (time-series)
-- Usuarios únicos por país
-- Índice recomendado para from/to + content_id
```

Repasar: `GROUP BY`, `DATE_TRUNC`, window functions (`ROW_NUMBER`), índices compuestos.

---

### Ejercicio C — Pipeline (45 min)

**Enunciado:** 10M eventos/día de reproducción. Dashboard near-real-time (retraso < 5 min).

Dibujar y explicar en 10 min:

```
[Player/SDK] → [Ingest API] → [Kafka topic] → [Consumer/aggregator] → [Postgres/Mongo] → [API] → [React]
```

Preguntas que debés poder responder:
- ¿Por qué cola (Kafka) vs escribir directo a DB?
- ¿Dónde pre-agregar (por hora/content)?
- ¿Idempotencia del consumer?
- ¿Qué mostrar en UI si el pipeline va 2 min atrasado?

**Tu ángulo honesto:** “No operé Kafka en prod; entiendo el patrón pub/sub, lo relaciono con webhooks + workers + materialized views en Postgres.”

---

## Cheat sheet (memorizar conceptos, no código literal)

### Pluvia / SSRM (tu historia estrella)

- Problema: 100k+ filas, browser freeze
- Solución: ag-Grid SSRM, contrato API (filters, sort, cursor)
- Cache corta por combinación de filtros
- Resultado: <300 ms filtros típicos
- Hoy haría: observabilidad, materialized views, contract tests desde día 1

### API analítica — contrato típico

```
GET /data?filters[]=...&sort=field:asc&page=1&pageSize=50
→ { rows, total, meta: { queryMs } }
```

### Node.js — checklist rápido

- `express.Router()`, middleware de error centralizado
- Validación entrada (Zod)
- Paginación offset vs cursor (cursor mejor para feeds grandes)
- No bloquear event loop (delegar agregaciones pesadas a DB/worker)

### PostgreSQL vs MongoDB (para la entrevista)

| | Postgres | MongoDB |
|---|----------|---------|
| Fuerte en | joins, agregaciones SQL, time-series con `date_trunc` | documentos flexibles, nested metrics |
| Tu experiencia | **Alta** (Prisma, Krunchbox, Adolfo) | **Media-baja** — proyectos puntuales |
| Frase honesta | “SQL es mi día a día; Mongo lo uso para esquemas flexibles de eventos/metadata.” |

### Kafka (nice to have)

- Topic → partitions → consumer groups
- At-least-once + idempotent consumer
- Alternativa que sí conocés: **webhook → queue (SQS/Bull) → worker → DB**

---

## Preguntas difíciles — respuestas cortas

**1. Tenés 10 años full-stack y 5 en analytics; ¿cómo lo justificás?**  
> 14 años total. Analytics fuerte desde Krunchbox/Pluvia (BI retail, ag-Grid, KPIs) + JPMorgan dashboards + Spark media metrics. Frontend-heavy pero con contrato API y modelado de datos.

**2. ¿Experiencia con pipelines de eventos?**  
> SSRM + APIs de agregación en Pluvia; ingesta vía integraciones REST. No Kafka en prod; entiendo arquitectura event-driven y la aplicaría con colas + workers.

**3. ¿Por qué Mediastream y no solo frontend lead?**  
> Quiero el cruce streaming + audience data end-to-end. Ya trabajé media (AMC+); me motiva bajar al backend de métricas, no solo la UI.

**4. ¿MongoDB?**  
> Conocimiento funcional; producción fuerte en PostgreSQL. Cómodo con document model para eventos y denormalized read models.

**5. ¿Salario / residencia?**  
> Basado en España, remoto. Expectativas alineadas al mercado LATAM/EU senior; flexible según paquete (salud, equipo, etc.). Argentina residente, temporalmente en España.

---

## Gaps — cómo cubrirlos sin mentir

| Gap | Nivel real | Qué decir / hacer en la prueba |
|-----|------------|--------------------------------|
| Kafka | Teórico | Diagrama + consumer idempotente; mencionar Bull/SQS como analogía |
| Node sin Next | Medio | Simulacro Express puro el sábado |
| MongoDB | Bajo-medio | Repasar aggregation pipeline `$match $group $sort` (1 h domingo) |
| 10y FS formal | Stretch | Enfatizar fullstack delivery (API + UI + DB) en proyectos |
| Título universitario | Verificar JD | Tener dato a mano si preguntan |

---

## Repo / portfolio para mencionar

- **Adolfo:** Next.js 16, Prisma, Postgres, API routes, i18n, deploy Vercel  
  https://github.com/erickorso/adolfo · https://adolfo-nine.vercel.app  
- **Pluvia/Krunchbox:** SSRM, analytics (sin repo público — explicar en entrevista)  
- **Spark AMC+:** media/streaming, responsive, alto tráfico

---

## Después de la entrevista (lunes noche)

- [ ] Anotar formato exacto de la prueba (sync 1 h vs take-home)
- [ ] Pedir stack permitido (Express vs Fastify, ORM, SQL en vivo)
- [ ] Actualizar `jobs/progress.md` → estado `screen` o `tech-test`
- [ ] Si es take-home: bloquear calendario y copiar enunciado a este archivo

---

## Recursos rápidos

- [Mediastream](https://www.mediastre.am/)
- [Get on Board JD](https://www.getonbrd.com/jobs/programming/desarrollador-full-stack-senior-mediastream-remote)
- MongoDB aggregation: [docs.mongodb.com/manual/aggregation](https://www.mongodb.com/docs/manual/aggregation/)
- ag-Grid SSRM: ya lo viviste en Pluvia — repasar docs 15 min
- **Build Your Own X** (tutoriales hands-on): [`build-your-own-x-resources.md`](./build-your-own-x-resources.md) — DB, Redis, Kafka-like, HTTP/Node

---

*Creado: 2026-07-03 · Revisar tras entrevista del lunes.*
