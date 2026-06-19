import Link from "next/link";
import { UserNav } from "@/components/molecules/user-nav";
import { CartNavButton } from "@/components/molecules/cart-nav-button";
import { CurrencySwitcher } from "@/components/molecules/currency-switcher";

/**
 * Organismo: header del sitio. Marca + navegación + área de usuario.
 * El estado de sesión lo resuelve `UserNav` (client) vía useUser.
 */
export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-lg font-bold">
            Catálogo
          </Link>
          <Link
            href="/jobs"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Empleos
          </Link>
          <Link
            href="/account"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Mi cuenta
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <CurrencySwitcher />
          <CartNavButton />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
