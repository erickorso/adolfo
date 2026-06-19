import { describe, expect, it } from "vitest";
import { canManageRole, isAdmin, isSuperadmin, roleAtLeast } from "./authz";

describe("authz", () => {
  it("roleAtLeast respeta la jerarquía", () => {
    expect(roleAtLeast("SUPERADMIN", "ADMIN")).toBe(true);
    expect(roleAtLeast("ADMIN", "ADMIN")).toBe(true);
    expect(roleAtLeast("CUSTOMER", "ADMIN")).toBe(false);
  });

  it("isAdmin / isSuperadmin", () => {
    expect(isAdmin("ADMIN")).toBe(true);
    expect(isAdmin("SUPERADMIN")).toBe(true);
    expect(isAdmin("CUSTOMER")).toBe(false);
    expect(isSuperadmin("SUPERADMIN")).toBe(true);
    expect(isSuperadmin("ADMIN")).toBe(false);
  });

  it("SUPERADMIN puede gestionar cualquier rol", () => {
    expect(canManageRole("SUPERADMIN", "ADMIN")).toBe(true);
    expect(canManageRole("SUPERADMIN", "SUPERADMIN")).toBe(true);
    expect(canManageRole("SUPERADMIN", "CUSTOMER")).toBe(true);
  });

  it("ADMIN solo gestiona CUSTOMERs (no a otros admins)", () => {
    expect(canManageRole("ADMIN", "CUSTOMER")).toBe(true);
    expect(canManageRole("ADMIN", "ADMIN")).toBe(false);
    expect(canManageRole("ADMIN", "SUPERADMIN")).toBe(false);
  });

  it("CUSTOMER no gestiona a nadie", () => {
    expect(canManageRole("CUSTOMER", "CUSTOMER")).toBe(false);
  });
});
