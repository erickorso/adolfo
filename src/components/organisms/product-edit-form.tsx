"use client";

import { cloneElement, useActionState, useCallback, useId, useState } from "react";
import { useTranslations } from "next-intl";
import {
  updateProductAction,
  type UpdateProductResult,
} from "@/app/[locale]/admin/actions";
import { Button } from "@/components/ui/button";

type AttrRow = { rowKey: string; name: string; value: string };

type ProductEditFormProps = {
  product: {
    id: string;
    name: string;
    description: string | null;
    priceCents: number;
    stock: number;
    attributes: { name: string; value: string }[];
  };
};

const INITIAL: UpdateProductResult = {};

/**
 * Editor de producto: campos básicos + propiedades custom (filas dinámicas).
 * Las propiedades viajan como JSON en un input oculto; la action las valida.
 */
export function ProductEditForm({ product }: ProductEditFormProps) {
  const t = useTranslations("admin");
  const [state, action, pending] = useActionState(updateProductAction, INITIAL);
  const [attrs, setAttrs] = useState<AttrRow[]>(() =>
    product.attributes.map((attr) => ({
      ...attr,
      rowKey: crypto.randomUUID(),
    })),
  );

  const addRow = useCallback(() => {
    setAttrs((prev) => [
      ...prev,
      { rowKey: crypto.randomUUID(), name: "", value: "" },
    ]);
  }, []);

  const removeRow = useCallback((index: number) => {
    setAttrs((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateRow = useCallback(
    (index: number, key: keyof Pick<AttrRow, "name" | "value">, val: string) => {
      setAttrs((prev) =>
        prev.map((a, i) => (i === index ? { ...a, [key]: val } : a)),
      );
    },
    [],
  );

  return (
    <form action={action} className="flex max-w-2xl flex-col gap-4">
      <input type="hidden" name="id" value={product.id} />
      <input
        type="hidden"
        name="attributes"
        value={JSON.stringify(attrs.map(({ name, value }) => ({ name, value })))}
      />

      <Field label={t("name")}>
        <input
          name="name"
          aria-label={t("name")}
          defaultValue={product.name}
          required
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </Field>

      <Field label={t("descriptionLabel")}>
        <textarea
          name="description"
          aria-label={t("descriptionLabel")}
          defaultValue={product.description ?? ""}
          rows={4}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </Field>

      <div className="flex gap-4">
        <Field label={t("priceCentsLabel")}>
          <input
            name="priceCents"
            type="number"
            aria-label={t("priceCentsLabel")}
            min={0}
            defaultValue={product.priceCents}
            required
            className="w-40 rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </Field>
        <Field label={t("stockLabel")}>
          <input
            name="stock"
            type="number"
            aria-label={t("stockLabel")}
            min={0}
            defaultValue={product.stock}
            required
            className="w-28 rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </Field>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{t("customProps")}</span>
          <Button type="button" size="sm" variant="outline" onClick={addRow}>
            {t("addProp")}
          </Button>
        </div>
        {attrs.length === 0 ? (
          <p className="text-xs text-muted-foreground">{t("noProps")}</p>
        ) : (
          attrs.map((attr, i) => (
            <div key={attr.rowKey} className="flex items-center gap-2">
              <input
                aria-label="Nombre de propiedad"
                placeholder="Color"
                value={attr.name}
                onChange={(e) => updateRow(i, "name", e.target.value)}
                className="w-40 rounded-md border border-input bg-background px-2 py-1.5 text-sm"
              />
              <input
                aria-label="Valor de propiedad"
                placeholder="Azul"
                value={attr.value}
                onChange={(e) => updateRow(i, "value", e.target.value)}
                className="flex-1 rounded-md border border-input bg-background px-2 py-1.5 text-sm"
              />
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => removeRow(i)}
                aria-label="Quitar propiedad"
              >
                ✕
              </Button>
            </div>
          ))
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? t("saving") : t("save")}
        </Button>
        {state.ok ? (
          <span className="text-sm text-green-700">{t("saved")}</span>
        ) : null}
        {state.error ? (
          <span className="text-sm text-destructive">{state.error}</span>
        ) : null}
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactElement<{ id?: string; "aria-label"?: string }>;
}) {
  const generatedId = useId();
  const controlId = children.props.id ?? generatedId;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={controlId} className="text-sm font-medium">
        {label}
      </label>
      {cloneElement(children, {
        id: controlId,
        "aria-label": children.props["aria-label"] ?? label,
      })}
    </div>
  );
}
