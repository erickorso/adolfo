import type { DefaultSession } from "next-auth";
import type { UserRole } from "@/generated/prisma/client";

/**
 * Aumenta los tipos de Auth.js con nuestros campos de dominio (id + role),
 * así no usamos `any` en los callbacks ni al leer la sesión.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    role?: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
  }
}
