import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {};

// Conecta next-intl (usa src/i18n/request.ts por defecto).
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
