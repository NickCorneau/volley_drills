---
id: 2026-06-11-design-language-deep-pass
title: "Design-Language Deep Pass: Challenge, Reconcile, Polish (2026-06-11)"
status: active
stage: validation
type: design-review
summary: "Founder-directed deep pass on the design language following the same-day red team: re-read the three design canon docs against shipped code and a full live 390×844 walk, challenged the language on shibui/ma first principles, resolved the routed D145 phantom-state finding (D153: retract 0-b/0-d, ratify shipped centered Review h1 + danger discard confirm under forfeit semantics), shipped two polish wins (stacked cue lines; quiet Review empty-aggregate voice), and corrected seven stale canon passages in brand-ux-guidelines.md. Most challenge candidates were falsified against deliberate-decision rationales and are recorded here so future passes do not re-surface them. A same-day fresh-eyes follow-up after D152 landed fixed the Now-surface multi-cue run-on, floored the ended-early shorter-repeat offer, made the ended-early meta line report trained-vs-planned minutes, and folded D152's Home card internals into §7.1."
authority: "Point-in-time design pass capture. Not source of truth on its own. D153 in docs/decisions.md owns the decisions; brand-ux-guidelines.md owns the corrected canon."
last_updated: 2026-06-11
depends_on:
  - docs/research/brand-ux-guidelines.md
  - docs/research/outdoor-courtside-ui-brief.md
  - docs/research/japanese-inspired-visual-direction.md
  - docs/design/reviews/2026-06-11-red-team-design-language-review.md
related:
  - docs/reviews/2026-06-11-red-team-review.md
  - docs/design/reviews/2026-05-24-agent-e2e-design-critique.md
decision_refs:
  - D91
  - D104
  - D127
  - D134
  - D145
  - D153
---

# Design-Language Deep Pass: Challenge, Reconcile, Polish (2026-06-11)

## Agent Quick Scan

- Follow-on to the same-day red team (`2026-06-11-red-team-design-language-review.md`). That pass graded and routed; this pass **challenged, reconciled, and shipped**.
- The routed D145 phantom-state finding is now **resolved by `D153`**: 0-b and 0-d are retracted as mis-measured; shipped code (centered Review h1, danger discard confirm) is ratified as the better design on its own merits.
- Two polish wins shipped: **stacked cue lines** (Transition `Cue` panel + Run `Full coaching cue` disclosure) and the **quiet Review empty-aggregate voice**.
- Seven stale `brand-ux-guidelines.md` passages corrected to match verified shipped code (§1.3, §2.3, §4.4, §4.6, §6.4, §7.4, §7.5, §7.6, §8.2).
- Most challenge candidates were **falsified against deliberate-decision rationales** — see the disposition table before re-proposing any of them.
- A same-day fresh-eyes pass after `D152` landed shipped three follow-ups: the `Now` surface multi-cue fix, the ended-early shorter-repeat floor + honest trained-minutes meta, and the §7.1 canon fold-forward (see final section).

## Method

- Re-read the three design canon docs (`japanese-inspired-visual-direction.md`, `outdoor-courtside-ui-brief.md`, `brand-ux-guidelines.md`) plus `index.css` tokens and the `components/ui/` primitives, this time adversarially: for every canon claim, verify it in code; for every code choice, ask whether it serves shibui/ma or merely accumulated.
- Full live walk at 390×844 CSS px on the dev server: Home, Setup, Safety, Run (active + paused + segmented), Transition, Drill check, Review, Complete, Settings, onboarding Skill level. Screenshots taken per screen during the walk (session-local, not archived — the red-team doc carries the durable grades).
- Every fix candidate was checked against git history, inline code comments, and decision rows before touching anything. Candidates that collided with a documented deliberate choice were dropped and recorded below.

## Resolved: the D145 phantom states (D153)

The red team verified that `D145` 0-b and 0-d record shipped states that never existed and routed the call to the founder. This pass, under the founder's "challenge it, clean it up" directive, resolved it as **retract-and-ratify** (`D153` in `docs/decisions.md`):

- **Review h1 stays centered.** It sits in the run-family header row (`SafetyIcon` left + centered title + 56 px spacer) shared with Run / Transition / Drill check. Review is a run-flow surface — it carries the `SafetyIcon`, not a Back button. Left-aligning it (what D145 0-b prescribed) would have forked the one header pattern the whole run flow shares, for a speculative adjacency gain with the cards below.
- **Discard-resume confirm stays danger.** D145 0-d's "red mis-signals data loss" carve-out was internally inconsistent: End-session-early *also* preserves progress to history and stays danger. The coherent semantic for the two-tap `Yes, …` danger treatment is **irreversible forfeit of the live session** (resumable run / remaining blocks / review window), not data loss — and all three confirms already painted it consistently. The confirm copy carries the data-honesty load.
- Why retract rather than implement: implementing the phantom states would have *introduced* the inconsistencies D145 thought it was preventing. D145 0-a (onboarding header asymmetry) and 0-c (quiet-tertiary tier) were re-verified against code and stand.

## Shipped polish

### 1. Cue lists stack one per line

`sessionBuilder` joins a drill's `coachingCues[]` with `' · '` into the stored `coachingCue` string. Two display sites rendered that joined string raw, producing a run-on paragraph where cues ending in a period collided with the separator (`". · "`) and a 5-cue drill read as a wall of text instead of the READ-DO checklist it is.

- New `splitCueLines()` in `lib/format.ts` (alongside the now-exported `CUE_SEPARATOR` that `currentCue.ts` shares) splits stored strings back into lines; handles embedded newlines; stored plan data untouched, so older saved plans render identically.
- Transition `Cue` panel and the Run `Full coaching cue` disclosure now stack one cue per line at `text-base leading-relaxed`. The live `Now` surface (first-clause extraction) is unchanged.
- Verified live at 390×844: the Transition cue panel reads as a four-line checklist behind the accent rule; CTA stays above the fold. Tests updated (`RunScreen.run-face.test.tsx` scopes the `Now` assertion and asserts per-line content).

### 2. Review empty-aggregate voice quieted

"Counts not logged for any drill." rendered in the pass-rate result voice (`text-base font-semibold` primary) — the heaviest ink on the card announcing an absence. Now `text-sm text-text-secondary` per the §6.2 empty-state voice; the real aggregate keeps the result voice.

## Canon corrections shipped (brand-ux-guidelines.md, doc-only)

All verified against code in this session before writing:

| § | Was (stale) | Now records |
| --- | --- | --- |
| §7.6 | Review h1 "left-aligned" (D145 0-b) | Centered, run-family header row; 0-b retracted |
| §8.2 | Neutral discard carve-out (D145 0-d) | Danger ratified; forfeit semantics named; End-session bottom-sheet (`ConfirmModal`, safe-first) recorded |
| §4.6 | "End session → navigation rather than a modal" | Points at the §8.2 bottom-sheet confirm |
| §6.4 | Disabled primary = "same accent at `opacity-50`" | Neutral-gray "not yet" (`bg-text-secondary/10`), with the anti-invite rationale from `Button.tsx` |
| §4.4 | Quick Review cards + Complete recap listed as focal cards | Both are `Card` **soft** surfaces; focal stays the one-block-per-screen white card |
| §2.3 | Quiet-tertiary row missing its form | Permanent `underline underline-offset-2`, content-width `mx-auto`, `text-sm font-medium` |
| §7.4 / §7.5 | Run controls "Pause becomes Resume + Shorten / End session"; Transition "tertiary Shorten block" | Active-face `Swap drill`; paused 4-action grid (Swap / Shorten / Skip block / End session, warning-strong label); Transition `Swap drill` + `Shorten` secondary pair + ghost `Skip block` |
| §1.2 / §1.3 | Wordmark listed under `font-bold (700)` | Removed; 700 list now matches code (verdict, timer digits, modal h2s, `ErrorBoundary`) |

## Challenged and falsified — do not re-surface without new evidence

| Challenge candidate | Why it was dropped |
| --- | --- |
| Remove "Tap Resume to continue" helper on the paused timer | Deliberate founder-field-feedback addition (inline comment in `BlockTimer.tsx`): the paused state was not obviously actionable courtside. The helper is the fix, not the noise. |
| Dedupe "You aimed for / Success rule" between Drill check rubric and `PerDrillCapture` | Deliberate: the success rule must sit next to the count inputs it scores (`D104` scored-contact gating, `D134` capture shapes). Distance between rule and input is the costlier failure. |
| Tone down the Setup duration-honesty `Callout` stack | Data honesty outranks visual calm here (§9.2 lineage); the callout names a real mismatch between requested and assembled duration. |
| Rename recap `Moderate` to match the `Right` input chip | The chips map to documented Borg anchors (`RpeSelector.tsx`: Easy→3, Right→5, Hard→7) and `effortLabel` renders the band name. Input voice ("how did it feel?") and recap voice ("what was it?") legitimately differ. |
| Narrow the warning tone (Safety `Today` chip, ended-early reasons) to destructive-only | Deliberate breadth: warning marks "needs attention / honest caution," not only destruction. A vocabulary split (caution vs destructive) is a real future question but needs its own pass with token work, not a drive-by. |
| Demote `Swap drill` off the active run face | Phase F Unit 4 records Swap as a first-class mid-run action by spec; founder-use period is the wrong time to bury it. |

## Open proposals (next pass candidates, not commitments)

- **Warning-tone vocabulary split** — separate "caution" from "destructive" if the warning palette starts carrying too many meanings. Watch for confusion evidence in founder use first.
- **12 px paused-grid labels and the 14 px body floor** — still the weakest outdoor-brief area; deadlocked on `D127`'s `D91` trigger. Natural re-owner: the 2026-07-20 `D130` window close (red-team routing stands).
- **Home focal competition** — re-assessed same-day after `D152` landed (see follow-up below): the common completed-session card reads clean; the ended-early density finding was fixed with the shorter-repeat floor. The broader competition question stays open for founder-use evidence.

## Verification

- Targeted unit tests for the touched screens pass (`RunScreen.run-face`, Review draft/aggregate suites).
- Full `app/` suite + lint + typecheck run at the end of the pass (see repo terminal log, 2026-06-11).
- `bash scripts/validate-agent-docs.sh` after the docs/catalog updates.

## Same-day follow-up: fresh-eyes pass after D152 landed

A second walk at 390×844 with fresh eyes, after the M002.1 home-coherence work (`D152`) and this pass's polish were both live, found and fixed three residuals:

1. **`Now` surface multi-cue run-on.** A multi-cue join short enough to fit `CUE_COMPACT_MAX` rendered whole on the Run `Now` panel as a `". · "` run-on — the same collision the stacked-line fix removed from the disclosure sites. `currentCue.ts` now always extracts the lead cue from a multi-cue join regardless of total length; the full list stays one tap away. Regression test added.
2. **Ended-early card was a menu.** Primary CTA + three identical underlined links, including a "Repeat shorter version (3 min)" offer. The shorter-repeat now floors at `REPEAT_SUBSET_MIN_MINUTES` (10) completed minutes (`domain/policies.ts`); below it the card keeps the normal two-link set.
3. **Planned-vs-trained dishonesty (§9.2).** The ended-early meta line reported planned minutes ("38 min") when only 6 were trained. It now reports `{trained} of {planned} min` using `sessionDurationMinutes` — the same duration basis as Review's meta line — falling back to the planned total for legacy logs.

Canon: §7.1 Home was folded forward in the same pass — `D152` card internals (labeled `Last session:` metadata, `Start {focus} session` focal CTA, `Then:` queue line, merged Recent header) plus the floor and honest-duration corrections are now recorded.
