import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/app-url", () => ({
  getAppBaseUrl: () => "https://app.test",
}));

import { buildPasswordResetEmail } from "./password-reset";

describe("buildPasswordResetEmail", () => {
  it("incluye enlace de reset con locale y token", () => {
    const { subject, text, html } = buildPasswordResetEmail({
      email: "erickorso@gmail.com",
      name: "Erick",
      locale: "es",
      rawToken: "abc123",
    });

    expect(subject).toContain("Restablecer");
    expect(text).toContain("https://app.test/es/reset-password?token=abc123");
    expect(html).toContain("erickorso@gmail.com");
  });
});
