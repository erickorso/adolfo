"use client";

import { useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

/**
 * Formulario de login (Credentials + Google opcional). Llama a signIn de Auth.js
 * con redirect manual para poder mostrar el error inline.
 */
export function LoginForm({ googleEnabled }: { googleEnabled: boolean }) {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/";
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setPending(true);
      setError(null);
      const form = new FormData(event.currentTarget);
      const result = await signIn("credentials", {
        email: String(form.get("email")),
        password: String(form.get("password")),
        redirect: false,
      });
      setPending(false);
      if (result?.error) {
        setError("Email o contraseña incorrectos.");
        return;
      }
      window.location.href = callbackUrl;
    },
    [callbackUrl],
  );

  const handleGoogle = useCallback(() => {
    void signIn("google", { callbackUrl });
  }, [callbackUrl]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {googleEnabled ? (
        <>
          <Button type="button" variant="outline" onClick={handleGoogle}>
            Continuar con Google
          </Button>
          <div className="text-center text-xs text-muted-foreground">o</div>
        </>
      ) : null}
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="rounded-md border border-input px-3 py-2 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="rounded-md border border-input px-3 py-2 text-sm"
        />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Ingresando…" : "Ingresar"}
      </Button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </form>
  );
}
