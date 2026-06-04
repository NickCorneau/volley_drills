---
title: Progress signals for low-dose self-coached skill apps are behavioral-primary; subjective ratings are readiness companions, not skill proof
date: 2026-06-02
category: docs/solutions/design-patterns
module: M002 / weekly-receipt / plan-and-adaptation
problem_type: design_pattern
component: documentation
severity: medium
applies_when:
  - Designing a progress / "am I getting better?" surface for a self-coached amateur skill app at low dose (1-3 sessions/week)
  - Choosing what a weekly metric, receipt, or confidence number is allowed to claim
  - Deciding how opinionated an above-session (multi-week) planning layer should be
  - A milestone or metric is named after a hoped-for signal (e.g., "confidence") before the signal's validity is established
tags: [m002, progress-signal, self-coached, confidence, adherence, periodization, metric-design, inherited-naming]
---

# Progress signals for low-dose self-coached skill apps: behavioral-primary, subjective-companion

## Context

A four-topic research day (2026-06-02: single-tracked metric, subjective-skill-confidence validity, low-volume periodization, coach-pedagogy translation) produced four independent vendor syntheses that — read together (`docs/research/2026-06-02-m002-evidence-meta-synthesis.md`) — converge on one design rule for the M002 "Weekly Confidence Loop." The convergence is strong enough, and crosses enough separate evidence bases, to be worth stating once as a reusable rule rather than re-deriving each time a progress surface is scoped.

## Guidance

For a self-coached amateur skill app at **1-3 sessions/week**:

1. **The honest headline progress signal is behavioral, not subjective.** Use a behavioral anchor (planned-vs-completed adherence; deliberate-practice exposure; a repeated structured drill score). A single weekly self-rated **confidence** reading measures *state self-efficacy / felt readiness*, not skill — it is confounded (recency / mood / fatigue dominate within-person variance) and **directionally biased** in the 2-5-yr band, where confidence can move *opposite* to skill (a dip can be a breakthrough). Keep confidence as a **felt-readiness / engagement companion**; never surface it as "your skill improved," never display a single-week delta, never auto-read a dip as failure.
2. **The believable "1% better" signal is a repeated structured drill score on a focal skill** (same task, same scoring rule, measured often enough to beat noise) — at a real courtside-capture cost. If that cost isn't worth paying yet, carry felt-progress with **visible plan adaptation** (a carry-forward + an *offered* "accept / keep original" verdict loop) and leave a clean seam for the drill score.
3. **Keep any above-session structure thin and skill-thematic, justified by adherence + skill-organization, never physiology.** Classical *physical* periodization is below the noise floor at this dose. If anything ships above the session, it is a light ~4-week skill-thematic layer (spacing + keep-all-skills-alive), with day-to-day load left to the session engine.
4. **Gate richer structure on the product's own cohort A/B, not borrowed elite sports science.** The target population is under-researched in every one of these literatures; instrument from day one so the cohort becomes the missing study.
5. **Goal / promise / cue surfaces translate coachlessly only when user-owned, process-framed, off the active run screen, and (for forward-looking promises) A/B-gated.** Authoring friction is the active ingredient — never auto-generate the user's goal; never make a falsifiable objective promise ("you'll be a better passer"); never coach-grade pass/fail.

## Why This Matters

Each point was reached independently by a different evidence base, which is what makes the rule trustworthy: the metric note (ship a two-metric pair, planned-vs-completed anchor), the confidence-validity note (confidence is felt readiness, not skill), the periodization note (don't build a heavy planner), and the pedagogy note (process-framed, A/B-gated, never coach-graded) all point the same way. Violating any one tends to produce the same failure: a surface that *looks* like progress but isn't honest, which at this dose erodes trust faster than it builds it (a plateau-week confidence dip read as "I'm getting worse" is the canonical example).

**Prevention — watch for the inherited-name trap.** The milestone is named "Weekly Confidence Loop," which silently encodes "confidence is the skill signal" — the exact premise all four sets contradict. This is the second time an *inherited name carried a premise the evidence later contradicted* (the first: "weekly" cadence survived into the 2026-05-27 M002 receipt doc because the milestone name said so, not because evidence chose it — see `docs/reviews/2026-05-27-m002-receipt-doc-review-synthesis.md` S2). When research undercuts what a milestone/metric was named for, fix the *meaning* (and consider the name) — do not let the name keep encoding a contradicted premise into implementer-facing planning defaults.

## When to Apply

- Scoping the M002 weekly receipt / carry-forward / advancement-signal surfaces.
- Deciding whether a new self-rated input should be presented as progress, readiness, or neither.
- Evaluating any proposal for a multi-week / periodized planner at low dose.
- Any time a doc's name or a metric's label asserts a signal whose validity hasn't been established for this population.

Do NOT over-apply: this is scoped to **low-dose (1-3 sessions/week), self-coached, amateur skill-sport**. At higher dose the metric ranking shifts (load metrics regain relevance) and the periodization null does not hold.

## Examples

- **Anti-pattern:** weekly receipt headlines a confidence number framed as "your skill this week," with a single-week up/down delta. → A plateau dip reads as regression; trust damage.
- **Pattern:** weekly receipt headlines planned-vs-completed (behavioral) + a relabeled "how ready you feel in [skill]" confidence companion (rolling window, no single-week delta), with a visible "your plan adapted: lighter this week because…" carry-forward as the "you can see it working" surface, and a seam reserved for a repeated drill score.

## Related

- `docs/research/2026-06-02-m002-evidence-meta-synthesis.md` — the cross-cutting synthesis this rule distills.
- `docs/reviews/2026-06-02-m002-ideation-revalidation.md` — the red-team that surfaced the inherited-name trap (S2) and the #5/advancement-signal gap.
- `docs/research/single-tracked-metric-amateur-skill-apps.md`, `docs/research/subjective-skill-confidence-validity.md`, `docs/research/periodization-low-volume-amateur-skill-sport.md`, `docs/research/coach-pedagogy-translation-self-coached.md` — the four owning syntheses.
- `docs/reviews/2026-05-27-m002-receipt-doc-review-synthesis.md` — prior instance of the inherited-name trap (cadence).
