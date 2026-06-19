import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Exige una sesión activa en un Server Component / Server Action.
 * Si no hay sesión, redirige a /login conservando el destino (`callbackUrl`).
 * Devuelve el id del usuario autenticado.
 */
export async function requireUserId(returnTo = "/"): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=${encodeURIComponent(returnTo)}`);
  }
  return session.user.id;
}
