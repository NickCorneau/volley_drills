---

## id: what-to-add-next-2026-04-28

title: "Ideation: what to add next (2026-04-28)"
type: ideation
status: active
stage: validation
authority: "Ranked ideation artifact for the post-Tier-1b-Layer-A 'what's next' question. Identifies the strongest directions worth exploring under the current evidence base, the active D130 founder-use mode (2026-04-20 → 2026-07-20), the 4/10 Tier 1b authoring-budget cap consumption, and the D134 falsification gate read on 2026-05-12. Does not author requirements; ce-brainstorm picks one survivor and defines it."
summary: "13 candidate clusters generated across 6 ideation frames; 5 survive the evidence-gating critique. None of the top survivors consume the drill-authoring cap — the unmet needs are infrastructure (audio reliability), evidence (ledger + walkthrough), prepay (Tier 1c architecture), and maintenance (m001Candidate:false retirement). Author solo movement-tagged drill (F7) and Tier-1c-lite explicitly rejected as substitution-class moves."
last_updated: 2026-04-28
related:

- docs/research/founder-use-ledger.md
- docs/research/2026-04-27-cca2-dogfeed-findings.md
- docs/research/2026-04-28-build17-pair-dogfeed-feedback.md
- docs/reviews/2026-04-22-drill-level-audit.md
- docs/plans/2026-04-22-tier1b-serving-setting-expansion.md
- docs/plans/2026-04-20-m001-tier1-implementation.md
- docs/plans/2026-04-20-m001-adversarial-memo.md
- docs/plans/2026-04-28-per-drill-capture-coverage-phase-2a-streak.md
- docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md
decision_refs:
- D91
- D130
- D131
- D133
- D134

# Ideation: what to add next (2026-04-28)

## Revision note (2026-04-28, post-D135 same-day)

This artifact was anchored on the **pre-D135** reading of the canon. Later the same day, `D135` landed in `docs/decisions.md` (uncommitted on the working tree at the time of this ideation), clarifying that walkthrough-equivalence is source-validity gated, not script gated. Two consequences:

- **Survivor S4 ("Tier 1c architectural prepay")** — re-read as **"Tier 1c implementation now triggered."** The strict trigger fired under D135 clause 2 (Seb's 2026-04-27 cca2 + 2026-04-28 build-17 voice memos). Spec-only is no longer the right shape; live implementation is the documented next ship under D135 sequencing option A.
- **Skill-level mutability sibling** — D135 also fired the partner-walkthrough OR clause for the skill-level mutability sibling trigger (same plan §"Skill-level mutability — separate surface"). Originally categorized as a rejected line ("Tier-1c-lite"), this surface is now a *triggered sibling* that pairs structurally with Tier 1c on the draft screen.
- **Survivor S1 ("Audio-pacing infra + visible block-end chip")** — already mid-ship on the working tree as `docs/research/2026-04-28-audio-pacing-reliability-investigation.md` with two confirmed app-side gaps and an applied fix (held wake lock + `d25` sub-block pacing metadata). Treat S1 as in-flight, not a fresh candidate.
- **Survivors S2, S3, S5** — unaffected by D135 and remain valid as authored.

The post-D135 implementation plan that absorbed S4 + skill-level mutability + S5 is `docs/plans/2026-04-28-tier-1c-prepay-and-catalog-audit.md` (rewritten 2026-04-28 to reflect the trigger fire). The pre-D135 critique below is preserved for historical context — it is correct against the snapshot it read, not against the current canon.

## Purpose

Produce a ranked menu of "what's next" candidates after Tier 1b Layer A landed (`d31`, `d33`, `d40`, `d42`, 4/10 cap consumed). Workflow: ce-ideate → ce-brainstorm → ce-plan. This artifact is the ce-ideate output.

## Use This File When

- deciding the next M001 ship between now and the 2026-05-21 D130 Condition 3 final close
- assessing whether a candidate is evidence-fired vs substitution-class
- triaging future work that surfaces while D130 founder-use mode is active

## Not For

- authoring requirements (that's `ce-brainstorm` on the chosen survivor)
- authoring an implementation plan (that's `ce-plan`)
- amending decision rows or trigger thresholds
- reading later than 2026-05-21 without a refresh — the evidence base shifts at Condition 3 final close

## Method

- **Mode**: repo-grounded
- **Volume**: default (5–7 survivors)
- **Frames**: 6 (pain · inversion · reframing · leverage · cross-domain · constraint-flip)
- **Grounding**: prior-turn audit (catalog, archetypes, progressions, founder ledger, dogfeed findings F1–F8 + build-17 feedback, drill-level audit, BAB+FIVB source notes, courtside-copy invariants, adversarial memo cap state)
- **Phase 1 dispatch skipped**: grounding already loaded; codebase/learnings/web-research would re-surface in-context material

## Source materials referenced

- `docs/research/founder-use-ledger.md` (2026-04-21 / -26 / -27 / -28 rows)
- `docs/research/2026-04-27-cca2-dogfeed-findings.md` (F1–F8)
- `docs/research/2026-04-28-build17-pair-dogfeed-feedback.md` (audio-beep + skill-level repeat asks)
- `docs/reviews/2026-04-22-drill-level-audit.md` (advanced-band gap, distribution skew)
- `docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md` (genuinely-open Tier 1b bundle)
- `docs/plans/2026-04-22-tier1b-serving-setting-expansion.md` (cap state, deferred candidates)
- `docs/plans/2026-04-28-per-drill-capture-coverage-phase-2a-streak.md` (D134 falsification gate)
- `app/src/data/drills.ts` + `archetypes.ts` + `progressions.ts` (catalog inventory)

## Survivors

Ranked by leverage × evidence-fired. **All five survivors consume zero authoring-cap slots.**

### S1 — Audio-pacing infrastructure + visible block-end countdown chip

- **Shape**: ship a deliberate audio-pacing engine for timed sub-blocks (`d25`, `d26`, `d28` today + any future timed drill) with an iPhone PWA reliability story (Web Audio + wake lock interaction; iOS silent-switch acknowledgement copy), paired with a visible block-end countdown chip on `RunScreen` so the user has a reliable channel when audio fails.
- **Evidence**: 2026-04-27 cca2 dogfeed and 2026-04-28 build-17 ledger row both flag missing/inaudible cooldown beeps despite the 2026-04-24 wake-lock + audio-primer ship. Two consecutive sessions of negative evidence on the same surface is partner-walkthrough-class.
- **Carrier doc**: already named on `partner-walkthrough-results/2026-04-22-all-passes-reconciled.md` §"Genuinely-open Tier 1b bundle" as a new item (timer-end screen-off anxiety / audio-suspend-on-lock).
- **Cap impact**: none. Not a drill record.
- **Trigger status**: fired.
- **Risk**: scope can balloon into a full media-session redesign. Bound by writing the brainstorm requirements doc with a small acceptance set (sub-block tick reliability across screen-on/off + silent-switch on/off; visible chip parity).

### S2 — Founder-ledger discipline + D134 streak-signal force

- **Shape**: a paired ops move, not a code ship. (a) Five logged founder sessions across the next 14 days with disciplined `note` fields. (b) At least one session that exercises a `streak`-typed `main_skill`/`pressure` drill (`d38-pair`, `d01-pair`, `d41-pair`) so the D134 falsification gate read on 2026-05-12 has real input.
- **Evidence**: D134 explicit gate condition; founder-ledger 2026-04-24 expansion already names ledger discipline as the binding move; the ledger has 4 rows in 7 days but the 2026-04-21 sessions are reconstructions, not discipline.
- **Cap impact**: none.
- **Trigger status**: standing operational discipline.
- **Risk**: discipline is the failure mode itself. Mitigation: pair this with S1 or S3 so a code-ship motivates the session.

### S3 — Partner walkthrough re-run on BAB-vocabulary surfaces

- **Shape**: re-script the partner walkthrough to deliberately exercise drill copy that has never been walkthrough-tested: `d33` six-zone naming, `d42` corner-target geometry, `d31` target-circle voice, `d40` planted-feet voice. Run with Seb on sand.
- **Evidence**: `partner-walkthrough-results/2026-04-22-all-passes-reconciled.md` §"Updated pre-D91 discipline checklist" already lists this. Layer A drills (d31/d33/d40/d42) introduced surfaces the 2026-04-21 walkthrough never touched.
- **Cap impact**: none.
- **Trigger status**: pre-condition for several future trigger reads (Tier 1b second wave, Tier 1c partner-walkthrough OR clause, Condition 3 final read 2026-05-21).
- **Compounding**: a single walkthrough updates ≥4 trigger evaluations.
- **Risk**: Seb cadence — last walkthrough was 2026-04-21. Need to schedule.

### S4 — Tier 1c architectural prepay (docs + scaffolds + tests, no UX)

- **Shape**: promote `docs/plans/2026-04-20-m001-tier1-implementation.md` §"Architectural prerequisites" to a stub spec under `docs/specs/`. Land a forward-only `SetupContext.sessionFocus?: 'pass' | 'serve' | 'set' | undefined` field with default `undefined` (preserves `P11` recommend-first; builder ignores when undefined). Scaffold `pickForSlot` and `findSwapAlternatives` override-branch code paths behind `if (context.sessionFocus !== undefined)`. Land `pickForSlot.test.ts` + `findSwapAlternatives.test.ts` cases that pin the override behavior. **No UX wiring.** Author the *separate* skill-level-mutability surface as a parallel-but-deferred sibling so the two stay distinct (per the 2026-04-28 ledger-row note).
- **Evidence**: design rationale is already pre-written in the Tier 1a implementation plan; promotion is honest because it doesn't ship UX without a fired trigger. The strict ≥8-session ledger trigger remains binding.
- **Cap impact**: none. No drill records.
- **Trigger status**: strict trigger not met; design-only ship is honest because it doesn't activate a user-facing path.
- **Risk**: over-engineering. Mitigation: keep test surface to two new test files; do not touch SetupScreen or draft screen.
- **Boundary check**: this is *not* Tier 1c-lite (which would ship a draft-screen Switch-focus chip). That was rejected as substitution-class. The prepay is documentation + dead code + tests only.

### S5 — `m001Candidate: false` retirement/promotion pass

- **Shape**: audit the 15 `m001Candidate: false` drills in `app/src/data/drills.ts` (`d02`, `d04`, `d06`, `d07`, `d08`, `d12`, `d13`, `d14`, `d16`, `d17`, `d19`, `d20`, `d21`, `d23`, `d24`) against (a) is there a plausible firing trigger, (b) if yes what's the evidence threshold, (c) if no, demote the record out of the active file and into a frozen archive doc. Ship the demotion as a single PR with no behavior change.
- **Evidence**: drill-level audit notes `m001Candidate:false` records exist but does not catalog their triggers; some are 3-player (`d08`, `d14`, `d20`) and overlap `d43`/`d44`/`d45` deferral logic; others are wall- or net-dependent; some are cap-class polish (`d02` towel posture, `d24` corner pass) that have no firing path under D130.
- **Cap impact**: none (cap counts authored M001-active records).
- **Trigger status**: trigger-free; pure maintenance.
- **Risk**: low. Each retired record stays git-recoverable.
- **Compounding**: cleaner active catalog = cleaner next drill-level audit + faster onboarding for any future agent.

## Rejected (with reasons)


| Cluster                                       | Verdict                             | Reason                                                                                                                                                                    |
| --------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Author solo movement-tagged drill (F7)        | Reject (defer)                      | F7 doc itself recommends hold; no post-2026-04-26 solo session has flagged the slot; authoring without trigger = the substitution shape the adversarial memo Cond 1 names |
| Tier-1c-lite (draft-screen Switch-focus chip) | Reject                              | Crosses the strict Tier 1c trigger; "lite" is the exact substitution shape the cap exists to prevent                                                                      |
| `d27`/`d29` as variants on `d28`              | Reject (clever but wrong)           | Conflates compliance-fallback vs longer-warmup distinction; sidesteps cap dishonestly; their separate trigger gates exist for reasons                                     |
| Auto-fill / Net/Wall persistence              | Reject (deferred)                   | Already explicitly deferred in `docs/plans/2026-04-27-layer-2-reliability-and-audit-pass.md` pending dedicated setup/safety/defaults spec — respect the deferral          |
| Home "Pick up where you left off" eyebrow     | Reject (Tier-1c-shaped, no trigger) | Solves a problem that hasn't fired; ship after Tier 1c                                                                                                                    |
| Settings skill heat-map (28-day)              | Reject (cute, no logged demand)     | Polish-class; defer until a session note explicitly flags monoculture training                                                                                            |
| Replace beep entirely with screen-flash       | Reject (over-corrects)              | Paired audio + visible chip is the right shape (covered by S1)                                                                                                            |
| Per-block "last attempt" eyebrow              | Reject (tier-2 polish)              | Lives in M002 history surface; out of M001 scope                                                                                                                          |


## Stopped lines (anti-substitution check)

The cap discipline asks: did the ideation surface a clever way to ship drill-shaped content under a different label? Yes — three of the rejected lines (warmup-variants, focus-picker-lite, last-session-eyebrow) are exactly that. They are stopped lines, not survivors.

## Cross-cutting observations

- **All five survivors are zero-cap.** The unmet needs aren't content-shaped right now.
- **S1 is the only fully-fired single-action ship.** S2 and S3 are operational; S4 is design-only; S5 is maintenance.
- **S1 + S2 paired produces the strongest 14-day window before 2026-05-12.** S1 ships infra; S2 produces the streak-capture exercise data the falsification gate needs.
- **S3 is the highest-leverage external-facing move** but constrained by Seb cadence.
- **The 6 unconsumed cap slots stay reserved.** Any future drill ship needs its own logged trigger; nothing in the ideation surfaces that level of evidence today.

## Handoff

ce-brainstorm picks one survivor and produces a requirements doc in `docs/brainstorms/`. Recommended starting candidates:

- **S1** if the next ship is code (highest-fired evidence; unblocks the audio-pacing surface)
- **S2 + S3** if the next move is operational (binds the 2026-05-12 falsification read; updates Condition 3)
- **S4** if the next ship is design-debt prepay (cheap, no UX risk)
- **S5** if the next ship is maintenance hygiene (cleanup, low-risk)

After ce-brainstorm produces a requirements doc, ce-plan turns it into an implementation plan in `docs/plans/`.

## For agents

- **Authoritative for**: the ranked survivor list and rejection reasons as of 2026-04-28.
- **Edit when**: a new ledger row or partner-walkthrough finding shifts a trigger reading; a survivor is selected and consumed by ce-brainstorm; a rejected line acquires firing evidence.
- **Belongs elsewhere**: trigger conditions (`docs/plans/2026-04-20-m001-tier1-implementation.md`); cap state (`docs/plans/2026-04-20-m001-adversarial-memo.md`); D134 falsification gate (`docs/research/founder-use-ledger.md` §"Bounded D130 exceptions").
- **Outranked by**: `docs/decisions.md`; `docs/plans/2026-04-20-m001-adversarial-memo.md` (cap + falsification conditions).
- **Refresh by**: 2026-05-21 (D130 Condition 3 final close) at the latest.