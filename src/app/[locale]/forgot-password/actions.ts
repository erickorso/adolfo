"use server";

import { z } from "zod";
import { getLocale } from "next-intl/server";
import { requestPasswordReset } from "@/services/users/password-reset.service";

export type ForgotPasswordResult = { error?: string; success?: boolean };

const forgotSchema = z.object({
  email: z.email("Email inválido"),
});

/** Flujo público — reset por email sin sesión previa. */
export async function forgotPasswordAction(
  _prev: ForgotPasswordResult,
  formData: FormData,
): Promise<ForgotPasswordResult> {
  const parsed = forgotSchema.safeParse({
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  try {
    const locale = await getLocale();
    await requestPasswordReset({
      email: parsed.data.email,
      locale,
    });
    return { success: true };
  } catch (error) {
    console.error("forgotPasswordAction:", error);
    return { error: "No se pudo enviar el email. Intentá de nuevo." };
  }
}
