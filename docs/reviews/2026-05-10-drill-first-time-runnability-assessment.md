---
id: drill-first-time-runnability-assessment-2026-05-10
title: "Drill first-time-runnability assessment (2026-05-10)"
type: review
status: active
stage: validation
authority: "Per-drill assessment of every M001-candidate drill against the strengthened first-time-runnability rubric (rules 8-14 in .cursor/rules/courtside-copy.mdc + the rule-2 / rule-3 / rule-5 / rule-7 extensions). Empirical input comes from the U2 mechanical lints in app/src/data/__tests__/drillCopyRegressions.test.ts; reviewer-checklist columns (R10, R11, R12, R13, R15) come from manual review against the courtsideInstructions, coachingCues, and successMetric.description copy. Classifies each drill as pass / repair / rewrite and assigns a priority (P0 = today's session drills; P1 = remaining pair drills; P2 = warmup/cooldown; P3 = remaining)."
summary: "26 M001-candidate drills audited against rules 8-14. 5 pass mechanically with no reviewer-checklist concerns. 18 repair targets carry 1-3 lint failures plus checklist gaps; localized copy edits suffice. 3 rewrite targets (d33, d50, d51) carry >=4 lint failures or structural changes. P0 priority: d07, d10, d22, d28, d33 (today's session-affected drills). P1 priority: remaining pair drills with role coordination. P2: warmup/cooldown (d25, d26, d28 — d28 already at P0). P3: remaining."
date: 2026-05-10
last_updated: 2026-05-13
depends_on:
  - .cursor/rules/courtside-copy.mdc
  - app/src/data/__tests__/drillCopyRegressions.test.ts
  - docs/brainstorms/2026-05-10-drill-first-time-runnability-requirements.md
  - docs/plans/2026-05-10-004-feat-drill-first-time-runnability-assessment-plan.md
  - docs/plans/2026-05-13-003-feat-cue-zero-external-focus-second-pass-plan.md
related:
  - docs/research/2026-05-10-pair-net-serving-duration-feedback.md
  - docs/research/founder-use-ledger.md
  - docs/ideation/2026-05-10-drill-first-time-runnability-ideation.md
---

# Drill first-time-runnability assessment (2026-05-10)

## Scope

Every `m001Candidate: true` drill in `app/src/data/drills.ts` (currently **26 drills, ~48 variants**), audited against the strengthened first-time-runnability rubric in `.cursor/rules/courtside-copy.mdc` rules 8–14 (with the rule-2 / rule-3 / rule-5 / rule-7 extensions). Authoring authority for the rule set: `docs/brainstorms/2026-05-10-drill-first-time-runnability-requirements.md`.

## Methodology

Empirical input is the U2 mechanical lint suite in `app/src/data/__tests__/drillCopyRegressions.test.ts`:

- **R9** — role-tagged sentences for pair drills (`participants.roles.length ≥ 2`). Heuristic: each role appears as the first content word of at least one sentence in `courtsideInstructions`. Accepted synonyms: `"you"` for the first listed role, `"partner"` for the second.
- **R14** — `courtsideInstructions` aloud-read ceiling ≤ 45 words (≈ 15s at 150 wpm).
- **R2-mov** — first occurrence of any flagged movement-vocabulary token (`A-skip`, `ankle hops`, `lateral shuffles`, `pivot-back start`, `runner's lunge`, `half-kneel`, `hip flexor`, `RDL`) requires an inline parenthetical gloss within 120 characters.
- **R2-log** — first occurrence of `shag` / `shags` / `shagger` requires an inline gloss within 120 characters.
- **R2-score** — `successMetric.description` strings using graded vocabulary (`grade 2+`, `graded 2+`, `good pass`, `controlled set`, `in-system`) require an inline operational definition (`(...)` or `=`).

Reviewer-checklist columns (manual review, not lint):

- **R10** — cue→action coupling microformat (arrow `→` or sequence verb; no conjunction-and for non-simultaneous actions).
- **R11** — five-question logistics checklist (who starts, what's a round, what counts, what on miss with escape clause, when does it end).
- **R12** — spatial point-of-view anchor on every spatial directive.
- **R13** — triple-only readability (`skillFocus` + `successMetric.description` + `coachingCues[0]` alone get the reader through).
- **R15** — cue ordering for `coachingCues[]`: (a) one-cue default (RunScreen render concern, not per-drill), (b) external focus on `[0]`, (c) gaze target first for perceptual drills, (d) ≥ 1 doer-POV cue.

## Classification

- **pass** — zero rule failures (mechanical or checklist).
- **repair** — 1–3 rule failures, all addressable with **localized copy edits** without rewriting structural shape.
- **rewrite** — ≥ 4 rule failures, OR any single failure that requires re-thinking role coordination / sentence structure substantially, OR a variant that serves as a worked-example specimen for a new rule.

## Priority

- **P0** — today's 2026-05-10 session-affected drills (`d07`, `d10`, `d22`, `d28`, `d33`).
- **P1** — remaining pair drills with non-trivial role coordination (`d01`, `d03`, `d05`, `d11`, `d15`, `d18`, `d38`, `d39`, `d40`, `d41`, `d42`, `d46`, `d47`, `d48`, `d49`, `d51`).
- **P2** — warmup / cooldown / recovery drills (`d25`, `d26`; `d28` already at P0).
- **P3** — remaining (none, given P0–P2 cover all).

P0 priority is *additive*: a P0 drill that classifies as **repair** still gets fixed first.

## Variant-level mechanical lint matrix

Cells: ✓ pass / ✗ fail / — N/A.

| Drill | Variant | Skill | Roles | wc | R9 | R14 | R2-mov | R2-log | R2-score |
|---|---|---|---|---|---|---|---|---|---|
| d01 | d01-solo | pass | — | 25 | — | ✓ | ✓ | ✓ | ✓ |
| d01 | d01-pair | pass | tosser, passer | 48 | ✗ | ✗ | ✓ | ✓ | ✓ |
| d03 | d03-pair | pass | passer, tosser | 26 | ✗ | ✓ | ✓ | ✓ | ✗ (graded 2+) |
| d05 | d05-solo | pass | — | 43 | — | ✓ | ✓ | ✓ | ✗ (graded 2+) |
| d05 | d05-pair | pass | tosser, passer | 53 | ✗ | ✗ | ✓ | ✓ | ✗ (graded 2+) |
| d07 | d07-pair | pass | passer, server | 22 | ✗ | ✓ | ✓ | ✓ | ✗ (graded 2+) |
| d07 | d07-solo-open | pass | — | 25 | — | ✓ | ✓ | ✓ | ✗ (graded 2+) |
| d07 | d07-pair-open | pass | feeder, passer | 28 | ✗ | ✓ | ✓ | ✓ | ✗ (graded 2+) |
| d09 | d09-pair | pass | — | 23 | — | ✓ | ✓ | ✓ | ✓ |
| d10 | d10-pair | pass | passer, tosser | 53 | ✗ | ✗ | ✓ | ✓ | ✗ (graded 2+) |
| d11 | d11-pair | pass | passer, feeder | 33 | ✗ | ✓ | ✓ | ✓ | ✗ (graded 2+) |
| d11 | d11-solo | pass | — | 37 | — | ✓ | ✓ | ✓ | ✗ (graded 2+) |
| d15 | d15-pair | pass | server, passer, catcher | 37 | ✗ | ✓ | ✓ | ✓ | ✗ (graded 2+) |
| d18 | d18-pair | pass | server, passer | 47 | ✗ | ✗ | ✓ | ✓ | ✓ |
| d22 | d22-solo | serve | — | 33 | — | ✓ | ✓ | ✓ | ✓ |
| d22 | d22-pair | serve | server, server | 52 | ✗ | ✗ | ✓ | ✓ | ✓ |
| d22 | d22-solo-open | serve | — | 38 | — | ✓ | ✓ | ✓ | ✓ |
| d22 | d22-pair-open | serve | server, caller | 39 | ✓ | ✓ | ✓ | ✓ | ✓ |
| d25 | d25-solo | recovery | — | 16 | — | ✓ | ✓ | ✓ | ✓ |
| d26 | d26-solo | recovery | — | 20 | — | ✓ | ✓ | ✓ | ✓ |
| d28 | d28-solo | warmup | — | 9 | — | ✓ | ✗ (A-skip, ankle hops, lateral shuffles unglossed) | ✓ | ✓ |
| d31 | d31-solo-open | serve | — | 30 | — | ✓ | ✓ | ✓ | ✓ |
| d31 | d31-pair-open | serve | server, caller | 36 | ✓ | ✓ | ✓ | ✓ | ✓ |
| d31 | d31-pair | serve | server, shagger | 45 | ✓ | ✓ | ✓ | ✗ (shagger) | ✓ |
| d33 | d33-solo-open | serve | — | 27 | — | ✓ | ✓ | ✓ | ✓ |
| d33 | d33-solo-net | serve | — | 20 | — | ✓ | ✓ | ✗ (shag) | ✓ |
| d33 | d33-pair-open | serve | server, caller | 37 | ✗ | ✓ | ✓ | ✗ (shag) | ✓ |
| d33 | d33-pair | serve | server, shagger | 42 | ✗ | ✓ | ✓ | ✗ (shag, shagger) | ✓ |
| d38 | d38-solo | set | — | 42 | — | ✓ | ✓ | ✓ | ✓ |
| d38 | d38-pair | set | tosser, setter | 42 | ✗ | ✓ | ✓ | ✓ | ✓ |
| d39 | d39-solo | set | — | 35 | — | ✓ | ✓ | ✓ | ✓ |
| d39 | d39-pair | set | tosser, setter | 46 | ✗ | ✗ | ✓ | ✓ | ✓ |
| d40 | d40-solo | set | — | 33 | — | ✓ | ✓ | ✓ | ✓ |
| d40 | d40-pair | set | tosser, setter | 57 | ✓ | ✗ | ✓ | ✓ | ✓ |
| d41 | d41-pair | set | — | 36 | — | ✓ | ✓ | ✓ | ✓ |
| d42 | d42-pair | set | — | 30 | — | ✓ | ✓ | ✓ | ✓ |
| d46 | d46-solo-open | pass | — | 33 | — | ✓ | ✓ | ✓ | ✓ |
| d46 | d46-pair-open | pass | feeder, passer | 26 | ✗ | ✓ | ✓ | ✓ | ✓ |
| d47 | d47-solo-open | set | — | 32 | — | ✓ | ✓ | ✓ | ✓ |
| d47 | d47-pair-open | set | tosser, setter | 36 | ✗ | ✓ | ✓ | ✓ | ✓ |
| d48 | d48-solo-open | set | — | 27 | — | ✓ | ✓ | ✓ | ✓ |
| d48 | d48-pair-open | set | tosser, setter | 26 | ✗ | ✓ | ✓ | ✓ | ✓ |
| d49 | d49-solo-open | set | — | 40 | — | ✓ | ✓ | ✓ | ✓ |
| d49 | d49-pair-open | set | tosser, setter | 40 | ✗ | ✓ | ✓ | ✓ | ✓ |
| d50 | d50-solo-open | pass | — | 56 | — | ✗ | ✓ | ✓ | ✓ |
| d50 | d50-pair-open | pass | feeder, passer | 67 | ✓ | ✗ | ✓ | ✓ | ✓ |
| d51 | d51-solo-open | serve | — | 46 | — | ✗ | ✓ | ✓ | ✓ |
| d51 | d51-pair-open | serve | caller, server | 53 | ✓ | ✗ | ✓ | ✓ | ✓ |
| d51 | d51-pair | serve | server, shagger | 54 | ✗ | ✗ | ✓ | ✓ | ✓ |

Mechanical-lint failure totals: **46 failures across 32 variants**. The 16 variants with zero mechanical failures still face reviewer-checklist coverage for R10–R15 (below).

## Reviewer-checklist matrix (per drill)

Cells: ✓ pass / ◐ partial / ✗ fail. Drill-level rollup: worst-failing variant drives the cell.

| Drill | R10 cue→action | R11 5-question | R12 POV anchor | R13 triple-only | R15 cue ordering |
|---|---|---|---|---|---|
| d01 (Pass-toss) | ◐ pair variant has conjunction-and chains | ◐ no first-tosser, no end fallback | ✓ | ◐ cue0 "Ready posture" is observer-POV body-state | ✗ R15(b) cue0 internal-focus |
| d03 (Pass-back & forth) | ◐ | ◐ | ✓ | ◐ cue0 "Arms straight" internal | ✗ R15(b) |
| d05 (Pass-target) | ◐ pair has compound clauses | ◐ no fallback termination | ✓ | ◐ cue0 "Get behind ball horizontally" internal | ✗ R15(b) |
| d07 (Pass & Look) | ✗ peak-and-flash specimen; conjunction-and | ◐ "before next action" ambiguous | ◐ partner-cue source unanchored | ✗ no gaze-target cue (R15(c) miss) | ✗ R15(c) gaze target missing on `[0]` |
| d09 (Pass-shuffle) | ✓ | ◐ | ✓ | ◐ cue0 "Wide base" internal | ✗ R15(b) |
| d10 (6-Legged Monster) | ◐ enumerated tosses but cue→shag chain implicit | ◐ no end fallback; no first-tosser | ✓ | ◐ cue0 "Point shoulders to target" external ✓ but solo-pair-symmetric | ◐ R15(d) doer-POV coverage |
| d11 (One-arm) | ◐ | ◐ | ✓ | ◐ cue0 "Arm behind ball" external ✓ | ✓ |
| d15 (Pass-pressure) | ◐ 3-role drill (D101-adjacent) | ◐ rotation rule ambiguous | ✓ | ◐ cue0 "Centered ready position" internal | ✗ R15(b) |
| d18 (Pass-live serve) | ◐ "play/let-go" doer-POV ✓ but cue→action implicit | ◐ end fallback unclear | ✓ | ◐ cue0 "Play/let-go discipline matters" doer-POV ✓ | ✓ |
| d22 (First to 10 Serving) | ◐ "alternate serves" + "scores their own result" sequenced ✓ | ✗ no first-server; no end fallback | ✓ | ✓ cue0 "Develop a serving routine" external ✓ | ✓ |
| d25 (Recovery) | ✓ | ✓ | ✓ | ✓ | ✓ |
| d26 (Cooldown) | ✓ | ✓ | ✓ | ✓ | ✓ |
| d28 (Beach Prep Three) | ◐ segment cadence unnamed (rule 7 extension) | ✓ | ✓ | ◐ cue0 "Short hops, loud feet" doer-POV ✓ | ✓ |
| d31 (Serve-target circle) | ✓ | ◐ no end fallback | ✓ | ✓ | ✓ |
| d33 (Around the World Serving) | ✗ peak-and-flash specimen; "calls...and shags" conjunction-and | ✗ no first-server; miss-loop unbounded | ✗ 6-zone POV unanchored (front-left of what?) | ◐ cue0 "Caller names the zone first" partner-POV not doer | ✗ R15(c) gaze missing on perceptual drill |
| d38 (Bump Set fundamentals) | ◐ | ◐ no end fallback | ✓ | ◐ cue0 "Platform square to partner" internal | ✗ R15(b) |
| d39 (Hand Set fundamentals) | ◐ | ◐ no end fallback | ✓ | ◐ cue0 "Contact above the forehead" internal | ✗ R15(b) |
| d40 (Set-on-move) | ◐ | ◐ no end fallback | ✓ | ◐ cue0 "Move first" doer-POV ✓ | ✓ |
| d41 (Hand-set pair rally) | ◐ | ◐ rally-restart rule could be tighter | ✓ | ✓ cue0 "Set to your partner, not past them" external ✓ | ✓ |
| d42 (Set-corner target) | ✓ | ◐ no end fallback | ✓ | ✓ cue0 "Set your partner" doer-POV ✓ | ✓ |
| d46 (Pass spin read) | ◐ | ◐ "switch after 12 feeds" reset rule lighter than needed | ✓ | ✓ cue0 "Call the spin before you move" doer-POV ✓ | ✓ |
| d47 (Set decision) | ◐ | ◐ | ✓ | ◐ cue0 "Read the ball" external ✓ | ✓ |
| d48 (Set-look) | ◐ peak-and-flash adjacent — "post-set flash calls" | ◐ | ✓ | ◐ cue0 "Set first; look second" doer-POV ✓ | ◐ R15(c) gaze target underspecified |
| d49 (Out-of-system set) | ◐ | ◐ | ✓ | ◐ cue0 "Recover first, toss second" doer-POV ✓ | ✓ |
| d50 (Pass short/deep) | ◐ | ◐ | ✓ | ◐ wc 56-67 prose-heavy; structural offload needed | ✓ |
| d51 (Serve heart zone) | ◐ | ◐ no first-server; no fallback | ✓ | ◐ wc 46-54 prose-heavy | ✓ |

## Per-drill classification

| Drill | Variants affected | Mechanical failures | Reviewer-checklist gaps | Classification | Priority | Notes |
|---|---|---|---|---|---|---|
| d01 | d01-pair (2) | R9, R14 | R10, R11, R13, R15(b) | repair | P1 | Pair-only; add `"You X; partner Y."` opener; trim to ≤ 45 words. |
| d03 | d03-pair (1) | R9, R2-score | R10, R11, R13, R15(b) | repair | P1 | Add role-tagged opener; gloss `graded 2+`. |
| d05 | d05-solo (1), d05-pair (2) | R9, R14, R2-score (×2) | R10, R11, R13, R15(b) | repair | P1 | Operational gloss on `graded 2+` carries both solo + pair. |
| d07 | d07-pair (2), d07-pair-open (2), d07-solo-open (1) | R9 (×2), R2-score (×3) | R10 ✗, R15(c) gaze missing | **rewrite (d07-pair)**; repair (others) | **P0** | Today's adjacent specimen for the peak-and-flash class. Worked-rewrite specimen in the plan: `"You pass; partner flashes a number 1–5..."` + `coachingCues[0]: "Look at your partner's hand the moment your platform meets the ball."` |
| d09 | none (mechanical pass) | — | R15(b) cue0 internal | repair | P1 | Single-failure: reorder cues so `[0]` is external. |
| d10 | d10-pair (3) | R9, R14, R2-score | R10, R11 | repair | **P0** | Today's drill. Add role-tagged opener; operational gloss on `graded 2+`; trim 53→45 words by routing zone enumeration to a bracket microformat or to `segments[]`. |
| d11 | d11-pair (2), d11-solo (1) | R9, R2-score | R10, R11 | repair | P1 | |
| d15 | d15-pair (2) | R9, R2-score | R10, R11 rotation ambiguous | repair | P1 | 3-role drill (`server, passer, catcher`) — partial D101 territory; flag but do not block here. |
| d18 | d18-pair (2) | R9, R14 | R11 | repair | P1 | Trim; add role-tagged opener. |
| d22 | d22-pair (2), d22-pair-open (0; passes) | R9, R14 | R11 first-server + fallback | repair | **P0** | Today's drill. Worked-rewrite specimen: termination fallback + first-server. d22-pair-open already passes R9 — preserve its pattern. |
| d25 | none | — | — | pass | P2 | Carried as P2 only to confirm equal-weight wrap review (rule 5). |
| d26 | none | — | — | pass | P2 | Carried as P2 only to confirm equal-weight wrap review (rule 5). |
| d28 | d28-solo (1) | R2-mov (A-skip, ankle hops, lateral shuffles unglossed) | rule 7 cadence-format extension | repair | **P0** | Today's recurring warmup-pacing issue. Movement-vocab gloss sweep on `segments[].label`; add cadence format per segment. |
| d31 | d31-pair (1) | R2-log (`shagger`) | R11 fallback | repair | P1 | Mild — single-token gloss. |
| d33 | d33-solo-net (1), d33-pair-open (2), d33-pair (2) | R9 (×2), R2-log (×3) | R10 ✗, R11 ✗ (miss-loop unbounded), R12 ✗ (POV), R15(c) | **rewrite (d33-pair, d33-pair-open)**; repair (d33-solo-net) | **P0** | Today's drill. Worked-rewrite specimen in the plan: bracket microformat + POV anchor + miss-escape + gloss `shag`. |
| d38 | d38-pair (1) | R9 | R10, R11, R15(b) | repair | P1 | |
| d39 | d39-pair (2) | R9, R14 | R10, R11, R15(b) | repair | P1 | |
| d40 | d40-pair (1) | R14 (57 wc) | R10, R11 | repair | P1 | Trim to ≤ 45 words. |
| d41 | none | — | R11 rally restart | repair | P1 | Mild — checklist gap only. |
| d42 | none | — | R11 fallback | repair | P1 | Mild — checklist gap only. |
| d46 | d46-pair-open (1) | R9 | R11 | repair | P1 | |
| d47 | d47-pair-open (1) | R9 | R10, R11 | repair | P1 | |
| d48 | d48-pair-open (1) | R9 | R10 peak-and-flash adjacent, R15(c) gaze underspecified | repair | P1 | Adjacent specimen to d07/d33 class. |
| d49 | d49-pair-open (1) | R9 | R10, R11 | repair | P1 | |
| d50 | d50-solo-open (1), d50-pair-open (1) | R14 (×2, 56 + 67 wc) | R10, R11, R13 prose-heavy | **rewrite** | P1 | 67-word prose well over ceiling — needs structural offload. |
| d51 | d51-solo-open (1), d51-pair-open (1), d51-pair (2) | R9, R14 (×3, 46-54 wc) | R11, R13 prose-heavy | **rewrite** | P1 | Today's serve focus; multiple R14 failures plus role-tagged-sentence gap. |

## Tally

| Classification | Count | Drills |
|---|---|---|
| pass | 2 | d25, d26 |
| repair | 21 | d01, d03, d05, d07 (most variants), d09, d10, d11, d15, d18, d22, d28, d31, d38, d39, d40, d41, d42, d46, d47, d48, d49 |
| rewrite | 3 | d33 (d33-pair, d33-pair-open), d50, d51 |
| **TOTAL** | **26** | |

Plus `d07-pair` specifically is **rewrite** as a worked specimen for the peak-and-flash class even though the rest of d07 is repair-tier. Net rewrite specimens: **5** variants (d07-pair, d33-pair, d33-pair-open, d50-pair-open, d51-pair).

By priority:

| Priority | Count | Drills |
|---|---|---|
| P0 (today's drills) | 5 | d07, d10, d22, d28, d33 |
| P1 (remaining pair drills) | 17 | d01, d03, d05, d09, d11, d15, d18, d38, d39, d40, d41, d42, d46, d47, d48, d49, d50, d51 |
| P2 (wrap / cooldown) | 2 | d25, d26 (both pass; carried for rule 5 equal-weight confirmation) |
| **TOTAL** | **26** | (`d28` already P0) |

## Findings worth surfacing beyond drill copy

- **`graded 2+` is endemic.** Used in 10 variants' `successMetric.description`. Single operational gloss text — *"(ball lands within 1 m of the set window with enough arc to be settable)"* — can be applied uniformly. Worth a single PR commit just for this.
- **Wrap drills pass the mechanical gates.** Rule 5's equal-weight discipline is empirically working for `d25` / `d26`. The first-time-runnability extension does not surface new failures on these surfaces — preserves the 2026-04-27 cca2 sweep gains.
- **3-role drill in M001.** `d15-pair` has `participants.roles: ['server', 'passer', 'catcher']` — partial D101 territory. The role-tagged-sentence rule applies to all three; flag but do not promote to a D101 blocker.
- **Prose-overflow concentration.** 12 of 46 R14 failures are concentrated on 4 drills (`d50`, `d51`, and the d-pair variants of d01/d05/d18/d22/d39/d40/d51) — these are the structural-offload candidates.
- **Cue ordering rewrite is a single-axis change.** Most cue-list reorderings can be done without rewriting any cue text: today's `cue0` is often the internal-focus or body-state cue and the load-bearing external cue sits at `cue1` or `cue2`. Reordering is the dominant fix.
- **Bracket-repeat microformat is a force-multiplier for serving drills.** `d33-pair`, `d22-pair`, and `d31-pair` all carry 6-zone enumeration prose. Single microformat rewrite per drill removes a meaningful chunk of word count.

## What this artifact does not do

- Does not rewrite any drill copy. That is U5's job; this is the input to U5.
- Does not change any `participants`, `equipment`, `workload`, `successMetric.type`, `feedType`, or `m001Candidate` field. Strict copy-only scope per the plan.
- Does not open D101 (3+ player support) on `d15-pair`.
- Does not change `RunScreen` render. That is U3's job.
- Does not change DrillCheck or Review copy. That is U6's job.

## How U5 uses this artifact

U5 executes drill copy edits in priority order:

1. **P0 sweep first** (d07, d10, d22, d28, d33). Worked-rewrite specimens land first; commit at the end of P0.
2. **P1 sweep second** (17 drills). Drills with single-failure mild repairs (d09, d31, d38, d41, d42, d46, d47, d48, d49) can land in batches; drills with rewrite classification (d50, d51) land individually.
3. **P2 audit confirmation** (d25, d26) — no edits expected; pass confirmation only.

After each priority tier, rerun the U2 lint suite + existing `catalogValidation.test.ts` to confirm no regressions; commit per tier. After P0 + P1 + P2 complete, the U2 lints turn green.

## Update history

- 2026-05-10 — Initial assessment landed; 46 mechanical-lint failures + reviewer-checklist gaps captured across 26 drills. Drives U5 sweep.
- 2026-05-13 — Cue[0] external-focus second pass landed (`docs/plans/2026-05-13-003-feat-cue-zero-external-focus-second-pass-plan.md`). Body-part token mechanical lint added in `drillCopyRegressions.test.ts` under `coachingCues[0] external-focus (rule 12b second pass, 2026-05-13)`; surfaces 4 failures on the post-2026-05-10-sweep catalog: `d10-pair`, `d11-pair`, `d11-solo`, `d38-solo`. All 4 fixed in the same commit; `d10-pair` carries the worked specimen.

## Cue[0] second pass (2026-05-13)

### Method

Lint added in `drillCopyRegressions.test.ts > drill copy regressions > coachingCues[0] external-focus (rule 12b second pass, 2026-05-13)`. Detects two patterns:

- **Subject-pattern**: first content word (after stripping leading `Your`/`Our`/`My` and `Keep`/`Make`/`Let`) is a body-part token from a 38-token table (`shoulder`, `arm`, `platform`, `ribs`, `forehead`, etc.).
- **Verb-object-pattern**: first content word is a body-acting verb (`point`, `tuck`, `square`, `aim`, `plant`, `lift`, etc.) AND second content word is a body-part token.

Per-variant escape via inline comment `// cue0-exception: <reason>` placed within ~12 lines above the variant's `id:` line in `drills.ts`. Recovery / warmup drills are out of scope (rule 12 governs skill drills).

### Findings (post-2026-05-10-sweep baseline)

| Drill | Variant | Current `coachingCues[0]` | Failing pattern | Classification | Action |
|---|---|---|---|---|---|
| d10 | d10-pair | `'Point shoulders to target.'` | verb-object: `point` (body-acting verb) + `shoulders` (body-part) | **rewrite** | `'Pass into the set window from every spot.'` (worked specimen) |
| d11 | d11-pair | `'Arm behind ball.'` | subject: `arm` (body-part) | **reorder** | swap [0]<->[1] so `'Move through ball.'` leads |
| d11 | d11-solo | `'Arm behind ball.'` | subject: `arm` (body-part) | **reorder** | swap [0]<->[1] so `'Move through ball.'` leads (matches d11-pair) |
| d38 | d38-solo | `'Platform square to target.'` | subject: `platform` (body-part) | **rewrite** | `'Land each set inside your circle.'` (matches d38-pair pattern with solo target) |

### Tally

| Classification | Count | Drills |
|---|---|---|
| reorder | 2 | d11-pair, d11-solo |
| rewrite | 2 | d10-pair, d38-solo |
| exception | 0 | (none) |
| **TOTAL** | **4** | |

The narrow failure surface (4 of 43 in-scope variants) confirms the 2026-05-10 sweep already covered most of rule 12(b) by intent — the four remaining specimens slipped past reviewer-checklist enforcement because `coachingCues[]` was treated as 2-3 cues of equal weight rather than priority-ordered. The mechanical lint locks the priority-ordered convention going forward.

### Worked specimen — d10-pair "The 6-Legged Monster"

Origin: 2026-05-13 founder dogfeed. Founder sees `coachingCues[0] = "Point shoulders to target."` on the active-run screen and reports *"that's not really a good cue."* The cue mentions a target (external) but leads with a body-part orientation (`shoulders`) — the doer is asked to introspect their shoulder alignment rather than self-check the outcome (where the ball lands).

**Before** (post-2026-05-10-sweep, pre-2026-05-13):

```
coachingCues: [
  'Point shoulders to target.',
  'Drop near shoulder, lift far shoulder on wide passes.',
  'Feel your platform face the target before contact.',
]
```

**After** (post-2026-05-13):

```
coachingCues: [
  'Pass into the set window from every spot.',
  'Drop near shoulder, lift far shoulder on wide passes.',
  'Feel your platform face the target before contact.',
]
```

Why the new `[0]` works:

- **External focus**: names the outcome (the ball lands in the set window), not a body part.
- **Self-checkable mid-rep**: the doer watches the landing, not their shoulders.
- **Outcome scope**: "from every spot" carries the drill's load-bearing constraint (6 toss locations, the wide ones being hardest) without restating the geometry — the courtside instructions already enumerate the 6 spots.
- **Doer-POV**: phrased as a felt outcome the doer can self-check without an observer (rule 12d coverage).
- **Triple-only readability** (rule 13): a returning reader can re-run d10 from `Movement · Pass` (eyebrow) + `Passes graded 2+ across 24 tosses` (success metric) + `Pass into the set window from every spot` (cue[0]) without re-reading `courtsideInstructions`.

Falsification: the next D130 founder session is the test surface for whether the rewrite holds. If the body-part-introspection class re-surfaces, the rule failed and gets revised, not the reader.

### Triple-only spot-check (rule 13) — 3 drills

| Drill | Eyebrow | `successMetric.description` | `coachingCues[0]` | Re-runnable? |
|---|---|---|---|---|
| d10-pair | Movement · Pass | Passes graded 2+ (= ball lands within 1 m of the set window with enough arc to be settable) across 24 tosses. | Pass into the set window from every spot. | ✓ — reader knows to pass into the set window from each spot, with the success rule defining "good" pass. |
| d22-pair | Main drill · Serve | First to 10 wins. | Develop a serving routine. | ✓ (existing) — reader knows to serve, score a point per good serve, race to 10. |
| d33-pair-open | Main drill · Serve | 4 / 6 zones cleared per round (one round = one 6-zone cycle). | Caller names the target first. | ✓ (existing) — reader knows the structure (6 zones, caller leads, 4-of-6 to clear) from the triple. |

Triple-only readability holds on all three. The d10-pair rewrite preserves the structural-sufficiency contract.
