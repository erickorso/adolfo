import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/test/mocks/server";
import { ClaudeProvider } from "./claude-provider";
import { AiProviderError } from "./ai-provider";

describe("ClaudeProvider", () => {
  it("concatena bloques de texto", async () => {
    server.use(
      http.post("https://api.anthropic.com/v1/messages", () =>
        HttpResponse.json({
          content: [
            { type: "text", text: "hola " },
            { type: "text", text: "claude" },
          ],
        }),
      ),
    );
    const provider = new ClaudeProvider("ak-test", "claude-sonnet-4-20250514");
    await expect(provider.generateText({ prompt: "hi" })).resolves.toBe(
      "hola claude",
    );
  });

  it("lanza si falta la API key", async () => {
    const provider = new ClaudeProvider(undefined, "claude-sonnet-4-20250514");
    await expect(provider.generateText({ prompt: "x" })).rejects.toThrow(
      AiProviderError,
    );
  });
});
