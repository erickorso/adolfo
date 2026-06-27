import { expect, type Page } from "@playwright/test";
import {
  DEV_LOGIN_SECRET_DEFAULT,
  E2E_USER,
} from "../src/lib/dev-seed.constants";

/** Login programático vía `/api/dev/login` (seed E2E). */
export async function loginAsE2eUser(page: Page): Promise<void> {
  const secret = process.env.DEV_LOGIN_SECRET ?? DEV_LOGIN_SECRET_DEFAULT;
  const redirect = encodeURIComponent("/es");
  const email = encodeURIComponent(E2E_USER.email);
  const loginUrl = `/api/dev/login?secret=${encodeURIComponent(secret)}&email=${email}&redirect=${redirect}`;

  await page.goto(loginUrl);
  await expect(page).not.toHaveURL(/\/login/);
}
