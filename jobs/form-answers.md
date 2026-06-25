# Respuestas de formularios — copiar y pegar

> Textos por empresa/portal. Límites indicados cuando aplica.

---

## Improving South America

**Pregunta:** Why are you interested in working at Improving South America? *  
**Límite:** 50–1000 caracteres · **Actual:** ~780

```
I'm interested in Improving South America because you build long-term partnerships with US and EU enterprises while investing in how engineering is practiced—not just what gets shipped. That culture of trust, quality, and professional growth is exactly what I'm looking for in my next role.

What excites me is working on React-based products with distributed teams that collaborate directly with client engineers—I've done this for years as Frontend Lead at Krunchbox and at J.P. Morgan on large-scale dashboards. I'm based in Spain, fluent in English, comfortable with async remote work, and motivated by mentoring, code quality, and modern frontend architecture (TypeScript, Next.js, testing, CI/CD).

I'd be a strong fit because I combine senior hands-on delivery with technical leadership, and I share your commitment to changing how IT professionals are valued.
```

**Fuente:** Get on Board · React SSR Adv (remote) · 2026-06-25

---

## Mediastream

**Pregunta:** Why are you interested in working at Mediastream? *  
**Límite:** 50–1000 caracteres · **Actual:** ~920

```
I'm interested in Mediastream because you're building the infrastructure behind how millions of people consume audiovisual content—combining streaming technology, data, and product in a space that's technically demanding and genuinely impactful. After 18+ years in mediatech, that focus on OTT, live streaming, and audience intelligence stands out.

What excites me most is the intersection of React frontends and analytics: turning complex consumption data into clear, performant dashboards that help clients make real decisions. That's been the core of my recent work as Frontend Lead at Krunchbox (enterprise retail BI with ag-Grid and real-time analytics) and at J.P. Morgan on large-scale financial dashboards.

I'd be a strong fit because I bring 14+ years in React, TypeScript, and Next.js, a data-driven product mindset, and experience leading remote teams from Spain with fluent English. I want to contribute to a platform that scales across LATAM and beyond.
```

**Fuente:** Get on Board · Mediastream (remote) · 2026-06-25

**Pregunta:** Cuéntanos sobre una decisión de arquitectura que tomaste en un proyecto de analítica o procesamiento de datos. ¿Qué problema resolvía, qué alternativas consideraste y qué aprenderías si lo hicieras hoy? *

```
En Krunchbox lideré el frontend de Pluvia, un hub de analítica retail B2B donde los usuarios exploran datasets de ventas e inventario que superan fácilmente 100.000 filas por vista. El problema no era solo “mostrar una tabla”: el navegador se congelaba, los filtros tardaban varios segundos y el equipo perdía confianza en la herramienta porque cada cambio de dimensión (tienda, categoría, periodo) implicaba recargar demasiado estado en el cliente.

La decisión que tomé fue adoptar ag-Grid con Server-Side Row Model (SSRM): el grid pide al backend páginas filtradas y ordenadas, mantiene en memoria solo lo visible, y delega agregaciones pesadas al API. En el frontend definimos un contrato estable de query params (filtros, sort, cursor de página) y una capa de caché corta por combinación de filtros para evitar round-trips redundantes al navegar entre vistas relacionadas. Complementamos con columnas fijas para KPIs, debounce en filtros de texto y lazy loading de columnas secundarias.

Alternativas que evaluamos: (1) Client-Side Row Model con Web Workers — descartada porque el payload inicial seguía siendo enorme y el costo de serialización en JSON era alto; (2) exportar solo a CSV/Excel y abandonar exploración interactiva — rechazada por producto; (3) construir una virtual list custom — más control, pero mucho más costo de mantenimiento y peor soporte para pivot/filter nativo.

El resultado fue una UI que respondía en menos de 300 ms en operaciones típicas de filtrado y permitió escalar a más retailers sin reescribir la capa de presentación.

Si lo hiciera hoy, incorporaría desde el diseño métricas de observabilidad (tiempo por query, tamaño de página óptimo, tasa de cache hit) y evaluaría agregaciones precomputadas o materialized views en backend para las combinaciones de filtros más frecuentes — el cuello de botella real no era React, sino cuántas veces el usuario obligaba al API a recalcular el mismo universo de datos. También documentaría el contrato API con tests de contrato desde el día uno, algo que implementamos después y que habría acelerado la alineación con el equipo de datos.
```

---

## Blazestack

**Pregunta:** Why are you interested in working at Blazestack? *  
**Límite:** 50–1000 caracteres · **Actual:** ~890

```
I'm interested in Blazestack because you're building software that frontline investigators actually rely on—not engagement metrics, but tools that help public safety teams do thorough, compliant work under real pressure. That combination of mission impact, technical rigor, and high-trust environments is exactly where I've done my best work.

What excites me is the focus on React/TypeScript UIs for complex, field-ready workflows, plus the emphasis on quality through Playwright, component libraries, and accessibility. At J.P. Morgan I shipped regulated financial dashboards; at Krunchbox I lead frontend architecture with strict TypeScript, automated testing (Jest/Playwright), and enterprise data UIs. I'm drawn to small, ownership-driven teams where senior engineers shape both the product experience and the engineering standards.

I'd be a strong fit because I bring 14+ years shipping production React apps, experience in compliance-sensitive contexts, and a genuine motivation to build software that matters beyond the screen. Based in Spain, fluent English, fully remote.
```

**Fuente:** Get on Board · Senior Frontend Engineer L5/L6 (remote) · 2026-06-25

---

## Sanctuary Computer

**Pregunta:** Why are you interested in working at Sanctuary Computer? *  
**Límite:** 50–1000 caracteres · **Actual:** ~940

```
I'm interested in Sanctuary Computer because you're not a traditional agency—you're a worker-owned collective that treats engineering as craft, not billable output. The emphasis on thoughtful UX, solid code, async communication, and projects with real cultural impact (not growth hacks) aligns with how I want to work at this stage of my career.

What excites me is building polished React/Next.js experiences across diverse client work—from brand sites to complex apps—while protecting focus time and collaborating closely with designers. I've done similar work at Spark Digital (Dow Jones, AMC+) and currently lead frontend architecture at Krunchbox, where I care about TypeScript strictness, Playwright coverage, accessibility, and performance. Your garden3d model and "zero surprises" transparency resonate deeply.

I'd be a strong fit because I bring 14+ years of senior frontend delivery, fluency in async remote collaboration across time zones, and genuine respect for the intersection of design and engineering. Based in Spain, fluent English.
```

**Fuente:** Get on Board / garden3d · Senior Frontend Developer (remote) · 2026-06-25

---

## 2BRAINS

**Pregunta:** Why are you interested in working at 2BRAINS? *  
**Límite:** 50–1000 caracteres · **Actual:** ~870

```
I'm interested in 2BRAINS because you combine business strategy, design, and engineering at scale across Latin America—building digital products that genuinely transform how organizations operate, not ticket-by-ticket outsourcing. As part of Acid Labs, you offer regional strength with diverse, high-impact client work.

What excites me is your stack and culture: React, Next.js, design systems, and tight collaboration between frontend, backend, product, and UX in agile squads. That's how I work today as Frontend Lead at Krunchbox, and how I shipped enterprise apps at J.P. Morgan and Spark Digital. I value teams where senior engineers raise standards through code review, automated testing, and performance-focused UI.

I'd be a strong fit because I bring 14+ years in React/Next.js/TypeScript, native Spanish and fluent English, and proven 100% remote delivery from Spain with LATAM and global stakeholders.
```

**Fuente:** Get on Board · Frontend / Full-Stack (remote LATAM) · 2026-06-25

---

## BuildWithin

**Pregunta:** Why are you interested in working at BuildWithin? *  
**Límite:** 50–1000 caracteres · **Actual:** ~930

```
I'm interested in BuildWithin because you're solving a problem that matters—helping people navigate non-linear careers through technology that understands skills and outcomes, not just job listings. Workforce development with real social impact, plus a modern engineering stack, is exactly the kind of product work I want to contribute to.

What excites me is building Next.js/React/TypeScript experiences that are accessible, mobile-first, and integrated with AI-driven features—while maintaining the rigor of secure, compliant platforms. I lead frontend architecture at Krunchbox (including AI-assistant UI with streaming state), shipped enterprise dashboards at J.P. Morgan, and care deeply about WCAG, Playwright testing, and performance.

I'd be a strong fit because I bring 14+ years shipping production web apps, strong UX sensitivity, end-to-end ownership, and proven remote collaboration from Spain in fluent English. I want to help build tools that change lives, not just metrics.
```

**Fuente:** Get on Board · Frontend Developer / Software Engineer (remote) · 2026-06-25

---

## Verve IT

**Pregunta:** Why are you interested in working at Verve IT? *  
**Límite:** 50–1000 caracteres · **Actual:** ~920

```
I'm interested in Verve IT because you're building focused, AI-powered SaaS for a real operational problem—not a generic marketplace, but software MSPs will use daily. I prefer small, high-ownership teams where engineers shape the product and stack, and your mission to make MSP operations smarter through practical AI resonates with me.

What excites me technically is the stack: Next.js on Vercel, TypeScript, Postgres, multi-tenant auth, Stripe, and integrations with external APIs—including AI services. That's very close to what I ship today as Frontend Lead at Krunchbox (Next.js App Router) and in my full-stack side project (Next.js, Prisma/Postgres, auth, payments, webhooks). I enjoy owning features end-to-end, from UI to API routes, with strong testing and async remote collaboration.

I'd be a strong fit because I bring deep Next.js/TypeScript experience, solid Postgres and REST API work, fluent English, and a track record in production environments. Based in Spain, comfortable with US-aligned async hours.
```

**Fuente:** Get on Board · Mid Level Full-Stack Developer · $4–5k USD/mo · 2026-06-25

---

## Formulario técnico — Arquitecturas distribuidas / IA / AWS

> Checkboxes “selecciona todo lo que aplique”. Respuesta **honesta** según tu CV (Frontend Lead, no Platform/SRE/ML infra).

### 1. Arquitecturas y plataformas distribuidas en producción

| Opción | ¿Marcar? | Motivo |
|---|---|---|
| Monitoreo y observabilidad en plataformas de ingeniería | ❌ | No has montado stacks tipo Datadog/Prometheus/Grafana a nivel plataforma. Sí haces **tests de contrato API + Playwright** para detectar regresiones antes de prod — eso es calidad de app, no observabilidad de infra. |
| Mecanismos de resiliencia (recuperación automática, fallos) | ❌ | No diseñaste circuit breakers, retries a nivel sistema distribuido, etc. |
| Backend escalable, alta concurrencia y fallos | ❌ | Tienes Node/Express/NestJS en proyectos puntuales, pero no lideraste diseño/despliegue de backends distribuidos en prod. |

**Marcar: ninguna.**

---

### 2. Plataformas de IA y Machine Learning

| Opción | ¿Marcar? | Motivo |
|---|---|---|
| Pipelines de embeddings / RAG / bases vectoriales | ❌ | En Krunchbox integraste UI del asistente IA (streaming, estado en shell), pero **no** implementaste RAG ni vector DB. |
| Agentes de IA multi-paso con herramientas y contexto | ❌ | No en producción. |
| Inferencia en prod (Triton, SageMaker) | ❌ | Sin experiencia documentada. |

**Marcar: ninguna.**  
*(Adolfo usa Gemini vía API para CV — integración de producto, no operacionalización ML.)*

---

### 3. AWS y servicios nativos (platform engineering)

| Opción | ¿Marcar? | Motivo |
|---|---|---|
| SQS / EventBridge | ❌ | No aparece en tu historial. |
| IAM / KMS en prod | ❌ | En JPM/Santander trabajaste auth **en app** (Next-Auth, entornos regulados), no políticas IAM/KMS como ingeniero de plataforma. |
| EKS / Fargate | ❌ | Sin experiencia. |

**Marcar: ninguna.**

---

### Resumen rápido para el formulario

```
Pregunta 1: (ninguna)
Pregunta 2: (ninguna)
Pregunta 3: (ninguna)
```

**Nota:** Este bloque filtra perfiles **Platform / SRE / ML Ops**. Si el portal **obliga** a marcar al menos una opción por sección, el rol probablemente no encaja con tu perfil actual (Senior Frontend / Lead React). Mejor no forzar respuestas falsas.

---

