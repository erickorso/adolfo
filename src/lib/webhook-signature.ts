import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Verifica una firma HMAC-SHA256 con comparación a tiempo constante.
 * Función pura y aislada (sin dependencias de entorno) para poder testearla
 * y reutilizarla en cualquier webhook.
 *
 * @param rawBody  body CRUDO de la request (string), antes de parsear JSON.
 * @param signature firma recibida en el header (hex).
 * @param secret   secreto compartido.
 */
export function verifyHmacSignature(
  rawBody: string,
  signature: string,
  secret: string,
): boolean {
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");

  const expectedBuf = Buffer.from(expected);
  const receivedBuf = Buffer.from(signature);

  // timingSafeEqual exige misma longitud; si difieren, la firma es inválida.
  if (expectedBuf.length !== receivedBuf.length) {
    return false;
  }
  return timingSafeEqual(expectedBuf, receivedBuf);
}

/** Genera la firma esperada para un body (útil en tests y al firmar salientes). */
export function signHmac(rawBody: string, secret: string): string {
  return createHmac("sha256", secret).update(rawBody).digest("hex");
}
