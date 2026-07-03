import { describe, expect, it } from "vitest";
import { buildSecurityHeaders } from "./security-headers";

describe("buildSecurityHeaders", () => {
  it("incluye headers base", () => {
    const headers = buildSecurityHeaders({ includeHsts: false });
    const keys = headers.map((h) => h.key);

    expect(keys).toContain("X-Frame-Options");
    expect(keys).toContain("X-Content-Type-Options");
    expect(keys).toContain("Referrer-Policy");
    expect(keys).toContain("Permissions-Policy");
    expect(keys).not.toContain("Strict-Transport-Security");
  });

  it("añade HSTS cuando includeHsts es true", () => {
    const headers = buildSecurityHeaders({ includeHsts: true });
    const hsts = headers.find((h) => h.key === "Strict-Transport-Security");

    expect(hsts?.value).toMatch(/max-age=/);
  });

  it("X-Frame-Options es DENY", () => {
    const headers = buildSecurityHeaders({ includeHsts: false });
    expect(headers.find((h) => h.key === "X-Frame-Options")?.value).toBe("DENY");
  });
});
