# ProcureFlow

**B2B corporate procurement platform** (Enterprise Procurement Portal).

Company employees create purchase requests; managers route and approve them following a
strict role model (Initiator → Line Manager → Finance Controller). Each company has an
allocated budget that cannot be changed outside the transactional logic. Every request
status change emits an asynchronous email notification.

> A training project demonstrating the **"Specs Before Code" / Agentic Coding** methodology.
> Development is public, incremental, and gated — see [CLAUDE.md](./CLAUDE.md).

## Stack

- **Backend:** TypeScript · Hono · Bun · modular monolith (DDD)
- **Database:** PostgreSQL 16 · Drizzle ORM · Redis (BullMQ)
- **Frontend:** React · Vite (SPA) · Tailwind 4 · TanStack Query
- **Infra:** Docker Compose · GitHub Actions

## Structure

```
apps/api          # Hono + Bun (modular monolith)
apps/web          # React + Vite SPA
packages/shared   # shared contracts (Zod)
docs/             # task specifications, ADRs, BPMN
```

## Local development environment

The whole stack runs in Docker — **Bun is never installed on the host**; it runs only inside
the `api` container. Prerequisite: Docker + Compose.

```bash
cp .env.dist .env          # adjust if needed (a dev-only Postgres password is preset)
docker compose up -d       # start Postgres 16, Redis, Mailpit, and the API
docker compose ps          # db/redis/api should report "healthy"
```

| Service | Host URL | Notes |
| --- | --- | --- |
| API | http://localhost:3000/healthz | `{ "status": "ok", … }` |
| Postgres | `localhost:5432` | db `procureflow` / user `procureflow` |
| Redis | `localhost:6379` | AOF persistence |
| Mailpit (web UI) | http://localhost:8025 | captured emails |
| Mailpit (SMTP) | `localhost:1025` | dev mail sink |

```bash
docker compose logs -f     # follow logs
docker compose down        # stop (keeps the database volume)
docker compose down -v     # stop and wipe volumes (fresh database)
```

Images are pinned by digest for reproducibility; the API runs with hot reload (`bun --watch`).

## Status

🚧 Initialization. The roadmap and tasks live on the GitHub project board.

## License

[MIT](./LICENSE)
