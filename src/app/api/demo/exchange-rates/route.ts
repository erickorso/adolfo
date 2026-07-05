import { NextResponse } from "next/server";
import { z } from "zod";
import {
  demoPublicApiDisabledResponse,
  isDemoPublicApiEnabled,
} from "@/lib/demo/is-demo-api-enabled";
import { getDemoExchangeRates } from "@/services/demo/exchange-rates.provider";

export const runtime = "nodejs";

const querySchema = z.object({
  base: z
    .string()
    .trim()
    .length(3, "base must be a 3-letter ISO currency code")
    .transform((value) => value.toUpperCase())
    .default("USD"),
});

/**
 * GET /api/demo/exchange-rates?base=USD
 * Proxy a open.er-api.com (sin API key). Complementa dolarapi interno para ARS.
 */
export async function GET(request: Request) {
  if (!isDemoPublicApiEnabled()) {
    return demoPublicApiDisabledResponse();
  }

  const url = new URL(request.url);
  const parsed = querySchema.safeParse({ base: url.searchParams.get("base") ?? "USD" });

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const data = await getDemoExchangeRates(parsed.data.base);
    return NextResponse.json(data);
  } catch (error) {
    console.error("demo/exchange-rates:", error);
    return NextResponse.json(
      { error: "No se pudieron obtener tipos de cambio" },
      { status: 502 },
    );
  }
}
