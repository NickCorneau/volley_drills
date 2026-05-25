---
id: 2026-05-25-h1-h2-experiment-revaluation
title: "H1 / H2 experiment re-evaluation (2026-05-25)"
status: active
stage: validation
type: design-review
summary: "Viewport-bound re-evaluation of the H1 (BlockTimer 56 → 72 px) and H2 (segmented-drill active-run body density) experiments shipped on 2026-05-25 as plan U6 / U7 follow-ups to the 2026-05-24 e2e design critique. Concludes: keep both experiments. The H1 bump closes the preroll-to-live timer size jump and meets the outdoor brief's bench-distance floor; the H2 collapse honors `courtside-copy.mdc` rule 13 DO-CONFIRM density without removing READ-DO content from the user's reach. Durable keep / tune-further / revert decision still gated on the D91 field run."
authority: "Point-in-time viewport-bound assessment. Not field evidence; D91 field run remains the durable keep/revert authority."
last_updated: 2026-05-25
depends_on:
  - docs/design/reviews/2026-05-24-agent-e2e-design-critique.md
  - docs/research/outdoor-courtside-ui-brief.md
  - docs/research/brand-ux-guidelines.md
  - .cursor/rules/courtside-copy.mdc
  - docs/plans/2026-05-25-002-feat-2026-05-24-design-critique-followups-plan.md
decision_refs:
  - D91
  - D127
  - D130
---

# H1 / H2 experiment re-evaluation (2026-05-25)

## Method

- **Plan under assessment**: `docs/plans/2026-05-25-002-feat-2026-05-24-design-critique-followups-plan.md` U6 (H1 — BlockTimer 56 → 72 px) and U7 (H2 — segmented-drill active-run body density).
- **Baseline**: 2026-05-24 e2e design critique screenshots at `docs/design/reviews/2026-05-24-agent-e2e-design-critique-screenshots/` (production build, 390 × 844, Playwright headless Chromium).
- **Assessment shape**: viewport-bound code-review-flavored read + change-vs-baseline reasoning. **Not** a field-run capture. The 2026-05-24 critique's `D91-FIELD` gate continues to own the durable keep / tune-further / revert decision.

## H1 — BlockTimer 56 px → 72 px

### What shipped

`BlockTimer.tsx` digit class changed from `font-mono text-[56px] font-bold leading-none tabular-nums` to `font-mono text-[72px] font-bold leading-none tabular-nums`. Every other invariant preserved: Phase F10 JetBrains Mono Variable + slashed zero, the 3.5 s accent-flip threshold, the `data-testid` / `data-countdown` hooks, the `h-3` progress bar, and the paused-state subtitle.

### What this changes at viewport-bound assessment

- **Closes the preroll-to-live timer size jump.** The preroll count-in digit (`RunScreen.tsx` line ~289) already renders at 72 px. Before this experiment, the user saw `72 → 56 → ...` as preroll handed off to the live timer — a perceptible "the timer just shrank" moment. After the experiment, the size is continuous through the handoff. This is a real win at viewport-bound assessment and likely the largest single readability improvement of the experiment.
- **Meets the outdoor brief's bench-distance floor.** `docs/research/outdoor-courtside-ui-brief.md` names 72-88 px for the bench-at-1–3 m design center. 72 px is the conservative bottom of the range; the digits are now sized for the stated primary courtside posture rather than the arm's-length sub-mode.
- **Cockpit footer layout holds at 390 × 844.** The 16 px height increase (56 → 72) sits within the existing `ScreenShell.Footer` zone alongside `BlockTimer` + `RunControls` (Pause/Next pair) and the optional `Locking your phone pauses the timer and sound.` wake-lock hint. No content gets pushed above the fold; the `h-3` progress bar and the controls row are unaffected.

### Viewport-bound concerns

- **Could push toward the upper bound (80-88 px) on a real device.** At 72 px the digits are clearly more legible than 56 px at the viewport-bound simulation, but the outdoor brief's stated *design center* is 72-88 px — 72 is the floor, not the center. A future tune (post-D91 field evidence) could push toward 80 px without breaking layout; this experiment is intentionally conservative.
- **No live-timer-only A/B is available.** The viewport-bound assessment can't compare bench-distance reads against arm's-length reads under the same conditions; only the D91 field run can.

### Decision

**Keep at 72 px through the D91 field run.** Re-evaluate after field evidence:
- If testers find 72 px still small at 1-3 m → recommend 80 px in a follow-up plan.
- If testers find 72 px right → record the value as the durable canon-confirmed live-timer scale and remove the experiment annotation from `brand-ux-guidelines.md` §1.2.
- If 72 px reads "too display-heavy" at arm's-length sub-mode → consider a posture-aware distance mode (D127's broader retune surface).

## H2 — Segmented-drill active-run body density

### What shipped

`RunScreen.tsx` body render extended:
- `hasVisibleSegmentInstructions` (the old binary gate) is replaced with `segmentInstructionsInline` (true only at `currentSegmentIndex <= 0`) + `segmentInstructionsCollapsed` (true at `currentSegmentIndex > 0`).
- The inline `courtsideInstructions` paragraph still renders above the `SegmentList` at segment 0.
- Once the user advances past segment 0, the paragraph routes into the existing `<details>` affordance (re-using the `Show full instructions` / `Show more cues and instructions` summary).
- The `SegmentList` itself is unchanged in both states — it continues to carry the load-bearing read.

### What this changes at viewport-bound assessment

- **First segment keeps full READ-DO context.** Segmented drills (`d28-solo` Beach Prep Three, future `d33-pair` cycles, the warmup family generally) get the full `courtsideInstructions` paragraph visible while the user is in segment 0, which is when the body copy is most load-bearing for first-time runnability. This preserves the courtside-copy rule-13 READ-DO intent.
- **DO-CONFIRM density once the rep is in motion.** Past segment 0, the screen reduces to: drill h1 + `SegmentList` (one item `aria-current="step"`, others quiet) + cockpit footer (`BlockTimer` + `RunControls`). The full prose is one tap away behind a summary, not gone. This honors `courtside-copy.mdc` rule 13 (`skillFocus` + `successMetric.description` + `coachingCues[0]` is the load-bearing triple at DO-CONFIRM) and the outdoor brief's 6-field active-run cockpit invariants.
- **Auto-reverts on Pause / preroll.** Because `currentSegmentIndex` rewinds at preroll boundaries, the paused-or-preroll state shows full READ-DO again. This is the right default — pause is a deliberate self-pause moment where the user wants context.
- **GlossedText routing aligns with rule 13.** The `<details>` body renders the `courtsideInstructions` through `<GlossedText>` (tappable terms) per the existing 2026-05-11 convention. The active-run inline paragraph (segment 0) keeps plain `(= …)` literal rendering — rule 13's mid-rep no-tappable-affordances exception. When the user opens `<details>` past segment 0, they've self-paused to read, so GlossedText is appropriate.

### Viewport-bound concerns

- **Per-drill opt-out may be needed for cadence-heavy warmups.** The 2026-05-10 founder-session feedback on `d28-solo` Beach Prep Three named "warmup pacing felt off" — the four 45-s segments needed cadence-format labels (continuous / rep-paced / work-rest / accumulator per `courtside-copy.mdc` rule 7). For drills where the `courtsideInstructions` paragraph carries cadence framing that the `SegmentList` labels don't repeat, collapsing past segment 0 could hide useful context. The current `SegmentList` rendering already labels each segment with its movement; if a drill's prose adds load-bearing cadence framing that segments don't carry, a per-drill opt-out signal (e.g., `courtsideInstructionsAlwaysVisible: true` on the `DrillVariant` record, or a sentinel in `courtsideInstructionsBonus`) could be a follow-up. **Not adding the opt-out now** — viewport-bound assessment doesn't surface a specific drill where this is load-bearing today; the founder-use evidence already routed cadence-format into the `segments[].label` field via the rule-7 sub-rule. Reassess if D91 field testers report "I lost track of what I was doing in segment 2."
- **Tappable summary is a new affordance count.** The `Show full instructions` / `Show more cues and instructions` summary now appears on segmented drills past segment 0 (previously appeared only on non-segmented drills with a long coaching cue). This is one more tappable surface at courtside — slightly increases the affordance count on an already-busy screen. Mitigated by: the `<details>` summary is non-focal text-secondary, not a primary CTA; it sits below the SegmentList; it stays in the body scroll region, not the cockpit footer.
- **No D91 field-bound A/B.** Viewport-bound simulation can't measure glance-load reduction at 1-3 m sun. Only the D91 field run can.

### Decision

**Keep through the D91 field run.** Re-evaluate after field evidence:
- If testers report segment-2+ blank moments / "I forgot what I was doing" → introduce the per-drill opt-out signal as a follow-up.
- If testers find the segment-0 → segment-1 collapse jarring → consider a fade transition (motion-reduce-safe) or a sticky one-line summary above the SegmentList.
- If testers don't notice → record the collapse as the durable canon-confirmed active-run body shape and remove the experiment annotation from `brand-ux-guidelines.md` §7.4.

## D91 deferral re-statement

This re-evaluation is **viewport-bound**, not field-bound. The `D91` retention gate (and its companion field-run requirement that gates Tier 1b unlock under `D130`) remains the durable authority for keep / tune-further / revert decisions on H1 and H2. The 2026-05-24 e2e critique's `D91-FIELD / T1B` classification on H1 and the `D91-FIELD` classification on H2 stay in place — this plan moved them from "held by default" to "experimental in-tier" for one PR; the durable decision is still gated on real-device sunlight evidence.

## Where this lives

- This re-evaluation: `docs/design/reviews/2026-05-25-h1-h2-experiment-revaluation.md`.
- Plan it closes: `docs/plans/2026-05-25-002-feat-2026-05-24-design-critique-followups-plan.md` U9.
- Origin critique: `docs/design/reviews/2026-05-24-agent-e2e-design-critique.md` H1 / H2.
- Canon updates (H1 + H2 annotations): `docs/research/brand-ux-guidelines.md` §1.2 and §7.4 (audit follow-up plan U8).
- Discovery hub: `docs/design/README.md` Reviews table.
- Catalog registration: `docs/catalog.json` `docs[]`.
