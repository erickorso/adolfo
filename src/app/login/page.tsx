import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/organisms/login-form";

/** Página de login. LoginForm va en Suspense porque usa useSearchParams. */
export default function LoginPage() {
  return (
    <main className="mx-auto flex max-w-sm flex-col gap-6 px-4 py-12">
      <h1 className="text-2xl font-semibold">Ingresar</h1>
      <Suspense
        fallback={<div className="h-48 animate-pulse rounded-lg bg-muted" />}
      >
        <LoginForm />
      </Suspense>
      <p className="text-sm text-muted-foreground">
        ¿No tenés cuenta?{" "}
        <Link href="/signup" className="font-medium underline">
          Registrate
        </Link>
      </p>
    </main>
  );
}
