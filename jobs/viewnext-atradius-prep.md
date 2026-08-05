# Viewnext / Zemsania — Atradius · Prep entrevista

> **Rol:** Desarrollador Front React · Inglés alto imprescindible  
> **Cliente:** Atradius (seguro crédito / caución) vía **Viewnext** (IBM España)  
> **Employer:** Zemsania Global Group · 100% remoto · ~41k€ SBA · indefinido  
> **Hoy:** videollamada (Viewnext contacta por teléfono/email)

---

## Checklist 15 min antes

- [ ] Link / teléfono listo (ellos contactan a ti)
- [ ] Cámara, mic, auriculares, fondo limpio
- [ ] Agua, cuaderno
- [ ] **Inglés:** pitch 2 min ensayado (abajo)
- [ ] Ejemplos listos: Pluvia, JPM, Adolfo (Vitest + Tailwind)
- [ ] Preguntas para ellos (final de doc)

---

## Contexto que debes saber (2 min)

| Quién | Qué |
|-------|-----|
| **Zemsania** | Consultora ES (~500), contrato y HR. Telefónica, Santander, Inditex… |
| **Viewnext** | Consultoría digital, grupo **IBM** en España |
| **Atradius** | Seguro crédito, caución, gestión impagos. Ámsterdam, 50+ países. En Iberia: **Crédito y Caución** (GCO) |
| **Proyecto** | Front React en **sector seguros** — dashboards, flujos de pólizas/crédito, datos sensibles, regulación |

**Implicación técnica:** UI estable, tests, rendimiento, accesibilidad, integración con APIs backend Java/.NET típico en banca/seguros.

---

## Tu pitch — 2 min (inglés)

```
I'm Erick, Senior Frontend Engineer based in San Sebastián de los Reyes, Spain, fully remote.

I have 17+ years in software development, with a strong focus on React, TypeScript, and scalable UI architecture. Most recently I was Frontend Lead at Krunchbox, where I architected Pluvia—an enterprise analytics platform handling 100k+ rows per view with strict TypeScript, performance tuning, and a small team I mentored.

Before that, I spent two years at J.P. Morgan building regulated financial dashboards with React and Next.js—high stakes for data accuracy, accessibility, and release discipline.

Day to day I work with React 19, Next.js 15, Tailwind, Vitest, and domain-driven structure. I'm fluent in English and comfortable in async distributed teams.

I'm interested in this role because insurance combines complex business rules with long-lived products—similar rigor to banking, where I've already delivered—and I'd like to contribute stable, tested React frontends for Atradius through Viewnext.
```

---

## Mapa CV → JD

| Piden | Tu historia | Proyecto / prueba |
|-------|-------------|-------------------|
| React avanzado | Lead Krunchbox, JPM 2 años | Pluvia, Adolfo |
| **React Query** | No en producción reciente; **sí** caching SSRM + fetch patterns Next | Ver sección abajo — honesto + transferible |
| Context API | Auth, theme, locale en Next | `adolfo` App Router |
| **Vitest** | Suite activa dominio + APIs | `npm run test` en Adolfo |
| **Rendimiento** | SSRM, debounce, memo, lazy columns | Pluvia 100k filas |
| **Tailwind** | Diario v4 | Todo Adolfo |
| Inglés alto | Fluente, JPM global | Entrevista en EN probable |

---

## Gap principal: React Query

**Respuesta honesta (30 s):**

> "In my latest projects I used Next.js server components and explicit fetch layers with short-lived cache for grid queries—similar goals to TanStack Query: dedupe requests, stale data, loading/error states. I haven't shipped React Query in the last year, but I know the mental model—useQuery for server state, useMutation with optimistic updates, queryKey invalidation—and I'd ramp up in the first sprint. It's on my learning path for client-heavy SPAs like insurance portals."

**Conceptos que sí debes nombrar:**

- `queryKey`, `staleTime`, `gcTime` (antes `cacheTime`)
- `useQuery` / `useMutation` / `useQueryClient().invalidateQueries`
- Server state ≠ client state (no meter todo en Redux/Context)

---

## Q&A técnico probable

### React / estado

**¿Context vs props vs React Query?**  
Context: tema, auth, locale — poco cambiante. React Query: datos del API. Props: composición local. Evitar Context para datos que cambian mucho (re-renders).

**¿Cómo optimizas renders?**  
`memo` en listas pesadas, `useMemo`/`useCallback` solo con perfil real, keys estables, split de context, virtualización (ag-Grid / virtual lists), code splitting `dynamic()`.

**¿Controlled vs uncontrolled?**  
Controlled: React es source of truth (`value` + `onChange`). Uncontrolled: ref/DOM. Formularios complejos: React Hook Form + controlled híbrido.

### Testing (Vitest)

**¿Qué testeas en front?**  
Dominio puro (funciones sin DOM), hooks con `@testing-library/react`, integración API mock `vi.fn()`, no snapshot masivo.

**Ejemplo Adolfo:** `aggregate-top-content.test.ts`, `job-filters.test.ts`.

**¿Vitest vs Jest?**  
Misma API `describe/it/expect`, más rápido con Vite/ESM, `vi.mock` nativo.

### Tailwind

**¿Por qué Tailwind?**  
Design system consistente, purge en build, menos CSS muerto, variantes (`hover:`, `md:`), colaboración en equipo.

**v4:** `@import "tailwindcss"`, CSS-first config.

### Seguros / enterprise

**¿Experiencia regulada?**  
JPM: dashboards financieros, precisión, auditoría. Krunchbox B2B: permisos por retailer, datos sensibles.

**¿Cómo manejas errores API?**  
Capas: Zod en boundary, toast/UI por código HTTP, retry solo idempotente, logging sin PII en cliente.

---

## Q&A recruiter / soft (ES o EN)

| Pregunta | Respuesta corta |
|----------|-----------------|
| ¿Por qué Zemsania/Viewnext/Atradius? | Estabilidad (indefinido), remoto, sector con reglas de negocio complejas, encaje React + inglés |
| ¿Expectativa salarial? | Rango ofrecido 41k SBA encaja; abierto a detalle variable según paquete flexible |
| ¿Disponibilidad? | Inmediata / según preaviso actual |
| ¿NIE / permiso trabajo? | NIE España, trámite residencia en curso (si preguntan — breve y factual) |
| ¿Weakness? | React Query no en último proyecto; compensado con fetch/cache patterns y curva rápida |

---

## Preguntas para hacerles (elige 3)

1. ¿Stack exacto? ¿React 18/19, build tool (Vite/CRA), state global?
2. ¿TanStack Query ya en el proyecto o introducción nueva?
3. ¿Equipo front: cuántos, onshore/offshore, ceremonias (daily, sprint)?
4. ¿Integración con APIs: OpenAPI, BFF, GraphQL?
5. ¿Cobertura de tests esperada en PRs?
6. ¿Horario core hours aunque sea remoto?
7. ¿Fase del proyecto Atradius: mantenimiento, greenfield, migración?
8. ¿Siguiente paso tras esta videollamada?

---

## Cheat sheet rápido — JS / React / Next

### JavaScript (entrevista front)

```ts
// Igualdad: === siempre. Objetos por referencia.
// Async: Promise, async/await, try/catch, Promise.all vs allSettled
// Inmutabilidad: spread [...arr], {...obj} — no mutar state en React
// Optional chaining: user?.address?.city ?? 'N/A'
// Array: map/filter/reduce — map para render lists
```

### React 19 (hooks esenciales)

| Hook | Uso |
|------|-----|
| `useState` | Estado local |
| `useEffect` | Sync con exterior (fetch legacy, subscriptions) — **menos** con Query/RSC |
| `useContext` | Valores globales estables |
| `useMemo` | Cálculo caro cacheado |
| `useCallback` | Función estable para hijos memo |
| `useRef` | DOM o valor mutable sin re-render |

**Rules of Hooks:** solo top-level, solo en componentes/hooks.

### React Query (repaso 5 min)

```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ['policies', id],
  queryFn: () => fetchPolicy(id),
  staleTime: 60_000,
});

const mutation = useMutation({
  mutationFn: updatePolicy,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['policies'] }),
});
```

### Next.js 15 (si preguntan)

- **App Router:** `app/`, layouts, `page.tsx`, Server Components por defecto
- **`'use client'`** cuando hay hooks/eventos
- **Server Actions** mutaciones sin API route explícita
- **i18n:** `[locale]` en rutas (lo tienes en Adolfo)

### Performance checklist

1. Medir primero (React DevTools Profiler, Lighthouse)
2. Lista larga → virtualizar
3. Imágenes → `next/image`
4. Bundle → dynamic import
5. Evitar re-renders → React Query + memo selectivo

---

## Plan de prep hoy (si tienes 2 h)

| Tiempo | Qué |
|--------|-----|
| 20 min | Pitch EN × 2 en voz alta |
| 30 min | Leer cheat sheet + React Query docs (overview TanStack) |
| 20 min | Repasar 1 test Vitest en Adolfo (`job-filters.test.ts`) |
| 20 min | Historia Pluvia rendimiento (SSRM) — 1 min |
| 15 min | Preguntas para ellos + contexto Atradius/seguros |
| Resto | Descanso antes de la call |

---

## Links

- [Zemsania](https://zemsaniaglobalgroup.com/)
- [TanStack Query — Overview](https://tanstack.com/query/latest/docs/framework/react/overview)
- [Vitest — Getting Started](https://vitest.dev/guide/)
- Demo tuya: `https://adolfo-nine.vercel.app` (Next + Tailwind + tests en repo)

---

## Notas post-entrevista

- Contacto Zemsania: _______________
- Contacto Viewnext: _______________
- Siguiente paso: _______________
- Stack confirmado: _______________
