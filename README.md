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

## Status

🚧 Initialization. The roadmap and tasks live on the GitHub project board.

## License

[MIT](./LICENSE)
