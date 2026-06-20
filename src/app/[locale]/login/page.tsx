import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LoginForm } from "@/components/organisms/login-form";
import { isGoogleEnabled } from "@/lib/auth";

/** Página de login. LoginForm va en Suspense porque usa useSearchParams. */
export default async function LoginPage() {
  const t = await getTranslations("auth");

  return (
    <main className="mx-auto flex max-w-sm flex-col gap-6 px-4 py-12">
      <h1 className="text-2xl font-semibold">{t("loginTitle")}</h1>
      <Suspense
        fallback={<div className="h-48 animate-pulse rounded-lg bg-muted" />}
      >
        <LoginForm googleEnabled={isGoogleEnabled} />
      </Suspense>
      <p className="text-sm text-muted-foreground">
        {t("noAccount")}{" "}
        <Link href="/signup" className="font-medium underline">
          {t("register")}
        </Link>
      </p>
    </main>
  );
}
