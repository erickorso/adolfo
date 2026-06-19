import { describe, expect, it } from "vitest";
import { resumeToVM } from "./resume.mapper";
import type { Resume } from "@/generated/prisma/client";

const base: Resume = {
  id: "r1",
  userId: "u1",
  label: "CV Frontend",
  storageKey: "resumes/u1/abc.pdf",
  mimeType: "application/pdf",
  sizeBytes: 2048,
  extractedText: "Erick Vargas — Frontend Engineer...",
  isDefault: true,
  createdAt: new Date("2026-01-01T00:00:00Z"),
  updatedAt: new Date("2026-01-01T00:00:00Z"),
};

describe("resume.mapper", () => {
  it("proyecta a VM sin exponer storageKey ni el texto crudo", () => {
    const vm = resumeToVM(base);
    expect(vm).not.toHaveProperty("storageKey");
    expect(vm).not.toHaveProperty("extractedText");
    expect(vm).toMatchObject({
      id: "r1",
      label: "CV Frontend",
      mimeType: "application/pdf",
      isDefault: true,
      hasText: true,
    });
  });

  it("hasText es false cuando no hay texto extraído", () => {
    expect(resumeToVM({ ...base, extractedText: null }).hasText).toBe(false);
    expect(resumeToVM({ ...base, extractedText: "" }).hasText).toBe(false);
  });
});
