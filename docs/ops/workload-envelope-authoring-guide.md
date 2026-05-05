---
id: workload-envelope-authoring-guide
title: Workload Envelope Authoring Guide
status: active
stage: validation
type: ops
summary: "Decision guide for interpreting generated-plan workload envelope observations before catalog metadata, block-shape, source-backed content, U6 preview, or U8 redistribution work."
authority: "Authoring and review guidance for `durationMinMinutes`, `durationMaxMinutes`, and `fatigueCap.maxMinutes`; does not authorize catalog edits or runtime generator changes."
last_updated: 2026-05-01
depends_on:
  - docs/decisions.md
  - docs/specs/m001-session-assembly.md
  - docs/research/warmup-cooldown-minimum-protocols.md
  - docs/research/srpe-load-adaptation-rules.md
  - docs/reviews/2026-04-30-focus-coverage-gap-cards.md
  - docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md
---

# Workload Envelope Authoring Guide

## Purpose

Help maintainers, catalog authors, and agents decide what a generated-plan workload observation means before changing catalog metadata or generator behavior.

Generated observations are evidence for review. They are not permission to edit `durationMinMinutes`, `durationMaxMinutes`, `fatigueCap.maxMinutes`, block allocation, drill content, or runtime redistribution.

## Use This File When

- reviewing generated-plan compression lanes that route to U7
- deciding whether an observation is policy allowance, metadata review, block-shape review, source-depth candidate, U6 preview, U8 redistribution, or no action
- writing or reviewing future catalog proposals that touch workload metadata
- linking generated triage prompts to a stable decision rubric

## Not For

- authorizing source-backed drill additions
- changing `buildDraft()` or optional-slot redistribution policy
- building the U6 catalog impact preview
- replacing `D85`, `D105`, `docs/specs/m001-session-assembly.md`, or the source-backed gap-card process
- creating a full periodization or coaching methodology

## Current Snapshot

Source: `docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md`

The current generated triage workbench routes three compression lanes to this guide:

- Short-session cooldown minimum: 1 group, 87 affected cells
- Technique under-min review: 12 groups, 121 affected cells
- Workload envelope review: 19 groups, 106 affected cells

These counts are a snapshot. The policy below is stable until canon changes; the counts should be refreshed from the generated triage workbench.

## Decision Flow

1. Start from the compression lane, not from the row count.
2. Answer the lane's primary question.
3. Inspect the evidence layers in order.
4. Choose one candidate disposition.
5. Route follow-up work to no action, a gap card, U6, U8, or a separate implementation plan.
6. Record the disposition next to the relevant generated prompt or review note.

## Candidate Dispositions

- `accepted_policy_allowance`: The observation matches existing canon or an intentional product constraint. No implementation action yet.
- `metadata_review_needed`: The likely next action is a concrete review of workload metadata, but no value changes are authorized by this guide.
- `block_shape_review_needed`: The likely next action is to split, reshape, or reclassify a block in a separate plan.
- `source_depth_candidate`: The observation may indicate a content-depth gap, but source-backed gap-card rules apply first.
- `requires_U6_preview`: A concrete catalog or cap proposal exists and should be previewed before activation.
- `route_to_U8`: Redistribution evidence owns the next question; use U8 before changing catalog metadata.
- `no_implementation_action_yet`: The observation is known and non-blocking; revisit only if the generated evidence changes.

## Evidence Layers

Inspect these layers in order before choosing a disposition:

1. Generated trace and block allocation: did the selected block receive the time the archetype intended?
2. Archetype slot envelope: is the block's planned duration appropriate for the session length and slot type?
3. Variant workload and fatigue metadata: do `durationMinMinutes`, `durationMaxMinutes`, and `fatigueCap.maxMinutes` describe the variant honestly?
4. Structured segments and copy: do the drill steps and courtside copy match the metadata?
5. Source-backed content: would resolving the issue require new content, a new variant, or a source-backed activation manifest?

If redistribution evidence is present, keep the prompt routed to U8. This guide may document workload assumptions for U8 to consider, but it does not decide redistribution policy.

## Short-Session Cooldown Minimum

Primary question: does the wrap under-min observation conflict with canonical Downshift policy?

Start from `D85`, `D105`, and `docs/research/warmup-cooldown-minimum-protocols.md`:

- Downshift is about 2-3 minutes.
- It is framed as transition and comfort, not recovery or injury prevention.
- Stronger claims require new evidence; generated diagnostics do not reopen the policy by themselves.

Default disposition:

- Use `accepted_policy_allowance` when the prompt is only saying that a short Downshift block is below an authored minimum that is stricter than `D105`.
- Use `metadata_review_needed` when the drill metadata or copy implies a longer or stronger cooldown than Downshift canon supports.
- Use `block_shape_review_needed` only if the session archetype is allocating less time than the Downshift policy can defend.

Do not add a new cooldown drill from this lane alone.

## Technique Under-Min Review

Primary question: is the technique work intentionally short, or is it hiding a content-depth or block-shape gap?

Technique blocks can be short when they are crisp setup, cueing, or calibration work before the main skill. They become suspect when the same variant repeatedly cannot fill its authored minimum across supported setups, levels, or durations.

Default disposition:

- Use `accepted_policy_allowance` for intentional short-form technique reps that prepare the main block and match the drill copy.
- Use `metadata_review_needed` when the authored minimum is higher than the actual segment/cue structure supports.
- Use `block_shape_review_needed` when the block should be split, shortened, or moved into another slot type.
- Use `source_depth_candidate` only when the issue points to missing source-backed technique content, not just a metadata mismatch.

Before choosing `source_depth_candidate`, check `docs/reviews/2026-04-30-focus-coverage-gap-cards.md`. Content activation requires exact sources and a batch manifest.

## Workload Envelope Review

Primary question: are duration and fatigue envelopes honest for the selected allocation?

Non-redistribution over-cap and fatigue-cap observations are workload envelope questions first. They are not automatic cap-loosening instructions.

Default disposition:

- Use `metadata_review_needed` when the variant's max or fatigue cap appears stricter than the authored segments and session context justify.
- Use `block_shape_review_needed` when the same drill is being asked to fill a block that should be split, shortened, or routed to a different drill family.
- Use `requires_U6_preview` only after a concrete catalog or cap proposal exists.
- Use `no_implementation_action_yet` when the group is low-volume, already explained by known policy, or lacks enough evidence.

Consider `docs/research/srpe-load-adaptation-rules.md` only as background for conservative load posture. Do not turn these per-drill metadata observations into user-facing injury-risk or recovery claims.

## U6 And U8 Boundaries

Use U6 when there is a concrete catalog or cap proposal to preview:

- affected group keys
- changed catalog IDs
- proposed metadata/content delta
- expected generated-plan diagnostic delta
- source or gap-card evidence when content changes

Use U8 when optional-slot redistribution is part of the prompt. U7 can state workload assumptions that U8 should consider, but U7 must not reroute redistribution prompts or decide redistribution policy.

## Author Checklist

Before proposing a workload metadata change:

- Name the compression lane and group keys.
- Choose one candidate disposition.
- Identify the evidence layer that caused the observation.
- Check whether `D85`, `D105`, session assembly, or gap-card rules already decide the case.
- If changing content, attach source-backed evidence and a manifest path.
- If changing caps, route through a concrete proposal and U6 preview when available.
- If redistribution is involved, route to U8.
- If evidence is insufficient or conflicting, record that state instead of making a catalog edit.

## Action States

- Enough evidence: choose the candidate disposition and link the evidence.
- Insufficient evidence: keep the prompt unresolved and name the missing source or trace.
- Conflicting evidence: keep the prompt unresolved and name the conflicting canon or generated signal.
- Needs source-backed gap card: use `source_depth_candidate`; do not activate content.
- Needs U6 preview: use `requires_U6_preview`; wait for a concrete proposal.
- Route to U8: use `route_to_U8`; keep redistribution policy outside U7.
- No implementation action: use `no_implementation_action_yet`; revisit only when diagnostics change.

## Sources

- `D85` and `D105` in `docs/decisions.md`
- `docs/specs/m001-session-assembly.md`
- `docs/research/warmup-cooldown-minimum-protocols.md`
- `docs/research/srpe-load-adaptation-rules.md`
- `docs/reviews/2026-04-30-focus-coverage-gap-cards.md`
- `docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md`
