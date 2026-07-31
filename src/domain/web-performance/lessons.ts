import type { LocalizedText } from "@/domain/learning/songs-english/song.types";

export type PerfLesson = {
  slug: string;
  order: number;
  title: LocalizedText;
  summary: LocalizedText;
  sections: {
    heading: LocalizedText;
    body: LocalizedText;
  }[];
  tools: LocalizedText[];
};

export const WEB_PERF_MODULE_ID = "web-performance";

export const PERF_LESSONS: PerfLesson[] = [
  {
    slug: "lab-vs-field",
    order: 1,
    title: {
      es: "Lab vs Field (RUM)",
      en: "Lab vs Field (RUM)",
    },
    summary: {
      es: "Lighthouse es un faro en tu máquina. CrUX/RUM es lo que viven usuarios reales.",
      en: "Lighthouse is a beacon on your machine. CrUX/RUM is what real users live.",
    },
    tools: [
      {
        es: "Lighthouse (Chrome / extensión farito)",
        en: "Lighthouse (Chrome / lighthouse extension)",
      },
      {
        es: "Web Vitals extension (overlay CLS)",
        en: "Web Vitals extension (CLS overlay)",
      },
      {
        es: "CrUX / Search Console / este dashboard RUM",
        en: "CrUX / Search Console / this RUM dashboard",
      },
    ],
    sections: [
      {
        heading: { es: "Lab", en: "Lab" },
        body: {
          es: "Una corrida controlada (throttling, cold cache). Sirve para reproducir y debuggear. No priorices solo con lab: el P75 de campo manda.",
          en: "A controlled run (throttling, cold cache). Great to reproduce and debug. Don't prioritize on lab alone: field P75 wins.",
        },
      },
      {
        heading: { es: "Field / RUM", en: "Field / RUM" },
        body: {
          es: "Métricas de sesiones reales (dispositivo, red, país). Google rankea con field. En Adolfo, cada visita envía LCP/INP/CLS a Neon.",
          en: "Metrics from real sessions (device, network, country). Google ranks on field. In Adolfo, each visit sends LCP/INP/CLS to Neon.",
        },
      },
      {
        heading: { es: "Cómo decidir", en: "How to decide" },
        body: {
          es: "1) Mirar P75 field. 2) Si falla, reproducir en lab con Lighthouse + Performance panel. 3) Fix. 4) Verificar field otra vez.",
          en: "1) Check field P75. 2) If bad, reproduce in lab with Lighthouse + Performance. 3) Fix. 4) Re-check field.",
        },
      },
    ],
  },
  {
    slug: "lcp",
    order: 2,
    title: {
      es: "LCP — Largest Contentful Paint",
      en: "LCP — Largest Contentful Paint",
    },
    summary: {
      es: "Cuándo aparece el elemento más grande del viewport. Good ≤ 2.5s (P75).",
      en: "When the largest viewport element paints. Good ≤ 2.5s (P75).",
    },
    tools: [
      { es: "Performance panel → Timings", en: "Performance panel → Timings" },
      { es: "Lighthouse → LCP element", en: "Lighthouse → LCP element" },
      { es: "Network waterfall", en: "Network waterfall" },
    ],
    sections: [
      {
        heading: { es: "Qué mirar", en: "What to inspect" },
        body: {
          es: "Identificá el LCP element (img, texto H1, video poster). Revisá TTFB, delay de recurso, delay de render.",
          en: "Identify the LCP element (img, H1 text, video poster). Check TTFB, resource delay, render delay.",
        },
      },
      {
        heading: { es: "Fixes típicos", en: "Typical fixes" },
        body: {
          es: "priority/fetchpriority en hero, preload, image sizing/WebP, SSR del HTML crítico, menos JS bloqueante en head.",
          en: "priority/fetchpriority on hero, preload, image sizing/WebP, SSR critical HTML, less blocking JS in head.",
        },
      },
    ],
  },
  {
    slug: "inp",
    order: 3,
    title: {
      es: "INP — Interaction to Next Paint",
      en: "INP — Interaction to Next Paint",
    },
    summary: {
      es: "Latencia de interacción (click/tap/tecla) hasta el siguiente frame. Good ≤ 200ms.",
      en: "Interaction latency until next paint. Good ≤ 200ms.",
    },
    tools: [
      { es: "Performance → Interactions", en: "Performance → Interactions" },
      { es: "React Profiler", en: "React Profiler" },
      { es: "Long tasks (Main thread)", en: "Long tasks (Main thread)" },
    ],
    sections: [
      {
        heading: { es: "Desglose", en: "Breakdown" },
        body: {
          es: "Input delay + processing + presentation. Buscá long tasks >50ms, handlers pesados, hydration costosa, third-parties.",
          en: "Input delay + processing + presentation. Hunt long tasks >50ms, heavy handlers, costly hydration, third-parties.",
        },
      },
      {
        heading: { es: "Fixes típicos", en: "Typical fixes" },
        body: {
          es: "startTransition, defer work, code-split, virtualizar listas, aislar scripts de chat/analytics.",
          en: "startTransition, defer work, code-split, virtualize lists, isolate chat/analytics scripts.",
        },
      },
    ],
  },
  {
    slug: "cls",
    order: 4,
    title: {
      es: "CLS — Cumulative Layout Shift",
      en: "CLS — Cumulative Layout Shift",
    },
    summary: {
      es: "Estabilidad visual. Good ≤ 0.1. En Dow Jones: Lighthouse + Web Vitals overlay.",
      en: "Visual stability. Good ≤ 0.1. At Dow Jones: Lighthouse + Web Vitals overlay.",
    },
    tools: [
      {
        es: "Web Vitals extension (marcas de shift)",
        en: "Web Vitals extension (shift marks)",
      },
      { es: "Lighthouse → CLS culprits", en: "Lighthouse → CLS culprits" },
      {
        es: "Layout Shift Regions (DevTools)",
        en: "Layout Shift Regions (DevTools)",
      },
    ],
    sections: [
      {
        heading: { es: "Causas clásicas", en: "Classic causes" },
        body: {
          es: "Imágenes/iframes sin width/height, fonts (FOIT/FOUT), ads/embeds, UI que aparece arriba (banners, toasts).",
          en: "Images/iframes without width/height, fonts (FOIT/FOUT), ads/embeds, UI inserted above (banners, toasts).",
        },
      },
      {
        heading: { es: "Fixes típicos", en: "Typical fixes" },
        body: {
          es: "aspect-ratio / size attributes, font-display: optional/swap con size-adjust, reservar espacio, no insertar above-the-fold sin placeholder.",
          en: "aspect-ratio / size attrs, font-display with size-adjust, reserve space, don't inject above-the-fold without a placeholder.",
        },
      },
    ],
  },
  {
    slug: "devtools-workflow",
    order: 5,
    title: {
      es: "Flujo DevTools / Lighthouse",
      en: "DevTools / Lighthouse workflow",
    },
    summary: {
      es: "Cómo analizar una URL de punta a punta y no ahogarte en ruido.",
      en: "How to analyze a URL end-to-end without drowning in noise.",
    },
    tools: [
      { es: "Lighthouse (lab)", en: "Lighthouse (lab)" },
      { es: "Performance + flame chart", en: "Performance + flame chart" },
      { es: "Network waterfall", en: "Network waterfall" },
      { es: "Coverage / Coverage CSS-JS", en: "Coverage" },
    ],
    sections: [
      {
        heading: { es: "Checklist", en: "Checklist" },
        body: {
          es: "1) Field P75. 2) Lighthouse mobile. 3) Filmstrip LCP. 4) Waterfall del LCP resource. 5) Main-thread long tasks. 6) Una hipótesis → un fix → re-medir.",
          en: "1) Field P75. 2) Lighthouse mobile. 3) LCP filmstrip. 4) LCP resource waterfall. 5) Main-thread long tasks. 6) One hypothesis → one fix → re-measure.",
        },
      },
      {
        heading: { es: "Scores", en: "Scores" },
        body: {
          es: "El score 0–100 de Lighthouse es lab ponderado. CWV de ranking = field. No confundas Performance score con “estar en verde” en CrUX.",
          en: "Lighthouse 0–100 is weighted lab. Ranking CWV = field. Don't confuse Performance score with CrUX green.",
        },
      },
    ],
  },
  {
    slug: "memory-leaks",
    order: 6,
    title: {
      es: "Memory leaks",
      en: "Memory leaks",
    },
    summary: {
      es: "Heap snapshots, detached DOM, allocation timelines.",
      en: "Heap snapshots, detached DOM, allocation timelines.",
    },
    tools: [
      { es: "Memory → Heap snapshot", en: "Memory → Heap snapshot" },
      { es: "Allocation instrumentation", en: "Allocation instrumentation" },
      { es: "Performance monitor", en: "Performance monitor" },
    ],
    sections: [
      {
        heading: { es: "Señales", en: "Signals" },
        body: {
          es: "JS heap crece tras navegar/abrir-cerrar modales. Detached HTMLElement en snapshot. Listeners o timers sin cleanup.",
          en: "JS heap grows after navigate/open-close modals. Detached HTMLElement in snapshot. Listeners or timers without cleanup.",
        },
      },
      {
        heading: { es: "Método", en: "Method" },
        body: {
          es: "Snapshot A → reproducir N veces → Snapshot B → Comparison. Filtrar Detached. Arreglar useEffect cleanup / Map caches / observers.",
          en: "Snapshot A → repro N times → Snapshot B → Comparison. Filter Detached. Fix useEffect cleanup / Map caches / observers.",
        },
      },
    ],
  },
  {
    slug: "optimization-playbook",
    order: 7,
    title: {
      es: "Playbook de optimización",
      en: "Optimization playbook",
    },
    summary: {
      es: "Hydration, bundles, third-parties, assets — mapa de impacto.",
      en: "Hydration, bundles, third-parties, assets — impact map.",
    },
    tools: [
      { es: "Bundle analyzer", en: "Bundle analyzer" },
      { es: "React Server Components / streaming", en: "RSC / streaming" },
      { es: "CDN + cache headers", en: "CDN + cache headers" },
    ],
    sections: [
      {
        heading: { es: "Orden de ataque", en: "Attack order" },
        body: {
          es: "1) Third-party que roba main thread. 2) LCP asset. 3) JS unused / split. 4) Hydration islands. 5) Fonts/CLS. Medí field entre cada cambio.",
          en: "1) Third-party stealing main thread. 2) LCP asset. 3) Unused JS / split. 4) Hydration islands. 5) Fonts/CLS. Measure field between changes.",
        },
      },
      {
        heading: { es: "En Adolfo", en: "On Adolfo" },
        body: {
          es: "Este módulo muestra P75 real. Usalo como evidencia en entrevistas: hipótesis → fix → delta en field.",
          en: "This module shows real P75. Use it as interview evidence: hypothesis → fix → field delta.",
        },
      },
    ],
  },
];

export function getPerfLesson(slug: string): PerfLesson | undefined {
  return PERF_LESSONS.find((l) => l.slug === slug);
}

export function localized(
  locale: string,
  text: LocalizedText,
): string {
  return locale === "en" ? text.en : text.es;
}
