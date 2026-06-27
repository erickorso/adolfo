import { getTranslations } from "next-intl/server";
import { Sandbox3dPageClient } from "@/components/templates/sandbox-3d-page-client";

export default async function Sandbox3dPage() {
  const t = await getTranslations("sandbox3d");

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10">
      <header className="flex max-w-3xl flex-col gap-2">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </header>
      <Sandbox3dPageClient />
    </main>
  );
}
