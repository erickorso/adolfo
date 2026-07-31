import { z } from "zod";

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

export type KitItem = {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
  updatedAt: string;
};
