import { test, expect } from "@playwright/test";
import { loginAsE2eUser } from "./auth-helper";

test("kanban de postulaciones muestra pipeline del usuario E2E", async ({
  page,
}) => {
  await loginAsE2eUser(page);
  await page.goto("/es/account/applications");

  await expect(
    page.getByRole("heading", { name: "Mis postulaciones" }),
  ).toBeVisible();

  await expect(page.getByRole("link", { name: /Acme Remote/i }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Thaloz/i }).first()).toBeVisible();
  await expect(
    page.getByText("Todavía no registraste postulaciones."),
  ).not.toBeVisible();
});

test("detalle de postulación muestra progreso", async ({ page }) => {
  await loginAsE2eUser(page);
  await page.goto("/es/account/applications");

  await page.getByRole("link", { name: /Acme Remote/i }).first().click();
  await page.waitForURL(/\/account\/applications\/[a-z0-9]+/i);

  await expect(page.locator("h1")).toHaveText("Acme Remote");
  await expect(page.getByText("Staff Frontend Engineer")).toBeVisible();
});
