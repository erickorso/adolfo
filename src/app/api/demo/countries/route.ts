import { NextResponse } from "next/server";
import { z } from "zod";
import {
  demoPublicApiDisabledResponse,
  isDemoPublicApiEnabled,
} from "@/lib/demo/is-demo-api-enabled";
import { getDemoCountries } from "@/services/demo/countries.provider";

export const runtime = "nodejs";

const querySchema = z.object({
  q: z.string().trim().min(1).optional(),
  code: z.string().trim().min(2).max(3).optional(),
  limit: z.coerce.number().int().min(1).max(250).default(50),
});

/**
 * GET /api/demo/countries?q=spain&limit=10
 * GET /api/demo/countries?code=ES
 * Proxy a countriesnow.space (sin API key).
 */
export async function GET(request: Request) {
  if (!isDemoPublicApiEnabled()) {
    return demoPublicApiDisabledResponse();
  }

  const url = new URL(request.url);
  const parsed = querySchema.safeParse({
    q: url.searchParams.get("q") ?? undefined,
    code: url.searchParams.get("code") ?? undefined,
    limit: url.searchParams.get("limit") ?? "50",
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  if (parsed.data.q && parsed.data.code) {
    return NextResponse.json(
      { error: "Usá q o code, no ambos" },
      { status: 400 },
    );
  }

  try {
    const data = await getDemoCountries({
      query: parsed.data.q,
      code: parsed.data.code,
      limit: parsed.data.limit,
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("demo/countries:", error);
    return NextResponse.json(
      { error: "No se pudieron obtener países" },
      { status: 502 },
    );
  }
}
