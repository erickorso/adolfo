import Link from "next/link";
import { SignupForm } from "@/components/organisms/signup-form";
import { isGoogleEnabled } from "@/lib/auth";

/** Página de registro. */
export default function SignupPage() {
  return (
    <main className="mx-auto flex max-w-sm flex-col gap-6 px-4 py-12">
      <h1 className="text-2xl font-semibold">Crear cuenta</h1>
      <SignupForm googleEnabled={isGoogleEnabled} />
      <p className="text-sm text-muted-foreground">
        ¿Ya tenés cuenta?{" "}
        <Link href="/login" className="font-medium underline">
          Ingresá
        </Link>
      </p>
    </main>
  );
}
