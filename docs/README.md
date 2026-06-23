# ProcureFlow documentation

This is the home of all ProcureFlow documentation. We practise **Docs-as-Code**: docs live in the
repo, are versioned with the code, and are reviewed in the same Pull Requests. There is no external
Wiki — the README is the front door, this folder is the library.

The durable docs follow the [Diátaxis](https://diataxis.fr/) framework (split by reader need),
complemented by **ADRs** for decisions and **task specs** for per-issue analysis.

## Taxonomy — where things live

| Folder | Diátaxis kind | Use it for | Reader is asking… |
| --- | --- | --- | --- |
| [`adr/`](./adr/) | (decisions) | Architecture Decision Records — one file per significant decision. | "Why was it done this way?" |
| [`guides/`](./guides/) | how-to | Task-oriented, step-by-step recipes for a goal. | "How do I do X?" |
| [`reference/`](./reference/) | reference | Information-oriented, look-up material (APIs, config, schemas). | "What exactly is X?" |
| [`explanation/`](./explanation/) | explanation | Understanding-oriented concepts & architecture. | "How does this fit together / why?" |
| [`runbooks/`](./runbooks/) | how-to (ops) | Operational & incident procedures. | "It's on fire — what do I do?" |
| [`specs/`](./specs/) | (process) | Per-task system-analysis specs, one dir per issue key. | "What was the plan for PRF-N?" |

> Diátaxis also defines **tutorials** (learning-oriented). We omit that quadrant for now — the
> README's "Local development environment" covers onboarding; add `docs/tutorials/` if the need
> appears.

## Task specs (`docs/specs/PRF-<n>/`)

Every issue gets a system-analysis spec at `docs/specs/PRF-<n>/spec.md`, where **`PRF-<n>` is the
issue key** (the N-th issue created — an issue-only counter, not the GitHub number; see CLAUDE.md §9).
The spec is written in the *To Do* stage before any code (CLAUDE.md §5.3) and captures DB migrations,
API contracts, module boundaries, the test plan, risks and the Definition of Done.

Existing specs:

- [`specs/PRF-1/spec.md`](./specs/PRF-1/spec.md) — Dockerized dev environment (Postgres 16 + Redis + Mailpit + API).
- [`specs/PRF-13/spec.md`](./specs/PRF-13/spec.md) — Docs-as-Code foundation (this initiative).

## Conventions

- **English only** — every artifact in this repo is in English (language policy).
- **Relative links** — link between docs with relative paths so they resolve on GitHub and in checkouts.
- **When to write an ADR** — any architecture / stack / cross-cutting decision. See
  [`explanation/documentation.md`](./explanation/documentation.md) ("How we document") and the
  how-to [`guides/writing-an-adr.md`](./guides/writing-an-adr.md).
