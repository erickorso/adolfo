import { expect, type Page } from "@playwright/test";
import { E2E_USER } from "./constants";

/** Login vía formulario (Server Action de Auth.js). */
export async function loginAsE2eUser(page: Page): Promise<void> {
  await page.goto("/es/login");
  await page.locator("#email").fill(E2E_USER.email);
  await page.locator("#password").fill(E2E_USER.password);
  await page.getByRole("button", { name: "Ingresar" }).click();

  await page.waitForURL(
    (url) => !url.pathname.includes("/login"),
    { timeout: 15_000 },
  );

  await expect(page.getByText("Email o contraseña incorrectos.")).not.toBeVisible();
}
