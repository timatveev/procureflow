# CLAUDE.md — Project Constitution: **ProcureFlow**

> This file is the primary governing contract between the Product Owner (human) and the
> AI executor (Claude Code). It **takes precedence over any default agent behavior**.
> Only the Product Owner may change it.

---

## 1. About the project

**ProcureFlow** is a B2B corporate procurement platform (Enterprise Procurement Portal).
Company employees create purchase requests for equipment; responsible managers route and
approve them. The heart of the system is the request **state machine** and protection of
the company **budget invariant**.

- **Domains:** `Company` (budget), `User` (roles), `PurchaseRequest` (request + workflow),
  `Notification` (asynchronous email).
- **User roles:** Initiator → Line Manager → Finance Controller.
- **Learning goal:** the "Specs Before Code" / Agentic Coding methodology on a modern TS
  stack. Developed publicly on GitHub.

> Working language: **all repository artifacts are in English** (code, comments, docs,
> commits, PRs, issues). Mentoring conversation with the Product Owner happens in Russian.

---

## 2. Role model (chain of command)

| Role | Who | Rights & responsibilities |
| --- | --- | --- |
| **Product Owner** | Timofey (human) | Makes architectural decisions, approves specs at GATEs, performs the **merge** of PRs into `main`. The only one who writes to `main`. Owns deployment. |
| **Requester / Executor** | Claude Code | Business analysis, specifications, code via TDD, opening PRs. Does **NOT** merge, does **NOT** push to `main`, does **NOT** deploy, does **NOT** make business trade-offs without approval. |

**Golden rule:** no code is written before the specification is approved. Without the
explicit **"Proceed"** command, the agent only performs analysis and planning.

---

## 3. Tech stack

| Layer | Technology |
| --- | --- |
| Backend | **TypeScript** on **Hono + Bun**, modular monolith (DDD) |
| ORM / DB | **Drizzle ORM** + **PostgreSQL 16** |
| Cache / queues / sessions | **Redis** + **BullMQ** (asynchronous email notifications) |
| Frontend | **React + Vite** (SPA), TanStack Query, Tailwind 4 |
| Validation / contracts | **Zod** (API in/out, shared schemas in `packages/shared`) |
| State machine | explicit FSM (XState or custom) for `PurchaseRequest` |
| Infrastructure | **Docker + Compose** (local), CI — **GitHub Actions** |
| Tests | `bun test` (API) + **Vitest** + Testing Library (web) |
| Code quality | **Biome** (lint + format) + `tsc --noEmit` (strict typing) |

> The stack is fixed by the Product Owner and overrides the PHP/Symfony stack from the
> original research. PHP specifics (including "8.4 asymmetric visibility") are translated
> into their TS equivalent — see §4.3.

---

## 4. Architecture conventions

### 4.1 Modular monolith (DDD)
- Code is organized by module: `apps/api/src/modules/<module>/`.
- Each module is self-contained and split into layers:
  `routes/` (HTTP) · `application/` (use-cases) · `domain/` (entities, value objects) ·
  `infrastructure/` (repositories, the module's Drizzle schema).
- **Module isolation:** cross-module references use **identifiers (UUID) only**. Importing
  another module's domain entities directly is forbidden. Interaction happens via public
  ports/interfaces or domain events.

### 4.2 Thin handlers
- A Hono handler does only: validate input (Zod) → call a use-case → serialize the response.
- No business logic in the route.

### 4.3 Invariant protection (TS equivalent of PHP 8.4 "asymmetric visibility")
- Domain entities are plain TS classes with **private fields** (`#field`) and domain methods.
- **Company budget:** the `#budgetBalance` field is private; it changes **exclusively** via
  the business methods `reserveFunds()` / `commitFunds()` / `releaseFunds()` inside a DB
  transaction. No public setter for the balance exists.
- Forbidden: public setters on invariant fields; mutating domain state from infrastructure
  while bypassing entity methods.

### 4.4 Money & precision
- Money is stored as integers (minor units) **or** as `numeric` in the DB, mapped to a
  string/`bigint`. **`number`/`float` for monetary values is forbidden** (rounding errors).

### 4.5 Persistence
- The Drizzle schema is an infrastructure detail. **Repositories** map DB rows ↔ domain
  entities; the domain layer knows nothing about Drizzle.
- All balance and request-status mutations happen inside a transaction.

### 4.6 Code style
- `strict: true`. No `any` (use `unknown` + narrowing only).
- DI via the constructor (`readonly`). Immutability by default.

---

## 5. Task lifecycle (Specs Before Code)

1. **Backlog → Business analysis.** Context, User Story, Acceptance Criteria, textual BPMN.
2. **To Do → `docs/<issue>/spec.md`.** DB migrations, API contracts (OpenAPI/Zod), module
   boundaries, test plan.
3. **🚦 GATE.** The agent stops and requests spec approval. **No code without "Proceed".**
   Guessing business trade-offs is forbidden.
4. **In Progress.** Branch `feature/<issue-id>-<slug>`, development via TDD (Red → Green →
   Refactor), AAA standard.
5. **In Review.** Commit + Pull Request into `main`, then stop. **The Product Owner merges.**
6. **Deploy / merge into `main`** — Product Owner only. The agent does not cross these gates.

---

## 6. TDD & the AAA standard

- Tests are written **before** the implementation.
- Each test is visually split with `// Arrange`, `// Act`, `// Assert` comments.
- Each test creates its own data (factories/fixtures with unique ids). It is forbidden to
  depend on global DB state or to skip a test based on random DB contents.
- Tests touching the DB run inside a transaction with rollback (isolation).
- **Mandatory** coverage: state-machine transitions and budget invariants.
- When authorization/access logic changes — tests proving that one user/company cannot
  access another's data.

---

## 7. Commands cheat sheet

> Exact npm scripts will be filled in during the first infrastructure task. Command contract:

```bash
pnpm install                          # install dependencies (whole monorepo)
docker compose up -d                  # start Postgres + Redis (+ services)
pnpm dev                              # run api + web in development mode
pnpm --filter @procureflow/api dev    # API only (bun --watch)
pnpm --filter @procureflow/web dev    # web only (vite)
pnpm test                             # all tests (bun test + vitest)
pnpm typecheck                        # tsc --noEmit across all packages
pnpm lint                             # biome check
pnpm format                           # biome format --write
pnpm db:generate                      # drizzle-kit: generate a migration from the schema
pnpm db:migrate                       # apply migrations
```

---

## 8. Secrets & Freeze mode

- Real keys/passwords are **never** committed. The repo contains only `.env.dist`
  (a template without values). `.env` is in `.gitignore`.
- **Freeze mode.** Before a complex/dangerous refactor (auth, RLS, payments) the Product
  Owner may enable: *"Switch to READ-ONLY. Do not change files/DB, do not run commands
  without explicit confirmation. Before every step ask `Ready to apply? Y/N`."* The agent
  must honor it until cancelled.
- The agent never prints or logs secrets and never sends them to external services.

---

## 9. Git & Pull Requests

- `main` is protected: direct push is forbidden (the single genesis bootstrap aside).
  All work happens in `feature/*`, `fix/*`, `chore/*` branches.
- PR description: what was done and why, how it was tested, link to the Issue (`Closes #N`).
  The agent opens the PR and stops (status In Review).
- Commits follow Conventional Commits (`feat:`, `fix:`, `test:`, `chore:`, `docs:`…).
- Commits made by the agent include a `Co-Authored-By: Claude …` trailer.

---

## 10. Repository structure

```
procureflow/
├─ apps/
│  ├─ api/    # Hono + Bun, modular monolith (src/modules/*)
│  └─ web/    # React + Vite SPA
├─ packages/
│  └─ shared/ # shared types & contracts (Zod schemas)
├─ .github/workflows/   # CI (GitHub Actions)
├─ docs/                # task specs (spec.md), ADRs, BPMN descriptions
├─ docker-compose.yml   # created in the infrastructure task
├─ .env.dist            # environment variable template
└─ CLAUDE.md            # this file
```
