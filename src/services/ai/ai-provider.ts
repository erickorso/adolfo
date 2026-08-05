/**
 * Abstracción de proveedor de IA (texto). La app depende de esta interfaz, no
 * de Gemini/Claude/OpenAI. Mismo patrón que Storage y JobSource: cambiar de
 * proveedor = una clase nueva + un cambio de config, sin tocar el dominio.
 */
export type GenerateTextParams = {
  /** Instrucción de sistema (rol/comportamiento). */
  system?: string;
  /** Prompt del usuario. */
  prompt: string;
  maxOutputTokens?: number;
  temperature?: number;
};

export interface AiProvider {
  /** Nombre/modelo, se guarda en ResumeReview para trazabilidad. */
  readonly id: string;
  generateText(params: GenerateTextParams): Promise<string>;
}

/** Error tipado para fallos del proveedor de IA. */
export class AiProviderError extends Error {
  readonly code?: "AI_QUOTA" | "AI_PROVIDER";
  readonly httpStatus?: number;
  readonly retryAfterSec?: number;

  constructor(
    message: string,
    opts?: {
      code?: "AI_QUOTA" | "AI_PROVIDER";
      httpStatus?: number;
      retryAfterSec?: number;
    },
  ) {
    super(message);
    this.name = "AiProviderError";
    this.code = opts?.code;
    this.httpStatus = opts?.httpStatus;
    this.retryAfterSec = opts?.retryAfterSec;
  }
}
