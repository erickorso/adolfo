import { headers } from "next/headers";
import { SiteNavLinks } from "@/components/molecules/site-nav-links";
import { UserNav } from "@/components/molecules/user-nav";
import { CartNavButton } from "@/components/molecules/cart-nav-button";
import { CurrencySwitcher } from "@/components/molecules/currency-switcher";
import { ThemeToggle } from "@/components/molecules/theme-toggle";
import { LanguageSwitcher } from "@/components/molecules/language-switcher";
import {
  countCartItems,
  getCartFromCookie,
} from "@/lib/cart-cookie";

/**
 * Organismo: header del sitio. Marca + navegación + área de usuario.
 * Las etiquetas se traducen (i18n); el estado de sesión lo resuelve UserNav.
 */
export async function SiteHeader() {
  const headerStore = await headers();
  const pathname = headerStore.get("x-pathname") ?? "/";
  const serverItemCount = countCartItems(await getCartFromCookie());

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <nav className="flex items-center gap-6" aria-label="Main">
          <SiteNavLinks pathname={pathname} />
        </nav>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <ThemeToggle />
          <CurrencySwitcher />
          <CartNavButton serverItemCount={serverItemCount} />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
