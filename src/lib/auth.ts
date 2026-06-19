import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import type { UserRole } from "@/generated/prisma/client";

/** Google se habilita solo si están las credenciales (OAuth opcional). */
const googleProvider =
  env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET
    ? [
        Google({
          clientId: env.AUTH_GOOGLE_ID,
          clientSecret: env.AUTH_GOOGLE_SECRET,
        }),
      ]
    : [];

/** ¿Está habilitado el login con Google? (para mostrar el botón en la UI). */
export const isGoogleEnabled = googleProvider.length > 0;

/**
 * Configuración de Auth.js (NextAuth v5).
 *
 * Los usuarios viven en NUESTRA base (adapter de Prisma) — sin servicio externo.
 * Estrategia JWT (requerida por el proveedor Credentials). El login con Google
 * se suma agregando un provider, sin cambiar el resto.
 */
const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) {
          return null;
        }
        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash) {
          return null;
        }
        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
          return null;
        }
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
    ...googleProvider,
  ],
  callbacks: {
    // Bloquea baneados y promueve a SUPERADMIN los emails configurados (bootstrap).
    async signIn({ user }) {
      if (!user?.email) {
        return true;
      }
      const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        select: { id: true, role: true, status: true },
      });
      if (dbUser?.status === "BANNED") {
        return false;
      }
      const supers = env.SUPERADMIN_EMAILS.split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);
      if (
        dbUser &&
        supers.includes(user.email.toLowerCase()) &&
        dbUser.role !== "SUPERADMIN"
      ) {
        await prisma.user.update({
          where: { id: dbUser.id },
          data: { role: "SUPERADMIN" },
        });
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // Credentials trae role en `user`; OAuth (Google) no -> lo leemos de la DB.
        const role = (user as { role?: UserRole }).role;
        if (role) {
          token.role = role;
        } else if (user.id) {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { role: true },
          });
          token.role = dbUser?.role;
        }
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        if (typeof token.id === "string") {
          session.user.id = token.id;
        }
        if (typeof token.role === "string") {
          session.user.role = token.role as UserRole;
        }
      }
      return session;
    },
  },
});
