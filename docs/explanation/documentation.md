# How we document

ProcureFlow practises **Docs-as-Code**: documentation lives in the repo, is versioned with the code,
and is reviewed in the same Pull Requests. There is no external Wiki. This note explains how the
pieces fit so each kind of writing has an obvious home.

## The four homes

We organise durable docs with the [Diátaxis](https://diataxis.fr/) framework, complemented by ADRs
and per-task specs:

| Need | Folder | What it is |
| --- | --- | --- |
| Steps to a goal | [`../guides/`](../guides/) | How-to recipes (task-oriented). |
| Look-up facts | [`../reference/`](../reference/) | API, config, schema (information-oriented). |
| Understanding | [`../explanation/`](../explanation/) | Concepts & architecture (you are here). |
| Operations | [`../runbooks/`](../runbooks/) | Running & recovering the system. |
| Decisions | [`../adr/`](../adr/) | Why a choice was made (immutable record). |
| Per-task analysis | [`../specs/`](../specs/) | System-analysis spec per issue. |

Diátaxis also defines **tutorials** (learning-oriented); we omit that quadrant until onboarding needs
more than the README's "Local development environment" section.

Choosing a home: *Is the reader trying to **do** something now?* → guide or runbook. *Looking
something **up**?* → reference. *Trying to **understand** why?* → explanation or an ADR.

## When an ADR is required

Write an [ADR](../adr/) for any decision that is **architectural, cross-cutting, or hard to reverse**,
or that a future reader would otherwise have to reverse-engineer from the code — for example a
stack/library choice, a module boundary, a persistence or security strategy, an infra convention. Use
the lightweight Nygard template; ADRs are immutable once Accepted (supersede, don't edit). How-to:
[`../guides/writing-an-adr.md`](../guides/writing-an-adr.md). One-off, local, easily-reversed choices
do **not** need an ADR.

## Task specs

Each issue gets a system-analysis spec at `docs/specs/PRF-<n>/spec.md`, where `PRF-<n>` is the issue
key (an issue-only counter — the N-th issue created, not the GitHub number; CLAUDE.md §9). The spec is
written in the *To Do* stage **before any code** (CLAUDE.md §5.3): DB migrations, API contracts,
module boundaries, the test plan, risks, and the Definition of Done. Specs are the working record of
the "Specs Before Code" lifecycle; ADRs distil the durable decisions out of them.

## Conventions

- **English only** — every repository artifact is in English (code, comments, docs, commits, PRs,
  issues). The mentoring conversation with the Product Owner happens in Russian, but nothing Russian
  lands in the repo.
- **Relative links** between docs, so they resolve on GitHub and in local checkouts.
- **The README is the front door** — it carries the service passport and links into `docs/`.
- **GitHub-native** — Issue Forms and the PR template (`.github/`) nudge contributors to keep docs and
  ADRs current; no third-party docs bot.
