# Reference

**Information-oriented** documentation: precise, look-up material the reader consults rather than
reads end-to-end — API contracts, configuration variables, database schemas, command catalogues.
Reference is descriptive and exhaustive; it tells you *what is*, not *how to* (see
[`../guides/`](../guides/)) or *why* (see [`../explanation/`](../explanation/)).

This folder is intentionally a stub for now. Reference pages are added when there is something stable
to describe — for example:

- the HTTP API surface (per module), generated from / aligned with the Zod contracts;
- environment variables (mirroring `.env.dist`);
- the database schema (Drizzle).

Until then, `.env.dist`, the module Zod schemas, and the Drizzle schema are the source of truth.
