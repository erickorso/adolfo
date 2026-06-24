import { test, expect } from "@playwright/test";
import { loginAsE2eUser } from "./auth-helper";

test("la home carga y muestra el catálogo", async ({ page }) => {
  await page.goto("/es");
  await expect(page.getByRole("heading", { name: "Catálogo" })).toBeVisible();
});

test("el carrito muestra estado vacío", async ({ page }) => {
  await page.goto("/es/cart");
  await expect(page.getByText("Tu carrito está vacío.")).toBeVisible({
    timeout: 10_000,
  });
});

test("flujo completo: login → carrito → checkout mock Ualá", async ({ page }) => {
  await loginAsE2eUser(page);

  await page.goto("/es");
  await page
    .getByRole("article")
    .filter({ hasText: "Remera básica" })
    .getByRole("button", { name: "Agregar" })
    .click();

  await page.goto("/es/cart");
  await expect(page.getByText("Remera básica")).toBeVisible();

  await page.getByRole("button", { name: "Proceder al pago" }).click();
  await page.waitForURL(/\/es\/checkout\/success/, { timeout: 15_000 });
  await expect(page.getByRole("heading", { name: /Gracias/i })).toBeVisible();
});
