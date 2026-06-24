import { getAppBaseUrl } from "@/lib/app-url";

export type PasswordResetEmailInput = {
  email: string;
  name: string | null;
  locale: string;
  rawToken: string;
};

export function buildPasswordResetEmail(input: PasswordResetEmailInput): {
  subject: string;
  html: string;
  text: string;
} {
  const resetUrl = `${getAppBaseUrl()}/${input.locale}/reset-password?token=${encodeURIComponent(input.rawToken)}`;
  const greeting = input.name ? `Hola ${input.name},` : "Hola,";
  const subject = "Restablecer contraseña";
  const text = `${greeting}

Recibimos una solicitud para restablecer la contraseña de tu cuenta (${input.email}).

Abrí este enlace (válido por 1 hora):
${resetUrl}

Si no pediste este cambio, ignorá este mensaje.

Catálogo`;

  const html = `
    <p>${greeting}</p>
    <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta (<strong>${input.email}</strong>).</p>
    <p><a href="${resetUrl}">Restablecer contraseña</a></p>
    <p>El enlace expira en 1 hora. Si no pediste este cambio, ignorá este mensaje.</p>
  `.trim();

  return { subject, html, text };
}
