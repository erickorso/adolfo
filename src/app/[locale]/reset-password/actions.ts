"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { resetPasswordWithToken } from "@/services/users/password-reset.service";

export type ResetPasswordResult = { error?: string; success?: boolean };

const resetSchema = z.object({
  token: z.string().min(1, "Enlace inválido."),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export async function resetPasswordAction(
  _prev: ResetPasswordResult,
  formData: FormData,
): Promise<ResetPasswordResult> {
  const parsed = resetSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const result = await resetPasswordWithToken({
    rawToken: parsed.data.token,
    password: parsed.data.password,
  });

  if (!result.ok) {
    return {
      error:
        result.reason === "expired"
          ? "El enlace expiró. Solicitá uno nuevo."
          : "El enlace no es válido. Solicitá uno nuevo.",
    };
  }

  const locale = await getLocale();
  redirect(`/${locale}/login?reset=1`);
}
