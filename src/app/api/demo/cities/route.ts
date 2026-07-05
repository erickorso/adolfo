import { NextResponse } from "next/server";
import { z } from "zod";
import {
  demoPublicApiDisabledResponse,
  isDemoPublicApiEnabled,
} from "@/lib/demo/is-demo-api-enabled";
import { getDemoCities } from "@/services/demo/cities.provider";

export const runtime = "nodejs";

const querySchema = z.object({
  country: z.string().trim().min(2, "country is required"),
  limit: z.coerce.number().int().min(1).max(500).default(50),
});

/**
 * GET /api/demo/cities?country=Spain&limit=20
 * Proxy a countriesnow.space (sin API key).
 */
export async function GET(request: Request) {
  if (!isDemoPublicApiEnabled()) {
    return demoPublicApiDisabledResponse();
  }

  const url = new URL(request.url);
  const parsed = querySchema.safeParse({
    country: url.searchParams.get("country"),
    limit: url.searchParams.get("limit") ?? "50",
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const data = await getDemoCities(parsed.data.country, parsed.data.limit);
    return NextResponse.json(data);
  } catch (error) {
    console.error("demo/cities:", error);
    return NextResponse.json(
      { error: "No se encontraron ciudades para ese país" },
      { status: 404 },
    );
  }
}
