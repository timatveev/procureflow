import { describe, expect, it } from "bun:test";

import { parseEnv } from "./config";

describe("parseEnv — PORT", () => {
  it("defaults to 3000 when PORT is absent", () => {
    // Arrange
    const env = {};

    // Act
    const config = parseEnv(env);

    // Assert
    expect(config.PORT).toBe(3000);
  });

  it("parses a valid PORT", () => {
    // Arrange
    const env = { PORT: "8080" };

    // Act
    const config = parseEnv(env);

    // Assert
    expect(config.PORT).toBe(8080);
  });

  it("rejects an empty PORT instead of silently using 0", () => {
    // Arrange
    const env = { PORT: "" };

    // Act / Assert
    expect(() => parseEnv(env)).toThrow();
  });

  it("rejects a non-numeric PORT instead of silently using NaN", () => {
    // Arrange
    const env = { PORT: "abc" };

    // Act / Assert
    expect(() => parseEnv(env)).toThrow();
  });

  it("rejects an out-of-range PORT", () => {
    // Arrange
    const env = { PORT: "70000" };

    // Act / Assert
    expect(() => parseEnv(env)).toThrow();
  });
});
