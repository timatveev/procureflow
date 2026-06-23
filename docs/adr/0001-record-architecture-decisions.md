# ADR-0001: Record architecture decisions

- Status: Accepted
- Date: 2026-06-23

## Context

ProcureFlow is developed publicly under a "Specs Before Code" lifecycle. Significant technical
choices (stack, runtime, persistence, security boundaries, infra conventions) accumulate over the
project. So far they have been recorded informally — in commit messages, the project constitution
(`CLAUDE.md`), and the agent's memory — which is hard for a reader to search and easy to let drift.
We want decisions to be discoverable, versioned with the code, and reviewed in the same Pull
Requests as the change that motivates them.

## Decision

We will keep **Architecture Decision Records** in `docs/adr/`, one Markdown file per decision, using
the lightweight **Nygard format** (Status · Context · Decision · Consequences). Files are numbered
sequentially (`NNNN-kebab-title.md`) and listed in `docs/adr/README.md`. An ADR is **immutable once
Accepted**; to revisit a decision we add a new ADR and mark the old one `Superseded by ADR-NNNN`.
An ADR is required for any architecture/stack/cross-cutting decision (see
[`../explanation/documentation.md`](../explanation/documentation.md)).

## Consequences

- Decisions become first-class, linkable artifacts; new contributors can read *why*, not just *what*.
- A small authoring cost per decision — mitigated by a one-copy template and a how-to guide.
- This ADR is itself the seed of the practice; ADRs 0002–0004 backfill decisions made before the
  log existed.
