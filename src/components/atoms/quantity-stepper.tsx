"use client";

import { useCallback } from "react";
import { Button } from "@/components/ui/button";

type QuantityStepperProps = {
  value: number;
  min?: number;
  max?: number;
  onChange: (next: number) => void;
};

/**
 * Átomo: control +/- de cantidad. Presentacional y puro: no conoce el carrito,
 * solo emite el nuevo valor por `onChange`. Lógica extraída a handlers.
 */
export function QuantityStepper({
  value,
  min = 1,
  max = 99,
  onChange,
}: QuantityStepperProps) {
  const handleDecrement = useCallback(() => {
    onChange(Math.max(min, value - 1));
  }, [onChange, value, min]);

  const handleIncrement = useCallback(() => {
    onChange(Math.min(max, value + 1));
  }, [onChange, value, max]);

  return (
    <div className="inline-flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleDecrement}
        disabled={value <= min}
        aria-label="Restar uno"
      >
        −
      </Button>
      <span className="w-6 text-center tabular-nums" aria-live="polite">
        {value}
      </span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleIncrement}
        disabled={value >= max}
        aria-label="Sumar uno"
      >
        +
      </Button>
    </div>
  );
}
