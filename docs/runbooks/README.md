# Runbooks

**Operational** documentation: step-by-step procedures for running and recovering the system —
incident response, routine operations, "it's broken, what now?" checklists. Runbooks are how-tos for
operators; they value precision and a calm, copy-pasteable sequence over prose.

This folder is intentionally a stub for now (there is nothing deployed yet). The first runbooks are
expected to cover, e.g.:

- bringing the local stack up / down / resetting it (today: see the README's
  [Local development environment](../../README.md#local-development-environment));
- database migration and rollback;
- the async notification worker (BullMQ) — draining/retrying a stuck queue.

Add a runbook when an operational procedure becomes non-obvious or repeatable.
