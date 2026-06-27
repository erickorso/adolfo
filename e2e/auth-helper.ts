import { expect, type Page } from "@playwright/test";
import {
  DEV_LOGIN_SECRET_DEFAULT,
  E2E_USER,
} from "../src/lib/dev-seed.constants";

/** Login programático para E2E (dev login en CI; credentials en local). */
export async function loginAsE2eUser(page: Page): Promise<void> {
  const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

  if (process.env.CI) {
    const secret = process.env.DEV_LOGIN_SECRET ?? DEV_LOGIN_SECRET_DEFAULT;
    const loginUrl = new URL("/api/dev/login", baseURL);
    loginUrl.searchParams.set("secret", secret);
    loginUrl.searchParams.set("email", E2E_USER.email);
    loginUrl.searchParams.set("redirect", "/es");

    const response = await page.request.get(loginUrl.toString(), {
      maxRedirects: 0,
    });

    expect(
      [303, 302, 307].includes(response.status()),
      `Dev login falló (${response.status()})`,
    ).toBeTruthy();
    return;
  }

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
