---

## id: 2026-04-27-cca2-dogfeed-findings
title: "cca2 Dogfeed Findings (founder + Seb pair pass session, 25 min)"
type: research
status: active
stage: validation
authority: "Validated findings from the 2026-04-27 founder + Seb dogfeed session against the cca2 build (post-D133 per-drill capture, post-Tier-1b Layer A drill authoring, post-2026-04-27 solo-vs-pair sweep). Each finding cites the spec/code/data evidence that produced it. Not a recommendation surface — recommendations land in the linked plans."
summary: "Six validated findings from the 2026-04-27 cca2 dogfeed: (1) Difficulty chip surface gates to main_skill/pressure block-types, so a 25-min pair pass session with one main_skill swap got exactly one chip — by-spec but under-instrumented. (2) Pass-counter coverage gap is two halves: streak-shaped main-skill drills get no count surface, AND count-eligible drills at non-main_skill slots get no count surface either. (3) Second confirmation of the Tier 1b in-session running rep counter trigger (first fired 2026-04-26). (4) Tier 1c focus-picker + skill-level-mutability second hit — Seb's 'I want 30 minutes of serving' + 'change my level day-to-day' is structurally a partner-walkthrough ≥P1 finding. (5) d26 cooldown courtside copy is calibrated to 3 min while the actual block today was 4 min (~1.5 min 'what do I do?' gap). (6) d03 Continuous Passing fits 'movement_proxy' slot only nominally — base drill is stationary kneel-stand-repeat; movement enters via progressionDescription only; 6-Leg Monster (the more movement-heavy drill) was inverted into the technique slot. Provenance: founder + Seb voice memo + Dexie export volley-drills-export-2026-04-27.json + chat dump."
last_updated: 2026-04-27
depends_on:
  - docs/specs/m001-review-micro-spec.md
  - docs/decisions.md
  - docs/research/founder-use-ledger.md
related:
  - docs/plans/2026-04-26-pair-rep-capture-tier1b.md
  - docs/plans/2026-04-27-per-drill-capture-coverage.md
  - docs/plans/2026-04-20-m001-tier1-implementation.md
  - docs/plans/2026-04-20-m001-adversarial-memo.md
  - docs/research/2026-04-26-pair-rep-capture-options.md
  - docs/research/partner-walkthrough-results/2026-04-21-tier-1a-walkthrough.md
decision_refs:
  - D104
  - D120
  - D130
  - D132
  - D133
open_question_refs:
  - O12

# cca2 Dogfeed Findings

## Agent Quick Scan

- Validated-only findings from the 2026-04-27 founder + Seb pair pass session against the cca2 build (the latest one, with `D133` per-drill capture + Tier 1b Layer A drills + the 2026-04-27 solo-vs-pair sweep all live). Six findings: two real bugs, one by-design tension, one trigger-met signal, one trigger-second-hit signal, one content-coverage gap.
- Each finding has a cited code/spec line so the next reviewer can re-trace the chain.
- This note does **not** recommend implementations. Recommended fixes route to:
  - `docs/plans/2026-04-27-per-drill-capture-coverage.md` (findings 1 + 2)
  - `docs/plans/2026-04-26-pair-rep-capture-tier1b.md` post-ship-follow-ups (finding 3)
  - `docs/plans/2026-04-20-m001-tier1-implementation.md` Tier 1c trigger (finding 4)
  - app catalog edit for `d26` courtsideInstructions (finding 5, ships same-day)
  - `app/src/domain/sessionBuilder.ts::pickForSlot` slot-fill change (finding 6, ships same-day)
- Provenance: founder chat dump + Seb voice memo (transcribed by founder) + Dexie export `volley-drills-export-2026-04-27.json` (8 plans, 8 execution logs, 7 reviews; relevant session is plan `4212f2a3-…` / execution `0db9583f-…`).

## Session in question

Pair + Open archetype, 25-min layout, completed 2026-04-27. `playerCount: 2`, `wind: light`, no net, no wall. Block layout matches `pair_open` 25-min in `app/src/data/archetypes.ts`:


| #   | Slot                   | Drill (variant)                    | `successMetric.type` | Got Drill Check?     | Got Good/Total?               |
| --- | ---------------------- | ---------------------------------- | -------------------- | -------------------- | ----------------------------- |
| 0   | warmup                 | Beach Prep Three (`d28-solo`)      | n/a                  | no (warmup)          | no                            |
| 1   | technique              | 6-Legged Monster (`d10-pair`)      | `pass-rate-good`     | no (block-type gate) | no                            |
| 2   | movement_proxy         | Continuous Passing (`d03-pair`)    | `pass-rate-good`     | no (block-type gate) | no                            |
| 3   | main_skill *(swapped)* | Bump Set Fundamentals (`d38-pair`) | `streak`             | yes                  | no (`streak` ∉ count metrics) |
| 4   | wrap                   | Lower-body Stretch (`d26-solo`)    | `completion`         | no (wrap)            | no                            |


Original main_skill (pre-swap) was One-Arm Pass (`d11-pair`, `successMetric.type: 'reps-successful'`). Swap to Bump Set was chosen by the founder mid-flow; `swapCount: 10`. Review payload: `sessionRpe: 5`, `goodPasses: 0`, `totalAttempts: 0`, exactly one `perDrillCapture` row (`d38-pair`, `difficulty: still_learning`, no counts).

## Findings

### F1 — Difficulty chip gates to `main_skill | pressure` block-types (by-design tension, not a bug)

**Claim.** The "Too hard / Still learning / Too easy" Difficulty chip only appears on the Drill Check screen for blocks whose type is `main_skill` or `pressure`. Today's session had exactly one such block (the swap to Bump Set), so exactly one chip fired. The "only on the new drills" framing in the founder report is coincidence — the swap landed on a Tier 1b-authored drill.

**Evidence.**

- `app/src/screens/DrillCheckScreen.tsx:90` — `(prevBlock.type === 'main_skill' || prevBlock.type === 'pressure')` is the gate condition for `captureTarget`.
- `docs/specs/m001-review-micro-spec.md:86, 167` — spec contract is consistent: per-drill capture happens for count drills on Drill Check; non-count main-skill drills require Difficulty but skip counts; non-main_skill blocks are silent on the contract.
- Export: 1 `perDrillCapture` row out of 5 blocks completed.

**Tension.** The cca2 cca2 build is a 25-min pair pass-focus session with three real passing reps — One-Arm Pass swapped out, 6-Leg Monster at technique, Continuous Pass at movement_proxy — and the user got asked about exactly one. The spec language "only main-skill blocks" reads ambiguously: the founder read it as "only the highest-load block of the session," but the real-felt experience is "I just did three passing reps and you asked me about one." The block-type gate is correct as a way to prevent chip-fatigue across warmup/wrap; it is over-narrow as a way to capture meaningful skill work.

**Routing.** `docs/plans/2026-04-27-per-drill-capture-coverage.md` Gap 2b (capture surface should follow drill `successMetric.type`, not block-slot type, for count-eligible drills).

### F2 — Pass counter has two compounding gaps, not one

**Claim.** Today's session produced zero Good/Total entries anywhere. Two distinct causes compounded:

- **Gap 2a (streak/non-count main-skill drills).** Bump Set's `successMetric.type: 'streak'` is excluded from `COUNT_BASED_METRIC_TYPES` in `app/src/domain/policies.ts:69-72`. So the `Add counts (optional)` affordance in `PerDrillCapture.tsx:120` does not render. A user training a setting drill (or any streak / points-to-target / pass-grade-avg / composite drill) at the main_skill slot has no count surface at all — only the chip.
- **Gap 2b (count-eligible drills at non-main_skill slots).** The block-type gate from F1 means count-eligible drills like 6-Leg Monster (`pass-rate-good`) and Continuous Passing (`pass-rate-good`) get no Drill Check capture *and* no session-level Review card (the session-level card was deliberately removed for count drills under `D133`, `m001-review-micro-spec.md:167`). They fall through both surfaces.

Net: a pair pass-focus session with three count-eligible passing drills produced no count surface anywhere because the only main_skill slot was swapped to a streak drill.

**Evidence.**

- `app/src/components/PerDrillCapture.tsx:120` — `{showCounts && !countsOpen && (...)}`. When `showCounts: false`, the "Add counts" button is not even rendered.
- `app/src/domain/policies.ts:69-72` — `COUNT_BASED_METRIC_TYPES = new Set(['pass-rate-good', 'reps-successful'])`. `streak`, `points-to-target`, `pass-grade-avg`, `composite`, `completion` are excluded by spec (`m001-review-micro-spec.md:142`).
- `app/src/data/drills.ts:1916` — `d38-pair` has `successMetric.type: 'streak'`.
- Export: `goodPasses: 0`, `totalAttempts: 0`, `perDrillCaptures[0]` has no `goodPasses` / `attemptCount` fields.

**Routing.** `docs/plans/2026-04-27-per-drill-capture-coverage.md` (covers both gaps; gap 2a is a "what does count capture even look like for a streak drill?" spec question; gap 2b is a "drill metric type, not block-slot type, drives capture eligibility" implementation change).

### F3 — Second confirmation of Tier 1b in-session running rep counter trigger

**Claim.** The founder's "I'm not sold on counting passes because [memory/awareness]" lands on the same trigger as the 2026-04-26 session: post-session Good/Total feels fake. Today is the second independent founder-session confirmation that post-session counting is too lossy. The founder additionally proposes putting the counter on the timer page, or adding an in-block "count good and bad passes" cue.

**Evidence.**

- `docs/research/founder-use-ledger.md:82` — the 2026-04-26 row records the first trigger fire.
- `docs/plans/2026-04-26-pair-rep-capture-tier1b.md:120-124` — the in-session running counter on `RunScreen.tsx` was explicitly deferred under a re-trigger condition: "founder logs ≥2 additional sessions after `D133` ships where the per-drill Good/Total optional card *also* felt fake or was systematically skipped on a session where the founder wanted the data."
- The 2026-04-27 session is the **first** of those ≥2 additional sessions. One more session with the same flag fires the re-trigger formally; the founder's chat-class evidence today is recorded but does not yet meet the strict ≥2 threshold.

**Routing.** Recorded in the founder-use-ledger 2026-04-27 row as accumulating evidence (1 of ≥2 toward the post-`D133` Framing C re-trigger). No plan change yet.

### F4 — Tier 1c focus-picker + skill-level-mutability: second hit

**Claim.** Seb's voice memo contains three explicit asks that map to the deferred Tier 1c surface:

1. *"Today I want to do 30 minutes of serving. If I want to do 30 minutes of serving drills, I would like to be able to select that."* — focus picker.
2. *"I would like to be able to change my skill set level to better reflect my skill set."* — skill-level mutability.
3. *"If I selected [intermediate] level, being able to choose what skills I want to drill down to would be good too."* — focus picker × skill-level interaction.

These are structurally the same kind of evidence as a partner-walkthrough ≥P1 finding (Seb is the partner; his framing of "future me, who might be like, 'today I want to do 30 minutes of serving'" is exactly the Task-B debrief shape).

**Evidence.**

- `docs/plans/2026-04-20-m001-tier1-implementation.md:291-295` — Tier 1c trigger is "any one fires": (a) ≥8 founder-ledger sessions with intent-mismatch notes, (b) partner walkthrough ≥P1 flag "I wanted to train X but couldn't find a way to tell the app," OR partner Task B debrief explicitly names a missing focus toggle, (c) ≥3 founder set-focused sessions reached via Swap with Swap interaction noted as friction.
- 2026-04-21 founder gaps 1 + 2 + 3 (`docs/research/founder-use-ledger.md:90-94`) recorded the founder-side asks.
- 2026-04-27 Seb voice memo provides the partner-side ask.
- The (b) clause is arguably met. Strict reading of the trigger language ("partner walkthrough" — a scripted protocol, not a dogfeed) leaves the door open to call this *evidence accumulating toward (b)* rather than (b) fully met.

**Skill-level mutability is a separate surface.** The Tier 1c plan covers focus-routing only (`sessionFocus: 'pass' | 'serve' | 'set'` context field, dynamic `slot.skillTags` override, Swap-Focus button on draft). Seb's "change my level day-to-day" is **not** that surface — it is mutability of `onboarding.skillLevel`, currently captured once during onboarding (`storageMeta` row `onboarding.skillLevel: 'unsure'` in the export confirms it's never re-prompted). This needs its own line item, not bundling into Tier 1c.

**Routing.** `docs/plans/2026-04-20-m001-tier1-implementation.md` Tier 1c trigger updated to record the second hit; new sibling line item for skill-level mutability tracked separately.

### F5 — d26 cooldown copy ↔ block-duration math mismatch (small bug, ships now)

**Claim.** Today's wrap block was 4 minutes (`durationMinutes: 4` in the export). `d26-solo` `courtsideInstructions` reads "Short wrap (~3 min on the timer): three moves, about 45 to 60 s each, one side (mirror if time remains)." The described content is ~150 s, the timer ran 240 s, so there is a ~1.5 min "what do I do?" gap. The drill knows about longer wraps in `progressionDescription` ("When wrap runs 5+ minutes, add second sides, glutes, or adductors") but the courtside copy that the user reads at runtime does not.

**Evidence.**

- `app/src/data/drills.ts:1814-1816` — `d26-solo` `courtsideInstructions` hard-codes "~3 min on the timer."
- `app/src/data/drills.ts:1796-1800` — `workload.durationMinMinutes: 3, durationMaxMinutes: 6`. The session builder is allowed to assign 3-6 min to this slot; the copy is calibrated for the lower bound only.
- Export shows `durationMinutes: 4` for today's block.

**Fix.** Rewrite `courtsideInstructions` to honor the 3-6 min range honestly; keep the three-move structure as the floor, name mirror/glute/adductor additions as the ceiling. Same drill ID and variant ID; pure courtside-copy edit.

**Routing.** Ships same-day to `app/src/data/drills.ts`; no plan doc; founder-use-ledger row points at this finding for traceability.

### F6 — d03 Continuous Passing fits `movement_proxy` slot only nominally; slot inversion today

**Claim.** Today's session had `d10-pair` 6-Legged Monster (`skillFocus: ['pass', 'movement']`, six directional shuffles to six target spots) at the **technique** slot, and `d03-pair` Continuous Passing (`skillFocus: ['pass']`, kneel→stand→repeat with retosses between) at the **movement_proxy** slot. The slots are inverted relative to the stated archetype intent.

**Evidence.**

- `app/src/data/archetypes.ts:83-90` — `movement_proxy` slot intent: "Footwork, first-step movement, or reading proxies before harder block." `skillTags: ['pass', 'movement']` (inclusive — any drill with `pass` OR `movement` matches).
- `app/src/data/drills.ts:191-240` — `d03` `skillFocus: ['pass']` (no `movement` tag); base drill courtside is "Start kneeling. Partner tosses; receiver passes back 10 reps. Then stand in serve-receive stance and repeat." Movement enters only via `progressionDescription: 'Increase toss speed; add 1-step movement every rep.'`
- `app/src/data/drills.ts:622-674` — `d10` `skillFocus: ['pass', 'movement']`; courtside is six tosses to six named spots (front-left / side-left / behind-left / front-right / side-right / behind-right) — the more movement-heavy drill of the two.
- `app/src/domain/sessionBuilder.ts:86-105, 114-147` — `pickForSlot` matches drills via inclusive skillTag intersection (`slot.skillTags.some(...)`) and shuffles the unused pool, so any pass-tagged drill can fill `movement_proxy`. There is no preference for drills carrying `movement` in `skillFocus`.

**Founder reading.** *"For continuous passing it doesn't feel like a movement proxy, the passer just kneels in the grass and gets tossed a ball and then stands up and stays mostly while being tossed a ball, and the thrower just catches and retosses the ball resetting between each, and then we switch."* — accurate read of the drill content; the slot label oversells the movement content.

**Fix.** Update `pickForSlot` to prefer drills carrying `'movement'` in `skillFocus` for `movement_proxy` slots, falling back to `pass`-only drills only when no movement-tagged drill is available. Same one-line `pool.find()` shape as the existing `slot.type === 'warmup'` branch (warmup prefers `'warmup'` skillFocus, falls back to non-recovery; the parallel here is exact). Today's session would have placed `d10-pair` at movement_proxy (it carries `'movement'`) and pulled a different drill into technique.

**Routing.** Ships same-day to `app/src/domain/sessionBuilder.ts::pickForSlot`; new test case in `sessionBuilder.test.ts`; founder-use-ledger row points at this finding.

### F8 — Skill marker missing from the eyebrow + setup-led courtside copy buries the skill

**Claim.** Founder report on `d33-pair`: *"is this a serving drill? It's really not that clear."* Two compounding gaps:

- **Content-level (multiple drills):** most M001 skill drills' `courtsideInstructions` lead with logistics ("Stand 3 m apart…", "Mark a target circle…", "Take turns…") and bury the skill verb in subordinate clauses or in the second sentence. The eye scanning courtside lands on setup, not action. Trigger drill: `d33-pair` ("Take turns. Each partner works the full 6-zone order… Partner across the net calls the next zone before each serve…" — "serve" appears mid-sentence).
- **Structural-level:** the run-flow header eyebrow showed only the slot role (`Main drill`) with no skill marker, so there was no upstream signal of which skill the drill works. Combined with names like "Around the World **Serving**" / "Corner to Corner **Setting**" that trail with the skill word, a glancing reader had no fast path to skill identity.

**Evidence.**

- Audit of 17 m001Candidate skill-drill variants: 16 led with logistics or setup, only `d33-solo-net` led with the skill verb ("Serve through six zones in order…").
- Drill names that bury the skill word at the trail: `d10` The 6-Legged Monster (no skill word), `d31` Self Toss Target Practice (no skill word), `d33` Around the World **Serving** (trailing), `d38` Bump Set Fundamentals (compound), `d42` Corner to Corner **Setting** (trailing).
- `app/src/screens/RunScreen.tsx` header eyebrow (post-F1 follow-up, pre-F8 sweep) rendered only `phaseLabel(currentBlock.type)` (`Main drill` / `Technique` / etc.) — no skill marker.
- `app/src/screens/TransitionScreen.tsx` rendered `Up next · {phaseLabel}` — same gap.

**Fix (shipped same-day):**

1. **New `getBlockSkillFocus` helper** in `app/src/domain/drillMetadata.ts`. Resolves a planned block's drill from the catalog and returns one of `'pass' | 'serve' | 'set'` (the surfaced skill set), or `null` for non-skill blocks (warmup, recovery), unknown drills, or drills whose primary `skillFocus[0]` is a non-surfaced skill (`'attack'`, `'block'`, `'dig'`, `'conditioning'`).
2. **New `skillLabel` + `blockEyebrowLabel` helpers** in `app/src/lib/format.ts`. `skillLabel` returns `'Pass' | 'Serve' | 'Set'`. `blockEyebrowLabel` composes `{phaseLabel} · {skillLabel}` for skill-bearing blocks (technique / movement_proxy / main_skill / pressure when skill resolves), bare `phaseLabel` for warmup / wrap (skill omitted by design).
3. `**RunScreen` eyebrow** now reads e.g. `Main drill · Serve` / `Technique · Pass` / `Pressure · Set`. Sentence case kept; accent-color treatment kept; no new visual chrome added.
4. `**TransitionScreen` eyebrow** reads `Up next · Main drill · Serve` (three parts, founder vocab call `trans_full` over `trans_skill_only`).
5. **New courtside-copy invariant rule 6** added to `.cursor/rules/courtside-copy.mdc`: *"For every drill whose `skillFocus[0]` is one of `pass | serve | set`, the first sentence of `courtsideInstructions` must contain the skill verb (or an unambiguous compound — `bump-set`, `hand-set`, `forearm-pass`)."*
6. **Catalog sweep** of all 17 m001Candidate skill-drill variants in `app/src/data/drills.ts`. Every variant's `courtsideInstructions` rewritten to lead with the skill verb. Examples:
  - `d33-pair` (the trigger): `Take turns. Each partner works the full 6-zone order…` → `Serve through the same 6-zone order as Solo, taking turns…`
  - `d38-pair`: `Stand 3 m apart. Partner tosses an arc to the setter; setter bump-sets it back at catchable height.` → `Bump-set back to your partner at catchable height. Stand 3 m apart…`
  - `d10-pair`: `Tosser at net (or 2 to 3 m away). Six tosses total…` → `Pass back to the set window from six spots in turn. Tosser at net (or 2 to 3 m away) feeds six tosses…`
7. **Catalog regression test** in `app/src/data/__tests__/drillCopyRegressions.test.ts`: new `lead-with-skill invariant` block parametrizes over every m001Candidate skill drill variant + asserts the first word of `courtsideInstructions` matches the per-skill verb regex (`/^(forearm-)?pass(?:es|ed|ing)?\b/i` for pass; `/^serve(?:s|d|ing)?\b/i` for serve; `/^(?:bump-|hand-)?set(?:s|ting)?\b/i` for set). Future authoring that leads with logistics breaks the test before merge.

**What this fix is NOT.**

- Not a drill-name rewrite. Names like "Around the World Serving" / "Corner to Corner Setting" still trail with the skill word; renaming would churn `ExecutionLog.plan.blocks[].drillName` references in persisted user data and partner-walkthrough ledger. The eyebrow + body sentence work together to surface the skill without name changes.
- Not Tier 1c. Tier 1c (focus picker) is still trigger-gated; this fix surfaces the per-block skill from the drill catalog, not a user-selected session focus. When Tier 1c lands, the eyebrow can additionally cite the user-selected `sessionFocus` and verify it matches the resolved per-block skillFocus.
- Not a per-skill capture-shape change. F2 gap 2a (streak / points-to-target / pass-grade-avg drills capture Difficulty only) is separate and stays in `docs/plans/2026-04-27-per-drill-capture-coverage.md` Phase 2 scope.

**Routing.** Shipped 2026-04-27 same-day; spec contract unchanged (the rationale field stays preserved on `SessionPlanBlock`); courtside-copy rule 6 in place; 62 new tests landed across `format.phaseLabel.test.ts`, `drillMetadata.skillFocus.test.ts`, `RunScreen.rationale-placement.test.tsx`, `TransitionScreen.role-eyebrow.test.tsx`, and `drillCopyRegressions.test.ts`.

### F7 — Solo movement_proxy content gap (red-team finding while validating F6)

**Claim.** While red-teaming the F6 fix and adding a parametrized sessionBuilder test sweep, three test failures surfaced a separate content-authoring gap: solo archetypes (`solo_wall` / `solo_net` / `solo_open`) carry a `movement_proxy` slot in their 25-min and 40-min layouts (per `app/src/data/archetypes.ts`), but **no `m001Candidate: true` drill carries `'movement'` in `skillFocus` AND has a solo-compatible variant**. The F6 prefer-`'movement'` branch in `pickForSlot` therefore has no candidate to prefer for solo builds, and the slot falls through to a pass-only drill via `pool[0]`.

**Evidence.**

- Red-team test sweep across `solo_wall 25` / `solo_net 25` / `solo_open 25` × 8 seeds each produced a movement_proxy block on every seed; the drill at that slot was always pass-only (`d05` Passing Around the Lines / `d11` One-Arm Pass / `d01` Pass to Self/Wall — all `skillFocus: ['pass']`).
- `app/src/data/drills.ts`: the only `m001Candidate: true` drills with `'movement'` in `skillFocus` are `d09` Passing Around the Lines (variant `d09-pair`), `d10` 6-Legged Monster (variant `d10-pair`), and `d15` Short/Deep Reaction (variant `d15-pair`+). All three are pair-only.
- Other `'pass', 'movement'` drills (`d12` U Passing, `d13` W Passing, `d14` Pass & Switch, `d16` Diamond Passing, `d17` ?, `d18` Beat to Pole) carry `m001Candidate: false`.

**Distinction from F6.** F6 was an *inversion* bug — both `d10-pair` (movement-tagged) and `d03-pair` (pass-only) were in the pair pool, and the wrong one was at movement_proxy. F7 is a *content-empty* situation — for solo, the movement-tagged option doesn't exist in the M001 pool, so the slot fills with whatever pass drill is reachable. The slot still resolves cleanly; it just doesn't carry the movement intent the slot's `intent` string ("Footwork, first-step movement, or reading proxies before harder block.") promises.

**Status.** Documented, not fixed. Three coherent fix directions for future consideration:

1. **Author solo movement-tagged drills.** Add `d10-solo` (a self-toss variant of 6-Legged Monster) or a new solo footwork drill (e.g., `d-something Sand Shuffle Touch`). Tier 1b authoring slot, gated by the existing authoring-budget cap and a behavioral trigger.
2. **Make `movement_proxy` non-required in solo archetypes.** Currently `movement_proxy` is `required: false` per `archetypes.ts:88`; if the pool produces no movement-tagged drill, the slot could be skipped entirely rather than filled with a pass drill that misnames its slot. But this loses a useful skill block and creates a 4-block-or-5-block ambiguity.
3. **Accept the slot inversion for solo and rename the slot's intent.** Slot intent reads as "Footwork, first-step movement, or reading proxies." If solo pass drills include movement-adjacent reps (e.g., `d05` toss-and-move-laterally is movement-flavored), the intent could be re-written to permit "supporting platform reps" too. Lowest-effort but waters the slot's identity.

**Recommendation.** Hold for a future founder session that explicitly flags solo movement-block content as missing. Until then, the test in `sessionBuilder.test.ts` pins the current behavior so a future content fix can flip the assertion when it ships.

**Routing.** Recorded here; no plan-doc routing yet (waiting for founder-side trigger).

## What's working — Seb's positives, kept legible

- *"More concise, flowed better."* — recent editorial passes (R11/R13 reconciled-list polish, pre-D91 editorial polish, walkthrough closeout polish, Tier 1b Layer A drill authoring) are landing as intended.
- *"Appreciated the addition of new workouts."* — Tier 1b Layer A sequencing reads well from the partner side.
- The intermittent beep at sub-block intervals continues to land correctly ("intermittent beeping at 44 seconds for example help me get all stretches/moves in in time" — earlier ledger entry, restated today).

## Out of scope for this note

- Founder-use-ledger row authoring (lives in `docs/research/founder-use-ledger.md`; this note is the source the row points at).
- Decision rows (none of the findings here change canon decisions; F4 may surface a `D###` proposed row when Tier 1c trigger formally fires).
- D104 50-contact rolling-window math implementation (post-M001).
- Bump Set drill content review (today's session was the founder's first run on `d38-pair`; no claim about whether the drill is well-authored beyond the metric-type gap above).

## For agents

- **Authoritative for**: validated findings from the 2026-04-27 cca2 dogfeed; the bug-vs-design distinctions for the per-drill capture surface; the slot-inversion finding on `d03` / `d10` for the `movement_proxy` slot.
- **Edit when**: a follow-up dogfeed produces evidence that overturns or extends a finding; cite the new evidence inline, do not delete the original entry.
- **Belongs elsewhere**: founder behavioral count (`docs/research/founder-use-ledger.md`); implementation routing (the linked plan docs); decision changes (`docs/decisions.md`).
- **Outranked by**: `docs/decisions.md`, `docs/specs/m001-review-micro-spec.md`, `docs/plans/2026-04-20-m001-adversarial-memo.md`.
- **Key pattern**: this note follows `docs/research/2026-04-26-pair-rep-capture-options.md` shape — agent-facing scan, evidence-cited findings, explicit routing, no recommendations.

