import { describe, expect, it, vi, afterEach } from "vitest";

vi.mock("@/lib/env", () => ({
  env: { AUTH_URL: undefined },
}));

import { getAppBaseUrl } from "./app-url";

describe("getAppBaseUrl", () => {
  afterEach(() => {
    delete process.env.VERCEL_URL;
  });

  it("usa VERCEL_URL cuando no hay AUTH_URL", () => {
    process.env.VERCEL_URL = "adolfo.vercel.app";
    expect(getAppBaseUrl()).toBe("https://adolfo.vercel.app");
  });

  it("fallback a localhost sin env", () => {
    expect(getAppBaseUrl()).toBe("http://localhost:3000");
  });
});
