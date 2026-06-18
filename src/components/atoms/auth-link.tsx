import type { AnchorHTMLAttributes } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";

type AuthLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof buttonVariants>;

/**
 * Átomo: enlace con estilo de botón para las rutas de auth (/auth/login,
 * /auth/logout). Usa `<a>` (no <Link>) porque el flujo de Auth0 necesita una
 * navegación completa del navegador, no una transición de cliente.
 */
export function AuthLink({
  className,
  variant,
  size,
  ...props
}: AuthLinkProps) {
  return (
    <a className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
