# Changelog

All notable changes to **ProcureFlow** are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and the project aims to follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- Dockerized local development environment (#1): root `docker-compose.yml` with Postgres 16,
  Redis 7, Mailpit, and a minimal `api` service — all images pinned by `sha256` digest, a
  bridge network, a named `pgdata` volume, and healthchecks (`pg_isready`, `redis-cli ping`,
  `/healthz`). Minimal Hono health stub (`GET /healthz`) on Bun with a dedicated dev
  `Dockerfile` and a `bun test`; root `infra:*` scripts and a README setup section.
- Project constitution `CLAUDE.md`, pnpm-workspace monorepo skeleton
  (`apps/api`, `apps/web`, `packages/shared`) and baseline config
  (`.gitignore`, `.gitattributes`, `.editorconfig`, `.env.dist`, `LICENSE`).
- Delivery plan: 6 milestones, 12 atomic issues, and a public Projects v2 board
  ("ProcureFlow Delivery") with `Type`, `Epic`, and `Status` fields.
- Label taxonomy: `priority: {critical,high,medium,low}` and component/scope labels
  (`frontend`, `backend`, `design`, `qa`, `devops`).

### Changed
- Adopted the adapted task lifecycle (`CLAUDE.md` §5/§11): statuses
  **Backlog → To Do → In Progress → In Review → Done**, a single-`main` branch model,
  and explicit gates A (business approval), B (start coding), C (merge).
- Adopted the `[PRF-N]` issue/PR/branch/doc naming key (`CLAUDE.md` §5/§9/§10, PRF-14): titles
  `[PRF-N] <subject>` (semantic type moves to labels / board `Type`), branches
  `feature/PRF-N-<slug>`, specs `docs/PRF-N/spec.md`. `N` is an issue-only counter (the N-th
  issue created), not the GitHub number. Re-keyed the first spec `docs/1 → docs/PRF-1`.
