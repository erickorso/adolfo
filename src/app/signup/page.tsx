import Link from "next/link";
import { SignupForm } from "@/components/organisms/signup-form";

/** Página de registro. */
export default function SignupPage() {
  return (
    <main className="mx-auto flex max-w-sm flex-col gap-6 px-4 py-12">
      <h1 className="text-2xl font-semibold">Crear cuenta</h1>
      <SignupForm />
      <p className="text-sm text-neutral-600">
        ¿Ya tenés cuenta?{" "}
        <Link href="/login" className="font-medium underline">
          Ingresá
        </Link>
      </p>
    </main>
  );
}
