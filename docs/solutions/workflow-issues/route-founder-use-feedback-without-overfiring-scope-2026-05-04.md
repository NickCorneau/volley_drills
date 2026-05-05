---
title: Route founder-use feedback without over-firing scope
date: 2026-05-04
category: workflow-issues
module: docs
problem_type: workflow_issue
component: documentation
severity: medium
applies_when:
  - "Capturing founder-use or partner-walkthrough feedback into durable repo docs"
  - "A real-use session produces validation, friction, and wishlist asks together"
  - "D135 content-gap vs feature-wish evidence boundaries affect routing"
symptoms:
  - "Session feedback is strong enough to update docs but not enough to unlock new product scope"
  - "Wishlist items risk being treated like trigger hits"
  - "Research, ledger, current-state, and catalog surfaces need synchronized routing notes"
root_cause: inadequate_documentation
resolution_type: documentation_update
tags:
  - founder-use
  - field-feedback
  - d135
  - trigger-discipline
  - documentation-routing
---

# Route founder-use feedback without over-firing scope

## Context

The May 4 founder + Seb pair/net serving session produced a dense mix of signals: positive validation of the post-Tune-today build, repeated warmup/cooldown timing friction, a partner-side read-aloud inconvenience, and wishlist asks for glossary, video links, history, and trends.

The solved workflow was not to turn the strongest quotes into immediate implementation scope. The session was routed into durable documentation while preserving the repo's source-of-truth hierarchy and D135's boundary between observed content gaps and founder feature wishes.

Primary source documents:

- `docs/research/2026-05-04-pair-serving-session-feedback.md` holds the full F1-F11 field note, provenance, non-findings, and routing decisions.
- `docs/research/founder-use-ledger.md` holds the append-only D130 behavioral row.
- `docs/status/current-state.md` carries only the current-state and trigger-read summary.
- `docs/catalog.json` makes the new research note machine-discoverable.

A same-day session history pass confirmed this was intentional field-evidence intake, not a feature-scope trigger (session history: [May 4 Field Evidence Intake](110d561e-1ef7-4190-9723-fd119b920a42)).

## Guidance

Use a layered routing pattern for post-ship field feedback:

1. Put the detailed interpreted findings in a dated research note.
2. Append only the behavioral session row to the founder-use ledger.
3. Update current-state and catalog surfaces as concise pointers and trigger summaries.
4. Classify each finding before routing it.

The classification step is the load-bearing part:

- Positive validation stays validation, not new work.
- Repeated friction routes to an existing investigation track when one exists.
- Single-instance soft friction is captured but parked.
- Founder feature wishes are preserved as input, not trigger hits.
- Partner-walkthrough-class pull can update trigger reads without unlocking the work.

For the May 4 session, that meant:

- F1-F5 validated Tune today, main-skill duration hierarchy, per-move pacing clarity, and simpler drill copy.
- F6 strengthened the existing audio-pacing and segment-timing track, but stayed unresolved because the session did not disambiguate planned-duration overflow, audio reliability, or bonus-copy discoverability.
- F7 was captured as single-instance soft partner-side friction.
- F8 and F9 were routed to ideation/backlog under D135 founder-feature-wish framing.
- F10 and F11 were recorded as partner-walkthrough-class input for existing M001 Tier 2 history and M002 weekly-confidence surfaces, without flipping those gates.

## Why This Matters

Founder-use mode has a predictable failure mode: fresh real-use enthusiasm can blur into new canon or new scope. One session can contain genuine validation, unresolved defects, soft asks, and strategic pull at the same time.

Separating those signal types lets the repo keep the value without losing discipline. Research informs canon; it does not silently become canon. Trigger reads can be enriched without firing the trigger. Wishlist items can be remembered without becoming requirements.

The catalog and current-state updates also make the field read discoverable to future agents without forcing them to parse the full research note unless they need the detailed evidence.

## When to Apply

Apply this pattern after a dogfood session, partner walkthrough, voice memo, field export, or founder-use report when:

- the session happened against a real shipped build;
- the feedback mixes positives, frictions, and asks;
- some findings touch existing gates, milestones, or trigger conditions;
- the evidence is useful but not sufficient to start implementation;
- multiple docs need synchronized routing without changing decisions or scope.

Do not use this pattern as a substitute for a bug-track solution when a root cause has been confirmed and a fix has shipped. For example, May 4 F6 names plausible warmup/cooldown timing axes, but it does not prove which one caused the experience or ship a fix.

## Examples

Before:

> Seb asked for clickable glossary terms and YouTube links. Create requirements for glossary and video examples.

After:

> Record the asks as single-instance soft wishes under D135 founder-feature-wish framing. Preserve them for ideation, but do not author requirements from one prompted session.

Before:

> The partner wants to click past sessions. Build session history now.

After:

> Record the pull as partner-walkthrough-class behavioral input for the existing M001 Tier 2 full session history surface. Update trigger reads, but keep the gate: Tier 2 still depends on Tier 1a acceptance and Condition 3 pass.

Before:

> Warmup/cooldown timing felt off, so fix the timer.

After:

> Record candidate axes and require another session or targeted reproduction to disambiguate. The session strengthens the pacing track; it does not yet define a fix.

Before:

> Add all field notes directly to current-state.

After:

> Put full analysis in the dated research note, append the behavior row in the ledger, summarize only routing-critical posture in current-state, and index the research note in the catalog.

## Related

- `docs/research/2026-05-04-pair-serving-session-feedback.md`
- `docs/research/founder-use-ledger.md`
- `docs/status/current-state.md`
- `docs/catalog.json`
- `docs/plans/2026-04-30-001-feat-pre-run-simplification-plan.md`
