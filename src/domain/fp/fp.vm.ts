export type FpCertificateVM = {
  id: string;
  externalId: string;
  title: string;
  description: string | null;
  family: string | null;
  level: number;
  requiresBachiller: boolean;
  hours: number;
  modality: string;
  url: string;
  programUrl: string | null;
  teleformation: string | null;
  provider: string;
  location: string | null;
};

export type FpSearchQuery = {
  q?: string;
  /** 1 | 2 | 3 */
  level?: number;
  /** true = solo con Bachiller (nivel 3); false = sin (1–2) */
  requiresBachiller?: boolean;
};
