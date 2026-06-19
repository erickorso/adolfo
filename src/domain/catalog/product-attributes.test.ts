import { describe, expect, it } from "vitest";
import {
  parseAttributesJson,
  productAttributesInputSchema,
} from "./product-attributes";

describe("product-attributes", () => {
  it("parsea un JSON válido y recorta espacios", () => {
    const out = parseAttributesJson(
      JSON.stringify([{ name: " Color ", value: " Azul " }]),
    );
    expect(out).toEqual([{ name: "Color", value: "Azul" }]);
  });

  it("descarta entradas inválidas (devuelve [])", () => {
    expect(parseAttributesJson("no json")).toEqual([]);
    expect(parseAttributesJson(JSON.stringify([{ name: "", value: "x" }]))).toEqual(
      [],
    );
    expect(parseAttributesJson(JSON.stringify("nope"))).toEqual([]);
  });

  it("el schema rechaza más de 30 propiedades", () => {
    const many = Array.from({ length: 31 }, (_, i) => ({
      name: `n${i}`,
      value: "v",
    }));
    expect(productAttributesInputSchema.safeParse(many).success).toBe(false);
  });
});
