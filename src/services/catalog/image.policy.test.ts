import { describe, expect, it } from "vitest";
import {
  assertValidImage,
  imageExt,
  InvalidImageError,
  MAX_IMAGE_BYTES,
} from "./image.policy";

describe("image.policy", () => {
  it("acepta JPEG/PNG/WebP dentro del tamaño", () => {
    expect(() =>
      assertValidImage({ mimeType: "image/png", sizeBytes: 1000 }),
    ).not.toThrow();
    expect(() =>
      assertValidImage({ mimeType: "image/webp", sizeBytes: 1000 }),
    ).not.toThrow();
  });

  it("rechaza formatos no soportados", () => {
    expect(() =>
      assertValidImage({ mimeType: "image/gif", sizeBytes: 1000 }),
    ).toThrow(InvalidImageError);
    expect(() =>
      assertValidImage({ mimeType: "application/pdf", sizeBytes: 1000 }),
    ).toThrow(InvalidImageError);
  });

  it("rechaza vacío y oversize", () => {
    expect(() =>
      assertValidImage({ mimeType: "image/jpeg", sizeBytes: 0 }),
    ).toThrow(InvalidImageError);
    expect(() =>
      assertValidImage({ mimeType: "image/jpeg", sizeBytes: MAX_IMAGE_BYTES + 1 }),
    ).toThrow(InvalidImageError);
  });

  it("mapea la extensión por MIME", () => {
    expect(imageExt("image/png")).toBe("png");
    expect(imageExt("image/webp")).toBe("webp");
    expect(imageExt("image/jpeg")).toBe("jpg");
  });
});
