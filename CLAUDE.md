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
| **Product Owner** | Timofey (human) | Owns business decisions and releases; approves at GATEs; performs the **merge** of PRs into `main`. The only one who writes to `main`. Owns deployment. |
| **Requester / Executor** | Claude Code | Business analysis, specifications, code via TDD, opening PRs, maintaining docs. Does **NOT** merge, does **NOT** push to `main`, does **NOT** deploy, does **NOT** make business trade-offs without approval. |

In this project the "business-decision owner" and the "lead/contact" collapse into the same
person (the Product Owner), but **the gates still apply** — they become "ask the Product Owner".

**Golden rule:** no code is written before the specification is approved and an explicit
**"Proceed"** is given. Until then, the agent only analyzes, plans, and writes documentation.

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

Statuses: **Backlog → To Do → In Progress → In Review → Done**.
Branch model: a single `main`; `feature/PRF-N-<slug>` → Pull Request → `main` (PO merges = release).

1. **Backlog — business analysis.** I create the issue and write the BA description
   autonomously: context, problem, stakeholders, scope (in/out), User Story, Acceptance
   Criteria (Gherkin), dependencies, assumptions, Definition of Done, priority/risks. Depth
   scales with complexity. **Business forks** (meaning / scope / behavior) → I ask with
   options, never guess.
2. 🚦 **Gate A (Backlog → To Do) — business approval.** Required for business tasks
   (approve the requirements). Pure technical / infra tasks skip Gate A: I move them to
   To Do myself after system analysis.
3. **To Do — system analysis & plan.** I produce `docs/PRF-N/spec.md` (DB migrations,
   API contracts in Zod/OpenAPI, module boundaries, invariants, test plan, DoD, risks),
   mirror a summary as an issue comment, and store key decisions in memory. **Technical
   forks** → I ask here. I may reject a change or propose an alternative if it breaks the
   architecture/style/logic. I set the assignee.
4. 🚦 **Gate B (To Do → In Progress) — explicit "Proceed".** Only on your explicit command
   ("Proceed" / "start") do I create the branch and write code. No code before this.
5. **In Progress.** Branch `feature/PRF-N-<slug>`; development via TDD (Red → Green →
   Refactor), AAA. Code stays in the working copy; **no speculative commits**.
6. **In Review (autonomous).** On completion I immediately commit + push + open a Pull
   Request into `main`, then stop. Opening a PR deploys nothing, so there is **no gate**
   here. I record the outcome ("Solution") in the issue and in `CHANGELOG.md`.
7. 🚦 **Gate C (merge) — Product Owner only.** You merge the PR (each time on an explicit
   "merge"). I never push to `main` directly and never cross release/deploy gates.
8. **Done.** I never set Done myself; it is tied to the release and is your gate. Branch
   cleanup happens **only after merge**.

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
  All work happens in `feature/PRF-N-<slug>` (or `fix/`, `chore/`) branches; every change
  reaches `main` through a Pull Request that the Product Owner merges.
- **Issue key `PRF-N`.** Every issue has a key `PRF-N`. **`N` is an issue-only counter — the
  N-th issue created — NOT the GitHub number** (GitHub shares one number sequence across issues
  and PRs, so they diverge once PRs exist: e.g. the 13th issue is GitHub #16 → `PRF-13`). A new
  key = (count of existing issues) + 1.
- **Titles.** Issues **and** their PRs are titled `[PRF-N] <concise subject>` — no `type:`
  prefix. The semantic type (Feature / Bug / Task / …) lives in **labels and the board `Type`
  field**, not in the title. A PR reuses its issue's key.
- **Re-keying caution.** Never rename a branch that already has an open PR via GitHub's
  branch-rename — it deletes the old ref and **closes** the PR (which cannot be reopened). Push
  a new branch and open a fresh PR instead.
- PR description: what was done and why, how it was tested, link to the Issue (`Closes #N`).
  The agent opens the PR and stops (status In Review). Opening a PR is autonomous.
- **Branch cleanup only after merge** — while a PR is open, its branch is not deleted.
- Commits follow Conventional Commits (`feat:`, `fix:`, `test:`, `chore:`, `docs:`…) — this is
  where the change *type* is recorded in git history (titles carry the `[PRF-N]` key instead).
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
├─ docs/                # task specs (docs/PRF-N/spec.md), ADRs, BPMN descriptions
├─ docker-compose.yml   # created in the infrastructure task
├─ .env.dist            # environment variable template
├─ CHANGELOG.md         # notable changes (Keep a Changelog)
└─ CLAUDE.md            # this file
```

---

## 11. Autonomy & gates (summary)

**I act autonomously on:** code analysis; wording; BA and technical specs; editing docs,
issue bodies/comments, the project board, `CHANGELOG.md`, and my memory; code drafts in the
working copy and local checks (lint / types / targeted tests).

**Documentation is autonomous** — updating an issue body, BA, comments, CHANGELOG, or memory
is not a permission request. Asking to resolve a BA fork is not a request to edit docs: once
the fork is resolved, I update the text myself.

**Commits:** no speculative commits. Code is committed only when completing an In-Progress
task into its PR, or when you explicitly ask.

**I stop and ask at the gates:**
- any **business fork** (meaning / scope / behavior) → options, no guessing;
- **technical forks** during system analysis;
- **Gate A** — moving a business task to To Do (approve requirements);
- **Gate B** — starting code / In Progress (explicit "Proceed");
- **Gate C** — any merge / deploy; `main` and releases are the Product Owner's gate.
