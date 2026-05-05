---
id: fivb-coaches-manual-crosscheck
title: FIVB Level I And Level II Coaches Manual Crosscheck (Indoor Manuals)
status: active
stage: validation
type: research
authority: "product-useful extractions from the indoor-biased FIVB Level I (2013) and Level II (2016) coaches manuals, and explicit ruled-out sections; informs drill-prescription UI, cue-density rules, motor-learning framing, and corroborates existing load and safety posture"
summary: "Mined takeaways from the indoor FIVB Level I and Level II manuals: Fitts & Posner motor-learning stages, cue-density and feedback rules, whole-vs-part practice bias, Yakovlev supercompensation windows, drill measurement modes, injury-distribution data, and the LTAD vocabulary. Most team/tactics/rotation content is ruled out for the solo-first beach product."
last_updated: 2026-04-20
depends_on:
  - docs/research/README.md
  - docs/research/beach-training-resources.md
  - docs/research/binary-scoring-progression.md
  - docs/research/warmup-cooldown-minimum-protocols.md
  - docs/research/srpe-load-adaptation-rules.md
  - docs/research/regulatory-boundary-pain-gated-training-apps.md
  - docs/research/periodization-post-framework.md
  - docs/research/prescriptive-default-bounded-flex.md
related:
  - docs/research/sources/reference-only/README.md
  - docs/research/sources/reference-only/FIVB-Level-1-Coaches-Manual-2013.pdf
  - docs/research/sources/reference-only/2016_FIVB_DEV_Coaches_Manual_Level_II.pdf
  - docs/research/practice-plan-authoring-synthesis.md
---

# FIVB Level I And Level II Coaches Manual Crosscheck (Indoor Manuals)

## Agent Quick Scan

- Use this note when touching **drill cue-card copy**, **feedback density**, **motor-learning framing**, or when someone asks whether these indoor manuals contain anything the project does not already cover.
- Both manuals are **indoor-biased** (6v6 team formations, rotations, libero role, match management, team psychology). Most chapters are ruled out for a solo-first beach product. The useful material concentrates in **Level I Ch VII** (Practice and Drills Design, Bill Neville / Carl McGown), **Level I Ch XII** (Medical Aspects, Reeser and Bahr), and **Level II Ch I-III** (Theory of Training, Physical Training, Player Development Model).
- Net new ideas for the product are narrow but concrete: a **Fitts & Posner stage field** on drills, **cue-density rule** for cue cards, **feedback-cadence rule** for between-set prompts, **whole-practice bias** (explicit argument against part-practice), and **drill measurement modes** beyond binary Good/Not-Good.
- Corroborates but does **not** materially sharpen: warm-up dosing, overload/progression/specificity principles, jump-volume as modifiable risk, LTAD stage naming, "play-through" overuse pattern that justifies the pain gate.
- Not this note for broad product/training context (`docs/research/beach-training-resources.md`), the binary-score gate math (`docs/research/binary-scoring-progression.md`), the load engine (`docs/research/srpe-load-adaptation-rules.md`), warm-up dosing (`docs/research/warmup-cooldown-minimum-protocols.md`), or pain/safety copy (`docs/research/regulatory-boundary-pain-gated-training-apps.md`).
- Not this note for the cross-source plan-builder synthesis that pulls the cue-density / feedback-cadence / whole-practice-bias / measurement-mode rules into a Volleycraft plan-building thesis — use `docs/research/practice-plan-authoring-synthesis.md`.
- PDFs live in `docs/research/sources/reference-only/` — they are **not** primary sources for any existing claim. Do not promote them to `docs/research/sources/` without first rewriting a specific claim to depend on one of them.

## Bottom Line

Neither manual displaces any existing source or decision. They add three genuinely useful ideas and one vocabulary import:

1. **Motor-learning stage as a drill/skill attribute** (Fitts & Posner: Cognitive → Associative → Autonomous). This gives the product a defensible axis for varying cue density, expected consistency of self-scoring, and which drill families are appropriate — separate from the load-based `progress/hold/deload` axis.
2. **Cue density rule for cue cards.** Beginners (Cognitive stage) get **one** key cue at a time. Intermediate and advanced athletes (Associative / Autonomous) can hold two or three. This is directly actionable for drill copy and v0b-era cue UI.
3. **Feedback cadence rule** for the review screen and any future in-run prompts: specific, not overloading, **let the athlete take 2-3 trials before giving more feedback**. Mix positive/motivating feedback in high-intensity drills; reserve specific corrective feedback for lower-intensity technical work.
4. **Drill measurement vocabulary** (Timed / Successful reps / Successful reps in a row / Timed block with required reps / Reps with minuses for unforced errors / Athlete termination). We ship with one of these (successful-reps-in-a-window). The others are viable future modes, already named by a federation source, and compatible with the binary-scoring note's corrected-posterior framing.

Everything else either corroborates existing canon or is indoor-only and explicitly ruled out below.

Confidence: **high** that the four items above are safe to import as vocabulary and UI conventions; **medium** that `motor_stage` should be a persisted attribute on drills vs. implied by archetype/difficulty; **low** that any of this changes a shipping decision in M001.

## Use This Note When

- Drafting or reviewing **cue-card copy** on any drill, especially when deciding how many cues to show at once.
- Drafting or reviewing **between-set or end-of-block feedback prompts** (how often the app surfaces a cue correction; when to stay quiet and let the athlete keep reps going).
- Writing or reviewing the **drill schema** — deciding whether to carry a `motor_stage` or `cue_density` field, or whether to expose alternative measurement modes beyond binary Good/Not-Good.
- Justifying the **whole-practice bias** when someone proposes breaking a drill into part-practice steps.
- Answering the question "do the FIVB coach manuals contain anything we do not already cover?" without re-reading ~295 pages of indoor content.
- Defending the product's inter-session spacing advice or explaining the "why" behind Hold-default after an intense session.

## Not For

- Replacing `docs/research/beach-training-resources.md` for broad training/product context.
- Replacing `docs/research/binary-scoring-progression.md` for the progression-gate math.
- Replacing `docs/research/srpe-load-adaptation-rules.md` for load bands; the Yakovlev windows here are pedagogical context, not thresholds.
- Replacing `docs/research/warmup-cooldown-minimum-protocols.md` for warm-up/cool-down dosing; Bill Neville's 10-15 min window corroborates but does not override the Beach Prep Two/Three/Five framing.
- Replacing `docs/research/regulatory-boundary-pain-gated-training-apps.md` for any user-visible pain, recovery, or injury-prevention copy. Medical-chapter content must not leak into user-facing strings.
- Indoor tactics, rotations, libero rules, team formations (3-3 / 4-2 / 6-2 / 5-1), coach-as-match-manager, or team psychology — all ruled out for the solo-first beach product.

## Source Markers

Page references cite the PDFs in `docs/research/sources/reference-only/`. Both PDFs use their own internal page numbering; quoted passages use that numbering. The Level I manual is 172 pages; the Level II manual is 123 pages.

## Product-useful findings

### Finding 1 — Motor-learning stage as a drill attribute (Level II Ch III.2)

Fitts & Posner (1967) describe three stages of motor learning, reproduced in Level II Ch III pp. 31-32:

| Stage | Process | Characteristics |
|---|---|---|
| Cognitive (verbal-motor) | Gathering information | Large gains, **inconsistent performance** |
| Associative (motor) | Putting actions together | Small gains, disjointed performance, conscious effort |
| Autonomous (automatic) | Much time and practice | Performance "seems unconscious, automatic and smooth" |

Two product implications:

- The **inconsistency in the cognitive stage** is a principled reason the binary-scoring gate needs bigger N or hysteresis early on. This does not change the `docs/research/binary-scoring-progression.md` math; it adds a "why" for why novice users will see more Hold verdicts than intermediate users at the same true skill delta.
- **Cue and feedback design differs by stage** (see Findings 2 and 3). Without a stage signal on drills (or on the user's relationship to a drill), the product has to over-cue everyone or under-cue everyone.

How to apply without over-building: most M001 drills are beginner-to-intermediate, so the defensible default is to treat **all M001 drills as cognitive-to-associative** and ship **single-cue** cards. Do not add a `motor_stage` persisted field to the drill schema yet — defer until a Phase 1.5 or later version actually varies cue density at runtime. The note is the cheap cost here; schema is not.

### Finding 2 — Cue density rule for cue cards (Level II Ch III.3)

Verbatim (Level II p. 32):

> "Key phrases should be given to the learner one at a time. With beginners, the best method is to give the new key phrase after they have success in the previous one. For intermediate and advanced players more than one key can be given at the same time."

Product implication: the cue card for a drill should default to **one key cue**, not a list of three. If a drill has multiple teaching points, show one at a time and advance only after the athlete reports success on the previous one. For drills targeted at intermediate users, up to **two or three** cues is defensible.

This is compatible with the current starter-loop UI and does not require schema changes. It is a copy and content-authoring rule that should live next to the drill-authoring guidance. The cheapest landing spot is an editorial note on the drill data file and a mention in whichever doc owns "how we write drills" — not a new spec.

### Finding 3 — Feedback cadence rule (Level II Ch III.8)

Verbatim (Level II p. 35):

> "A feedback should be specific, reinforcing sometimes positive, sometimes negative results. In high intensity drills it is better to give positive or motivating, general feedback. The coach should not overload the player with information. He should let the player work on one or two things and give the player two or three practice trials to try before giving more feedback."

Product implications:

- For **high-intensity drills**, the review/between-set surface should lean **positive and motivating**, not corrective. Reserve specific corrective feedback for lower-intensity technical work.
- The app should not prompt a correction every rep. **Two or three reps between prompts** is the defensible minimum cadence.
- Intrinsic vs. extrinsic feedback is called out in the manual (visual, auditory, proprioceptive, "error detection" vs. coach-augmented). A solo-first product is overwhelmingly an intrinsic-feedback environment. Product language that *amplifies* intrinsic feedback (e.g., "notice where your platform ended up," "feel where your weight was on contact") is on solid federation-level ground; product language that *invents* extrinsic corrective feedback the app cannot actually observe is not.

None of this rewrites `docs/research/prescriptive-default-bounded-flex.md`'s six feedback patterns, but it adds a **cadence ceiling** worth noting when any in-run corrective prompt is proposed.

### Finding 4 — Whole-practice bias and the four exceptions (Level II Ch III.4; Level I Ch VII)

Level II Ch III p. 33:

> "Traditional skill progressions are violations of motor learning principles."

Exceptions named in the same passage:

1. When there is fear involved.
2. When there is danger involved.
3. To control frustration levels.
4. If the skill is too complicated.

Level I Ch VII p. 121 reinforces this from Carl McGown's research:

> "RESEARCH HAS SHOWN THAT THE MOST EFFICIENT WAY TO TRAIN A SKILL IS TO PRACTICE IT AS SPECIFICALLY AS POSSIBLE IN THE EXACT ACTIVITY IN WHICH IT WILL BE USED… Part-whole methods of teaching progressions are not efficient."

Product implication: when proposing new drills or variations, the default should be **whole-skill practice in a game-like context**, not broken-up part-practice. This squares with the project's existing orientation, but gives a clean federation-level quote to cite when someone proposes adding "platform-only without a ball" or "isolated arm-swing" part-practice steps. The four exceptions are the audit test: does the whole-skill form involve fear, danger, frustration, or a skill too complex for the user's current stage? If yes, a part-practice step is defensible; otherwise, keep it whole.

### Finding 5 — Drill measurement mode vocabulary (Level I Ch VII)

Level I p. 123 lists **six drill measurement modes**:

- Timed
- Successful reps goal
- Successful reps in a row
- Timed block with required successful reps
- Successful reps goal with minuses for unforced errors
- Athlete termination ("I'm done")

M001 ships one of these (successful-reps-in-a-window, roughly "Successful reps goal"). The other five are viable **future** modes. Two pragmatic notes:

- **"Successful reps in a row"** is meaningfully different from the current window-based approach. It produces a stopping criterion that rewards consistency (and punishes one miss), which is friendlier as a **technique stage** mode than as a progression gate. Not a good fit for the binary-scoring gate (defeats the posterior math in `docs/research/binary-scoring-progression.md` because sample size is not bounded), but a reasonable fit for self-directed pressure drills.
- **"Athlete termination"** is the honest name for what the app should allow whenever the user says "I'm done" — it should not be treated as a failure. Our existing copy should make clear that stopping early is a valid outcome, not a skipped drill.

These are vocabulary additions, not schema changes. Document them where drill authoring is discussed; defer implementation until a future phase needs them.

### Finding 6 — Four drill design types (Level I Ch VII)

Level I p. 122 lists four drill types by purpose:

1. **Teaching** — slow tempo, mechanics-related, closely scrutinized, specific movement pattern required.
2. **Rapid Fire** — fast tempo, many contacts in short time, closely supervised.
3. **Frenzy or Crisis** — very fast tempo, intestinal fortitude + skills under stress, N successful reps in total or in a row terminates the drill.
4. **Flow of Play** — team drills / singles-to-triads, blending two or more skills, fast-to-slow tempo.

Useful for our drill taxonomy as a **federation-recognized tag**, but not load-bearing. Most M001 drills are Teaching or Rapid Fire; Flow-of-Play is out of scope until 2+-person sessions exist. This maps roughly onto the existing block types (`warmup`, `technique`, `main_skill`, `pressure`, `wrap`) without 1:1 alignment. No rename implied.

### Finding 7 — Inter-session spacing context: Yakovlev windows (Level II Ch I.9.1.1-9.1.2)

The Yakovlev model (Level II p. 13) describes recovery/restoration and overcompensation at **3h / 6h / 24h / 36h / 48h** post-stimulus, with the next external load ideally landing during overcompensation. This is pedagogical context, not an operational threshold. It does not override `docs/research/srpe-load-adaptation-rules.md`'s post-ACWR stance that **individual baselines** matter more than universal windows.

One small usable consequence: the engine's Hold default after an intense session is consistent with "fatigue-then-overcompensation." The `D86`-compliant user-facing story is still "lighter today," not "your next overcompensation window is at 36 hours" — the Yakovlev model is behind the curtain, not on screen.

### Finding 8 — Physical fatigue blocks motor learning (Level II Ch III.7)

Level II p. 34:

> "Only the continuously fatiguing tasks inhibit performance and learning… it is not conclusive that distributed practising is better than massed practising or vice versa; a coach should prove as many practice trials as possible under specific game-like conditions to maximize transfer to the game without producing heavy and maintained fatigue to maximize learning."

Product implication: the adaptation engine's Hold-default after a heavy session is well-supported at the **learning-efficacy** level, not only the load-management level. This is another "why" sentence for the review screen when the engine says Hold after a hard session. Does not change thresholds; does add framing.

### Finding 9 — Drill nicknaming as an ergonomic convention (Level I Ch VII)

Level I p. 123:

> "Each drill should have a nickname so explanation should be kept to a minimum."

Already consistent with the project's drill-ID + short-name pattern. Worth preserving as an authoring rule — if we ever have a drill whose name is not memorable, it is a sign the drill is over-specified or under-identified.

### Finding 10 — Injury distribution data (Level I Ch XII; Level II Ch II.1.4)

Level I Ch XII and Level II Ch II converge on an injury distribution useful for **backgrounder writing**, not product copy (`D86` forbids injury-risk scoring and most safety framing must route through `docs/research/regulatory-boundary-pain-gated-training-apps.md`). For internal context only:

- **Ankle sprains**: #1 volleyball injury, ~50% of acute injuries in the cited prospective studies. Previous ankle sprain is the strongest risk factor for the next one. Return to play should be guided by **functional recovery**, not absence of pain.
- **Patellar tendinopathy (jumper's knee)**: second most common diagnosis, **less common in beach** because of sand surface. Primary modifiable risk factor is **jump volume**.
- **Shoulder overuse**: third most commonly injured site. Primary modifiable risk factor is **spiking/serving volume**.
- **Low back pain**: common, usually mechanical, usually self-limiting in adults; persistent pain in athletes ≤ 20 is a flag for spondylolysis.

Three product hooks from this, all defensive:

- The **"previous ankle sprain" concept** could become a silent adjustment on the safety-check screen in a future phase, but it must not become injury triage. Defer unless onboarding research (`docs/research/onboarding-safety-gate-friction.md`) opens a slot for it.
- The **functional-recovery-not-pain-absence** framing is compatible with our pain-gate language but must not be rephrased as medical advice. Do not add this to user-facing copy without routing through the regulatory note.
- The **jump-volume / spike-volume as modifiable risk** corroborates the load engine's conservatism; it does not change any band in `docs/research/srpe-load-adaptation-rules.md`.

## Corroborates (no change needed)

| Claim found in manuals | Existing home |
|---|---|
| Warm-up 10-15 min; specificity matters; part-whole methods inefficient | `docs/research/warmup-cooldown-minimum-protocols.md`, `docs/research/beach-training-resources.md` |
| Overload / progression / specificity principles | `docs/specs/m001-adaptation-rules.md`, `docs/research/srpe-load-adaptation-rules.md` |
| Jump-volume and spike-volume as modifiable risk factors | `docs/research/srpe-load-adaptation-rules.md` |
| "Play through" overuse pattern → pain becomes limiting | `docs/research/regulatory-boundary-pain-gated-training-apps.md`, `D83`, `D86` |
| LTAD-style stage vocabulary (Active Start → Fundamentals → Learn-to-train → … → Sport for Life) | `docs/research/periodization-post-framework.md` (Phase 1.5 stub; do not operationalize in M001) |
| Training load = volume × intensity; training assessment parameters match planning parameters | Matches the session-ledger shape in `docs/research/pre-telemetry-validation-protocol.md` |
| Beach surface lowers jumper's-knee incidence vs indoor | Useful positioning context; already reflected in the beach-first scope |

## Explicitly ruled out (do not mine further)

None of the following rise to product relevance for M001 or the solo-first beach wedge, and further extraction is not a good use of time:

- All **team formations** (3-3, 4-2, 6-2, 5-1) — indoor-only, 6v6 court.
- **Rotation** and **libero** rules — indoor-only.
- **Offensive / defensive game systems**, setter distribution strategies, shot-set mechanics — indoor 6v6 tactics.
- **Match management**, coach-as-match-manager, bench coaching — indoor team-sport context.
- **Team building / group psychology** chapters — coach-to-team, not solo-beach-learner relevant.
- **Vibration / acceleration training**, sling training equipment chapters — equipment-dependent, out of scope.
- **Medical treatments** (PRICE, sclerosis of neovessels, platelet-rich plasma, ankle orthoses, infra-patellar straps, eccentric quadriceps protocols) — out of scope under `D86`; any adjacent copy must route through `docs/research/regulatory-boundary-pain-gated-training-apps.md`.
- **Coaches-course system** and FIVB internal development chapters — organizational content, not product input.
- **Resistance-training program design** at federation depth — out of scope for a skill-session product; belongs in a separate strength/prehab module if ever in scope.

## Open questions (worth validating later, not now)

- Whether drills should carry a persisted `motor_stage` (Cognitive / Associative / Autonomous) attribute or keep it implicit via archetype/difficulty. **Bias: keep implicit until a Phase 1.5+ feature needs it.**
- Whether to expose alternative measurement modes ("successful reps in a row," athlete-termination framing) as first-class drill options rather than just vocabulary. **Bias: vocabulary only until there is a concrete need.**
- Whether the cue-density rule (one cue at a time for beginners) belongs in a drill-authoring guide or in `docs/research/beach-training-resources.md` as a drill-content convention. **Bias: short authoring note attached to whichever spec owns drills.**

## Change propagation

- If this note's findings are operationalized (e.g., cue density becomes a UI rule), update the owning spec (`docs/specs/m001-session-assembly.md` or the drill-authoring section of `docs/research/beach-training-resources.md`) and then this note.
- If a future claim starts to depend on Level I Ch XII or Level II Ch III in a way that needs a primary-source citation, promote the relevant PDF from `docs/research/sources/reference-only/` into `docs/research/sources/` and update both READMEs in the same pass.
- If the LTAD vocabulary (Active Start → … → Sport for Life) is ever lifted into Phase 1.5 planning, update `docs/research/periodization-post-framework.md` as the primary owner, not this note.
