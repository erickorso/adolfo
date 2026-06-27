import { NextResponse } from "next/server";
import { signIn } from "@/lib/auth";
import {
  DEV_LOGIN_ACCOUNTS,
  DEV_LOGIN_SECRET_DEFAULT,
} from "@/lib/dev-seed.constants";

/**
 * Login programático para dev/E2E sin formulario.
 * GET /api/dev/login?secret=...&email=e2e@test.local&redirect=/es/account/applications
 * Solo fuera de producción.
 */
export async function GET(request: Request): Promise<NextResponse> {
  const allowInCi = process.env.CI === "true";
  if (process.env.NODE_ENV === "production" && !allowInCi) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const url = new URL(request.url);
  const secret =
    url.searchParams.get("secret") ??
    request.headers.get("x-dev-login-secret");
  const expected =
    process.env.DEV_LOGIN_SECRET ?? DEV_LOGIN_SECRET_DEFAULT;

  if (!secret || secret !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = url.searchParams.get("email") ?? "e2e@test.local";
  const password = DEV_LOGIN_ACCOUNTS[email];

  if (!password) {
    return NextResponse.json(
      { error: "Email no permitido para dev login" },
      { status: 400 },
    );
  }

  const redirectTo = url.searchParams.get("redirect") ?? "/es/account/applications";

  await signIn("credentials", {
    email,
    password,
    redirectTo,
  });

  return NextResponse.redirect(new URL(redirectTo, request.url), 303);
}
