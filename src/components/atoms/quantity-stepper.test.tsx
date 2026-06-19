import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QuantityStepper } from "./quantity-stepper";

describe("QuantityStepper", () => {
  it("emite +1 al sumar", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<QuantityStepper value={2} onChange={onChange} />);
    await user.click(screen.getByLabelText("Sumar uno"));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("emite -1 al restar", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<QuantityStepper value={2} onChange={onChange} />);
    await user.click(screen.getByLabelText("Restar uno"));
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it("no baja del mínimo (botón deshabilitado)", () => {
    render(<QuantityStepper value={1} onChange={vi.fn()} />);
    expect(screen.getByLabelText("Restar uno")).toBeDisabled();
  });
});
