import { buildKitApp } from "./app.js";

/** Cloud (Railway/Fly/Render) usa PORT; local usa KIT_API_PORT o 4001. */
const port = Number(process.env.PORT ?? process.env.KIT_API_PORT ?? "4001");
const app = buildKitApp();

await app.listen({ port, host: "0.0.0.0" });
console.log(`Kit API (Fastify) http://0.0.0.0:${port}`);
console.log(`  GET  /health`);
console.log(`  GET/POST   /api/kit/items`);
console.log(`  PATCH/DELETE /api/kit/items/:id`);
