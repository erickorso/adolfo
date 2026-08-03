/** Rutas internas de módulos de aprendizaje vinculados a cursos del catálogo. */
const INTERNAL_MODULE_PATHS: Record<string, string> = {
  "microsoft:ai-agents-for-beginners": "/learn/ai-agents",
  "local:english-songs": "/learn/songs-english",
  "local:ai-practitioner-path": "/learn/ai-practitioner-path",
  "local:web-performance": "/learn/web-performance",
  "local:fullstack-kit": "/sandbox/kit",
  "local:python-deutsch": "/learn/python-deutsch",
  "local:python-ai": "/learn/python-ai",
};

export function getCourseInternalModulePath(
  source: string,
  externalId: string,
): string | undefined {
  return INTERNAL_MODULE_PATHS[`${source}:${externalId}`];
}
