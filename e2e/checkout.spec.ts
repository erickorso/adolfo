import { test, expect } from "@playwright/test";

/**
 * E2E del flujo de compra (esqueleto).
 * Cubrirá: Login -> Agregar al carrito -> Checkout.
 *
 * Por ahora valida que la home carga; los pasos de carrito/checkout se
 * completan a medida que se construyan esas páginas.
 */
test("la home carga y muestra el catálogo", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/.+/);
});

test.fixme("flujo completo: login -> agregar al carrito -> checkout", async ({ page }) => {
  // 1. Login con Auth0 (/auth/login)
  // 2. Agregar un producto al carrito
  // 3. Ir al checkout y crear el cobro en Ualá (mockeado)
  // 4. Verificar el redirect a la URL de checkout
  await page.goto("/");
});
