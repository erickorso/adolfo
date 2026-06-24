import { describe, expect, it } from "vitest";
import { validateUalaCallbackUrls } from "./uala-callback-urls";

describe("validateUalaCallbackUrls", () => {
  const valid = {
    callbackSuccess: "https://app.example.com/es/checkout/success",
    callbackFail: "https://app.example.com/es/checkout/fail",
    notificationUrl: "https://app.example.com/api/webhooks/uala",
  };

  it("acepta URLs HTTPS públicas", () => {
    expect(validateUalaCallbackUrls(valid)).toBeNull();
  });

  it("rechaza localhost", () => {
    expect(
      validateUalaCallbackUrls({
        ...valid,
        callbackSuccess: "http://localhost:3000/es/checkout/success",
      }),
    ).toMatch(/localhost/i);
  });

  it("rechaza HTTP sin TLS", () => {
    expect(
      validateUalaCallbackUrls({
        ...valid,
        notificationUrl: "http://app.example.com/api/webhooks/uala",
      }),
    ).toMatch(/HTTPS/i);
  });
});
