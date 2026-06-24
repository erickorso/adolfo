import { expect, type Page } from "@playwright/test";
import { E2E_USER } from "./constants";

/** Login vía API de Auth.js (evita problemas de CSRF en el formulario cliente). */
export async function loginAsE2eUser(page: Page): Promise<void> {
  const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
  const csrf = (await (
    await page.request.get(`${baseURL}/api/auth/csrf`)
  ).json()) as { csrfToken: string };

  const response = await page.request.post(
    `${baseURL}/api/auth/callback/credentials`,
    {
      form: {
        csrfToken: csrf.csrfToken,
        email: E2E_USER.email,
        password: E2E_USER.password,
        redirect: "false",
        json: "true",
      },
    },
  );

  expect(response.ok(), `Login falló (${response.status()})`).toBeTruthy();
}
