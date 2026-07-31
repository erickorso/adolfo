import { buildKitApp } from "./app.js";

const port = Number(process.env.KIT_API_PORT ?? "4001");
const app = buildKitApp();

await app.listen({ port, host: "0.0.0.0" });
console.log(`Kit API (Fastify) http://localhost:${port}`);
console.log(`  GET/POST   /api/kit/items`);
console.log(`  PATCH/DELETE /api/kit/items/:id`);
