import { z } from "zod";

/**
 * Application configuration, parsed and validated from the environment.
 *
 * `PORT` is the port the API listens on *inside* its container; it stays fixed (default
 * 3000) and is decoupled from the host-side port mapping in docker-compose.yml. Invalid
 * values (empty, non-numeric, out of range) fail fast instead of silently degrading.
 */
const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
});

export type AppConfig = z.infer<typeof envSchema>;

export function parseEnv(
  env: Record<string, string | undefined> = process.env,
): AppConfig {
  return envSchema.parse(env);
}

export const config: AppConfig = parseEnv();
