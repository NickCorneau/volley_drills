---
title: "feat: Per-move pacing indicator (warmup/cooldown segments)"
type: feat
status: complete
date: 2026-04-28
origin: docs/brainstorms/2026-04-28-per-move-pacing-indicator-requirements.md
shipped: 2026-04-28
---

# Per-move pacing indicator — implementation plan

## Overview

Adds a `segments?: DrillSegment[]` composition field to `DrillVariant` so the three M001-active timed drills (`d28-solo` warmup, `d25-solo` and `d26-solo` cooldown) declare their internal moves as named, individually-timed segments. The pacing pipeline reuses today's `subBlockIntervalSeconds` snapshot rails (catalog → variant → pick → DraftBlock → SessionPlanBlock → swap → runner). RunScreen renders segments as a structured list with a shibui highlight (left rule + "Now" pill + checkmarks for completed segments) when present, and falls back to today's prose+uniform-tick path when absent. A per-segment end beep replaces the uniform sub-block tick on segmented drills.

This is the visible-channel half of S1 from `docs/ideation/2026-04-28-what-to-add-next-ideation.md`. The audio-reliability boundary (silent switch / lock state / Wake Lock denial) is unchanged; the visible channel is what survives that boundary.

---

## Problem frame

On the 2026-04-28 build-17 pair dogfeed, Seb fell back to **watching the timer himself** when cooldown beeps were inaudible (`docs/research/2026-04-28-build17-pair-dogfeed-feedback.md` §F3). The follow-up audio investigation (`docs/research/2026-04-28-audio-pacing-reliability-investigation.md`) confirmed two narrow app-side fixes (wake-lock handoff, `d25-solo` metadata coverage) but left the structural gap intact: there is **no visible per-move position cue** to fall back to when audio fails. Today's `courtsideInstructions` is `whitespace-pre-line` prose with no concept of timing; today's `subBlockIntervalSeconds` is a uniform tick with no concept of which move you're on.

---

## Requirements trace

- R1. Structured per-move indicator on RunScreen for `d28-solo`, `d26-solo`, `d25-solo` driven by authored per-segment durations.
- R2. End-of-segment beep fires within ≤ 250 ms of the segment boundary (matching today's `pollIntervalMs`).
- R3. When the planned block duration exceeds `sum(segments[].durationSec)`, the indicator freezes with all segments checked, the bonus footnote stays visible, and block-end cues fire at the actual block duration.
- R4. Pause / resume preserves segment state. Skip / Next ends the block immediately and freezes the segment list.
- R5. Drills shipping only `subBlockIntervalSeconds` (no `segments`) render exactly as today (no regression).
- R6. Catalog validation rejects, in CI, any variant with `segments` whose durations do not sum to `workload.durationMinMinutes * 60`. Duplicate segment IDs are rejected.
- R7. Visible state is independent of audio state.
- R8. No new Drill, DrillVariant, or session-assembly behavior. Segments never enter `pickForSlot`, `findSwapAlternatives`, Settings, Home, or Review.

**Origin actors:** A1 (solo founder courtside), A2 (pair courtside), A3 (drill author).
**Origin flows:** F1 (warmup ramp on d28), F2 (cooldown stretch on d26 at floor), F3 (cooldown stretch on d26 over floor), F4 (audio fails, visible survives), F5 (pause/resume), F6 (skip/next), F7 (no-segments fallback), F8 (drift caught in CI).
**Origin acceptance examples:** AE1–AE6 (covers R1–R8).

---

## Scope boundaries

- **In scope (this plan).** Type/model/snapshot pipeline, segment authoring on the three drills, catalog validation, per-segment domain math, hook + controller + RunScreen wiring, tests at each pyramid tier.
- **Out of plan.** TransitionScreen segment rendering. Per-segment cue text rendering (`DrillSegment.cue?` is reserved in the type but unused at runtime in v1). Segment-level animated rings or progress bars (V2/V3 from the ideation). Settings opt-in toggle. Distinct per-segment sound palette (one beep, identical to today's `playSubBlockTick`).

### Outside this product's identity

- Promoting `DrillSegment` to a first-class `Drill`. Segments are sub-block authoring structure, not training prescriptions. They never enter session assembly, swap, or any drill-level surface.
- Per-segment Difficulty, success metric, or capture surface. Drill Check capture remains per-block.

### Deferred for later

- Per-segment cue text rendering. `DrillSegment.cue?` field is added to the type and may be authored on segments where natural, but is not rendered in v1.
- Retroactive segment authoring on any future timed drill (`d27`, `d29`, etc.) — each authors at its own ship time.
- Variable-duration segments (e.g., 30–60 s ranges). Single fixed `durationSec` is the v1 contract.

---

## Context & research

### Relevant code and patterns

- **Type contract**: `app/src/types/drill.ts` (`DrillVariant.subBlockIntervalSeconds?: number` is the closest existing field; new `segments?` rides alongside).
- **Catalog**: `app/src/data/drills.ts` (`d25-solo` ~lines 1690–1758; `d26-solo` ~1760–1834; `d28-solo` ~2237–2301).
- **Catalog validation**: `app/src/data/catalogValidation.ts` (existing `'invalid_sub_block'` issue code is the closest pattern; new `'segment_duration_mismatch'`, `'duplicate_segment_id'`, `'invalid_segment_duration'` follow the same shape).
- **Drill copy regression tests**: `app/src/data/__tests__/drillCopyRegressions.test.ts` (existing `pacingCases` block pins `subBlockIntervalSeconds` per variant; segment authoring follows the same pattern).
- **Plan-block snapshot model**: `app/src/model/draft.ts` (`DraftBlock.subBlockIntervalSeconds?`), `app/src/model/session.ts` (`SessionPlanBlock.subBlockIntervalSeconds?`).
- **Snapshot pipeline**: `app/src/domain/sessionBuilder.ts` (`buildDraft`, `buildDraftFromCompletedBlocks`), `app/src/domain/sessionAssembly/swapAlternatives.ts`, `app/src/services/session/commands.ts` (`createSessionFromDraft`).
- **Test fixtures**: `app/src/test-utils/persistedRecords.ts`, `app/src/test-utils/runnerFixture.ts`.
- **Pacing logic**: `app/src/hooks/useBlockPacingTicks.ts` (today owns 3-2-1 end-countdown + uniform sub-block tick; segment math is the same shape as the existing `currentIndex = floor(elapsed / interval)` calc).
- **Controller wiring**: `app/src/screens/run/useRunController.ts` (lines 209–216 wire `subBlockIntervalSeconds`; segments wire alongside).
- **Run rendering**: `app/src/screens/RunScreen.tsx` (lines 165–186 render `courtsideInstructions` with `whitespace-pre-line`; segment list goes here when present).
- **Audio**: `app/src/lib/audio.ts` exposes `playSubBlockTick` via `app/src/platform/`. Reused for end-of-segment beep in v1.

### Institutional learnings

`docs/solutions/` does not exist in this repo (verified during the 2026-04-28 ce-learnings-researcher dispatch and previously recorded in `docs/plans/2026-04-28-tier-1c-prepay-and-catalog-audit.md` §"Institutional Learnings"). Institutional knowledge lives in `docs/research/`, `docs/plans/`, `docs/decisions.md`, `docs/reviews/`, and `.cursor/rules/*.mdc`. The two findings that most directly raised the bar this plan must clear:

- **L1 — Audio is reinforcement; visible state is primary** (`docs/research/outdoor-courtside-ui-brief.md` §"Cue-stack invariants"). On iPhone-PWA at the bench-set-down posture, audio fails routinely (silent switch, manual lock, suspended Web Audio). The product invariant is that **a full-screen state change carries the message even when audio and vibrate no-op**. This makes AE6 (visible-state-independent-of-audio) **load-bearing**, not nice-to-have. U7's screen-integration test mocks audio failure end-to-end and asserts the segment indicator advances identically.
- **L2 — Reserved-field discipline (`SessionParticipant[]` precedent)** (`app/src/model/session.ts` lines 50–57; D115/D116/D117 in `docs/decisions.md`). Forward-seam fields that are added to the type but unrendered need (a) a documented v2 trigger at the type definition and (b) a regression test pinning that they stay unrendered, otherwise the seam silently grows into a feature. U1 documents the `cue?` v2 trigger; U7's `SegmentList.test.tsx` pins the no-render contract.

Other learnings folded into the plan:

- The 2026-04-28 architecture pass landed `domain/runFlow/`, `model/`, and `domain/capture/` as bounded pure-domain homes (`docs/plans/2026-04-26-app-architecture-pass.md`). New pure helpers belong in domain/, not in hooks. The segment-math helper (U6) follows that pattern by living in `app/src/domain/runFlow/segmentTiming.ts`.
- The 2026-04-21 partner walkthrough P2-2 named "audible per-segment pacing" as a genuinely-open item; the 2026-04-22 pacing-tick ship covered the audio half and the structured indicator was the deferred half. This plan closes that half.
- The `subBlockIntervalSeconds` snapshot pipeline survived the U2 capture-domain consolidation untouched, suggesting it's a stable shape to extend.
- The 2026-04-22 partner-walkthrough density polish round 2 dropped Run body copy from `text-lg` (18 px) to `text-base` (16 px) to match TransitionScreen and avoid font-size jumps. The segment list inherits `text-base` exactly — see §"Design decisions" token table.
- `Card.tsx` lines 22–27: `FOCAL_SURFACE_CLASS` is **explicitly off-limits on RunScreen / TransitionScreen** because outdoor readability requires hard contrast and large unambiguous controls; subtle shadows + hairline rings are correct for calm review/settings/onboarding surfaces but wrong for glare-readable run mode. The segment list uses no card chrome.
- `docs/research/japanese-inspired-visual-direction.md` §"Run": *"keep the current outdoor-first legibility contract; do not use this note to justify softer contrast or smaller type; if this direction is applied here, it should show up as calmer spacing, clearer grouping, and less chrome, not aesthetic styling."* The shibui treatment is therefore expressed as **gap-2, sidebar-voice + tiny pill, hard text contrast** — never as a softer surface.

### External references

None required. This is a UI-pacing pattern with strong local context; see `docs/ideation/2026-04-28-per-move-pacing-indicator-ideation.md` §"Phase 1 dispatch skipped" for the rationale.

---

## Key technical decisions

- **Type shape**: `DrillSegment { id: string; label: string; durationSec: number; cue?: string }`. `id` is variant-local (e.g., `d28-solo-s1`); `label` is the courtside-readable move name; `cue?` is reserved for future per-segment cue rendering and ignored in v1 runtime.
- **Authoring contract**: `sum(segments[].durationSec) === workload.durationMinMinutes * 60` exactly. Overflow up to `durationMaxMinutes` is bonus territory.
- **Snapshot model**: `segments` rides the `subBlockIntervalSeconds` pipeline — added to `DraftBlock`, `SessionPlanBlock`, propagated through `pickForSlot` (`sessionBuilder.ts`), `swapAlternatives.ts`, `buildDraftFromCompletedBlocks` (`sessionBuilder.ts`), `createSessionFromDraft` (`commands.ts`), and the test fixtures (`persistedRecords.ts`, `runnerFixture.ts`).
- **Pure helper home**: `app/src/domain/runFlow/segmentTiming.ts` exporting `computeSegmentState(elapsedSec, segments) → { currentIndex, segmentEndingNow }`. Pure, unit-testable at the domain tier.
- **Hook integration**: extend `useBlockPacingTicks` with a third responsibility (segment advancement), gated on `segments?.length`. Keep the uniform sub-block tick path untouched for drills without segments. Suppress the uniform tick when `segments` is present.
- **Beep timing**: end-of-segment, identical sound to today's `playSubBlockTick`. The block-end 3-2-1 + final beep stays unchanged (already separate code path).
- **Segment-end suppression near block end**: same rule as today's uniform tick — don't fire a segment-end beep when `remaining < 4` so it doesn't collide with the block-end 3-2-1.
- **`subBlockIntervalSeconds` posture on the three updated drills**: removed once segments ship there. The runtime treats `segments` as the source of truth when present, so leaving both authored is redundant and risks drift.
- **Catalog issue codes**: `'segment_duration_mismatch'`, `'duplicate_segment_id'`, `'invalid_segment_duration'`.
- **Runtime guard against malformed snapshot**: if a persisted plan has `segments` whose total doesn't match `durationMinutes * 60`, the runner falls back to no-segments rendering and console-warns. Belt and suspenders for forward-compatibility — a hand-edited plan or a stale Dexie row should not crash Run.

---

## Design decisions (frontend-design pass, 2026-04-28)

This section is the `ce-frontend-design` Layer 1 output for U7. Module C applies (existing app, heavy design system). The job is to extend an existing pattern, not introduce a new component family.

### Visual thesis

> The segment list extends the existing **coaching-cue sidebar voice** on RunScreen — a 2 px accent left-rule + tiny uppercase accent label + neutral 16 px body — into a position-aware list. The active row reads as a calm continuation of an existing on-screen affordance, not a new chrome family. Past segments quiet down with a small success check; future segments wait as hollow markers; nothing animates.

### Content plan (RunScreen body, when `currentBlock.segments` present)

```
[ ScreenShell.Header — eyebrow + counter — unchanged ]

  Drill name (h1, text-xl)

  Intro paragraph (kept from courtsideInstructions; everything BEFORE the
  numbered list in today's prose)

  Segment list:
    ✓  Jog or A-skip around your sand box.            45s
    ▎  Ankle hops and lateral shuffles.    [ NOW ]    45s
    ○  Arm circles and trunk rotations.                45s
    ○  Quick side shuffles and pivot-back starts.      45s

  Bonus paragraph (renders ONLY when currentSegmentIndex === -1 and
  courtsideInstructionsBonus is set; text-secondary, smaller)

  ─ Cue ────
  Coaching cue (existing component, unchanged)

[ ScreenShell.Footer — BlockTimer + RunControls — unchanged ]
```

### Interaction plan (motion)

**Zero motion.** State transitions between rows are instantaneous. The cockpit footer's `BlockTimer` remains the only animated element on the screen (per the partner-walkthrough density polish 2026-04-22 round 2, the japanese-inspired-direction §3 "limited motion," and the outdoor-courtside-ui-brief Run-mode active-state list). The "Now" pill does not pulse. The check appears instantly at segment end. The hollow circle does not animate to filled.

ARIA: `<ul aria-label="Segments">`; the active `<li>` carries `aria-current="step"`; an off-screen `aria-live="polite"` element announces segment changes for screen readers. This is the accessibility half of R7 (visible state independent of audio state).

### Concrete tokens (verified against `app/src/index.css` and existing RunScreen patterns)

The pattern below mirrors the **existing coaching-cue treatment** in `RunScreen.tsx` (lines 209–224) almost exactly. Same left-rule, same uppercase accent label voice, same `text-base text-text-primary` body weight. No new tokens introduced.

| Element | Tailwind | Rationale |
|---|---|---|
| Container | `<ul className="flex flex-col gap-2">` | Tighter than ScreenShell.Body's `gap-4` so the list reads as one cluster |
| Row (any state) | `<li className="flex items-baseline gap-3 pl-3">` | `pl-3` reserves space for the left-rule on the active row so layout doesn't shift between states |
| Active row override | `border-l-2 border-accent/70 pl-3` (replaces the base `pl-3`) | **Identical to coaching-cue at line 212** |
| Past row label | `text-base leading-relaxed text-text-primary/60` | Quieter than full primary; still WCAG AA on `surface-calm` |
| Active row label | `text-base font-medium leading-relaxed text-text-primary` | **Identical body voice to coaching-cue at line 220** |
| Future row label | `text-base leading-relaxed text-text-secondary` | Same `text-secondary` (#4b5563, AAA) as the eyebrow counter |
| Duration suffix | `ml-auto text-sm tabular-nums text-text-secondary` | Tabular-nums mirrors `BlockTimer`; right-anchored via `ml-auto` |
| Past row marker | `<CheckIcon className="size-4 shrink-0 text-success" />` | `text-success` = `#047857` emerald-700, AAA on every surface |
| Active row marker | `<span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-bg-primary">Now</span>` | Filled pill (not just an accent text label) so it's glanceable in glare; `bg-bg-primary` text on `bg-accent` clears WCAG AA easily |
| Future row marker | `<span className="size-3 shrink-0 rounded-full border border-text-secondary/40" aria-hidden="true" />` | Hollow circle, neutral; no `border-2` or shadow — flat |
| Bonus paragraph | `<p className="mt-3 text-sm leading-relaxed text-text-secondary">{bonus}</p>` | Mirrors the preroll-hint voice at RunScreen.tsx line 261 |

**`size-4` / `size-3`** = Tailwind v4 shorthand for `h-4 w-4` / `h-3 w-3`. Confirmed Tailwind v4 in repo via `@import 'tailwindcss'` in `app/src/index.css`.

The `Now` pill uses `text-bg-primary` (white text, `#ffffff`) on `bg-accent` (`#b45309`, amber-700). Contrast ratio ≈ 4.99 — clears WCAG AA for normal text and clears AA for the 10 px size at 600 weight per the 14 px-bold equivalence rule. If a future contrast pass shows the pill is borderline at outdoor RPE-5 viewing angles, swap the pill text to `text-white` (functionally identical, semantically clearer) and revisit.

### Litmus checks (Module C — components in existing apps)

- ✓ Match existing visual language? **Yes** — extends the coaching-cue sidebar voice rather than introducing a new family.
- ✓ Inherit spacing / radius / color / type? **Yes** — every token is verified against `app/src/index.css`. No new colors, radii, font sizes, or weights.
- ✓ One new component should not introduce a new design system? **Yes** — `<SegmentList>` is one file in `components/run/` using only existing tokens.
- ✓ Clear states (default/active/done/disabled/loading/error)? **Yes** — `now` / `done` / `future` are the three rendered states; "disabled" doesn't apply (segments don't take input); "loading" doesn't apply (snapshotted at session create); error path is the runtime guard described in Key technical decisions.
- ✓ One H1 unchanged? **Yes** — `currentBlock.drillName` keeps the only `<h1>`.
- ✓ Outdoor brief constraints? **Yes** — 16 px body floor maintained; near-black on `surface-calm`; hard contrast; no decorative shadows; segment markers are not touch targets.
- ✓ Japanese-inspired direction §"do not use this note to justify softer contrast on Run"? **Yes** — labels render at hard contrast; only the bonus paragraph (which is post-segment information, not active-block guidance) uses `text-secondary`.
- ✓ AE6 (visible-state-independent-of-audio)? **Yes** — see U7 test scenarios; the screen-integration test mocks audio failure and asserts segment advancement is identical.

### Anti-patterns explicitly avoided

- ✗ Animated rings, spinners, or progress bars (V2/V3 from ideation deferred to a follow-up if dogfeed asks).
- ✗ A new card/chrome layer on Run (forbidden by `Card.tsx` comment lines 22–27 — `FOCAL_SURFACE_CLASS` is explicitly off-limits on RunScreen / TransitionScreen).
- ✗ A new accent color or status color.
- ✗ Adding a focus state on segment rows (they aren't focusable; only the cockpit-footer controls take focus).
- ✗ Decorative shadows or background fills behind rows.
- ✗ Pulse / fade animations on state transitions (motion budget is reserved for the cockpit-footer `BlockTimer` and the preroll-countdown digit).

---

## Open questions

### Resolved during planning

- **OQ-P1.** Where does segment-advance logic sit? **Resolution**: pure helper in `app/src/domain/runFlow/segmentTiming.ts`; `useBlockPacingTicks` calls it. Keeps the lowest-tier proof obligation in domain unit tests.
- **OQ-P2.** Sound for end-of-segment beep? **Resolution**: identical to today's `playSubBlockTick`. Revisit if the next dogfeed asks for differentiation.
- **OQ-P3.** First-segment visual during preroll? **Resolution**: highlight as **Now** through preroll so the user can read the upcoming move during 3-2-1 count-in. Matches the existing pattern where `currentBlock.courtsideInstructions` is already visible during preroll.
- **OQ-P4.** Live vs snapshotted segment data? **Resolution**: snapshot, per the user-directed re-framing in brainstorm. Mirrors today's `subBlockIntervalSeconds` lifecycle.
- **OQ-P5.** Pyramid placement? **Resolution**: domain unit (`segmentTiming.test.ts`), hook unit (`useBlockPacingTicks.test.ts` extended), controller wiring (`useRunController.test.tsx` extended for segment exposure), screen integration (one new RTL test file `RunScreen.segments.test.tsx`). Drill-copy regression in `drillCopyRegressions.test.ts`. Catalog validation in `catalogValidation.test.ts`. One test per tier; no duplication.
- **OQ-P6.** Author `cue?` per segment now? **Resolution**: type field is added; v1 leaves it empty on all authored segments. Author-and-render lands in a follow-up.

### Deferred to implementation

- **`d25-solo` workload floor mismatch.** Current `workload.durationMinMinutes: 2` (120 s) doesn't fit the 5-move prose list cleanly. The implementer in **U5** decides whether to (a) bump `durationMinMinutes` from 2 to 3 (matching `d26` and `d28`'s 3-min floor — honest, given the existing copy already implies ~180 s of authored content), or (b) author 4 segments at 30 s each summing to 120 s and trim the prose accordingly. **Recommendation**: option (a) — the existing comment in `drills.ts` ("the first two ticks may both belong to the initial walking segment on a 3+ minute wrap") explicitly concedes the natural shape is closer to 3 min. Verify with a session-builder regression test that `d25` still wins the wrap slot under typical archetypes.
- **`d26-solo` copy refactor for bonus paragraph.** Current `courtsideInstructions` mixes intro paragraph + numbered list + bonus instruction. When segments render the structured list, the prose source needs to be split. **Implementer decision in U4**: either (i) author a separate `courtsideInstructionsBonus?: string` field on the variant (clean but expands the type), or (ii) parse out the numbered list at render time when `segments` is present (no schema change but introduces brittle parsing). **Recommendation**: (i) is honest; the type addition is one optional string. Confirm in U4 by checking whether `d28-solo` and `d25-solo` have analogous bonus material (they do — `d28` has a coaching intro line "Four quick blocks…" and `d25` has the "Hydrate" footnote).
- **Audible "segments started" cue.** Today there's no "cooldown started" cue beyond block-end of the previous block + preroll of the cooldown block. v1 ships with that cue stack unchanged. If F3-class feedback recurs, revisit.

---

## Implementation units

- [x] **U1. Add `DrillSegment` type and snapshot pipeline plumbing**

**Goal:** Land the type and propagate the optional `segments` field through every layer that already carries `subBlockIntervalSeconds`, with no render change. Inert plumbing — proves the snapshot rails work end-to-end before any UX or authored data lands.

**Requirements:** R5, R8 (no behavior change, no session-assembly impact).

**Dependencies:** None.

**Files:**
- Modify: `app/src/types/drill.ts` (add `DrillSegment` type; add `DrillVariant.segments?: readonly DrillSegment[]`)
- Modify: `app/src/model/draft.ts` (add `DraftBlock.segments?: readonly DrillSegment[]`)
- Modify: `app/src/model/session.ts` (add `SessionPlanBlock.segments?: readonly DrillSegment[]`)
- Modify: `app/src/domain/sessionBuilder.ts` (carry `segments` on `pick.variant.segments` → DraftBlock in both `buildDraft` and `buildDraftFromCompletedBlocks`)
- Modify: `app/src/domain/sessionAssembly/swapAlternatives.ts` (carry `candidate.variant.segments` on the alternative shape)
- Modify: `app/src/services/session/commands.ts` (carry `b.segments` in `createSessionFromDraft` plan-block write)
- Modify: `app/src/test-utils/persistedRecords.ts` (carry `segments` in the test factory)
- Modify: `app/src/test-utils/runnerFixture.ts` (carry `segments` fallback)
- Test: `app/src/domain/sessionBuilder.test.ts` (extend the existing `subBlockIntervalSeconds`-pipes-through test pattern; one new test asserts segments propagate from variant → DraftBlock for warmup + wrap)
- Test: `app/src/domain/__tests__/buildDraftFromCompletedBlocks.test.ts` (extend the existing "preserves sub-block pacing" test to also preserve segments)
- Test: `app/src/services/__tests__/session.swap.test.ts` (extend existing swap-preservation test to assert segments survive a swap)

**Approach:**
- `DrillSegment` is `{ id: string; label: string; durationSec: number; cue?: string }` — new exported interface in `types/drill.ts`.
- **`cue?` reserved-field discipline (precedent: `SessionParticipant[]` forward-seam in `model/session.ts`).** The field is added to the type but **not authored** on segments in U3/U4/U5 and **not rendered** by `<SegmentList>` in U7. Author a documentation comment at the type definition that names the v2 trigger explicitly: *"Reserved for a future per-segment cue ship. Activates when (a) partner walkthrough or founder-ledger row explicitly asks for per-segment cue copy on at least one of `d25-solo` / `d26-solo` / `d28-solo`, OR (b) a non-M001 timed drill ships requiring per-move cue copy at authoring time. Until then, do not author the field on any segment, and do not render it from `<SegmentList>`. The U7 component test pins this contract."* This prevents the seam from silently growing into a feature.
- `segments?: readonly DrillSegment[]` everywhere. `readonly` because the runtime never mutates the segment list.
- Mirror every spot that mentions `subBlockIntervalSeconds` and add a sibling `segments` line. Grep `subBlockIntervalSeconds` returns 16 hits across the listed files; this unit's job is to add one more line per hit.
- No drill data is authored in this unit. `validateDrillCatalog` keeps passing because all existing drills have `segments` undefined.

**Patterns to follow:**
- `subBlockIntervalSeconds` snapshot lifecycle (the closest existing pattern in the codebase).
- `DrillVariant.fatigueCap` is the closest existing optional-nested-object precedent on the variant.

**Test scenarios:**
- Domain — *Happy path*: a variant authored with `segments` propagates into both `buildDraft` warmup/wrap blocks and `buildDraftFromCompletedBlocks` carryover (extends existing tests).
- Domain — *Happy path*: `findSwapAlternatives` preserves `segments` on alternatives (when present in source variant).
- Services — *Integration*: `createSessionFromDraft` round-trips a draft with `segments` into a `SessionPlanBlock` with the same segments.
- *Edge case*: a variant without `segments` produces a `DraftBlock`/`SessionPlanBlock` with `segments: undefined` (not `null`, not `[]`). Asserts the plumbing is truly optional.

**Verification:** `npm test` clean for the touched test files; typecheck clean; existing 1065/1065 baseline still passes.

---

- [x] **U2. Catalog validation for segments**

**Goal:** CI rejects any variant where `segments` is malformed (sum-mismatch, duplicate IDs, invalid durations). Drift can't ship.

**Requirements:** R6 (catalog validation rejects mismatched segment totals).

**Dependencies:** U1.

**Files:**
- Modify: `app/src/data/catalogValidation.ts` (add `'segment_duration_mismatch'`, `'duplicate_segment_id'`, `'invalid_segment_duration'` to `DrillCatalogIssueCode`; extend `validateDrillCatalog` to check segments per variant)
- Test: `app/src/data/__tests__/catalogValidation.test.ts` (new test cases: well-formed segments pass; sum mismatch fails; duplicate segment IDs fail; non-positive integer duration fails; segments-undefined remains valid)

**Approach:**
- Validation runs only when `variant.segments !== undefined`.
- Sum check: `segments.reduce((s, x) => s + x.durationSec, 0) === variant.workload.durationMinMinutes * 60`. Strict equality. Float math not needed — `durationSec` is integer.
- Duplicate ID check: per-variant `Set<string>` of segment IDs.
- Invalid duration check: `Number.isInteger(durationSec) && durationSec > 0`.
- Issue paths follow the existing pattern: `drills.${drill.id}.variants.${variant.id}.segments[${index}].durationSec`.

**Patterns to follow:**
- The existing `'invalid_sub_block'` validation in `catalogValidation.ts` (lines 121–133) is the closest model for shape and error voice.

**Test scenarios:**
- *Happy path*: a variant with three 60 s segments summing to 180 s and `durationMinMinutes: 3` passes validation.
- *Edge case*: a variant with `segments: undefined` passes (no segment validation runs).
- *Error path*: sum mismatch (e.g., three 60 s segments + `durationMinMinutes: 5`) emits `segment_duration_mismatch`.
- *Error path*: two segments with the same `id` emit `duplicate_segment_id` exactly once per duplicate.
- *Error path*: a segment with `durationSec: 0`, negative, or non-integer emits `invalid_segment_duration`.
- *Edge case*: an empty `segments: []` array emits `segment_duration_mismatch` (sum of 0 ≠ floor in seconds, except for the impossible `durationMinMinutes: 0` case).

**Verification:** `npm test -- catalogValidation` clean; the existing `validateDrillCatalog` call site in CI blocks any malformed segment authoring.

---

- [x] **U3. Author segments on `d28-solo` (warmup, cleanest case)**

**Goal:** First real segment authoring lands on the drill where the math is already aligned (4 × 45 s = 180 s = `durationMinMinutes * 60`). Proves the round trip end-to-end.

**Requirements:** R1, R6.

**Dependencies:** U1, U2.

**Files:**
- Modify: `app/src/data/drills.ts` (add `segments` array to `d28-solo`; remove `subBlockIntervalSeconds: 45` since `segments` is now the source of truth)
- Test: `app/src/data/__tests__/drillCopyRegressions.test.ts` (add a `d28-solo` segment regression case asserting 4 segments, IDs `d28-solo-s1` through `d28-solo-s4`, durations all 45 s, sum 180 s)

**Approach:**
- Author the four segments matching today's prose order:
  1. `d28-solo-s1` "Jog or A-skip around your sand box." — 45 s
  2. `d28-solo-s2` "Ankle hops and lateral shuffles." — 45 s
  3. `d28-solo-s3` "Arm circles and trunk rotations." — 45 s
  4. `d28-solo-s4` "Quick side shuffles and pivot-back starts at game pace." — 45 s
- Remove `subBlockIntervalSeconds: 45`. The existing `drillCopyRegressions.test.ts` test that pins `subBlockIntervalSeconds: 45` for `d28-solo` is updated to assert segments instead.
- Update the `pacingCases` block in `drillCopyRegressions.test.ts`: this case moves from the `subBlockIntervalSeconds`-pinning shape to a new `segmentsCases` shape (or extend the existing case).
- Author a comment block explaining that segments now own the pacing contract; `subBlockIntervalSeconds` retired for this variant.

**Patterns to follow:**
- The existing `pacingCases` block in `drillCopyRegressions.test.ts` (lines ~191–214) is the regression home.
- Courtside-copy invariants in `.cursor/rules/courtside-copy.mdc` §7 ("timed sub-blocks need audible structure") — the comment can now point to this spec instead of "shipping gap."

**Test scenarios:**
- *Happy path*: `d28-solo` has exactly 4 segments with the expected IDs, labels, and 45 s durations.
- *Happy path*: `d28-solo.subBlockIntervalSeconds` is `undefined`.
- *Integration*: `validateDrillCatalog({ drills, progressionChains })` returns zero issues touching `d28-solo`.

**Verification:** `npm test -- drillCopyRegressions` clean; `npm test -- catalogValidation` clean; `npm test` full pass.

---

- [x] **U4. Author segments on `d26-solo` and split bonus copy**

**Goal:** The cooldown stretch case lands. Resolves the deferred copy-refactor decision (bonus paragraph).

**Requirements:** R1, R3, R6.

**Dependencies:** U1, U2, U3 (uses the U3 authoring pattern as template).

**Files:**
- Modify: `app/src/types/drill.ts` (add `DrillVariant.courtsideInstructionsBonus?: string` — optional bonus prose shown only when block duration exceeds segment sum)
- Modify: `app/src/data/drills.ts` (split `d26-solo.courtsideInstructions` into structured segments + bonus prose; remove `subBlockIntervalSeconds: 30`)
- Test: `app/src/data/__tests__/drillCopyRegressions.test.ts` (add `d26-solo` segment regression: 3 segments × 60 s = 180 s; bonus copy present; rule 5 cool-down review preserved)

**Approach:**
- Author three 60 s segments matching the existing numbered list:
  1. `d26-solo-s1` "Calf: straight back leg, heel down, lean in; soften the back knee for the lower calf." — 60 s
  2. `d26-solo-s2` "Hamstring (back of thigh): front leg heel down, toes up; tip your hips back and lean your chest toward the front leg, back flat." — 60 s
  3. `d26-solo-s3` "Hip flexor (front of upper thigh): half-kneel (one knee on the ground, other foot in front), squeeze the back-leg glute, lean gently into the front leg." — 60 s
- Strip the numbered list from `courtsideInstructions`. The intro paragraph stays: `"Short wrap (3 to 6 minutes on the timer): three moves to start, about 60 s each on one side. No bouncing; firm tension, never sharp pain."`
- Move the bonus paragraph to `courtsideInstructionsBonus`: `"If time remains, mirror to the other side, then add glutes (back of hips) or adductors (inner thighs)."`
- Remove `subBlockIntervalSeconds: 30`.
- Verify against `.cursor/rules/courtside-copy.mdc` invariant 5 (cool-down equal review weight): each segment label remains glossed where today's copy glossed; no jargon regression.

**Patterns to follow:**
- U3's authoring pattern.
- Courtside-copy rule 5 + the existing `d26-solo` jargon-gloss convention (anatomy in parentheses).

**Test scenarios:**
- *Happy path*: `d26-solo` has 3 segments × 60 s; sum 180 s; `durationMinMinutes: 3` matches.
- *Happy path*: `d26-solo.courtsideInstructionsBonus` is non-empty and contains the "mirror" + "glutes / adductors" tokens.
- *Happy path*: `d26-solo.courtsideInstructions` no longer contains numbered-list `\n1. ` markers; intro paragraph preserved.
- *Edge case*: glossed anatomy terms ("back of thigh", "front of upper thigh", "half-kneel") still present in segment labels (rule 2 jargon gate).

**Verification:** `npm test` full pass; `npm run lint` clean.

---

- [x] **U5. Author segments on `d25-solo` and resolve the workload-floor mismatch** (option a — `durationMinMinutes` bumped 2→3; verified safe across every M001 archetype wrap slot)

**Goal:** The third drill lands. Resolves the deferred floor-vs-prose mismatch.

**Requirements:** R1, R6.

**Dependencies:** U1, U2, U3, U4.

**Files:**
- Modify: `app/src/data/drills.ts` (`d25-solo`: bump `durationMinMinutes` from 2 to 3 OR trim segment list to fit 120 s; author segments accordingly; split bonus copy if applicable; remove `subBlockIntervalSeconds: 30`)
- Test: `app/src/data/__tests__/drillCopyRegressions.test.ts` (add `d25-solo` segment regression)
- Test: `app/src/domain/sessionBuilder.test.ts` (add a guard test that `d25` continues to be a valid wrap-slot pick under the M001 archetypes — confirms the `durationMinMinutes` change doesn't break session assembly)

**Approach:**
- **Recommended path (option a)**: bump `d25-solo.workload.durationMinMinutes` from 2 to 3. Author 5 segments summing to 180 s:
  1. `d25-solo-s1` "Walk with long exhales." — 60 s
  2. `d25-solo-s2` "Sit or lean to rest calves and feet." — 30 s
  3. `d25-solo-s3` "Hip stretch: cross one ankle over the opposite knee and lean forward." — 30 s
  4. `d25-solo-s4` "Reach arms overhead with a gentle back-bend." — 30 s
  5. `d25-solo-s5` "Shoulder stretch: one arm across chest." — 30 s
  - Move "Hydrate and note any pain." to `courtsideInstructionsBonus`.
- **Alternate path (option b)**: keep `durationMinMinutes: 2`. Author 4 segments summing to 120 s:
  1. `d25-solo-s1` "Walk with long exhales." — 45 s
  2. `d25-solo-s2` "Sit or lean to rest calves and feet." — 25 s
  3. `d25-solo-s3` "Hip stretch." — 25 s
  4. `d25-solo-s4` "Back-bend with arms overhead." — 25 s
  - Drop the shoulder stretch and the hydrate prompt.
- **Decision criterion:** option (a) preserves more of the authored coaching intent and matches the existing comment in `drills.ts` ("first two ticks may both belong to the initial walking segment on a 3+ minute wrap"). Option (b) is purer YAGNI but loses content. Default to (a); switch to (b) only if `npm test -- sessionBuilder` shows that bumping `durationMinMinutes` displaces another drill from a wrap slot it shouldn't lose.
- Remove `subBlockIntervalSeconds: 30`.
- Author a code comment block at the variant explaining the workload-floor change with reference to this plan and the brainstorm.

**Patterns to follow:**
- U3 + U4 authoring pattern.
- The existing `d25-solo` 2026-04-28 audio-investigation fix comment at lines ~1739–1748 of `drills.ts` (date-prefixed comment block convention).

**Test scenarios:**
- *Happy path*: `d25-solo` has segments whose sum equals `durationMinMinutes * 60` (validation passes).
- *Integration*: `buildDraft` selects `d25-solo` for the wrap slot at expected archetypes (15 / 25 / 45 min) and the resulting plan block carries the segments through.
- *Edge case*: if option (a) is taken, confirm no archetype that previously selected `d25` now picks a different wrap drill due to the `durationMinMinutes` change.

**Verification:** `npm test` full pass; manual archetype inspection if option (a) is taken; build clean.

---

- [x] **U6. Domain pure helper + pacing-hook extension**

**Goal:** Per-segment timing math lives in a pure domain module. `useBlockPacingTicks` calls the helper to advance the segment index and fire the end-of-segment beep. Suppress the uniform sub-block tick when segments are present.

**Requirements:** R2, R4, R5 (no regression for non-segment drills).

**Dependencies:** U1.

**Files:**
- Create: `app/src/domain/runFlow/segmentTiming.ts` (pure helper `computeSegmentState`)
- Test: `app/src/domain/runFlow/__tests__/segmentTiming.test.ts`
- Modify: `app/src/hooks/useBlockPacingTicks.ts` (extend with `segments?` parameter; advance index; fire `onSegmentEndTick`)
- Modify: `app/src/hooks/useBlockPacingTicks.test.ts` (extend with segment scenarios)

**Approach:**

Pure helper signature:

```typescript
// app/src/domain/runFlow/segmentTiming.ts
export interface DrillSegment {
  id: string
  label: string
  durationSec: number
  cue?: string
}

export interface SegmentState {
  /** 0-based index of the segment currently active. -1 if all segments have ended (block in bonus territory). */
  currentIndex: number
  /** True only on the tick where the previous segment just ended (used to fire the beep once). */
  segmentEndingNow: boolean
  /** Cumulative seconds at which the next segment ends, or null if no more segments. */
  nextBoundarySec: number | null
}

export function computeSegmentState(
  elapsedSec: number,
  segments: readonly DrillSegment[],
  prevIndex: number,
): SegmentState
```

The helper is pure (no clocks, no side effects). The hook owns the bookkeeping ref (`lastSegmentIndexRef`) and converts `elapsedSec` from `blockDurRef.current - remainingRef.current` (same as today's sub-block tick math).

Hook extension shape:

```typescript
// app/src/hooks/useBlockPacingTicks.ts (sketch — directional only)
export interface UseBlockPacingTicksOptions {
  running: boolean
  blockId: string | null | undefined
  subBlockIntervalSeconds?: number
  segments?: readonly DrillSegment[]
  remainingRef: { current: number }
  blockDurRef: { current: number }
  onEndCountdownTick: () => void
  onSubBlockTick: () => void
  onSegmentEndTick?: () => void
  pollIntervalMs?: number
}
```

In the poll body, branch:
- If `segments?.length`: call `computeSegmentState`, fire `onSegmentEndTick` at boundary; **do not fire `onSubBlockTick`**.
- Else if `subBlockIntervalSeconds`: today's path unchanged.
- The 3-2-1 end-countdown is independent of both branches and unchanged.

Suppress segment-end beep when `remaining < 4` (matches existing rule).

**Patterns to follow:**
- `app/src/domain/runFlow/postBlockRoute.ts` is the pure-domain home pattern.
- Existing `useBlockPacingTicks.ts` `lastSubBlockTickIndexRef` ref-based bookkeeping is the model for `lastSegmentIndexRef`.

**Test scenarios:**

*Domain unit (`segmentTiming.test.ts`):*
- *Happy path*: `elapsedSec=0` → `currentIndex=0`, `segmentEndingNow=false`.
- *Happy path*: `elapsedSec=44.99` (just before first boundary on `d28-solo`-shape segments) → `currentIndex=0`.
- *Boundary*: `elapsedSec=45.0` exactly with `prevIndex=0` → `currentIndex=1`, `segmentEndingNow=true`.
- *Boundary*: `elapsedSec=45.0` with `prevIndex=1` (already ticked) → `currentIndex=1`, `segmentEndingNow=false`.
- *Edge case*: `elapsedSec=180` (block ended) → `currentIndex=-1` (bonus territory) or `segments.length-1` (last segment still showing checked). Pick one and pin: recommend `currentIndex=-1` and let the renderer treat -1 as "all checked, no Now."
- *Edge case*: `elapsedSec` greater than sum (e.g., 200 s for 180 s of segments) → `currentIndex=-1`.
- *Edge case*: empty `segments: []` → `currentIndex=-1`, `segmentEndingNow=false` (defensive; should never happen since validation rejects).
- *Edge case*: `prevIndex=-1` and `elapsedSec=46` after rewind → `currentIndex=1`, `segmentEndingNow=false` (no double-fire on rewind).

*Hook unit (`useBlockPacingTicks.test.ts` extensions):*
- *Happy path*: segments present → `onSegmentEndTick` fires once per boundary; `onSubBlockTick` does not fire.
- *Happy path*: segments absent + `subBlockIntervalSeconds` present → today's path unchanged (covered by existing tests).
- *Edge case*: `running=false` → no segment ticks fire even with segments present.
- *Edge case*: `blockId` change resets `lastSegmentIndexRef` (covered by existing reset effect).
- *Boundary*: segment boundary lands within `remaining < 4` window → `onSegmentEndTick` suppressed (avoids collision with end-countdown).
- *Integration*: pause→resume mid-segment does not double-fire (`prevIndex` ref persists across the pause).

**Verification:** `npm test -- segmentTiming useBlockPacingTicks` clean; existing tests pass.

---

- [x] **U7. Controller wiring + RunScreen rendering (frontend-design pass applied)**

**Goal:** RunScreen shows the structured segment list with the shibui sidebar voice when `currentBlock.segments` is present; falls back to today's prose render when absent. Visual tokens are pinned in §"Design decisions" — implementer follows that table; this unit handles wiring, semantics, and testing.

**Requirements:** R1 (current segment indicated), R3 (bonus copy after all segments done), R5 (no-segments fallback unchanged), R7 (visible-state independent of audio).

**Dependencies:** U1, U6.

**Files:**
- Modify: `app/src/screens/run/useRunController.ts` (wire `currentBlock.segments` + `onSegmentEndTick: playSubBlockTick` into the pacing hook; expose `currentSegmentIndex` on the controller return)
- Modify: `app/src/screens/run/__tests__/useRunController.test.tsx` (controller exposes `currentSegmentIndex` from the hook; controller passes `segments` from `currentBlock` to the pacing hook)
- Modify: `app/src/screens/RunScreen.tsx` (render `<SegmentList>` when `currentBlock.segments` is present; otherwise today's prose; preserve the intro paragraph above the list)
- Create: `app/src/components/run/SegmentList.tsx` (presentation component — receives `segments`, `currentIndex`, `bonus?: string`; renders per the §"Design decisions" token table)
- Create: `app/src/components/run/__tests__/SegmentList.test.tsx`
- Create: `app/src/screens/__tests__/RunScreen.segments.test.tsx` (the **load-bearing AE6 test** lives here — see scenarios below)

**Approach:**

**Controller wiring** (mirrors today's `subBlockIntervalSeconds` shape):

```typescript
// app/src/screens/run/useRunController.ts (additions)
const [currentSegmentIndex, setCurrentSegmentIndex] = useState(
  currentBlock?.segments?.length ? 0 : -1,
)

useEffect(() => {
  setCurrentSegmentIndex(currentBlock?.segments?.length ? 0 : -1)
}, [currentBlock?.id])

useBlockPacingTicks({
  // existing fields unchanged
  segments: currentBlock?.segments,
  onSegmentEndTick: () => {
    playSubBlockTick()
    setCurrentSegmentIndex((i) => {
      const n = currentBlock?.segments?.length ?? 0
      return i + 1 >= n ? -1 : i + 1
    })
  },
})
```

`currentSegmentIndex === -1` is the **canonical "all done, in bonus territory"** sentinel. The pure helper in U6 also returns `-1` for past-last-boundary so the two stay aligned. **Decision pinned**: do not switch to `useMemo`-derived index unless the state-driven approach visibly trails the timer in dogfeed; the state shape is simpler to test and the lag bound is one `pollIntervalMs` (250 ms) which is below human notice.

**RunScreen body change** (replaces the existing `currentBlock.courtsideInstructions && (...)` block at RunScreen.tsx:182–186):

```tsx
{currentBlock.segments?.length ? (
  <>
    {currentBlock.courtsideInstructions && (
      <p className="whitespace-pre-line text-base leading-relaxed text-text-primary">
        {currentBlock.courtsideInstructions}
      </p>
    )}
    <SegmentList
      segments={currentBlock.segments}
      currentIndex={currentSegmentIndex}
      bonus={currentBlock.courtsideInstructionsBonus}
    />
  </>
) : (
  currentBlock.courtsideInstructions && (
    <p className="whitespace-pre-line text-base leading-relaxed text-text-primary">
      {currentBlock.courtsideInstructions}
    </p>
  )
)}
```

**Authoring contract for `courtsideInstructions` on segmented drills**: when `segments` is present, `courtsideInstructions` carries **only the intro paragraph** — no numbered list. U3, U4, U5 strip the numbered prose at authoring time. The render branch above keeps the intro paragraph visible above `<SegmentList>` so the "Four quick blocks…" preamble on `d28` and the "Short wrap (3 to 6 minutes…)" preamble on `d26` survive.

**`SegmentList.tsx`** — implementer follows the §"Design decisions" token table verbatim. The component shape:

```tsx
type SegmentRowStatus = 'done' | 'now' | 'future'

interface SegmentListProps {
  segments: readonly DrillSegment[]
  currentIndex: number
  bonus?: string
}

export function SegmentList({ segments, currentIndex, bonus }: SegmentListProps) {
  // currentIndex === -1 means "all done"; render every row as 'done'.
  // Active row uses border-l-2 border-accent/70; past rows quiet to text-primary/60;
  // future rows render in text-text-secondary. See "Design decisions" table.
  // <ul aria-label="Segments">; active <li> carries aria-current="step";
  // an aria-live="polite" announcer outside the list speaks the active label.
}
```

`cue?` field is **deliberately unused** in v1 render. See U1 test scenario asserting it is not surfaced; see U1 type-comment for the v2 trigger ("partner walkthrough or founder ledger explicitly asking for per-segment cue copy on at least one of the three timed drills").

**Patterns to follow:**
- `RunScreen.tsx` lines 209–224 (existing `coachingCue` sidebar — the canonical shibui voice this list extends).
- `useRunController` `subBlockIntervalSeconds` wiring at line 211 (the snapshot-pipeline mirror).
- `app/src/components/ui/` directory layout (one file per primitive; co-located tests under `__tests__/`). `app/src/components/run/` is created here for the first time; this is the runtime split that pairs with `app/src/screens/run/` controllers introduced in the architecture pass.
- `Card.tsx` lines 22–27 for the `FOCAL_SURFACE_CLASS` exclusion rule on RunScreen (do **not** apply card chrome).

**Test scenarios:**

*Component unit (`SegmentList.test.tsx`):*
- *Happy path*: 4 segments, `currentIndex=0` → first row has the "NOW" pill and `border-l-2 border-accent/70`; rows 2–4 render the hollow circle marker.
- *Happy path*: `currentIndex=2` → rows 1–2 render check (`text-success`); row 3 has "NOW" pill; row 4 has hollow circle.
- *Happy path*: `currentIndex=-1` + `bonus` provided → all rows render check; **bonus paragraph renders** below the list with `text-sm text-text-secondary`.
- *Edge case*: `currentIndex=-1` + no `bonus` → all rows check; no extra paragraph rendered.
- *Edge case*: empty `segments: []` + `currentIndex=-1` → renders an empty `<ul>` (or nothing visible); component does not crash.
- *Accessibility*: the active row carries `aria-current="step"`; the list has `aria-label="Segments"`; an `aria-live="polite"` announcer is present.
- *Cue field reservation* (Covers `cue?` regression): a segment with `cue: "Long exhale, let heart rate come down."` renders **identically** to one with `cue: undefined` — the cue text is not present in the DOM. Pins the v1 forward-seam contract.

*Controller unit (`useRunController.test.tsx` extensions):*
- *Happy path*: when `currentBlock.segments` is set, the controller passes them to `useBlockPacingTicks` and exposes `currentSegmentIndex` starting at `0`.
- *Happy path*: when `currentBlock.segments` is undefined, `currentSegmentIndex` is `-1` and the existing `subBlockIntervalSeconds` path is unchanged.
- *Integration*: `onSegmentEndTick` calls the platform-mocked `playSubBlockTick` and increments `currentSegmentIndex` exactly once per call.
- *Boundary*: when the increment would exceed `segments.length - 1`, `currentSegmentIndex` becomes `-1` (matches the U6 helper's bonus-territory sentinel).
- *Block-id change*: switching `currentBlock.id` resets `currentSegmentIndex` to `0` (or `-1` for non-segmented blocks).

*Screen integration (`RunScreen.segments.test.tsx`):*
- *Happy path*: rendering a Run state with `currentBlock.segments` present produces (a) the intro `<p>`, (b) a `<ul>` with N `<li>` rows, (c) exactly one row carries `aria-current="step"` and the "NOW" pill, (d) `<RunControls>` and `<BlockTimer>` still render in the cockpit footer.
- *Happy path*: rendering without segments produces today's `<p className="whitespace-pre-line">` and **no `<ul>`**. Pins R5 (no regression for opt-out drills).
- *Boundary*: under fake timers, advancing past the first segment boundary moves the `aria-current="step"` marker to the next row.
- **Load-bearing AE6** — *Audio-failure independence*: render with `playSubBlockTick`, `playPrerollTick`, `playBlockEndBeep` all mocked to throw or no-op (simulating silent switch + denied Wake Lock + suspended AudioContext). Advance fake timers across the first segment boundary. Assert the segment indicator advances **identically** to the audio-success case. This is the test the institutional-learnings pass surfaced as load-bearing — visible state must be independent of audio outcome per the outdoor-courtside-ui-brief cue-stack invariants.
- *Pause/resume*: render at t=20 s mid-segment-1, pause for 15 s of wall-clock time, resume, advance past the cumulative 45 s of *running* time. Assert the segment-end transition fires at the cumulative running boundary, not at wall-clock-from-resume.

**Verification:** `npm test -- SegmentList useRunController RunScreen.segments` clean; `npm test` full pass (1065 baseline + new tests); `npm run lint` clean; manual courtside dogfeed smoke on iPhone PWA — start a 15-min solo run, run the warmup with the screen briefly off (silent switch on as the audio-failure simulation) and confirm the segment indicator is correct on screen-wake.

---

- [x] **U8. Verification, copy-guard, and dogfeed-readiness pass + V2 visual iteration**

  **2026-04-28 manual-test iteration (V1 → V2).** Ran the dev server, walked through Solo + Wall 15-min on the iPhone-viewport browser, screenshotted warmup (`d28-solo`) and cooldown (`d25-solo`), confirmed pacing-math advancement on real-time timer, and identified three V1 visual issues. Iterated to V2 in `app/src/components/run/SegmentList.tsx`:

  - **Issue 1 — labels misaligned across rows.** V1 used `flex items-baseline gap-3` with a wider "NOW" pill on the active row pushing its label further right than rows with hollow-circle markers. **V2 fix:** switched to CSS grid `grid-cols-[1rem_1fr_auto] gap-x-3` so every label starts at the same x-coordinate regardless of marker shape.
  - **Issue 2 — multi-line wrap put duration on the first line.** V1's `ml-auto` right-aligned duration combined with `items-baseline` row meant a wrapping label (e.g., `d28-solo` "Quick side shuffles and pivot-back starts at game pace.", `d25-solo` "Reach arms overhead with a gentle back-bend.") had its `45s` / `30s` duration sitting next to the *first* line of the label, looking like it belonged to a mid-sentence word. **V2 fix:** applied `self-end pb-[2px]` to the duration cell so on multi-line rows it sits at the bottom of the row, aligned with the *last* text line.
  - **Issue 3 — "NOW" pill was over-chrome for the design intent.** V1's filled accent pill with uppercase "NOW" text was the heaviest visual element on the run body. The accent left-rule + bolder label weight already signal the active state clearly. **V2 fix:** replaced the pill with a small filled accent dot (`size-2.5 rounded-full bg-accent`), equal-width to the past-row check and future-row hollow ring. This is calmer (more shibui) AND removes the marker-column-width inconsistency that drove issue 1.

  V2 component test suite kept passing (10/10) with a tweak: dropped the `getByText('Now')` assertion (no longer applicable) in favor of `aria-current="step"` and `aria-live` announcer assertions which are the canonical accessibility contracts.

  Final dogfeed-equivalent walkthrough verified:
  - Warmup (`d28-solo`) advances 0 → 1 → 2 → 3 → bonus through the 4 × 45 s segments.
  - Cooldown (`d25-solo`) advances 0 → 1 → 2 → 3 → 4 → bonus through the 5 segments (60 + 30 + 30 + 30 + 30 s = 180 s).
  - Markers, labels, and durations align across all rows.
  - Wrapping rows render the duration at the end of the last line.
  - Active state (left rule + accent dot + bolder label) is glanceable without being shouty.

  **2026-04-28 V3 iteration — Shorten on warmup/cooldown rescales segments proportionally.** User dogfeed surfaced that tapping `Shorten` halved the block timer but left segment durations at authored values, so on a 90 s shortened d28 the indicator only advanced past segment 1-2 before the block ended (segments 3-4 silently never happened). The product question — "what should the per-move indicator do when the block is shortened?" — resolved to **proportional scale**: when `activeDuration < sum(segments[].durationSec)`, scale every segment by `factor = activeDuration / sum` so the user does ALL moves at proportionally shorter timing. Honors warmup-component and cooldown-stretch coverage; on-thesis with the "shorter session, less work per move" intent.

  - **Asymmetric rule.** Scaling fires only when block duration is *less than* the segment sum. When block duration *exceeds* the segment sum (e.g., d26-solo wrap on a 4-min slot), segments stay at authored times so the bonus paragraph still surfaces in overflow territory — preserving the d26 "if time remains, mirror to the other side, then add glutes / adductors" affordance.
  - **Implementation.** New pure helper `scaleSegmentsForBlockDuration(segments, blockDurationSeconds)` in `app/src/domain/runFlow/segmentTiming.ts`. Returns the same array reference when no scaling is needed (defensive against `useMemo` over-renders). `useRunController` memoizes `effectiveSegments` from `(currentBlock.segments, activeDuration)` and passes that to both `useBlockPacingTicks` and the controller return; RunScreen renders `effectiveSegments` instead of the raw `currentBlock.segments`. Display rounds duration to whole seconds via `Math.round(seg.durationSec)`; the pacing math (`computeSegmentState`) keeps the unrounded floats so cumulative ends sum exactly.
  - **Intro-copy update.** d28-solo intro changed from `"Four quick blocks, ~45 s each. End warmer than you started."` to `"Four quick movement blocks. End warmer than you started."` so the per-segment timing claim doesn't lie when shortened. d26-solo intro changed from `"...about 60 s each on one side..."` to `"...three moves to start on one side..."` for the same reason; the `"3 to 6 minutes on the timer"` range stays since it honestly reflects wrap-slot variance. d25-solo intro had no per-segment time claim and stays unchanged. The segment list is now canonical for per-move timing.
  - **Tests added (8 new, 1184 total).** Pure-helper tests cover exact-fit (passthrough), long-wrap (passthrough preserves bonus), shorten (uniform 4×45→4×22.5, non-uniform d25 60+30+30+30+30→30+15+15+15+15), id/label preservation, empty array, defensive zero/NaN, integration with `computeSegmentState`. Controller tests pin that `shortened: true` produces scaled `effectiveSegments` and `shortened: false` passes them through unchanged.
  - **Browser walkthrough verified.** Solo + Wall 15-min, Beach Prep Three warmup, paused at ~2:50 timer, tapped Shorten → block timer dropped to 1:19, segment durations dropped from `45s` to `25s` across all four rows, intro paragraph stayed honest. Resume + advance through scaled boundaries works.

  - **Known minor:** mid-block Shorten while running may fire one extra segment-end beep on the next poll because `lastSegmentIndexRef` doesn't reset when `segments` identity changes. Acceptable for v1 — the audio glitch is one tick, the indicator state is correct. If real-device dogfeed flags it, mitigate by resetting the bookkeeping ref on a `segmentsKey` change in the hook.

  **2026-04-28 V4 iteration — `eachSide` field for unilateral segments.** User dogfeed flagged that some segments are intrinsically unilateral (cross one ankle over the *opposite* knee, one arm across chest, calf with *one* back leg) but the segment timing didn't allow for both sides. d26-solo had handled this with bonus copy ("if time remains, mirror to the other side") but a 3-min wrap only stretched one side, which is incomplete cooldown. d25-solo's hip and shoulder segments simply ran one-sided.

  - **Data model.** Added `eachSide?: boolean` to `DrillSegment`. Semantics: `durationSec` is ALWAYS the total time on the timer for the segment (no math gymnastics — keeps catalog validation, scaling math, and pacing math identical to bilateral segments). `eachSide: true` is a marker that the user splits the duration between two sides; `<SegmentList>` appends a muted "(each side)" suffix to the label so the user knows to switch. The flag rides through `scaleSegmentsForBlockDuration` automatically (object spread preserves it).
  - **`d26-solo` — mirror promoted from bonus to floor.** All three stretches marked `eachSide: true`. Durations stay at 60 s each (~30 s per side). `durationMinMinutes: 3` unchanged. Bonus copy dropped the "mirror to the other side, then" clause — mirroring is now built into each segment. Bonus is now purely accessory: `"If time remains, add glutes (back of hips) or adductors (inner thighs)."`
  - **`d25-solo` — workload bumped from 3 to 4 min.** Hip stretch (s3) and shoulder stretch (s5) marked `eachSide: true` and durations bumped from 30 s to 60 s (~30 s per side). Segment sum: 60 + 30 + 60 + 30 + 60 = 240 s. `durationMinMinutes` lifted from 3 to 4 to match. Intro copy adjusted from "three to four short stretch holds" to "four short stretch holds" (the shoulder stretch is no longer optional). Wrap-slot ramifications: every authored wrap slot has `min ≥ 3`, so d25 with `min: 4` is still eligible whenever the slot allocates ≥4 min. On 15-min `wrap(3, 4)` slots the allocator picks d26 when 3 min and either when 4 min — d25 becomes the longer-form unilateral cooldown, d26 the compact 3-min option. Differentiation, not loss of coverage.
  - **`d28-solo` unchanged.** No unilateral segments — all warmup activities are bilateral movement.
  - **Visual treatment.** SegmentList renders `{label}<span className="text-text-secondary"> (each side)</span>` when `eachSide: true`. Muted text-secondary (#4b5563) sits inline at the label end, communicating "metadata about the segment" rather than "part of the action." Active row pairs darker primary label text with the muted suffix for clear visual hierarchy; future rows have both in muted tones, blending naturally as a single label phrase.
  - **Tests added (5 new, 1189 total).** SegmentList renders "(each side)" suffix only on `eachSide: true` segments (counted across active/past/future states; verified absent for bilateral-only segments; verified muted color class). drillCopyRegressions pins all three d26 stretches as `eachSide: true` and asserts the bonus copy explicitly does NOT contain "mirror to the other side." sessionBuilder asserts d25 sum is 240 with 2 eachSide segments and d26 sum is 180 with 3 eachSide segments; updated archetype-wrap-floor guard expects per-drill sums (180 for d26, 240 for d25) instead of a flat 180.
  - **Browser walkthrough verified.** Solo + Wall 15-min, ran through warmup → technique → main_skill → cooldown. d26 cooldown showed all 3 segments with "(each side)" suffix at 60s each. Tapped Pause + Shorten → segments rescaled to 38s each, "(each side)" suffix preserved on all three. Layout, colors, and accessibility unchanged.

  **V4 watching point — "(each side)" suffix vs per-side timer split.** When the V4 design landed, the founder voiced (2026-04-28) that a *timer per side* (each side as its own segment with its own 30 s clock and a switch-side beep at the boundary) might be clearer than a single 60 s segment with a "(each side)" suffix that asks the user to mentally split. Decision: ship V4 as-is and let dogfeed evidence drive the swap. Founder feature wishes are *input* per `D135`, not first-class trigger evidence — but real-use ambiguity is.

  - **V5 alternative design (pre-staged).** Switching to a per-side timer is a **pure authoring change, no pipeline code change required.** The current data model already supports it: instead of `{ id: 'd26-solo-s1', label: 'Calf: ...', durationSec: 60, eachSide: true }`, an author splits into two segments — `{ id: 'd26-solo-s1a', label: 'Calf (right side): ...', durationSec: 30 }` and `{ id: 'd26-solo-s1b', label: 'Calf (left side): ...', durationSec: 30 }`. `<SegmentList>` renders two rows naturally, the per-segment end beep fires at every side switch, `computeSegmentState` advances the indicator on each side, and `scaleSegmentsForBlockDuration` scales both halves uniformly when Shorten fires. The `eachSide` flag becomes unused on the affected drills (it can stay reserved on the type for any future use case where a single timer with a midpoint switch is genuinely the right answer; see V5 trade-offs below).

  - **V5 visual ramifications.** Per-side split doubles the affected drills' segment count visually:
    - `d26-solo`: 3 rows → 6 rows (calf R/L, hamstring R/L, hip flexor R/L) at 30s each.
    - `d25-solo`: 5 rows → 7 rows (walk, sit, hip R/L, back-bend, shoulder R/L) at mixed durations.
    - The increased row count is the cost of explicitness; reading multiple rows of the same anatomy ("Calf (right)" / "Calf (left)") may feel repetitive at courtside speed. Mitigation if V5 is taken: visually indent or cluster the two sides under a shared anatomy header, or use compact "right/left" toggling inline.

  - **V5 trigger evidence (specific).** Switch to V5 if any of:
    1. **Founder dogfeed records explicit ambiguity in `note`.** Phrases like "forgot to switch sides," "didn't realize the segment was both sides," "ran out of time on left side," "the (each side) was unclear" appearing in a `docs/research/founder-use-ledger.md` row. One occurrence is suggestive; two on independent sessions formally triggers V5.
    2. **Partner walkthrough ≥P1 specifically on the (each side) ambiguity.** A partner saying "I didn't switch sides" or "wait, was that both sides?" when running d25 or d26 in a scripted walkthrough.
    3. **Audio-pacing reliability investigation surfaces a need for a midpoint cue.** If the audio investigation shows that a switch-side beep is required (e.g., for users who can't see the screen during a stretch), per-side split provides the cue stack natively (each "side" segment ends with a beep at its boundary).

  - **What we'll watch in dogfeed.** Specifically: does the founder mid-session confuse "(each side)" semantics? Does the founder finish d26's calf segment having only stretched the right side? Does the segment indicator advance at the right cadence relative to perceived "I just switched sides" moments? A clean V4 dogfeed would have segments advancing at boundaries where the founder *also* feels the natural midpoint flip. A failed V4 dogfeed has the indicator advance while the founder is still on side one.

  - **Don't swap pre-emptively.** V4 is on the courtside-copy.mdc rule 6 jargon-gate-friendly side ("(each side)" is a 1-word note that reads in 100 ms; per-side row split is more chrome). V5's case rests on real-use ambiguity, not aesthetic preference. The data structure stays additive and forward-only either way — picking V5 later is a per-drill authoring sweep, not a regression risk.

  **2026-04-28 V5 deferred — per-side timer with midpoint cue.** Founder noted post-V4: "I feel like it would be confusing and the timer per side would be good personally, but we can start with this and see how it goes." Concern is valid: the current "(each side)" suffix is a *reminder* but not *help* — for a 60s segment the user has to guess when the midpoint is and switch on their own. The treatment communicates "this is unilateral" but does no work to enforce the switch.

  **V5 product shape (when triggered):**
  - At each segment's midpoint (`durationSec / 2`), `useBlockPacingTicks` fires a distinct beep — different timbre from `playSubBlockTick` so the user can tell "switch sides" from "next segment." Likely: reuse `playSubBlockTick` (same chime as segment-end) since differentiation isn't worth a new oscillator until dogfeed asks for it. Acceptable to ship V5 with one beep at the midpoint identical to the segment-end beep; the timing context (mid-segment vs end-of-segment) carries the meaning.
  - The active row's marker switches from a single accent dot to a half-filled / two-dot indicator showing "side 1 of 2" / "side 2 of 2"; OR a small "Switch" pill replaces "(each side)" briefly when the midpoint fires; OR the active label flips to a brief "Switch sides" prompt for ~2s before reverting. Decide on visual at V5 time based on the rest of the screen state.
  - Pacing-hook math: extend `computeSegmentState` to return a `sideEndingNow: boolean` flag (or similar) when the elapsed time crosses a midpoint of an `eachSide: true` segment. The hook fires `onSegmentEndTick` (or a new `onSideSwitchTick` callback) at that moment.
  - Display: the duration column on `eachSide` rows could optionally show "30s × 2" instead of "60s" so the user sees both the per-side budget and the bilateral structure. Pure metadata addition.

  **V5 trigger criteria:**
  1. Founder dogfeed (or partner walkthrough) explicitly reports "I forgot to switch sides" or "I didn't know when to switch" on at least one of `d25-solo` / `d26-solo`, OR
  2. Real-use ledger row notes the V4 "(each side)" treatment was insufficient (e.g., founder consistently does only one side despite the suffix), OR
  3. Two consecutive sessions where `d26` cooldown completes with the founder still on one side past the segment-end boundary.

  **What's already in place for V5:**
  - `DrillSegment.eachSide` flag is the structural seam — no data model change needed.
  - `scaleSegmentsForBlockDuration` already preserves `eachSide` through Shorten; midpoint math will scale alongside.
  - The audio infrastructure (`platform/playSubBlockTick`) supports another tick fire-point without code changes.

  Until V5 triggers, the V4 "(each side)" treatment is the documented stance: explicit metadata, user-managed side switch, no audio commitment.

**Goal:** Final integration sweep before ship. Ensure no regression on existing flows; ensure copy-guard rules pass; pre-stage a dogfeed checklist for the next founder session.

**Requirements:** R1–R8 collectively (no regression).

**Dependencies:** U1–U7.

**Files:**
- Verify: `app/src/lib/copyGuard.ts` and `app/src/lib/__tests__/copyGuard.phase-c-surfaces.test.tsx` (pacing surface unchanged; no new copy violations from the segment authoring on `d25-solo`, `d26-solo`, `d28-solo`)
- Verify: existing E2E Playwright tests in `app/e2e/session-flow.spec.ts` (segment surface is not E2E-tested directly; smoke that the run flow still completes when the warmup or wrap drill carries segments)
- Update: `docs/status/current-state.md` (Recent Shipped History entry on ship)
- Update: `docs/decisions.md` (add a brief decision row if the `d25-solo` workload-floor bump is taken — small product-shape change worth recording)
- Update: `docs/research/founder-use-ledger.md` (operating note: "next dogfeed should glance-check the segment indicator survives audio drop")
- Update: `docs/catalog.json` (add the brainstorm + plan + ideation triple)

**Approach:**
- Run `npm test` (expect 1065 + new tests; baseline holds).
- Run `npm run lint`, `npm run typecheck`, `npm run build`.
- Manual iPhone PWA smoke (founder courtside or living-room dry run): start a 15-min solo session that selects `d28-solo` warmup + `d26-solo` wrap, run through warmup with screen on, run through cooldown with silent switch on. Expectation: segment indicator advances normally regardless of audio state; bonus footnote appears at end on long wrap.
- If `d25-solo.workload.durationMinMinutes` was bumped (U5 option a), verify session-builder slot picks under all M001 archetypes (15 / 25 / 45 min) still produce sensible plans.

**Patterns to follow:**
- The 2026-04-28 architecture pass §"final holistic red-team gate" pattern — one consolidated verification commit that closes the ship.

**Test scenarios:**
- *Integration*: `npm test` returns clean, with the new tests counted; existing 1065/1065 baseline holds.
- *Manual*: at least one founder courtside session running `d28-solo` warmup with the segment indicator visible.
- *Manual*: at least one cooldown run with audio suppressed (silent switch on) confirming visible segment progression.

**Verification:**
- All automated tests pass.
- Lint + typecheck + build clean.
- Manual smoke completed and notes added to `docs/research/founder-use-ledger.md`.

---

## System-wide impact

- **Interaction graph**: `RunScreen` is the only render surface affected. `TransitionScreen` is intentionally unchanged (out of scope). `SafetyCheckScreen` is unchanged. `useSessionRunner` is unchanged (segments live in plan-block snapshot only; runner is identity-preserving).
- **Error propagation**: a malformed persisted plan with `segments` that don't sum correctly is handled by the runtime guard in U6 (falls back to no-segments rendering, console-warns). Catalog validation prevents this at author time; the runtime guard exists for forward-compat (hand-edited plans, stale Dexie rows from before this ship).
- **State lifecycle risks**:
  - Pause/resume preserves `lastSegmentIndexRef` (covered by U6 tests).
  - Skip/Next freezes segment list (covered by U7 controller tests).
  - Block-id change resets segment bookkeeping (existing `useBlockPacingTicks` reset effect handles this).
- **API surface parity**: `swapAlternatives` carries `segments` so a mid-session swap surfaces the alternative's segment data correctly (U1 covers).
- **Integration coverage**: the hook → controller → screen wiring is end-to-end covered by U6 + U7 tests; the screen-integration test in `RunScreen.segments.test.tsx` proves the chain.
- **Unchanged invariants**:
  - Session assembly (`pickForSlot`, `findSwapAlternatives`) does not change selection logic; segments are passive metadata.
  - Drill Check (per-block capture surface) is unchanged.
  - Review aggregation is unchanged.
  - `subBlockIntervalSeconds` semantics for any future drill that opts out of segments is preserved exactly.
  - Wake-lock + audio-priming behavior shipped on 2026-04-24 + 2026-04-28 is unchanged.

---

## Risks & dependencies

| Risk | Mitigation |
|---|---|
| Author drift: segments sum doesn't match workload floor on a future ship | Catalog validation rule in U2 + drill-copy regression tests in U3/U4/U5 — drift fails CI |
| `useBlockPacingTicks` adds a third responsibility, gets harder to read | Pure helper in U6 (`segmentTiming.ts`) keeps the math out of the hook; hook stays thin |
| Pause/resume off-by-one or double-fire bug | Pure-helper unit tests in U6 cover the boundary cases explicitly |
| Bonus paragraph regression: `d26-solo` voice loses the "mirror / glutes / adductors" expansion | U4 explicitly authors `courtsideInstructionsBonus` and U7 renders it on overflow |
| `d25-solo` `durationMinMinutes` bump (U5 option a) displaces another wrap drill in session assembly | U5 verification step requires running session-builder regression tests; option (b) available as fallback |
| Visible segment indicator is too subtle outdoors (V1 vs V2/V3 from ideation) | Ideation §V2/V3 retained as fallback; data contract identical, only `<SegmentList>` visual swaps |
| End-of-segment beep is functionally less audible than uniform tick | Same sound (`playSubBlockTick`); cadence on `d28` (45 s) and `d26`/`d25` (30–60 s) is in the same envelope as today's uniform tick |

---

## Documentation / operational notes

- Update `.cursor/rules/courtside-copy.mdc` §7 ("timed sub-blocks need audible structure"): replace the "shipping gap" prose with a pointer to this plan and to the `DrillSegment` type. Authors of new timed drills now have a real shape to author against.
- `docs/catalog.json` gets three new entries: ideation, brainstorm, plan.
- `docs/status/current-state.md` Recent Shipped History entry on ship.
- `docs/research/founder-use-ledger.md` operating note: queue a glance-check on the next dogfeed for the segment indicator's survival under audio failure.
- No `docs/decisions.md` change unless U5 option (a) is taken (then add a small decision row noting the `d25-solo` floor change).

---

## Sources & references

- **Origin requirements**: [docs/brainstorms/2026-04-28-per-move-pacing-indicator-requirements.md](../brainstorms/2026-04-28-per-move-pacing-indicator-requirements.md)
- **Origin ideation (sub)**: [docs/ideation/2026-04-28-per-move-pacing-indicator-ideation.md](../ideation/2026-04-28-per-move-pacing-indicator-ideation.md)
- **Parent ideation (S1 cluster)**: [docs/ideation/2026-04-28-what-to-add-next-ideation.md](../ideation/2026-04-28-what-to-add-next-ideation.md)
- **Field signal**: [docs/research/2026-04-28-build17-pair-dogfeed-feedback.md](../research/2026-04-28-build17-pair-dogfeed-feedback.md) §F3
- **Audio boundary**: [docs/research/2026-04-28-audio-pacing-reliability-investigation.md](../research/2026-04-28-audio-pacing-reliability-investigation.md)
- **Walkthrough provenance**: [docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md](../research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md) §"Genuinely-open Tier 1b bundle"
- **Snapshot pipeline reference**: `subBlockIntervalSeconds` lifecycle across `app/src/types/drill.ts`, `app/src/model/draft.ts`, `app/src/model/session.ts`, `app/src/domain/sessionBuilder.ts`, `app/src/domain/sessionAssembly/swapAlternatives.ts`, `app/src/services/session/commands.ts`, `app/src/hooks/useBlockPacingTicks.ts`, `app/src/screens/run/useRunController.ts`
- **Courtside-copy invariants**: `.cursor/rules/courtside-copy.mdc` (rules 5 + 7 most relevant)
- **App layer rules**: `.cursor/rules/data-access.mdc`, `.cursor/rules/component-patterns.mdc`, `.cursor/rules/testing.mdc`
