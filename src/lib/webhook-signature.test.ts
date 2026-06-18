import { describe, expect, it } from "vitest";
import { signHmac, verifyHmacSignature } from "./webhook-signature";

const SECRET = "test-webhook-secret";
const BODY = JSON.stringify({ paymentId: "abc", status: "APPROVED" });

describe("webhook-signature", () => {
  it("acepta una firma válida", () => {
    const signature = signHmac(BODY, SECRET);
    expect(verifyHmacSignature(BODY, signature, SECRET)).toBe(true);
  });

  it("rechaza una firma con secreto incorrecto", () => {
    const signature = signHmac(BODY, "otro-secreto");
    expect(verifyHmacSignature(BODY, signature, SECRET)).toBe(false);
  });

  it("rechaza si el body fue alterado", () => {
    const signature = signHmac(BODY, SECRET);
    const tampered = BODY.replace("APPROVED", "REJECTED");
    expect(verifyHmacSignature(tampered, signature, SECRET)).toBe(false);
  });

  it("rechaza una firma de longitud distinta sin tirar excepción", () => {
    expect(verifyHmacSignature(BODY, "corta", SECRET)).toBe(false);
  });
});
