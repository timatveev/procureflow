import { Hono } from "hono";

export const app = new Hono();

app.get("/healthz", (c) => c.json({ status: "ok", service: "procureflow-api" }));

const port = Number(process.env.API_PORT ?? 3000);

export default { port, fetch: app.fetch };
