---
id: plan-2026-05-10-003-docs-readme-and-ledger-hygiene
title: "docs: README hero voice split and founder ledger frontmatter hygiene"
type: docs
status: active
stage: validation
summary: "Plan to split the README hero validation narrative from product positioning and repair founder-use ledger frontmatter into valid YAML."
date: 2026-05-10
---

# docs: README hero voice split and founder ledger frontmatter hygiene

## Summary

Resolve two advisory findings from the prior README/ledger `/lfg` run: split the README hero so product positioning and L2 validation evidence do not live in one dense paragraph, and repair `docs/research/founder-use-ledger.md` frontmatter into valid YAML without changing the ledger's evidence body.

---

## Problem Frame

The previous run landed L2-honest README copy and captured 2026-05-10 founder evidence, but left two low-risk cleanup items:

- **MAINT-002 advisory:** `README.md` line 18 blends product description, validation narrative, third-party reportage, and M001 scope in one paragraph. The content is valid; the shape is less scannable than it needs to be.
- **Pre-existing P3 doc hygiene:** `docs/research/founder-use-ledger.md` begins with `## id:` instead of YAML delimiters, has blank-list formatting that is not real frontmatter, and repeats `related:`. The body validates through current scripts, but the file violates the repo's durable-doc convention.

---

## Requirements

- **R1.** `README.md` keeps the same factual L2 claims, but splits the hero into a product/scope paragraph and a separate validation-evidence paragraph.
- **R2.** The README split must not add marketing calls to action, retention percentages, broader-cohort claims, or L3 language.
- **R3.** `docs/research/founder-use-ledger.md` top matter becomes valid YAML delimited by `---`.
- **R4.** Ledger frontmatter preserves existing metadata values and combines the two `related:` lists into one list without dropping entries.
- **R5.** The ledger body below `# Founder-Use Ledger` remains behaviorally unchanged.
- **R6.** `bash scripts/validate-agent-docs.sh` passes.

---

## Scope Boundaries

- No change to product decisions, D130 trigger interpretation, L2/L3 posture, drill evidence, or M001/M002 sequencing.
- No app code or in-app copy changes.
- No `docs/catalog.json` update unless validation or inspection shows it stores a derived frontmatter field that must be synced. The affected docs are already cataloged.
- No attempt to rework the full README beyond the hero split.

---

## Context & Research

### Relevant Files

- `README.md` — repo hub; target is the hero area immediately under `# Volleycraft`.
- `docs/research/founder-use-ledger.md` — evidence log; target is only the malformed top matter before `# Founder-Use Ledger`.
- `.cursor/rules/machine-scannable-docs.mdc` and `AGENTS.md` — durable docs under `docs/` should keep real YAML frontmatter.

### Existing Patterns

- Root `README.md` already uses real YAML frontmatter and a concise hub layout.
- Durable docs under `docs/` usually use `---` delimited YAML with list values formatted as indented arrays.

---

## Key Technical Decisions

- **Split, don't rewrite, the README hero.** Keep the L2 evidence sentence sequence from commit `ba15e24`, but put it in its own paragraph after the product/scope paragraph. This resolves MAINT-002 while avoiding a new positioning decision.
- **Repair ledger frontmatter mechanically.** Convert the current pseudo-frontmatter into real YAML, preserve `last_updated: 2026-05-10`, and merge both `related:` blocks into one. Do not edit the append-only evidence body.
- **Treat validation as the test.** This is pure documentation hygiene; no unit or browser tests apply. The meaningful check is `bash scripts/validate-agent-docs.sh` plus a direct re-read of the changed regions.

---

## Implementation Units

- U1. **Split README hero voices**

  **Goal:** Make the README hero easier to scan while preserving all L2-honest claims.

  **Requirements:** R1, R2

  **Dependencies:** None

  **Files:**
  - Modify: `README.md`

  **Approach:**
  - Keep the first sentence as the product description.
  - Keep the `Beach-first in scope for M001...` sentence in the product/scope paragraph.
  - Move the partner-validation sentences into a separate paragraph immediately below.
  - Leave Stage/Build/Live/Status lines unchanged unless the split creates obvious redundancy.

  **Test scenarios:**
  - Test expectation: none — pure prose shape change.

  **Verification:**
  - README still has no retention percentage, no broader-cohort claim, and no active solicitation.
  - The hero now reads as two short paragraphs rather than one mixed-purpose paragraph.

- U2. **Repair founder ledger frontmatter**

  **Goal:** Convert the founder-use ledger's pseudo-frontmatter into valid YAML while preserving metadata.

  **Requirements:** R3, R4, R5

  **Dependencies:** None

  **Files:**
  - Modify: `docs/research/founder-use-ledger.md`

  **Approach:**
  - Replace the malformed opening block with `---` delimited YAML.
  - Preserve `id`, `title`, `type`, `status`, `stage`, `authority`, `summary`, `last_updated`, `depends_on`, `decision_refs`.
  - Merge the current two `related:` blocks into one `related:` list containing all existing entries in a stable order.
  - Leave everything from `# Founder-Use Ledger` downward untouched.

  **Test scenarios:**
  - Test expectation: none — metadata-only documentation fix.

  **Verification:**
  - `bash scripts/validate-agent-docs.sh` passes.
  - Direct re-read confirms `# Founder-Use Ledger` and body text are unchanged.

---

## Risks & Mitigations

- **Risk:** Accidentally changing append-only evidence while fixing frontmatter.
  **Mitigation:** Patch only the top matter through `decision_refs`, then re-read the first section.
- **Risk:** README split changes the validation claim's meaning.
  **Mitigation:** Preserve wording from `ba15e24`; only move sentence boundaries.

---

## Sources & References

- `README.md`
- `docs/research/founder-use-ledger.md`
- `AGENTS.md`
- `.cursor/rules/machine-scannable-docs.mdc`
- Prior review artifact: `/tmp/compound-engineering/ce-code-review/20260510-163316-513e7b38/metadata.json`
