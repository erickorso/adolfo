import { getTranslations } from "next-intl/server";
import { KitSandboxClient } from "@/components/templates/kit-sandbox-client";
import { listKitItems } from "@/services/kit/kit.service";

export default async function KitSandboxPage() {
  const [t, items] = await Promise.all([
    getTranslations("kitSandbox"),
    listKitItems(),
  ]);

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10">
      <header className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-primary">{t("eyebrow")}</p>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </header>
      <KitSandboxClient initialItems={items} />
    </main>
  );
}
