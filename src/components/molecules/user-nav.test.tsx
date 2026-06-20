import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { useSession } from "next-auth/react";
import { UserNav } from "./user-nav";

// Mockeamos Auth.js para controlar el estado de sesión en cada test.
vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
  signOut: vi.fn(),
}));

const mockUseSession = vi.mocked(useSession);

const messages = {
  nav: { login: "Ingresar", logout: "Salir", admin: "Admin" },
};

/** Render con el provider de i18n (UserNav usa useTranslations). */
function renderUserNav() {
  return render(
    <NextIntlClientProvider locale="es" messages={messages}>
      <UserNav />
    </NextIntlClientProvider>,
  );
}

function setSession(value: {
  user?: { name?: string; email?: string } | null;
  status?: "authenticated" | "unauthenticated" | "loading";
}) {
  mockUseSession.mockReturnValue({
    data: value.user ? { user: value.user, expires: "" } : null,
    status: value.status ?? (value.user ? "authenticated" : "unauthenticated"),
    update: vi.fn(),
  } as unknown as ReturnType<typeof useSession>);
}

describe("UserNav", () => {
  it("muestra 'Ingresar' (link a /login) sin sesión", () => {
    setSession({ user: null });
    renderUserNav();
    expect(screen.getByRole("link", { name: "Ingresar" })).toHaveAttribute(
      "href",
      "/login",
    );
  });

  it("muestra el nombre y botón 'Salir' con sesión", () => {
    setSession({ user: { name: "Erick Vargas", email: "e@x.com" } });
    renderUserNav();
    expect(screen.getByText("Erick Vargas")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salir" })).toBeInTheDocument();
  });

  it("cae al email si no hay nombre", () => {
    setSession({ user: { email: "e@x.com" } });
    renderUserNav();
    expect(screen.getByText("e@x.com")).toBeInTheDocument();
  });

  it("no muestra acciones mientras carga", () => {
    setSession({ status: "loading" });
    renderUserNav();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
