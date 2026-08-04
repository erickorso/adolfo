import type { ArchitecturePracticesLesson } from "./lesson.types";

/**
 * Buenas prácticas de diseño: SOLID, TDD, DDD, Hexagonal —
 * orientado a frontend/Product Engineers en TypeScript.
 */
export const ARCHITECTURE_PRACTICES_LESSONS: ArchitecturePracticesLesson[] = [
  {
    slug: "why-architecture-practices",
    order: 0,
    hours: 1,
    title: {
      es: "Por qué estas prácticas (y cuándo no)",
      en: "Why these practices (and when not)",
    },
    summary: {
      es: "SOLID, TDD, DDD y Hexagonal no son dogmas: son herramientas para complejidad y cambio.",
      en: "SOLID, TDD, DDD, and Hexagonal aren't dogma: they're tools for complexity and change.",
    },
    body: {
      es: "En entrevistas y JDs aparecen juntas: SOLID, TDD, DDD, arquitectura hexagonal. El riesgo es memorizar acrónimos sin criterio. En producto real (React/Next + APIs) sirven cuando el dominio crece, el equipo es >1 y el cambio es frecuente. No las uses en un CRUD de fin de semana: YAGNI gana. Este módulo te da vocabulario preciso + ejemplos TS/React para hablar en entrevistas y aplicar en Adolfo/Pluvia-like apps.",
      en: "Job descriptions often list SOLID, TDD, DDD, and hexagonal architecture together. The risk is memorizing acronyms without judgment. In real product work (React/Next + APIs) they help when the domain grows, the team is >1, and change is frequent. Don't force them on a weekend CRUD: YAGNI wins. This module gives precise vocabulary plus TS/React examples for interviews and Adolfo/Pluvia-like apps.",
    },
    bullets: [
      {
        es: "Objetivo: explicar trade-offs, no recitar definiciones.",
        en: "Goal: explain trade-offs, not recite definitions.",
      },
      {
        es: "Frontend: Hexagonal = UI → casos de uso → adapters (HTTP/Prisma).",
        en: "Frontend: Hexagonal = UI → use cases → adapters (HTTP/Prisma).",
      },
      {
        es: "Señales de sobre-ingeniería: carpetas vacías, interfaces sin 2ª implementación.",
        en: "Over-engineering signals: empty folders, interfaces with no second implementation.",
      },
    ],
    deliverable: {
      es: "Escribí 5 líneas: un feature de Adolfo donde SÍ aplicarías Hexagonal y uno donde NO.",
      en: "Write 5 lines: one Adolfo feature where you WOULD apply Hexagonal and one where you would NOT.",
    },
    resources: [
      {
        label: {
          es: "Martin Fowler — Design Stamina Hypothesis",
          en: "Martin Fowler — Design Stamina Hypothesis",
        },
        href: "https://martinfowler.com/bliki/DesignStaminaHypothesis.html",
      },
    ],
  },
  {
    slug: "solid-principles",
    order: 1,
    hours: 3,
    title: {
      es: "SOLID en TypeScript y React",
      en: "SOLID in TypeScript and React",
    },
    summary: {
      es: "Los cinco principios con ejemplos FE: componentes, hooks y servicios — sin Java enterprise.",
      en: "The five principles with FE examples: components, hooks, and services — no enterprise Java.",
    },
    body: {
      es: "S — Single Responsibility: un componente/hook no mezcla fetch + layout + analytics. Separá presentational vs container o custom hooks.\n\nO — Open/Closed: extendé con composición (props/render props/slots), no con if-else gigantes en un Button.\n\nL — Liskov: un subtipo debe sustituir al padre sin romper contratos (props opcionales mal usadas rompen Liskov).\n\nI — Interface Segregation: no pases un mega-contexto a todos; dividí providers (auth, cart, theme).\n\nD — Dependency Inversion: UI depende de abstracciones (repositorios/ports), no de fetch/Prisma concretos. En Adolfo: pages → services → prisma.",
      en: "S — Single Responsibility: a component/hook shouldn't mix fetch + layout + analytics. Split presentational vs container or custom hooks.\n\nO — Open/Closed: extend via composition (props/slots), not giant if-else in one Button.\n\nL — Liskov: subtypes must honor parent contracts (misused optional props break Liskov).\n\nI — Interface Segregation: don't shove a mega-context everywhere; split providers (auth, cart, theme).\n\nD — Dependency Inversion: UI depends on abstractions (repos/ports), not concrete fetch/Prisma. In Adolfo: pages → services → prisma.",
    },
    bullets: [
      {
        es: "SRP: LessonCompleteButton no debería conocer Prisma.",
        en: "SRP: LessonCompleteButton shouldn't know Prisma.",
      },
      {
        es: "DIP: `getModuleProgress(userId)` es el port; prisma es el adapter.",
        en: "DIP: `getModuleProgress(userId)` is the port; prisma is the adapter.",
      },
      {
        es: "Anti-patrón: God Component de 800 líneas con 12 useEffects.",
        en: "Anti-pattern: 800-line God Component with 12 useEffects.",
      },
    ],
    deliverable: {
      es: "Refactor mental: listá 3 violaciones SRP/DIP en un archivo tuyo de Adolfo y cómo las cortarías.",
      en: "Mental refactor: list 3 SRP/DIP violations in one of your Adolfo files and how you'd cut them.",
    },
    resources: [
      {
        label: {
          es: "Uncle Bob — Principles of OOD",
          en: "Uncle Bob — Principles of OOD",
        },
        href: "https://web.archive.org/web/20150906155800/http://www.butunclebob.com/ArticleS.UncleBob.PrinciplesOfOod",
      },
    ],
  },
  {
    slug: "tdd-practical",
    order: 2,
    hours: 3,
    title: {
      es: "TDD práctico (Vitest / RTL)",
      en: "Practical TDD (Vitest / RTL)",
    },
    summary: {
      es: "Red → Green → Refactor en dominio puro; tests de UI donde aportan.",
      en: "Red → Green → Refactor on pure domain; UI tests where they pay off.",
    },
    body: {
      es: "TDD no es “escribir tests después”. Ciclo: (1) test que falla, (2) mínimo código verde, (3) refactor con red de seguridad.\n\nEn frontend: empezá por funciones puras (unlock de lecciones, mappers, score de quiz). Ahí TDD brilla. En React Testing Library: comportamiento del usuario (click → estado), no implementación (no spy de hooks internos).\n\nPirámide: muchos unit de domain, algunos integration de service+mock DB, pocos E2E Playwright.\n\nCuándo NO insistir en TDD estricto: spikes exploratorios, prototipos UI. Sí: reglas de negocio, parsers, money/permissions.",
      en: "TDD isn't “write tests later”. Cycle: (1) failing test, (2) minimal green code, (3) refactor safely.\n\nOn frontend: start with pure functions (lesson unlock, mappers, quiz score). That's where TDD shines. With React Testing Library: user behavior (click → state), not implementation (don't spy internal hooks).\n\nPyramid: many domain unit tests, some service+mock DB integration, few Playwright E2E.\n\nWhen NOT to force strict TDD: exploratory spikes, UI prototypes. Yes: business rules, parsers, money/permissions.",
    },
    bullets: [
      {
        es: "Red primero: el test documenta el contrato.",
        en: "Red first: the test documents the contract.",
      },
      {
        es: "RTL: `getByRole` > `getByTestId` salvo casos raros.",
        en: "RTL: prefer `getByRole` over `getByTestId` except rare cases.",
      },
      {
        es: "Fake vs mock: preferí fakes en memoria para repos.",
        en: "Fake vs mock: prefer in-memory fakes for repos.",
      },
    ],
    deliverable: {
      es: "Escribí un test Vitest (Red) para `isLessonUnlocked` antes de tocar la implementación.",
      en: "Write a Vitest test (Red) for `isLessonUnlocked` before changing the implementation.",
    },
    resources: [
      {
        label: { es: "Kent C. Dodds — Testing Trophy", en: "Kent C. Dodds — Testing Trophy" },
        href: "https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications",
      },
      {
        label: { es: "Vitest docs", en: "Vitest docs" },
        href: "https://vitest.dev/",
      },
    ],
  },
  {
    slug: "ddd-basics",
    order: 3,
    hours: 3,
    title: {
      es: "DDD ligero para productos web",
      en: "Lightweight DDD for web products",
    },
    summary: {
      es: "Lenguaje ubicuo, bounded contexts y modelos ricos — sin microservicios obligatorios.",
      en: "Ubiquitous language, bounded contexts, and rich models — without mandatory microservices.",
    },
    body: {
      es: "DDD (Domain-Driven Design) alinea código con el lenguaje del negocio. En Adolfo: JobPosting ≠ Course ≠ LessonProgress — contextos distintos.\n\nUbiquitous language: el mismo término en UI, API y DB (o mapeo explícito). Evitá “item” genérico.\n\nBounded context: no mezcles catálogo de productos con ingest de jobs en el mismo service “god”.\n\nAggregates: raíz que mantiene invariantes (ej. ModuleProgress: no completar lección inexistente).\n\nValue objects: Money, Email, Locale — igualdad por valor.\n\nEn FE: el “dominio” suele vivir en `src/domain/*` (tipos + reglas), no en componentes. Los templates solo orquestan.",
      en: "DDD (Domain-Driven Design) aligns code with business language. In Adolfo: JobPosting ≠ Course ≠ LessonProgress — different contexts.\n\nUbiquitous language: same terms in UI, API, and DB (or explicit mapping). Avoid generic “item”.\n\nBounded context: don't mix product catalog with jobs ingest in one “god” service.\n\nAggregates: root that enforces invariants (e.g. ModuleProgress: can't complete a missing lesson).\n\nValue objects: Money, Email, Locale — equality by value.\n\nOn FE: “domain” usually lives in `src/domain/*` (types + rules), not in components. Templates only orchestrate.",
    },
    bullets: [
      {
        es: "Strategic DDD: contextos y anti-corruption layers entre módulos.",
        en: "Strategic DDD: contexts and anti-corruption layers between modules.",
      },
      {
        es: "Tactical: entities, value objects, domain services, repositories.",
        en: "Tactical: entities, value objects, domain services, repositories.",
      },
      {
        es: "Anemic model vs rich: validación en el dominio, no solo Zod en el edge.",
        en: "Anemic vs rich model: validate in the domain, not only Zod at the edge.",
      },
    ],
    deliverable: {
      es: "Dibujá (texto) 2 bounded contexts de Adolfo y qué datos cruzan el límite.",
      en: "Sketch (text) 2 Adolfo bounded contexts and what data crosses the boundary.",
    },
    resources: [
      {
        label: {
          es: "Maria Santos — Bounded Context",
          en: "Maria Santos — Bounded Context",
        },
        href: "https://martinfowler.com/bliki/BoundedContext.html",
      },
    ],
  },
  {
    slug: "hexagonal-architecture",
    order: 4,
    hours: 3,
    title: {
      es: "Arquitectura hexagonal (ports & adapters)",
      en: "Hexagonal architecture (ports & adapters)",
    },
    summary: {
      es: "El dominio en el centro; UI, HTTP y DB son adapters intercambiables.",
      en: "Domain at the center; UI, HTTP, and DB are swappable adapters.",
    },
    body: {
      es: "Hexagonal (Ports & Adapters, Alistair Cockburn): el núcleo no conoce Next, Prisma ni fetch.\n\nPorts (inbound): casos de uso que la app ofrece (`toggleLessonComplete`).\nPorts (outbound): lo que el dominio necesita (`LessonProgressRepository`).\nAdapters: implementaciones (Server Actions, Prisma, REST).\n\nEn Adolfo aproximado:\n- Domain: `src/domain/learning/*`\n- Application/services: `src/services/learning/*`\n- Adapters: `route.ts`, Server Actions, Prisma client\n\nBeneficio: testear dominio con fake repo; cambiar Neon↔SQLite sin reescribir UI.\n\nCuidado: no inventes 12 capas para un formulario. Hexagonal escala cuando hay varias entradas (UI + CLI + cron) o varias salidas (DB + queue + email).",
      en: "Hexagonal (Ports & Adapters, Alistair Cockburn): the core doesn't know Next, Prisma, or fetch.\n\nInbound ports: use cases the app offers (`toggleLessonComplete`).\nOutbound ports: what the domain needs (`LessonProgressRepository`).\nAdapters: implementations (Server Actions, Prisma, REST).\n\nAdolfo approximate map:\n- Domain: `src/domain/learning/*`\n- Application/services: `src/services/learning/*`\n- Adapters: `route.ts`, Server Actions, Prisma client\n\nBenefit: test domain with a fake repo; swap Neon↔SQLite without rewriting UI.\n\nCaution: don't invent 12 layers for a form. Hexagonal pays off with multiple inputs (UI + CLI + cron) or outputs (DB + queue + email).",
    },
    bullets: [
      {
        es: "Regla: dependencias apuntan hacia adentro (hacia el dominio).",
        en: "Rule: dependencies point inward (toward the domain).",
      },
      {
        es: "Primary adapters: HTTP/UI. Secondary: DB/email/queues.",
        en: "Primary adapters: HTTP/UI. Secondary: DB/email/queues.",
      },
      {
        es: "Clean Architecture ≈ mismo espíritu con círculos de Uncle Bob.",
        en: "Clean Architecture ≈ same spirit with Uncle Bob's circles.",
      },
    ],
    deliverable: {
      es: "Diagrama ASCII de 1 feature: UI → port → service → outbound port → Prisma adapter.",
      en: "ASCII diagram for 1 feature: UI → port → service → outbound port → Prisma adapter.",
    },
    resources: [
      {
        label: {
          es: "Cockburn — Hexagonal Architecture",
          en: "Cockburn — Hexagonal Architecture",
        },
        href: "https://alistair.cockburn.us/hexagonal-architecture/",
      },
    ],
  },
  {
    slug: "compose-and-interview",
    order: 5,
    hours: 2,
    title: {
      es: "Componer prácticas + respuesta de entrevista",
      en: "Compose practices + interview answer",
    },
    summary: {
      es: "Cómo encajan juntas y cómo explicarlas en 60 segundos (CHECK24-style JDs).",
      en: "How they fit together and how to explain them in 60 seconds (CHECK24-style JDs).",
    },
    body: {
      es: "Mapa mental:\n- DDD decide *qué* es el dominio y el lenguaje.\n- Hexagonal decide *dónde* viven las dependencias.\n- SOLID guía *cómo* cortar clases/módulos.\n- TDD asegura que el diseño se pueda cambiar.\n\nRespuesta entrevista (ES/EN):\n“Uso DDD ligero para acotar contextos. Hexagonal para aislar dominio de frameworks. SOLID en el día a día de componentes y services. TDD en reglas de negocio y mappers; RTL para flujos críticos. Evito sobre-diseño en features chicas.”\n\nSi te preguntan experiencia: citá un ejemplo concreto (Pluvia SSRM = SRP/DIP; Adolfo learn = domain + services + actions).",
      en: "Mental map:\n- DDD decides *what* the domain and language are.\n- Hexagonal decides *where* dependencies live.\n- SOLID guides *how* to split classes/modules.\n- TDD ensures the design can change.\n\nInterview answer:\n“I use light DDD to bound contexts. Hexagonal to isolate domain from frameworks. SOLID day-to-day on components and services. TDD on business rules and mappers; RTL for critical flows. I avoid over-design on small features.”\n\nIf asked for experience: cite a concrete example (Pluvia SSRM = SRP/DIP; Adolfo learn = domain + services + actions).",
    },
    bullets: [
      {
        es: "Checklist JD: SOLID ✓ TDD ✓ DDD ✓ Hexagonal ✓ — con un ejemplo cada uno.",
        en: "JD checklist: SOLID ✓ TDD ✓ DDD ✓ Hexagonal ✓ — one example each.",
      },
      {
        es: "Honestidad: “uso Hexagonal en módulos de learning; no en cada page”.",
        en: "Honesty: “I use Hexagonal in learning modules; not on every page”.",
      },
    ],
    deliverable: {
      es: "Grabá o escribí un pitch de 60s uniendo las 4 prácticas con un ejemplo de Adolfo.",
      en: "Record or write a 60s pitch linking all 4 practices with one Adolfo example.",
    },
    resources: [
      {
        label: {
          es: "Adolfo — módulo Python+AI (patrón domain/services)",
          en: "Adolfo — Python+AI module (domain/services pattern)",
        },
        href: "/learn/python-ai",
      },
    ],
  },
];

export function getLessonBySlug(
  slug: string,
): ArchitecturePracticesLesson | undefined {
  return ARCHITECTURE_PRACTICES_LESSONS.find((l) => l.slug === slug);
}

export function getAdjacentLessons(slug: string): {
  prev: ArchitecturePracticesLesson | null;
  next: ArchitecturePracticesLesson | null;
} {
  const index = ARCHITECTURE_PRACTICES_LESSONS.findIndex((l) => l.slug === slug);
  if (index < 0) {
    return { prev: null, next: null };
  }
  return {
    prev: index > 0 ? ARCHITECTURE_PRACTICES_LESSONS[index - 1]! : null,
    next:
      index < ARCHITECTURE_PRACTICES_LESSONS.length - 1
        ? ARCHITECTURE_PRACTICES_LESSONS[index + 1]!
        : null,
  };
}
