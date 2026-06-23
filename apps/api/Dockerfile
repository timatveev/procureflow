# syntax=docker/dockerfile:1
# ProcureFlow API — development image (Bun runtime).
# Base image pinned by digest (sha256); human-readable tag kept in the comment.
# oven/bun:1-alpine
FROM oven/bun:1-alpine@sha256:5acc90a93e91ff07bf72aa90a7c9f0fa189765aec90b47bdbf2152d2196383c0 AS base
WORKDIR /app

# --- dependencies: cached unless package.json / lockfile change ---
FROM base AS deps
COPY package.json bun.lock* ./
RUN bun install

# --- development target: hot reload via `bun --watch` ---
FROM base AS dev
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["bun", "run", "--watch", "src/index.ts"]
