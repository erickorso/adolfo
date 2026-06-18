import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { useUser } from "@auth0/nextjs-auth0";
import { UserNav } from "./user-nav";

// Mockeamos el hook de Auth0 para controlar el estado de sesión en cada test.
vi.mock("@auth0/nextjs-auth0", () => ({ useUser: vi.fn() }));

const mockUseUser = vi.mocked(useUser);

function setUser(value: { user?: unknown; isLoading?: boolean }) {
  mockUseUser.mockReturnValue({
    user: value.user ?? null,
    isLoading: value.isLoading ?? false,
  } as ReturnType<typeof useUser>);
}

describe("UserNav", () => {
  it("muestra 'Ingresar' cuando no hay sesión", () => {
    setUser({ user: null });
    render(<UserNav />);
    const link = screen.getByRole("link", { name: "Ingresar" });
    expect(link).toHaveAttribute("href", "/auth/login");
  });

  it("muestra el nombre y 'Salir' cuando hay sesión", () => {
    setUser({ user: { name: "Erick Vargas", email: "e@x.com" } });
    render(<UserNav />);
    expect(screen.getByText("Erick Vargas")).toBeInTheDocument();
    const link = screen.getByRole("link", { name: "Salir" });
    expect(link).toHaveAttribute("href", "/auth/logout");
  });

  it("cae al email si no hay nombre", () => {
    setUser({ user: { email: "e@x.com" } });
    render(<UserNav />);
    expect(screen.getByText("e@x.com")).toBeInTheDocument();
  });

  it("no muestra enlaces mientras carga", () => {
    setUser({ isLoading: true });
    render(<UserNav />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
