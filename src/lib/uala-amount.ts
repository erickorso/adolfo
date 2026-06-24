/**
 * Convierte centavos internos a string decimal ARS exigido por Ualá Bis v2.
 * Ej: 1500000 → "15000.00"
 * Docs: https://developers.ualabis.com.ar/v2/orders/create
 */
export function formatCentsToUalaAmount(cents: number): string {
  if (!Number.isInteger(cents) || cents < 0) {
    throw new Error(`Monto inválido para Ualá: ${cents}`);
  }
  return (cents / 100).toFixed(2);
}
