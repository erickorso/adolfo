import type { AnchorHTMLAttributes } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";

type AuthLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof buttonVariants>;

/**
 * Átomo: enlace con estilo de botón (ej. "Ingresar" → /login).
 * Anchor genérico estilado con las variantes del botón.
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
