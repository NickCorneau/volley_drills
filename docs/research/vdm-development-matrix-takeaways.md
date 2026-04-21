---
id: vdm-development-matrix-takeaways
title: VDM (Volleyball Canada Development Matrix) Takeaways
status: draft
stage: planning
type: research
authority: curated takeaways from the VDM primary-source PDF; mapping from VDM content to product surfaces (drill metadata, copy, safety contract, periodization stubs)
summary: "Mineable findings from the VDM: 4-stage skill vocabulary, time-to-consolidate, 3×/week minimum, structural tolerance framing, 0-10 pain scale, and cross-links to existing canon."
last_updated: 2026-04-20
depends_on:
  - docs/research/sources/VDM_May_8_2023_EN.pdf
  - docs/research/beach-training-resources.md
  - docs/research/srpe-load-adaptation-rules.md
  - docs/research/periodization-post-framework.md
  - docs/plans/2026-04-20-m001-tier1-implementation.md
  - docs/specs/m001-adaptation-rules.md
  - docs/milestones/m001-solo-session-loop.md
related:
  - docs/research/README.md
  - docs/research/binary-scoring-progression.md
  - docs/research/warmup-cooldown-minimum-protocols.md
---

# VDM (Volleyball Canada Development Matrix) Takeaways

## Agent Quick Scan

- Use this note when you need the VDM's **skill-stage vocabulary**, the **time-to-consolidate** anchor, the **3×/week minimum** rule, the **structural-tolerance** framing, or the **0-10 pain scale** in one place, with explicit mapping to product surfaces.
- Not this note for the three VDM findings already in canon: 70% progression threshold (`docs/research/binary-scoring-progression.md`, `D104`), side-specific passing targets and waterfall trajectory (`docs/research/beach-training-resources.md`), or Train-to-Train Beach skill list as the anchor for `chain-6-serving` / `chain-7-setting` (`docs/plans/2026-04-20-m001-tier1-implementation.md` Units 3 and 4).
- Not this note for: the PERSON pillar (coaching soft skills), youth jump-volume caps, or national-team normative data — those do not apply to the 1-2 adult amateur self-coached M001 user.
- Status: **draft** — takeaways are captured but no new decision has been opened. Each item lists its disposition (**Adopt**, **Candidate**, or **Defer**) so an agent can route to the right surface without re-reading the PDF.

## Use This Note When

- a drill-content or session-builder change benefits from the 4-stage skill vocabulary
- `CompleteScreen` or partner-walkthrough copy needs an authoritative time-to-consolidate quote
- `M002` weekly confidence loop planning needs a third-party minimum-cadence anchor
- the safety contract needs a user-facing framing alternative to "load"
- the physio-review backlog revisits longitudinal pain-flag handling (currently per-session only)

## Not For

- replacing `docs/research/beach-training-resources.md` as the broad VDM-citation surface
- opening a new D-number without product-side discussion
- modifying `drills.ts`, `archetypes.ts`, or `adaptation-rules.md` ahead of an explicit decision pass

## Source and provenance

Primary source: `docs/research/sources/VDM_May_8_2023_EN.pdf` (Volleyball Canada, Version: May 8, 2023, 52 pp.). Authors: James Sneddon, Kyle Paquette, Jason Boivin, Michael Cook, with supporting contributors listed p. 2. All page references in this note are the PDF's printed page numbers, not the file's sheet numbers.

## Takeaways

### 1. 4-stage skill-acquisition vocabulary — **Adopt** (formalize what Tier 1 already implies)

**Source.** VDM pp. 31, 34, 36 (Player Pillar skill tables across LTD stages).

**The vocabulary.**

- **Initiation** — first contact the athlete has with a particular skill.
- **Acquisition** — athlete can perform a rough form of the skill; lacks rhythm and flow; form deteriorates further under pressure or in competition.
- **Consolidation** — athlete can perform the skill with correct form; control and rhythm are good in easy/stable conditions; some elements maintained under pressure but performance is inconsistent.
- **Refinement** — athlete can perform the skill with ideal form, speed, precision, and control; the performance is very consistent, even under very demanding conditions; only minor fine-tuning may be necessary.

**What this changes.** `docs/plans/2026-04-20-m001-tier1-implementation.md` Unit 3 already uses these words informally in the "VDM Skill Stage" column of the serving ladder (e.g. "Float — Initiation", "Float — Consolidation (deep target)", "Jump Float — Initiation"). Adopting the vocabulary formally means either:

- documenting the four terms in a header comment in `app/src/data/drills.ts` next to the existing skill-vocabulary glossary, so future drill authoring uses the same four words consistently; **or**
- going further and adding an optional `skillStage?: 'initiation' | 'acquisition' | 'consolidation' | 'refinement'` field on drills, so the session builder can reason about progression without hard-coding per-chain rules.

The header-comment path is the Tier 1 cost-free move. The schema-field path is a real product decision and should not happen without an explicit D-number. Open question: whether the 70% progression gate (`D104`) maps 1:1 to "move the athlete from Acquisition to Consolidation" on a drill family, or whether it's a per-rung advancement rule that's orthogonal to the stage taxonomy.

Cross-link: `docs/research/periodization-post-framework.md` uses Otte's PoST three-state model (Coordination → Skill Adaptability → Performance). The VDM four-stage model sits one level below PoST — it describes *how a single skill matures*, while PoST describes *how training emphasis shifts across a macrocycle*. They are complementary, not competing.

### 2. "~3 months at 2-3×/week to consolidate a skill" — **Adopt** (as a copy anchor)

**Source.** VDM p. 45 (Program Planning & Periodized Plans), direct quote:

> "While many athletes differ in their rate of improvement, it can typically take 3 months or more for an athlete training 2-3 times a week to move from the 'acquired' stage of skill development to 'consolidating' a particular skill. Clearly, this means that we need to be conservative in planning the number of skills we target for a season, and ultimately understand that all plans may need to be adjusted at regular intervals."

**What this changes.** This is a clean third-party anchor for:

- `CompleteScreen` summary copy when a user has been training the same chain for 4–8 weeks and wonders why progression feels slow.
- Partner-walkthrough script wording under `docs/research/partner-walkthrough-script.md` — an honest "here's what a serious skill consolidation timeline looks like" frame.
- Any future "progress journal" surface in `M002` that communicates realistic expectations.

**Do not adopt as a gate.** This is an expectation-setting quote, not a progression rule. The drill-level progression gate remains `D104` (70% over a minimum-attempt window, with self-scoring bias correction).

### 3. "3×/week minimum for skill development" — **Candidate for M002 framing**

**Source.** VDM p. 24 (Structural Tolerance table):

> "The minimum number of practices per week required to develop skills and progress toward 'personal excellence' is 3x/week. A maximum range of training sessions in these stages is listed above. However, more training is not always better. The quality of the practice environment and the athletes' training background are critical factors."

**What this changes.** Until `M002` Weekly Confidence Loop activates, nothing. When it does, this is a candidate anchor for:

- the weekly cadence target on the receipt
- the "you've done 2 this week, one more would lock it in" nudge framing
- the distinction between `D91`'s 2-sessions-in-14-days retention bar (survival signal) and 3×/week (development signal)

**Do not conflate with `D91`.** `D91` asks whether the user returns at all; the VDM 3×/week bar asks whether they'd actually develop skills. These are different questions operating at different time scales. The VDM quote should never be used to move `D91` without a separate decision.

### 4. "Structural Tolerance" framing — **Candidate for safety-contract copy**

**Source.** VDM p. 23, direct quote:

> "Structural tolerance is the ability to withstand a training load without the incidence of injury or excessive fatigue. In order to develop structural tolerance athletes must experience a progressive and carefully planned increase in both the volume (amount/duration) and intensity of training over time. Coupled with inadequate recovery, sudden and dramatic increases in practice, competition, or physical training hours from week to week, month to month or season to season can result in injury, excessive fatigue, overtraining and burnout."

**What this changes.** "Structural Tolerance" is a candidate user-facing term for what our internal `sRPE-load` primitive (`D84`) is actually building. It is warmer than "load" and less clinical than "acute:chronic workload ratio" (which we explicitly ruled out in `docs/research/srpe-load-adaptation-rules.md`).

**Where it could appear.**

- in the "See why this session was chosen" reasoning surface when Tier 2 unblocks that work
- in the regulatory-safe long disclaimer as the concept name for what the app is actually tracking
- in founder-facing narrative when explaining the product's conservative posture

**Do not rename internals.** The schema field name (`sRPE-load`) is internally fine and well-understood by the adaptation-rules spec. This is a copy-layer candidate, not a refactor.

### 5. 0-10 pain scale with "level 2 for 3+ consecutive days → medical" — **Defer, but flag for physio-review backlog**

**Source.** VDM p. 25 (Physical Assessment Protocols):

> "As a part of physical testing and the ongoing physical development regimen, coaches must monitor the pain level of their athletes. Volleyball Canada recommends using the pain scale below. If at any time an athlete experiences pain at level 2 for longer than 3 consecutive days, the athlete must be directed to a medical professional."

Level definitions quoted verbatim:

- **0. No pain** — I have no pain.
- **1. Minimal** — The pain is hardly noticeable.
- **2. Mild** — I have a low level of pain. I am aware of it only when I pay attention to it.
- **3. Uncomfortable** — The pain bothers me, but I can ignore it most of the time.
- **4. Moderate** — I am consistently aware of the pain but I can continue most activities.
- **5. Distracting** through **10. Unable to move** — escalating states; at 10 the athlete needs immediate help.

**What this changes.** Our current binary pain flag (`D83`, `D129` wording: "Any pain that's sharp, localized, or makes you avoid a movement?") is per-session. The VDM's rule is **cumulative across days** — even Mild awareness pain for 3+ days triggers a medical referral.

**Product implication.** A longitudinal pain-follow-up is already in the M001 physio-review backlog (`docs/milestones/m001-solo-session-loop.md` — see "Post-shield-trigger next-session follow-up" and the implicit shape of "Region-aware pain follow-up"). The VDM adds a concrete threshold to that work: *if the pain flag has been "yes" on 3 consecutive sessions within a 3-day window, surface a "consider seeing a physio" nudge on Home.*

**Do not ship this in Tier 1 or Tier 2.** It requires a new `storageMeta.recentPainFlags` (or equivalent) rolling counter, a Home-screen surface, and copy that stays on the right side of `D86` / `docs/research/regulatory-boundary-pain-gated-training-apps.md`. This is squarely a post-`D91` or `M002`-adjacent piece of work. Record it here so the next physio-backlog review has the threshold in hand.

### 6. Adaptation Principle (progression + reversibility) — **Adopt as a citation, not a new rule**

**Source.** VDM p. 45:

> "A critical element underlying periodized planning is the Adaptation Principle. According to this principle, athletes need to be progressively exposed to a sufficient amount of training stress to improve, but enough time and adequate conditions must also be in place to ensure recovery. [...] improvements resulting from training are not constant and linear. Progress can be fast initially, but a plateauing effect may be observed after a while, so performance may stagnate if the stimulus or 'training load' is not adjusted periodically. In addition, because adaptations are also reversible, performance may even decrease if the 'load' is too weak or if it is not applied frequently enough."

**What this changes.** Nothing structural. But this is a citation to drop into `docs/research/srpe-load-adaptation-rules.md` when that note is next edited — it provides a plain-English, Canadian-NSO source for the progression + recovery + reversibility shape that the sRPE-load engine is already encoding. It is also a useful internal reference when explaining to a tester or partner *why* the app pushes back against "same session, harder, three days in a row."

### 7. Performance demands taxonomy: cue-reading / decision-making / execution — **Defer**

**Source.** VDM pp. 30, 48-49 (Player Pillar + Glossary):

> "Volleyball demands – The factors that impact performance. In Volleyball, they can be grouped into three main categories: cue reading, decision-making, and skill execution."

**Why it's here.** The three-category model (the Player Pillar labels them *SEEING*, *SEEKING SOLUTIONS*, *SKILLS*) is an interesting candidate for long-term drill metadata — each drill could declare which of the three demands it trains, which would let a session builder balance execution-heavy drills (technique) with read-heavy drills (tactical).

**Why we defer.** M001 drill metadata is already rich (skill tag, participant count, equipment, intensity level, source provenance, progression/regression description). Adding a "demands" taxonomy without an explicit product surface that consumes it would be drill-schema churn with no user-visible outcome. Park this under `docs/research/periodization-post-framework.md` — PoST's "Skill Adaptability Training" stage is the natural home for cue-reading emphasis if the two frameworks eventually merge in an `O2` activation.

## Explicitly not mined

- **PERSON pillar (pp. 7-12).** Coaching soft skills, athlete life-context, mental skills. Important in a club context; not actionable for a 1-2 adult amateur self-coached courtside tool.
- **ATHLETE pillar (pp. 13-17) — youth strength and jump caps.** Specific to athletes in the adolescent growth spurt (PHV). Our target user is adult, post-PHV. Generic guidance on strength and suppleness routines is already covered with more product-specific framing in `docs/research/warmup-cooldown-minimum-protocols.md`.
- **Physical and skill normative data (pp. 26-29, 40-44).** National-team benchmarks (spike reach, CMJ, pass efficiency %, kill %) for Youth through Senior. Completely out of scope for M001's amateur user.
- **Sustenance, sleep, menstruation, body composition tables (pp. 20-22).** Important health context; sits inside the long-disclaimer scope for M001. Not a product surface.
- **Indoor and sitting volleyball skill progressions (pp. 32, 34, 36).** Out of beach scope.

## Open questions carried forward

- Does the VDM 4-stage vocabulary get adopted as inline drill metadata (a `skillStage` field), or does it stay as authoring-side naming convention in the serving/setting chains? Deferred until a decision pass — do not resolve in this note.
- Is the `D91` 2-in-14-days bar vs the VDM 3×/week bar worth surfacing to the user as *two distinct goals*, or is that over-instrumenting the self-coached experience? Re-open at the 2026-07-20 `D130` re-eval.
- Does the longitudinal pain-flag work (item 5) land as a discrete `M002` increment, or as a post-`D91` Tier 3 micro-feature gated on founder-use data? Depends on whether the founder actually hits the rolling-pain threshold during Tier 1 / Tier 2.

## Change log

- 2026-04-20 — note created from a takeaways review of `docs/research/sources/VDM_May_8_2023_EN.pdf`. Seven items captured with disposition (Adopt / Candidate / Defer); no new decisions opened; no code changes implied.
