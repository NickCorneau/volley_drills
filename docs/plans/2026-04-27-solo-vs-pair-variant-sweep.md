---
id: solo-vs-pair-variant-sweep-2026-04-27
title: "Solo vs Pair variant authoring sweep (2026-04-27)"
type: plan
status: shipped
stage: validation
authority: "Catalog-authoring sweep that closes the partner-voice gap on the active M001 drill set: today the session builder can serve Solo-labelled variants to pair sessions when `participants.max ≥ 2`, and several active drills (notably `d38 Bump Set Fundamentals`, `d39 Hand Set Fundamentals`) have first-person self-toss voice that reads wrong with a partner present. Authors first-class Pair siblings for every active `m001Candidate: true` Solo-only drill where pair mode adds real training value (`d05`, `d38`, `d39`, `d40`, `d01`, `d31`, `d22`), splits `d33`'s inline dual-mode paragraph into separate Solo + Pair variants for catalog uniformity, tightens `participants.max = 1` on the Solo siblings whose pair voice now lives in a separate variant, and adds a permanent regression guard via a new catalog-validation rule. Lives within Tier 1b authoring discipline (variants ≠ drills for `MAX_SHIPPED_DRILLS`); no schema bump, no Dexie migration, no new Drill records, no new archetype rules."
summary: "Authoring sweep of 8 new Pair variants on 8 existing `m001Candidate: true` Drill families, plus a `d33-solo-net` rewrite-and-split, plus three `participants.max = 1` tightenings on the now-redundant Solo voices, plus a new `participants_label_mismatch` catalog-validation rule. Lifts the pair-mode menu from 'leaky solo voice' to a first-class pair drill catalog matching `D132`'s pair-first product stance, while keeping the M001 catalog footprint at 19 active Drill records (variant count grows; Drill count unchanged)."
last_updated: 2026-04-27
depends_on:
 - docs/milestones/m001-solo-session-loop.md
 - docs/plans/2026-04-20-m001-tier1-implementation.md
 - docs/plans/2026-04-26-pair-rep-capture-tier1b.md
 - docs/plans/2026-04-22-tier1b-serving-setting-expansion.md
 - docs/research/founder-use-ledger.md
related:
 - .cursor/rules/courtside-copy.mdc
 - docs/research/bab-source-material.md
 - app/src/data/drills.ts
 - app/src/data/catalogValidation.ts
decision_refs:
 - D101
 - D125
 - D130
 - D132
 - D133
---

# Solo vs Pair variant authoring sweep (2026-04-27)

## Trigger

Founder pair session 2026-04-27, on `/run/transition` looking at Up Next for `d38 Bump Set Fundamentals`. The partner-walkthrough Up Next paragraph rendered: *"Self-toss to yourself ~1.5 m up. Bump-set the ball back up with platform angled at the sky..."* The voice is solo-only — first-person self-toss, no partner role, no shag pattern — but the session was a pair session. The drill survived the playerCount filter (`d38-solo.participants.max = 4`) yet its `courtsideInstructions` assumed solo. Same gap on `d39 Hand Set Fundamentals` (max 4) and, less acutely, on every other Solo-labelled variant that doesn't tightly cap participants.

## Triage: where the leak actually lives

The session builder filters variants by `playerCount` against `participants.{min,max}` (`app/src/domain/sessionBuilder.ts:100-101`). A pair session has `playerCount = 2`, so any Solo-labelled variant with `participants.max ≥ 2` survives the filter. Of the active (`m001Candidate: true`) Solo-only drills, six survived the filter; only two of those have voice that genuinely breaks in pair mode (`d38`, `d39`). The others (`d22`, `d25`, `d26`, `d33`) are voice-neutral or already inline-dual.

Beyond the leakers, four more active Solo-only drills (`d05`, `d40`, `d01`, `d31`) currently have `participants.max = 1` so they don't reach pair sessions at all — but pair mode adds real training value to each, and authoring Pair variants for them turns the pair-mode menu from "five drills" into "thirteen drills."

| Drill | `participants.max` (today) | Voice in pair mode | Sweep action |
| --- | --- | --- | --- |
| `d22-solo` First to 10 Serving | 4 | Pair-neutral | Author `d22-pair` (tuned), tighten Solo to max=1 |
| `d25-solo` Downshift | 14 | Pair-neutral (warmup-ish, side-by-side) | Leave |
| `d26-solo` Lower-body Stretch | 14 | Pair-neutral (cooldown, side-by-side) | Leave |
| `d33-solo-net` Around the World Serving | 2 | Inline dual ("Solo: ... Pair: ...") | **Split**: rewrite as `d33-solo` + add `d33-pair` |
| `d38-solo` Bump Set Fundamentals | 4 | **Solo-only voice (the trigger)** | Author `d38-pair`, tighten Solo to max=1 |
| `d39-solo` Hand Set Fundamentals | 4 | **Solo-only voice** | Author `d39-pair`, tighten Solo to max=1 |
| `d05-solo` Self-Toss Pass to Set Window | 1 | (no leak) | Author `d05-pair` |
| `d40-solo` Footwork for Setting | 1 | (no leak) | Author `d40-pair` |
| `d01-solo` Pass & Slap Hands | 1 | (no leak) | Author `d01-pair` |
| `d31-solo-open` Self Toss Target Practice | 1 | (no leak) | Author `d31-pair` |
| `d23-solo` Serve & Dash | 1 | (no leak; also `m001Candidate: false`) | Skip |
| `d24-solo` Pass into a Corner (wall) | 1 | (no leak; wall-only) | Skip |

## Why the variant slot is the right shape (not a schema bump)

The catalog already does dual-mode the right way for some drills — `d04` (Catch Your Own Pass) and `d11` (One-Arm Passing) each carry separate `Solo` + `Pair` variants. `d41 Partner Set Back-and-Forth` and `d42 Corner to Corner Setting` are pair-only siblings on the same chain-7-setting family as `d38`/`d39`. The variant slot **is** the per-playerCount carrier already.

Adding `d38-pair`, `d39-pair`, etc. matches this established pattern. No schema additions (`courtsideInstructionsByPlayerCount`, etc.), no Dexie migration, no parallel pathway. `MAX_SHIPPED_DRILLS` (which counts Drill records, not variants — see the Tier 1b cap discipline in `docs/plans/2026-04-22-tier1b-serving-setting-expansion.md`) is unaffected.

This also lines up with **`D132` Pair-first product stance** (2026-04-22): solo accommodation is fine, but pair sessions deserve first-class voice. Right now they get solo voice with the wrong subject. That's the actual product gap.

## Scope (in shipping order)

### 1. Author 8 new Pair variants

All authored to the `.cursor/rules/courtside-copy.mdc` invariants (jargon gate, no em-dashes, plain punctuation, enumerate-don't-combinatoric). Tuned voice per scope confirmation: each pair variant gets workload + success metric tuned for partner-toss execution, not a copy-paste of the solo workload.

| New variant | Drill family | Roles | Feed | Success metric (target) | Workload notes |
| --- | --- | --- | --- | --- | --- |
| `d05-pair` | Self-Toss Pass to Set Window | passer + setter | partner-toss | `pass-rate-good` ≥ 70% over 20 partner tosses | Match d05-solo duration (4–8 min); RPE 4–6 (slightly higher than solo because partner toss adds reactivity) |
| `d38-pair` | Bump Set Fundamentals | tosser + setter | partner-toss | `streak` (15-set rally, mirroring `d41`) | 4–8 min, RPE 3–5; sibling-shape with `d41` |
| `d39-pair` | Hand Set Fundamentals | tosser + setter | partner-toss | `streak` (15-rally, sibling-shape with `d41`) | 4–8 min, RPE 3–5 |
| `d40-pair` | Footwork for Setting | tosser + setter | partner-toss | `reps-successful` (20 balanced sets, partner-reachable arc) | 5–10 min, RPE 4–6 (move + plant + set under partner-toss timing is more demanding than self-toss) |
| `d01-pair` | Pass & Slap Hands | tosser + passer | partner-toss | `streak` (≥ 15 consecutive clean contacts, partner catches between contacts) | 2–5 min, RPE 3–5 (sibling to d01-solo) |
| `d31-pair` | Self Toss Target Practice (Serving) | server + zone caller / shagger | self-toss (server) + partner shag | `reps-successful` (8 of 10 land in or near called zone) | 4–8 min, RPE 4–6; partner shags between rounds and calls the next zone |
| `d22-pair` | First to 10 Serving | server + server (alternate) | self-toss (each server in turn) | `points-to-target` (race to 10, alternate-serve format) | 6–12 min, RPE 5–7 |
| `d33-pair` (post-split) | Around the World Serving | server + shagger | self-toss (server) | `reps-successful` (hit all 6 zones in order; alternate servers per round) | 6–10 min, RPE 5–7 |

### 2. Split `d33-solo-net`

The current variant `d33-solo-net` carries inline "Solo: ... Pair: ..." in a single `courtsideInstructions` paragraph and `label: 'Solo or pair with net'`. After this sweep:

- **Variant ID `d33-solo-net` is preserved** (not renamed) to avoid any persisted-record drift; only its label, copy, and `participants.max` change.
- New `id: 'd33-solo-net'` becomes the Solo-only variant: `label: 'Solo'`, `participants.max = 1`, copy stripped of the "Pair: ..." sentence.
- New variant `d33-pair` is added with proper pair voice and `participants.{min:2, ideal:2, max:2}`.

### 3. Tighten Solo siblings to `max = 1`

Once each Pair variant ships, the corresponding Solo variant's `participants.max = 1` so the session builder cleanly routes pair sessions to the Pair variant and solo sessions to the Solo variant. Tightenings:

- `d22-solo`: 4 → 1
- `d38-solo`: 4 → 1
- `d39-solo`: 4 → 1
- `d33-solo-net`: 2 → 1 (handled as part of the split)

(`d05-solo`, `d40-solo`, `d01-solo`, `d31-solo-open` already at `max = 1`; no change.)

### 4. Add catalog-validation rule

New `DrillCatalogIssueCode`: `'participants_label_mismatch'`. Asserts:

- Any variant whose `label` starts with `"Solo"` must have `participants.max === 1`.
- Any variant whose `label` starts with `"Pair"` must have `participants.min === 2`.

Symmetric, falsifiable, and enforceable as a build-time test. Catches future drift if a pair variant author forgets `min: 2` or a solo variant author copy-pastes `max: 4`.

### 5. Tests

- `app/src/data/__tests__/catalogValidation.test.ts` — new case for `participants_label_mismatch` (positive + negative).
- `app/src/data/__tests__/catalogValidation.test.ts` — existing "accepts the current authored drill catalog" assertion serves as the integration check that all eight new variants and three tightenings satisfy every rule.
- `app/src/domain/__tests__/findSwapAlternatives.test.ts` (or a new sessionBuilder coverage test) — assert that pair-mode session selection now reaches `d38-pair` / `d39-pair` (not `d38-solo` / `d39-solo`) for the chain-7 setting slot.

### 6. Doc syncs

- `AGENTS.md` posture line: append the variant sweep summary.
- `docs/catalog.json` `last_updated` and add this plan to entrypoints once shipped.
- `docs/milestones/m001-solo-session-loop.md` quick-scan bullet.
- `docs/research/founder-use-ledger.md`: ledger-author owns this; this plan does not append.

## Explicitly NOT in scope

- New Drill records (no `MAX_SHIPPED_DRILLS` change).
- Schema bump to add `courtsideInstructionsByPlayerCount` or sibling fields. The variant slot already covers this.
- Dexie schema bump or migration. Variant additions are read-only catalog data; no persisted-row shape change.
- Touching `d22`, `d25`, `d26`, `d28` parent Drill text or warmup/cooldown variants. Voice is pair-neutral by nature for those.
- Authoring pair variants for `m001Candidate: false` drills (`d23`, `d24`). They don't reach active sessions; YAGNI.
- Re-authoring Solo voices. Solo variants stay as-is (voice-checked already); only `participants.max` may change.
- Updating drill `objective` / `progressionDescription` / `regressionDescription` text on the parent Drill, except where the existing text specifically presumes solo (`d38`'s objective mentions "off self-toss" — gets a small touch-up to read pair-neutral).

## Verification

Run from `app/`:

```bash
npx tsc --noEmit -p tsconfig.app.json
npx eslint src/data/drills.ts src/data/catalogValidation.ts
npx vitest run src/data/__tests__/catalogValidation.test.ts src/domain/__tests__/findSwapAlternatives.test.ts
npx vitest run
npm run build
```

From repo root:

```bash
bash scripts/validate-agent-docs.sh
```

## Status log

- 2026-04-27 — plan authored from founder pair-session observation (`/run/transition` Up Next for `d38`); scope confirmed wider + tuned.
- 2026-04-27 — **SHIPPED**. All 8 Pair variants authored (`d01-pair`, `d05-pair`, `d22-pair`, `d31-pair`, `d33-pair`, `d38-pair`, `d39-pair`, `d40-pair`); `d33-solo-net` split into `d33-solo` (variant ID preserved as `d33-solo-net` for migration safety) + new `d33-pair`; `participants.max = 1` tightened on `d22-solo`/`d33-solo`/`d38-solo`/`d39-solo`; `participants_label_mismatch` rule landed in `app/src/data/catalogValidation.ts` with positive + negative + non-Solo/Pair test cases; `d38` parent Drill `objective` softened from "off self-toss" to pair-neutral; small touch-up to `findSwapAlternatives.test.ts` legacy-block sort assertion (`d10` → `d05` after `d05-pair` shifted the post-`d03` rotation tip). One scope drift caught + corrected post-author: `d31-pair` and `d33-pair` initially shipped with `equipment.balls: 'many'` (semantically truthful for serving stacks but excluded by `hasUnmodeledRequirements` per pending `D102`); both downgraded to `balls: 1` so they actually surface in pair-mode swap pools the way `d33-solo-net` previously did. `d22-pair` and `d22-solo` keep `balls: 'many'` (race-to-10 framing genuinely needs many balls) and stay correctly excluded by the same gate. **Sub-discovery handled inline:** the new validation rule flagged `d25-solo`/`d26-solo`/`d28-solo` (warmup/cooldown drills with `participants.max = 14`) as Solo-label drift; relabeled their variant `label` `Solo` → `Any` while preserving the `-solo` variant IDs for ExecutionLog migration safety. Verification: `npx tsc --noEmit -p tsconfig.app.json` clean; `npx eslint .` clean; full app suite 101 files / 827 tests green; `bash scripts/validate-agent-docs.sh` passed. AGENTS.md posture line, `docs/catalog.json` posture, and `docs/milestones/m001-solo-session-loop.md` quick-scan bullet all updated in the same pass. `docs/research/founder-use-ledger.md` deliberately not appended (ledger-author owns).
