/** Registro normalizado de certificado profesional (FP corto / Grado C). */
export type NormalizedFpCertificate = {
  source: "fp-certificado";
  externalId: string;
  title: string;
  description: string;
  family: string | null;
  level: 1 | 2 | 3;
  requiresBachiller: boolean;
  hours: number;
  modality: string;
  url: string;
  programUrl: string | null;
  teleformation: string | null;
  provider: string;
  location: string;
};

export type FpIngestResult = {
  ingested: number;
  hiddenStale: number;
  source: "fp-certificado";
};
