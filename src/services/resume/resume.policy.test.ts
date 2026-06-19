import { describe, expect, it } from "vitest";
import {
  assertCanAddResume,
  assertValidResumeFile,
  InvalidResumeFileError,
  isPdf,
  MAX_RESUME_BYTES,
  MAX_RESUMES,
  ResumeLimitError,
} from "./resume.policy";

describe("resume.policy", () => {
  it("permite agregar por debajo del límite", () => {
    expect(() => assertCanAddResume(MAX_RESUMES - 1)).not.toThrow();
  });

  it("bloquea al alcanzar el límite", () => {
    expect(() => assertCanAddResume(MAX_RESUMES)).toThrow(ResumeLimitError);
  });

  it("acepta un PDF dentro del tamaño", () => {
    expect(() =>
      assertValidResumeFile({ mimeType: "application/pdf", sizeBytes: 1000 }),
    ).not.toThrow();
  });

  it("rechaza un MIME no soportado", () => {
    expect(() =>
      assertValidResumeFile({ mimeType: "image/png", sizeBytes: 1000 }),
    ).toThrow(InvalidResumeFileError);
  });

  it("rechaza un archivo vacío", () => {
    expect(() =>
      assertValidResumeFile({ mimeType: "application/pdf", sizeBytes: 0 }),
    ).toThrow(InvalidResumeFileError);
  });

  it("rechaza un archivo demasiado grande", () => {
    expect(() =>
      assertValidResumeFile({
        mimeType: "application/pdf",
        sizeBytes: MAX_RESUME_BYTES + 1,
      }),
    ).toThrow(InvalidResumeFileError);
  });

  it("isPdf distingue PDF de DOCX", () => {
    expect(isPdf("application/pdf")).toBe(true);
    expect(
      isPdf(
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ),
    ).toBe(false);
  });
});
