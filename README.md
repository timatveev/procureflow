# ProcureFlow

**B2B corporate procurement platform** (Enterprise Procurement Portal).

Company employees create purchase requests; managers route and approve them following a
strict role model (Initiator → Line Manager → Finance Controller). Each company has an
allocated budget that cannot be changed outside the transactional logic. Every request
status change emits an asynchronous email notification.

> A training project demonstrating the **"Specs Before Code" / Agentic Coding** methodology.
> Development is public, incremental, and gated — see [CLAUDE.md](./CLAUDE.md).

| Service passport | |
| --- | --- |
| **Owner** | Timofey — Product Owner (business decisions, releases, merges) |
| **Status** | 🚧 Initialization |
| **Methodology** | Specs Before Code (gated lifecycle) — [CLAUDE.md](./CLAUDE.md) |
| **Docs** | [docs/](./docs/) · [ADRs](./docs/adr/) · [task specs](./docs/specs/) |
| **Delivery** | [project board](https://github.com/users/timatveev/projects/3) · [CHANGELOG](./CHANGELOG.md) |

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
docs/             # Docs-as-Code: ADRs, guides, reference, explanation, runbooks, task specs
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

> **Changing API dependencies?** The `api` container keeps `node_modules` in an anonymous
> volume that Compose does not refresh on a plain rebuild. After editing deps, run
> `docker compose up -d --build --renew-anon-volumes` (or `docker compose down && up -d --build`).

Images are pinned by digest for reproducibility; the API runs with hot reload (`bun --watch`).

## Documentation

We practise **Docs-as-Code** — documentation lives in the repo, is versioned with the code, and is
reviewed in the same Pull Requests (no external Wiki). Durable docs follow the
[Diátaxis](https://diataxis.fr/) split, complemented by ADRs and per-task specs. Start at the
[**docs index**](./docs/README.md).

| Where | What |
| --- | --- |
| [docs/adr/](./docs/adr/) | Architecture Decision Records — *why* a choice was made. |
| [docs/guides/](./docs/guides/) | How-to recipes (task-oriented). |
| [docs/reference/](./docs/reference/) | Look-up material — API, config, schema. |
| [docs/explanation/](./docs/explanation/) | Concepts & architecture — incl. [how we document](./docs/explanation/documentation.md). |
| [docs/runbooks/](./docs/runbooks/) | Operational & incident procedures. |
| [docs/specs/](./docs/specs/) | Per-task system-analysis specs (`docs/specs/PRF-<n>/spec.md`). |

Contributing? The repo ships GitHub **Issue Forms** and a **PR template** (under
[.github/](./.github/)) that prompt you to keep docs and ADRs current.

## Status

🚧 Initialization. The roadmap and tasks live on the GitHub project board.

## License

[MIT](./LICENSE)
