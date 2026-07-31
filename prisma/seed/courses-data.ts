export type SeedCourseSpec = {
  source: string;
  externalId: string;
  title: string;
  description?: string;
  provider: string;
  url: string;
  hours: number;
  modality: string;
  sector?: string;
  location?: string;
  targetAudience?: string;
};

/** Catálogo inicial — formación subvencionada Madrid / online (≥100h donde aplica). */
export const SEED_COURSES: SeedCourseSpec[] = [
  {
    source: "formate",
    externalId: "formate-digital-telecom",
    title: "Telecomunicaciones, economía e industria digital",
    description:
      "Formación online subvencionada vía Fórmate.es. Diploma acreditativo. Modalidad flexible.",
    provider: "Fórmate.es",
    url: "https://www.formate.es/",
    hours: 120,
    modality: "online",
    sector: "Telecomunicaciones, economía e industria digital",
    location: "España · online",
    targetAudience: "Desempleados, autónomos, empleados",
  },
  {
    source: "formate",
    externalId: "formate-programacion",
    title: "Programación y desarrollo de software",
    description:
      "Cursos gratuitos subvencionados en desarrollo y tecnología. Buscar por sector en formate.es.",
    provider: "Fórmate.es",
    url: "https://www.formate.es/",
    hours: 200,
    modality: "online",
    sector: "Información, comunicación y artes gráficas",
    location: "España · online",
    targetAudience: "Desempleados, autónomos, empleados",
  },
  {
    source: "sepe-cam",
    externalId: "cam-ofimatica-100",
    title: "Ofimática",
    description:
      "Especialidad formativa SEPE + Comunidad de Madrid. Teleformación 100 horas.",
    provider: "SEPE / Comunidad de Madrid",
    url: "https://cursossepe.es/cursos-gratuitos/madrid/trabajadores",
    hours: 100,
    modality: "online",
    sector: "Administración y gestión",
    location: "Comunidad de Madrid",
    targetAudience: "Trabajadores y autónomos CAM",
  },
  {
    source: "sepe-cam",
    externalId: "cam-salario-contratacion-100",
    title: "Salario y contratación",
    description:
      "Curso subvencionado 100 horas en teleformación para trabajadores de la CAM.",
    provider: "SEPE / Comunidad de Madrid",
    url: "https://cursossepe.es/cursos-gratuitos/madrid/trabajadores",
    hours: 100,
    modality: "online",
    sector: "Administración y gestión",
    location: "Comunidad de Madrid",
    targetAudience: "Trabajadores y autónomos CAM",
  },
  {
    source: "sepe-cam",
    externalId: "cam-ingles-a2-150",
    title: "Inglés A2",
    description: "Teleformación 150 horas. Diploma SEPE y CAM.",
    provider: "SEPE / Comunidad de Madrid (APECED)",
    url: "https://apeced.es/curso/catalogo-general/",
    hours: 150,
    modality: "online",
    sector: "Idiomas",
    location: "Comunidad de Madrid",
    targetAudience: "Trabajadores, autónomos y desempleados CAM",
  },
  {
    source: "sepe-cam",
    externalId: "cam-gestion-marketing-810",
    title: "Gestión de marketing y comunicación",
    description: "Aula virtual 810 horas. Certificado de profesionalidad.",
    provider: "SEPE / Comunidad de Madrid (APECED)",
    url: "https://apeced.es/curso/catalogo-general/",
    hours: 810,
    modality: "online",
    sector: "Comercio y marketing",
    location: "Comunidad de Madrid",
    targetAudience: "Trabajadores, autónomos y desempleados CAM",
  },
  {
    source: "sepe-cam",
    externalId: "cam-liderazgo-100-presencial",
    title: "Liderazgo y dirección de organizaciones",
    description: "100 horas presencial en Madrid. Consultar convocatoria vigente.",
    provider: "SEPE / Comunidad de Madrid",
    url: "https://apeced.es/curso/catalogo-general/",
    hours: 100,
    modality: "presencial",
    sector: "Administración y gestión",
    location: "Madrid",
    targetAudience: "Trabajadores y desempleados CAM",
  },
  {
    source: "microsoft",
    externalId: "ai-agents-for-beginners",
    title: "AI Agents for Beginners",
    description:
      "Curso oficial de Microsoft (17 lecciones): agentes de IA, MAF, Azure AI Foundry, RAG, multi-agente, MCP y producción.\n\nMódulo integrado en Adolfo: /learn/ai-agents\nRepo: github.com/microsoft/ai-agents-for-beginners",
    provider: "Microsoft",
    url: "https://github.com/microsoft/ai-agents-for-beginners",
    hours: 24,
    modality: "online",
    sector: "IA · Agentes · Python",
    location: "Global · online",
    targetAudience: "Developers building AI agents",
  },
  {
    source: "local",
    externalId: "english-songs",
    title: "Aprender inglés con canciones",
    description:
      "Letras en inglés con traducción al español, PDF descargable y notas de idioms y referencias culturales.\n\nMódulo integrado en Adolfo: /learn/songs-english",
    provider: "Adolfo",
    url: "/learn/songs-english",
    hours: 20,
    modality: "online",
    sector: "Idiomas · Inglés · Música",
    location: "Global · online",
    targetAudience: "Aprendices de inglés (A2–B2)",
  },
  {
    source: "local",
    externalId: "ai-practitioner-path",
    title: "Roadmap practicante IA",
    description:
      "Path en 4 fases: fundamentos, dev agentic, automatización (n8n/Docker/Ollama) y producto/portfolio. Entregables verificables en Adolfo.\n\nMódulo integrado: /learn/ai-practitioner-path",
    provider: "Adolfo",
    url: "/learn/ai-practitioner-path",
    hours: 80,
    modality: "online",
    sector: "IA · Agentes · Automatización",
    location: "Global · online",
    targetAudience: "Developers aprendiendo IA aplicada",
  },
  {
    source: "local",
    externalId: "fullstack-kit",
    title: "Fullstack Kit — Node + React + Postgres",
    description: [
      "Qué es",
      "Mini-proyecto fullstack dentro de Adolfo: un microservicio de ítems (CRUD) que se consume y se muestra en la UI del sandbox.",
      "",
      "Qué hace",
      "• Alta, listado, actualización y borrado de KitItem (tareas/notas de demo).",
      "• Valida payloads con Zod (title, done).",
      "• Expone el mismo contrato REST en dos procesos: BFF Next (prod) y twin Fastify (local/cloud).",
      "",
      "Cómo lo hace (arquitectura)",
      "1) UI /sandbox/kit → llama a /api/kit/items (mismo origen).",
      "2) Sin KIT_API_URL: Next (BFF) habla con Postgres/Neon vía Prisma.",
      "3) Con KIT_API_URL: el BFF hace proxy al microservicio Fastify publicado (Railway/Fly).",
      "4) services/kit-api: Fastify + store en memoria (demo de proceso Node independiente).",
      "",
      "Tecnologías",
      "• Frontend: React, Next.js App Router, TypeScript, next-intl",
      "• BFF: Route Handlers Next, Prisma, PostgreSQL (Neon)",
      "• Microservicio: Fastify, Zod, @fastify/cors, Vitest, Docker",
      "• Ops: npm scripts, healthcheck /health, deploy Railway (Dockerfile)",
      "",
      "Cómo probar",
      "• Módulo: /sandbox/kit",
      "• Local twin: npm run dev:kit-api → http://localhost:4001/health",
      "• Postman: carpeta Kit (Fullstack)",
    ].join("\n"),
    provider: "Adolfo",
    url: "/sandbox/kit",
    hours: 16,
    modality: "online",
    sector: "Fullstack · Node · TypeScript · Microservicios",
    location: "Global · online",
    targetAudience: "Frontend mid/senior hacia fullstack JS",
  },
  {
    source: "local",
    externalId: "python-deutsch",
    title: "Python + Alemán — dual track",
    description:
      "Time-blocking 10–12 h/semana: Alemán A1→A2 (Anki, Nicos Weg, gramática) en paralelo con Python Pythonic (Exercism, FastAPI). Sinergia mes 2–3 y checkpoints cada 4 semanas.\n\nMódulo: /learn/python-deutsch",
    provider: "Adolfo",
    url: "/learn/python-deutsch",
    hours: 12,
    modality: "online",
    sector: "Idiomas · Python · Productividad",
    location: "Global · online",
    targetAudience: "Devs con lógica sólida aprendiendo Python + Deutsch",
  },
  {
    source: "local",
    externalId: "sanse-ayuntamiento-info",
    title: "Formación municipal San Sebastián de los Reyes",
    description:
      "Consultar oferta local (empleo, orientación, cursos) en el Ayuntamiento de SSR.",
    provider: "Ayuntamiento SSR",
    url: "https://www.ssreyes.org/",
    hours: 100,
    modality: "mixta",
    sector: "Empleo y orientación",
    location: "San Sebastián de los Reyes",
    targetAudience: "Residentes SSR",
  },
];

export async function seedCourses(
  prisma: import("../../src/generated/prisma/client").PrismaClient,
): Promise<number> {
  let count = 0;
  for (const course of SEED_COURSES) {
    await prisma.course.upsert({
      where: {
        source_externalId: {
          source: course.source,
          externalId: course.externalId,
        },
      },
      create: { ...course, free: true },
      update: { ...course, free: true, hidden: false },
    });
    count += 1;
  }
  return count;
}
