---
title: "docs: README L2-honest hero polish + 2026-05-10 founder evidence capture"
type: docs
status: active
date: 2026-05-10
---

# docs: README L2-honest hero polish + 2026-05-10 founder evidence capture

## Summary

Update the repo root `README.md` hero to L2-honest framing per the A2 Validation Posture String unlocked in commit `9e54773`, and capture the substantive 2026-05-10 founder follow-up evidence (Seb's solo use, qualitative skill-development claim, specific drill-quality calls) as durable validation evidence in `docs/research/founder-use-ledger.md` so the 2026-07-20 D130 re-eval reads it as canonical signal rather than chat-only context.

---

## Problem Frame

Two related gaps were left open at the close of the week-4 ritual (commit `9e54773`):

1. **README framing trails the validation posture.** The repo root `README.md` hero currently reads as L1-cautious factual prose. The A2 Validation Posture String correction in the week-4 entry unlocked L2 ("tested with one partner, 30-day quiet-window outcome pending/observed; permits case-study framing with the partner's behavioral-return outcome explicitly named"), and the agent recommended a low-cost README polish as the one comms move that doesn't violate D130's "show but don't actively solicit" posture. The polish is small, but skipping it leaves the hero understating the validation state to the small number of people who land on the repo via 1:1 share.

2. **2026-05-10 follow-up reply is materially stronger evidence than the existing 2026-05-10 reflections block captures.** The founder's 2026-05-10 follow-up reply added three signals that strengthen L2 posture beyond the cadence + soft-scope-leak captured in commit `9e54773`'s ledger block: (a) **partner solo use** ("seb has used it alone a couple times" — first direct evidence of partner solo opens beyond the T+1/T+2 ones from 2026-04-22/23); (b) **qualitative friction-reduction + skill-development claims** ("makes [it] easier and more fun to go training because we don't have to think and it just creates a program we can follow" + "we actually feel like we're starting to get better already and i think this is helping do that"); (c) **drill-quality content calls** (`d10` 6-Legged Monster + `d51`/`d33` Around the World named as "great"; some unspecified drills "maybe less clear on immediate return"). All three classes belong in the founder-use ledger — partner solo use under D130 Condition 3 evidence; qualitative claims under L2 framing inputs; drill-quality calls as content-validity signal.

Both gaps are tiny in code-edit terms and orthogonal in scope. They land together because they share the same evidence batch (2026-05-10 founder reply) and because the README copy benefits from the captured evidence being citable.

---

## Requirements

- **R1.** The repo root `README.md` hero (the paragraph at line 18 + the `**Stage**` / `**Build**` / `**Live**` / `**Status**` lines at 20-23) carries L2-honest framing per A2: case-study language naming partner outcome explicitly; no retention-percentage claim; no language implying broader cohort validation than has occurred.
- **R2.** The README polish does NOT actively solicit non-Seb users. No call-to-action ("try it now"), no marketing exhortation, no "we'd love feedback" — just honest factual framing of the current validation state for visitors who happen to land on the repo.
- **R3.** The README polish does NOT make any claim that requires L3 framing (no retention percentage; no "validated with N users"; no statistical claim).
- **R4.** The 2026-05-10 founder follow-up reply's three new signals (partner solo use; qualitative friction-reduction + skill-development; drill-quality calls) are captured in `docs/research/founder-use-ledger.md` as a clearly-labeled addendum to the existing `### Cross-session reflections (captured 2026-05-10)` block (NOT a separate dated block, because they're same-day same-conversation evidence — separating would imply two distinct events).
- **R5.** Each captured signal carries a `D135` classification (content-gap-evidence / feature-wish / behavioral-signal) and an explicit "trigger-fire reading" / "sequencing reading" where applicable, matching the pattern of the existing 2026-04-24 and 2026-05-09 / 2026-05-10 reflection blocks.
- **R6.** Specific drill IDs are named in the drill-quality capture (`d10`, `d51`, `d33`) so the content-validity signal is queryable from the ledger without reading the chat trail.
- **R7.** Frontmatter `last_updated` is bumped on both touched canonical docs (`README.md`, `docs/research/founder-use-ledger.md`).
- **R8.** `bash scripts/validate-agent-docs.sh` passes after the changes.

---

## Scope Boundaries

- **No other README files touched.** `app/README.md` is a developer-facing workspace doc; `docs/README.md` is the editorial index for the docs tree. Neither carries validation-claim language that needs L2 polishing.
- **No in-app copy changes.** The deployed app's onboarding / Setup / Safety screens are NOT updated. L2 framing on the in-app surface is a separate decision (would touch user-facing copy in active screens with their own component-test coverage); out of scope for this lightweight pass.
- **No social posts, marketing copy, PR descriptions, or external-facing materials.** Per the L2 comms recommendation: don't pull non-Seb users in during D130. README polish is internal-honesty for the small number of people who happen to land on the repo via 1:1 share.
- **No new ledger session rows.** Capturing the new signals as ledger-row entries would violate the ledger's "never backfilled from memory more than 24h later" rule for specific dated rows. Cross-session reflections are the right home (matches the existing 2026-05-09 / 2026-05-10 block pattern).
- **No D135 reclassification work.** The captures use the existing D135 classification rules; no decision-doc edits.
- **No catalog.json changes.** The two touched files are already cataloged; their classifications don't change.
- **No code touched.** Pure documentation pass.

### Deferred to Follow-Up Work

- **In-app onboarding / Setup copy L2 polish.** If founder ever wants the deployed app's first-open screens to also carry L2-honest framing, that's a separate plan with component tests. Not blocking; not landing here.
- **Drill-quality call capture into per-drill metadata.** The drill-quality calls (`d10` great, `d51`/`d33` great, some unspecified drills "less clear on immediate return") are captured as ledger evidence here. If a future content-quality decision wants per-drill founder-rating metadata as a structured field, that's a separate plan.
- **README polish for D125 product-naming pages, D119 v0b feature-complete framing, etc.** Out of scope for this pass.

---

## Context & Research

### Relevant Code and Patterns

- `README.md` lines 16-23 — the hero paragraph + Stage / Build / Live / Status lines that carry the validation framing. The factual lines (`Live`, `Status`) need minimal-or-no change; the prose hero (line 18) is the primary L2-honest target.
- `docs/research/founder-use-ledger.md` lines 122-138 — the existing `### Cross-session reflections (captured 2026-05-10)` block. The new evidence appends as an addendum sub-section under this block, not as a separate dated block.
- `docs/plans/2026-04-20-m001-adversarial-memo.md` lines 202-212 (A2 Validation Posture String definition) — the source-of-truth definition of L2 framing, including what L2 permits and prohibits.

### Institutional Learnings

- The week-4 ritual self-correction pinned the Validation Posture String at L2-pending; the comms recommendation in the prior assistant turn was that L2's unlock is internal-honesty permission, not external-launch pressure. README polish is the one move that fits this posture. (Source: chat continuation 2026-05-10; canonical reference: `docs/plans/2026-04-20-m001-adversarial-memo.md` `## 2026-05-11 (week 4 of 13)` entry's Validation Posture String bullet.)
- Existing reflection-block pattern in the ledger uses `### Cross-session reflections (captured YYYY-MM-DD)` as the section header, with numbered items and explicit `D135` classification. Same-day same-conversation evidence appends under the same block as an addendum, not as a new dated block.

### External References

- None. This is a pure-internal documentation pass; no external research applies.

---

## Key Technical Decisions

- **README hero as case-study framing, not bullet list.** Keep the existing prose-paragraph shape on line 18; weave the partner outcome into prose rather than restructuring into a "Validation status:" header section. Rationale: the README is a hub doc, not a validation-claims surface; a case-study sentence inside the hero paragraph is the smallest change that satisfies R1 without inflating the hero into something it isn't.
- **L2-honest sentence shape.** Reference partner behavioral return (Seb's T+1 message + T+2 Dexie open + sustained 2x-weekly cadence + Seb's solo opens) and the qualitative claim ("we like it / starting to get better"); explicitly NOT name a percentage, NOT claim cohort validation, NOT solicit users. Within these constraints, exact word choice is implementation-time discretion (per Phase 3.6 of `ce-plan` — wording is implementation detail, not plan decision).
- **Stage / Build / Live / Status lines: factual updates only.** The `Stage` line's "operating in `D130` founder-use mode through 2026-07-20" is already L2-compatible. The `Status` line's `D130` partner-use Condition 3 final close on 2026-05-21 reference may be tightened to reflect that Condition 3 is at "provisional pass, strengthened" with multiple evidence channels, but no shape change.
- **Ledger addendum sub-section header.** Use `**Addendum (captured 2026-05-10, founder follow-up reply):**` as the sub-heading inside the existing 2026-05-10 reflections block. Bold-prefixed sub-section is consistent with the existing block's numbered-item formatting and keeps the addendum visually distinct without breaking the dated-block model.
- **Drill-quality capture detail level.** Name the specific drill IDs the founder called out positively (`d10` / `d51` / `d33`); for the negative-by-omission "some drills less clear on immediate return," leave it as the founder phrased it (no fabricated drill-ID list). Rationale: the founder did not name specific drills on the negative side; inventing IDs would violate evidence integrity.
- **No commit-yet split.** Both U1 and U2 land in the same `/lfg` execution and the same single commit at the end; they share the same logical motivation (close out 2026-05-10 evidence batch) and aren't independently useful. (See Step 7 of the lfg pipeline.)

---

## Open Questions

### Resolved During Planning

- **Q: Which README — repo root, app, or docs?** Resolution: repo root `README.md` only. `app/README.md` is developer-facing; `docs/README.md` is the editorial index. Neither carries validation-claim language.
- **Q: Append to existing 2026-05-10 block or new dated block?** Resolution: append as `**Addendum (captured 2026-05-10, founder follow-up reply):**` sub-section inside the existing block. Same-day same-conversation evidence; separating would imply two distinct events.
- **Q: Should L2 framing name Seb by name or use "one partner" / "the partner"?** Resolution: existing canonical references in the README (line 23) and ledger already use "Seb" / "the partner" interchangeably; the README hero may use either, but consistent within the same paragraph. Implementation-time discretion.

### Deferred to Implementation

- **Exact wording of the L2-honest hero sentence.** Constrained by R1-R3; exact phrasing is implementation discretion.
- **Whether the `Status` line's `Condition 3 final close on 2026-05-21` reference also needs minor tightening.** Read the current line at implementation time; tighten only if it understates the strengthened-provisional-pass state.

---

## Implementation Units

- U1. **Repo root README hero L2-honest polish**

  **Goal:** Update the repo root `README.md` hero (line 18 prose + lines 20-23 Stage / Build / Live / Status) to L2-honest framing per A2, satisfying R1-R3 and R7.

  **Requirements:** R1, R2, R3, R7

  **Dependencies:** None

  **Files:**
  - Modify: `README.md`

  **Approach:**
  - Rewrite line 18's prose hero sentence to weave in the partner case-study framing (Seb's behavioral return + sustained co-use cadence + qualitative claim) per the L2 framing constraints.
  - Re-read lines 20-23 (Stage / Build / Live / Status) and tighten only what understates the current state. The `Stage` line is already L2-compatible. The `Status` line may benefit from naming Condition 3's strengthened-provisional-pass state explicitly rather than only the 2026-05-21 close date.
  - Bump frontmatter `last_updated` to `2026-05-10`.

  **Patterns to follow:**
  - Existing prose-paragraph hero shape — do not restructure into a "Validation status:" header section (Key Technical Decisions row 1).
  - Existing `Stage` / `Build` / `Live` / `Status` line shape (single-line bold-prefixed factual statements).

  **Test scenarios:**
  - Test expectation: none — pure documentation copy change with no behavioral surface, no component tests, no doctest. Verification is human-readable + scripts/validate-agent-docs.sh + the L2-framing rubric in R1-R3.

  **Verification:**
  - Re-read the rewritten hero against the A2 L2 definition (`docs/plans/2026-04-20-m001-adversarial-memo.md` line 209). Confirm: no retention percentage, no cohort-validation claim, no active solicitation, partner outcome named explicitly.
  - `bash scripts/validate-agent-docs.sh` passes.
  - The Stage / Build / Live / Status lines remain factually accurate against `docs/status/current-state.md`.

- U2. **Founder-use ledger 2026-05-10 addendum capture**

  **Goal:** Append a `**Addendum (captured 2026-05-10, founder follow-up reply):**` sub-section to the existing `### Cross-session reflections (captured 2026-05-10)` block in `docs/research/founder-use-ledger.md`, capturing the three new signal classes (partner solo use; qualitative friction-reduction + skill-development; drill-quality content calls).

  **Requirements:** R4, R5, R6, R7

  **Dependencies:** None (independent of U1)

  **Files:**
  - Modify: `docs/research/founder-use-ledger.md`

  **Approach:**
  - Insert the addendum sub-section between the existing block's "L2 Validation Posture String — comms recommendation acknowledged" item and the closing "**No schema, scope, or sequencing change**" disclaimer.
  - Three captured items (one per signal class), each with: founder quote (verbatim where possible), `D135` classification, trigger-fire reading where applicable, and sequencing reading where applicable.
  - Item 1 (partner solo use): name as behavioral signal under D130 Condition 3 evidence channel; clarify it strengthens but does not by itself prove the unprompted-open quiet-window pass (the 2026-04-22/23 T+1/T+2 evidence is the canonical opening; this is sustained-use evidence layered on top). Quote: *"seb has used it alone a couple times"*.
  - Item 2 (qualitative friction-reduction + skill-development): two distinct sub-claims. Friction-reduction quote: *"this actually makes [it] easier and more fun to go training because we don't have to think and it just creates a program we can follow"* — validates the structured-workflow-over-chat-first frame from `docs/vision.md` `P*` learned preferences. Skill-development quote: *"we actually feel like we're starting to get better already and i think this is helping do that"* — first qualitative perceived-improvement claim from sustained co-use; classify as behavioral signal at qualitative-evidence weight (no objective measurement, but explicit founder + partner attribution to app use).
  - Item 3 (drill-quality content calls): name `d10` 6-Legged Monster + `d51`/`d33` Around the World as founder-positive; record the negative-by-omission "some drills maybe less clear on immediate return" without fabricating drill IDs. Frame as content-validity signal informing future content-quality decisions; not a trigger fire.
  - Close the addendum with an explicit "no schema / scope / sequencing change" line consistent with the parent block's pattern.
  - Bump frontmatter `last_updated` to `2026-05-10` (already at 2026-05-10 from prior commit; no-op if already correct).

  **Patterns to follow:**
  - Existing 2026-05-10 reflection block items (founder quote + D135 classification + trigger-fire reading + sequencing reading where applicable).
  - Existing 2026-04-24 reflection block addendum-style additions.
  - `docs/decisions.md` `D135` classification scheme (content-gap-evidence vs feature-wish vs behavioral signal).

  **Test scenarios:**
  - Test expectation: none — pure documentation evidence-capture with no behavioral surface, no component tests. Verification is human-readable + scripts/validate-agent-docs.sh + the D135 classification rubric.

  **Verification:**
  - All three signal classes captured with explicit D135 classification and (where applicable) trigger-fire / sequencing readings.
  - All four founder quotes preserved verbatim where possible; drill IDs named on the positive side; no drill IDs fabricated on the negative-by-omission side.
  - `bash scripts/validate-agent-docs.sh` passes.
  - The addendum sub-section reads as a same-day continuation of the parent block, not as a new dated event.

---

## System-Wide Impact

- **Interaction graph:** None. Pure documentation. No callbacks, middleware, or app surfaces affected.
- **Error propagation:** None.
- **State lifecycle risks:** None.
- **API surface parity:** None.
- **Integration coverage:** None.
- **Unchanged invariants:** All existing canonical doc surfaces (`AGENTS.md`, `docs/catalog.json`, `docs/decisions.md`, `docs/vision.md`, `docs/prd-foundation.md`) are unchanged. The README is a hub doc; the ledger is an evidence log. Neither edit alters any decision, principle, scope, schema, or sequencing.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| README copy drifts from canon (e.g., contradicts `docs/status/current-state.md` or the validation-overhang scoreboard). | U1 verification re-reads against `docs/status/current-state.md` + the A2 L2 definition; `validate-agent-docs.sh` catches structural / frontmatter issues. |
| L2 framing accidentally tips into L3 territory (retention claim, cohort claim) under enthusiasm. | Explicit constraint in R3 + Key Technical Decisions row 2; verification step in U1 explicitly checks against L3-prohibited language patterns (percentage, "users", "validated"). |
| Ledger addendum reads as a separate event rather than a same-day continuation, falsely inflating the evidence-event count. | Sub-section heading is explicit (`**Addendum (captured 2026-05-10, founder follow-up reply):**`); positioned inside the parent block, not as a new `### Cross-session reflections` block. |
| Founder quotes are reconstructed from agent memory rather than the actual chat trail. | The chat trail is the canonical source; quotes in U2's approach section are pre-extracted from the user's 2026-05-10 follow-up reply in this conversation; implementer transcribes verbatim, not paraphrased. |

---

## Sources & References

- **A2 Validation Posture String definition:** `docs/plans/2026-04-20-m001-adversarial-memo.md` lines 202-212
- **Existing 2026-05-10 reflections block:** `docs/research/founder-use-ledger.md` `### Cross-session reflections (captured 2026-05-10)` section (added in commit `9e54773`)
- **L2 comms recommendation:** chat continuation 2026-05-10 (this conversation, prior assistant turn before this `/lfg`)
- **Validation-overhang scoreboard:** `docs/status/m001-validation-overhang.md` Calendar-Dated Reads + D130 Falsification Conditions sections
- **Repo root README target:** `README.md` lines 16-23
- **D135 classification scheme:** `docs/decisions.md` `D135`
- **D130 founder-use mode definition:** `docs/decisions.md` `D130`
- **D125 product-naming + beach-first scope:** `docs/decisions.md` `D125`
