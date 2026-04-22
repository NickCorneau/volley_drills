---
id: trifold-synthesis-2026-04-22
title: "Trifold synthesis — workflow × shibui × design review (2026-04-22)"
status: active
stage: validation
type: research
summary: "Three-way synthesis of the 2026-04-22 workflow manual test, the 2026-04-22 shibui/attention/respect pass, and the 2026-04-22 manual UI/design review. Names the seven convergences now held by all three lenses, the craft-level additions the design review contributes, the two real tensions between the shibui pass's cuts and the design review's polish (and how they resolve), the merged and re-ranked priority list, a pre-D91 discipline checklist, and the `Not changed, on purpose` guardrails that must not be over-fitted by any one pass."
authority: "Reconciles all three 2026-04-22 partner-walkthrough passes and supersedes the Tier 1b prioritization proposed in `2026-04-22-ux-workflow-manual-test.md` and the two-way synthesis in `2026-04-22-synthesis-workflow-and-shibui.md`."
last_updated: 2026-04-22
depends_on:
  - docs/research/partner-walkthrough-results/2026-04-22-ux-workflow-manual-test.md
  - docs/research/partner-walkthrough-results/2026-04-22-shibui-attention-respect-pass.md
  - docs/research/partner-walkthrough-results/2026-04-22-manual-ui-design-review.md
  - docs/research/partner-walkthrough-results/2026-04-22-synthesis-workflow-and-shibui.md
  - docs/research/partner-walkthrough-results/2026-04-21-amateur-player-3-manual-test.md
  - docs/research/partner-walkthrough-results/2026-04-21-iphone-viewport-design-review.md
  - docs/research/partner-walkthrough-results/2026-04-21-tier-1a-walkthrough.md
  - docs/research/japanese-inspired-visual-direction.md
  - docs/research/outdoor-courtside-ui-brief.md
  - docs/vision.md
  - docs/milestones/m001-solo-session-loop.md
  - docs/plans/2026-04-20-m001-tier1-implementation.md
decision_refs:
  - D91
  - D100
  - D105
  - D123
  - D124
  - D127
  - D129
  - D130
---

# Trifold synthesis — workflow × shibui × design review

## Agent Quick Scan

- Use this doc as the **single decision-ready read** for the 2026-04-22 partner-walkthrough output. It reconciles three same-day passes on one build and produces one merged priority list.
- Supersedes `2026-04-22-synthesis-workflow-and-shibui.md` (the two-way synthesis). That doc stays valid as a reasoning trace, but its priority list is replaced here.
- Three-lens verdict: the core loop works (workflow pass) and is visually disciplined (design review), but the loop still asks for more decisions than it has earned (shibui pass). The combined opportunity is **cut ~12–15 unearned decisions** out of Safety + Review + Complete, **fix a small set of high-leverage craft items** (disabled-CTA token, chip affordance, warm-up coaching-note truncation, block-end countdown cue), and **seed one quiet investment surface** — all before the 2026-07-20 re-eval.
- Two real tensions between passes resolve with Tier placement: `Chosen because:` gets deleted from Run in Tier 1b (shibui wins mid-block) and re-homed in the Swap sheet + Tier-2 See-Why modal (workflow pass's P9 IOU justifies acceleration); Review chip affordance applies to the *collapsed* three-anchor grid that survives the shibui cut (design review's affordance fix is still correct on the reduced surface).
- Not for: net-new walkthrough data, the raw attention-respect derivation, or the per-token visual analysis — those remain owned by the three input docs. Read those for evidence; read this for what to do.

## The three lenses

Three different honest questions, one build, one day:

| Pass | Question | Method | Bias |
|---|---|---|---|
| **Workflow** (`ux-workflow-manual-test`) | Does it work, how fast, across cold-start + repeat + recovery, does it line up with vision P1–P12? | Instrumented timing, tap counts, full repeat-use loop. | Measurement-first. |
| **Shibui** (`shibui-attention-respect-pass`) | Would a tired amateur feel respected by this screen, or feel like the app is asking them to do the work? | Principle derivation: shibui × attention span × respect-for-amateur. | Principle-first, maximally subtractive. |
| **Design review** (`manual-ui-design-review`) | Does the surface meet the Japanese visual direction and outdoor-courtside briefs — typography, color, hierarchy, affordance, emotional response? | Screen-by-screen rubric against design canon + tokens. | Craft-first, token-aware. |

These are not redundant; they are three axes. Anything surviving all three is a strong claim.

## What all three lenses agree on (stronger than any two-way convergence)

Seven findings where measurement, principle, and craft independently land on the same verdict:

1. **Transition is the apex screen.** Keep. All three rank it textbook — workflow pass calls it the cleanest P12 surface, shibui pass calls it textbook shibui, design review calls it the `tokonoma` exemplar.
2. **`Repeat this session` on Home is the single best interaction.** Workflow pass measures it at 5 taps / ~18 s (falls to ~3 taps / ~10 s after the cuts below); shibui pass preserves it by not touching it; design review says the priority model is clear.
3. **`0 days` chip reads as an error, not a valid answer.** Three passes agree. Design review proposes the rewrite: `Today / Yesterday / 2+ days ago / First time`. **Adopt as stated.** This removes the semantic-color-as-warning problem at the copy level instead of the token level, and mirrors the same re-labeling the recent-workouts list did (`Yes/No` → `Done/Partial`).
4. **Review is the biggest debt surface in the app.** Workflow pass: exceeds 60 s target, requires scroll. Shibui pass: 17 decisions, RPE-fluency assumption, success-rule lawyering. Design review: three stacked gray cards, non-tappable-looking chips, suspected state bug. Merged proposal in §"Merged Review" below.
5. **Warm-up and cool-down coaching-note density is the courtside legibility risk.** Workflow pass: numbered-step blob; shibui pass: four text regions on Run; design review: apply the work-block truncate-with-expand pattern. **Adopt the design review's fix exactly; it lands every lens's concern at once.**
6. **Brandmark ambiguity at 32 px.** All three noted it. Design review adds the craft-level resolution: bump to 36–40 px on Home only, and test the mark without context with real users.
7. **The save-status line on Complete ("✓ Saved on this device …")** is load-bearing trust copy — design review calls it the single most trust-building sentence in the product; workflow pass noted its caveat lands too early on session 1; shibui pass said delete the 2-hour countdown adjacent copy, not the save line itself. **Resolved:** keep the save line, compress the Safari-eviction footnote to Settings, delete the 2-hour Review-window copy. See §"Tensions resolved" for the three-way parse.

## What the design review contributes that neither other pass caught

The design review is the only pass that spent time in tokens, typography, motion, and hit-area math. Seven additions no other pass surfaced:

**A1 — Peach-palette overload.** Peach is simultaneously carrying disabled CTAs, selected chips, info-surface coaching cards, and safety-chip selected states. The eye learns peach = "active-but-secondary" within 2–3 screens, which then makes the disabled peach CTA feel half-active. **Fix: a neutral `disabled` CTA token distinct from peach.** One token, two call-sites (Setup `Build session`, Review `Submit review`). Biggest single clarity win. *Top-5 #1 in the design review; elevated to Tier-1b position 3 in the merged list below.*

**A2 — Unselected review chips do not read as tappable.** Before a selection, the 0–10 grid is raw numbers on a card — no outline, no background, no affordance. A single selection then snaps to filled orange with white text. The *pre-selection* view is what the first-time reviewer sees, and it partly causes Player 3's "I'd leave them at zero" instinct. This finding applies to whatever chip set survives the shibui-cut (see §"Tensions resolved"): the merged three-anchor `Easy / Right / Hard` still needs an affordance default.

**A3 — `--text-body` scaffolding is 14 px pending D91 (`D127`).** Neither the workflow pass nor the shibui pass is aware of this token state. Design review's recommendation stands unchanged: **the 16 px / `leading-6` retune should land in the same PR as the D91 field-test insight**, not before it. Do not pre-empt `D127`.

**A4 — No visible block countdown cue.** The progress bar is ~4 px tall and accent-only, reading as decoration, not as a time signal. A glance from 2 m can't distinguish 30 s from 3 min remaining. **Fix: thicker progress bar with a small remaining-time chip ("0:47 left") near it.** This is the one addition to Run that is genuinely warranted — everything else on Run is subtractive.

**A5 — Investment is the weakest of joy/trust/invest.** Home after 1 session looks identical to Home after 10. No streak, no "you've invested" visibility. Design review suggests a single quiet footer line ("Logged: 4 sessions · 1 h 05 m") near Settings. Shibui pass would reject a louder streak UI; this is small enough to be shibui-compatible. **Adopt as a one-line footer only**, and treat it as a first stake — the fuller investment surface belongs in `M002` weekly receipt, not Home.

**A6 — Effort/tag state anomaly is probably a real bug.** Design review's observation is sharper than the workflow pass's: selecting `About right` after effort `7` appeared to reset effort to `5` *and auto-advance to Complete*. Either this is a genuine state bug or the tag row's hit geometry overlaps Submit. **File as a user-visible state bug; reproduce before D91.** If the Review cut proposed below lands (tags card deleted), the bug becomes moot — but verify it is actually deleted by that change rather than latent.

**A7 — `Not changed, on purpose` discipline.** The design review is the only pass that names three explicit *do-not-touch* constraints that any Tier 1b work must respect:
- `RecentSessionsList` is deliberately passive per JSDoc + adversarial-memo Condition 2 rationale. **Do not make it tappable in Tier 1b.** This retracts my workflow pass's proposed ghost-chevron affordance — the rationale is stronger than the affordance.
- `--text-body` stays at 14 px until D91 evidence lands. **Do not pre-tune.**
- Settings minimalism is a feature, not a gap. **Do not add structure to `/settings` beyond Export.**

## Tensions between passes, resolved

### T1 — `Chosen because:` on Run

- **Workflow pass:** Praise as a cheap Tier-1a P9 win; per-block variation is the right deterministic trust signal.
- **Shibui pass:** Delete entirely. Biggest single shibui violation — the app asking for credit at the worst reading moment.
- **Design review:** Polish, don't delete — same color, +1 size step, no italic, shorter copy (e.g. *"Main passing rep."*).

**Resolution (confirmed from the two-way synthesis, strengthened by the design review's own observation that the line is currently "gray-on-off-white afterthought"):**

- **Delete the line from Run in Tier 1b.** The shibui read wins mid-block.
- **Preserve the reason-trace in the `SessionDraft` / `ExecutionLog` data model** per Tier-1a spec.
- **Re-home the surface:** inline in the **Swap drill** bottom sheet (where a user actually asks "why this?"), and in the Tier-2 **`See why this session was chosen`** modal (session-level reasoning).
- **Accelerate the Tier-2 See-Why modal** into the Tier-1b window if the ≤10-drill adversarial-memo cap allows. Without this, the workflow pass's P9 IOU (feedback feeds forward visibly) has **no visible home** after the Run line is removed. This is the strongest single argument to open the `D130` Tier-2 gate earlier than the current "two weeks of weekly founder sessions + Condition 3 pass" rule.
- **Amendment to Tier-1a plan:** Unit 4 (`Chosen because:` on each RunScreen block) is **inverted** — keep derivation, delete display. File as a Tier-1a plan amendment, not a new tier.

### T2 — Review chip affordance vs. Review chip deletion

- **Design review:** Give all Review chips (0–10 effort and quick tags) a neutral default outline/surface so tappable things look tappable. *Top-5 #4.*
- **Shibui pass:** Collapse 0–10 to 3 anchors (`Easy / Right / Hard`); **delete Quick tags entirely** (RPE + note carries the signal).
- **Workflow pass:** Review requires scroll; observed reps/tags cross-talk; Submit disabled state is peach again.

**Resolution:**

- **Take the shibui cut first, then apply the design review's affordance fix to what survives.** The merged Review has **three effort chips** (`Easy / Right / Hard`), **optional `Add a note`**, and **`Done`** / `Finish later` escapes of equal weight. On that reduced surface, the design review's affordance concern still applies and is easy to satisfy — three chips with a neutral outline default, no ambiguity.
- Quick tags are deleted, so the state cross-talk observed in the workflow pass becomes moot. The effort-7 → auto-advance-to-Complete anomaly (A6) should still be investigated and reproduced before D91, so the fix isn't accidental.
- `--text-body` stays at 14 px in this surface per `D127` until D91 evidence lands, even though the surface gets simpler. The retune still goes in the D91-insight PR.

### T3 — Verdict copy on Complete

- **Shibui pass:** Praises `Session 1. One more in the book. Ready when you are.` as "the voice the rest of the app should match." Eight words, one warm image, zero asks.
- **Design review:** Suggests a first-ever-session variant — "Session 1 → logged" or similar milestone copy — to make first-complete feel specifically earned rather than pattern-matched.

**Resolution:** These are compatible. The shibui pass praises the *voice*, not the *exact string*. The design review is asking for a single first-session variant in that same voice. **Add a first-session-only verdict string** ("Session 1 → logged. First one is in the book.") and keep the existing `Keep building` / `No change` / third-case structure for session 2+. One extra string, same voice, addresses the design review's milestone gap without breaking shibui.

### T4 — Affordance on the recent-workouts row

- **Workflow pass:** Proposed a ghost chevron so the row feels like a ledger, not a caption.
- **Design review:** Explicitly names `RecentSessionsList` as intentionally passive per JSDoc + adversarial-memo Condition 2 rationale. Suggests only a sub-heading or muted `—` between columns to signal "read-only log," not a tap affordance.
- **Shibui pass:** Silent.

**Resolution:** **Adopt design review's treatment.** Withdraw the ghost-chevron proposal from the workflow pass. A quiet sub-heading ("Last three") or muted separator between columns is the right minimum; the full tappable history is Tier-2 work. The adversarial-memo rationale outranks the affordance instinct.

## Merged Review proposal (supersedes the two-way synthesis's version)

Folds all three lenses. No change from the two-way synthesis except: **A2's chip-affordance concern is explicitly applied to the reduced 3-anchor effort row**, and `--text-body` still follows `D127`.

| Element | Today | After | Source |
|---|---|---|---|
| RPE scale | 0–10, 11 chips, 2 rows | **3 anchors** (`Easy` / `Right` / `Hard`), 1 row, with **neutral outline default** on unselected chips | Shibui cut + Design review A2 |
| Good passes card | Visible; success-rule copy; pre-select `Couldn't capture` | **Hidden by default**; shown only when the block's `successMetric.type` is count-based | Shibui + Workflow |
| Success-rule sentence | Present | **Deleted** (or reduced to `Rough guess is fine` only when the count-based card shows) | Shibui |
| Quick tags | Four chips (Too easy / About right / Too hard / Need partner) | **Deleted** — duplicates RPE; `Need partner` belongs on next session's setup, not last session's review | Shibui |
| Short note | Optional textarea, always visible | **Collapsed behind `Add a note`** | Shibui |
| Submit vs Finish later | Submit primary (peach disabled state), Finish later secondary-below | **`Finish later`** / **`Done`** equal weight; `Done` is the power move; Submit uses the **neutral gray disabled token** (A1) until effort is chosen | Shibui + Design review A1 |
| 2-hour countdown copy | "This session stops counting in about 2 hr…" | **Deleted** — keep the cap in the model | Shibui |
| Early-end reason chips | Present on ended-early state only (Time / Fatigue / Pain / Other) | **Keep as-is** — non-redundant with RPE; feeds planner; honest and non-shaming | Workflow |
| Three-card border density | Three stacked gray cards | **Divider lines + stronger section heading + generous `gap-6`** per the Japanese visual direction note's explicit Review guidance | Design review |
| Effort-tile grid shape | Asymmetric 6-then-5 split reads as layout accident | Moot after cut to 3 anchors | Design review + Shibui |
| Observed state bug (A6) | Tag press appears to reset effort and auto-advance | **Reproduce + file before D91**; will likely be moot once tag card is deleted, but verify | Design review |

Result: ~17 decisions → **1 required + 1 optional**. ~60-s form → ~5-s acknowledgment. Divider-line treatment reduces border-heaviness without new tokens. Neutral gray disabled CTA token removes peach-overload on this surface.

## Merged priority list (supersedes prior lists)

Re-ranked by **attention tax recovered per line of code changed**, now with the design review's craft items folded in and the `Not changed, on purpose` constraints enforced. Tags: **W** = workflow, **S** = shibui, **D** = design review.

### Tier 1b — proposed bundle before the 2026-07-20 re-eval

1. **Add a neutral `disabled` CTA token** distinct from peach; apply to Setup `Build session` and Review `Submit`/`Done`. [D · Top-5 #1] *One token, two call-sites. Unblocks A1 peach-overload.*
2. **Delete `Chosen because:` from Run.** [S, W-accepted, D-accepted] *Preserve reason-trace in data model; see T1 for re-homing.*
3. **Rewrite Review per the merged proposal above.** [W + S + D] *Single biggest attention-tax reduction in the app.*
4. **Reword the `0 days` chip row** as `Today / Yesterday / 2+ days ago / First time`. [W + S + D · Top-5 #2] *Matches the same semantic re-wording pattern the recent-workouts list already landed.*
5. **Apply progressive-disclosure to warm-up and cool-down coaching notes**, the same pattern already used on work blocks. [D · Top-5 #3, WS] *One fewer text blob in sun on two screens per session.*
6. **Auto-fill training recency** on Safety for returning users — `Today — tap to change`. [S, W-accepted] *Removes one question from the repeat path.*
7. **Persist `Net` / `Wall` across sessions**; ask only on first setup and on explicit "conditions different today." [S, W-accepted] *Saves ~6 taps/week for a 3×/week user.*
8. **Delete the 2-hour Review-window copy**; compress the Complete-screen Safari-eviction footnote to Settings. **Keep the `✓ Saved on this device` line** on Complete unchanged — it is the product's single most trust-building sentence. [W + S + D] *Three-way resolution; see §"What all three agree on" #7.*
9. **Add the block-end countdown cue** on Run — thicker progress bar + "0:47 left" chip near it. [D] *Only additive Run change.*
10. **Reproduce and file the effort-7 / tag / auto-advance bug before D91.** [D · Top-5 #5, W-observed] *Verify it's genuinely moot once the tag card is cut; do not rely on the cut to fix it silently.*
11. **Gate the "keep phone unlocked" warm-up hint** to first-time-only, or on observed block-end miss. [W]
12. **Add a confirmation modal to `Skip review`** matching the `End session early?` pattern. [W]

### Tier 1b — content / wording (same bundle, different domain)

13. **Make `Not sure yet` the default onboarding path for skill level.** [S, W-accepted] *The existing copy already describes exactly this. Promote it from escape to default path; make the specific band an adjustable Setting. Better P11 compliance than the current five-card gate, and consistent with the design review's "no step indicator, commitment anxiety" concern.*
14. **Rewrite jargon labels** `Side-out builders`, `Rally builders`, `platform`, `athletic posture` into plain language. [S, W-accepted]
15. **Add a first-session-only verdict string** on Complete (`Session 1 → logged. First one is in the book.`) in the existing voice. [D, T3-resolved] *One extra string, milestone-specific, stays shibui.*

### Tier 1b — investment seed

16. **Add one quiet footer line** near Settings: `Logged: N sessions · HH:MM total`. [D A5] *First stake in the investment leg of joy/trust/invest. Louder streak UI belongs in M002, not here.*

### Tier 1b or Tier 2, evidence-dependent

17. **Accelerate the Tier-2 `See why this session was chosen` modal** into the Tier-1b window if the ≤10-drill cap permits. [W + S + D + T1] *Justified by T1: deleting `Chosen because:` from Run leaves P9 with no visible home.*
18. **Accent color demotion** across non-action surfaces — phase eyebrows, section labels, reason copy, back links → neutral typographic distinctions. [S, D A1-adjacent] *Complements A1's disabled-CTA token by reserving orange strictly for action + selected-state.*
19. **Transition screen `Shorten block` secondary** — promote from text link to pill-shaped outlined button at CTA width. [D] *One escape for a tired athlete; deserves visibility.*

### Tier 2 or later (unchanged from the original plans, now better-justified)

- **`See why` modal + richer Complete summary copy + full session-history screen** — all justified by the three passes converging on the same trust-and-investment gap.
- **`--text-body` retune to 16 px / `leading-6`** lands with the D91 field-test insight PR per `D127`. [D A3] *Do not pre-empt.*
- **Physical-device validation** — safe-area, Dynamic Type, real sunlight, Playwright hit-area overlay on `/review` at 375 px. [D follow-ups]

### Not changed, on purpose (enforce in Tier 1b scope review)

- **`RecentSessionsList` stays passive.** [D A7, T4-resolved] No ghost chevron, no tap-through, no link styling. The workflow pass's affordance suggestion is withdrawn. Full tap-through is Tier-2 full-history work.
- **Settings stays single-card minimal.** [D A7] Only additive item allowed is the one investment footer (#16), and even that is below the Export card, not inside it.
- **Typography scaffolding stays at 14 px** until D91 evidence. [D A3, `D127`]
- **The `═` ornament on Complete stays the only decoration.** [D] Do not add a second.

## What this changes about the Tier 1 plan

Relative to `docs/plans/2026-04-20-m001-tier1-implementation.md`:

- **Tier 1a Unit 4** (`Chosen because:` display) → **invert it**. Keep derivation, delete display in Tier 1b. File a Tier-1a plan amendment.
- **Tier 1a Unit 5** (last-3-sessions row on Home) stands as written; A7 + T4 explicitly enforce that it stays passive in Tier 1a and Tier 1b.
- **Tier 1b ≤10-drill-record cap** is unaffected — every priority item above except the Tier-2 See-Why acceleration is surface or copy work, not content.
- **Tier 1c focus-toggle architecture** is not affected, and becomes *cheaper to evaluate*: the merged `Easy / Right / Hard` RPE makes focus-friction easier to detect in the ledger because RPE values stop being noisy.
- **`D127` typography retune** is explicitly preserved — it does not ride on any Tier 1b item and must land with the D91-insight PR, not before.

## Pre-D91 discipline checklist

Imported from the design review, extended with the state-bug and copy fixes that any D91 cohort will notice:

- [ ] Neutral `disabled` CTA token shipped; Setup `Build session` + Review `Submit`/`Done` both consume it.
- [ ] `Chosen because:` removed from Run; reason-trace still present in the data model; Swap bottom sheet surfaces it.
- [ ] Review cut landed per merged proposal; `Done` and `Finish later` at equal weight.
- [ ] `Today / Yesterday / 2+ days ago / First time` wording live on Safety.
- [ ] Warm-up and cool-down coaching notes truncated-with-expand.
- [ ] Training recency auto-fills for returning users; `Net`/`Wall` persist.
- [ ] 2-hour Review-window copy removed; Complete save-line intact; Safari-eviction footnote moved to Settings.
- [ ] Block-end countdown cue on Run.
- [ ] Effort/tag state anomaly reproduced, fixed, and the fix has a regression test.
- [ ] `Skip review` confirmation modal live.
- [ ] `Not sure yet` is the default onboarding path; jargon labels plain-language.
- [ ] First-session-only verdict string live on Complete.
- [ ] Quiet `Logged: N sessions · HH:MM total` footer live.
- [ ] Playwright hit-area overlay at 375 px on `/review` confirms 44 pt floor on the three-anchor effort row.
- [ ] 3-2-1 preroll's visible tick verified on device (`lib/audio.ts` audio tick already exists).
- [ ] Physical iPhone pass for safe-area + Dynamic Type + real sunlight scheduled.

If any item on this list drops, name the decision and the source pass in the adversarial-memo Amendment Log.

## Open questions

1. **Does the Tier-1a Unit-4 inversion** (keep derivation, delete display) require a Tier-1a plan amendment, or is it a Tier-1b polish item against the existing Tier-1a artifact?
2. **Does the merged Review proposal require a `docs/specs/m001-review-micro-spec.md` revision** before code, or can the spec be updated in the same PR?
3. **Is accelerating the Tier-2 See-Why modal** worth breaking the `D130` "Tier 2 unblocks on Tier-1a acceptance + Condition 3 pass + two weeks of weekly founder sessions" gate? This doc argues yes because the alternative leaves P9 with no home; name the trade in the adversarial-memo Amendment Log if taken.
4. **For the skill-level default** (`Not sure yet` as path, not escape), is there a first-run band-detection heuristic the planner can use from session-2's RPE + completion signal, so the specific band question can move into Settings instead of onboarding?
5. **Does the investment-surface seed** (one quiet Home footer line) satisfy the design review's concern enough to defer the richer surface to `M002`, or does the first `M002` stake need to appear earlier?

## Voice check

Three passes, three different rubrics, one underlying conclusion: the app already has the voice it should use — the Complete-screen verdict, the save-status line, the Transition `Up next` card, the `End session early?` modal's honest copy. Every Tier-1b item above is either **removing something that isn't in that voice** or **giving an existing surface the discipline to hold it**. The design review called this out exactly once and it is the single line worth closing on:

> Permission to stop.
