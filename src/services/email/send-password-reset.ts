import "server-only";
import { emailProvider } from "@/services/email";
import { buildPasswordResetEmail } from "./password-reset";

export async function sendPasswordResetEmail(input: {
  email: string;
  name: string | null;
  locale: string;
  rawToken: string;
}): Promise<void> {
  const { subject, html, text } = buildPasswordResetEmail(input);
  await emailProvider.send({
    to: input.email,
    subject,
    html,
    text,
  });
}
