import { describe, expect, it, vi } from "vitest";
import { improveResume } from "./resume-tailor";
import type { AiProvider } from "@/services/ai";
import type { TailorInput } from "./resume-tailor.prompt";

const input: TailorInput = {
  resumeText: "CV de Erick, React.",
  jobTitle: "Frontend Engineer",
  jobCompany: "Acme",
  jobDescription: "React + TS",
};

function stubProvider(text: string): AiProvider {
  return {
    id: "stub:test",
    generateText: vi.fn().mockResolvedValue(text),
  };
}

describe("improveResume", () => {
  it("devuelve sugerencias + reescritura + modelo", async () => {
    const provider = stubProvider(
      JSON.stringify({ suggestions: "- agregá TS", rewrite: "# CV nuevo" }),
    );
    const result = await improveResume(input, provider);
    expect(result).toEqual({
      suggestions: "- agregá TS",
      rewrite: "# CV nuevo",
      model: "stub:test",
    });
  });

  it("propaga el error si la salida no es parseable", async () => {
    const provider = stubProvider("respuesta sin json");
    await expect(improveResume(input, provider)).rejects.toThrow();
  });
});
