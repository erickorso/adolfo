import { CartContents } from "@/components/organisms/cart-contents";

/**
 * Página del carrito. El estado vive en el cliente (Zustand), así que la página
 * solo monta el organismo conectado.
 */
export default function CartPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
      <h1 className="text-2xl font-semibold">Tu carrito</h1>
      <CartContents />
    </main>
  );
}
