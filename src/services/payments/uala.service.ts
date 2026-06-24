import "server-only";
import { formatCentsToUalaAmount } from "@/lib/uala-amount";
import { env } from "@/lib/env";
import type {
  CreateUalaOrderInput,
  CreateUalaOrderResult,
  UalaCheckoutResponse,
} from "./uala.types";

type TokenCache = {
  token: string;
  expiresAt: number;
};

/**
 * Cliente HTTP para Ualá Bis API Cobros Online v2.
 *
 * - Auth: https://developers.ualabis.com.ar/v2/authentication/create
 * - Checkout: https://developers.ualabis.com.ar/v2/orders/create
 */
export class UalaService {
  private tokenCache: TokenCache | null = null;

  constructor(
    private readonly config: {
      authUrl: string;
      checkoutUrl: string;
      username: string;
      clientId: string;
      clientSecretId: string;
    },
  ) {}

  /** Crea una orden de checkout y devuelve el link de pago. */
  async createOrder(input: CreateUalaOrderInput): Promise<CreateUalaOrderResult> {
    const response = await fetch(`${this.config.checkoutUrl}/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await this.getAccessToken()}`,
      },
      body: JSON.stringify({
        amount: formatCentsToUalaAmount(input.amountCents),
        description: input.description,
        callback_success: input.callbackSuccess,
        callback_fail: input.callbackFail,
        notification_url: input.notificationUrl,
        external_reference: input.orderId,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new UalaApiError(
        formatUalaErrorMessage(
          `Ualá rechazó la creación de la orden (${response.status})`,
          detail,
        ),
        response.status,
        detail,
      );
    }

    const data = (await response.json()) as UalaCheckoutResponse;

    return {
      orderUuid: data.uuid,
      checkoutUrl: data.links.checkout_link,
    };
  }

  /** Obtiene token Bearer (client_credentials). Cache en memoria. */
  private async getAccessToken(): Promise<string> {
    const now = Date.now();
    if (this.tokenCache && now < this.tokenCache.expiresAt - 60_000) {
      return this.tokenCache.token;
    }

    const response = await fetch(`${this.config.authUrl}/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: this.config.username,
        client_id: this.config.clientId,
        client_secret_id: this.config.clientSecretId,
        grant_type: "client_credentials",
      }),
    });

    if (!response.ok) {
      throw new UalaApiError(
        `No se pudo autenticar contra Ualá (${response.status})`,
        response.status,
      );
    }

    const data = (await response.json()) as {
      access_token: string;
      expires_in?: number;
    };
    const ttlMs = (data.expires_in ?? 3600) * 1000;
    this.tokenCache = {
      token: data.access_token,
      expiresAt: now + ttlMs,
    };
    return data.access_token;
  }
}

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

function formatUalaErrorMessage(prefix: string, detail: string): string {
  try {
    const parsed = JSON.parse(detail) as {
      message?: string;
      errors?: string[];
    };
    const parts = [prefix];
    if (parsed.message) {
      parts.push(parsed.message);
    }
    if (parsed.errors?.length) {
      parts.push(parsed.errors.join("; "));
    }
    return parts.join(": ");
  } catch {
    return detail ? `${prefix}: ${detail.slice(0, 200)}` : prefix;
  }
}

function resolveUalaConfig() {
  const authUrl =
    env.UALA_AUTH_URL ?? "https://auth.developers.ar.ua.la/v2/api";
  const checkoutUrl =
    env.UALA_CHECKOUT_URL ??
    env.UALA_API_BASE_URL ??
    "https://checkout.developers.ar.ua.la/v2/api";
  const clientSecretId =
    env.UALA_CLIENT_SECRET_ID ?? env.UALA_CLIENT_SECRET ?? "";

  return {
    authUrl,
    checkoutUrl,
    username: env.UALA_USERNAME ?? "",
    clientId: env.UALA_CLIENT_ID ?? "",
    clientSecretId,
  };
}

export const ualaService = new UalaService(resolveUalaConfig());
