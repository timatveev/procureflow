# How to write an ADR

You made a decision worth remembering (a stack/library choice, a module boundary, a persistence or
security strategy, an infra convention). Record it as an Architecture Decision Record. It takes a
couple of minutes.

## Steps

1. **Pick the next number.** Look at [`../adr/README.md`](../adr/README.md) and take the next
   zero-padded id (e.g. `0005`).
2. **Copy the template.** Duplicate [`../adr/template.md`](../adr/template.md) to
   `docs/adr/NNNN-kebab-title.md` (lower-case, hyphenated title).
3. **Fill the four sections:**
   - **Status** — `Proposed` while under discussion, `Accepted` once decided.
   - **Context** — the forces and constraints, stated neutrally (no foregone conclusion).
   - **Decision** — the choice, in active voice ("We will …"); name the main alternatives and why
     they lost if it helps.
   - **Consequences** — what gets easier/harder, trade-offs accepted, follow-ups.
4. **Add a row** to the index table in [`../adr/README.md`](../adr/README.md) (id · title · status · date).
5. **Commit it with the change** it justifies, and tick "ADR added" in the PR checklist.

## Rules

- ADRs are **immutable once Accepted.** To change a decision, write a new ADR and set the old one's
  status to `Superseded by ADR-NNNN` (and link forward from it).
- One decision per ADR. If you're recording two, write two.
- English only.

See also [`../explanation/documentation.md`](../explanation/documentation.md) — when an ADR is required.
