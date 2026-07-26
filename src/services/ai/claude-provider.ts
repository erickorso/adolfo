import {
  AiProviderError,
  type AiProvider,
  type GenerateTextParams,
} from "./ai-provider";

const BASE_URL = "https://api.anthropic.com/v1/messages";

type ClaudeResponse = {
  content?: Array<{ type?: string; text?: string }>;
};

/**
 * Adapter Anthropic Claude Messages API vía REST — sin SDK.
 */
export class ClaudeProvider implements AiProvider {
  readonly id: string;

  constructor(
    private readonly apiKey: string | undefined,
    private readonly model: string,
  ) {
    this.id = `claude:${model}`;
  }

  async generateText(params: GenerateTextParams): Promise<string> {
    if (!this.apiKey) {
      throw new AiProviderError(
        "Falta ANTHROPIC_API_KEY para usar el asistente de IA.",
      );
    }

    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: params.maxOutputTokens ?? 2048,
        temperature: params.temperature ?? 0.4,
        ...(params.system ? { system: params.system } : {}),
        messages: [{ role: "user", content: params.prompt }],
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      throw new AiProviderError(`Claude respondió ${res.status}: ${detail}`);
    }

    const data = (await res.json()) as ClaudeResponse;
    const text = data.content
      ?.filter((b) => b.type === "text")
      .map((b) => b.text ?? "")
      .join("")
      .trim();

    if (!text) {
      throw new AiProviderError("Claude devolvió una respuesta vacía.");
    }
    return text;
  }
}
