---
id: comps-2026-06-12-shibui-polish
title: Shibui Polish Comp Set — Setup Recommendation-First + Home Link Relocation
status: active
stage: validation
type: design-comps
summary: "Founder-review 390x844 comp frames for the S1 Setup recommendation-first restructure (origin R4-R6) and the S5 Home link-pile relocation (origin R1-R3). Artifacts only - no application code ships with these; approval gates the follow-up implementation plans."
authority: comp-review artifact set for the 2026-06-12 shibui polish plan Tier 2 units (U5/U6)
last_updated: 2026-06-12
depends_on:
  - docs/brainstorms/2026-06-11-shibui-empty-space-polish-requirements.md
  - docs/plans/2026-06-12-002-feat-shibui-empty-space-polish-plan.md
  - docs/research/brand-ux-guidelines.md
  - docs/research/outdoor-courtside-ui-brief.md
---

# Shibui Polish Comp Set (2026-06-12)

## Purpose

Founder-reviewable comps for the two comp-gated items of the shibui/empty-space polish pass:

- **Setup recommendation-first restructure** (origin R4–R6; plan unit U5)
- **Home link-pile relocation** (origin R1–R3; plan unit U6)

All frames are full-viewport 390×844 captures from the live dev build with DOM/CSS overrides composed **only from existing design tokens and type/spacing classes** — every treatment shown translates directly to shippable Tailwind classes. No S1/S5 application code is committed with this set.

## How These Were Made

Dev server + browser device emulation (390×844 @2x), per the headless-preview screenshot ladder in `docs/solutions/workflow-issues/`. Overrides: injected focal line (`text-lg font-semibold leading-snug text-text-primary`), section-heading class swaps, body `gap-*` token swaps, and DOM relocation of existing `Button variant="link"` nodes. Live data: the 5173 dev profile's real session history (an ended-early `Pair + Net` session), so meta lines and assembled totals are real app output, not lorem.

## Setup Frames (origin R4–R6, AE2–AE3)

The focal line's minute segment always shows the **assembled preview total** (38 min for the returning Pair + Net 40-min profile) — the same number the duration-honesty Callout reports, never the named Time-chip profile (R4: the screen's two duration statements can never disagree).

| Frame | State | Decision it carries |
|---|---|---|
| `setup-01-returning-quiet-labels.png` | Returning user, resolved: `Pair + Net · 38 min · Recommended focus` | **Heading option A** — quiet uppercase micro-labels (`text-xs font-medium uppercase tracking-wider text-text-secondary`), cluster at `gap-4` |
| `setup-02-returning-sentence-labels.png` | Same state | **Heading option B** — sentence-case quiet labels (`text-sm text-text-secondary`) |
| `setup-03-returning-tight-cluster.png` | Same state | **Spacing option** — option-A headings with the refine cluster tightened to `gap-3` |
| `setup-04-explicit-focus.png` | Explicit focus chosen: `Pair + Net · 38 min · Passing focus` | Focal line tracks chip changes (R4); explicit-focus wording variant |
| `setup-05-first-run-default.png` | First-run/onboarding default: `Solo + Net · 15 min · Recommended focus` | R5 — same shared component/layout, demonstrated on the cold-start defaults |
| `setup-06-incomplete-wall.png` | Solo + no net, wall follow-up unanswered | R4 non-happy path — focal slot renders the quiet secondary-voice placeholder (`Choose wall or fence availability to build.`, mirroring the existing incomplete hint), footer hint + disabled Build shown honestly |
| `setup-07-callout-slim.png` | Returning resolved + slimmed Callout (`About 38 min.`) | The origin's "Callout copy slim-down" question, shown against the focal line that now also carries the minutes |

### Decisions deferred to this comp review (Setup)

1. **Refine-cluster heading treatment** — option A (uppercase micro-labels, frames 01/03–07) vs. option B (sentence-case quiet, frame 02).
2. **Refine-cluster spacing** — `gap-4` (frame 01) vs. `gap-3` (frame 03).
3. **Callout copy slim-down** — keep `This session will run about N min.` (frames 01–06) vs. `About N min.` (frame 07), now that the focal line also states the assembled minutes.
4. Focal-line wrap: at 390 px the `Recommended focus` returning line wraps to two lines (frames 01–03, 05); the explicit-focus line fits on one (frame 04). Accept the wrap, or shorten the trailing segment (e.g. `Recommended`).

### R6 guardrails (restated)

- No contrast or tap-target loss against the outdoor brief floors.
- Chips must still read as obviously tappable (signifier check) — chip rendering is untouched in all frames.
- The duration-honesty Callout keeps its current weight and position relative to the Build CTA (frames 01–06; frame 07 changes only its copy, not weight/position).

## Home Frames (origin R1–R3, AE1)

Relocated links keep the existing `Button variant="link"` quiet-tertiary treatment; the page field sits between the focal card and Recent sessions (placement relative to Recent sessions is visible in every frame — R3's collision concern). All link behavior (routes, intercepts, `REPEAT_SUBSET_MIN_MINUTES` floor, disabled states) is unchanged by the proposal (R2).

| Frame | State | Decision it carries |
|---|---|---|
| `home-01-normal-repeat-in-card.png` | Normal post-session | **R1 option A** — `Repeat last session` stays as the card's one quiet link; only `Start a different session` moves to the page field |
| `home-02-normal-repeat-moved.png` | Normal post-session | **R1 option B** — card interior ends at the `Then:` queue line; both links move to the page field |
| `home-03-ended-early-maximal.png` | Ended early (real data: `15 of 37 min`), all three links live | **R2 maximal state** — `Repeat full plan` stays as the card's one quiet link; `Repeat shorter version (15 min)` + `Start a different session` form the page field. The three-deep underlined stack inside the card is dissolved without recreating it below |

### Decisions deferred to this comp review (Home)

1. **Do the `Repeat` links move too?** (origin R1) — frame 01 (kept in card) vs. frame 02 (moved). Frame 03 shows the implied ended-early consequence of keeping one repeat link in the card.
2. **Page-field density** — the two-link field uses `gap-1`; tighter/looser is a one-token change at implementation.

### R3 rider

If the Home covenant's render-budget test exists by S5 ship time, the S5 PR updates the pinned census in the same change (see the plan's Deferred to Follow-Up Work).

## Home v2 Frames (2026-06-12 founder feedback iteration)

Same-day founder feedback on the live ended-early Home card: the card is crowded, the `Last session:` meta line wraps to two lines with too much info, the focal CTA is not visibly the *recommended* action, and the three-link stack has uneven spacing and is too many links to scan. The v2 frames respond to that feedback on the same live ended-early state (`Pair + Net · 4 of 38 min`).

Shared v2 moves (all three frames):

- All three links leave the card into a `gap-1` page field (R1 option B, extended to the repeat links), dissolving the uneven `-mt-2`/`gap-2`/44-px-hit-target rhythm of the in-card stack.
- A quiet uppercase eyebrow (`text-xs font-medium uppercase tracking-wider text-text-secondary`, copy `Recommended`) sits directly above the focal CTA — same micro-label vocabulary as the Setup option-A frames.
- Link behavior unchanged (R2 guardrail); 44-px tap targets kept.

| Frame | Meta line | Link field | Decision it carries |
|---|---|---|---|
| `home-v2-01-minimal-card.png` | **Removed** — Recent sessions' top row (`Today · Passing · Partial`) already carries last-session recency/outcome | 3 stacked links | Most-stripped card: greeting + eyebrow + CTA + `Then:` queue line only |
| `home-v2-02-repeat-inline.png` | Removed | 2 rows — `Repeat full plan · shorter version (10 min)` inline pair + `Start a different session` | Fewer visible link rows; inline pair keeps both repeats one tap with shared context |
| `home-v2-03-trimmed-meta.png` | **Trimmed to one line** — `Pair + Net · ended early today` (drops `Last session:` prefix + `4 of 38 min`) | 3 stacked links | Keeps an in-card continuity cue without the wrap; minutes honesty moves to the shorter-repeat label alone |

### Decisions deferred to this v2 review (Home)

1. **Meta line** — remove entirely (v2-01/02, Recent sessions owns history) vs. trimmed one-liner (v2-03). Note: removing the line also removes the in-card "ended early" context that motivates `Repeat full plan` vs `Repeat shorter version`.
2. **Eyebrow copy** — `Recommended` (shown) vs. `Recommended next` vs. none (founder said the unlabeled CTA was "maybe fine").
3. **Repeat-link consolidation** — stacked (v2-01/03) vs. inline pair (v2-02). The inline pair shortens the second label to `shorter version (10 min)`; both segments stay independent 44-px buttons.
4. Supersedes the v1 Home question "do the Repeat links move too?" — founder feedback ("3 links are just too many") reads as yes; v1 frames 01/03 (repeat kept in card) remain for reference.

### v2-04: repeat-removal frame (founder follow-up, 2026-06-12)

Founder follow-up question on the v2 frames: do the repeat links need to exist at all, given Setup already pre-fills the physical chips from `getLastContext()` ("I don't think I'd ever used repeat plan")? `home-v2-04-no-repeat.png` shows that end state: the v2-01 minimal card with **both repeat links removed** — the page field is the single `Start a different session` escape hatch.

What removal gives up (for the decision record): one-tap verbatim repeat with the same focus (the Setup path pre-fills conditions but resets focus to Recommended, so a true same-focus repeat costs one extra chip tap), and the ended-early subset rebuild (`Repeat shorter version` is the only path that rebuilds exactly the completed blocks). Removal would retire the 2026-04-22 one-tap-Repeat decision surface, the repeat-drift note (trust-loop U5/R8), the `REPEAT_SUBSET_MIN_MINUTES` floor, and the HomeSecondaryRow repeat action — a `docs/decisions.md` entry, not just a UI edit.

## Founder Comp Decisions (recorded 2026-06-12)

- **Setup: frame `setup-01-returning-quiet-labels.png` chosen** ("liked setup 1 the most") — heading option A (quiet uppercase micro-labels) at `gap-4` cluster spacing. Implicitly accepts the two-line focal-line wrap shown in that frame (open question 4). Callout copy stays unchanged (conservative default; frame 07's slim variant not chosen).
- **Home: direction is the v2 family** (links out of the card, `Recommended` eyebrow, meta line removed); final variant pending the repeat-removal call (v2-01/02 vs. v2-04).

## What Approval Unlocks

Founder approval of a variant per question above unlocks the follow-up implementation plans: S1 Setup restructure code (R4–R6) and S5 Home relocation code (R1–R3, carrying origin R11 — the Home covenant "Deferred for later" amendment — and the D152 decision-row update).
