---
id: research-index
title: Research Notes Index
status: active
stage: planning
type: index
authority: research-note routing, note selection guidance, and AI-native research-note conventions
summary: "Fast-path routing for research notes; selection rules and AI-native conventions."
last_updated: 2026-04-12
depends_on:
  - docs/README.md
  - docs/catalog.json
  - docs/ops/agent-documentation-contract.md
---

# Research Notes Index

## Agent Quick Scan

- Use this doc to route into the narrowest curated research note for the current question.
- Not this doc for product canon, milestone scope, or raw provenance; use `docs/vision.md`, `docs/decisions.md`, `docs/prd-foundation.md`, or `research-output/` as appropriate.
- If a curated research note is added, renamed, or materially rerouted, update this file and `docs/catalog.json` in the same pass.

## Purpose

Help humans and agents choose the narrowest research note that answers the current question.

Research notes inform canon. They do not outrank `docs/decisions.md`, `docs/prd-foundation.md`, `docs/roadmap.md`, or the milestone/spec docs.

## Use This File When

- a task needs supporting evidence or prior research
- you want the narrowest research note instead of reading the whole research folder
- you are deciding whether a finding belongs in canon or should stay as research input

## Not For

- replacing canonical product or milestone docs
- broad product routing outside the research folder
- mining raw provenance directly when curated research already exists

## Update When

- a new curated research note is added
- the best narrow note for a question changes
- note-selection rules or AI-native research conventions change

## Machine Contract

- `docs/research/README.md` is the prose router for curated research.
- `docs/catalog.json` contains the machine-readable research routing table.
- `docs/ops/agent-documentation-contract.md` defines the cross-surface rules for routing docs and machine-scannable structure.
- If a new research note is added or a note's role changes, update both in the same pass.

## Change Propagation

- New curated research note or renamed note path: update this file and `docs/catalog.json`.
- Note-selection rules or research-routing guidance changed: update this file first, then sync `docs/catalog.json` if the machine routing table also changed.
- Docs-wide agent-routing conventions changed: update `docs/ops/agent-documentation-contract.md` first, then align this file if its routing language or structure should change.

## Fast Path

- Need broad product, wedge-choice, training-content, metrics, or competitor context:
  - `docs/research/beach-training-resources.md`
- Need narrowed outdoor UI defaults for M001:
  - `docs/research/outdoor-courtside-ui-brief.md`
- Need iPhone / PWA platform constraints, update safety, or storage durability guidance:
  - `docs/research/local-first-pwa-constraints.md`
- Need timer, transition, or interruption-recovery patterns for run mode:
  - `docs/research/courtside-timer-patterns.md`
- Need quality strategy, testing layers, or trust invariants for M001:
  - `docs/research/m001-testing-quality-strategy.md`
- Need Dexie schema, persistence, migration, or IndexedDB project-structure guidance:
  - `docs/research/dexie-schema-and-architecture.md`
- Need synthesized v0a prototype feedback, retest evidence, or prioritized pre-field-test backlog:
  - `docs/research/2026-04-12-v0a-runner-probe-feedback.md`

## Selection Rules

- Start with the narrowest note that fits the question.
- Move up to broader notes only when the focused note does not answer the question.
- If canon already exists for the topic, update canon rather than hiding durable decisions only in research.
- Do not mine `research-output/` directly unless you are curating new findings that are not yet represented in `docs/research/`.

## Notes

| File | Use when | Canon impact |
|---|---|---|
| `docs/research/beach-training-resources.md` | broad training/product research, wedge choice, metrics, competitors, drill references | informs vision, PRD, roadmap, decisions |
| `docs/research/outdoor-courtside-ui-brief.md` | theme, contrast, type scale, touch targets, information density | informs decisions, PRD courtside UX, M001 run/review specs |
| `docs/research/local-first-pwa-constraints.md` | iPhone web constraints, install posture, update safety, storage durability | informs decisions, M001 connectivity/run behavior, milestone realism |
| `docs/research/courtside-timer-patterns.md` | countdown model, auto-advance, wake lock, interruption recovery | informs M001 run-flow behavior |
| `docs/research/m001-testing-quality-strategy.md` | testing stack, trust invariants, update-safe verification strategy | informs implementation planning and quality expectations |
| `docs/research/dexie-schema-and-architecture.md` | Dexie schema shape, migrations, persistence design, DB structure | informs implementation planning, persistence architecture, migration safety |
| `docs/research/2026-04-12-v0a-runner-probe-feedback.md` | living synthesis of v0a runner-probe UX feedback, browser retest evidence, docs drift, and stable backlog IDs | informs pre-field-test fixes, doc hygiene, and v0b planning |

## AI-Native Conventions For Future Research Notes

- Use YAML frontmatter with at least `id`, `title`, `status`, `stage`, and `type`.
- Add `authority`, `last_updated`, and `depends_on` when they clarify how the note should be used.
- Include a short `Purpose` section and an explicit `Use This Note When` section.
- For decision-shaping research, prefer explicit sections such as `Freeze Now`, `Validate Later`, `Apply To Current Setup`, and `Open Questions`.
- Add cross-links to narrower or broader notes so future agents can route themselves quickly.
- When adding or renaming a curated research note, update this file and `docs/catalog.json` in the same pass so it becomes discoverable.
