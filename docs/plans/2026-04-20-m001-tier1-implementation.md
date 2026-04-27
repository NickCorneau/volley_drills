---
id: m001-tier1-implementation
title: "M001 Tier 1a: Founder-Use Content and Safety Base (Minimum Shippable)"
type: plan
status: active
stage: build
summary: "Tier 1a of the founder-use M001 build (D130). The minimum shippable scope that lets the founder dogfood for 2+ weeks and run one partner walkthrough with a meaningful 30-day behavioural-return window. Five tight units: warm-up authoring bug fix, setting minimum probe (3 drills, no progression), vocabulary sweep with inline definitions, Chosen-because annotation on RunScreen, and last-3-sessions row on Home. Tier 1b authors further content only in response to logged need. Tier 1c lands the focus-toggle architecture only if behavioural evidence demands."
authority: "Tier 1a scope, work breakdown, acceptance bar, and the Tier 1b / Tier 1c gating triggers for the founder-use M001 build. Supersedes the earlier 2026-04-20-a/b Tier 1 scope (which bundled seven units into a single tier and accidentally formified the SetupScreen)."
last_updated: 2026-04-20-d
depends_on:
  - docs/decisions.md
  - docs/milestones/m001-solo-session-loop.md
  - docs/milestones/m002-weekly-confidence-loop.md
  - docs/plans/2026-04-20-m001-adversarial-memo.md
  - docs/research/founder-use-ledger.md
  - docs/research/partner-walkthrough-script.md
  - docs/research/warmup-cooldown-minimum-protocols.md
  - docs/research/beach-training-resources.md
  - docs/research/bab-source-material.md
  - docs/research/fivb-source-material.md
  - docs/specs/m001-adaptation-rules.md
  - docs/specs/m001-session-assembly.md
decision_refs:
  - D5
  - D67
  - D80
  - D85
  - D86
  - D91
  - D104
  - D105
  - D119
  - D123
  - D124
  - D129
  - D130
open_question_refs:
  - O5
  - O6
  - O7
---

# M001 Tier 1a: Founder-Use Content and Safety Base (Minimum Shippable)

## Agent Quick Scan

- **Tier 1a is the minimum shippable scope under `D130` founder-use mode.** Five units: warmup bug fix; setting minimum probe (3 drills, no progression); vocabulary sweep with inline definitions; Chosen-because annotation on RunScreen; last-3-sessions row on Home.
- `D91` is deferred; build proceeds on founder conviction plus a partner-walkthrough behavioural pass with a 30-day unprompted-open window (see `docs/research/partner-walkthrough-script.md`).
- **No new SetupScreen toggles in Tier 1a.** The earlier plan proposed two (pair opening-block toggle, session-focus toggle); both violate `P11 "Recommend before you interrogate"` and have been removed. Focus is chosen by the builder; setting content is reached via the draft-screen Swap action.
- Tier 1b authors additional content only in response to a logged session gap, capped at 10 additional drill records before the founder's 5th post-Tier-1a session (see `docs/plans/2026-04-20-m001-adversarial-memo.md` authoring-budget cap).
- Tier 1c lands the full focus-routing architecture (`sessionFocus` context field, dynamic `slot.skillTags` override in `sessionBuilder.ts::pickForSlot` + `findSwapAlternatives`, Swap-Focus button on the draft screen) only if behavioural evidence in `docs/research/founder-use-ledger.md` demands it. Pre-conditions and the specific evidence thresholds are in the *Tier 1c trigger* section below.
- Tier 2 (the deferred-surfaces work from `D130`) remains gated on Tier 1a acceptance + adversarial-memo Condition 3 pass (partner unprompted open within 30 days) + 2 weeks of founder sessions. Tier 3+ stays governed by M002.
- **2026-04-22 polish pass** supplements Tier 1a with a 6-item editorial-class bundle (`docs/plans/2026-04-22-partner-walkthrough-polish.md`): Safety recency chip display-label rewrite; neutral disabled-CTA token; PainOverrideCard microcopy; first-session verdict string on Complete; preroll hint gated first-time-only; Shorten block styling on Transition. All items qualify as `Accept (pre-close)`-class under the authoring-budget cap. Trigger-gated items remain deferred per the adversarial memo's 2026-04-22 Amendment Log entry.

## Why this plan exists, in its current shape

The original 2026-04-20-a/b Tier 1 plan had the right content instincts but made four structural errors that the `docs/reviews/2026-04-20-m001-red-team.md` review surfaced:

1. **Scope ballooning under founder-use mode.** `D130` removed a blocker, and the plan responded by adding seven work units (warmup, pair opening-block, 7-rung serving ladder, 8-rung setting chain, vocab sweep, invariants header, focus toggle). The scope expanded *because* validation pressure decreased — a known failure mode of founder-use mode. Tier 1a rescopes to five units targeting the minimum needed to dogfood and run one partner walkthrough.
2. **SetupScreen formification.** The plan added a `Pass · Serve · Set` focus toggle and a "Longer warm-up with partner" toggle to `SetupScreen`, directly contradicting `P11 "Recommend before you interrogate"` and `D123`. Tier 1a strips both.
3. **Architectural breaks in the focus-toggle approach.** Even if the focus toggle were desirable, `archetypes.ts` hardcodes `skillTags: ['pass', 'serve']` on `main_skill`, and `findSwapAlternatives` uses a static `SKILL_TAGS_BY_TYPE` map with the same shape. A `sessionFocus: 'set'` session would crash (zero candidates) and a mid-run swap would offer wrong-focus drills. Tier 1a defers the architecture entirely; Tier 1c ships it behind behavioural evidence.
4. **Progression-chain dead ends.** The plan's serving-ladder rule ("must pass rungs 1–4 to unlock rung 6") stranded solo users because rung 2 (`d32 Step Back Partner Serving`) is pair-only. The setting chain omitted entry-point unlocks for rungs 2 and 3. Jump-float rung 4 had ambiguous unlocks (parallel 5 and 6, or linear 5 → 6). Tier 1a ships no new progression links at all — just three setting drills — so these dead ends cannot be shipped.

Two latent issues stand independent of those errors:

- **Warm-up authoring bug (`D105` follow-up).** The session builder fills the warmup slot by picking the first non-`recovery` drill from the pass/movement pool, so a passing drill ends up labelled as warmup. Fixing this now is cheaper than fixing it after further content lands. Tier 1a Unit 1.
- **Content thinness for partner walkthrough.** The existing `chain-6-serving` has three drills (`d22`, `d23`, `d24`) and no setting chain at all. The partner walkthrough needs to be able to touch setting content at least via Swap, or the walkthrough can't exercise the hypothesis that setting content matters. Tier 1a Unit 2 adds the minimum: three setting drills and exposure via the Swap pool.

Everything else from the original plan moves to Tier 1b or Tier 1c, gated on behavioural triggers. The full original scope (serving ladder, full setting chain, opening block, focus toggle) is not wrong — it is just too much to ship before the founder has dogfooded for two weeks and the partner walkthrough has returned its 30-day outcome.

## Scope (Tier 1a)

**Five units, one editorial pass:**

1. **Unit 1 — Warm-up authoring bug fix (`D105` follow-up).** Author `d28 Beach Prep Three` with `skillFocus: ['warmup']`; extend `SkillFocus` type; fix `pickForSlot` to prefer `skillFocus: ['warmup']` in the warmup slot.
2. **Unit 2 — Setting minimum probe.** Add three drill records (`d38 Bump Set Fundamentals` solo, `d39 Hand Set Fundamentals` solo, `d41 Partner Set Back-and-Forth` pair). Create `chain-7-setting` with those three drill IDs and **no progression links**. Expand `SKILL_TAGS_BY_TYPE.main_skill` and `SKILL_TAGS_BY_TYPE.pressure` to include `'set'` so user-initiated Swap reaches setting content. Do NOT modify `archetypes.ts` block skillTags — the default assembly stays pass/serve, preserving the single-focus-per-session invariant for the non-Swap path.
3. **Unit 3 — Vocabulary sweep with inline definitions.** Search-and-replace pass across `drills.ts`; inline parenthetical definitions on first occurrence of BAB-specialised terms (Pokey, Tomahawk, Sideout, High Line, Cut Shot, Pull Dig) in `courtsideInstructions`. Reference `docs/research/bab-source-material.md` for source authority. Do not author a 20-line glossary header block; a short reference comment pointing to the research file is enough.
4. **Unit 4 — "Chosen because:" annotation on RunScreen.** Single deterministic sentence per block derived from the builder's existing ranking output (block type, context inputs, selected drill's skillFocus). No See-Why modal. Promoted from the original Tier 2 scope because it is cheap and directly supports the partner walkthrough's trust-clarity signal.
5. **Unit 5 — Last-3-sessions row on Home.** Three rows: date, inferred focus, completion Y/N. Reads from Dexie `ExecutionLog` which already stores everything needed. Promoted from original Tier 2 scope because it is cheap and directly supports the adversarial memo's Condition 2 (makes app-internal history visible so the founder has less reason to keep history outside the app).

**Also in Tier 1a:** create `docs/research/founder-use-ledger.md` (done — see adversarial-memo work), the adversarial memo itself (done — see `docs/plans/2026-04-20-m001-adversarial-memo.md`), and the rewritten partner walkthrough script (done — see `docs/research/partner-walkthrough-script.md`). These are documentation prerequisites and do not require new code.

## Explicitly out of scope (deferred to Tier 1b, Tier 1c, or Tier 2)

| Item | Deferred to | Gating condition |
| --- | --- | --- |
| `d27 Beach Prep Two` compliance-fallback warmup | Tier 1b | Founder logs a session where the 3-min Beach Prep Three dose felt too long, OR partner walkthrough surfaces the need. |
| `d29 Beach Prep Five` opt-in longer warmup | Tier 1b | Only ships with the pair opening-block (below). Alone it has no surface to opt into. |
| Pair opening-block option (`d30 Pair Pepper Progression`, plus archetype variant `pair_long_warmup` carrying 12-min warmup budget) | Tier 1b | Partner walkthrough Task C returns "we wanted a longer together-warmup" as ≥P1. **Architectural note:** when this ships, it **must** be a new archetype variant with its own layout (total minutes re-allocated), NOT dynamic compression of the existing `pair_net` / `pair_open` layouts. Dynamic compression would overflow 25-min sessions by ~9 minutes and fail duration validation. |
| Full serving ladder (`d31`–`d37`, 7 rungs, float → jump-float gated) | Tier 1b (partial) | Capped at 10 total new drill records across Tier 1b per adversarial memo. **Layer A candidates (ships now, §R7 exit-3 applied 2026-04-26):** `d31 Self Toss Target Practice` (solo, rung 1), `d33 Around the World Serving` (solo + pair, rung 3). **Deferred from Tier 1b:** `d36 Jump Float Introduction` (solo, jump-float entry) — re-enters under `O7` track 2 (sports-medicine / PT review), not via Tier 1b. **Progression links:** rung 1 branches to unlock BOTH the pair-only rung and the solo alternative in parallel (no single-path dead-end for solo users); rung-4 leaf is `d33` until `d36` re-enters under O7 track 2 (the original "rung 4 unlocks rung 5 AND rung 6 in parallel, jump-float path explicit" wiring is preserved as the future-state target shape). |
| Full setting chain (`d40`, `d42`, `d43`, `d44`, `d45`) | Tier 1b (partial) | Shared 10-drill cap with serving. Likely candidates: `d40 Footwork for Setting` (solo), `d42 Corner to Corner Setting` (pair), `d43 Triangle Setting` (pair). **Progression links:** rung 1 (`d38 Bump Set`), rung 2 (`d39 Hand Set`), and rung 3 (`d40 Footwork` once authored) are all default-unlocked — they are fundamentals, not rungs gated on each other. |
| `sessionFocus` context field, dynamic `slot.skillTags` override, Swap-Focus button on draft | Tier 1c | Founder-use-ledger shows ≥8 sessions with ≥3 set-focus OR ≥3 explicit serve-focus attempts made via Swap OR partner walkthrough returns "I wanted to train X but kept getting Y" as ≥P1. |
| `archetypes.ts` invariants header comment | Already shipped | The header block is already present at `app/src/data/archetypes.ts` lines 12–52 (landed pre-Tier-1a). No new work needed. |
| "See why this session was chosen" modal | Tier 2 | Gated on Tier 1a acceptance + adversarial-memo Condition 3 pass. |
| Richer summary copy on CompleteScreen | Tier 2 | Same gate. |
| Full session history screen | Tier 2 | Same gate. |
| Recommendation-first first-run polish to `D123` posture | Tier 2 | Same gate. |
| Weekly receipt / carry-forward queue | M002 | Not a D130-unblocked surface. |
| Attack chain expansion | M003+ | Out of M001 scope. |

**Units explicitly not in Tier 1a that were in the prior 2026-04-20-b plan:** Unit 2 (pair opening-block), Unit 3 (full serving ladder), the `sessionFocus` routing and UI portion of Unit 4 (kept only the *setting content* portion, stripped the toggle), Unit 6 (archetype invariants header — already shipped). The original Unit 5 (vocabulary) becomes Tier 1a Unit 3; the original Unit 1 (warmup) becomes Tier 1a Unit 1 with d27/d29 removed.

## Work units

### Unit 1 — Warm-up authoring bug fix (`D105` follow-up)

**Problem.** `D105` specified Beach Prep Two (~2 min compliance fallback), Beach Prep Three (~3 min default), and Beach Prep Five (~5 min opt-in longer). None of those drills exist in `app/src/data/drills.ts`. The session builder at `app/src/domain/sessionBuilder.ts::pickForSlot` (lines 82–105) fills the warmup slot by picking the first non-`recovery` drill from the pass/movement pool, which means a passing drill ends up in the warmup slot and the user sees the correct warmup block duration but incorrect content. The archetype-side warmup slot minutes (`app/src/data/archetypes.ts` lines 60–68) already target Beach Prep Three (3 min default).

**Work.**

- Add **one** drill record to `app/src/data/drills.ts`:
  - `d28 Beach Prep Three` — whole-body ramp + ankle proprioception + shoulder/trunk activation + sand movement rehearsal. `skillFocus: ['warmup']`. The default warmup. Inline comment: `// D105 + BAB — Beach Prep Three, 3 min default warmup`.
  - Do NOT author `d27 Beach Prep Two` or `d29 Beach Prep Five` in Tier 1a — see the deferred-scope table.
- Extend the `SkillFocus` union type in `app/src/types/drill.ts` to include `'warmup'` (current union: `'pass' | 'serve' | 'set' | 'movement' | 'conditioning' | 'recovery'`).
- In `app/src/domain/sessionBuilder.ts::pickForSlot`, replace the current warmup branch (`const warmup = pool.find((c) => !c.drill.skillFocus.includes('recovery'))`) with a branch that prefers `drill.skillFocus.includes('warmup')` over the existing non-recovery fallback. Keep the non-recovery fallback as a defensive path — never return `undefined` from the warmup slot when the drill pool is non-empty.
- Do NOT create `chain-warmup` in `progressions.ts`. One drill is not a chain. Progression is premature until d27 + d29 are authored in Tier 1b.
- Tests:
  - Unit test in `app/src/domain/sessionBuilder.test.ts`: a 15-min session on `solo_wall` resolves to `d28` in the warmup block.
  - Unit test: a 25-min `pair_net` session still resolves to `d28` in the warmup block (d29 does not yet exist, and there is no opening-block flag in Tier 1a).
  - Regression test: `app/src/services/__tests__/session.swap.test.ts` line 33's `drillName: 'Beach Prep'` stays passing (Beach Prep Three's drill name begins with "Beach Prep").

**Acceptance.** A 15-min session built on any archetype shows `Beach Prep Three` in the warmup block with the four-component courtside copy. No session on any archetype shows a pass/serve/set drill in the warmup slot.

**Files touched.**

- `app/src/data/drills.ts` (one new drill `d28`).
- `app/src/types/drill.ts` (extend `SkillFocus` union).
- `app/src/domain/sessionBuilder.ts` (warmup-slot preference).
- `app/src/domain/__tests__/sessionBuilder.test.ts` (add cases).

### Unit 2 — Setting minimum probe (content + Swap-pool expansion)

**Goal.** Author the minimum setting content that lets the partner walkthrough exercise setting via the Swap action, and that surfaces setting content at all during founder dogfooding. No new UI. No progression links. No default-generation routing to setting.

**Add three drill records to `app/src/data/drills.ts`.**

| Drill ID | Name | Source | Solo / Pair | `skillFocus` |
|---|---|---|---|---|
| `d38` | Bump Set Fundamentals | BAB Beginner's Guide Lesson 2 (Bump Set tutorial) | Solo | `['set']` |
| `d39` | Hand Set Fundamentals | BAB Beginner's Guide Lesson 2 (Hand Set tutorial) | Solo (wall-optional variant) | `['set']` |
| `d41` | Partner Set Back-and-Forth | BAB Drill Book Plan 1 Drill 1 (warm-up element "set back and forth") | Pair | `['set']` |

Inline source citations per `docs/research/bab-source-material.md` "Source provenance and citation hygiene." Example: `// BAB Beginner's Guide, Lesson 2 — Bump Set tutorial (technique authored from tutorial notes)` for `d38`.

**Add `chain-7-setting` in `app/src/data/progressions.ts`.**

- `drillIds: ['d38', 'd39', 'd41']`
- `defaultGatingThreshold: 0.7` (consistent with other chains; unused in Tier 1a since there are no links)
- **No forward progression links.** Tier 1b authors progression once the founder's dogfood reveals which rungs actually chain in practice.
- **No regression links.**
- Add a comment at the top of `chain-7-setting` definition: `// Tier 1a: minimum probe — 3 rungs, no progression links. Tier 1b adds links when dogfood surfaces which pairs actually chain. Bump Set + Hand Set are intentionally both default-unlocked as fundamentals, per BAB Beginner's Guide Lesson 2.`

**Expand `SKILL_TAGS_BY_TYPE` in `app/src/domain/sessionBuilder.ts`** so that user-initiated Swap reaches the new content.

- Before: `main_skill: ['pass', 'serve']`, `pressure: ['pass', 'serve']`.
- After: `main_skill: ['pass', 'serve', 'set']`, `pressure: ['pass', 'serve', 'set']`.
- Other slot types (`warmup`, `technique`, `movement_proxy`, `wrap`) unchanged.

**Do NOT modify `app/src/data/archetypes.ts`.** Specifically, do NOT add `'set'` to the shared `mainSkill` and `pressure` block-slot definitions. Reasoning: archetype-level skillTags drive default session assembly; broadening them to `'set'` would cause the builder to randomly generate set-focused main_skill blocks in pass-context sessions, which breaks the single-focus-per-session invariant documented at `archetypes.ts:16-25`. Only `SKILL_TAGS_BY_TYPE` (the Swap-pool source of truth) widens to `'set'`. The distinction is principled: **default assembly is single-focus; Swap is user-initiated and may cross focus boundaries by intent.**

**Why `d41` (pair) specifically and not `d40 Footwork` (solo).** `d40` is authored in Tier 1b — it is a third solo rung on top of `d38` + `d39` and is not needed in Tier 1a. `d41` is the lightest-weight pair rung (simple back-and-forth; no triangle geometry), and is the only way the partner walkthrough Task C can exercise setting via Swap in a pair 25-min context. Choosing `d41` over `d40` for Tier 1a prioritises the walkthrough's information value over solo breadth.

**Tests.**

- `app/src/data/__tests__/progressions.test.ts` (create if absent): chain-7-setting exists, has exactly 3 drill IDs, has zero forward links, has zero regression links.
- `app/src/domain/__tests__/findSwapAlternatives.test.ts`: add a case asserting that `main_skill` Swap on a `solo_open` context can surface `d38` and `d39` in its alternatives; add a pair `pair_net` case asserting `d41` surfaces in main_skill Swap alternatives.
- `app/src/domain/__tests__/sessionBuilder.test.ts`: assert that default (non-Swap) session generation on `solo_wall` 15-min does NOT pick a setting drill for main_skill (regression — preserves single-focus default).

**Acceptance.** The founder can run a default solo 15-min session and tap Swap on main_skill and reach `d38` or `d39` within 2–3 Swap taps. The founder can run a default pair 25-min session and reach `d41` via Swap within 2–3 taps. Default (non-Swap) session generation preserves pass/serve single-focus behavior. Partner walkthrough Task C can exercise at least one setting drill this way without the founder needing to explain the app's architecture.

**Files touched.**

- `app/src/data/drills.ts` (three new drills `d38`, `d39`, `d41`).
- `app/src/data/progressions.ts` (new chain `chain-7-setting`).
- `app/src/domain/sessionBuilder.ts` (expand `SKILL_TAGS_BY_TYPE.main_skill` and `.pressure`).
- Tests as above.

### Unit 3 — Vocabulary sweep with inline definitions

**Goal.** BAB-standard terminology across all drill copy, with inline parenthetical definitions on first occurrence so a partner who hasn't read the BAB glossary can follow every drill without pausing.

**Sweep `app/src/data/drills.ts`:**

- `courtsideInstructions` and `coachingCues` strings use BAB glossary terms where applicable: **Sideout** (serve → set → attack), **Transition** (defense → set → attack), **Tomahawk**, **Pokey**, **Pull Dig**, **Cut Shot**, **High Line**, **Cross-Court**, **Joust**, **Free Ball**, **Down Ball**.
- Replace generic vocabulary: "attack" → "spike" when vertical power is meant, "attack" → "shot" when placement is meant, "throw" → "toss" for feeds, "slam" → "hit" or "spike."
- **Inline parenthetical definitions on first occurrence** of each specialised term per drill: for example `"Pokey (open-knuckle tip)"`, `"Tomahawk (two-hand overhead emergency touch)"`, `"Sideout (serve → set → attack)"`, `"High Line (deep line shot over the blocker)"`, `"Cut Shot (sharp cross-court angle)"`, `"Pull Dig (low-body dig from blocker position pulled off net)"`. Definition appears only on the term's first appearance inside a single drill's `courtsideInstructions`; subsequent occurrences in the same drill's copy do not repeat the definition. This gives the partner a glossary inline without 20 lines of header noise and aligns with `docs/research/bab-source-material.md` authoring norms.
- Do **not** rename drill `name` or `shortName` fields on existing drills — those are stable identifiers that have already been seen by the founder and appear in historical session records (Dexie `ExecutionLog.plan.blocks[].drillName`).

**Reference comment at the top of `drills.ts` (short — 3–4 lines):**

```
// Drill copy uses BAB 2024 course vocabulary. Specialised terms get an
// inline parenthetical brief definition on first occurrence per drill
// (e.g. "Pokey (open-knuckle tip)"). Full glossary + source provenance:
// docs/research/bab-source-material.md.
```

Do NOT author the 20-line glossary block that the prior Tier 1 plan proposed. It is redundant with the research file and adds maintenance surface.

**Acceptance.** Any drill's `courtsideInstructions` read standalone without requiring the reader to know BAB vocabulary. The vocabulary is consistent across all drills (no drill uses two different words for the same thing).

**Files touched.**

- `app/src/data/drills.ts` (sweep of existing drill copy + 3–4 line reference comment + inline definitions on new Tier 1a drills).
- Tests: existing drill tests that assert on copy strings need to be updated if any vocabulary changes hit them. Expect 0–3 affected tests; audit before sweep.

### Unit 4 — "Chosen because:" annotation on RunScreen

**Goal.** A single deterministic sentence on each block in the run surface that explains why that block was chosen. Cheap trust surface; supports the partner walkthrough's "is this decorative or meaningful" read; pre-positions for Tier 2 See-Why without committing to a modal.

**Work.**

- In `app/src/domain/sessionBuilder.ts`, extend the block-construction path (`buildDraft`'s block-assembly loop near line 158) to compute a single-sentence rationale per block. The sentence is deterministic — the same context + selected drill must always produce the same sentence.
- Suggested sentence template: `"Chosen because: {blockType} block, {focus} focus, {playerMode} {timeProfile}-min."` with `{focus}` inferred from the selected drill's primary `skillFocus`. For the warmup slot: `"Chosen because: every session starts with Beach Prep (D105)."` For the wrap slot: `"Chosen because: every session ends with a downshift (D85)."`
- Add the rationale to the `DraftBlock` type in `app/src/types/session.ts` as a new optional field `rationale?: string`.
- Plumb through `createSessionFromDraft` in `app/src/services/session.ts` so the rationale persists into the materialised `SessionPlanBlock` (NOT Dexie — keep in-memory for now; Tier 2 decides whether to persist). This keeps RunScreen capable of rendering the rationale without needing another derivation path.
- On `app/src/screens/RunScreen.tsx` (or wherever the active-block card renders), add the rationale below the existing coaching cue, styled quieter (smaller, lower contrast) than the coaching cue. ~10 lines of JSX.
- Tests:
  - `sessionBuilder.test.ts`: build a session, assert `blocks[0].rationale` is a non-empty string containing the block type.
  - RunScreen component test if the existing pattern supports it: render a session with a rationale, assert the rationale is visible.

**Acceptance.** Every block on RunScreen displays one short sentence explaining why it was chosen. The sentence is the same across rebuilds of the same session. Partner walkthrough Task A can flag the rationale as "nodded at" or "ignored as noise" in the ledger.

**Files touched.**

- `app/src/domain/sessionBuilder.ts` (rationale derivation).
- `app/src/types/session.ts` (optional `rationale` on `DraftBlock`).
- `app/src/services/session.ts` (plumb through `createSessionFromDraft`).
- `app/src/screens/RunScreen.tsx` (render).
- Tests as above.

### Unit 5 — Last-3-sessions row on Home

**Goal.** Three rows on Home: date, inferred focus, completion Y/N. Reads from Dexie `ExecutionLog`. Cheap. Supports the adversarial memo's Condition 2 (makes app-internal history visible so the founder has less reason to keep history in a notes app).

**Work.**

- In `app/src/db/dao/executionLog.ts` (or equivalent), add a query that returns the three most recent `ExecutionLog` records ordered by start timestamp descending.
- For each record, infer the session's focus from `plan.blocks` where `block.type === 'main_skill'`: look up the drill by name in the static drills catalog, read its first `skillFocus` tag. If no main_skill block is present (edge case: mid-flow abandon before main_skill), report `focus: 'partial'`.
- Derive completion Y/N from the existing `status` field on `ExecutionLog` (added per `D-C7`): `status === 'completed'` → Y; any `ended-early` variant or `in-progress` older than 24h → N.
- On `app/src/screens/HomeScreen.tsx`, render the three rows below the primary CTA. If fewer than three sessions exist, render only the ones that exist. If zero exist, render nothing (no empty state — the CTA is its own call to action).
- Styling: plain text, small, three columns (date left, focus middle, Y/N right). No links; tapping a row does nothing in Tier 1a (Tier 2 considers making them tappable).
- Tests:
  - Unit test on the query: given 5 logs, returns the 3 most recent in descending order.
  - Unit test on focus inference: a log whose main_skill drill is `d38` (Bump Set) returns focus `'set'`.
  - Component test: Home renders 0 / 1 / 2 / 3 rows correctly depending on log count.

**Acceptance.** After the founder runs 3 Tier 1a sessions, Home shows those 3 sessions in reverse-chronological order with correct focus inference and correct completion status. The founder has no reason to keep a running session log outside the app.

**Files touched.**

- `app/src/db/dao/executionLog.ts` (new query).
- `app/src/screens/HomeScreen.tsx` (render rows).
- `app/src/domain/sessionFocus.ts` (or inline helper) for focus inference if not already present.
- Tests as above.

## Acceptance bar for Tier 1a

Tier 1a is done when **all** of the following hold:

1. **The founder logs ≥5 sessions in `docs/research/founder-use-ledger.md` across ≥2 weeks**, every one of which shows `d28 Beach Prep Three` in its warmup block. (Unit 1 acceptance, behavioral.)
2. **The founder logs ≥1 session** where the main_skill block is a setting drill (`d38`, `d39`, or `d41`) reached via Swap. (Unit 2 acceptance; proves the Swap-pool expansion is reachable in practice.)
3. **The partner walkthrough per `docs/research/partner-walkthrough-script.md` has been delivered** and the walkthrough ledger contains observations tagged with severities. The Tier 1a gate does not require the walkthrough to return zero P0s; it requires the walkthrough to have happened honestly and its output to be legible.
4. **The 30-day behavioural-return window has started** (delivery date recorded, founder quiet-window commitment visible in the ledger). The 30-day outcome itself does not have to be in before Tier 1b begins — it gates Tier 2, not Tier 1b.
5. **`npm run test`** passes locally (existing test suite + new Tier 1a unit tests). Any test that fails because a drill copy string changed in the vocabulary sweep is updated, not disabled.
6. **`npm run lint`** and **`npm run build`** are clean.
7. **No schema migration.** Dexie schema version is unchanged. New drills graduate in via the existing `DRILLS` static export. No user data is touched.
8. **No new SetupScreen toggles.** The SetupScreen UI is unchanged from its pre-Tier-1a state.

## Tier 1b triggers and scope

**Triggers (all must hold before Tier 1b begins):**

- Tier 1a acceptance bar passes (all 8 items above).
- The founder has attempted to substitute from the existing library at least once and logged the attempt in `founder-use-ledger.md` (per adversarial-memo authoring cap).
- Either (a) the partner walkthrough ledger contains a ≥P1 tag that Tier 1b content would address, OR (b) the founder has logged ≥3 sessions describing a specific content gap ("wanted X, closest match was Y which didn't work because Z").

**Scope (capped at 10 new drill records, total, plus progression links):**

- **Layer A candidates (5 drills, §R7 exit-3 applied 2026-04-26):** `d31 Self Toss Target Practice`, `d33 Around the World Serving`, `d40 Footwork for Setting`, `d42 Corner to Corner Setting`, `d43 Triangle Setting`. Order and inclusion depend on logged demand. Authoring spec: `docs/plans/2026-04-22-tier1b-serving-setting-expansion.md`. Deferred from Tier 1b: `d36 Jump Float Introduction` re-enters under `O7` track 2 (sports-medicine / PT review). Layer-A cap consumption is 5/10, not 6/10.
- Progression links for `chain-6-serving` and `chain-7-setting` with the dead-end fixes documented in the deferred-scope table above (branch Rung 1 pair + solo in parallel; rung 4 unlocks 5 and 6 in parallel; settling fundamentals default-unlocked).
- `d27 Beach Prep Two` if and only if founder-use logs the need.
- `d30 Pair Pepper Progression` + `pair_long_warmup` archetype variant if and only if partner walkthrough surfaces the need. **`d29 Beach Prep Five` ships with this bundle** (it has no surface to opt into otherwise).

Tier 1b shipping does not unblock Tier 2 on its own; Tier 2 is gated separately on Condition 3.

## Tier 1c trigger (focus-toggle architecture)

Tier 1c lands the full focus-routing architecture: `sessionFocus: 'pass' | 'serve' | 'set'` field on `SessionDraft.context`, dynamic `slot.skillTags` override in `pickForSlot` (replace slot skillTags with `[context.sessionFocus]` for `main_skill` and `pressure` blocks during candidate lookup), and parallel fix in `findSwapAlternatives` (same override path), plus a Swap-Focus button on the draft screen (not SetupScreen, per `P11`).

**Trigger (any one fires Tier 1c):**

- Founder-use-ledger shows ≥8 sessions whose `note` field indicates an explicit intent mismatch ("wanted to serve, kept rolling pass drills").
- Partner walkthrough ledger contains a ≥P1 flag "I wanted to train X but couldn't find a way to tell the app," OR the partner's Task B debrief explicitly names a missing focus toggle.
- Founder logs ≥3 set-focused sessions reached via Swap and explicitly describes the Swap interaction as friction in `founder-use-ledger.md`.

**Architectural prerequisites (documented here, built in Tier 1c):**

- `SetupContext` gains `sessionFocus?: 'pass' | 'serve' | 'set'` as optional with default `undefined` (preserves `P11` recommend-first — if undefined, builder picks).
- `pickForSlot` adds a branch: if `slot.type === 'main_skill' || slot.type === 'pressure'` and `context.sessionFocus` is defined, replace `slot.skillTags` with `[context.sessionFocus]` before calling `findCandidates`.
- `findSwapAlternatives` reads `context.sessionFocus` and overrides `SKILL_TAGS_BY_TYPE[block.type]` the same way.
- Swap-Focus button lives on the draft screen, not SetupScreen. Tapping it cycles `context.sessionFocus` through `undefined → 'pass' → 'serve' → 'set' → undefined` and regenerates the draft.
- `SKILL_TAGS_BY_TYPE` stays as the default-fallback when `context.sessionFocus` is undefined; it is no longer the canonical source of truth.

These are documented now so that when Tier 1c ships it does not re-derive the architecture from scratch and does not repeat the Unit-2 shortcut of widening only `SKILL_TAGS_BY_TYPE` (Tier 1a's Swap-pool expansion becomes one of three call sites that Tier 1c unifies).

## Tier 2 triggers (unchanged from original plan, listed here for agent convenience)

Tier 2 (`See why` modal, richer summary copy, session history screen, recommendation-first first-run polish) begins when **all** of these hold:

- Tier 1a acceptance bar passes.
- The adversarial memo's Condition 3 passes (partner opened app unprompted within 30 days of walkthrough delivery), OR the failure consequence (Condition 3 fails → Tier 2 repoints at "what would have made the partner open it") has been applied and Tier 2 scope is explicitly the repointed target.
- The founder has completed at least two weeks of weekly Tier 1a sessions (`founder-use-ledger.md` shows ≥2 weeks of ≥1 session each).

Tier 2 scope explicitly does not include the weekly receipt, next-N queue, or carry-forward — those live in M002.

## Open questions carried forward

- **`O5` (M001 evidence threshold).** `D130` defers this; Tier 1a is evidence-gathering for the 2026-07-20 re-eval, not evidence-against-`D91`. See `docs/plans/2026-04-20-m001-adversarial-memo.md` for the pre-registered falsification conditions.
- **`O6` (phone courtside viability).** Still open; Tier 1a sessions are field tests of it for n=2 (founder, partner). Non-`D91` data.
- **`O7` (expert safety reviews).** Physio review landed as `D129`. Coach-review of drill biomechanics is on the `D130` 2026-07-20 re-eval list; not a Tier 1a blocker.
- **Warm-up dose compliance (`D85`, `D105`).** Tier 1a Unit 1 fixes the authoring side. Whether the founder actually completes Beach Prep Three rather than shortening is a behavioral signal captured in the founder-use ledger RPE + note fields.

## For agents

- **Authoritative for**: Tier 1a scope, work-unit breakdown, acceptance bar, and the Tier 1b / Tier 1c gating triggers for the founder-use M001 build.
- **Edit when**: a Tier 1a unit's scope shifts, an acceptance criterion is revised, Tier 1b or Tier 1c triggers change, or a deferred-scope item graduates.
- **Belongs elsewhere**: decision rationale (`docs/decisions.md` `D130`), milestone-level product contract (`docs/milestones/m001-solo-session-loop.md`), M002 scope (`docs/milestones/m002-weekly-confidence-loop.md`), partner-walkthrough protocol (`docs/research/partner-walkthrough-script.md`), founder session log (`docs/research/founder-use-ledger.md`), pre-registered falsification conditions (`docs/plans/2026-04-20-m001-adversarial-memo.md`), physio-review outcome (`D129`).
- **Outranked by**: `docs/decisions.md`, `docs/milestones/m001-solo-session-loop.md`, `docs/plans/2026-04-20-m001-adversarial-memo.md` (for any question of whether a tier advances or a condition is met).
- **Key pattern**: Tier 1a work units are numbered (1–5); code-comment references should cite `Tier 1a Unit N` rather than line numbers. Tier 1b and Tier 1c are described as scope + triggers, not as numbered units — they are authored into separate plan documents when they begin.

## Changelog for this plan

- **2026-04-20-a / -b**: original seven-unit Tier 1 plan (warmup, pair opening-block, 7-rung serving ladder, 8-rung setting chain, vocab sweep, invariants header, focus-toggle-as-Option-B).
- **2026-04-20-c** *(not merged)*: interim edits during red-team review; resolved O4 references, aligned with FIVB/BAB source files.
- **2026-04-20-d**: full rewrite as Tier 1a (this document). Rescoped from seven units to five; stripped SetupScreen toggles (P11 / D123 compliance); deferred serving ladder, full setting chain, focus architecture, and pair opening-block to Tier 1b / Tier 1c with explicit behavioural triggers; promoted Chosen-because and last-3-sessions from original Tier 2 to Tier 1a (cheap trust surfaces that support the adversarial-memo Conditions 2 and 3); dropped the archetype invariants header unit entirely (already shipped pre-Tier-1a). Architectural notes for Tier 1b (pair_long_warmup as archetype variant, not dynamic compression) and Tier 1c (dynamic skillTags override in pickForSlot AND findSwapAlternatives) documented here even though not built. Document co-evolved with `docs/plans/2026-04-20-m001-adversarial-memo.md`, `docs/research/founder-use-ledger.md`, and the rewritten `docs/research/partner-walkthrough-script.md`.
