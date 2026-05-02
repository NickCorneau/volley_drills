---
id: 2026-04-26-pair-rep-capture-options
title: "Pair Rep-Capture Options (Tier 1b P2-3 trigger fired 2026-04-26)"
type: research
status: active
stage: validation
authority: "Decision input for the post-session pass-tracking question raised by the 2026-04-26 founder pair session. Lays out four framings (A per-drill difficulty tag, B per-drill Good/Total at Transition, C in-session running tally, D hybrid) against six decision criteria. Does not recommend; the recommendation lives in the framing-decision step and any contract change in `docs/decisions.md`."
summary: "Founder pair session 2026-04-26 (one-arm passing + continuous passing + 6-Legged Monster, 25 min) fired the P2-3 Tier 1b trigger by reporting that post-session Good/Total feels fake on a `pass-rate-good` session. This doc lays out four candidate framings for replacing or relocating that capture, scored against `D104` math preservation, courtside attention cost, post-session typing cost, authoring-budget consumption, pair/solo voice impact, and the honesty test. No pre-recommended winner."
last_updated: 2026-04-26
depends_on:
  - docs/specs/m001-review-micro-spec.md
  - docs/decisions.md
  - docs/research/founder-use-ledger.md
  - docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md
  - docs/research/partner-walkthrough-results/2026-04-21-tier-1a-walkthrough.md
related:
  - docs/plans/2026-04-26-pair-rep-capture-tier1b.md
  - docs/plans/2026-04-22-tier1b-serving-setting-expansion.md
  - docs/plans/2026-04-20-m001-adversarial-memo.md
decision_refs:
  - D104
  - D120
  - D125
  - D130
  - D132
open_question_refs:
  - O12
---

# Pair Rep-Capture Options

## Agent Quick Scan

- This doc is the **product-decision input** for the post-2026-04-26 pair rep-capture question. It is not the decision itself.
- Four framings (A / B / C / D) are scored against six explicit criteria. The scoring is intentionally compact — fits on one screen at courtside.
- The trigger that gates Tier 1b authoring on this question (`SEB P2-3` + `SEB N2`, recorded in `docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md` §"Tier 1b — gated by founder-session trigger") fired on the 2026-04-26 founder pair session. The new ledger row in `docs/research/founder-use-ledger.md` is the trigger-evidence artifact.
- This doc does not recommend a winner. The next step is a framing decision in `docs/decisions.md` (a new `D###` row if the answer changes the contract) and a spec patch on `docs/specs/m001-review-micro-spec.md`.

## Why this doc exists

The 2026-04-26 founder report (chat, 5:23 PM ET) named two distinct issues. The cooldown-stretch wording one is editorial and ships under `docs/archive/plans/2026-04-26-pre-d91-editorial-polish.md`. The Good/Total one is a **product-and-design** question that touches contract:

> "the 'passes and good passes' bit at the end is too hard to track and fill out post workout. maybe, we have an in-between drill screen, that asks for total passes and how many were good or not. or, we just drop this entirely, and just get the user to tag 'too hard; still learning; too easy' after each drill?"

Five canonical surfaces converge on this question:

- `docs/specs/m001-review-micro-spec.md` §`primarySkillMetric` already requires "persist `goodPasses` and `attemptCount` **at drill-variant grain** inside the review payload, not only as a session-level aggregate" (`V0B-12`). The current Tier 1a UI in `app/src/screens/ReviewScreen.tsx` deviates — it persists one session-level pair only.
- `docs/decisions.md` `D104` is why drill-variant grain matters: the binary-success progression rule needs **≥50 scored contacts in a same-drill-variant + same-success-rule + same-fatigue-context window** before a `progress` verdict can issue. Session-level aggregate cannot feed that math at all.
- `docs/research/partner-walkthrough-results/2026-04-21-tier-1a-walkthrough.md` §P2-3 explicitly named the unlock condition for this work as Tier 1b on a single founder-session trigger — `pass-rate-good` session with explicit fake-guess flag.
- `docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md` §"Tier 1b — gated by founder-session trigger" listed three relevant gated items: (a) in-session running rep counter, (b) drill-metadata-driven capture UI, (c) per-drill capture-style branching.
- `docs/research/founder-use-ledger.md` 2026-04-26 row is the triggering session.

**One thing that looks like prior art but isn't.** The `QuickTagChips` card on Review (`Too easy / About right / Too hard / Need partner`) was deleted on 2026-04-23 (`docs/archive/plans/2026-04-23-walkthrough-closeout-polish.md` item 3) because it duplicated the new 3-anchor RPE chips. That deletion was *session-level*. The founder's 2026-04-26 proposal ("tag 'too hard / still learning / too easy' after each drill") is **per-drill at Transition**, which is meaningfully different. The brainstorm acknowledges the surface-name history so labels can be picked that don't accidentally re-propose the deleted thing.

**One thing that already exists and may not need to be invented.** The `TransitionScreen` (`app/src/screens/TransitionScreen.tsx`) is a real surface today, displayed between blocks. An "in-between drill ask" can live there; it does not require a new screen.

## The four framings

### Framing A — Per-drill difficulty tag (the founder's "too hard / still learning / too easy" idea)

- **Surface:** `TransitionScreen.tsx`, between blocks.
- **Capture:** 1-tap, no counts, no Good/Total at all on count drills.
- **Effect on Review:** Good/Total card removed from Review for `pass-rate-good` (and other count) drills entirely; session-level RPE remains.
- **Storage:** A new `perDrillDifficulty: 'too_hard' | 'still_learning' | 'too_easy'` field per drill-variant, persisted to the session review payload at drill grain.
- **Vocabulary risk:** Collides with the deleted `QuickTagChips` labels. Mitigation: the deleted tags were `Too easy / About right / Too hard / Need partner`; the founder's proposed labels (`too hard / still learning / too easy`) include "still learning" which is genuinely distinct from "About right" (it carries an *acquisition-stage* meaning, not a *load-rightness* meaning). Pick distinct labels in the spec patch and document the distinction so reviewers don't read the surface as a re-proposal of the deleted card.

### Framing B — Per-drill Good/Total at the Transition screen (drill-grain capture)

- **Surface:** `TransitionScreen.tsx`, between blocks.
- **Capture:** Same `PassMetricInput` UI we already have on Review, but rendered per drill while the drill is still fresh. `notCaptured` toggle still present per the 2026-04-22 default-when-not-count-drill behavior.
- **Effect on Review:** Good/Total card removed from Review; session-level RPE remains. Per-drill values aggregate to the session-level display on `CompleteScreen.tsx`.
- **Storage:** Existing `goodPasses` / `attemptCount` shape, but persisted per drill-variant, exactly as `V0B-12` already requires.
- **Vocabulary risk:** None new; reuses existing vocabulary.

### Framing C — In-session running tally (Seb N2's ask, captured in `2026-04-22-all-passes-reconciled.md` §"Tier 1b — gated")

- **Surface:** `RunScreen.tsx`, one-tap increment for each rep during the drill, plus a `Good / Not good` modifier.
- **Capture:** Live during the drill, not after. Counter visible during the drill, optionally collapsible.
- **Effect on Review:** Good/Total card removed from Review; values come from the in-session counter. Edit affordance on `CompleteScreen.tsx` for late corrections.
- **Storage:** New `liveTally: { good: number, total: number }` per drill-variant, persisted on drill end.
- **Vocabulary risk:** New live-counter affordance language (`Tap for good`, `Tap for not good`) needs to pass the courtside-copy invariants — this is a one-handed, motion-impaired affordance and the labels must read at distance.

### Framing D — Hybrid: Difficulty tag mandatory + Good/Total optional, both per-drill at Transition

- **Surface:** `TransitionScreen.tsx`, between blocks.
- **Capture:** The Framing A 1-tap difficulty tag is the required ask; the Framing B Good/Total UI is rendered as an optional collapsed `Add counts` affordance below it. Either or both can be filled.
- **Effect on Review:** Good/Total card removed from Review for count drills (the per-drill Transition affordance replaces it). Session-level RPE remains.
- **Storage:** Both `perDrillDifficulty` (always present) and `goodPasses` / `attemptCount` per drill-variant (optional, may be `null`).
- **Vocabulary risk:** Inherits Framing A's collision risk and Framing B's expansion of the Transition surface.

## Decision criteria

Six criteria, scored as `+` (preserves / improves), `−` (degrades / breaks), `~` (mixed). Scoring is qualitative; the rationale matters more than the symbol.

| # | Criterion | A | B | C | D |
|---|-----------|---|---|---|---|
| 1 | Preserves `D104`'s 50-contact rolling-window math at drill-variant grain | − | + | + | ~ |
| 2 | Reduces courtside attention cost on RunScreen | + | + | − | + |
| 3 | Reduces post-session typing pain (the founder's actual complaint) | + | ~ | ~ | ~ |
| 4 | Authoring-budget consumption (cap is the per-Tier-1b authoring-budget cap in `docs/plans/2026-04-20-m001-adversarial-memo.md` §5) | low | low | high | medium |
| 5 | Survives the pair / solo voice asymmetry (`D125` / `D132`) | ~ | ~ | − | ~ |
| 6 | Honesty test: which option makes the founder least likely to invent a number | + | ~ | + | + |

Detail per criterion:

1. **`D104` math.** The progression rule wants ≥50 scored contacts in a same-drill-variant + same-success-rule + same-fatigue-context window. Framing A produces zero contacts data on count drills — `D104` then has to fall back to RPE-only signal, which neither `D104` nor `O12` is currently specified for. Framing B produces drill-grain contacts, exactly as `V0B-12` already requires; the math is preserved as written. Framing C produces the same drill-grain contacts but with higher fidelity (recorded during the act). Framing D produces drill-grain contacts when the founder fills the optional field; when they don't, it inherits Framing A's gap — which means `D104` either has to accept partial coverage and degrade gracefully, or the optional-counts ask quietly becomes mandatory in practice.
2. **RunScreen attention cost.** A, B, D leave RunScreen untouched (the affordance lives on Transition). C adds an in-drill counter which costs a tap per rep and visual real estate during play; this is the entire reason the in-session counter was Tier 1b-gated rather than baseline.
3. **Post-session typing.** The founder's complaint is "too hard to track and fill out post workout." A removes the ask entirely (1-tap tag, between blocks). B relocates it (still typing, but fresher). C relocates it further upstream (counter is updated live). D combines: the required ask is 1-tap, the optional ask still exists. Only A is unambiguously "post-session typing zero" on count drills.
4. **Authoring-budget consumption.** The reconciled-list says: *"the trigger-gated items involve metadata (`variant.roleSwapAtMinute?`, capture-style branching) and UI, not new drill records — they do not consume the cap of three Tier-1b drill records."* So none of these consume the *drill-record* cap. They do consume *authoring-budget* slots in the broader sense. A and B are tightly scoped; C is the largest (new live-counter component on RunScreen, new `liveTally` storage shape, edit affordance on Complete); D is roughly A + B, slightly less than A+B in practice because they share a Transition-screen substrate.
5. **Pair / solo voice.** `D125` makes pair the strategic north star; `D132` accommodates solo as a tactical activation. C's in-session counter has different cost profiles in pair (one player counts, the other plays — possible) vs solo (the player has to count their own contacts, often during continuous reps — friction). A's per-drill tag has the same low cost in both modes. B and D have the same cost in both modes (post-block ask). The asymmetry is Framing C's specifically.
6. **Honesty test.** The founder's literal phrase was "too hard to track and fill out post workout, often resulting in 'fake' counts." A makes invention literally impossible (no number to invent). B reduces invention by reducing the temporal gap. C reduces invention by capturing live. D inherits A's no-invent-on-the-tag and B's reduced-but-nonzero-invent-on-the-counts.

## Cross-cutting facts the framing decision should not forget

- **Today's UI already deviates from `V0B-12`.** Whichever framing wins, the spec needs a patch. Framing B converges with the existing spec; A / D require explicit acknowledgment that count metrics are now optional / replaced on count drills; C requires an in-session capture-path addition.
- **The 2026-04-23 cut already removed Quick Tags.** Reintroducing per-drill tags is *not* a reversal of that decision — it changes the grain (session → drill) and the purpose (RPE-duplicate → drill-stage signal). The spec patch should make this distinction explicit so future readers don't try to consolidate the two surfaces.
- **`pass-rate-good` is one of several capture-styles.** The spec patch needs to handle the full capture-style enum from `app/src/data/drills.ts` `successMetric.type` (`pass-rate-good`, `reps-successful`, `streak`, `points-to-target`, `pass-grade-avg`, `composite`, `completion`). Framings A / D apply uniformly to all. Framing B is meaningful only on count-style metrics; the others would still render as `notCaptured`-default. Framing C is meaningful only on rep-able metrics (`pass-rate-good`, `reps-successful`).
- **Telemetry stays off (`D131`).** No remote logging is allowed during the `D130` window. Whichever framing wins, the new fields land in the local Dexie schema only; a Dexie migration is therefore in scope and the Tier 1b plan must list it.
- **Optional ratification posture.** If the chosen framing changes the post-session contract (A, C, D do; B does not), the framing-decision step adds a new `D###` row to `docs/decisions.md` *as a proposed decision pending founder ratification* before the spec patch lands. The Tier 1b plan does not unblock implementation until the decision row is ratified or the framing is downgraded to "Framing B — spec already supports it."

## What this doc deliberately does not do

- Does not pick a framing. The framing decision lives in the next pathway step and in `docs/decisions.md`.
- Does not propose new vocabulary for the difficulty-tag labels. Label-picking is part of the spec patch, gated by the courtside-copy invariants in `.cursor/rules/courtside-copy.mdc`.
- Does not list the implementation file set. That belongs in the Tier 1b plan in `docs/plans/2026-04-26-pair-rep-capture-tier1b.md`.
- Does not lump the cooldown-copy fix here. That ships under `docs/archive/plans/2026-04-26-pre-d91-editorial-polish.md` as an editorial-class fix.
- Does not relitigate the `QuickTagChips` deletion. The 2026-04-23 cut stands. This doc proposes a *grain-different* surface, not a revival.
