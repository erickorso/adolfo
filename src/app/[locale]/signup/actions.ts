"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";

export type SignupResult = { error?: string };

const signupSchema = z.object({
  name: z.string().min(1, "Ingresá tu nombre"),
  email: z.email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

/**
 * Registro con email + contraseña. Hashea con bcrypt, crea el usuario en NUESTRA
 * DB y lo loguea (signIn redirige al home). Devuelve error si algo falla.
 */
export async function signupAction(
  _prev: SignupResult,
  formData: FormData,
): Promise<SignupResult> {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Ya existe una cuenta con ese email." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { name, email, passwordHash } });

  // Loguea automáticamente: signIn lanza el redirect a "/".
  await signIn("credentials", { email, password, redirectTo: "/" });
  return {};
}
