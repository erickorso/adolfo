import "server-only";
import { extractText, getDocumentProxy } from "unpdf";
import { isPdf } from "./resume.policy";

/**
 * Extrae el texto de un CV para alimentar a la IA.
 * Por ahora solo PDF (unpdf, sin dependencias nativas, sirve en serverless).
 * Para otros formatos devuelve null (la mejora por IA quedará deshabilitada).
 */
export async function extractResumeText(
  bytes: Buffer,
  mimeType: string,
): Promise<string | null> {
  if (!isPdf(mimeType)) {
    return null;
  }
  try {
    const pdf = await getDocumentProxy(new Uint8Array(bytes));
    const { text } = await extractText(pdf, { mergePages: true });
    const trimmed = text.trim();
    return trimmed.length > 0 ? trimmed : null;
  } catch (error) {
    console.error("No se pudo extraer texto del PDF:", error);
    return null;
  }
}
