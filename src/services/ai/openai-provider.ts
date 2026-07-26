import {
  AiProviderError,
  type AiProvider,
  type GenerateTextParams,
} from "./ai-provider";

const BASE_URL = "https://api.openai.com/v1/chat/completions";

type OpenAiResponse = {
  choices?: Array<{ message?: { content?: string | null } }>;
};

/**
 * Adapter OpenAI Chat Completions vía REST — sin SDK.
 */
export class OpenAiProvider implements AiProvider {
  readonly id: string;

  constructor(
    private readonly apiKey: string | undefined,
    private readonly model: string,
  ) {
    this.id = `openai:${model}`;
  }

  async generateText(params: GenerateTextParams): Promise<string> {
    if (!this.apiKey) {
      throw new AiProviderError(
        "Falta OPENAI_API_KEY para usar el asistente de IA.",
      );
    }

    const messages: Array<{ role: string; content: string }> = [];
    if (params.system) {
      messages.push({ role: "system", content: params.system });
    }
    messages.push({ role: "user", content: params.prompt });

    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        max_tokens: params.maxOutputTokens ?? 2048,
        temperature: params.temperature ?? 0.4,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      throw new AiProviderError(`OpenAI respondió ${res.status}: ${detail}`);
    }

    const data = (await res.json()) as OpenAiResponse;
    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) {
      throw new AiProviderError("OpenAI devolvió una respuesta vacía.");
    }
    return text;
  }
}
