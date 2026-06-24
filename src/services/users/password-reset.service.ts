import "server-only";
import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/services/email/send-password-reset";

const RESET_TTL_MS = 60 * 60 * 1000;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function hashToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}

/** Solicita reset: siempre responde igual (anti-enumeración). */
export async function requestPasswordReset(params: {
  email: string;
  locale: string;
}): Promise<void> {
  const email = normalizeEmail(params.email);
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user?.passwordHash) {
    return;
  }

  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const expires = new Date(Date.now() + RESET_TTL_MS);

  await prisma.verificationToken.deleteMany({ where: { identifier: email } });
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token: tokenHash,
      expires,
    },
  });

  await sendPasswordResetEmail({
    email,
    name: user.name,
    locale: params.locale,
    rawToken,
  });
}

/** Valida token y actualiza contraseña (un solo uso). */
export async function resetPasswordWithToken(params: {
  rawToken: string;
  password: string;
}): Promise<{ ok: true } | { ok: false; reason: "invalid" | "expired" }> {
  const tokenHash = hashToken(params.rawToken.trim());
  const record = await prisma.verificationToken.findUnique({
    where: { token: tokenHash },
  });

  if (!record) {
    return { ok: false, reason: "invalid" };
  }

  if (record.expires.getTime() < Date.now()) {
    await prisma.verificationToken.deleteMany({
      where: { identifier: record.identifier },
    });
    return { ok: false, reason: "expired" };
  }

  const passwordHash = await bcrypt.hash(params.password, 10);

  await prisma.$transaction([
    prisma.user.update({
      where: { email: record.identifier },
      data: { passwordHash },
    }),
    prisma.verificationToken.deleteMany({
      where: { identifier: record.identifier },
    }),
  ]);

  return { ok: true };
}
