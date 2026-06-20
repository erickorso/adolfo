import { defineRouting } from "next-intl/routing";

/** Configuración de ruteo i18n: locales soportados y default. */
export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
});
