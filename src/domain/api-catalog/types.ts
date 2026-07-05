export type ApiCatalogKind = "internal" | "external";

export type ApiCatalogEntry = {
  id: string;
  kind: ApiCatalogKind;
  name: string;
  description: { es: string; en: string };
  /** Ruta nuestra (solo internal) o path de prueba */
  path?: string;
  method?: "GET" | "POST";
  /** URL upstream (external) o documentación */
  upstreamUrl?: string;
  postmanFolder?: string;
  sandboxPath?: string;
};

export type ApiProbeResult = {
  id: string;
  ok: boolean;
  latencyMs: number;
  message: string;
  statusCode?: number;
};

export type ApiProbeReport = {
  checkedAt: string;
  probes: ApiProbeResult[];
  allOk: boolean;
  failedCount: number;
};
