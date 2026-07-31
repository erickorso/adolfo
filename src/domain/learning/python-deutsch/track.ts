import type { LocalizedText } from "@/domain/learning/songs-english/song.types";

export type DualTrackSection = {
  slug: string;
  order: number;
  title: LocalizedText;
  summary: LocalizedText;
  blocks: {
    heading: LocalizedText;
    body: LocalizedText;
    bullets?: LocalizedText[];
    links?: { label: LocalizedText; href: string }[];
  }[];
};

export type WeeklySlot = {
  day: LocalizedText;
  morning: LocalizedText;
  evening: LocalizedText;
};

export const DUAL_TRACK_MODULE_ID = "python-deutsch";

/** Arquitectura semanal 10–12 h — time-blocking con separación de dominio. */
export const DUAL_TRACK_WEEK: WeeklySlot[] = [
  {
    day: { es: "Lunes", en: "Monday" },
    morning: {
      es: "Alemán: inputs & vocabulario (Anki)",
      en: "German: inputs & vocabulary (Anki)",
    },
    evening: {
      es: "Python: lógica & sintaxis",
      en: "Python: logic & syntax",
    },
  },
  {
    day: { es: "Martes", en: "Tuesday" },
    morning: {
      es: "Python: proyectos pequeños",
      en: "Python: small projects",
    },
    evening: {
      es: "Alemán: gramática estructurada",
      en: "German: structured grammar",
    },
  },
  {
    day: { es: "Miércoles", en: "Wednesday" },
    morning: {
      es: "Alemán: conversación / pronunciación",
      en: "German: conversation / pronunciation",
    },
    evening: {
      es: "Python: ejercicios (LeetCode / Exercism)",
      en: "Python: drills (LeetCode / Exercism)",
    },
  },
  {
    day: { es: "Jueves", en: "Thursday" },
    morning: {
      es: "Python: lógica & estructuras de datos",
      en: "Python: logic & data structures",
    },
    evening: {
      es: "Alemán: inmersión pasiva (audio / podcast)",
      en: "German: passive immersion (audio / podcast)",
    },
  },
  {
    day: { es: "Viernes", en: "Friday" },
    morning: {
      es: "Alemán: redacción / construcción",
      en: "German: writing / sentence building",
    },
    evening: {
      es: "Python: proyecto personal",
      en: "Python: personal project",
    },
  },
  {
    day: { es: "Sábado", en: "Saturday" },
    morning: {
      es: "Bloque repaso / proyecto libre",
      en: "Review block / free project",
    },
    evening: {
      es: "(mismo bloque o descanso parcial)",
      en: "(same block or partial rest)",
    },
  },
  {
    day: { es: "Domingo", en: "Sunday" },
    morning: { es: "Descanso total", en: "Full rest" },
    evening: { es: "Descanso total", en: "Full rest" },
  },
];

export const DUAL_TRACK_SECTIONS: DualTrackSection[] = [
  {
    slug: "metodo",
    order: 1,
    title: {
      es: "Método: time-blocking + adquisición activa",
      en: "Method: time-blocking + active acquisition",
    },
    summary: {
      es: "Python y Alemán en redes cognitivas distintas: alternar = descanso activo. Nunca ambos en la misma sesión sin pausa 30–45 min.",
      en: "Python and German use different cognitive networks: alternating is active rest. Never both in one session without a 30–45 min break.",
    },
    blocks: [
      {
        heading: { es: "Principio", en: "Principle" },
        body: {
          es: "Separación clara de contexto. Mañana (30–45 min, alta energía) vs tarde/noche (45–60 min, aplicación). ~10–12 h/semana.",
          en: "Clear context separation. Morning (30–45 min, high energy) vs evening (45–60 min, application). ~10–12 h/week.",
        },
      },
      {
        heading: { es: "Por qué no interfiere", en: "Why it doesn’t clash" },
        body: {
          es: "La lógica sintáctica de Python y la gramática alemana se procesan en redes distintas. Alternarlas descarga cada dominio en lugar de saturar el mismo.",
          en: "Python’s syntactic logic and German grammar use different networks. Alternating unloads each domain instead of saturating one.",
        },
      },
    ],
  },
  {
    slug: "deutsch",
    order: 2,
    title: {
      es: "Fase 1 — Alemán A1 → A2",
      en: "Phase 1 — German A1 → A2",
    },
    summary: {
      es: "Idioma estructurado (casi tipado). Adquisición comprensible + SRS.",
      en: "Highly structured language (almost strongly typed). Comprehensible input + SRS.",
    },
    blocks: [
      {
        heading: { es: "1. Vocabulario con Anki (SRS)", en: "1. Vocabulary with Anki (SRS)" },
        body: {
          es: "15–20 min cada mañana. Mazo de ~2.000 palabras frecuentes. Siempre sustantivo + artículo + plural (der Hund, die Hunde).",
          en: "15–20 min every morning. ~2,000 most frequent words deck. Always noun + article + plural (der Hund, die Hunde).",
        },
        links: [
          {
            label: { es: "Anki", en: "Anki" },
            href: "https://apps.ankiweb.net/",
          },
        ],
      },
      {
        heading: {
          es: "2. Input comprensible",
          en: "2. Comprehensible input",
        },
        body: {
          es: "Nicos Weg (Deutsche Welle) A1→B2 como curso estructurado. Easy German para oído real con subtítulos duales.",
          en: "Nicos Weg (Deutsche Welle) A1→B2 as structured course. Easy German for real-world listening with dual subtitles.",
        },
        links: [
          {
            label: { es: "Nicos Weg (DW)", en: "Nicos Weg (DW)" },
            href: "https://learngerman.dw.com/en/nicos-weg/c-36519789",
          },
          {
            label: { es: "Easy German (YouTube)", en: "Easy German (YouTube)" },
            href: "https://www.youtube.com/@EasyGerman",
          },
        ],
      },
      {
        heading: {
          es: "3. Gramática como reglas de sintaxis",
          en: "3. Grammar as syntax rules",
        },
        body: {
          es: "Casos (Nominativ, Akkusativ, Dativ, Genitiv) = tipos que mutan artículos. Libro: Grammatik aktiv A1–B1 (Cornelsen).",
          en: "Cases (Nominativ, Akkusativ, Dativ, Genitiv) = types that mutate articles. Book: Grammatik aktiv A1–B1 (Cornelsen).",
        },
      },
    ],
  },
  {
    slug: "python",
    order: 3,
    title: {
      es: "Fase 2 — Python (de JS a Pythonic)",
      en: "Phase 2 — Python (JS → Pythonic)",
    },
    summary: {
      es: "No empieces por “qué es una variable”: mapeá conceptos que ya dominás a idioms de Python.",
      en: "Don’t start with “what is a variable”: map concepts you already know to Pythonic idioms.",
    },
    blocks: [
      {
        heading: { es: "1. Sintaxis rápida", en: "1. Fast syntax" },
        body: {
          es: "Automate the Boring Stuff o el tutorial oficial. Acelerador: Exercism (pista Python) con mentoring.",
          en: "Automate the Boring Stuff or the official tutorial. Accelerator: Exercism Python track with mentoring.",
        },
        links: [
          {
            label: {
              es: "Automate the Boring Stuff",
              en: "Automate the Boring Stuff",
            },
            href: "https://automatetheboringstuff.com/",
          },
          {
            label: { es: "Exercism Python", en: "Exercism Python" },
            href: "https://exercism.org/tracks/python",
          },
        ],
      },
      {
        heading: {
          es: "2. Cambio de paradigma FE/JS → Python",
          en: "2. FE/JS → Python paradigm shift",
        },
        body: {
          es: "Priorizá comprehensions, venv/poetry/uv, asyncio, Pydantic y FastAPI.",
          en: "Prioritize comprehensions, venv/poetry/uv, asyncio, Pydantic, and FastAPI.",
        },
        bullets: [
          {
            es: "List / dict comprehensions",
            en: "List / dict comprehensions",
          },
          {
            es: "Entornos: venv, poetry o uv",
            en: "Envs: venv, poetry, or uv",
          },
          {
            es: "asyncio + tipado con Pydantic",
            en: "asyncio + typing with Pydantic",
          },
          {
            es: "Backend moderno: FastAPI",
            en: "Modern backend: FastAPI",
          },
        ],
      },
      {
        heading: { es: "3. Aprender construyendo", en: "3. Learn by building" },
        body: {
          es: "Scripts reales: scraper (BeautifulSoup / Playwright) o bot que consuma una API externa. Ideal: servicios en el monorepo Adolfo.",
          en: "Real scripts: scraper (BeautifulSoup / Playwright) or a bot calling an external API. Ideal: services in the Adolfo monorepo.",
        },
      },
    ],
  },
  {
    slug: "synergy",
    order: 4,
    title: {
      es: "Fase 3 — Sinergia (mes 2–3)",
      en: "Phase 3 — Synergy (month 2–3)",
    },
    summary: {
      es: "Cuando ambos estén en básico, uní mundos para maximizar tiempo.",
      en: "Once both are basic, merge worlds to maximize time.",
    },
    blocks: [
      {
        heading: {
          es: "Entorno en alemán",
          en: "German-localized environment",
        },
        body: {
          es: "IDE / docs en alemán para forzar lectura técnica (die Variable, die Funktion, der Speicher).",
          en: "IDE / docs in German to force technical reading (die Variable, die Funktion, der Speicher).",
        },
      },
      {
        heading: {
          es: "Python al servicio del alemán",
          en: "Python serving German learning",
        },
        body: {
          es: "Script que consuma APIs de diccionario/traducción (Reverso, etc.) y genere tarjetas .apkg para Anki.",
          en: "Script that consumes dictionary/translation APIs (Reverso, etc.) and generates .apkg Anki cards.",
        },
      },
    ],
  },
  {
    slug: "reglas",
    order: 5,
    title: {
      es: "Reglas de oro & checkpoints",
      en: "Golden rules & checkpoints",
    },
    summary: {
      es: "Consistencia > volumen. Medí cada 4 semanas.",
      en: "Consistency > volume. Measure every 4 weeks.",
    },
    blocks: [
      {
        heading: { es: "Sostenibilidad", en: "Sustainability" },
        body: {
          es: "Mejor 30 min alemán + 45 min Python diarios que atracones de 4 h el finde.",
          en: "Better 30 min German + 45 min Python daily than 4 h weekend binges.",
        },
        bullets: [
          {
            es: "Día laboral denso → alemán pasivo (Slow German / podcast).",
            en: "Heavy workday → passive German (Slow German / podcast).",
          },
          {
            es: "Pausa ≥ 30–45 min entre dominios.",
            en: "Break ≥ 30–45 min between domains.",
          },
        ],
      },
      {
        heading: {
          es: "Checkpoint cada 4 semanas",
          en: "Checkpoint every 4 weeks",
        },
        body: {
          es: "Dos pruebas binarias — pass/fail honestos.",
          en: "Two binary tests — honest pass/fail.",
        },
        bullets: [
          {
            es: "Python: API REST FastAPI funcional sin tutorial desde cero.",
            en: "Python: working FastAPI REST API without a from-scratch tutorial.",
          },
          {
            es: "Alemán: 5 min hablando de quién sos y tu rutina diaria.",
            en: "German: 5 min talking about who you are and your daily routine.",
          },
        ],
      },
    ],
  },
];

export function getDualTrackSection(
  slug: string,
): DualTrackSection | undefined {
  return DUAL_TRACK_SECTIONS.find((s) => s.slug === slug);
}

export function dualLocalized(
  locale: string,
  text: LocalizedText,
): string {
  return locale === "en" ? text.en : text.es;
}
