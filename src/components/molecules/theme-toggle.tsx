"use client";

import { useCallback } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

/**
 * Molécula: alterna tema claro/oscuro (next-themes).
 * El cambio de íconos es por CSS (clases dark:) → sin gate de `mounted` ni
 * mismatch de hidratación.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const handleToggle = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      aria-label="Cambiar tema"
    >
      <Sun className="size-4 scale-100 dark:scale-0" />
      <Moon className="absolute size-4 scale-0 dark:scale-100" />
    </Button>
  );
}
