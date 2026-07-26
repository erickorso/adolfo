import "server-only";
import { env } from "@/lib/env";
import type { AiProvider } from "./ai-provider";
import { ClaudeProvider } from "./claude-provider";
import { GeminiProvider } from "./gemini-provider";
import { HttpAiProvider } from "./http-provider";
import { OpenAiProvider } from "./openai-provider";

/**
 * Proveedor de IA según `AI_PROVIDER`.
 * gemini | openai | claude | python (HTTP → ai-python).
 */
function createAiProvider(): AiProvider {
  switch (env.AI_PROVIDER) {
    case "openai":
      return new OpenAiProvider(env.OPENAI_API_KEY, env.OPENAI_MODEL);
    case "claude":
      return new ClaudeProvider(env.ANTHROPIC_API_KEY, env.ANTHROPIC_MODEL);
    case "python":
      return new HttpAiProvider(env.AI_PYTHON_URL);
    case "gemini":
    default:
      return new GeminiProvider(env.GEMINI_API_KEY, env.GEMINI_MODEL);
  }
}

export const aiProvider: AiProvider = createAiProvider();

export type { AiProvider } from "./ai-provider";
