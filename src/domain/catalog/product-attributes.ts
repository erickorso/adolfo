import { z } from "zod";

/**
 * Atributos/propiedades custom de un producto (name → value).
 * Flexible (cualquier nombre) y, al ser relacional en la DB, buscable.
 */
export const productAttributeInputSchema = z.object({
  name: z.string().trim().min(1).max(60),
  value: z.string().trim().min(1).max(200),
});

export const productAttributesInputSchema = z
  .array(productAttributeInputSchema)
  .max(30);

export type ProductAttributeInput = z.infer<typeof productAttributeInputSchema>;

/**
 * Parsea el JSON de atributos que envía el form del admin. Tolerante: descarta
 * todo si no es válido (devuelve []).
 */
export function parseAttributesJson(raw: string): ProductAttributeInput[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    const result = productAttributesInputSchema.safeParse(parsed);
    return result.success ? result.data : [];
  } catch {
    return [];
  }
}
