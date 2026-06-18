import { redirect } from "next/navigation";
import { syncUserFromSession } from "@/services/users/user.service";

/**
 * Página "Mi cuenta" — protegida.
 *
 * Demuestra la estrategia de sync: `syncUserFromSession()` lee la sesión de
 * Auth0 y hace upsert del usuario en la DB local (lazy sync en el primer
 * request autenticado). Si no hay sesión, redirige a login.
 */
export default async function AccountPage() {
  const user = await syncUserFromSession();

  if (!user) {
    redirect("/auth/login?returnTo=/account");
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
      <h1 className="text-2xl font-semibold">Mi cuenta</h1>
      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
        <dt className="font-medium text-neutral-500">Nombre</dt>
        <dd>{user.name ?? "—"}</dd>
        <dt className="font-medium text-neutral-500">Email</dt>
        <dd>{user.email}</dd>
        <dt className="font-medium text-neutral-500">Rol</dt>
        <dd>{user.role}</dd>
        <dt className="font-medium text-neutral-500">ID interno</dt>
        <dd className="font-mono text-xs">{user.id}</dd>
      </dl>
    </main>
  );
}
