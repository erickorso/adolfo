import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
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
  const t = await getTranslations("nav");
  const serverItemCount = countCartItems(await getCartFromCookie());

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-lg font-bold">
            {t("catalog")}
          </Link>
          <Link
            href="/jobs"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {t("jobs")}
          </Link>
          <Link
            href="/courses"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {t("courses")}
          </Link>
          <Link
            href="/sandbox/3d"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {t("sandbox3d")}
          </Link>
          <Link
            href="/learn/ai-agents"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {t("aiAgents")}
          </Link>
          <Link
            href="/account"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {t("account")}
          </Link>
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
