import {
  AiProviderError,
  type AiProvider,
  type GenerateTextParams,
} from "./ai-provider";

type HttpAiResponse = {
  text?: string;
  model?: string;
};

/**
 * Proxy HTTP hacia el servicio Python (`ai-python`) u otro backend LLM.
 * Body: `{ system?, prompt, max_tokens?, temperature? }` → `{ text }`.
 */
export class HttpAiProvider implements AiProvider {
  readonly id: string;

  constructor(private readonly baseUrl: string | undefined) {
    this.id = `http:${baseUrl ?? "unset"}`;
  }

  async generateText(params: GenerateTextParams): Promise<string> {
    if (!this.baseUrl) {
      throw new AiProviderError(
        "Falta AI_PYTHON_URL para usar el proveedor HTTP/Python.",
      );
    }

    const url = `${this.baseUrl.replace(/\/$/, "")}/v1/generate`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system: params.system,
        prompt: params.prompt,
        max_tokens: params.maxOutputTokens ?? 2048,
        temperature: params.temperature ?? 0.4,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      throw new AiProviderError(
        `AI Python respondió ${res.status}: ${detail}`,
      );
    }

    const data = (await res.json()) as HttpAiResponse;
    const text = data.text?.trim();
    if (!text) {
      throw new AiProviderError("AI Python devolvió una respuesta vacía.");
    }
    return text;
  }
}
