import "server-only";
import { env } from "@/lib/env";
import type { AiProvider } from "./ai-provider";
import { GeminiProvider } from "./gemini-provider";

/**
 * Proveedor de IA configurado según el entorno. Hoy solo Gemini; al sumar
 * Claude/OpenAI se elige acá por `AI_PROVIDER`, sin tocar a los consumidores.
 */
function createAiProvider(): AiProvider {
  switch (env.AI_PROVIDER) {
    case "gemini":
    default:
      return new GeminiProvider(env.GEMINI_API_KEY, env.GEMINI_MODEL);
  }
}

export const aiProvider: AiProvider = createAiProvider();

export type { AiProvider } from "./ai-provider";
