# Spec — PRF-13 (issue #16): adopt Docs-as-Code — Diátaxis `docs/` tree, README hub, `.github` templates

- **Issue:** #16 · **Key:** PRF-13 · **Epic:** Infrastructure · **Type:** Task
- **Labels:** `documentation`, `devops`, `priority: medium`
- **Status:** To Do → (Gate B ✓) → In Progress
- **Gate A:** skipped (infra/tooling task, per CLAUDE.md §5.2).

---

## 1. Context

ProcureFlow is built publicly under a "Specs Before Code" lifecycle. Documentation must live
**in the repo**, be versioned with the code, and be reviewed in the same Pull Requests — the
**Docs-as-Code** approach (no external Wiki, which private repos lack and which drifts anyway).
CLAUDE.md §10 already anticipates per-task specs, ADRs and BPMN under `docs/`; this task formalizes
that hint into a coherent, navigable structure with authoring guardrails, so the practice is
adopted from the start instead of being retrofitted.

Current state: `docs/` held only `docs/PRF-1/spec.md` (a per-task spec) and a `.gitkeep`;
`.github/` had only an empty `workflows/`. There was no home for durable documentation, no single
entry point, and no template nudging contributors to update docs / record an ADR.

This is a **documentation/tooling task: no application code, no DB schema, no API contracts, no
domain logic**. It is independent of the code milestones and can land anytime.

## 2. Decisions (resolved technical forks)

Confirmed with the Product Owner (the four "open questions" in the issue); #4 was revised at Gate B:

| # | Fork | Decision |
| --- | --- | --- |
| 1 | ADR template format | **Nygard (lightweight)** — Status · Context · Decision · Consequences. Low ceremony, matches the AC. |
| 2 | Issue-template authoring | **GitHub Issue Forms (YAML)** — structured fields mirroring our BA structure; guides external contributors. |
| 3 | ADR seed depth | **Backfill key past decisions** — template + index + a meta ADR plus 3 real ADRs (stack, Docker-only Bun, digest-pinning). |
| 4 | Per-task spec location | **Nest under `docs/specs/PRF-<n>/spec.md`** (revised at Gate B). A dedicated `specs/` folder keeps keyed spec dirs out of the durable-docs root; `docs/PRF-1/` is migrated. |

> **CLAUDE.md follow-up (PO-only):** §5.3 and §10 still cite `docs/PRF-N/spec.md`. Per the
> constitution only the Product Owner edits CLAUDE.md, so this PR updates the repo to
> `docs/specs/PRF-N/spec.md` and flags the two CLAUDE.md lines for the PO to align.

## 3. Scope

### In scope

1. **`docs/` taxonomy (Diátaxis + ADR)** — durable-docs tree beside the task specs:
   `docs/adr/`, `docs/guides/`, `docs/reference/`, `docs/explanation/`, `docs/runbooks/`, each
   with a `README.md` describing its purpose, plus a top-level `docs/README.md` index. Per-task
   specs move to **`docs/specs/PRF-<n>/spec.md`** (existing `docs/PRF-1/` migrated) and are linked.
2. **ADR home** — `docs/adr/template.md` (Nygard), `docs/adr/README.md` (index), and **4 seed
   ADRs** (§6).
3. **README as the single entry point** — a lightweight **service passport** (owner, status, key
   links) + a **Documentation** section linking into `docs/`. All relative links resolve on GitHub.
4. **`.github` templates / guardrails** — `ISSUE_TEMPLATE/feature_task.yml` + `bug_report.yml`
   (Issue Forms) + `config.yml`; `pull_request_template.md` with a docs/ADR checklist.
5. **Authoring convention** — a "How we document" note (`docs/explanation/documentation.md`):
   the Diátaxis split, when an ADR is required, the English-only policy, the `docs/specs/PRF-<n>/`
   spec convention. One how-to seed (`docs/guides/writing-an-adr.md`).

### Out of scope (future follow-up)

- **Static Site Generator** (Docusaurus / MkDocs-Material / VitePress) + GitHub Pages hosting —
  adopt only once `docs/` outgrows GitHub-native rendering & search. Separate issue.
- **Bulk authoring** of real guides/runbooks/reference — this task ships the *skeleton, templates
  and conventions* seeded with minimal examples; substantive content is written per feature task.
- **BPMN diagrams** (CLAUDE.md §10) — folder may be reserved; authoring deferred.
- **CI link-checking** of relative Markdown links — noted as a follow-up; this task validates links
  manually. (Tracked for the CI task.)

## 4. Module boundaries & invariants

Not exercised. No domain code, no DB mutation, no API surface, no money/budget logic. DDD module
isolation (CLAUDE.md §4.1) and the budget invariant (§4.3) are untouched. The only "contract" this
task establishes is the **documentation taxonomy** and the **contribution templates**.

## 5. Deliverables — planned tree

```
docs/
├─ README.md                       # taxonomy index: what each folder is for + how specs fit
├─ adr/
│  ├─ README.md                    # ADR index (table: id · title · status)
│  ├─ template.md                  # Nygard template — one copy away
│  ├─ 0001-record-architecture-decisions.md
│  ├─ 0002-typescript-bun-hono-stack.md
│  ├─ 0003-docker-only-bun-runtime.md
│  └─ 0004-pin-container-images-by-digest.md
├─ guides/
│  ├─ README.md                    # purpose: task-oriented how-tos
│  └─ writing-an-adr.md            # how-to seed (copy template → number → update index)
├─ reference/
│  └─ README.md                    # purpose: information-oriented reference (seeded later)
├─ explanation/
│  ├─ README.md                    # purpose: understanding-oriented concepts & architecture
│  └─ documentation.md             # "How we document" — the authoring convention
├─ runbooks/
│  └─ README.md                    # purpose: operational/incident procedures (seeded later)
└─ specs/
   ├─ PRF-1/spec.md                # migrated from docs/PRF-1/ — preserved, linked from docs/README.md
   └─ PRF-13/spec.md               # this spec

.github/
├─ ISSUE_TEMPLATE/
│  ├─ feature_task.yml             # Issue Form mirroring the BA structure
│  ├─ bug_report.yml               # Issue Form for defects
│  └─ config.yml                   # blank_issues_enabled + contact links (board)
├─ pull_request_template.md        # checklist incl. docs/ADR + Closes #N
└─ workflows/.gitkeep              # unchanged
```

Every folder ships a `README.md`, so there are **no empty folders** and each renders with a purpose
statement on GitHub.

## 6. ADR seeds (Nygard format)

| ID | Title | Status | Captures |
| --- | --- | --- | --- |
| 0001 | Record architecture decisions | Accepted | The meta-decision to keep ADRs (the "why ADRs" entry). |
| 0002 | TypeScript · Bun · Hono modular-monolith stack | Accepted | Stack override of the original PHP/Symfony research (CLAUDE.md §3). |
| 0003 | Docker-only Bun runtime (no host install) | Accepted | From PRF-1: Bun runs only in the `api` container. |
| 0004 | Pin container images by digest | Accepted | From PRF-1: reproducibility via `sha256` digest pins. |

These convert decisions currently recorded only in commits / memory into first-class, linkable ADRs
and demonstrate the convention with real content. Template (Nygard):

```markdown
# ADR-NNNN: <short title>

- Status: Proposed | Accepted | Superseded by ADR-MMMM
- Date: YYYY-MM-DD

## Context
What forces are at play (technical, business, team)? Why is a decision needed?

## Decision
The change we are making, stated in active voice ("We will …").

## Consequences
What becomes easier or harder. Trade-offs accepted, follow-ups, things to watch.
```

## 7. Contribution templates — planned

### `.github/ISSUE_TEMPLATE/feature_task.yml` (Issue Form)
Fields mirroring the BA structure (CLAUDE.md §5.1): **Context**, **Problem**, **Stakeholders**,
**Scope (in/out)**, **User Story**, **Acceptance Criteria (Gherkin)**, **Dependencies**,
**Assumptions**, **Definition of Done**, **Priority/Risks**. `title` defaults to `[PRF-N] ` with a
note that **N is the issue-only counter, assigned by the author** (GitHub cannot auto-number it).
Labels prefilled with the type.

### `.github/ISSUE_TEMPLATE/bug_report.yml` (Issue Form)
**Summary**, **Steps to reproduce**, **Expected**, **Actual**, **Environment/Version**,
**Severity/Impact**. `title` defaults to `[PRF-N] `.

### `.github/ISSUE_TEMPLATE/config.yml`
`blank_issues_enabled: false`; a contact link to the **project board** so chores/questions have a
home.

### `.github/pull_request_template.md`
Sections: **Summary**, **Changes**, **How tested**, **Linked issue** (`Closes #N`), and a
**checklist**:
- [ ] Docs updated (or N/A)
- [ ] **ADR added** if a decision/architecture changed (or N/A)
- [ ] Tests added/updated and green; `tsc`/lint pass (or N/A)
- [ ] English-only (per the language policy)
- [ ] Title uses the `[PRF-N] <subject>` convention

## 8. README changes

- **Service passport** block near the top: Owner (Timofey / Product Owner) · Status (Initialization)
  · Methodology (Specs Before Code → CLAUDE.md) · Key links (project board, milestones, CHANGELOG,
  docs index).
- **Documentation** section: short Diátaxis explanation + links to `docs/README.md`, `docs/adr/`,
  `docs/guides/`, `docs/reference/`, `docs/explanation/`, `docs/runbooks/`, and the task-spec
  convention (`docs/specs/PRF-<n>/spec.md`).
- Update the existing **Structure** block's `docs/` comment to reflect the taxonomy.
- Keep all links **relative** so they resolve both on GitHub and in checkouts.

## 9. Authoring convention — `docs/explanation/documentation.md`

A short "How we document" note covering: the **Diátaxis** split (tutorials are out of scope for now;
guides = how-to, reference = information, explanation = understanding) and how **ADRs** and **task
specs** complement it; **when an ADR is required** (any architecture/stack/cross-cutting decision —
e.g. choosing a library, a boundary, a persistence strategy); the **English-only** policy
(CLAUDE.md, language policy); and the `docs/specs/PRF-<n>/spec.md` per-task convention.
`docs/guides/writing-an-adr.md` is the task-oriented companion (copy `template.md` → next number →
fill → add a row to `docs/adr/README.md`).

## 10. Test / verification plan

No production code, so verification is structural (no `bun test` here):

1. **Structure:** `docs/` contains `adr/ guides/ reference/ explanation/ runbooks/ specs/`, each with
   a `README.md` (specs has per-key dirs); `docs/README.md` explains each and references
   `docs/specs/PRF-<n>/`.
2. **Links:** every relative link in `README.md` and `docs/README.md` resolves to an existing path
   (manual walk; `find`-check that each target exists). No broken links.
3. **ADRs:** `docs/adr/` has `template.md`, `README.md` index, and the 4 seed ADRs; each ADR has
   Status/Context/Decision/Consequences; the index lists all four.
4. **Issue Forms:** `feature_task.yml` and `bug_report.yml` are valid YAML and parse as GitHub Issue
   Forms; `config.yml` disables blank issues and shows the board link.
5. **PR template:** opening a PR pre-fills `pull_request_template.md` with the docs/ADR checklist.
6. **English-only:** all new artifacts are in English.
7. **Migration:** `docs/PRF-1/spec.md` content preserved at `docs/specs/PRF-1/spec.md` and linked;
   no orphaned `docs/PRF-1/`.

## 11. Risks & mitigations

| Risk | Mitigation |
| --- | --- |
| Over-engineering — empty folders, ceremony | Seed only what we use (a README per folder + minimal examples); defer the SSG and bulk content. |
| Link rot in README/docs index | Manual link walk now; CI relative-link check tracked as a follow-up. |
| Issue Forms verbosity discourages quick issues | `config.yml` keeps a board contact link; forms target substantive BA issues, not every chore. |
| `[PRF-N]` key can't be auto-numbered by GitHub | Template documents that N is author-assigned (issue-only counter); convention lives in CLAUDE.md §9. |
| CLAUDE.md vs repo path drift | PR flags §5.3/§10 for the PO to update from `docs/PRF-N/` to `docs/specs/PRF-N/`. |

## 12. Definition of Done

- [ ] `docs/` taxonomy + `docs/README.md` index merged; `docs/PRF-1/spec.md` migrated to
      `docs/specs/PRF-1/spec.md` (content preserved) and linked.
- [ ] README updated with service passport + Documentation section; all relative links valid.
- [ ] `.github/ISSUE_TEMPLATE/*` (feature/task + bug Issue Forms + `config.yml`) and
      `.github/pull_request_template.md` present and rendering on GitHub.
- [ ] ADR template (+ index) in `docs/adr/`; the 4 seed ADRs (0001–0004) present and listed.
- [ ] "How we document" convention captured (`docs/explanation/documentation.md`) + the
      `writing-an-adr` how-to; English-only respected.
- [ ] `CHANGELOG.md` updated; PR opened against `main` with `Closes #16` (status → In Review).
- [ ] Branch cleanup only after the Product Owner merges (Gate C).
```
