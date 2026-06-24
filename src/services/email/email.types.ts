/** Contrato de envío de emails. Proveedores intercambiables (console, Resend). */
export type EmailMessage = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export interface EmailProvider {
  readonly id: string;
  send(message: EmailMessage): Promise<void>;
}
