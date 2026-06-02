---
id: m002-receipt-doc-review-synthesis-2026-05-27
title: M002 Receipt Requirements Doc — Multi-Persona Review Synthesis
status: active
stage: validation
type: review
authority: Synthesis of 6 parallel persona reviewers' findings on the 2026-05-27 M002 receipt brainstorm requirements doc; binds the v2 revision of that doc
summary: "Six persona reviewers (adversarial, product-lens, scope-guardian, feasibility, coherence, design-lens) returned ~66 findings on the M002 receipt brainstorm requirements doc. Three strategic concerns converged across personas (cohort-evidence dual-read drop wrong, weekly cadence default wrong, shape itself contested from both directions). ~12 mechanical/design fixes do not require new decisions. Path A (revise in place + surface strategic-shape fork as Resolve Before Planning) was selected. This doc captures the reviewer reasoning for traceability into the revised requirements doc."
last_updated: 2026-05-27
depends_on:
 - docs/brainstorms/2026-05-27-m002-receipt-training-only-requirements.md
 - docs/ideation/2026-05-27-m002-directions-ideation.md
 - docs/ideation/2026-05-27-plan-and-adaptation-system-seed.md
 - docs/milestones/m002-weekly-confidence-loop.md
 - docs/decisions.md
---

# M002 Receipt Doc Review Synthesis

## Why this doc exists

On 2026-05-27, after writing the M002 receipt brainstorm requirements doc at `docs/brainstorms/2026-05-27-m002-receipt-training-only-requirements.md`, six persona reviewers were dispatched in parallel via the equivalent of `ce-doc-review` (adversarial, product-lens, scope-guardian, feasibility, coherence, design-lens). This file consolidates their findings so the reasoning persists with the doc and informs both the v2 revision and any future planning pass.

**Authority caveat.** The reviewer outputs were captured in agent transcripts that the harness partially compressed into summaries. The finding counts and convergence patterns below are accurate; specific per-finding bodies are reconstructed from the structured summaries each reviewer returned. If a deeper read of any single finding is needed for planning, the reviewer can be re-dispatched against the revised doc.

## Reviewer summary

| Reviewer | Findings | Severity |
|---|---|---|
| Adversarial | 11 | 1 CRITICAL, 4 HIGH, 4 MEDIUM, 2 LOW |
| Product-lens | 7 | 1 CRITICAL, 3 HIGH, 3 MEDIUM |
| Scope-guardian | 7 | 1 CRITICAL, 2 HIGH, 1 MED-HIGH, 3 MEDIUM |
| Feasibility | 12 | (severity counts not summarized; 3 named as blockers — F1, F3, F4) |
| Coherence | 16 | 2 CRITICAL, 5 HIGH, 6 MEDIUM, 3 LOW |
| Design-lens | 13 | 3 CRITICAL, 4 HIGH, 4 MEDIUM, 2 LOW |
| **Total** | **~66** | **~7 CRITICAL, ~18 HIGH, ~25 MEDIUM, ~8 LOW** |

## Three strategic concerns (convergent across reviewers)

### Concern S1 — Cohort-evidence dual-read was wrongly dropped (CRITICAL)

**Raised by:** adversarial C1 + product-lens #1 (both rated CRITICAL).

**Argument:** The brainstorm dropped the cohort-evidence dual-read framing from CC-1 because the founder did not surface it as a felt need during dialogue. The Key Decision text claimed the existing JSON export at `services/export.ts` covers the founder's diagnostic read. Both reviewers found:
- `services/export.ts` is a **raw table dump** (founder table-dump JSON export, V0B-15), not a diagnostic surface. It exports rows without aggregation, framing, or interpretation. It is not the same artifact as a receipt-shaped read.
- D147 explicitly reframes the 2026-07-20 D130 founder-use window re-eval to **ride on M002 evidence** for the cohort decision. The dual-read framing was M002's structural answer to "why this is M002-worthy rather than M001 polish."
- Dropping the dual-read without a real replacement weakens M002's load-bearing rationale at the same moment the cohort decision needs M002 evidence to anchor against.

**Fix in v2:** re-introduce the cohort-evidence dual-read as an explicit Key Decision and at least one R-ID. Acknowledge that the JSON export is not the right artifact for the founder-readable diagnostic surface, and design the receipt schema so the same persisted record serves both reads (user-facing receipt voice + founder-readable cohort-evidence record).

### Concern S2 — "Weekly + on-demand" cadence default is wrong (CRITICAL)

**Raised by:** adversarial H4 + product-lens #4 + coherence #1 (rated CRITICAL by coherence for the R8 contradiction).

**Argument:** The founder's actual reflection cadence surfaced during brainstorm is **post-game (3 games/week)**, not weekly. Ideation survivor #6 (anti-calendar cluster) explicitly named "weekly" as the Strava Weekly Snapshot anti-pattern shape with multiple primary-research citations (road.cc 2024; PMC n=225 study 2025). The doc let "weekly" survive because the M002 milestone name said so — inherited convention, not chosen from evidence. Coherence additionally flagged that R8 references "between tournaments" cadence which Scope Boundaries explicitly forbid.

**Fix in v2:** replace "weekly + on-demand" with **event-anchored** as the v1 default — receipt regenerates after each completed training session, readable any time. Acknowledge in the doc that the cadence may shift with founder-use evidence. Delete R8's "between tournaments" parenthetical to remove the scope contradiction.

### Concern S3 — The receipt's shape is contested from both directions (HIGH)

**Raised by:** product-lens #3 + #7 (re-pivot UP toward plan-system) vs. scope-guardian's max-cut path (re-pivot DOWN to single Home cell only).

**The UP argument (product-lens):** The founder's loudest evidence is the F1 attack-content gap (3 hits in 5 days, partner-corroborated). The parked plan-and-adaptation seed is the founder's actual stated vision. Training-only receipt ships the calmest dashboard but doesn't address the loudest pain. M002's right move may be to fast-track a slice of the parked seed instead of CC-1's narrow version.

**The DOWN argument (scope-guardian):** `BlockFocus` is premature abstraction justified primarily by "forward-compat with a parked system that may never ship" — speculative substrate. The 3–5 rule suggestion layer fails the founder's explicit "no overload" posture; the founder's decision fatigue during brainstorm suggests the user might prefer Path γ (no suggestion at all). The Settings → Receipts list is justified by a partner's wish, not founder-stated need. Cut all three; ship one Home cell with raw data only, zero new schema, zero new routes.

**Both reviewers, from opposite directions, suggest the training-only-with-rules middle-ground may be wrong.** Doesn't necessarily mean it IS wrong — it might be correctly calibrated — but it deserves explicit defense from the founder, not orchestrator-picking-in-conversation.

**Fix in v2:** surface this strategic-shape fork as an explicit `Resolve Before Planning` outstanding question in the doc itself, with the three named alternatives (current shape / max-cut / plan-system slice) and the reviewer arguments distilled. Let the founder pick at plan-time with full review context, not me picking in conversation under decision fatigue.

## ~12 mechanical / design fixes (no new decisions required)

These can be applied directly in v2 without further dialogue.

**Coherence (mechanical):**
- M1. Delete R8's "(or for the period between tournaments — see Outstanding Questions on cadence)" parenthetical — contradicts Scope Boundaries.
- M2. F1's `Covered by: R1, R2, R3, R4, R7` is wrong: R7 is about audit-ability of the suggestion sentence, not the read flow. Correct to `R1, R2, R3, R4, R5, R12, R13`.
- M3. F2's `Covered by: R5, R6` is incomplete: the flow involves R8 (user-authored), R9 (no nag), R10 (persistence). Correct to `R5, R6, R8, R9, R10`.
- M4. F3's `Covered by: R5, R8` is incomplete: the flow's outcome involves R9 (calm fallback). Correct to `R5, R8, R9`.
- M5. AE3's `Covers R5, R7, R11` is mis-tagged for R11. R11 is the no-notifications floor; the correct fit is R4 (no stats-for-stats). Correct to `R5, R7, R4`.
- M6. Add R14 (cadence is event-anchored after each completed training session) and R15 (surface location is Home cell + Settings → Receipts list) to make Decisions 4 + 5 R-ID-bound and testable.
- M7. Fix header "Two product-shape questions remain" / similar undercount in any post-edit narrative — verify after edits.

**Design (require small decisions, no strategic call):**
- D1. **Expand interaction model (design-lens C1).** F1 says "tap to expand" but the doc doesn't pick between sheet, inline expand, or Settings-list-as-expand. Pick one. Recommendation: inline expand on Home cell + Settings → Receipts list as the historical view (two surfaces, no modal sheet — reduces visual chrome).
- D2. **Past-receipt snapshot vs. live (design-lens C2).** Settings → Receipts list cannot be built without this decision. When the user views a past week's receipt, is it frozen at the moment the period closed (snapshot), or does it re-render with current data? Recommendation: **snapshot at period close** — matches Hevy/FKT external research pattern, preserves "this is what was true then" honesty, and is what makes the receipt feel like an artifact rather than a dashboard.
- D3. **Empty/thin-data state (design-lens C3).** The founder's D130 cadence sits in the thin-data range. Receipt must work when there are 0–1 training sessions in the period. Recommendation: explicit "no training this period — that's fine" affirmative state, not a blank/error state. Add to R2 or as a new R-ID.
- D4. **`BlockFocus` state machine (design-lens H2).** Define states: never-set, just-set (within X minutes — undoable), persisted, stale (set N weeks ago), explicitly-cleared. Define edit semantics: editable any time vs. locked after period close. Recommendation: editable any time (no lock), no "stale" state in v1 (just shows when it was set), no expiry (user clears explicitly or replaces).
- D5. **Suggestion-sentence register + receipt-specific anti-pattern list (design-lens H3).** R13's cited courtside-copy contract is drill-card-shaped; only the ≤45-word ceiling and observe/reinforce/question register transfer cleanly to aggregate receipt copy. Add a receipt-specific anti-pattern list to the doc (4–6 items: "no number without qualifier," "no percentages," "no comparative adverbs," "no streak language," "no goal-vs-actual framing," "no `you should` imperatives — use `worth checking` / `consider` / questions").
- D6. **Free-text `BlockFocus` → `SkillFocus` enum bridge (feasibility F4).** The receipt's R6 says "anchors to BlockFocus where applicable." But BlockFocus is free-text and SkillFocus is a closed enum. How does the rule layer detect that "platform angle in receive" maps to `pass`? Recommendation: simple keyword detection (a small synonym table — still rule-based, still audit-able) OR accept that BlockFocus stays free-text and R6's "anchored suggestion" only fires when the BlockFocus contains a `SkillFocus` enum word verbatim. Pick one explicitly.
- D7. **R3 "charts behind a tap" door (scope-guardian).** R3 forbids charts on the entry surface but permits them behind a tap. Scope-guardian argues this leaves a feature door open that should be closed in v1 — "no gamification (yet)" suggests trend visualization at all is too soon. Recommendation: close the door — v1 has no charts anywhere, not even behind a tap. Re-open in v2 if founder use surfaces real demand.

## What this synthesis does NOT do

- Does not edit the source ideation docs (`2026-05-27-m002-directions-ideation.md`, `2026-05-27-plan-and-adaptation-system-seed.md`). Those remain as the upstream context.
- Does not pre-resolve the strategic-shape fork (S3). The doc itself will carry the fork forward as `Resolve Before Planning` for explicit founder decision.
- Does not re-dispatch any reviewer. Re-running `ce-doc-review` against the revised doc is offered as the next step after v2 lands.

## Path A revision plan for the requirements doc

The v2 of `docs/brainstorms/2026-05-27-m002-receipt-training-only-requirements.md` should:

1. **Address S1** — add Key Decision and R-ID for cohort-evidence dual-read; revise the "JSON export covers it" justification (it doesn't, per S1).
2. **Address S2** — replace cadence default with event-anchored; delete R8 parenthetical; revise Decision 4 narrative; add R14.
3. **Address S3** — add `Resolve Before Planning` outstanding question naming the three strategic-shape alternatives + the reviewer arguments distilled in 4–6 lines each. Do NOT pre-resolve.
4. **Apply M1–M7** — all coherence mechanical fixes.
5. **Apply D1–D7** — all design fixes, with the recommendations above embedded as initial defaults open to revision at plan-time.
6. **Add R-IDs as needed** (R14 for cadence, R15 for surface location, plus any new R-IDs from S1 cohort-evidence and from D5 anti-pattern list).
7. **Update Dependencies/Assumptions** if any of the above introduces new dependencies.
8. **Update the Finalization Checklist mental pass** — verify no requirement depends on something out of scope; verify all decisions land in requirements.

After v2, re-running `ce-doc-review` (or at least re-running adversarial + coherence as the two with the most CRITICAL findings) is the recommended verification pass.

---

## Round 2 — `ce-doc-review` verification pass on v2 (2026-05-27, same day)

Round 2 fired full `ce-doc-review` against v2. Same 6 personas (security-lens excluded per activation criteria — local-first PWA, no auth/PII/external APIs/payments). `safe_auto` fixes applied to v2.1; gated/manual findings appended to the requirements doc's Outstanding Questions for founder decision.

### Round-2 reviewer summary

| Reviewer | Findings | Severity | Round-1 landing verification (R30) |
|---|---|---|---|
| Adversarial | 11 | 2 P0, 7 P1, 2 P2 | All 15 round-1 applied items landed; no failed-landings |
| Product-lens | 7 | 5 P1 (anchor 75), 2 advisory (anchor 50) | S1 + S2 landed cleanly; #2 (cohort SC) and #5 (dashboard-shaped) only partially landed; #6 (BlockFocus overclaim) partially landed |
| Scope-guardian | 4 | 3 simplification (anchor 65–70), 1 advisory | R3/Decision 7, R8, BlockFocus→SkillFocus bridge all landed; no new max-cut targets — cohort dual-read (R16+R17) deemed v1-justified, not speculative substrate |
| Feasibility | 5 | 2 P0/100, 2 P1/75, 1 P2/50 advisory | Cited concrete codebase verifications; R10/R4b/R16 verified clean |
| Coherence | 10 | 2 P0/100 safe_auto, 1 P1 gated_auto, 3 P1 manual, 1 P1 safe_auto, 3 advisory | M1–M6 all landed cleanly |
| Design-lens | 11 | 2 P0/100, 6 P1/75, 3 advisory | D1, D2, D6 cleanly landed; D3/D4/D5 landed structurally with new follow-on gaps |
| **Total** | **~48** | **7 P0, 18 P1, ~23 P2/advisory** | All 15+ round-1 applied items verified landed |

### Round-2 convergent themes

**Theme A — v2 lints its own examples and fails (P0/100).** Multiple reviewers converged: AE1's "Set is the longest gap" uses a superlative (R13b only bans comparatives, not superlatives or soft deadlines like "if you train this week"). AE2's "1 of 2 receive-aligned sessions so far this block" directly violates R13b item 5 (goal-vs-actual framing). AE2 also presupposes the synonym map that AE7 explicitly defers. **Resolution in v2.1:** safe_auto AE1/AE2 rewrites applied; gated finding on R13b list extensions appended to Outstanding Questions.

**Theme B — Load-bearing terms undefined (P0).** "Receipt period" used 4× but never defined (R2/R4b/R16); "cohort decision" load-bearing in 7+ places but the actual question never specified; R4b's thin-data state is unreachable under R14's event-anchored regen (internal contradiction). **Resolution in v2.1:** appended as Resolve Before Planning items for founder decision.

**Theme C — Codebase-pattern conflicts (P0/100).** Feasibility verified two structural conflicts: R17 understates the export-contract change (`schemaVersion: 4` literal type, tests pin exact key set, founder replay scripts named in comments); R15's "top-of-list addition" conflicts with the codified HomeScreen Resume single-action rule. **Resolution in v2.1:** both appended as Resolve Before Planning items.

**Theme D — Resolve Before Planning §1 framing asymmetric (P1).** Alt #1 (current shape) written in detail; alts #2/#3 in summary; v2's structural investment in alt #1 (R16/R17/F4/AE8/Decision 6) pre-loads the founder's choice via sunk-cost momentum; paragraph-per-alternative hampers comparison. **Resolution in v2.1:** appended as a presentation-fix item to Resolve Before Planning (re-balance alternative detail + convert to comparison table).

### v2.1 safe_auto fixes applied

- **AE1 rewrite:** removed "longest" superlative + "if you train this week" soft deadline. Now reads: "Set hasn't run in 4 weeks — worth considering for the next session." Added illustrative-not-final qualifier.
- **AE2 rewrite:** removed "1 of 2 receive-aligned" goal-vs-actual framing. Now reads: "Pass: 1 session aligned with your block focus." Added synonym-map-or-verbatim acknowledgment.
- **Schema field list normalization:** F4 and AE8 field lists now match R16's canonical list (suggestion-fired-rule-id-or-null, period-start/end timestamps, sessions-included-by-id).

### v2.1 gated/manual findings appended to requirements doc Outstanding Questions

Appended as a new `### From 2026-05-27 round-2 review (Resolve Before Planning)` subsection (8 items, each citing the reviewer that raised it):

1. Define "receipt period" (coherence + adversarial — blocks R16 planning)
2. Define "cohort decision" question (adversarial + product-lens — R16 schema currently arbitrary)
3. Resolve R4b vs R14 contradiction (adversarial + coherence — three resolution options named)
4. R13b list extensions: superlatives, soft deadlines, exclamations, emoji (design-lens + coherence)
5. R15 cell behavior when Resume is primary (feasibility F3 — codified HomeScreen rule conflict)
6. R17 export-contract change acknowledgment (feasibility F1 — three-way coordinated change)
7. Resolve Before Planning §1 re-balance + table format (product-lens + design-lens — asymmetric framing)
8. Home → Settings → Receipts affordance (design-lens F6 — A1 reflection-read structurally broken)

Plus 6 items appended to `### Deferred to Planning`:

- R14 implementation hook choice (feasibility F2 — extend submitReview tx vs lazy-on-Home-read vs fire-and-forget)
- Dexie v6→v7 + export schemaVersion 4→5 coupling (feasibility F4)
- BlockFocus clear/edit affordance (design-lens)
- Per-drill trend rendering pattern (design-lens — R2(c) vs R3 tension)
- A3 actor evaluation (product-lens advisory)
- Decision 3 BlockFocus rationale honesty (product-lens advisory — Cohen's d cite measures different primitive)

### Net read after round 2

v2.1 is plan-ready for the **current-shape** alternative (#1 in Resolve Before Planning §1) if the founder picks it, with the 8 Resolve-Before-Planning items as explicit planning prerequisites and the 6 Deferred items as planning-time resolutions. The strategic-shape fork itself remains unresolved by orchestrator design — that's a founder call, and round 2 confirmed the fork's three alternatives are real options (no reviewer collapsed it).

**Recommendation to founder:** before any further work, read this synthesis + the requirements doc v2.1 + the parked plan-and-adaptation seed. Pick one of the three alternatives in Resolve Before Planning §1. If alternative #1 is picked, the 8 round-2 items become the pre-planning resolution list. If alt #2 (max-cut) or alt #3 (plan-system slice) is picked, v2.1 gets rewritten or replaced before planning.

A third `ce-doc-review` round is not recommended — round-2 verified round-1's edits landed, and the remaining findings are either applied (safe_auto) or appropriately surfaced for founder decision. Further rounds would diminish returns.
