import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Price } from "./price";

describe("Price", () => {
  it("formatea centavos a moneda legible", () => {
    render(<Price cents={1500000} currency="ARS" />);
    // 1.500.000 centavos = $ 1.500.000 / 100 = $ 15.000,00
    expect(screen.getByText(/15\.000,00/)).toBeInTheDocument();
  });

  it("renderiza cero correctamente", () => {
    render(<Price cents={0} />);
    expect(screen.getByText(/0,00/)).toBeInTheDocument();
  });
});
