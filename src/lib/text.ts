/**
 * Convierte HTML a texto plano (para mostrar descripciones de fuentes externas
 * sin riesgo de XSS). No es un sanitizador completo: se usa para RENDER como
 * texto, nunca como HTML.
 */
export function htmlToText(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}
