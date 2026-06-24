import type { EmailMessage, EmailProvider } from "./email.types";

/** Envío vía API de Resend (https://resend.com). */
export class ResendEmailProvider implements EmailProvider {
  readonly id = "resend";

  constructor(
    private readonly config: { apiKey: string; from: string },
  ) {}

  async send(message: EmailMessage): Promise<void> {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "adolfo-catalog/1.0",
      },
      body: JSON.stringify({
        from: this.config.from,
        to: [message.to],
        subject: message.subject,
        html: message.html,
        text: message.text,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Resend rechazó el envío (${response.status}): ${detail}`);
    }
  }
}
