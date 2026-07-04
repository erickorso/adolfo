import { getTranslations } from "next-intl/server";
import { CartPanel } from "@/components/organisms/cart-panel";
import { getCartFromCookie } from "@/lib/cart-cookie";

type CartPageProps = {
  searchParams: Promise<{ checkoutError?: string; cartError?: string }>;
};

export default async function CartPage({ searchParams }: CartPageProps) {
  const [t, initialItems, { checkoutError, cartError }] = await Promise.all([
    getTranslations("cart"),
    getCartFromCookie(),
    searchParams,
  ]);

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <CartPanel
        items={initialItems}
        checkoutError={checkoutError}
        cartError={cartError}
      />
    </main>
  );
}
