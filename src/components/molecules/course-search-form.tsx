"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

type CourseSearchFormProps = {
  initialQuery: {
    q?: string;
    minHours?: number;
    location?: string;
  };
};

export function CourseSearchForm({ initialQuery }: CourseSearchFormProps) {
  const t = useTranslations("courses");
  const router = useRouter();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    const q = String(form.get("q") ?? "").trim();
    const minHours = String(form.get("minHours") ?? "").trim();
    const location = String(form.get("location") ?? "").trim();

    if (q) params.set("q", q);
    if (minHours) params.set("minHours", minHours);
    if (location) params.set("location", location);

    const query = params.toString();
    router.push(query ? `/courses?${query}` : "/courses");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-3 rounded-lg border border-border bg-card p-4 md:grid-cols-4"
      aria-label={t("searchLabel")}
    >
      <label className="flex flex-col gap-1 md:col-span-2">
        <span className="text-sm font-medium">{t("search")}</span>
        <input
          name="q"
          type="search"
          defaultValue={initialQuery.q ?? ""}
          placeholder={t("searchPlaceholder")}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">{t("minHours")}</span>
        <input
          name="minHours"
          type="number"
          min={1}
          step={1}
          defaultValue={initialQuery.minHours ?? ""}
          placeholder="100"
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">{t("location")}</span>
        <input
          name="location"
          type="text"
          defaultValue={initialQuery.location ?? ""}
          placeholder={t("locationPlaceholder")}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </label>
      <div className="md:col-span-4">
        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          {t("searchCta")}
        </button>
      </div>
    </form>
  );
}
