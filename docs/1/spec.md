# Spec — Issue #1: Dockerized dev environment (Postgres 16 + Redis + Mailpit)

- **Issue:** #1 · **Milestone:** M1 Foundations & Infrastructure · **Epic:** Infrastructure · **Type:** Task
- **Labels:** `backend`, `devops`, `priority: high`
- **Status:** To Do → (Gate B) → In Progress
- **Gate A:** skipped (pure technical/infra task, per CLAUDE.md §5.2).

---

## 1. Context

ProcureFlow needs a reproducible local development environment so every layer — database,
cache/queue, mail capture, and the API runtime — runs identically across machines. This is
the first task; it lays the foundation every later task builds on (Drizzle migrations, the
domain model, the workflow engine, async notifications).

The repository is already bootstrapped (`apps/api`, `apps/web`, `packages/shared` as empty
scaffolds; `.env.dist`, `README.md`, `package.json`, CI placeholder). **No `docker-compose.yml`
exists yet** — that is the core deliverable here.

## 2. Decisions (resolved technical forks)

These were confirmed with the Product Owner before writing this spec:

| # | Fork | Decision |
| --- | --- | --- |
| 1 | Scope | Backing services **+ a minimal API service** (not infra-only). |
| 2 | Bun runtime | **Docker-only** (`oven/bun`); no local Bun install. |
| 3 | Image pinning | **Pin by digest (`sha256`)**; human-readable tag kept in a comment. |
| 4 | Compose layout | **Single `docker-compose.yml` at repo root** (CLAUDE.md §10). |
| 5 | API service depth | **Minimal health stub** (`GET /healthz`); full API bootstrap stays in #2. |
| 6 | API build | **Dedicated `apps/api/Dockerfile`** with a `dev` target on `oven/bun`. |

### 2.1 Open decision for Gate B (recommendation included)

- **Postgres password in the template.** The current `.env.dist` ships an empty
  `POSTGRES_PASSWORD`; the official `postgres` image refuses to initialize without a password
  (or `POSTGRES_HOST_AUTH_METHOD=trust`), which conflicts with the AC "`docker compose up -d`
  brings the stack up cleanly".
  **Recommendation:** put a clearly-marked **dev-only, non-secret** default in `.env.dist`
  (e.g. `POSTGRES_PASSWORD=procureflow_dev`) and a matching `DATABASE_URL`. It keeps the setup
  prod-like, makes first run work out of the box, and remains within CLAUDE.md §8 (no *real*
  secret is committed; `.env` stays gitignored). Alternative if you prefer the template to hold
  no values at all: use `POSTGRES_HOST_AUTH_METHOD=trust` for local dev. **Awaiting your call.**

## 3. Scope

### In scope
- `docker-compose.yml` at repo root with **4 services**: `db` (Postgres 16), `redis` (Redis 7),
  `mailpit`, `api` (minimal Hono health stub on Bun).
- All images **pinned by `sha256` digest**; a user-defined bridge network; **named volume**
  for Postgres data (+ Redis AOF volume).
- **Healthchecks** for `db` and `redis` (and `api`); `depends_on … condition: service_healthy`
  wiring so `api` starts only when its dependencies are ready.
- Minimal API: `apps/api/{package.json, tsconfig.json, Dockerfile, src/index.ts}` exposing
  `GET /healthz` → `200 { "status": "ok", "service": "procureflow-api" }`, plus a `bun test`
  for that route (TDD, AAA).
- `.env.dist` updated for the in-network model (service-name hosts, `MAILPIT_UI_PORT`).
- Root `package.json` infra scripts (`infra:up/down/reset/logs/ps`).
- `README.md` section: "Local development environment" (start / stop / reset / URLs).

### Out of scope (deferred)
- Full API bootstrap — module wiring, env-config loader, DB/Redis client pools, Zod request
  validation, graceful shutdown, logging → **issue #2**.
- Drizzle schema, migrations, `db:generate` / `db:migrate` scripts → later (M2).
- `web` service in compose; production/CI image targets; running compose in CI → later.
- Secrets management beyond a local dev default → later.
- Reconciling the dependency-install strategy (pnpm workspace vs `bun install`) → #2.

## 4. Module boundaries & invariants

- No domain code is introduced. The `api` service is a transport-only health stub with **no
  business logic**, so DDD module isolation (CLAUDE.md §4.1) and the budget invariant
  (§4.3) are **not exercised** here — they begin with the domain tasks.
- Boundary established now: the API is **containerized** and reaches dependencies by **compose
  service name** (`db`, `redis`, `mailpit`), never `localhost`. Host tools (DB GUI, ad-hoc
  `psql`) use the **published ports on `localhost`**.

## 5. Services — planned `docker-compose.yml`

> Digests below were resolved from the registry on 2026-06-23 (multi-arch index digests).
> Exact values will be re-verified at implementation time.

```yaml
# docker-compose.yml — ProcureFlow local development stack.
# Images are pinned by digest (sha256); human-readable tags kept in comments.
name: procureflow

services:
  db: # postgres:16-alpine
    image: postgres:16-alpine@sha256:e013e867e712fec275706a6c51c966f0bb0c93cfa8f51000f85a15f9865a28cb
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    ports:
      - "${POSTGRES_PORT}:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s
    networks: [procureflow]

  redis: # redis:7-alpine
    image: redis:7-alpine@sha256:6ab0b6e7381779332f97b8ca76193e45b0756f38d4c0dcda72dbb3c32061ab99
    restart: unless-stopped
    command: ["redis-server", "--appendonly", "yes"]
    ports:
      - "${REDIS_PORT}:6379"
    volumes:
      - redisdata:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5
    networks: [procureflow]

  mailpit: # axllent/mailpit:latest
    image: axllent/mailpit:latest@sha256:37a38e48e9338cd7e89dfeb487f37b02ebfcd9cb23111bed2d345e79d37d6dd6
    restart: unless-stopped
    environment:
      MP_SMTP_AUTH_ACCEPT_ANY: "true"
      MP_SMTP_AUTH_ALLOW_INSECURE: "true"
    ports:
      - "${SMTP_PORT}:1025"        # SMTP capture
      - "${MAILPIT_UI_PORT}:8025"  # Web UI
    networks: [procureflow]
    # Healthcheck deferred: the pinned image may lack a shell/wget. Mailpit is not a
    # service_healthy dependency, so its absence does not block the stack. If the image
    # ships wget, add: ["CMD", "wget", "--spider", "-q", "http://localhost:8025/readyz"].

  api: # oven/bun (built from apps/api/Dockerfile, target: dev)
    build:
      context: ./apps/api
      dockerfile: Dockerfile
      target: dev
    restart: unless-stopped
    env_file: [.env]
    ports:
      - "${API_PORT}:3000"
    volumes:
      - ./apps/api:/app          # hot reload
      - /app/node_modules        # keep container-installed deps (anonymous volume)
    depends_on:
      db: { condition: service_healthy }
      redis: { condition: service_healthy }
      mailpit: { condition: service_started }
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/healthz"]
      interval: 10s
      timeout: 3s
      retries: 5
      start_period: 15s
    networks: [procureflow]

volumes:
  pgdata:
  redisdata:

networks:
  procureflow:
    driver: bridge
```

## 6. API stub — planned files

### `apps/api/Dockerfile`
```dockerfile
# syntax=docker/dockerfile:1
# ProcureFlow API — development image. Base pinned by digest (oven/bun:1-alpine).
FROM oven/bun:1-alpine@sha256:5acc90a93e91ff07bf72aa90a7c9f0fa189765aec90b47bdbf2152d2196383c0 AS base
WORKDIR /app

FROM base AS deps
COPY package.json bun.lock* ./
RUN bun install

FROM base AS dev
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["bun", "run", "--watch", "src/index.ts"]
```

### `apps/api/src/index.ts`
```ts
import { Hono } from "hono";

export const app = new Hono();

app.get("/healthz", (c) => c.json({ status: "ok", service: "procureflow-api" }));

const port = Number(process.env.API_PORT ?? 3000);

export default { port, fetch: app.fetch };
```

### `apps/api/src/index.test.ts` (written first — TDD)
```ts
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
    expect(body).toEqual({ status: "ok", service: "procureflow-api" });
  });
});
```

`apps/api/package.json` (deps `hono`; dev `typescript`, `@types/bun`) and a `tsconfig.json`
(`strict: true`) will be added; exact versions pinned at implementation.

### API contract (the only contract in this task)

| Method | Path | Response | Body |
| --- | --- | --- | --- |
| `GET` | `/healthz` | `200 application/json` | `{ "status": "ok", "service": "procureflow-api" }` |

No DB migrations are part of this task (no schema yet).

## 7. Environment wiring — planned `.env.dist`

The containerized API is the primary consumer, so hosts default to **compose service names**;
published ports still expose everything on `localhost` for host tools.

- `POSTGRES_HOST=db` · `DATABASE_URL=postgres://procureflow:<dev-pw>@db:5432/procureflow`
- `REDIS_HOST=redis` · `REDIS_URL=redis://redis:6379`
- `SMTP_HOST=mailpit` (port `1025`)
- **New:** `MAILPIT_UI_PORT=8025`
- `POSTGRES_PASSWORD` per the §2.1 decision.

Compose auto-loads `.env` from the repo root. Setup: `cp .env.dist .env` → adjust →
`docker compose up -d`.

## 8. Run commands — planned root `package.json` scripts

```jsonc
"infra:up":    "docker compose up -d",
"infra:down":  "docker compose down",
"infra:reset": "docker compose down -v",   // drops named volumes (DB data)
"infra:logs":  "docker compose logs -f",
"infra:ps":    "docker compose ps",
"dev":         "docker compose up"
```

(The broader `pnpm dev` / `pnpm test` / `pnpm typecheck` from CLAUDE.md §7 that span the whole
workspace are completed in later tasks once `web` and the full API land.)

## 9. Test / verification plan

Infra is verified by acceptance checks; the only production code (the health route) gets a
unit test written **before** the implementation (CLAUDE.md §6).

1. **Static:** `docker compose config` parses; variable interpolation resolves with `.env`.
2. **Bring-up:** `docker compose up -d` → `docker compose ps` shows `db`, `redis`, `api`
   **healthy** and `mailpit` running.
3. **Postgres:** `pg_isready` green; a `psql` connection succeeds (via published port).
4. **Redis:** `redis-cli ping` → `PONG`.
5. **Mailpit:** Web UI reachable at `http://localhost:8025`; SMTP accepts a test message on `1025`.
6. **API:** `curl http://localhost:3000/healthz` → `200 {"status":"ok",…}`; `bun test` green.
7. **Persistence:** `docker compose down && up -d` keeps Postgres data (named volume);
   `infra:reset` (`down -v`) clears it. First-run `up` is clean from a fresh checkout.

## 10. Risks & mitigations

| Risk | Mitigation |
| --- | --- |
| Empty `POSTGRES_PASSWORD` blocks DB init | §2.1 decision (dev default or `trust`). |
| `node_modules` bind-mount clobbered by host | Anonymous volume `/app/node_modules`. |
| Mailpit image lacks shell/wget for healthcheck | Healthcheck deferred; Mailpit not a `service_healthy` dep. |
| Host port conflicts (5432/6379/8025/3000) | All ports are `.env`-configurable. |
| Digest pins drift / wrong platform | Index (multi-arch) digests used; re-verified at implementation; documented refresh procedure. |
| pnpm-workspace vs `bun install` friction | API deps installed by Bun in-container for now; reconciled in #2. |

## 11. Definition of Done

- `docker-compose.yml` at root: `db`, `redis`, `mailpit`, `api`; all images digest-pinned;
  healthchecks for `db`/`redis`/`api`; named volume for Postgres.
- `cp .env.dist .env && docker compose up -d` brings the stack up **cleanly** with green
  healthchecks from a fresh checkout.
- `GET /healthz` returns `200`; the `bun test` for it passes.
- `.env.dist` updated & documented; `README.md` has a "Local development environment" section.
- `biome check` and `tsc --noEmit` pass on the new API code (English-only, no leftover Russian).
- `CHANGELOG.md` updated; PR opened against `main` with `Closes #1` (status → In Review).
- Branch cleanup only after the Product Owner merges (Gate C).
