import { createApp } from "./app.js";
import { env } from "./config/env.js";

const app = createApp();

app.listen(env.port, () => {
  console.log(`Metrics API (Express) http://localhost:${env.port}`);
  console.log(`  GET  /api/metrics/get-token?clientId=metrics-demo&clientSecret=metrics-demo-dev`);
  console.log(`  GET  /api/metrics/top-content (Bearer)`);
});
