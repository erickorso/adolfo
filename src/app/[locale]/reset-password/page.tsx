import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ResetPasswordForm } from "@/components/organisms/reset-password-form";

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const t = await getTranslations("auth");
  const { token } = await searchParams;

  if (!token?.trim()) {
    return (
      <main className="mx-auto flex max-w-sm flex-col gap-6 px-4 py-12">
        <h1 className="text-2xl font-semibold">{t("resetTitle")}</h1>
        <p className="text-sm text-destructive" role="alert">
          {t("resetInvalidLink")}
        </p>
        <p className="text-sm text-muted-foreground">
          <Link href="/forgot-password" className="font-medium underline">
            {t("forgotCta")}
          </Link>
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-sm flex-col gap-6 px-4 py-12">
      <h1 className="text-2xl font-semibold">{t("resetTitle")}</h1>
      <p className="text-sm text-muted-foreground">{t("resetHint")}</p>
      <ResetPasswordForm token={token} />
    </main>
  );
}
