"use client";

import { useActionState, useCallback, useState } from "react";
import {
  updateProductAction,
  type UpdateProductResult,
} from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

type Attr = { name: string; value: string };

type ProductEditFormProps = {
  product: {
    id: string;
    name: string;
    description: string | null;
    priceCents: number;
    stock: number;
    attributes: Attr[];
  };
};

const INITIAL: UpdateProductResult = {};

/**
 * Editor de producto: campos básicos + propiedades custom (filas dinámicas).
 * Las propiedades viajan como JSON en un input oculto; la action las valida.
 */
export function ProductEditForm({ product }: ProductEditFormProps) {
  const [state, action, pending] = useActionState(updateProductAction, INITIAL);
  const [attrs, setAttrs] = useState<Attr[]>(product.attributes);

  const addRow = useCallback(() => {
    setAttrs((prev) => [...prev, { name: "", value: "" }]);
  }, []);

  const removeRow = useCallback((index: number) => {
    setAttrs((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateRow = useCallback(
    (index: number, key: keyof Attr, val: string) => {
      setAttrs((prev) =>
        prev.map((a, i) => (i === index ? { ...a, [key]: val } : a)),
      );
    },
    [],
  );

  return (
    <form action={action} className="flex max-w-2xl flex-col gap-4">
      <input type="hidden" name="id" value={product.id} />
      <input type="hidden" name="attributes" value={JSON.stringify(attrs)} />

      <Field label="Nombre">
        <input
          name="name"
          defaultValue={product.name}
          required
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </Field>

      <Field label="Descripción">
        <textarea
          name="description"
          defaultValue={product.description ?? ""}
          rows={4}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </Field>

      <div className="flex gap-4">
        <Field label="Precio (centavos)">
          <input
            name="priceCents"
            type="number"
            min={0}
            defaultValue={product.priceCents}
            required
            className="w-40 rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Stock">
          <input
            name="stock"
            type="number"
            min={0}
            defaultValue={product.stock}
            required
            className="w-28 rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </Field>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Propiedades custom</span>
          <Button type="button" size="sm" variant="outline" onClick={addRow}>
            Agregar propiedad
          </Button>
        </div>
        {attrs.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            Sin propiedades. Ej: Color → Azul, Talle → M.
          </p>
        ) : (
          attrs.map((attr, i) => (
            <div key={i} className="flex items-center gap-2">
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
          {pending ? "Guardando…" : "Guardar"}
        </Button>
        {state.ok ? (
          <span className="text-sm text-green-700">Guardado.</span>
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
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
