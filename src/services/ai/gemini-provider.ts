import {
  AiProviderError,
  type AiProvider,
  type GenerateTextParams,
} from "./ai-provider";

const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

type GeminiResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
};

/**
 * Adapter de Google Gemini (API de AI Studio) vía REST — sin SDK.
 * La key se valida en uso (no en construcción) para no romper el build/test
 * cuando todavía no está configurada.
 */
export class GeminiProvider implements AiProvider {
  readonly id: string;

  constructor(
    private readonly apiKey: string | undefined,
    private readonly model: string,
  ) {
    this.id = `gemini:${model}`;
  }

  async generateText(params: GenerateTextParams): Promise<string> {
    if (!this.apiKey) {
      throw new AiProviderError(
        "Falta GEMINI_API_KEY para usar el asistente de IA.",
      );
    }

    const res = await fetch(`${BASE_URL}/${this.model}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": this.apiKey,
      },
      body: JSON.stringify({
        ...(params.system
          ? { systemInstruction: { parts: [{ text: params.system }] } }
          : {}),
        contents: [{ role: "user", parts: [{ text: params.prompt }] }],
        generationConfig: {
          maxOutputTokens: params.maxOutputTokens ?? 2048,
          temperature: params.temperature ?? 0.4,
        },
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      const lower = detail.toLowerCase();
      const isQuota =
        res.status === 429 ||
        lower.includes("resource_exhausted") ||
        lower.includes("quota") ||
        lower.includes("rate limit");
      if (isQuota) {
        const retryHeader = res.headers.get("retry-after");
        const retryAfterSec = retryHeader
          ? Number.parseInt(retryHeader, 10)
          : undefined;
        throw new AiProviderError(
          `Cuota de Gemini agotada (${res.status}): ${detail}`,
          {
            code: "AI_QUOTA",
            httpStatus: 429,
            retryAfterSec:
              Number.isFinite(retryAfterSec) && (retryAfterSec ?? 0) > 0
                ? retryAfterSec
                : undefined,
          },
        );
      }
      throw new AiProviderError(`Gemini respondió ${res.status}: ${detail}`, {
        code: "AI_PROVIDER",
        httpStatus: 502,
      });
    }

    const data = (await res.json()) as GeminiResponse;
    const text = data.candidates?.[0]?.content?.parts
      ?.map((p) => p.text ?? "")
      .join("")
      .trim();

    if (!text) {
      throw new AiProviderError("Gemini devolvió una respuesta vacía.");
    }
    return text;
  }
}
