---
id: warmup-cooldown-minimum-protocols
title: Minimum Warm-Up And Cool-Down Protocols For Short Beach Sessions
status: active
stage: validation
type: research
authority: "evidence base and ship-ready defaults for the mandatory warm-up and cool-down blocks in short (10–25 min) beach volleyball sessions (D85)"
summary: "Beach Prep Three is the defensible default warm-up; Beach Prep Five is the opt-in longer version; Beach Prep Two is the compliance fallback. Cool-down is relabeled 'Downshift' at 2–3 minutes; no recovery or injury-prevention claims attached."
last_updated: 2026-04-16
depends_on:
  - docs/research/beach-training-resources.md
  - docs/specs/m001-session-assembly.md
  - docs/specs/m001-adaptation-rules.md
  - docs/decisions.md
related:
  - docs/research/README.md
  - docs/prd-foundation.md
  - docs/research/onboarding-safety-gate-friction.md
  - research-output/warmup-cooldown-minimum-protocols.md
  - research-output/beach-volleyball-safety-guardrails.md
---

# Minimum Warm-Up And Cool-Down Protocols For Short Beach Sessions

## Agent Quick Scan

- Use this note when authoring or reviewing the **warm-up** and **cool-down** content for M001 sessions (15 / 25 / 40+ minute time profiles) and when defending the minimum block duration in `D85`.
- Ship-ready stance: default warm-up is **Beach Prep Three** (~3 min), opt-in is **Beach Prep Five** (~5 min), fallback is **Beach Prep Two** (~2 min); cool-down is **Downshift** (~2–3 min) framed as transition/comfort, not recovery.
- This note informs `D85` and seeds a concrete follow-on decision (`D105`). It does not override `D82`, `D83`, `D86`, or `D88`, and it explicitly does *not* claim that a 2–5 minute block reproduces the injury-reduction effect sizes of VolleyVeilig or the 11+ family.
- Not this note for the onboarding safety-gate placement question (use `docs/research/onboarding-safety-gate-friction.md`), for the safety/stop-trigger copy (`D82`, `D88`, `docs/specs/m001-adaptation-rules.md`), or for drill-level main-skill content (`docs/research/beach-training-resources.md`).

## Bottom Line

For beach skill sessions lasting only 10–25 minutes, the defensible product stance is:

- **Default**: 3-minute warm-up (**Beach Prep Three**).
- **Opt-in**: 5-minute warm-up (**Beach Prep Five**) when the user can spare the time.
- **Fallback**: 2-minute warm-up (**Beach Prep Two**) only to preserve compliance on the shortest sessions.
- **Cool-down**: 2–3 minute **Downshift** block. Do not call it "Recovery" or "Injury Prevention" — the post-2015 evidence does not support those claims at this dose.

The literature supports warm-up for readiness and, when repeated consistently across a season, for injury reduction. It does **not** support claiming that a 2–5 minute block is equivalent to the 10–15 minute validated neuromuscular programmes (**VolleyVeilig**, **11+ Shoulder**, FIFA 11+ family). Those work at least twice weekly at materially longer doses than what M001 can afford in a 15-minute session.

The short block can still be evidence-based if it concentrates on the highest-yield pieces for sand volleyball — **brief whole-body ramp**, **ankle proprioception**, **shoulder and trunk activation**, and **sand-specific movement rehearsal** — and avoids time sinks with weak evidence (prolonged static stretching, elaborate post-session stretching, Nordic/Copenhagen-style exercises crammed into the block).

Confidence: **medium-high** that Beach Prep Three covers the right components at the right dose for a 15-minute session; **medium** that the Downshift framing aligns with the post-2015 active-cool-down literature; **low** on any specific injury-rate delta attributable to these compressed versions (the evidence base is for longer programmes).

## Use This Note When

- Authoring warm-up content for the `warmup` block in `app/src/data/archetypes.ts` and the seed drills (`d01`) in `app/src/data/drills.ts`.
- Choosing cool-down copy and naming for the `wrap` block and `d25`.
- Defending minimum block durations in `D85` against future "shrink it further" or "expand it further" asks.
- Deciding whether a proposed warm-up or cool-down component has evidence sufficient to be **mandatory** vs **optional** in a 2–5 minute budget.
- Writing the in-app safety micro-copy that sits adjacent to the warm-up block.

## Not For

- The onboarding safety gate shape, first-run screen count, or pain-flag copy (use `docs/research/onboarding-safety-gate-friction.md`, `D83`, `D92`).
- The safety policy, stop/seek-help triggers, or regulatory positioning (use `D82`, `D86`, `D88`, and `docs/specs/m001-adaptation-rules.md`).
- Skill-block (technique / main_skill / pressure) drill content (use `docs/research/beach-training-resources.md` and `docs/specs/m001-session-assembly.md`).
- Adaptation / progression rules (`docs/specs/m001-adaptation-rules.md`).
- Long-form strength or prehab modules (Nordic hamstrings, Copenhagen adductions, VolleyVeilig 15-min full block) — those belong in a separate module, not in the mandatory warm-up.

## Evidence At A Glance

| Component | Evidence shape | Dose gap vs M001 budget | Inclusion verdict |
|---|---|---|---|
| Whole-body active ramp (march / jog / side-step, arm swings) | Muscle temperature rises fastest in first 3–5 min; team-sport warm-up literature favors 10–15 min with rising intensity | M001 budget is 2–5 min; 3 min is the earliest physiologically credible point | **Mandatory in all versions** |
| Ankle proprioception / single-leg balance | Classic volleyball balance-board RCT reduced ankle sprains (especially in previously sprained players); meta-analyses confirm balance training reduces ankle-sprain recurrence | Short dose fits the block; strongest single-component evidence available | **Mandatory in all versions** |
| Shoulder activation (scap push-up plus, plank shoulder taps, band external rotation) | 2023 prospective volleyball study showed lower injury incidence with a shoulder-focused warm-up; 11+ Shoulder improved proprioception / dynamic stability | No-equipment versions are a weaker proxy than banded versions, but defensible | **Mandatory in all versions**; prefer band-based if equipment allows |
| Trunk / anti-extension work | Mens volleyball trial: trunk+balance block did **not** reduce injury incidence, **did** reduce overuse severity and injury burden; low-back load is a known beach issue | Compact trunk drill fits the block | **Mandatory in all versions**, framed as burden/mechanism not rate reduction |
| Sand-specific ball rehearsal (self-toss pass/catch, shadow approach) | Beach coaching consensus: feel for wind, prefer ball work when practical; sand lowers jump output and raises energy cost | Only possible at 3+ min; justified use of scarce time | **Mandatory in Beach Prep Three and Five** |
| Dynamic mobility (lunge + reach, squat-to-stand) | Dynamic stretching helps lower-limb explosive output; best effects at longer doses than we can afford | Supportive but not evidence-dense at short doses | **In Beach Prep Three and Five only** |
| Low pogo hops / ankle pops | Practical coaching inference for elastic wake-up; not a directly validated beach prevention element | Low-volume only | **Beach Prep Five only, flagged as readiness-oriented** |
| Prolonged static stretching pre-session | Prolonged static stretching before explosive work impairs performance in jumping sports | — | **Explicitly excluded** |
| Nordic hamstring / Copenhagen adduction | Strong evidence in other sports; high-eccentric, soreness-inducing, compliance-sensitive | Wrong fit for a mandatory 2–5 min block | **Excluded from this block; belongs in separate strength/prehab module** |
| Multiple maximal approach jumps | Sand suppresses jump output; pre-session max jumps cannibalize the main block | — | **Excluded; at most 0–2 submax rehearsal jumps** |
| Post-session static stretching for "recovery" | Not a strong recovery tool (soreness, muscle-damage, neuromuscular recovery markers unchanged vs passive) | — | **Excluded as "recovery" framing; allowed as comfort only** |
| Active cool-down at 6–10 min | Clears lactate faster; inconsistent benefits beyond that; some performance-recovery studies at this dose | Outside M001 budget | **Not a 2–3 min Downshift claim** |

## How Sand Changes The Job

- Beach injury profile is shoulder- and low-back-heavy, not ankle-heavy. NCAA beach data: shoulder is the most common injury site, low back is second. Professional beach data: low back, knee, and shoulder are the main overuse problems. The warm-up should give proportionally more attention to shoulder, trunk, and movement quality than a generic indoor warm-up would.
- Sand has a higher energy cost and a lower-impact profile; sprinting and jumping on sand produce lower power and jump height with altered mechanics. The short warm-up should prefer **low-volume rehearsal** over a long potentiation block and should include **few or no maximal jumps**.
- Elite beach coaching explicitly emphasizes **reading wind and current conditions** and prefers warm-up activities with a ball when practical. The final 30–60 seconds of the warm-up should be a ball and movement-feel block whenever the environment allows it.
- Heat is a first-class hazard in beach sessions. On very hot days the right trade is a **shorter warm-up plus hydration/cooling awareness**, not more mobility. This interacts with `D83` (heat CTA) and `D88` (stop/seek-help triggers for heat red flags).

## Beach Prep Two (~2 min fallback)

Use only when total session time is so tight that anything longer threatens main-block compliance. Frame as a minimum viable gate, not a fully protective warm-up.

1. **Build heat — 30 s.** Sand march / easy jog with large arm swings. *Cue:* "Get lightly warm, not tired. Quiet shoulders, quick feet."
2. **Low shuffle and retreat — 30 s.** 2–3 shuffles each way, one retreat step, controlled stop. *Cue:* "Stay low. Own the stop. Let the sand move under you."
3. **Single-leg reach balance — 20 s L, 20 s R.** Soft knee, free-leg or opposite-hand reach forward and out. *Cue:* "Tripod foot. Knee soft. Don't let the arch collapse."
4. **Plank shoulder taps (or mini-band external rotations) — 20 s.** *Cue:* "Ribs down. Hips still. Shoulder blade moves, torso doesn't."

**Verdict**: defensible as a compliance floor. Covers the strongest signal-per-second components. Below the dose normally associated with meaningful whole-body readiness or programme-level injury reduction — do not advertise it as equivalent to Beach Prep Three or Five.

## Beach Prep Three (~3 min default)

This is the standard app default. Short enough to protect practice time, long enough to cover every key bucket without feeling fake.

1. **Build heat — 45 s.** Sand march → easy jog with arm circles and arm sweeps. *Cue:* "Breathe easy. Get warm enough to move fast."
2. **Alternating lunge with reach — 30 s.** Shallow forward lunge, overhead reach, slight rotation toward front leg. *Cue:* "Front heel heavy, back glute on, rotate through upper back."
3. **Single-leg reach balance — 15 s L, 15 s R.** *Cue:* "Soft knee, quiet pelvis, stable foot."
4. **Plank shoulder taps or scap push-up plus — 30 s.** *Cue:* "Long neck, ribs down, shoulder blades glide."
5. **Sand-specific rehearsal — 45 s.** Preferred: self-toss → move → forearm pass/catch to self into the wind. No ball: shadow approach footwork and retreats with 0–1 submax jump. *Cue:* "Read the wind. Smooth feet. No max efforts yet."

**Verdict**: best overall trade for short sessions. The 15-minute archetype default should target this block; the 25-minute archetype should support either Three or Five depending on user input.

## Beach Prep Five (~5 min opt-in)

The most defensible "short but serious" version when the user has 5 minutes to spare.

1. **Build heat — 60 s.** March / jog / side-step continuously with controlled overhead arm swings. *Cue:* "Get lightly sweaty. Keep the effort under control."
2. **Dynamic mobility — 60 s.** Shallow lunge + overhead reach and squat-to-stand patterns. *Cue:* "Open the ankle, hip, and upper back without holding stretches."
3. **Ankle control + elastic wake-up — 60 s.** 20 s L single-leg reach, 20 s R, then 20 s low pogo hops / ankle pops. *Cue:* "Stick the balance. Then quick, tiny contacts — springy, not high."
4. **Shoulder + trunk block — 60 s.** 30 s scap push-up plus or band external rotation, then 15 s side plank each side. *Cue:* "Shoulders glide, ribs stay down, hips stay stacked."
5. **Beach rehearsal — 60 s.** Preferred: self-toss pass/catch, soft set, 1–3 controlled approaches; at most 2 submax jumps at ~70–85%. *Cue:* "Feel the court, feel the wind, save your max jumps for the session."

**Verdict**: the best short-session version that still fits inside a 25-minute skill session without cannibalizing the main block.

## Downshift Cool-Down (~2–3 min)

Replaces any "Recovery" or "Injury Prevention" framing on the post-session block. Downshift is about transition and comfort; it is *not* a proven recovery intervention at this dose.

1. **Easy walk — 60–90 s.** *Cue:* "Long exhale. Let heart rate come down." The only step that is clearly worth keeping for everyone.
2. **Calf and foot unload — 30 s.** Gentle calf pumps or light standing calf stretch, alternating sides. *Cue:* "Ease out of the sand, don't crank the stretch."
3. **Hip flexor + trunk reach — 30 s.** Split stance, overhead reach, gentle exhale, switch sides. *Cue:* "Open the front of the hip, keep the rib cage quiet."
4. **Shoulder reset — 30 s.** Cross-body reach or wall/lat reach if available. *Cue:* "Gentle tension only." Optional; skip if it irritates the shoulder.
5. **Hydration and symptom check — 10–15 s.** *Cue:* "If pain is rising, note it now. Hot session? Rehydrate before you leave."

The label matters. Product copy should call this block **Downshift** or **Transition**, not "Recovery" and not "Injury Prevention." That is aligned with the post-2015 active-cool-down literature, which finds faster lactate clearance but no meaningful soreness, muscle-damage, neuromuscular, range-of-motion, or psychological-recovery benefit over passive recovery.

## Freeze Now

Ship-ready for M001 build (pending coach review in `O7`):

1. **Default warm-up is Beach Prep Three** (~3 min) for the 15-minute and 25-minute time profiles.
2. **Beach Prep Five** (~5 min) is available as an opt-in, expected on the 25-minute and 40+ profiles when the user has the time.
3. **Beach Prep Two** (~2 min) is a compliance fallback only, not a marketed default.
4. **Cool-down is Downshift** (~2–3 min). Product copy removes "recovery" and "injury prevention" framing from the post-session block. Stop/seek-help triggers (`D88`) remain reachable from the Downshift screen, but the block itself is framed as transition/comfort.
5. **Module names** are descriptive and non-proprietary: **Build Heat**, **Prime Ankles**, **Shoulder and Trunk Prep**, **Rehearse the Sand**, **Downshift**. Avoid 11+ / VolleyVeilig branding unless a licensing path is opened.
6. **In-app safety micro-copy** adjacent to the block reads: *"Sharp pain, dizziness, numbness, tingling, or pain that climbs rep to rep: stop and switch to easy walking."* Optional second line: *"Skip any movement that hurts today."*

## Validate Later

1. **Prior-ankle-sprain branch.** Evidence is strongest in previously sprained athletes. Consider an app branch that adds bracing guidance or a slightly longer balance drill when the user reports a history of ankle sprain.
2. **Shoulder-exercise substitution.** If the product can assume a mini-band or a wall, a more shoulder-specific option is possible. The no-equipment default is a practical compromise with weaker direct specificity.
3. **Pain branches for current shoulder or low-back irritability.** A physiotherapist should review substitutions for players who cannot tolerate plank, side plank, or overhead reaching.
4. **Youth, novice, and return-to-play variants.** The minimum versions assume a generally healthy athlete. If novice or previously injured users become a major audience, additional variants need explicit authoring rather than implicit coverage by Beach Prep Three.
5. **Hot-sand and heat policy.** Review whether to explicitly surface hydration, session truncation, or sand-sock guidance inside the warm-up UI when the heat CTA fires (interacts with `D83` and `D88`).
6. **Compliance measurement inside `D91` cohort.** Measure whether testers actually complete the default warm-up vs shorten to fallback or skip entirely, and whether Downshift framing matches what users expect from a "cool-down" block.

## Apply To Current Setup

M001 code alignment that flows from this note (pending implementation in follow-up passes):

- **`app/src/data/archetypes.ts`**: the 15-minute time profile currently allocates `warmup(2, 3)`, which permits either Beach Prep Three or the fallback. Consider tightening to `warmup(3, 3)` so the default **is** Beach Prep Three rather than "might be Beach Prep Two." The 25-minute profile at `warmup(3, 4)` should likely become `warmup(3, 5)` to support the opt-in Beach Prep Five.
- **`app/src/data/drills.ts` `d01`**: the current warm-up drill (`Pass & Slap Hands`) is a ball-handling warm-up rather than the whole-body ramp + ankle + shoulder + trunk + sand rehearsal package described here. Either (a) rename and restructure `d01` into the Beach Prep Three structure, or (b) add a new warm-up drill that encodes Beach Prep Three and relegate `d01` to an optional extra technique touch inside the warm-up window.
- **`app/src/data/drills.ts` `d25`**: the cool-down drill (`Cool-down Walk + Breathing Reset`) already has the right shape but should be renamed to `Downshift` with objective copy updated away from "Recovery" framing. Its `shortName` should become `Downshift`.
- **`app/src/lib/format.ts`**: the block-type labels `WARM UP` / `COOL DOWN` are fine; no change required unless product copy moves to `BUILD HEAT` / `DOWNSHIFT` in the Run screen.
- **`docs/specs/m001-session-assembly.md` "Block intent" for `warmup` and `wrap`**: the `warmup` intent should mention ankle, shoulder/trunk, and sand rehearsal as the four priority components; the `wrap` intent should be reframed as Downshift (transition and comfort) and should drop any implicit recovery promise.

## Open Questions

- **O4 (indirect).** Does the sand-specific rehearsal step of Beach Prep Three assume enough open sand / ball access that it should be environment-gated like `D102`? Likely no — self-toss pass/catch and shadow footwork both work in open sand and do not need a wall — but worth validating in the `D91` cohort.
- **O7.** This note does not substitute for the volleyball-coach and sports-medicine reviews listed under `O7`. The block structure is defensible in the literature synthesis, but coach review is still the right gate before scaling beyond testers.
- **O12 / O14 (indirect).** Cue cadence research (`O14`) and self-estimation research (`O15`) both interact with the cue lines in this note; the cues here are written as single-shot "external focus" prompts consistent with the guidance-hypothesis literature in `docs/research/beach-training-resources.md`.
- **New: minimum warm-up compliance.** No public data exists on compliance rates for 2-minute vs 3-minute vs 5-minute beach warm-ups. `D91` cohort measurement (time-to-first-drill, skip rate, shorten rate) is the way this closes.

## Notes

- This note is a **literature synthesis**, not a cleared clinical protocol. It does not replace the safety policy in `D82` / `D86` / `D88` or the pre-session gate in `D83`.
- Any claim stronger than "these compressed versions cover the highest-yield components at the shortest defensible dose" is unsupported by the post-2015 evidence base at this block length.
- The raw research drop that sourced this note is frozen at `research-output/warmup-cooldown-minimum-protocols.md`; future synthesis updates belong here, not there.
