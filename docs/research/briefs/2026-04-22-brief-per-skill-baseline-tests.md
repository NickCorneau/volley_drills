---

## id: brief-per-skill-baseline-tests-2026-04-22
title: "Research brief: Per-skill baseline skill assessments for amateur beach volleyball"
type: research
status: sent
stage: validation
authority: "Vendor-facing research brief. Content below the '--- BRIEF ---' marker is the text intended for the vendor; the frontmatter above is internal-only."
summary: "Self-contained research brief requesting a synthesis of validated or field-tested baseline skill assessments (passing / serving / setting) for adult amateur beach volleyball players, scoped to self-administered courtside use and ~3-5 minute per-skill duration. Deliverable is a ~2000-4000-word memo with per-skill assessment catalog, synthesis table, recommendation section, and gaps section. Priority sources tiered from peer-reviewed to practitioner wisdom."
last_updated: 2026-04-22-a
internal_motivation: "Informs the per-skill user-level taxonomy open question (decisions.md O21) and the Phase 1.5 baseline-tests scope in the roadmap. Skip-reason-if-deferred: existing single-scalar `storageMeta.onboarding.skillLevel` (D-C4 / D121) remains sufficient for M001; per-skill tracking is a Phase 1.5 question and this research compounds over time."
responses:
  - docs/research/briefs/responses/2026-04-22-per-skill-baseline-tests-vendor-1.md
  - docs/research/briefs/responses/2026-04-22-per-skill-baseline-tests-vendor-2.md
  - docs/research/briefs/responses/2026-04-22-per-skill-baseline-tests-vendor-3.md
distilled_in: docs/research/baseline-skill-assessments-amateur-beach.md

# Research brief: Per-skill baseline skill assessments for amateur beach volleyball

> This brief is intended to be sent to an external research vendor. The body below is self-contained — no prior project context is required. Copy or forward the content below the "--- BRIEF ---" marker as needed.

--- BRIEF ---

## Context

We are designing a local-first mobile training application for adult amateur beach volleyball players who train without a coach. Target users are adults, typically with two to five years of recreational experience, training one to three times per week, often solo on sand with only a ball (sometimes with a partner, sometimes with a wall or net). The app assembles practice sessions from structured drill templates, tracks completion and perceived exertion, and suggests adjustments to future sessions.

We need to decide whether the app should include self-administered baseline skill assessments — short drills that produce a reliable score representing a player's current level in each of the three core skills (passing/reception, serving, and setting) — and if so, which specific assessments are best suited for amateur courtside use.

## Research question

What validated or field-tested baseline skill assessments exist for amateur beach volleyball players across passing (reception), serving, and setting, that can be **self-administered in a single 3–5 minute drill per skill**, scored using a binary or ordinal rubric a solo or partnered amateur player can apply honestly, and produce a signal reliable enough to inform session difficulty calibration?

## Why this is non-obvious

Academic testing literature exists for indoor volleyball (AAHPERD Serve Test, Russell–Lange Volleyball Test, Brady Volleyball Test, and similar) but these are generally indoor-focused, coach-administered, and calibrated for youth or scholastic populations. Beach-specific literature is sparser. The courtside-amateur-self-administered intersection is where we expect the literature to thin out, and we want an honest map of what exists versus what would need to be adapted.

## Key sub-questions to address

1. **For passing (reception).** What are the most commonly referenced skill tests? What do they measure (platform shape, accuracy, movement integration, decision-making)? Are there beach-specific variants? What scoring rubrics are used?
2. **For serving.** Same structure. Distinguish float, jump-float, and jump-topspin where the literature does. Flag any tests specifically about serve placement versus serve consistency versus serve pressure.
3. **For setting.** Same structure. Distinguish hand-set from bump-set tests. Note which tests require a partner and which can be self-administered.
4. **Reliability evidence.** For each candidate test, what test-retest reliability, inter-rater reliability, or construct-validity evidence exists? Cite numbers where available.
5. **Minimum viable dose.** How many repetitions does each test need to produce a stable score? What is the shortest defensible version?
6. **Self-scoring bias.** Is there literature on how much bias amateur players introduce when scoring their own performance versus observer scoring? Magnitude estimates if available.
7. **Environmental adjustments.** How do sand, wind, sun, and heat affect score reliability? Any explicit protocols for standardizing across environmental variation?

## Deliverable

A 2,000–4,000 word memo containing:

- **Per-skill assessment catalog** — for each of pass, serve, set, list the 3–5 most credible baseline tests with source citations, reliability evidence (where known), and suitability ratings for amateur beach solo/partner use.
- **Synthesis comparison table** — tests compared across: duration, equipment needed, partner required, scoring rubric type, reliability rating (high/medium/low/unknown with citation), solo-adaptability rating.
- **Recommendation section** — if a courtside app had to ship a single ~3–5 minute per-skill baseline test that an amateur could self-administer and trust, what are the top 1–2 candidates per skill, and what compromises does each make (e.g., trades reliability for speed, requires partner, requires wall)?
- **Gaps and open questions** — what the literature does not answer that practical implementation would need to resolve, and what study designs could answer them.
- **Full citation list** with DOIs or stable URLs where available.

## Priority sources

- **Tier 1 (peer-reviewed):** Journal of Strength and Conditioning Research, International Journal of Sports Physiology and Performance, Journal of Sports Sciences, Sports Medicine, Journal of Sports Science and Medicine. Motor-learning and sports-assessment methodology textbooks (Schmidt, Magill, Wulf) for validity framework references.
- **Tier 2 (governing bodies and federations):** FIVB coaching materials, USA Volleyball, Volleyball Canada, Volleyball England, Volleyball Australia, AVP coaching curriculum. Any federation-published beach-specific coaching handbooks.
- **Tier 3 (practitioner published methodology):** Published methodology from established beach coaches or players (Karch Kiraly, Misty May-Treanor, Todd Rogers, April Ross, Mike Dodd, equivalent). Coaching course curricula where they reference specific assessment protocols.
- **Tier 4 (lower confidence, flag clearly):** Established coaching blogs, podcasts, YouTube tutorials from credentialed practitioners. Cite as practitioner wisdom, clearly separated from evidence.

## Constraints

- Target population: adults, 2–5 years recreational experience, 1–3 sessions per week.
- Environment: sand, outdoors, typical 15–40 minute session, 1–3 volleyballs, optional net and wall.
- Supervision: none. No coach, no trainer, no observer.
- Courtside use: the player is holding or glancing at a phone. Tests needing a video camera, radar gun, or ball machine are disqualified.

## Things to flag explicitly

- Any test that requires equipment amateurs do not typically carry (radar gun, ball-machine, multiple cameras, force plates).
- Any test with a known validity ceiling above intermediate level (i.e., cannot discriminate intermediate from advanced).
- Any test with known reliability issues that would make "did I improve?" answers noisy at the target population level.
- Any test where beach-specific validity has been studied separately from indoor validity — and any test where the beach validity assumption is being extrapolated from indoor evidence.

## Success criteria

The memo is successful if a product designer can read it and:

- Pick a top candidate assessment per skill with defensible reasoning.
- Understand the reliability trade-off they are accepting.
- Know which gaps in the literature could surprise them post-launch.
- Trace every claim to a cited source.

## Timeline and format

- Expected turnaround: 2–3 weeks. Please flag early if that's unrealistic for this scope.
- Format: single markdown document, plain prose plus tables where useful.
- Please include a one-page executive summary at the top.
- If key questions cannot be answered from available literature, say so explicitly rather than extrapolating.