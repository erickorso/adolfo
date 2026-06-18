import Link from "next/link";
import { UserNav } from "@/components/molecules/user-nav";

/**
 * Organismo: header del sitio. Marca + navegación + área de usuario.
 * El estado de sesión lo resuelve `UserNav` (client) vía useUser.
 */
export function SiteHeader() {
  return (
    <header className="border-b border-neutral-200">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-lg font-bold">
            Catálogo
          </Link>
          <Link
            href="/account"
            className="text-sm text-neutral-600 hover:text-neutral-900"
          >
            Mi cuenta
          </Link>
        </nav>
        <UserNav />
      </div>
    </header>
  );
}
