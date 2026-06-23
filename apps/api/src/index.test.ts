import { describe, expect, it } from "bun:test";

import { app } from "./index";

describe("GET /healthz", () => {
  it("returns 200 with an ok status payload", async () => {
    // Arrange
    const req = new Request("http://localhost/healthz");

    // Act
    const res = await app.request(req);
    const body = await res.json();

    // Assert
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/json");
    expect(body).toEqual({ status: "ok", service: "procureflow-api" });
  });
});
