import { describe, expect, it } from "vitest";
import {
  getTokenBodySchema,
  parseGetTokenBody,
  parseTopContentQuery,
  topContentQuerySchema,
} from "./schemas";

describe("getTokenBodySchema", () => {
  it("acepta credenciales demo", () => {
    const result = parseGetTokenBody({
      clientId: "metrics-demo",
      clientSecret: "metrics-demo-dev",
    });
    expect(result.success).toBe(true);
  });

  it("rechaza clientId vacío", () => {
    const result = parseGetTokenBody({ clientId: "", clientSecret: "x" });
    expect(result.success).toBe(false);
  });
});

describe("topContentQuerySchema", () => {
  it("parsea ISO y aplica defaults", () => {
    const result = parseTopContentQuery({
      from: "2026-06-01T00:00:00Z",
      to: "2026-06-30T23:59:59Z",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.limit).toBe(10);
      expect(result.data.page).toBe(1);
    }
  });

  it("rechaza from > to (refine Zod)", () => {
    const result = parseTopContentQuery({
      from: "2026-07-10T00:00:00Z",
      to: "2026-07-01T00:00:00Z",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.to).toContain("must be after from");
    }
  });

  it("limita limit a 100", () => {
    const parsed = topContentQuerySchema.safeParse({
      from: "2026-06-01",
      to: "2026-06-30",
      limit: "1000",
    });

    expect(parsed.success).toBe(false);
  });

  it("acepta country ISO2", () => {
    const result = parseTopContentQuery({
      from: "2026-06-01",
      to: "2026-06-30",
      country: "ES",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.country).toBe("ES");
    }
  });

  it("rechaza fechas inválidas", () => {
    const result = parseTopContentQuery({
      from: "not-a-date",
      to: "2026-06-30",
    });

    expect(result.success).toBe(false);
  });
});

describe("getTokenBodySchema direct", () => {
  it("requiere ambos campos", () => {
    expect(getTokenBodySchema.safeParse({ clientId: "a" }).success).toBe(false);
  });
});
