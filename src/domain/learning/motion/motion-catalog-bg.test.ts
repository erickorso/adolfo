import { describe, expect, it } from "vitest";
import {
  motionCatalogBgTransform,
  motionCatalogBgVisibility,
  pickActiveMotionCatalogSection,
} from "./motion-catalog-bg";

describe("motionCatalogBgTransform", () => {
  it("ltr va de izquierda a derecha", () => {
    const start = motionCatalogBgTransform("ltr", 0, 1400, 1000);
    const end = motionCatalogBgTransform("ltr", 1, 1400, 1000);
    expect(end.x).toBeGreaterThan(start.x);
  });

  it("rtl va de derecha a izquierda", () => {
    const start = motionCatalogBgTransform("rtl", 0, 1400, 1000);
    const end = motionCatalogBgTransform("rtl", 1, 1400, 1000);
    expect(end.x).toBeLessThan(start.x);
  });
});

describe("motionCatalogBgVisibility", () => {
  it("oculta si no es la sección activa", () => {
    expect(motionCatalogBgVisibility(0.5, true, false)).toBe(0);
  });

  it("visible solo en ventana central", () => {
    expect(motionCatalogBgVisibility(0.05, true, true)).toBe(0);
    expect(motionCatalogBgVisibility(0.5, true, true)).toBeGreaterThan(0);
    expect(motionCatalogBgVisibility(0.95, true, true)).toBe(0);
  });
});

describe("pickActiveMotionCatalogSection", () => {
  it("elige la sección más centrada en viewport", () => {
    const active = pickActiveMotionCatalogSection([
      { sectionId: "easing", progress: 0.2, inView: true },
      { sectionId: "offset", progress: 0.52, inView: true },
      { sectionId: "fade", progress: 0.9, inView: true },
    ]);
    expect(active).toBe("offset");
  });
});
