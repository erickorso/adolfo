import { getTranslations } from "next-intl/server";
import { CartContents } from "@/components/organisms/cart-contents";

/**
 * Página del carrito. El estado vive en el cliente (Zustand), así que la página
 * solo monta el organismo conectado.
 */
export default async function CartPage() {
  const t = await getTranslations("cart");
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <CartContents />
    </main>
  );
}
