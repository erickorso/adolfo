import { z } from "zod";

/**
 * Lógica pura del asistente de CV: construcción del prompt y parseo de la
 * respuesta. Sin IO ni dependencias de proveedor → testeable de forma aislada.
 */

export type TailorInput = {
  resumeText: string;
  jobTitle: string;
  jobCompany: string;
  jobDescription: string;
};

export type ResumeImprovement = {
  suggestions: string;
  rewrite: string;
};

/** Esquema de la salida estructurada que pedimos al modelo. */
export const improvementSchema = z.object({
  suggestions: z.string().min(1),
  rewrite: z.string().min(1),
});

const SYSTEM =
  "Sos un experto en reclutamiento técnico y redacción de CVs. " +
  "Adaptás CVs a ofertas concretas siendo honesto: nunca inventás experiencia " +
  "ni datos que no estén en el CV original. Respondés en español.";

/** Construye system + prompt. El prompt pide JSON estricto con dos secciones. */
export function buildResumePrompt(input: TailorInput): {
  system: string;
  prompt: string;
} {
  const prompt = [
    "Analizá el siguiente CV en relación a la oferta y devolvé EXCLUSIVAMENTE un",
    'objeto JSON válido con esta forma exacta: {"suggestions": string, "rewrite": string}.',
    "No incluyas texto fuera del JSON ni bloques de código.",
    "",
    "- `suggestions`: lista en Markdown de mejoras concretas y accionables",
    "  (keywords faltantes de la oferta, bullets a reescribir, qué resaltar).",
    "- `rewrite`: el CV completo reescrito en Markdown, adaptado a la oferta,",
    "  usando SOLO información presente en el CV original.",
    "",
    `## Oferta: ${input.jobTitle} — ${input.jobCompany}`,
    input.jobDescription,
    "",
    "## CV actual",
    input.resumeText,
  ].join("\n");

  return { system: SYSTEM, prompt };
}

/** Parsea la respuesta del modelo a {suggestions, rewrite}, tolerando fences. */
export function parseImprovement(raw: string): ResumeImprovement {
  const cleaned = stripCodeFences(raw).trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("La respuesta de la IA no contiene un objeto JSON.");
  }
  const json = cleaned.slice(start, end + 1);
  const parsed: unknown = JSON.parse(json);
  return improvementSchema.parse(parsed);
}

/** Quita fences ```json ... ``` si el modelo los agrega. */
function stripCodeFences(text: string): string {
  return text.replace(/```(?:json)?/gi, "");
}
