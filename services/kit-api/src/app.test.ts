import { describe, expect, it } from "vitest";
import { buildKitApp } from "./app.js";

describe("kit-api", () => {
  it("health ok", async () => {
    const app = buildKitApp();
    const res = await app.inject({ method: "GET", url: "/health" });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject({ ok: true, service: "adolfo-kit-api" });
  });

  it("CRUD items", async () => {
    const app = buildKitApp();
    const created = await app.inject({
      method: "POST",
      url: "/api/kit/items",
      payload: { title: "Aprender Fastify" },
    });
    expect(created.statusCode).toBe(201);
    const id = created.json().item.id as string;

    const listed = await app.inject({ method: "GET", url: "/api/kit/items" });
    expect(listed.json().items).toHaveLength(1);

    const patched = await app.inject({
      method: "PATCH",
      url: `/api/kit/items/${id}`,
      payload: { done: true },
    });
    expect(patched.json().item.done).toBe(true);

    const deleted = await app.inject({
      method: "DELETE",
      url: `/api/kit/items/${id}`,
    });
    expect(deleted.statusCode).toBe(200);
  });
});
