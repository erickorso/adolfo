import { describe, expect, it } from "vitest";
import {
  mapUalaOrderStatus,
  mapUalaPaymentStatus,
} from "./order.service";
import { OrderStatus, PaymentStatus } from "@/generated/prisma/client";

describe("order.service — mapeo Ualá v2", () => {
  it("mapUalaPaymentStatus", () => {
    expect(mapUalaPaymentStatus("APPROVED")).toBe(PaymentStatus.APPROVED);
    expect(mapUalaPaymentStatus("PROCESSED")).toBe(PaymentStatus.APPROVED);
    expect(mapUalaPaymentStatus("REJECTED")).toBe(PaymentStatus.REJECTED);
  });

  it("mapUalaOrderStatus", () => {
    expect(mapUalaOrderStatus("APPROVED")).toBe(OrderStatus.PAID);
    expect(mapUalaOrderStatus("PROCESSED")).toBe(OrderStatus.PAID);
    expect(mapUalaOrderStatus("REJECTED")).toBe(OrderStatus.CANCELLED);
  });
});
