/** Credenciales de usuarios de desarrollo/E2E (solo local + CI). */
export const E2E_USER = {
  email: "e2e@test.local",
  password: "password123",
  name: "Usuario E2E",
} as const;

/** Secret por defecto para `/api/dev/login` en local. */
export const DEV_LOGIN_SECRET_DEFAULT = "dev-local-secret";

/** Emails con login dev permitido → contraseña del seed. */
export const DEV_LOGIN_ACCOUNTS: Record<string, string> = {
  [E2E_USER.email]: E2E_USER.password,
};
