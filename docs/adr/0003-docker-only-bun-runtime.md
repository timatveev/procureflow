# ADR-0003: Docker-only Bun runtime (no host install)

- Status: Accepted
- Date: 2026-06-23

> Backfilled from PRF-1 (the dockerized dev environment). See
> [`../specs/PRF-1/spec.md`](../specs/PRF-1/spec.md).

## Context

ProcureFlow needs a reproducible local development environment where the database, cache/queue, mail
capture and the API runtime behave identically across machines. Bun is the API runtime. Requiring
each contributor to install a specific Bun version on the host invites "works on my machine" drift and
couples the host to the project's runtime version.

## Decision

We will run **Bun only inside the `api` container** (`oven/bun`, built from `apps/api/Dockerfile`,
`dev` target) — **never installed on the host**. The whole stack comes up with `docker compose up -d`.
The API reaches its dependencies by **Compose service name** (`db`, `redis`, `mailpit`), never
`localhost`; host tools use the published ports on `localhost`. `tsc --noEmit` and `bun test` run
inside the container via `pnpm api:typecheck` / `pnpm api:test`.

## Consequences

- Reproducible runtime; the only host prerequisite is Docker + Compose.
- Container-installed `node_modules` lives in an anonymous volume — after changing API deps, rebuild
  with `--renew-anon-volumes` (documented in the README).
- A slightly slower edit loop than native Bun, accepted for reproducibility; hot reload (`bun --watch`)
  keeps it fast enough.
