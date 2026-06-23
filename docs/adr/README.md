# Architecture Decision Records

An **ADR** captures a single significant architectural or technical decision: its context, the
choice made, and the consequences. We use the lightweight [Nygard format](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
— see [`template.md`](./template.md).

**Write an ADR** when you make a decision that is cross-cutting, hard to reverse, or that a future
reader would otherwise have to reverse-engineer from the code (stack/library choice, a module
boundary, a persistence or security strategy, an infra convention). How-to:
[`../guides/writing-an-adr.md`](../guides/writing-an-adr.md).

ADRs are **immutable once Accepted**: to change a decision, write a new ADR and mark the old one
`Superseded by ADR-NNNN`.

## Index

| ID | Title | Status | Date |
| --- | --- | --- | --- |
| [0001](./0001-record-architecture-decisions.md) | Record architecture decisions | Accepted | 2026-06-23 |
| [0002](./0002-typescript-bun-hono-stack.md) | TypeScript · Bun · Hono modular-monolith stack | Accepted | 2026-06-23 |
| [0003](./0003-docker-only-bun-runtime.md) | Docker-only Bun runtime (no host install) | Accepted | 2026-06-23 |
| [0004](./0004-pin-container-images-by-digest.md) | Pin container images by digest | Accepted | 2026-06-23 |
