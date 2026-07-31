import { describe, expect, it } from "vitest";
import {
  createKitItemSchema,
  updateKitItemSchema,
} from "./schemas";

describe("kit schemas", () => {
  it("acepta create válido", () => {
    expect(createKitItemSchema.parse({ title: "  Hola  " }).title).toBe("Hola");
  });

  it("rechaza update vacío", () => {
    expect(updateKitItemSchema.safeParse({}).success).toBe(false);
  });
});
