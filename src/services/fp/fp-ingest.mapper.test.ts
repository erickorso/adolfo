import { describe, expect, it } from "vitest";
import {
  accessLabelForLevel,
  mapJcylRecordToFp,
  requiresBachillerForLevel,
} from "./fp-ingest.mapper";

describe("requiresBachillerForLevel", () => {
  it("solo nivel 3 requiere Bachiller", () => {
    expect(requiresBachillerForLevel(1)).toBe(false);
    expect(requiresBachillerForLevel(2)).toBe(false);
    expect(requiresBachillerForLevel(3)).toBe(true);
  });
});

describe("mapJcylRecordToFp", () => {
  it("mapea certificado nivel 3", () => {
    const row = mapJcylRecordToFp({
      familia: "ADG",
      codigo: "ADGG0108",
      denominacion: "ASISTENCIA A LA DIRECCIÓN",
      consultar_estructura: "https://example.com/estructura",
      consultar_programa_real_decreto: "https://example.com/rd.pdf",
      nivel_cp: 3,
      horas_totales_certificado: 610,
      completa_en_teleformacion: "Completa",
      real_decreto: "1210/2009",
    });

    expect(row).toMatchObject({
      source: "fp-certificado",
      externalId: "ADGG0108",
      level: 3,
      requiresBachiller: true,
      hours: 610,
      family: "ADG",
    });
    expect(row?.description).toContain("Nivel 3");
    expect(row?.description).toContain("1210/2009");
  });

  it("rechaza nivel inválido", () => {
    expect(
      mapJcylRecordToFp({
        familia: "ADG",
        codigo: "X",
        denominacion: "Test",
        consultar_estructura: null,
        consultar_programa_real_decreto: null,
        nivel_cp: 9,
        horas_totales_certificado: 10,
        completa_en_teleformacion: null,
        real_decreto: null,
      }),
    ).toBeNull();
  });
});

describe("accessLabelForLevel", () => {
  it("etiqueta nivel 1 sin requisito", () => {
    expect(accessLabelForLevel(1)).toMatch(/sin requisito/i);
  });
});
