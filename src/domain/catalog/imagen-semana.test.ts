import { describe, expect, it } from "vitest";
import {
  IMAGEN_SEMANA_VARIANTS,
  imagenSemanaVariantForDate,
} from "./imagen-semana";

describe("imagenSemanaVariantForDate", () => {
  it("elige un variant estable del pool", () => {
    const v = imagenSemanaVariantForDate(new Date("2026-07-27T12:00:00Z"));
    expect(IMAGEN_SEMANA_VARIANTS.map((x) => x.id)).toContain(v.id);
    expect(v.imageUrl.startsWith("/catalog/imagen-semana/")).toBe(true);
  });

  it("cambia entre semanas distintas", () => {
    const a = imagenSemanaVariantForDate(new Date("2026-01-05T12:00:00Z"));
    const b = imagenSemanaVariantForDate(new Date("2026-01-12T12:00:00Z"));
    expect(a.id).not.toBe(b.id);
  });
});
