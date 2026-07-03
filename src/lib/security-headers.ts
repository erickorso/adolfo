export type SecurityHeader = {
  key: string;
  value: string;
};

export type SecurityHeadersOptions = {
  /** HSTS solo en producción (evita pegarle a localhost). */
  includeHsts?: boolean;
};

/**
 * Headers de seguridad HTTP para todas las rutas (Next.js `headers()`).
 * CSP deliberadamente omitida (Three.js, Vercel, scripts inline) — fase 2.
 */
export function buildSecurityHeaders(
  options: SecurityHeadersOptions = {},
): SecurityHeader[] {
  const includeHsts =
    options.includeHsts ?? process.env.NODE_ENV === "production";

  const headers: SecurityHeader[] = [
    { key: "X-Frame-Options", value: "DENY" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=()",
    },
    { key: "X-DNS-Prefetch-Control", value: "on" },
  ];

  if (includeHsts) {
    headers.push({
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubDomains; preload",
    });
  }

  return headers;
}
