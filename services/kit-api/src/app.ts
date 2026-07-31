import Fastify from "fastify";
import {
  createKitItemSchema,
  updateKitItemSchema,
} from "./schemas.js";
import { MemoryKitStore } from "./store.js";

export function buildKitApp(store = new MemoryKitStore()) {
  const app = Fastify({ logger: false });

  app.get("/health", async () => ({
    ok: true,
    service: "adolfo-kit-api",
  }));

  app.get("/api/kit/items", async () => ({ items: store.list() }));

  app.post("/api/kit/items", async (req, reply) => {
    const parsed = createKitItemSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply
        .status(400)
        .send({ error: parsed.error.issues[0]?.message ?? "inválido" });
    }
    const item = store.create(parsed.data.title);
    return reply.status(201).send({ item });
  });

  app.patch<{ Params: { id: string } }>(
    "/api/kit/items/:id",
    async (req, reply) => {
      const parsed = updateKitItemSchema.safeParse(req.body);
      if (!parsed.success) {
        return reply
          .status(400)
          .send({ error: parsed.error.issues[0]?.message ?? "inválido" });
      }
      const item = store.update(req.params.id, parsed.data);
      if (!item) {
        return reply.status(404).send({ error: "no encontrado" });
      }
      return { item };
    },
  );

  app.delete<{ Params: { id: string } }>(
    "/api/kit/items/:id",
    async (req, reply) => {
      if (!store.delete(req.params.id)) {
        return reply.status(404).send({ error: "no encontrado" });
      }
      return { ok: true };
    },
  );

  return app;
}
