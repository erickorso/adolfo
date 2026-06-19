import "server-only";
import { aiProvider } from "@/services/ai";
import type { AiProvider } from "@/services/ai";
import {
  buildResumePrompt,
  parseImprovement,
  type ResumeImprovement,
  type TailorInput,
} from "./resume-tailor.prompt";

/**
 * Orquesta la mejora del CV: arma el prompt, llama al proveedor de IA y parsea
 * la salida. El proveedor se inyecta (default: el configurado) → testeable.
 */
export async function improveResume(
  input: TailorInput,
  provider: AiProvider = aiProvider,
): Promise<ResumeImprovement & { model: string }> {
  const { system, prompt } = buildResumePrompt(input);
  const raw = await provider.generateText({
    system,
    prompt,
    maxOutputTokens: 4096,
    temperature: 0.4,
  });
  const improvement = parseImprovement(raw);
  return { ...improvement, model: provider.id };
}
