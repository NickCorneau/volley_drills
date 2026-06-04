---
id: research-briefs-index
title: "External research briefs (vendor-facing)"
type: research
status: active
stage: validation
authority: "Index of standalone research briefs formatted for external research vendors who have no prior context on the product. Each brief is self-contained, uses no internal jargon (no tier names, decision IDs, internal personas, or plan references), and specifies deliverables a vendor can execute against without follow-up clarification."
summary: "Folder for vendor-ready research briefs and their returned responses. Each brief is a single self-contained document that can be copied directly into a vendor engagement. Returned vendor responses are filed verbatim under `./responses/` and distilled into curated research notes under `docs/research/`. Briefs are dated by authoring date and are not revised in place once sent — a revised scope ships as a new brief with a new date."
last_updated: 2026-05-27
---

# External research briefs

This folder holds research briefs written for external research vendors. Each brief is a standalone document — a vendor can read it and start work without any other project context.

## Authoring conventions

- **No internal jargon.** Briefs contain no tier names (Tier 1a, Tier 2), no decision IDs (D91, D130), no internal personas, no plan references, no code type names. Anything a reader needs is explained inline.
- **Self-contained.** A brief lists its own priority sources, its own deliverable shape, its own scope constraints, and its own success criteria. It does not assume the vendor will consult other files in this repository.
- **Named by date and topic.** `YYYY-MM-DD-brief-<topic>.md`. Dated by authoring date.
- **Revised by replacement, not edit.** If a brief needs substantive revision after it has been sent to a vendor, ship a new brief with a new date rather than editing the sent one in place. Preserves what was asked versus what was delivered.

## Response-handling conventions

- **Verbatim storage.** Returned vendor responses are filed verbatim under `./responses/` with the shape `YYYY-MM-DD-<topic>-vendor-<n>.md`, where `<topic>` matches the brief's topic slug and `<n>` is a monotonic per-topic vendor index (`vendor-1`, `vendor-2`, ...). The file frontmatter carries `status: verbatim`, `responds_to:` pointing to the brief, and `distilled_in:` pointing to the curated synthesis note that absorbs the findings.
- **Curated synthesis.** One curated research note in `docs/research/` per topic absorbs findings from all vendor responses to that topic. Structure that note with per-vendor evidence ladders plus a Reconciliation section so additional responses fold in without rewriting. Example: the skill-correlation topic's synthesis lives at [`docs/research/skill-correlation-amateur-beach.md`](../skill-correlation-amateur-beach.md).
- **No in-place edits of verbatim files.** If a vendor submits a revised response, it ships as a new `-vendor-<n>-revised-<date>.md` file; the original is preserved. Mirrors the brief's own revision-by-replacement rule.
- **Redact vendor identifiers before external share.** Internal files keep `vendor-1` / `vendor-2` identifiers so reconciliation reads unambiguously. External shares must redact.

## Current briefs

| Date | Topic | Status | Responses |
| --- | --- | --- | --- |
| 2026-04-22 | [Per-skill baseline skill assessments for amateur beach volleyball](./2026-04-22-brief-per-skill-baseline-tests.md) | Sent; vendor 1 + vendor 2 + vendor 3 returned 2026-04-22 | [vendor 1](./responses/2026-04-22-per-skill-baseline-tests-vendor-1.md), [vendor 2](./responses/2026-04-22-per-skill-baseline-tests-vendor-2.md), [vendor 3](./responses/2026-04-22-per-skill-baseline-tests-vendor-3.md) — reconciled in [`docs/research/baseline-skill-assessments-amateur-beach.md`](../baseline-skill-assessments-amateur-beach.md) |
| 2026-04-22 | [Cross-skill correlation in amateur beach volleyball skill development](./2026-04-22-brief-skill-correlation.md) | Sent; vendor 1 + vendor 2 + vendor 3 returned 2026-04-22 | [vendor 1](./responses/2026-04-22-skill-correlation-vendor-1.md), [vendor 2](./responses/2026-04-22-skill-correlation-vendor-2.md), [vendor 3](./responses/2026-04-22-skill-correlation-vendor-3.md) — reconciled in [`docs/research/skill-correlation-amateur-beach.md`](../skill-correlation-amateur-beach.md) |
| 2026-04-22 | [Jump-float serve biomechanics and amateur introduction protocols](./2026-04-22-brief-jump-float.md) | Sent; vendor 1 + vendor 2 + vendor 3 returned 2026-04-22 | [vendor 1](./responses/2026-04-22-jump-float-vendor-1.md), [vendor 2](./responses/2026-04-22-jump-float-vendor-2.md), [vendor 3](./responses/2026-04-22-jump-float-vendor-3.md) — reconciled in [`docs/research/jump-float-amateur-beach.md`](../jump-float-amateur-beach.md) |
| 2026-05-27 | [Single self-tracked metric most predictive of adherence and improvement in amateur skill-sport athletes](./2026-05-27-brief-single-tracked-metric-amateur-skill-apps.md) | Sent; vendor 1 + vendor 2 + vendor 3 returned 2026-06-02 | [vendor 1](./responses/2026-06-02-single-tracked-metric-amateur-skill-apps-vendor-1.md), [vendor 2](./responses/2026-06-02-single-tracked-metric-amateur-skill-apps-vendor-2.md), [vendor 3](./responses/2026-06-02-single-tracked-metric-amateur-skill-apps-vendor-3.md) — reconciled in [`docs/research/single-tracked-metric-amateur-skill-apps.md`](../single-tracked-metric-amateur-skill-apps.md) |
| 2026-05-27 | [Construct validity of weekly self-rated skill confidence for adult recreational amateurs](./2026-05-27-brief-subjective-skill-confidence-validity.md) | Sent; vendor 1 + vendor 2 + vendor 3 returned 2026-06-02 | [vendor 1](./responses/2026-06-02-subjective-skill-confidence-validity-vendor-1.md), [vendor 2](./responses/2026-06-02-subjective-skill-confidence-validity-vendor-2.md), [vendor 3](./responses/2026-06-02-subjective-skill-confidence-validity-vendor-3.md) — reconciled in [`docs/research/subjective-skill-confidence-validity.md`](../subjective-skill-confidence-validity.md) |
| 2026-05-27 | [Translation of coach-presence pedagogy techniques to self-administered training apps](./2026-05-27-brief-coach-pedagogy-translation-self-coached.md) | Sent; vendor 1 + 2 + 3 returned 2026-06-02 | [vendor 1](./responses/2026-06-02-coach-pedagogy-translation-self-coached-vendor-1.md), [vendor 2](./responses/2026-06-02-coach-pedagogy-translation-self-coached-vendor-2.md), [vendor 3](./responses/2026-06-02-coach-pedagogy-translation-self-coached-vendor-3.md) — reconciled in [`docs/research/coach-pedagogy-translation-self-coached.md`](../coach-pedagogy-translation-self-coached.md) |
| 2026-05-27 | [Carry-forward UX patterns and main-tool-conversion mechanisms in self-coached training apps](./2026-05-27-brief-carry-forward-and-main-tool-conversion.md) | Draft (ideation survivor #4; not yet sent) | — |
| 2026-05-27 | [Pair-coupling effects on adherence and retention in recreational adult skill-sport](./2026-05-27-brief-pair-coupling-adherence-recreational-skill-sport.md) | Draft (ideation survivor #5; not yet sent) | — |
| 2026-05-27 | [Periodization signal at 1-3 sessions/week for amateur skill-sport (or below noise floor)](./2026-05-27-brief-periodization-low-volume-amateur-skill-sport.md) | Sent; vendor 1 + vendor 2 + vendor 3 returned 2026-06-02 | [vendor 1](./responses/2026-06-02-periodization-low-volume-amateur-skill-sport-vendor-1.md), [vendor 2](./responses/2026-06-02-periodization-low-volume-amateur-skill-sport-vendor-2.md), [vendor 3](./responses/2026-06-02-periodization-low-volume-amateur-skill-sport-vendor-3.md) — reconciled in [`docs/research/periodization-low-volume-amateur-skill-sport.md`](../periodization-low-volume-amateur-skill-sport.md) |

## For agents

- **Authoritative for**: vendor-facing brief inventory, authoring conventions, and response-handling conventions (where verbatim responses live and how synthesis notes absorb them).
- **Edit when**: a new brief is authored (add a row to the Current briefs table); a brief is sent to a vendor (update status); a vendor returns findings (file the verbatim response under `./responses/`, link it in the Responses column, and ensure a curated synthesis note exists at `docs/research/<topic>.md`).
- **Belongs elsewhere**: internal research findings and synthesis (`docs/research/`), plan documents (`docs/plans/`), decisions (`docs/decisions.md`).
- **Key pattern**: briefs are outbound artifacts; `./responses/` is the inbound mirror; `docs/research/<topic>.md` is the repo-facing distillation. The three layers stay separate so "what was asked", "what was delivered", and "what we concluded" are each independently auditable.
