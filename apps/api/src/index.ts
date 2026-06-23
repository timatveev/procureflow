import { Hono } from "hono";

import { config } from "./config";

export const app = new Hono();

app.get("/healthz", (c) => c.json({ status: "ok", service: "procureflow-api" }));

export default { port: config.PORT, fetch: app.fetch };
