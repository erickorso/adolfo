import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/test/mocks/server";
import { GeminiProvider } from "./gemini-provider";
import { AiProviderError } from "./ai-provider";

describe("GeminiProvider", () => {
  it("envía el prompt y devuelve el texto del candidato", async () => {
    let receivedKey: string | null = null;
    server.use(
      http.post(
        "https://generativelanguage.googleapis.com/v1beta/models/:rest",
        ({ request }) => {
          receivedKey = request.headers.get("x-goog-api-key");
          return HttpResponse.json({
            candidates: [{ content: { parts: [{ text: "respuesta IA" }] } }],
          });
        },
      ),
    );

    const provider = new GeminiProvider("test-key", "gemini-2.0-flash");
    const out = await provider.generateText({ prompt: "hola" });
    expect(out).toBe("respuesta IA");
    expect(receivedKey).toBe("test-key");
    expect(provider.id).toBe("gemini:gemini-2.0-flash");
  });

  it("lanza si falta la API key (sin pegarle a la red)", async () => {
    const provider = new GeminiProvider(undefined, "gemini-2.0-flash");
    await expect(provider.generateText({ prompt: "x" })).rejects.toThrow(
      AiProviderError,
    );
  });

  it("lanza AiProviderError ante error HTTP", async () => {
    server.use(
      http.post(
        "https://generativelanguage.googleapis.com/v1beta/models/:rest",
        () => new HttpResponse("nope", { status: 500 }),
      ),
    );
    const provider = new GeminiProvider("k", "gemini-2.0-flash");
    await expect(provider.generateText({ prompt: "x" })).rejects.toThrow(
      AiProviderError,
    );
  });

  it("marca AI_QUOTA ante 429", async () => {
    server.use(
      http.post(
        "https://generativelanguage.googleapis.com/v1beta/models/:rest",
        () =>
          new HttpResponse(JSON.stringify({ error: { status: "RESOURCE_EXHAUSTED" } }), {
            status: 429,
          }),
      ),
    );
    const provider = new GeminiProvider("k", "gemini-2.0-flash");
    await expect(provider.generateText({ prompt: "x" })).rejects.toMatchObject({
      name: "AiProviderError",
      code: "AI_QUOTA",
      httpStatus: 429,
    });
  });
});
