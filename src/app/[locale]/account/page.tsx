import { Link } from "@/i18n/navigation";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/services/users/user.service";

/**
 * Página "Mi cuenta" — protegida.
 *
 * Demuestra la estrategia de sesión: `getCurrentUser()` lee Auth.js y la fila
 * local en Prisma. Si no hay sesión, redirige a login.
 */
export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    const locale = await getLocale();
    redirect(`/${locale}/login?callbackUrl=/${locale}/account`);
  }

  const t = await getTranslations("account");

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
        <dt className="font-medium text-muted-foreground">{t("name")}</dt>
        <dd>{user.name ?? "—"}</dd>
        <dt className="font-medium text-muted-foreground">{t("email")}</dt>
        <dd>{user.email}</dd>
        <dt className="font-medium text-muted-foreground">{t("role")}</dt>
        <dd>{user.role}</dd>
        <dt className="font-medium text-muted-foreground">{t("internalId")}</dt>
        <dd className="font-mono text-xs">{user.id}</dd>
      </dl>
      <div className="flex flex-col gap-2">
        <Link href="/account/orders" className="text-sm font-medium underline">
          {t("manageOrders")}
        </Link>
        <Link href="/account/cvs" className="text-sm font-medium underline">
          {t("manageCvs")}
        </Link>
        <Link href="/account/applications" className="text-sm font-medium underline">
          {t("manageApplications")}
        </Link>
      </div>
    </main>
  );
}
