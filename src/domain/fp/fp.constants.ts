/** Source fijo del catálogo FP (nunca reutilizar en Course). */
export const FP_CERTIFICADO_SOURCE = "fp-certificado" as const;

export const FP_PROVIDER_DEFAULT = "SEPE · Certificado profesional" as const;

/** Open Data JCyL (espejo catálogo SEPE; ~583 registros). */
export const FP_JCYL_API_BASE =
  "https://analisis.datosabiertos.jcyl.es/api/explore/v2.1/catalog/datasets/certificados-profesionalidad/records";

export const FP_JCYL_PAGE_SIZE = 100;
