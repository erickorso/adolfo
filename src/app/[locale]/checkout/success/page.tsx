import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

/** Página de retorno tras el pago en Ualá (confirmación final vía webhook). */
export default async function CheckoutSuccessPage() {
  const t = await getTranslations("checkout");

  return (
    <main className="mx-auto flex max-w-lg flex-col gap-4 px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold">{t("successTitle")}</h1>
      <p className="text-muted-foreground">{t("successBody")}</p>
      <div className="flex flex-col items-center gap-2">
        <Link href="/account/orders" className="text-sm font-medium underline">
          {t("viewOrders")}
        </Link>
        <Link href="/" className="text-sm font-medium underline">
          {t("backToCatalog")}
        </Link>
      </div>
    </main>
  );
}
