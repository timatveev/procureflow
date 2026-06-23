# ADR-0004: Pin container images by digest

- Status: Accepted
- Date: 2026-06-23

> Backfilled from PRF-1 (the dockerized dev environment). See
> [`../specs/PRF-1/spec.md`](../specs/PRF-1/spec.md).

## Context

`docker-compose.yml` references third-party images (Postgres, Redis, Mailpit, Bun). Mutable tags like
`postgres:16-alpine` can resolve to different image contents over time, so two `docker compose up`
runs on different days — or different machines — may not be byte-identical. For a reproducible dev/CI
environment that undermines the whole point.

## Decision

We will **pin every container image by its `sha256` digest** (`image: name:tag@sha256:…`), keeping the
human-readable tag in a trailing comment for readability. Multi-arch *index* digests are used so the
pin resolves on both amd64 and arm64. Digests are re-verified at implementation time and refreshed
deliberately, not implicitly.

## Consequences

- Reproducible, tamper-evident image resolution across machines and time.
- Updating an image is an explicit, reviewable change (bump the digest) rather than silent drift.
- A documented refresh step is needed when intentionally upgrading a base image.
