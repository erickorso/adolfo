import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { buildSecurityHeaders } from "./src/lib/security-headers";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: buildSecurityHeaders(),
      },
    ];
  },
};

// Conecta next-intl (usa src/i18n/request.ts por defecto).
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
