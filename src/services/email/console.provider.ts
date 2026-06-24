import type { EmailMessage, EmailProvider } from "./email.types";

/** Dev: loguea emails en consola sin enviar. */
export class ConsoleEmailProvider implements EmailProvider {
  readonly id = "console";

  async send(message: EmailMessage): Promise<void> {
    console.info(
      `[email:console] to=${message.to} subject="${message.subject}"\n${message.text ?? message.html}`,
    );
  }
}
