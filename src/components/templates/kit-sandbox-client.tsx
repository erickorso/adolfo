"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import type { KitItemDTO } from "@/domain/kit/schemas";

type ListResponse = { items: KitItemDTO[] };

type KitSandboxClientProps = {
  initialItems: KitItemDTO[];
};

/**
 * Cliente del Kit fullstack: consume el BFF Next `/api/kit/*` (Postgres).
 * El microservicio Fastify (`services/kit-api`) replica el contrato en local.
 */
export function KitSandboxClient({ initialItems }: KitSandboxClientProps) {
  const t = useTranslations("kitSandbox");
  const [items, setItems] = useState(initialItems);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function refresh() {
    setError(null);
    const res = await fetch("/api/kit/items");
    if (!res.ok) {
      setError(t("loadError"));
      return;
    }
    const data = (await res.json()) as ListResponse;
    setItems(data.items);
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    setError(null);
    const res = await fetch("/api/kit/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: trimmed }),
    });
    if (!res.ok) {
      setError(t("saveError"));
      return;
    }
    setTitle("");
    await refresh();
  }

  async function toggleDone(item: KitItemDTO) {
    setBusyId(item.id);
    setError(null);
    try {
      const res = await fetch(`/api/kit/items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: !item.done }),
      });
      if (!res.ok) throw new Error("patch");
      await refresh();
    } catch {
      setError(t("saveError"));
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/kit/items/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("delete");
      await refresh();
    } catch {
      setError(t("saveError"));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <section
        aria-labelledby="kit-arch-heading"
        className="rounded-lg border border-border bg-card p-5 text-sm text-muted-foreground"
      >
        <h2
          id="kit-arch-heading"
          className="text-base font-semibold text-foreground"
        >
          {t("archTitle")}
        </h2>
        <p className="mt-2">{t("archBody")}</p>
        <ul className="mt-2 list-inside list-disc">
          <li>{t("archNext")}</li>
          <li>{t("archFastify")}</li>
        </ul>
      </section>

      <form
        onSubmit={onCreate}
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <label className="flex flex-1 flex-col gap-1.5 text-sm">
          <span className="font-medium">{t("titleLabel")}</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            placeholder={t("titlePlaceholder")}
            className="rounded-md border border-input bg-background px-3 py-2"
            aria-label={t("titleLabel")}
          />
        </label>
        <Button type="submit" disabled={!title.trim()}>
          {t("add")}
        </Button>
      </form>

      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("empty")}</p>
      ) : (
        <ul className="flex flex-col gap-2" aria-label={t("listLabel")}>
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-md border border-border px-3 py-2"
            >
              <input
                type="checkbox"
                checked={item.done}
                disabled={busyId === item.id}
                onChange={() => void toggleDone(item)}
                aria-label={t("toggleDone", { title: item.title })}
                className="size-4"
              />
              <span
                className={`flex-1 text-sm ${item.done ? "text-muted-foreground line-through" : ""}`}
              >
                {item.title}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={busyId === item.id}
                onClick={() => void remove(item.id)}
              >
                {t("delete")}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
