import "server-only";
import { env } from "@/lib/env";
import { verifyHmacSignature } from "@/lib/webhook-signature";
import type { CreateChargeInput, CreateChargeResult } from "./uala.types";

/**
 * Service Pattern para Ualá Bis.
 *
 * Responsabilidad única: hablar con la API de Ualá. No conoce Prisma ni Next.
 * La lógica de negocio (impactar el pedido) vive en order.service / route handler.
 *
 * NOTA: los endpoints y la forma exacta de los payloads deben ajustarse contra
 * la documentación oficial de Ualá Bis. Acá modelamos el contrato esperado.
 */
export class UalaService {
  constructor(
    private readonly config: {
      baseUrl: string;
      clientId: string;
      clientSecret: string;
      webhookSecret: string;
    },
  ) {}

  /** Crea un cobro y devuelve la URL de checkout. */
  async createCharge(input: CreateChargeInput): Promise<CreateChargeResult> {
    const response = await fetch(`${this.config.baseUrl}/v1/charges`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await this.getAccessToken()}`,
        // La idempotencia también se envía como header para que Ualá deduplique.
        "Idempotency-Key": input.idempotencyKey,
      },
      body: JSON.stringify({
        amount: input.amountCents,
        currency: input.currency,
        external_reference: input.orderId,
        idempotency_key: input.idempotencyKey,
        return_url: input.returnUrl,
        description: input.description,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new UalaApiError(
        `Ualá rechazó la creación del cobro (${response.status})`,
        response.status,
        detail,
      );
    }

    const data = (await response.json()) as {
      id: string;
      checkout_url: string;
    };

    return { paymentId: data.id, checkoutUrl: data.checkout_url };
  }

  /**
   * Verifica la firma HMAC del webhook usando comparación a tiempo constante.
   * Se llama con el body CRUDO (string), antes de parsear JSON.
   */
  verifyWebhookSignature(rawBody: string, signature: string): boolean {
    return verifyHmacSignature(rawBody, signature, this.config.webhookSecret);
  }

  /** Obtiene un access token (OAuth client_credentials). Cacheable a futuro. */
  private async getAccessToken(): Promise<string> {
    const response = await fetch(`${this.config.baseUrl}/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "client_credentials",
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
      }),
    });

    if (!response.ok) {
      throw new UalaApiError(
        `No se pudo autenticar contra Ualá (${response.status})`,
        response.status,
      );
    }

    const data = (await response.json()) as { access_token: string };
    return data.access_token;
  }
}

/** Error tipado para diferenciar fallos de Ualá del resto. */
export class UalaApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly detail?: string,
  ) {
    super(message);
    this.name = "UalaApiError";
  }
}

/**
 * Instancia configurada desde el entorno. Las vars de Ualá son opcionales (el
 * checkout aún no está conectado); si se invoca sin configurar, fallará en uso.
 */
export const ualaService = new UalaService({
  baseUrl: env.UALA_API_BASE_URL ?? "",
  clientId: env.UALA_CLIENT_ID ?? "",
  clientSecret: env.UALA_CLIENT_SECRET ?? "",
  webhookSecret: env.UALA_WEBHOOK_SECRET ?? "",
});
