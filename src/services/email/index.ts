import "server-only";
import { env } from "@/lib/env";
import type { EmailProvider } from "./email.types";
import { ConsoleEmailProvider } from "./console.provider";
import { ResendEmailProvider } from "./resend.provider";

function createEmailProvider(): EmailProvider {
  if (env.EMAIL_PROVIDER === "resend") {
    if (!env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY requerida cuando EMAIL_PROVIDER=resend");
    }
    return new ResendEmailProvider({
      apiKey: env.RESEND_API_KEY,
      from: env.EMAIL_FROM,
    });
  }
  return new ConsoleEmailProvider();
}

export const emailProvider: EmailProvider = createEmailProvider();
