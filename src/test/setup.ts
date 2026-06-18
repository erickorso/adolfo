import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll } from "vitest";
import { cleanup } from "@testing-library/react";
import { server } from "./mocks/server";

// ── MSW: ciclo de vida del servidor de mocks ──
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
  cleanup(); // desmonta componentes RTL entre tests
});
afterAll(() => server.close());
