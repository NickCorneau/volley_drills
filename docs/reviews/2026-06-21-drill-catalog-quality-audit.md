---
id: review-2026-06-21-drill-catalog-quality-audit
title: "Drill catalog quality + tone audit (M002.2)"
status: active
stage: build
type: review
summary: "Catalog-wide read of all 47 drills for logical coherence, authoring quality, and tone/voice consistency; findings scored by rubric, with applied edits and routed-out (envelope) findings separated."
authority: working findings log for the 2026-06-21 drill-quality audit
last_updated: 2026-06-22
depends_on:
 - app/src/data/drills.ts
 - .cursor/rules/courtside-copy.mdc
---

# Drill catalog quality + tone audit (2026-06-21)

Plan: `docs/plans/2026-06-21-003-refactor-drill-catalog-quality-tone-audit-plan.md`

Audit performed read-only by four family reviewers, then consolidated here. Edits applied per family (U3–U7); envelope/assembly findings routed out (appendix).

## Rubric

- **A. Logic** — objective↔teachingPoints↔skillFocus agree; progression harder / regression easier; `successMetric.target`↔description↔`courtsideInstructions` agree; target achievable; cues reinforce the skill; solo/pair parity.
- **B. Authoring** — concrete over vague; one idea per cue; says what counts and when to stop; no filler/redundancy.
- **C. Tone** — one calm/shibui/encouraging/plain register; no outliers; consistent second-person; consistent repeated-concept vocabulary.
- **Guardrails** — all `drillCopyRegressions` invariants; copyGuard/D86 (no medical/therapeutic claims); no envelope/assembly field change; seeded assembly + diagnostics unchanged.

Severity: **P1** must-fix, **P2** should-fix, **P3** nit. Dimension: `logic` | `authoring` | `tone` | `envelope-routed`.

---

## Catalog-wide themes (drive the cross-drill sweep, U7)

1. **Two authoring generations.** Post-2026-05-10 sweeps use the canonical `You [role]; partner [role]` opener, bracket-repeat cycles, inline `2+` rubric, and short/deep POV. Legacy drills still use role-noun-led setup (`Feeder…`, `Receiver…`) that buries the skill verb and omit inline rubrics. The pass and serve families carry most of the legacy debt.
2. **`set window` gloss inconsistency.** Body copy usually glosses it; cues and `successMetric.description` fields often do not (d07, d10, d46, d50 in pass; d47, d48, d49, d58 in set use bare `target window`).
3. **Graded `2+` rubric not always inline.** Polished variants gloss it; d04, d12, d13, d16, d17 (and others) use bare `graded 2+`.
4. **POV vocabulary split.** Open serve variants use `short/deep`; net variants still use `front/back` (Rule 11 prefers short/deep).
5. **`coachingCues[0]` internal-focus cluster.** d22, d23, d39 lead with process/body-part cues instead of external outcomes (Rule 12b).
6. **Pair logistics (Rule 10) unevenness.** Many pair/open variants omit who-starts, miss-escape, or time-up fallback.
7. **Recovery segment labels miss Rule 7 cadence-format.** d25/d26 segments name the movement but not the cadence (`Continuous hold:` / `(each side)`).
8. **Register outliers / meta-prose.** d06 `Run D01…` (catalog-internal), d51/d25 author-facing honesty/disclaimer clauses in player copy, d21 `Tabletop passing`, d23 `Treat as a pressure rep`, d55-pair `Make the pass hard`.
9. **copyGuard/D86 hit.** d19 `progress to live serve` (the verb `progress` is on the guard list) → `move on to live serve`.

---

## Findings — Pass family (25)

Reviewer: [pass audit](35c908ef-c7a6-419a-91b5-5f066c738ed1). Clean: d05, d18-pair, d52-solo.

Key actionable (copy-only): d01-pair (target↔instr P1), d02-pair (skill-verb + role-tag + rubric P1), d03-pair (dual-stop ambiguity P2), d04 (setup-led + rubric P2), d06-solo (`Run D01` meta P1), d07-pair (partner-serves missing + set-window gloss P1), d08-trio (`bad pass` undefined P2), d09-pair (role-tag + lap/miss/end P1), d10-pair (set-window gloss + POV P2), d11 (target↔instr P1), d12/d13/d14/d16/d17 (setup-led + bare rubric P2), d19 (copyGuard `progress` P1), d21 (`Tabletop`/`Skyball` gloss P2), d24 (cue duplication + vague target P2), d46/d50 (set-window gloss in metric P2), d52-pair (target↔instr P1).

Envelope-routed: d09 progression (`forearm only` doesn't add difficulty); d20-group (pass is one beat in a multi-skill sequence — cannot foreground without restructure).

---

## Findings — Serve family (8)

Reviewer: [serve audit](908a6f61-2bac-484b-956c-4cd2fae8db11). copyGuard clean. Cleanest: d33-pair-open, d53-solo-open, d55-solo-open.

Key actionable (copy-only): d22 (objective/teachingPoints vague; cue0 internal-focus; target↔description scoring mismatch across all variants; pair-open who-starts P1–P2), d23 (target/description/instr sprint-vs-in mismatch; cue0 internal-focus P1), d31-pair (server cue says "call the target" but shagger calls — role inversion P1; "near" undefined P3), d33 (front/back→short/deep POV; "back zones"→"deep zones" P2), d51 (target `24/32` vs three 10-serve rounds = `21/30` P1; objective honesty-clause meta P2), d53-pair-open (who-starts P2), d54-pair-open (who-starts + numbered→named zones P1), d55-pair (live-serve scoring `poor pass` gloss P1).

Envelope-routed: d22 progression (jump-serve claim vs standing-serve envelope); d51 regression (fatigueCap change); d55 solo-vs-pair skill mismatch (pair is live-serve pass-pressure game, not called-target accuracy — flag for skillFocus/variant split).

---

## Findings — Set family (11)

Reviewer: [set audit](f9da9ab1-5ceb-44d1-98de-a0587b19ad19). copyGuard clean. Cleanest: d48-pair-open, d57-solo.

Key actionable (copy-only): d38-pair (target `15` vs `switch every 10` P2; miss/end fallback), d39 (cue0 `Contact above the forehead` internal-focus P1), d40-pair (catch "without a step"→"one step"; miss escape P2), d42-pair (miss escape; `Set`→`Hand-set` P2), d47 (target-window gloss; pair-open round/miss P2), d48 (objective "open-court cue"→"numbered cue" mismatch; cue0 gaze-timing P2), d49 (objective/description "out-of-system" jargon; pair-open miss/end P2), d56 (`Set`→`Hand-set` consistency P2/P3), d57-pair (miss rule P2), d58-solo (variant label `Solo open`→`Solo`; `Set`→`Bump-set or hand-set`; hyphenation P2), d58-pair (miss rule P2).

Envelope-routed: d41 progression (`add a lateral step` overlaps d56 — route to progression spine); d49 progression (fatigueCap/marker spacing).

---

## Findings — Warmup + recovery family (3)

Reviewer: [warmup/recovery audit](3366a74f-f6a3-495e-9293-5205d381105e). copyGuard clean, no em-dashes, all within word ceiling. Cleanest: d28 segment labels (cadence reference impl).

Key actionable (copy-only): d25 (objective disclaimer meta-prose → plain; missing hydration teaching point vs objective promise; `heart rate come down` clinical → plain; **all 5 segment labels miss `Continuous hold:` / `(each side)` cadence-format** P1-authoring), d26 (`second sides` stale — mirroring already in floor — P1; teachingPoints==coachingCues duplication; **all 3 segment labels miss cadence-format prefix** P1-authoring), d28 (teachingPoints + regressionDescription use unglossed `lateral shuffles`/`A-skips` P1–P2; s2/s4 shuffle vocabulary inconsistent; s2 missing time split).

Envelope-routed: d25/d26/d28 progression+regression items that change segment durations or count (e.g., "5+ minute wrap", "collapse block 4", "two moves only") — these need workload/segment envelope changes, not copy.

---

## Routed-out findings (envelope / assembly) — DISPOSITIONED 2026-06-22

The audit deferred these because a naive fix *looked* like it needed envelope/assembly changes. On a 2026-06-22 re-read, five were honest **wrong-axis / over-promise** description bugs whose minimal honest fix is a within-envelope reword (no workload, fatigueCap, equipment, skillFocus, chain, or ladder change); three were already honest on close read and need no code.

| Drill | Field | Original concern | Disposition (2026-06-22) |
| --- | --- | --- | --- |
| d09 | progressionDescription | "forearm only" does not add difficulty to a pass-and-shuffle drill | **Reworded** → "Shuffle faster or narrow the passing lane so every pass must be tighter." Real difficulty axis inside the existing 3–6 min / 1-ball / partner-toss envelope. |
| d22 | progressionDescription | "jump serve to spots" exceeds the standing-serve envelope | **Reworded standing-only** → "Shrink the scoring zones, or set a higher point goal, once you reliably reach 10." No jump-serve variant added; that stays a separate content decision. |
| d49 | progressionDescription | "shorten recovery time" fights the 30 s rest fatigueCap | **Reworded** → "Shrink the target window, or add a fourth feed location, once your set quality stays stable." Dropped the rest-cut clause; kept window + variety axes inside the envelope. |
| d51 | regressionDescription | "lengthen rest" implies a fatigueCap rest change | **Reworded** → "Expand the heart zone, or count any serve landing outside the heart as success." Dropped the rest clause; kept the two within-envelope easings. |
| d41 | progressionDescription | "add a lateral step between sets" poaches d56 "Set and Move" identity | **Re-aimed** → "Tighten the target so each set lands within your partner's reach, or push for a longer unbroken rally." Distinct precision/rally-length axis (matches the streak metric); d56 keeps move-along-a-line. Removed the spaced-hyphen-as-dash. |
| d20 | courtsideInstructions | pass is one beat in a multi-skill group sequence | **No change (honest for its kind).** Group continuity drill (`m001Candidate: false`, 4–8 players, `chain-5-group-addons`); foregrounding one skill would misrepresent a pass→set→attack sequence. Revisit only if `D101` 3+-player drills activate. |
| d55 | skillFocus (pair) | pair reads as a pass-pressure game, not called-target accuracy | **Reconciled in place (no split).** Both variants `skillFocus: ['serve']`: the server (trainee) still serves a *called* target; the live passer only pressures placement. In-code note added at `d55`. |
| d25/d26/d28 | progression/regression (subset) | "add 30–60 s", "two moves only", "collapse block", "second round" looked like segment-count/duration changes | **No change (within envelope).** Advisory text for the *allocated* wrap/warmup minutes; each "more" case fits under `durationMaxMinutes` (d25 4→5, d26 3→6, d28 3→5) and each "less" case is fewer reps in the same slot. Rendered segment list unchanged. |

Net: 5 within-envelope description rewords applied; 3 dispositioned as no-change. No workload, fatigueCap, equipment, participants, skillFocus, chain, or ladder field changed — assembly + diagnostics outputs unchanged.

---

## Applied-edits log (U3–U7)

| Unit | Drill(s) | Summary of edit |
| --- | --- | --- |
| U3 pass | d01, d02, d04, d06, d07, d09, d11, d14, d52 | Aligned target↔instruction mismatches; replaced d06 `Run D01` meta with runnable copy; skill-verb-first + role-tagged rewrites; lap/miss/end + who-starts logistics. |
| U3 pass | d02, d04, d08, d12, d13, d16, d17, d24 | Inlined the graded-`2+` operational rubric; defined `bad pass`. |
| U3 pass | d07, d10, d46, d50 | Glossed `set window` in cues / metric descriptions. |
| U3 pass | d19 | copyGuard/D86: `progress to live serve` → `move on to live serve`. |
| U3 pass | d21 | `Tabletop passing` → plain; `Skyball` glossed. |
| U4 serve | d22, d23 | Aligned scoring target↔description↔instruction; external-focus `coachingCues[0]` (replaced "Develop a serving routine"). |
| U4 serve | d31 | Fixed server/shagger role inversion in cue; operationalized "near" → "in or brushing"; who-starts. |
| U4 serve | d33, d54 | Converted zone enumerations front/back → short/deep (rule 11); named d54 zones. |
| U4 serve | d51 | Reconciled `24/32` → `21/30` over three 10-serve rounds; removed objective honesty-clause meta. |
| U4 serve | d53, d54, d55 | Who-starts + miss handling; glossed "poor pass" via set-window. |
| U5 set | d38, d40, d42, d47, d49, d57, d58 | Added rule 10 miss-escape / end fallbacks; aligned d38 switch cadence to target. |
| U5 set | d39, d48 | External-focus / gaze-timing `coachingCues[0]` (replaced "Contact above the forehead"); objective↔cue alignment. |
| U5 set | d42, d47, d48, d49, d56, d58 | Hand-set/bump-set precision + hyphenation; glossed `target window`; fixed d58-solo label. |
| U6 warmup/recovery | d25, d26 | De-clinicalized objective/cues (plain "thirsty"/"hurts"/"breathing steady"); fixed stale d26 `second sides`; rule 7 cadence-format prefixes on all segment labels. |
| U6 warmup/recovery | d28 | Glossed `lateral shuffles` / `A-skips` in teachingPoints + regression; standardized shuffle vocabulary; clearer loop label. |
| U7 cross-drill | d05, d50 | Removed author-facing `Honesty clause:` meta from player objectives (moved to code comments). |
| U7 cross-drill | d47, d58 (objectives), d05 | Hyphenated `bump-set`/`hand-set`; minor article fixes. |

Test updates (intentional, canon-backed): `drillCopyRegressions` d33-pair enumeration front/back → short/deep and d26 segment labels gained the rule 7 cadence prefix; `drillMetadata` d31 "in or near" → "in or brushing". All other tests unchanged; full suite green; generated-plan diagnostics unchanged (copy-only proof).
