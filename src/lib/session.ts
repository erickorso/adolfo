import "server-only";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { auth } from "@/lib/auth";

/**
 * Exige una sesión activa en un Server Component / Server Action.
 * Si no hay sesión, redirige a /login (con locale) conservando el destino.
 * Devuelve el id del usuario autenticado.
 */
export async function requireUserId(returnTo = "/"): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    const locale = await getLocale();
    const callbackUrl = encodeURIComponent(`/${locale}${returnTo}`);
    redirect(`/${locale}/login?callbackUrl=${callbackUrl}`);
  }
  return session.user.id;
}
