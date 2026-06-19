import "server-only";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import type { RateType, RateVM } from "@/domain/money/rate.types";
import { DolarApiProvider } from "./dolarapi.provider";

const provider = new DolarApiProvider();

/** Ventana de frescura del cache: 12 horas. */
const FRESH_MS = 12 * 60 * 60 * 1000;

/** Tipo de dólar por defecto (configurable por entorno). */
export function defaultRateType(): RateType {
  return env.EXCHANGE_RATE_TYPE;
}

/** Trae todas las cotizaciones del proveedor y las cachea (upsert). Para cron. */
export async function ingestRates(): Promise<{ updated: number }> {
  const rates = await provider.fetchRates();
  for (const rate of rates) {
    await prisma.exchangeRate.upsert({
      where: { source_type: { source: provider.name, type: rate.type } },
      create: {
        source: provider.name,
        type: rate.type,
        buyArs: rate.buyArs,
        sellArs: rate.sellArs,
        fetchedAt: new Date(),
      },
      update: {
        buyArs: rate.buyArs,
        sellArs: rate.sellArs,
        fetchedAt: new Date(),
      },
    });
  }
  return { updated: rates.length };
}

/**
 * Cotización actual de un tipo (read-through cache): usa el valor cacheado si
 * es fresco; si no, refresca contra el proveedor. Si el proveedor falla, cae al
 * valor viejo (graceful). Devuelve null si no hay dato ni se pudo traer.
 */
export async function getCurrentRate(
  type: RateType = defaultRateType(),
): Promise<RateVM | null> {
  const existing = await prisma.exchangeRate.findUnique({
    where: { source_type: { source: provider.name, type } },
  });

  const isFresh =
    existing && Date.now() - existing.fetchedAt.getTime() < FRESH_MS;
  if (existing && isFresh) {
    return { type, sellArs: existing.sellArs };
  }

  try {
    await ingestRates();
    const updated = await prisma.exchangeRate.findUnique({
      where: { source_type: { source: provider.name, type } },
    });
    if (updated) {
      return { type, sellArs: updated.sellArs };
    }
  } catch (error) {
    console.error("No se pudo actualizar la cotización:", error);
  }

  // Fallback al valor viejo si existe.
  return existing ? { type, sellArs: existing.sellArs } : null;
}
