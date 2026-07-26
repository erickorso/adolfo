import { NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";
import { AiProviderError } from "@/services/ai/ai-provider";
import { aiProvider } from "@/services/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  prompt: z.string().min(1),
  system: z.string().optional(),
  maxOutputTokens: z.number().int().positive().max(8192).optional(),
  temperature: z.number().min(0).max(2).optional(),
});

function isAiGenerateAuthorized(request: Request): boolean {
  const secret = env.AI_GENERATE_SECRET ?? env.JOBS_INGEST_SECRET;
  if (!secret) {
    return false;
  }
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

/**
 * Generación de texto vía proveedor configurado (`AI_PROVIDER`).
 * Pensado para n8n / automatizaciones: Authorization Bearer.
 */
export async function POST(request: Request): Promise<NextResponse> {
  if (!env.AI_GENERATE_SECRET && !env.JOBS_INGEST_SECRET) {
    return NextResponse.json(
      {
        error:
          "IA generate deshabilitado (configurar AI_GENERATE_SECRET o JOBS_INGEST_SECRET)",
      },
      { status: 403 },
    );
  }
  if (!isAiGenerateAuthorized(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Body inválido", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const text = await aiProvider.generateText(parsed.data);
    return NextResponse.json({ text, provider: aiProvider.id });
  } catch (err) {
    if (err instanceof AiProviderError) {
      return NextResponse.json({ error: err.message }, { status: 502 });
    }
    throw err;
  }
}
