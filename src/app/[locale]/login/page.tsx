import { getLocale, getTranslations } from "next-intl/server";
import { Link, redirect } from "@/i18n/navigation";
import { LoginForm } from "@/components/organisms/login-form";
import { isGoogleEnabled } from "@/lib/auth";

type LoginPageProps = {
  searchParams: Promise<{
    reset?: string;
    callbackUrl?: string;
    email?: string;
    password?: string;
  }>;
};

/** Página de login. */
export default async function LoginPage({ searchParams }: LoginPageProps) {
  const [t, locale, params] = await Promise.all([
    getTranslations("auth"),
    getLocale(),
    searchParams,
  ]);

  if (params.password) {
    const qs = new URLSearchParams();
    if (params.email) qs.set("email", params.email);
    if (params.reset) qs.set("reset", params.reset);
    if (params.callbackUrl) qs.set("callbackUrl", params.callbackUrl);
    const query = qs.toString();
    redirect({
      href: query ? `/login?${query}` : "/login",
      locale,
    });
  }

  const callbackUrl = params.callbackUrl ?? "/";
  const defaultEmail = params.email?.trim() ?? "";

  return (
    <main className="mx-auto flex max-w-sm flex-col gap-6 px-4 py-12">
      <h1 className="text-2xl font-semibold">{t("loginTitle")}</h1>
      {params.reset === "1" ? (
        <p className="text-sm text-muted-foreground" role="status">
          {t("resetSuccess")}
        </p>
      ) : null}
      <LoginForm
        googleEnabled={isGoogleEnabled}
        callbackUrl={callbackUrl}
        defaultEmail={defaultEmail}
      />
      <p className="text-sm text-muted-foreground">
        {t("noAccount")}{" "}
        <Link href="/signup" className="font-medium underline">
          {t("register")}
        </Link>
      </p>
    </main>
  );
}
