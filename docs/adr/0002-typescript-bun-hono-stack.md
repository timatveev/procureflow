# ADR-0002: TypeScript · Bun · Hono modular-monolith stack

- Status: Accepted
- Date: 2026-06-23

> Backfilled. The decision was taken at project inception; this ADR records it retroactively.

## Context

The original research brief for an enterprise procurement portal assumed a PHP/Symfony stack
(including PHP 8.4 "asymmetric visibility" for invariant protection). The Product Owner's learning
goal for ProcureFlow is the "Specs Before Code" / Agentic Coding methodology on a **modern TypeScript
stack**, not PHP. We needed one coherent stack spanning API, web, validation and tooling, suited to a
DDD modular monolith and to a fast local/test loop.

## Decision

We will build the backend in **TypeScript** on **Hono + Bun** as a **modular monolith** (DDD,
`apps/api/src/modules/<module>/`), with **Drizzle ORM + PostgreSQL 16**, **Redis + BullMQ** for async
work, **Zod** for shared contracts (`packages/shared`), and a **React + Vite** SPA (TanStack Query,
Tailwind 4). Quality gates are **Biome** + `tsc --noEmit`; tests run on `bun test` / Vitest. PHP-specific
techniques are translated to their TS equivalents — notably, the budget invariant uses **private class
fields (`#field`)** and domain methods instead of PHP 8.4 asymmetric visibility (see CLAUDE.md §4.3).

## Consequences

- One language across API, web and shared contracts; Zod schemas shared end-to-end.
- Bun gives a fast install/test/run loop; Hono is a thin, standards-based HTTP layer.
- The stack is fixed by the Product Owner and overrides the brief's PHP/Symfony stack.
- Invariant protection becomes a code-discipline concern (private fields, no public setters) rather
  than a language feature — enforced by review and tests.
