import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/test/mocks/server";
import { OpenAiProvider } from "./openai-provider";
import { AiProviderError } from "./ai-provider";

describe("OpenAiProvider", () => {
  it("devuelve el content del primer choice", async () => {
    server.use(
      http.post("https://api.openai.com/v1/chat/completions", () =>
        HttpResponse.json({
          choices: [{ message: { content: "hola openai" } }],
        }),
      ),
    );
    const provider = new OpenAiProvider("sk-test", "gpt-4o-mini");
    await expect(provider.generateText({ prompt: "hi" })).resolves.toBe(
      "hola openai",
    );
    expect(provider.id).toBe("openai:gpt-4o-mini");
  });

  it("lanza si falta la API key", async () => {
    const provider = new OpenAiProvider(undefined, "gpt-4o-mini");
    await expect(provider.generateText({ prompt: "x" })).rejects.toThrow(
      AiProviderError,
    );
  });
});
