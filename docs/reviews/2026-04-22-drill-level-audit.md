---
id: drill-level-audit-2026-04-22
title: "Drill level-metadata audit (2026-04-22)"
type: review
status: complete
stage: validation
authority: "One-time cross-reference audit of every current drill's `levelMin` / `levelMax` against FIVB + BAB source material. Purpose: determine whether the shipped level data is trustworthy enough to safely wire into any future level-aware assembly or progression gating. Does NOT author any fix commits; surfaces findings so each fix is a separate, legible decision."
summary: "26 drills audited against `docs/research/fivb-source-material.md` Chapter 2/3/4 inventory + BAB rung positions. Two real level-tag mismatches (minor, on `d07` upper bound and `d22` lower bound). Structural finding: the library is heavily skewed toward beginner / beginner-intermediate coverage; the advanced band on skill slots is effectively empty (zero drills tagged into `advanced` on `pass` / `serve` / `set` focuses). 10 of 26 drills (38%) are single-band. Any future level-aware filter must reckon with the distribution skew; no amount of filter cleverness fixes a library that doesn't have the content."
last_updated: 2026-04-22
depends_on:
  - docs/research/fivb-source-material.md
  - docs/research/bab-source-material.md
  - app/src/types/drill.ts
  - app/src/data/drills.ts
  - app/src/lib/skillLevel.ts
related:
  - docs/plans/2026-04-22-tier1b-serving-setting-expansion.md
  - docs/plans/2026-04-20-m001-tier1-implementation.md
decision_refs:
  - D4
  - D76
  - D121
---

# Drill level-metadata audit (2026-04-22)

## Why this audit exists

The `Drill` type at `app/src/types/drill.ts` lines 28, 139–140 declares every drill carries `levelMin: PlayerLevel` and `levelMax: PlayerLevel` (enum: `beginner | intermediate | advanced`). Every shipped drill has these fields populated. The onboarding `SkillLevel` taxonomy (`app/src/lib/skillLevel.ts`) persists a user band, and the `skillLevelToDrillBand()` shim maps the five-band onboarding enum onto the three-band drill enum. None of this data is currently read by `sessionBuilder.ts` — `levelMin` / `levelMax` do not influence candidate filtering, Swap-pool composition, or progression-link follow.

Any decision to wire level into assembly or progression (a "Layer B" scope expansion previously proposed and rejected in the 2026-04-22 red-team pass on the Tier 1b+ plan) needs to first answer: *is the shipped level data trustworthy enough to filter against?* This audit answers that question and only that question. It does not propose wiring. It does not author fix commits. It produces a diff-list so each subsequent decision is a legible standalone choice.

## Method

1. Read every drill's `id`, `name`, `skillFocus`, `chainId`, `levelMin`, `levelMax` from `app/src/data/drills.ts` as of commit `1ff4436`.
2. Cross-reference each passing / serving / setting drill against `docs/research/fivb-source-material.md` Chapter 2 / 3 / 4 inventory (FIVB 2.1–2.7 for serving, 3.1–3.16 for passing, 4.1–4.9 for setting) where a direct or near-direct analog exists.
3. Cross-reference BAB-sourced drills against the rung positions documented in `docs/research/bab-source-material.md`.
4. Flag discrepancies between our shipped tag and the source tag.
5. Catalog structural facts about the distribution (skew, narrow-band count, empty bands on skill slots).

Chain-warmup (`d28`) and chain-cooldown (`d25`, `d26`) are audited but expected to span all levels; the `beginner`→`advanced` tag on those is correct by design.

## Inventory and cross-reference (26 drills)

Columns: `ID`, `Name`, `Chain`, `Skill focus`, our `levelMin → levelMax`, source tag (FIVB / BAB / other), status.

### Chain 1 — Platform (4 drills)

| ID | Name | Skill focus | Our tag | Source tag | Status |
|---|---|---|---|---|---|
| `d01` | Pass & Slap Hands | `pass` | `beginner → intermediate` | FIVB 3.3 `beginner` | Upper bound generous; defensible (fluid progression into intermediate) |
| `d02` | Towel Posture Passing | `pass` | `beginner → intermediate` | BAB Lesson 1 platform work | Reasonable |
| `d03` | Continuous Passing | `pass` | `beginner → intermediate` | BAB Lesson 1 + FIVB 3.2 One on One (`beginner`) | Reasonable |
| `d04` | Catch Your Own Pass | `pass` | `beginner → beginner` | BAB Lesson 1 solo drill | Correct (narrow band) |

### Chain 2 — Direction (5 drills, including `d24` which lives here not in chain-6)

| ID | Name | Skill focus | Our tag | Source tag | Status |
|---|---|---|---|---|---|
| `d05` | Self-Toss Pass to Set Window | `pass` | `beginner → intermediate` | BAB directional control | Reasonable |
| `d06` | Pass & Slap Hands with Target | `pass` | `beginner → intermediate` | BAB derivative of `d01` | Reasonable |
| `d07` | Pass & Look | `pass` | `intermediate → intermediate` | FIVB 3.15 Pass and Look `intermediate / advanced` | **Mismatch (minor):** our upper bound excludes advanced |
| `d08` | Plus Three / Minus Three | `pass` | `beginner → intermediate` | BAB pressure-passing scoring game | Reasonable |
| `d24` | Pass into a Corner | `pass` | `beginner → intermediate` | BAB wall-rebound passing variant | Reasonable |

### Chain 3 — Movement (6 drills)

| ID | Name | Skill focus | Our tag | Source tag | Status |
|---|---|---|---|---|---|
| `d09` | Passing Around the Lines | `pass`, `movement` | `beginner → beginner` | FIVB 3.1 Pass Around the Lines `beginner` | Correct (narrow band, matches FIVB) |
| `d10` | The 6-Legged Monster | `pass`, `movement` | `beginner → intermediate` | BAB 6-direction platform-angling drill | Reasonable |
| `d11` | One-Arm Passing Drill | `pass` | `intermediate → intermediate` | FIVB 3.12 One Arm Passing `intermediate` | Correct (narrow band, matches FIVB) |
| `d12` | U Passing Drill | `pass`, `movement` | `beginner → intermediate` | FIVB 3.6 The U Passing Drill `beginner / intermediate` | Correct (matches FIVB exactly) |
| `d13` | W Passing Drill | `pass`, `movement` | `intermediate → intermediate` | FIVB 3.8 W Passing Drill `intermediate` | Correct (narrow band, matches FIVB) |
| `d14` | Pass & Switch | `pass`, `movement` | `intermediate → intermediate` | FIVB 3.14 Pass and Switch `intermediate` | Correct (narrow band, matches FIVB) |

### Chain 4 — Serve-receive (4 drills)

| ID | Name | Skill focus | Our tag | Source tag | Status |
|---|---|---|---|---|---|
| `d15` | Short/Deep Serve-Receive Reaction | `pass`, `movement` | `intermediate → intermediate` | FIVB 3.13 Short / Deep `intermediate` | Correct |
| `d16` | Diamond Passing | `pass`, `movement` | `beginner → intermediate` | FIVB 3.5 Diamond Passing `beginner` | Upper bound generous; defensible (harder feeds push it intermediate) |
| `d17` | Non-Passer Move / Beat Ball to Pole | `pass`, `movement` | `beginner → beginner` | FIVB 3.4 Non Passer Move `beginner` | Correct (narrow band, matches FIVB) |
| `d18` | Serve & Pass Ladder | `pass`, `serve` | `beginner → intermediate` | BAB pressure scoring (S&P ladder) | Reasonable |

### Chain 5 — Group add-ons (3 drills)

| ID | Name | Skill focus | Our tag | Source tag | Status |
|---|---|---|---|---|---|
| `d19` | Butterfly Toss-Pass-Catch | `pass` | `beginner → beginner` | BAB + FIVB butterfly warm-up family | Correct (narrow band) |
| `d20` | 3 Serve Pass to Attack | `pass`, `set` | `intermediate → intermediate` | BAB 3-ball continuity drill | Reasonable |
| `d21` | 500 | `pass`, `set` | `beginner → intermediate` | BAB self-scoring engagement game | Reasonable |

### Chain 6 — Serving (2 drills)

| ID | Name | Skill focus | Our tag | Source tag | Status |
|---|---|---|---|---|---|
| `d22` | First to 10 Serving | `serve` | `beginner → intermediate` | FIVB 2.6 First to 10 Serving Drill `intermediate / advanced` | **Mismatch (minor-moderate):** FIVB treats the scoring game as int/adv; our lower bound includes beginner. Cross-source tension (BAB places simpler zone-serving drills at beginner, FIVB explicitly tags 2.6 higher). No strong prior. |
| `d23` | Serve & Dash | `serve`, `conditioning` | `beginner → intermediate` | FIVB 2.1 Serve and Get Into Position `beginner` | Upper bound generous but reasonable |

### Chain 7 — Setting (3 drills, Tier 1a Unit 2)

| ID | Name | Skill focus | Our tag | Source tag | Status |
|---|---|---|---|---|---|
| `d38` | Bump Set Fundamentals | `set` | `beginner → intermediate` | BAB Beginner's Guide Lesson 2 Bump Set tutorial | Correct (fundamentals) |
| `d39` | Hand Set Fundamentals | `set` | `beginner → intermediate` | BAB Beginner's Guide Lesson 2 Hand Set tutorial | Correct (fundamentals) |
| `d41` | Partner Set Back-and-Forth | `set` | `beginner → intermediate` | BAB 2024 Drill Book Plan 1 Drill 1 warm-up element | Correct |

### Chain warmup (1 drill)

| ID | Name | Skill focus | Our tag | Source tag | Status |
|---|---|---|---|---|---|
| `d28` | Beach Prep Three | `warmup` | `beginner → advanced` | D105 + BAB | Correct (generic warmup spans all levels) |

### Chain cooldown (2 drills)

| ID | Name | Skill focus | Our tag | Source tag | Status |
|---|---|---|---|---|---|
| `d25` | Downshift | `recovery` | `beginner → advanced` | D105 transition protocol | Correct (spans all levels) |
| `d26` | Lower-body Stretch Micro-sequence | `recovery` | `beginner → advanced` | Generic post-session staples | Correct (spans all levels) |

## Discrepancy list

Two real mismatches. Neither is dangerous. Neither requires an immediate fix. Both should be decided explicitly before any level-aware filter lands.

1. **`d07` Pass & Look upper bound.** FIVB 3.15 tags `intermediate / advanced`; we tag `intermediate → intermediate`. Consequence: under Layer B filtering, an `advanced`-band user would not see `d07` as a candidate. Fix would be one-line: `levelMax: 'advanced'`. Worth doing if/when Layer B lands; no urgency otherwise. Flagging as `drill-d07-upper-bound-2026-04-22`.
2. **`d22` First to 10 Serving lower bound.** FIVB 2.6 tags `intermediate / advanced`; we tag `beginner → intermediate`. Consequence under Layer B: a `beginner`-band user would see `d22` as a candidate, which FIVB considers level-inappropriate. BAB treats it more accessibly. The cross-source disagreement means "correcting" our tag to match FIVB is not unambiguously right — we might be correctly leaning toward BAB's accessibility framing, or we might be optimistic. Resolution needs a content decision, not a data-correction commit. Flagging as `drill-d22-lower-bound-2026-04-22`.

## Structural findings

These are more important than the two mismatches.

### The advanced skill-band is empty

Across the 26 current drills, **zero** drills tagged on `pass` / `serve` / `set` skill focuses reach into the `advanced` band. The three `advanced`-reaching drills (`d25`, `d26`, `d28`) are all `recovery` or `warmup` focus — they span all levels by design because warmup and cooldown aren't level-gated.

For main_skill, pressure, and technique slots on a `competitive_pair` user (maps to `advanced` via `skillLevelToDrillBand`), a naive `drill.levelMax >= 'advanced'` filter would reject **every single passing, serving, and setting drill** in the library. Empty-pool fallback would kick in constantly and effectively disable the filter for that band.

**Implication:** Layer B cannot ship honestly for `competitive_pair` users until either (a) the library gains advanced-reaching skill drills, or (b) the `skillLevelToDrillBand` mapping is revised so `competitive_pair` maps to `intermediate`, or (c) the filter logic explicitly treats "no drills match your band" as a content gap rather than a filter behavior.

Option (a) is the right long-term answer and is partially addressed by Tier 1b's `d36 Jump Float Introduction` (which will ship as `intermediate → advanced`). Even post-Tier-1b the advanced-band population will be sparse.

### 38% of drills are single-band

10 of 26 drills (`d04`, `d07`, `d09`, `d11`, `d13`, `d14`, `d15`, `d17`, `d19`, `d20`) have `levelMin === levelMax`. A strict level filter excludes single-band drills for every band other than the exact match. That is intentional (they're level-specific), but it amplifies the pool-depth problem: a `beginner` user's `pass` slot pool under strict filtering is 7–8 drills; a `foundations` mapped-to-`beginner` Swap for `main_skill` would see a smaller candidate set than current behavior, which is already barely deep enough on narrow archetypes.

### The shim is lossy by design

`skillLevelToDrillBand` (`app/src/lib/skillLevel.ts` lines 93–110) collapses five onboarding bands into three drill bands: both `rally_builders` and `side_out_builders` map to `intermediate`. Under Layer B, these two bands would produce identical candidate pools on every slot. A careful user could reasonably ask why the distinction matters at onboarding if the app treats them identically at runtime. The shim's file comment (line 87) acknowledges this as an intentional information-loss boundary and suggests extending drill metadata (e.g., `skillBandRecommendation`) if finer resolution is needed in the future. Not a data-correction issue; a design-level question for any future Layer B decision.

### Beginner / beginner-intermediate is where the content lives

Level-reaching coverage counts (skill slots only, excluding warmup / cooldown):

- `beginner → beginner`: 4 (`d04`, `d09`, `d17`, `d19`)
- `beginner → intermediate`: 10 (`d01`, `d02`, `d03`, `d05`, `d06`, `d08`, `d10`, `d12`, `d16`, `d18`, `d21`, `d22`, `d23`, `d24`, `d38`, `d39`, `d41`) — note: reading carefully, this is actually 17 drills spanning beg→int
- `intermediate → intermediate`: 7 (`d07`, `d11`, `d13`, `d14`, `d15`, `d20`)
- `intermediate → advanced` or higher on skill slots: 0

Tier 1b Layer A currently adds (2026-04-27 correction):
- `d31 Self Toss Target Practice` → `beginner → beginner`
- `d33 Around the World Serving` → `beginner → intermediate`
- `d40 Footwork for Setting` → `beginner → intermediate`
- `d42 Corner to Corner Setting` → `intermediate → intermediate`

Deferred from current Layer A:
- `d36 Jump Float Introduction` → likely `intermediate → advanced`, but held for `O7` sports-medicine / PT review before authoring.
- `d43 Triangle Setting` → likely `intermediate → advanced`, but held for `D101` 3+ player support because the BAB source geometry is 3-player.

Post-current-Layer-A the advanced-band population on skill slots remains 0 because both advanced-band candidates are deferred. That reinforces this audit's original conclusion: Layer B filtering still should not ship without both behavioral evidence and enough authored content to make `competitive_pair` filtering meaningful.

## Conclusions

1. **Data is mostly clean.** No drill is catastrophically mistagged against its source material. Two minor mismatches (`d07` upper, `d22` lower) are worth noting for later but don't block any downstream work.
2. **The structural skew is the real finding.** Layer B filtering is unsafe to ship for `competitive_pair` users regardless of filter logic cleverness, because the content simply isn't there. The current Tier 1b Layer A slice does not address advanced-band coverage because `d36` and `d43` are both intentionally deferred.
3. **This audit does not produce any fix commits.** The two mismatches are flagged (`drill-d07-upper-bound-2026-04-22`, `drill-d22-lower-bound-2026-04-22`) for later resolution; the structural findings are decision inputs for any future Layer B or `PlayerLevel`-widening conversation. Shipping tag fixes today without a decision about what the tags *will be used for* is premature.
4. **Tier 1b can proceed as planned** with level metadata captured correctly on new drills (Layer A only). The audit provides no evidence against Tier 1b and no evidence for Layer B beyond what was already on the table.

## For agents

- **Authoritative for**: a snapshot diff of current drill level metadata against FIVB + BAB sources as of 2026-04-22.
- **Edit when**: a re-audit is performed (new audit file, don't mutate this one); a source update changes a FIVB or BAB reference this audit leaned on.
- **Belongs elsewhere**: level-data corrections (separate commits per tag change, each with a decision reference); structural decisions about `PlayerLevel` taxonomy (`docs/decisions.md`); Layer B filter design (future plan doc under `docs/plans/` when gated).
- **Outranked by**: `docs/decisions.md` and `docs/milestones/m001-solo-session-loop.md` for any question about whether level filtering should ship.
- **Key pattern**: data-integrity audit that produces findings, not fixes. Fixes become their own decisions.
