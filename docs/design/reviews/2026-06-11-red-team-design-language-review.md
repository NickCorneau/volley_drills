---
id: 2026-06-11-red-team-design-language-review
title: "Red-Team Design-Language Adherence Review (2026-06-11)"
status: active
stage: validation
type: design-review
summary: "Design-track capture of the 2026-06-11 whole-app red team: a code-level adherence audit against the four design contracts plus a live mobile pass at 390×844. Grades: brand/UX B+, Japanese visual direction B−, outdoor courtside brief C, courtside copy A−, live courtside feel B+. One contrast defect verified and fixed same-day (End-session resting state); one live-pass P0 falsified on verification (Setup Recommended chip is a real selectable option); D145 0-b/0-d confirmed as recording states that never shipped (routed to founder); the 14px body floor remains deadlocked on D127's D91 trigger."
authority: "Point-in-time design baseline. Not source of truth on its own. Cites brand-ux-guidelines.md, outdoor-courtside-ui-brief.md, japanese-inspired-visual-direction.md, and courtside-copy.mdc as the governing contracts."
last_updated: 2026-06-11
depends_on:
  - docs/research/brand-ux-guidelines.md
  - docs/research/outdoor-courtside-ui-brief.md
  - docs/research/japanese-inspired-visual-direction.md
  - .cursor/rules/courtside-copy.mdc
related:
  - docs/reviews/2026-06-11-red-team-review.md
  - docs/design/reviews/2026-05-24-agent-e2e-design-critique.md
  - docs/design/reviews/2026-05-25-h1-h2-experiment-revaluation.md
decision_refs:
  - D91
  - D127
  - D130
  - D137
  - D145
  - D153
---

# Red-Team Design-Language Adherence Review (2026-06-11)

## Agent Quick Scan

- Design track of the 2026-06-11 whole-app red team (umbrella capture: `docs/reviews/2026-06-11-red-team-review.md`). Two sub-tracks: a code-level audit of tokens/components against the four design contracts, and a browser-driven live mobile pass at 390×844 on the dev server.
- One verified contrast defect was **fixed same-day** (End-session resting state). One headline live-pass finding was **falsified on verification** and is recorded here so a future pass does not re-surface it.
- Strategic items (D145 phantom states, D127 type-floor deadlock) are **routed, not fixed** — see the umbrella doc's Routing table.

## Method

- **Code audit**: read `app/src/index.css` tokens, `components/ui/` primitives, and screen styling against `brand-ux-guidelines.md`, `outdoor-courtside-ui-brief.md`, `japanese-inspired-visual-direction.md`, and `.cursor/rules/courtside-copy.mdc`; contrast ratios computed from source token values.
- **Live pass**: dev server at 390×844 CSS px, full loop (setup → safety → run → check → transition → review → complete → home). Not a real-device test — no direct sun, no Dynamic Type, no PWA install path; distance-readability claims remain D91-field-gated.
- **Verification pass (same session)**: each P0/P1 candidate re-checked against shipped code and git history before fixing or recording.

## Grades

| Contract | Grade | One-line basis |
| --- | --- | --- |
| `brand-ux-guidelines.md` | B+ | Token discipline largely real; failures are ad-hoc bypasses, not base tokens |
| `japanese-inspired-visual-direction.md` | B− | One-focal-zone holds on run-flow screens; Home has focal competition |
| `outdoor-courtside-ui-brief.md` | C | Least-honored contract: 14px body floor (D127-held), 12px grid labels, small secondary run text |
| `.cursor/rules/courtside-copy.mdc` | A− | Copy invariants broadly hold; strongest contract in practice |
| Live courtside feel (390×844) | B+ | Run timer excellent; Setup/Home polish gaps below |

## Findings and dispositions

### Fixed 2026-06-11

- **End-session resting-state contrast (P0).** `RunControls` paused-grid "End session" rendered `text-warning` (#dc2626) on the secondary-button surface at ~4.2:1 under the 4.5:1 AA floor — at 12px (`text-xs` in the 4-action grid), bypassing the exact `text-warning-strong` treatment the 2026-05-24 M1 finding established for Button/Callout/ToggleChip/PainOverrideCard. Fixed by extending the M1 treatment (`text-warning-strong`). The 12px grid-label size itself remains an outdoor-brief gap, held with the D127 cluster below.

### Falsified on verification (do not re-surface)

- **Setup "Recommended" chip semantic mismatch (claimed P0).** The live pass claimed the `Recommended` chip is visually selectable but semantically not a choice. Verified false: `Recommended` is a **real selectable focus option** (`FOCUS_OPTIONS[0]` in `SetupScreen.tsx`, value `recommended`) and the default focus — the four chips (Recommended / Passing / Serving / Setting) are all legitimate selections per the D137-era pre-run spine. The "focus cannot be deselected" contract means *some* chip is always selected, not that `Recommended` is a passive hint. At most a P3 affordance question (does a new user understand `Recommended` is itself a choice?) — founder-session evidence has not flagged it.

### Verified, routed (founder/decision-level)

- **D145 records states that never shipped (P1).** D145 0-b records the Review h1 as left-aligned; shipped code centers it in the flex header (`ReviewScreen.tsx`). D145 0-d records the discard-resume confirm as neutral (`text-text-primary` + faint accent border); shipped code uses `Button variant="danger"` (`ResumePrompt.tsx`), and git pickaxe shows the danger variant dates to the original v0b commit while no commit ever introduced a left-aligned Review h1. Canon mis-records reality at rank-2 authority. Routed: founder amends D145 or directs code to match it — either is a design decision this review must not make unilaterally. **Resolved same-day:** the founder-directed deep pass retracted 0-b/0-d and ratified the shipped states (`D153`; see `2026-06-11-design-language-deep-pass.md`).
- **Outdoor type floor deadlocked (P1).** `--text-body` held at 14px per D127 pending D91 field evidence; D91 is deferred indefinitely, so the outdoor brief's 16px floor is gated on evidence no longer scheduled to arrive. Compounded by 12px safety-consequence copy and the small secondary run text the live pass flagged (cue bullets/instructions below comfortable arm's-length sunlight reading even though the timer passes). Routed: D127's trigger needs a new owner/condition (natural slot: the 2026-07-20 D130 window close).
- **Buried lock-pauses-timer hint (P1).** The most trust-critical line on the Run screen is small gray footer text — and per ADV-3 (umbrella doc) it is not currently even reliably true. Travels with the ADV-3 timer-semantics decision, not as a standalone style fix.

### Observed, lower-priority (carry as polish candidates)

- **Home focal competition (P1, live pass).** Continue / Change setup / Repeat compete for the focal zone; Repeat embedded in the Last-session row reads ambiguously. Note: uncommitted M002.1 home-coherence WIP (D152-era) was reshaping Home at review time — re-assess after that lands rather than acting on this capture.
- Code audit reported ~9 P1 / ~15 P2 styling-detail items (alpha-composited borders, occasional one-off spacing, minor token bypasses); live pass reported ~15 polish-grade items. None block; sweep candidates for a future polish plan in the 2026-05-25 residuals mold.

## What is genuinely strong (defend these)

- The Run-screen timer surface: size, hierarchy, and calm under pressure graded excellent in the live pass.
- The token system itself — every contrast failure traced to an ad-hoc bypass or alpha composite, never a base token value.
- Copy invariants are visibly enforced in shipped drill copy and screen text (A−), the most internalized of the four contracts.
