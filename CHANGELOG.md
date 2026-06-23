# Changelog

All notable changes to **ProcureFlow** are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and the project aims to follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
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
