import { redirect } from "next/navigation";
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
    redirect("/login?callbackUrl=/account/cvs");
  }

  const resumes = await listResumes(user.id);

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Mis CVs</h1>
        <p className="text-sm text-muted-foreground">
          Subí hasta 3 CVs. Después podés mejorarlos con IA según cada oferta.
        </p>
      </header>
      <ResumeManager resumes={resumes} />
    </main>
  );
}
