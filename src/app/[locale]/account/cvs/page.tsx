import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/services/users/user.service";
import { listResumes } from "@/services/resume/resume.service";
import { ResumeManager } from "@/components/organisms/resume-manager";

/**
 * Página "Mis CVs" — protegida. Lista los CVs del usuario y permite subir
 * hasta 3. La mejora asistida por IA se hace desde cada oferta.
 */
export default async function ResumesPage() {
  const user = await getCurrentUser();
  if (!user) {
    const locale = await getLocale();
    redirect(`/${locale}/login?callbackUrl=/${locale}/account/cvs`);
  }

  const resumes = await listResumes(user.id);
  const t = await getTranslations("cvs");

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </header>
      <ResumeManager resumes={resumes} />
    </main>
  );
}
