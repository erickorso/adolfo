# Simulacro A — Streaming metrics API (60 min)

> Prep Mediastream · equipo Analytics · **cronometrar de punta a punta**

## ¿Next.js o Express aparte?

| | Next.js (Adolfo) | Express standalone |
|---|------------------|-------------------|
| **Para practicar** | ✅ Ideal — ya tenés el repo | Opcional |
| **En la prueba real** | Preguntar — muchas empresas aceptan Next API routes | JD dice Node.js; Express es el “default” mental del evaluador |
| **Diferencia real** | `route.ts` export `GET` vs `app.get()` | Misma lógica de negocio, Zod, agregación |

**Conclusión:** practicá en **Next.js** (`/api/metrics/top-content` + página sandbox). Si en la prueba piden Express, copiás la misma función `aggregateTopContent` a un `app.get()` — 10 min de adaptación.

---

## Enunciado

Dataset: `src/data/streaming/playback-events.json`

Cada evento `play`:

```json
{ "userId", "contentId", "timestamp", "durationSec", "country" }
```

Implementar:

1. **API** `GET /api/metrics/top-content`
   - Query: `from`, `to` (ISO date), `country?`, `limit?` (default 10), `page?` (default 1)
   - Validación con **Zod**
   - Agregación: top contenidos por **count de plays** en el rango
   - Response: `{ rows: [{ contentId, plays, totalDurationSec }], total, meta: { queryMs, page, pageSize } }`

2. **UI** `/es/sandbox/streaming-metrics`
   - Tabla top N + total plays globales
   - Filtro por país (select)
   - Rango de fechas (inputs date)
   - Estados: loading / error / empty
   - Paginación simple (prev/next)

3. **Test** (1 mínimo): unit test de la función de agregación

---

## Cronómetro — 60 min

| Min | Fase | Entregable |
|-----|------|------------|
| 0–5 | Leer enunciado + abrir archivos TODO | Plan mental |
| 5–25 | `aggregate-top-content.ts` + test Vitest | Lógica pura verde |
| 25–40 | `route.ts` + Zod + errores 400 | API responde en curl/Thunder Client |
| 40–55 | Client React: fetch, tabla, filtros | UI funcional |
| 55–60 | Smoke manual + anotar qué faltó | Review |

**No hacer:** CSS fancy, auth, DB real, Docker.

---

## Checklist mínimo (pass)

- [ ] Query inválida → 400 JSON `{ error: "..." }`
- [ ] Filtro `from`/`to` funciona
- [ ] Filtro `country` opcional
- [ ] Top ordenado desc por plays
- [ ] UI muestra loading mientras fetch
- [ ] 1 test unitario pasa (`npm run test -- aggregate-top-content`)

---

## Auth de prueba (Bearer)

Activo en **dev** y en **Vercel** (adolfo-nine). Desactivar con `METRICS_SANDBOX_ENABLED=false`.

### 1. Obtener token

```bash
# GET rápido (browser/curl)
curl "http://localhost:3000/api/metrics/get-token?clientId=metrics-demo&clientSecret=metrics-demo-dev"

# POST (recomendado)
curl -X POST http://localhost:3000/api/metrics/get-token \
  -H "Content-Type: application/json" \
  -d '{"clientId":"metrics-demo","clientSecret":"metrics-demo-dev"}'
```

Respuesta: `{ "token", "tokenType": "Bearer", "expiresIn": 3600 }`

### 2. Llamar API protegida

```bash
curl "http://localhost:3000/api/metrics/top-content?from=2026-06-01&to=2026-06-30&limit=5&country=ES" \
  -H "Authorization: Bearer <token>"
```

UI: `/es/sandbox/streaming-metrics` — formulario get-token + fetch con Bearer.

---

## Probar API (curl)

```bash
curl "http://localhost:3000/api/metrics/top-content?from=2026-06-01&to=2026-06-30&limit=5&country=ES"
```

---

## Si te sobra tiempo

- Cursor pagination (`cursor=contentId:lastPlays`)
- Columna “avg duration”
- `meta.queryMs` real con `performance.now()`

---

## Express equivalente (referencia post-simulacro)

```js
app.get('/metrics/top-content', (req, res) => {
  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const rows = aggregateTopContent(events, parsed.data);
  res.json(rows);
});
```

Misma función `aggregateTopContent` — cero cambios.

---

*Archivos a completar: ver TODOs en `src/domain/streaming-metrics/` y `src/app/api/metrics/top-content/route.ts`*
