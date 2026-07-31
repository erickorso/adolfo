import { z } from "zod";

/** Contratos del Kit fullstack (Next BFF + Fastify microservicio). */
export const kitItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200),
  done: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const createKitItemSchema = z.object({
  title: z.string().trim().min(1).max(200),
});

export const updateKitItemSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    done: z.boolean().optional(),
  })
  .refine((b) => b.title !== undefined || b.done !== undefined, {
    message: "title o done requerido",
  });

export type KitItemDTO = z.infer<typeof kitItemSchema>;
export type CreateKitItemInput = z.infer<typeof createKitItemSchema>;
export type UpdateKitItemInput = z.infer<typeof updateKitItemSchema>;
