"use client";

import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

type FpSearchFormProps = {
  initialQuery: {
    q?: string;
    level?: string;
    bachiller?: string;
  };
};

export function FpSearchForm({ initialQuery }: FpSearchFormProps) {
  const t = useTranslations("fp");
  const router = useRouter();

  return (
    <form
      className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:flex-wrap sm:items-end"
      aria-label={t("searchLabel")}
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const params = new URLSearchParams();
        const q = String(fd.get("q") ?? "").trim();
        const level = String(fd.get("level") ?? "").trim();
        const bachiller = String(fd.get("bachiller") ?? "").trim();
        if (q) params.set("q", q);
        if (level) params.set("level", level);
        if (bachiller) params.set("bachiller", bachiller);
        const qs = params.toString();
        router.push(qs ? `/courses/fp?${qs}` : "/courses/fp");
      }}
    >
      <label className="flex min-w-[12rem] flex-1 flex-col gap-1 text-sm">
        <span className="font-medium">{t("search")}</span>
        <input
          name="q"
          type="search"
          defaultValue={initialQuery.q ?? ""}
          placeholder={t("searchPlaceholder")}
          className="rounded-md border border-input bg-background px-3 py-2"
        />
      </label>
      <label className="flex w-full flex-col gap-1 text-sm sm:w-36">
        <span className="font-medium">{t("level")}</span>
        <select
          name="level"
          defaultValue={initialQuery.level ?? ""}
          className="rounded-md border border-input bg-background px-3 py-2"
        >
          <option value="">{t("levelAll")}</option>
          <option value="1">{t("level1")}</option>
          <option value="2">{t("level2")}</option>
          <option value="3">{t("level3")}</option>
        </select>
      </label>
      <label className="flex w-full flex-col gap-1 text-sm sm:w-48">
        <span className="font-medium">{t("bachiller")}</span>
        <select
          name="bachiller"
          defaultValue={initialQuery.bachiller ?? ""}
          className="rounded-md border border-input bg-background px-3 py-2"
        >
          <option value="">{t("bachillerAll")}</option>
          <option value="no">{t("bachillerNo")}</option>
          <option value="yes">{t("bachillerYes")}</option>
        </select>
      </label>
      <button
        type="submit"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        {t("searchCta")}
      </button>
    </form>
  );
}
