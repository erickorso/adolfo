import { z } from "zod";

const statusSchema = z.enum([
  "SAVED",
  "APPLIED",
  "SCREEN",
  "TECH",
  "FINAL",
  "OFFER",
  "REJECTED",
  "GHOSTED",
]);

const optionalUrl = z
  .string()
  .trim()
  .url("URL inválida")
  .optional()
  .or(z.literal(""))
  .transform((v) => (v ? v : null));

const optionalText = z
  .string()
  .trim()
  .max(2000)
  .optional()
  .or(z.literal(""))
  .transform((v) => (v ? v : null));

export const createJobApplicationSchema = z.object({
  company: z.string().trim().min(1, "Empresa requerida").max(200),
  title: z.string().trim().min(1, "Rol requerido").max(200),
  url: optionalUrl,
  source: optionalText,
  status: statusSchema.default("SAVED"),
  appliedAt: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? new Date(v) : null)),
  nextStep: optionalText,
  notes: optionalText,
  jobPostingId: z.string().cuid().optional().or(z.literal("")).transform((v) => (v ? v : null)),
});

export const updateJobApplicationStatusSchema = z.object({
  applicationId: z.string().cuid(),
  status: statusSchema,
});

export const deleteJobApplicationSchema = z.object({
  applicationId: z.string().cuid(),
});

export const updateJobApplicationSchema = z.object({
  applicationId: z.string().cuid(),
  status: statusSchema.optional(),
  nextStep: optionalText,
  notes: optionalText,
});

export type UpdateJobApplicationForm = z.infer<typeof updateJobApplicationSchema>;

export type CreateJobApplicationForm = z.infer<typeof createJobApplicationSchema>;
