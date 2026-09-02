import { test, expect } from "@playwright/test";
import { loginAsE2eUser } from "./auth-helper";

test("english a1 greetings exercise submits answer", async ({ page }) => {
  await loginAsE2eUser(page);
  await page.goto("/es/learn/english-a1/greetings");

  await expect(page.getByRole("heading", { name: "Práctica" })).toBeVisible();

  await page.getByLabel("Good morning").click();
  await page.getByRole("button", { name: "Comprobar" }).click();

  await expect(page.getByText("¡Correcto!")).toBeVisible({ timeout: 15_000 });
});
