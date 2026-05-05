---
id: skill-scope-and-game-layers-2026-04-29
title: "Ideation: skill-scope expansion (attack, tactics, out-of-system, live/adaptive) — how and when"
type: ideation
status: active
stage: validation
authority: "Ranked ideation artifact answering 'how and when do we integrate attacking, team tactics, out-of-system play, and live/adaptive layers into Volleycraft?'. Identifies the strongest directions worth exploring under current evidence (D125 volleyball-inclusive long-run, D130 founder-use mode, M001 active milestone, M002 deferred-for-later, persistent-team-identity research note). Does not author requirements; ce-brainstorm picks one survivor and defines it."
summary: "Seven survivors across two axes: a schema-only forward reservation for `attack` plus a `scenario` orthogonal axis (the lowest-cost durable move), a two-axis (skill × scenario) catalog reframe (the most leveraged), exposing existing game-like SuccessMetric types as a session shape, deferring team tactics until persistent team identity (M003+), pairing attack with serve as overhead-striking continuum, treating out-of-system as scenario not skill, and reframing live/adaptive as runner-surfacing not catalog expansion. Recommended sequence: schema-only reservation now (zero cap, zero migration), trigger-gated exposure when a partner-walkthrough or founder-ledger flag fires, and team tactics deferred to M003+."
last_updated: 2026-04-29
related:
  - docs/ideation/2026-04-28-what-to-add-next-ideation.md
  - docs/brainstorms/2026-04-29-session-focus-picker-requirements.md
  - docs/archive/brainstorms/2026-04-29-skill-scope-reservation-requirements.md
  - docs/archive/plans/2026-04-29-001-feat-tune-today-focus-picker-plan.md
  - docs/vision.md
  - docs/decisions.md
  - docs/milestones/m001-solo-session-loop.md
  - docs/milestones/m002-weekly-confidence-loop.md
  - docs/research/skill-correlation-amateur-beach.md
  - docs/research/persistent-team-identity.md
  - docs/research/product-naming.md
decision_refs:
  - D81
  - D121
  - D125
  - D130
  - D131
  - D135
---

# Ideation: skill-scope expansion and game-like layers

## Purpose

Answer the user's strategic question: should we add **attacking** as a fourth skill alongside pass/serve/set, and how should we think about adjacent **game-like / live / adaptive** categories such as team tactics and out-of-system play? When and how do we integrate them?

This artifact ranks directions worth exploring under current evidence. It does not author requirements; `ce-brainstorm` picks one survivor and defines it.

## Use This File When

- deciding whether to expand the `SkillFocus` enum or the `Tune today` chip set
- triaging proposals that pull the catalog beyond pass/serve/set
- evaluating new layers (scenarios, tactics, game-modes, adaptive runner behavior)
- answering "is now the time?" for any of the above

## Not For

- authoring drill content (own decision and trigger)
- replacing the `D125` beach-first M001 stance
- shipping team tactics or coach-clipboard surfaces (M003+ work; M002 explicitly excludes)
- modifying `D131` no-telemetry posture

## Method

- **Mode**: repo-grounded
- **Volume**: default (5-7 survivors; 7 retained because the user's question spans multiple distinct sub-questions)
- **Frames**: 6 (pain · inversion · reframing · leverage · cross-domain · constraint-flip)
- **Grounding**: orchestrator-level, drawing on the canonical decisions, the just-shipped Tier 1c plan, the active "what to add next" ideation, the skill-correlation vendor synthesis, persistent-team-identity research, and product-naming rationale (`D125`)
- **Phase 1 dispatch skipped**: grounding loaded directly to keep agent-cost honest after a heavy session pass

## Source materials referenced

- `docs/vision.md` (P13 pair-first; volleyball-inclusive long-run; non-goals)
- `docs/decisions.md` (D81 reserve, D121 skill-level taxonomy, D125 naming, D130 founder-use mode, D131 no-telemetry, D135 walkthrough-equivalence policy)
- `docs/milestones/m001-solo-session-loop.md` and `docs/milestones/m002-weekly-confidence-loop.md` (M002 explicitly excludes team identity)
- `docs/research/skill-correlation-amateur-beach.md` (per-skill r ≈ 0.35-0.50; serve ↔ spike noticeably higher; Gabbett 2006 spike +76% / set +335% / pass +40% / serve +15% asymmetry)
- `docs/research/persistent-team-identity.md` (when team layers can land)
- `docs/research/product-naming.md` (D125 volleyball-inclusive long-run rationale)
- `app/src/types/drill.ts` (current `SkillFocus` enum: `pass | serve | set | movement | conditioning | recovery | warmup`; no `attack` yet)
- `docs/ideation/2026-04-28-what-to-add-next-ideation.md` (existing rejection lines around new content authoring without trigger)
- `docs/archive/plans/2026-04-29-001-feat-tune-today-focus-picker-plan.md` (just-shipped Tier 1c picker, four states pass/serve/set/Recommended)

## Anchor problem (one paragraph)

The just-shipped Tier 1c focus picker locked four UI states (Recommended, Passing, Serving, Setting) into the user-facing model. The vision is volleyball-inclusive long-run; the catalog already authors a 26-drill seed pack (D81); the cap stays at 4/10 under D130 founder-use; partner-walkthrough and founder-ledger evidence is the trigger discipline. The user is asking the meta-question: how should we think about expanding beyond pass/serve/set? Attacking is the obvious next skill but isn't structurally identical (needs a setter, transfers from serving, hard to do solo). Team tactics, out-of-system, and game-like / live / adaptive belong to different conceptual axes and may not all be "skills" at all. The right answer is not a single new chip; it is a small forward-compatible architectural move plus a sharp deferral story for everything else.

## Survivors

Ranked by leverage × evidence-honesty × cap discipline.

### S1 — Forward-only schema reservation: `attack` SkillFocus + `scenario` field, no UX exposure

- **Shape**: add `'attack'` to the `SkillFocus` type union as a reserved enum value with zero drill records carrying it. Add an optional `scenario?: 'in_system' | 'out_of_system' | 'transition' | 'side_out' | 'game_like'` field to `DrillVariant` (or analogous home), again unused. Document both as forward reservations in `docs/decisions.md` (e.g., a new `D136` or extension of `D81` reserve mechanism).
- **Why first**: pure forward-compatibility. The eventual content cost lands when (and only when) the trigger fires; today's cost is two type-unions, no behavior, no migration, no cap consumption. Mirrors the `D121` reserved-tokens posture and the existing `m001Candidate: false` reserve discipline.
- **Evidence**: `D125` volleyball-inclusive long-run; `docs/research/skill-correlation-amateur-beach.md` (per-skill model is correct; attack as separate first-class skill is right shape if added).
- **Cap impact**: zero. Not a drill record; no Tier 1b authoring slot.
- **Trigger to expose**: same D135-style criteria — partner-walkthrough ≥P1 flag naming an attack gap, OR ≥3 founder-ledger rows naming an attack gap during real use.
- **Risk**: scope drift. Mitigation: the reservation explicitly forbids drill authoring or UI exposure; the doc reads "this enum exists so future content lands without a schema bump, not so anyone ships attack today."
- **Compounding**: every later surface (Tune today picker, drill catalog, swap pools, evidence rollups) inherits the enum without breaking.

### S2 — Two-axis catalog reframe: skill × scenario as the durable expansion shape

- **Shape**: name the architectural pattern Volleycraft is already drifting toward — *skills are technique GMPs (pass / serve / set / attack), scenarios are tactical contexts (in-system / out-of-system / transition / side-out / game-like)*. Document the two-axis model as a research note. Drills tag both axes; the Tune today picker remains skill-only in v1; future Tune today rows or post-M001 surfaces can layer the scenario axis without schema churn.
- **Why a strong survivor**: cross-domain analogy is unanimous — climbing apps (route × movement-pattern), fitness apps (muscle group × workout type), language learning (skill × use case), boxing apps (punch × context). Volleyball is structurally identical: the same passing drill is meaningfully different "in-system" vs "out-of-system." Without naming the second axis, the only way to expand content is to balloon the skill enum, which the skill-correlation research says is exactly wrong.
- **Evidence**: `docs/research/skill-correlation-amateur-beach.md` (per-skill is correct; tactical context is orthogonal); existing `SuccessMetric` types (`points-to-target`, `composite`) already encode game-like patterns at the metric layer; existing `d28 Beach Prep Three` and similar drills already implicitly contain scenario context.
- **Cap impact**: zero (research note, no drills authored).
- **Trigger to expose**: only after S1 reservation and at least one new content category fires its own trigger. Until then, the two-axis model lives as documented architecture, not user-visible UI.
- **Risk**: premature abstraction. Mitigation: the two-axis note is *descriptive of how content should be tagged when authored*, not prescriptive of new UI surfaces. The default `Tune today` picker stays skill-only.
- **Compounding**: makes every future content add cheaper because the implementer knows where new content slots in (which axis).

### S3 — Game-like is already in the catalog; expose existing `SuccessMetric` types better

- **Shape**: do not author a new "game day" mode. Instead, surface the already-existing `MetricType = 'streak' | 'points-to-target' | 'completion' | 'composite'` patterns more honestly in the runner and review surfaces. A drill with `points-to-target` *is* a wash drill; a drill with `composite` *is* a queen-of-court analog. The "game-like" gap is presentation, not catalog scope.
- **Why a survivor**: the `MetricType` enum already encodes most game-modes amateur beach players want. The 2026-04-28 per-drill capture phase 2A streak shipping reinforces this — game-like capture lives at the metric layer. The product gap is that users do not perceive the existing drills as "game-like" because the runner copy is technique-grind voice.
- **Evidence**: `app/src/types/drill.ts` (`MetricType` already 7 variants); `docs/archive/plans/2026-04-28-per-drill-capture-coverage-phase-2a-streak.md` (streak capture proves the metric path).
- **Cap impact**: zero (runner copy + review surface polish).
- **Trigger**: a founder/partner session note naming "this didn't feel like volleyball, it felt like drills" — current trigger pre-fired by 2026-04-21 partner-walkthrough commentary on session shape feeling rigid.
- **Risk**: low — copy-tier change. Risk is over-claiming game-like vibe on drills that are still technique-grind underneath.
- **Compounding**: makes the existing catalog more legible without authoring new content.

### S4 — Defer team tactics until persistent team identity ships (M003+)

- **Shape**: the right answer to "team tactics" is a clear "not now / when": tactics belong to a coach-or-team layer, and `M002` explicitly excludes durable team identity. Document this as a sequencing decision: team tactics are post-M002 work and are paired with the eventual `Team` object. Until then, treat any drill that requires "your team's defense system" as out of scope for M001/M002 even if a partner asks for it.
- **Why a survivor**: it answers half the user's question with a clean deferral that isn't lazy — there's a real architectural reason (no team object) and a real product reason (the loop right now is "how do I run a session," not "how do my pair and I coordinate strategy").
- **Evidence**: `docs/milestones/m002-weekly-confidence-loop.md` line 81 ("Durable Team object or persistent pair identity" — explicitly out of scope); `docs/research/persistent-team-identity.md`; `docs/vision.md` (coach-to-client and team layers are downstream of self-coached loop).
- **Cap impact**: zero.
- **Trigger to revisit**: persistent-team-identity surface ships (M003 or later) AND a partner-walkthrough returns ≥P1 evidence that two players want to log shared tactical decisions.
- **Risk**: deferring forever. Mitigation: the deferral is anchored to a real architectural prerequisite (Team object), not just "later."

### S5 — Attack pairs with serve (overhead-striking continuum), not isolated

- **Shape**: when attack is eventually exposed, document it as the second member of an "overhead striking" cluster with serve, not as an isolated fourth skill. The skill-correlation research is explicit: pass↔set correlation is low (different effectors); serve↔spike correlation is noticeably higher (shared overhead GMP). UI implication: a future Tune today might show focus chips clustered as `Recommended | Passing | Setting | Overhead (Serving / Attacking)` rather than four flat options.
- **Why a survivor**: prevents a known wrong shape (treating attack as isolated) and makes the eventual content authoring cheaper (a serving drill that adds a target zone becomes an attacking drill cleanly).
- **Evidence**: `docs/research/skill-correlation-amateur-beach.md` (vendor 1 explicitly: "serve ↔ spike noticeably higher"; Gabbett 2006 spike +76% / serve +15% growth-rate asymmetry).
- **Cap impact**: zero (architectural framing only).
- **Trigger**: same as S1's expose-attack trigger.
- **Risk**: under-exposing attack as a distinct user choice. Mitigation: the cluster framing is internal architecture; the user-facing chip is still "Attacking" when shipped.

### S6 — Out-of-system is scenario, not skill

- **Shape**: do not add `'out-of-system'` to `SkillFocus`. It is not a skill — it is a constraint scenario applied to existing skills. A passing drill that begins with the ball offline is "passing in out-of-system context"; a setting drill where the pass is outside the 2-meter window is "setting out-of-system." This is exactly the second axis S2 names.
- **Why a survivor**: reframes a category the user mentioned without requiring catalog growth. Out-of-system is the most commonly cited amateur-beach training gap (scrambled passes, hand-set when bump-set is right, off-net attack lines), so getting the model right matters.
- **Evidence**: vendor 3 in `skill-correlation-amateur-beach.md` notes within-rally coupling vs person-level correlation — out-of-system is exactly a within-rally coupling concept; coaching practice (FIVB, USA Volleyball, Volleyball Canada Development Matrix) treats it as a context, not a skill.
- **Cap impact**: zero.
- **Trigger to expose**: depends on S2 (two-axis architecture documented) and on partner-walkthrough or founder evidence that scrambled-pass scenarios are missing from the catalog.
- **Risk**: confusing with skill in messaging. Mitigation: when surfaced, copy reads "Today's scenario" or "Today's situation," never "skill."

### S7 — Live/adaptive is runner-surfacing, not catalog expansion

- **Shape**: the user lumped "live / adaptive" with skill-scope, but they are different. Live behavior already exists — the runner has timer ticks, swap-block, end-early, sub-block pacing, audio cues, wake-lock. Adaptive behavior is the existing builder responding to context (`SetupContext`, recent completions, substitution rules). The honest answer is: live/adaptive is *runner UX work*, not catalog or skill scope. The pacing-indicator and audio-pacing investigations already in flight are the right home.
- **Why a survivor**: prevents the user from accidentally bundling "more adaptive UX" with "more drill content." They are different work streams with different triggers.
- **Evidence**: `docs/plans/2026-04-28-per-move-pacing-indicator.md` (in-flight); `docs/research/2026-04-28-audio-pacing-reliability-investigation.md` (in-flight); `app/src/hooks/useSessionRunner.ts` already implements swap behavior.
- **Cap impact**: zero.
- **Trigger**: existing in-flight pacing/audio work is already the trigger.
- **Risk**: discoverability — users may not realize the existing controls are "adaptive." Mitigation: addressed by ongoing pacing-indicator work, not by this artifact.

## Cross-cutting observations

- **All seven survivors are zero-cap.** None requires a new drill record. The strongest moves are architectural framings, not content adds.
- **The user's question has three distinct answers**, not one:
  1. Attacking → S1 (reserve now, expose on trigger) + S5 (cluster with serve when exposed)
  2. Team tactics, out-of-system, game-like → S4 (defer team tactics to M003+) + S6 (out-of-system is scenario) + S3 (game-like already exists in `MetricType`)
  3. Live/adaptive → S7 (runner work, not catalog work)
- **The two-axis reframe (S2) is the deepest leverage move.** It reorganizes how every future content add is thought about, not just attack.
- **Trigger discipline holds.** The 2026-04-28 ideation's rejection lines (no new drills without trigger) survive — the survivors above are schema reservations, research notes, runner-surfacing work, and explicit deferrals, none of which touch the cap.

## When to integrate (the user's actual question)

Sequenced by cost and trigger readiness:

1. **Now (zero-cost, forward-compatible)** — S1 schema reservation + S2 two-axis research note. Both can land in a single small docs+types PR. No content, no UI, no cap consumption.
2. **Same trigger discipline as Tier 1c** — when a partner walkthrough returns ≥P1 evidence naming an attack gap OR ≥3 founder-ledger rows do, expose attack as a fifth `Tune today` chip and author 1-2 attack drills. Cluster with serve per S5.
3. **When game-like vibe is dogfooded as missing** — surface existing `MetricType` patterns better in copy + review (S3). This is small, runner-tier polish work that does not require a new milestone.
4. **Already in flight (M001 Tier 1c+)** — the live/adaptive work (S7) is happening through the per-move pacing indicator and audio-pacing reliability streams. No new ideation needed.
5. **M003+ when persistent team identity ships** — team tactics layer (S4). Pair with the durable `Team` object work; do not ship before the team object exists.

## Rejected (with reasons)

| Cluster | Verdict | Reason |
|---|---|---|
| Add `attack` chip to Tune today now | Reject | No trigger fired; would consume the cap; substitution-class shape that the 2026-04-28 ideation already rejects. |
| Build a separate "Attacking" app or mode | Reject | Contradicts vision (one trustworthy tool); not the product identity. |
| Replace pass/serve/set with attack/defense/transition | Reject (clever but wrong) | Tier 1c just shipped; reversing the focus model is churn for no evidence. |
| Add team tactics now (defense system, signals) | Reject (defer) | No `Team` object exists; M002 explicitly excludes; product loop is "run a session," not "coordinate strategy." |
| Replace skill-focus with scenario-only | Reject | Throws away just-shipped Tier 1c; skills and scenarios are orthogonal axes per S2. |
| Open-ended AI coach chat for tactical advice | Reject (out-of-product-identity) | P7 deterministic-only; vision non-goal; D131 no-telemetry posture. |
| Full game-scoring system with wash-drill UI | Reject (premature) | Requires score-capture UI and game-mode logic; out of M001 scope; existing `MetricType` covers the high-leverage path (S3). |
| Real-time HRV / wearable adaptive intensity | Reject (out-of-scope) | No sensor capture; D131 no-telemetry; outside local-first PWA constraints. |
| Tactical playbook authoring | Reject | Contradicts deterministic-rules principle; this is video/coach-content territory, not training-runner. |
| Author attacking drills now to "catch up" with the vision | Reject (substitution shape) | The cap exists to prevent exactly this; vision says volleyball-inclusive *long-run*, not v1. |
| Add `attack` chip + drills as part of Tier 1c bundle | Reject | Tier 1c shipped pass/serve/set scope deliberately; bundling attack would have widened the trigger. |

## Stopped lines (anti-substitution check)

The cap discipline asks: did the ideation surface a clever way to ship drill-shaped content under a different label? Three rejected lines (attack-now, attacking-drills-to-catch-up, full-game-scoring-system) are exactly that. They are stopped lines, not survivors. The genuine survivors are schema reservations, research notes, runner-surfacing work, and explicit deferrals.

## Handoff

`ce-brainstorm` picks one survivor and produces a requirements doc in `docs/brainstorms/`.

Recommended sequence (lowest cost first):

1. **S1 + S2 combined** — *consumed 2026-04-29* by `docs/archive/brainstorms/2026-04-29-skill-scope-reservation-requirements.md`. Authors a single docs+types PR: reserve `'attack'` in `SkillFocus`, reserve `scenario?` on `DrillVariant`, add a decision row, author `docs/research/skill-vs-scenario-axes.md`, and cross-link. Explicitly does not author drills, expose UI, consume the cap, or fire `D135`.
2. **S4 deferral note** — second target. Document team-tactics deferral as a sequencing decision in `docs/decisions.md` so future agents do not re-litigate the question every milestone.
3. **S3 game-like surfacing** — third, when copy/runner work surfaces as the next chunk.
4. **Trigger fire** — when partner-walkthrough or founder-ledger evidence flags an attack gap, brainstorm S5 (attack as overhead-striking cluster with serve) and ship under D135-style discipline.

After ce-brainstorm produces a requirements doc, ce-plan turns it into an implementation plan in `docs/plans/`.

## For agents

- **Authoritative for**: the ranked menu of skill-scope expansion directions and their trigger sequencing as of 2026-04-29.
- **Edit when**: a new partner-walkthrough or founder-ledger row materially changes attack-gap evidence; a survivor is selected and consumed by ce-brainstorm; a rejected line acquires firing evidence; the persistent-team-identity surface ships (re-evaluate S4).
- **Belongs elsewhere**: trigger conditions for content authoring (`docs/plans/2026-04-20-m001-adversarial-memo.md`, `docs/decisions.md`); M002 scope boundaries (`docs/milestones/m002-weekly-confidence-loop.md`); persistent team identity (`docs/research/persistent-team-identity.md`); skill-correlation evidence (`docs/research/skill-correlation-amateur-beach.md`).
- **Outranked by**: `docs/vision.md`, `docs/decisions.md`, `docs/plans/2026-04-20-m001-adversarial-memo.md` (cap and falsification conditions).
- **Refresh by**: 2026-05-21 (D130 Condition 3 final close) at the latest, or sooner if a survivor is consumed.
