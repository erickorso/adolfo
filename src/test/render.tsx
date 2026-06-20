import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "../../messages/es.json";

/**
 * Render para tests que envuelve en NextIntlClientProvider con los mensajes es,
 * para componentes que usan useTranslations.
 */
export function renderWithIntl(ui: ReactElement) {
  return render(
    <NextIntlClientProvider locale="es" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

export * from "@testing-library/react";
