/** Espejo de src/domain/streaming-metrics/schemas.ts — mantener en sync. */
import { z } from "zod";
import type { TopContentQuery } from "./types.js";

export const getTokenBodySchema = z.object({
  clientId: z.string().min(1, "clientId es requerido"),
  clientSecret: z.string().min(1, "clientSecret es requerido"),
});

export type GetTokenInput = z.infer<typeof getTokenBodySchema>;

export const topContentQuerySchema = z
  .object({
    from: z.coerce.date({ error: "from must be a valid ISO date" }),
    to: z.coerce.date({ error: "to must be a valid ISO date" }),
    country: z.string().min(2).max(2).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    page: z.coerce.number().int().min(1).default(1),
  })
  .refine((data) => data.from <= data.to, {
    message: "must be after from",
    path: ["to"],
  });

export type ParsedTopContentQuery = z.infer<typeof topContentQuerySchema>;

export function parseGetTokenBody(
  raw: unknown,
):
  | { success: true; data: GetTokenInput }
  | { success: false; error: Record<string, string[] | undefined> } {
  const parsed = getTokenBodySchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }
  return { success: true, data: parsed.data };
}

export function parseTopContentQuery(
  raw: Record<string, string | undefined>,
):
  | { success: true; data: TopContentQuery }
  | { success: false; error: Record<string, string[] | undefined> } {
  const parsed = topContentQuerySchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }
  return { success: true, data: parsed.data };
}
