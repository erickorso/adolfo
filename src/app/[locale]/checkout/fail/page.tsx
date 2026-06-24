import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

/** Retorno tras pago rechazado o cancelado en Ualá. */
export default async function CheckoutFailPage() {
  const t = await getTranslations("checkout");

  return (
    <main className="mx-auto flex max-w-lg flex-col gap-4 px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold">{t("failTitle")}</h1>
      <p className="text-muted-foreground">{t("failBody")}</p>
      <Link href="/cart" className="text-sm font-medium underline">
        {t("backToCart")}
      </Link>
    </main>
  );
}
