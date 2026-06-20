import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SignupForm } from "@/components/organisms/signup-form";
import { isGoogleEnabled } from "@/lib/auth";

/** Página de registro. */
export default async function SignupPage() {
  const t = await getTranslations("auth");

  return (
    <main className="mx-auto flex max-w-sm flex-col gap-6 px-4 py-12">
      <h1 className="text-2xl font-semibold">{t("signupTitle")}</h1>
      <SignupForm googleEnabled={isGoogleEnabled} />
      <p className="text-sm text-muted-foreground">
        {t("hasAccount")}{" "}
        <Link href="/login" className="font-medium underline">
          {t("loginLink")}
        </Link>
      </p>
    </main>
  );
}
