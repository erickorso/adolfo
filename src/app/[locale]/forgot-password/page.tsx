import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ForgotPasswordForm } from "@/components/organisms/forgot-password-form";

export default async function ForgotPasswordPage() {
  const t = await getTranslations("auth");

  return (
    <main className="mx-auto flex max-w-sm flex-col gap-6 px-4 py-12">
      <h1 className="text-2xl font-semibold">{t("forgotTitle")}</h1>
      <ForgotPasswordForm />
      <p className="text-sm text-muted-foreground">
        <Link href="/login" className="font-medium underline">
          {t("backToLogin")}
        </Link>
      </p>
    </main>
  );
}
