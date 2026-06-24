import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: vi.fn(), update: vi.fn() },
    verificationToken: {
      deleteMany: vi.fn(),
      create: vi.fn(),
      findUnique: vi.fn(),
    },
    $transaction: vi.fn((ops: unknown[]) => Promise.all(ops)),
  },
}));

vi.mock("@/services/email/send-password-reset", () => ({
  sendPasswordResetEmail: vi.fn(),
}));

import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/services/email/send-password-reset";
import {
  requestPasswordReset,
  resetPasswordWithToken,
} from "./password-reset.service";

describe("password-reset.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("no envía email si el usuario no tiene contraseña", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "u1",
      email: "oauth@test.local",
      name: "OAuth",
      passwordHash: null,
    } as never);

    await requestPasswordReset({ email: "oauth@test.local", locale: "es" });

    expect(sendPasswordResetEmail).not.toHaveBeenCalled();
    expect(prisma.verificationToken.create).not.toHaveBeenCalled();
  });

  it("crea token y envía email para cuenta con contraseña", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "u2",
      email: "erick@test.local",
      name: "Erick",
      passwordHash: "hash",
    } as never);

    await requestPasswordReset({ email: "erick@test.local", locale: "es" });

    expect(prisma.verificationToken.deleteMany).toHaveBeenCalled();
    expect(prisma.verificationToken.create).toHaveBeenCalled();
    expect(sendPasswordResetEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "erick@test.local",
        locale: "es",
        rawToken: expect.any(String),
      }),
    );
  });

  it("actualiza contraseña con token válido", async () => {
    vi.mocked(prisma.verificationToken.findUnique).mockResolvedValue({
      identifier: "erick@test.local",
      token: "hashed",
      expires: new Date(Date.now() + 60_000),
    } as never);

    const result = await resetPasswordWithToken({
      rawToken: "valid-token",
      password: "newpassword123",
    });

    expect(result).toEqual({ ok: true });
    expect(prisma.user.update).toHaveBeenCalled();
    expect(prisma.verificationToken.deleteMany).toHaveBeenCalled();
  });

  it("rechaza token inexistente", async () => {
    vi.mocked(prisma.verificationToken.findUnique).mockResolvedValue(null);

    const result = await resetPasswordWithToken({
      rawToken: "bad",
      password: "newpassword123",
    });

    expect(result).toEqual({ ok: false, reason: "invalid" });
  });
});
