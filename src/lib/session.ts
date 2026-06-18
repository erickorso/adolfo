import "server-only";
import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";
import type { SessionData } from "@auth0/nextjs-auth0/types";

/**
 * Exige una sesión activa en un Server Component / Server Action.
 * Si no hay sesión, redirige a login conservando el destino (`returnTo`).
 */
export async function requireSession(returnTo = "/"): Promise<SessionData> {
  const session = await auth0.getSession();
  if (!session) {
    redirect(`/auth/login?returnTo=${encodeURIComponent(returnTo)}`);
  }
  return session;
}
