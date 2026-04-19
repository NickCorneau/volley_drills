---
id: research-index
title: Research Notes Index
status: active
stage: planning
type: index
authority: research-note routing, note selection guidance, and AI-native research-note conventions
summary: "Fast-path routing for research notes; selection rules and AI-native conventions."
last_updated: 2026-04-19
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
- Need a calm, restrained, Japanese-inspired visual direction experiment for future UI work:
  - `docs/research/japanese-inspired-visual-direction.md`
- Need iPhone / PWA platform constraints, the 2026 three-layer storage-durability model, three-state save copy, the real-device test protocol, or update-safety guidance (sharpens `D57`; seeds `D118`, `O18`):
  - `docs/research/local-first-pwa-constraints.md`
- Need timer, transition, or interruption-recovery patterns for run mode:
  - `docs/research/courtside-timer-patterns.md`
- Need quality strategy, testing layers, or trust invariants for M001:
  - `docs/research/m001-testing-quality-strategy.md`
- Need layer-by-layer depth-of-investment guidance, the `fake-indexeddb` trust boundary, or the "what to defer" list for the pre-field test stack:
  - `docs/research/minimum-viable-test-stack.md`
- Need Dexie schema, persistence, migration, or IndexedDB project-structure guidance:
  - `docs/research/dexie-schema-and-architecture.md`
- Need synthesized v0a prototype feedback, retest evidence, or prioritized pre-field-test backlog:
  - `docs/research/2026-04-12-v0a-runner-probe-feedback.md`
- Need the Phase 1.5 periodization vocabulary stub (PoST framework) for multi-week planning (`O2`):
  - `docs/research/periodization-post-framework.md`
- Need the minimum-attempt and self-scoring-bias evidence behind the binary-score progression gate (`D80`, `D104`, `O12`):
  - `docs/research/binary-scoring-progression.md`
- Need the evidence base and interpretive framing for the `D91` M001 go/no-go retention gate:
  - `docs/research/d91-retention-gate-evidence.md`
- Need the operational definition of "solo" environment, default archetype, or wall-access posture (resolves `O4`):
  - `docs/research/solo-training-environments.md`
- Need the evidence base for safety-gate placement, first-run screen count, or progressive profiling (`O11`, `O16`):
  - `docs/research/onboarding-safety-gate-friction.md`
- Need the cross-jurisdiction regulatory posture for the pain-gate + deterministic load rule + stop/seek-help bundle, or the avoid-phrases list that protects `D86`:
  - `docs/research/regulatory-boundary-pain-gated-training-apps.md`
- Need the evidence base and ship-ready defaults for the mandatory warm-up and cool-down blocks (`D85`, Beach Prep Two/Three/Five, Downshift framing):
  - `docs/research/warmup-cooldown-minimum-protocols.md`
- Need the evidence base for the coach-facing business model (BYOC-lite vs centralized expert vs marketplace) and the paid coach premium question (`D19`, `D72`, `D73`, `D75`, `D106`, `D107`, `D108`, `O1`):
  - `docs/research/coach-facing-business-models.md`
- Need the evidence base for the "prescriptive default + bounded escape hatches" posture, the six structured-feedback patterns that tie into deterministic replanning, or the AI-as-explainer wiring (seeds `O17`, sharpens `V0B-11`):
  - `docs/research/prescriptive-default-bounded-flex.md`
- Need the post-ACWR evidence base behind the deterministic sRPE-load engine's operating bands, minimum-history phases, or precedence-ordered rule table (sharpens `D84`; seeds `D113`):
  - `docs/research/srpe-load-adaptation-rules.md`
- Need the operational posture on persistent team identity for beach pairs, the forward-compatible participant/consent schema, or the graduation gate before a first-class `Team` object ships (resolves `O13`; seeds `D114`–`D117`):
  - `docs/research/persistent-team-identity.md`
- Need the operational protocol for running the M001 14-day validation cohort (recruitment / consent scripts, per-use micro-log and session-ledger schema, three signal-based pulses, 72-hour non-returner probe, preregistered decision memo, and the 5-page evidence packet):
  - `docs/research/pre-telemetry-validation-protocol.md`

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
| `docs/research/japanese-inspired-visual-direction.md` | calm, restrained, Japanese-inspired visual direction experiments; spacing, focal hierarchy, pacing, and anti-cliche guardrails | informs future UI experiments; does not override the outdoor readability contract |
| `docs/research/local-first-pwa-constraints.md` | iPhone web constraints, install posture, update safety, three-layer storage-durability model (ITP 7-day timer / Home Screen carveout / quota-pressure eviction + heuristic persistent mode), three-state save copy, real-device test protocol | informs decisions, M001 connectivity/run behavior, milestone realism; sharpens `D57`; seeds `D118` and `O18` |
| `docs/research/courtside-timer-patterns.md` | countdown model, auto-advance, wake lock, interruption recovery | informs M001 run-flow behavior |
| `docs/research/m001-testing-quality-strategy.md` | testing stack, trust invariants, update-safe verification strategy | informs implementation planning and quality expectations |
| `docs/research/minimum-viable-test-stack.md` | per-layer depth of investment, `fake-indexeddb` trust boundary, trust-invariants -> owning-layer map, deliberate under-investment list | sharpens `docs/specs/m001-quality-and-testing.md`; flags two concrete config gaps (Playwright against built app; per-test `IDBFactory` isolation) |
| `docs/research/dexie-schema-and-architecture.md` | Dexie schema shape, migrations, persistence design, DB structure | informs implementation planning, persistence architecture, migration safety |
| `docs/research/2026-04-12-v0a-runner-probe-feedback.md` | living synthesis of v0a runner-probe UX feedback, browser retest evidence, docs drift, and stable backlog IDs | informs pre-field-test fixes, doc hygiene, and v0b planning |
| `docs/research/periodization-post-framework.md` | Phase 1.5 stub mapping Otte's PoST stages (Coordination -> Skill Adaptability -> Performance) onto our archetypes and adaptation rules | informs `O2` multi-week planning when activated; no M001 scope |
| `docs/research/d91-retention-gate-evidence.md` | evidence base and interpretive framing for the `D91` M001 go/no-go retention gate; kill-floor vs go-bar split and novelty-effect enrichment signals | informs `D91` rationale, `O5`, and the Phase 0 wedge-validation decision gate |
| `docs/research/solo-training-environments.md` | where amateur beach players actually do solo work, why wall access is not a safe default, and how that shapes archetype defaults and drill inventory | resolves `O4` operationally; seeds `D102` and `D103`; flags code corrections in archetype selector and presets |
| `docs/research/onboarding-safety-gate-friction.md` | public evidence on first-run screen count, standalone vs folded safety-gate placement, progressive profiling, and live-app safety analogues (Fitbod, Runna) in health/fitness apps | strengthens `D43`, `D44`, `D45`, `D82`, `D83`, `D92`; sharpens `O11`; seeds `O16` |
| `docs/research/binary-scoring-progression.md` | minimum scored-contact threshold, self-scoring bias direction and magnitude, and comparable-product patterns for the binary progression gate | sharpens `D80` via `D104` operational rules; keeps `O12` open for field validation |
| `docs/research/regulatory-boundary-pain-gated-training-apps.md` | cross-jurisdiction regulatory posture (US / EU / UK / Canada / Australia) for the pain-gate + deterministic load rule + stop/seek-help bundle; avoid-phrases list; copy-audit findings for `PainOverrideCard`, `services/session.ts`, and `SafetyCheckScreen` | strengthens `D86`; sharpens `O7`; reinforces `D6`, `D11`, `D18`, `D21`, `D23`, `D83`, `D88` |
| `docs/research/warmup-cooldown-minimum-protocols.md` | evidence base and ship-ready defaults for the mandatory warm-up and cool-down blocks in short (10–25 min) beach sessions; Beach Prep Two/Three/Five and Downshift framing | sharpens `D85`; seeds `D105`; flags code-alignment updates in `app/src/data/archetypes.ts`, `app/src/data/drills.ts`, and `docs/specs/m001-session-assembly.md` |
| `docs/research/coach-facing-business-models.md` | comparative evidence on coach-first SaaS, BYOC-lite, centralized expert, and hybrid marketplace shapes across TrueCoach, TrainHeroic, TeamBuildr, Future, Caliber, CoachNow, Everfit, ABC Trainerize, TrainerRoad, Coach's Eye, Hudl, BridgeAthletic; adjacent sport reads (soccer, volleyball, climbing, racket sports) | flips `O1` lean from centralized-expert to BYOC-lite; seeds `D106`, `D107`, `D108`; moves "centralized coach marketplace / platform-sourced coach network" to ruled-out; reshapes Phase 1.5 coach clipboard scope and demotes the Phase 2 P2 marketplace entry |
| `docs/research/prescriptive-default-bounded-flex.md` | public evidence on "opinionated default + bounded escape hatches" vs locked plans (Zwift) vs empty scaffolding (Hevy); six structured-feedback patterns; AI-as-explainer wiring with deterministic reason trace | reinforces `D6`, `D11`, `D20`, `D21`, `D37`, `D43`–`D46`, `D74`, `D98`; sharpens `V0B-11` wording; seeds `O17` |
| `docs/research/srpe-load-adaptation-rules.md` | post-ACWR literature synthesis for the deterministic sRPE-load engine: `baseline3` + `peak30` + rolling-14-day variables, precedence-ordered rule table, minimum-history phases, and the +5-10% / +10-15% / +20% bands tuned for amateur 1-3 sessions/week skill-dominant use | sharpens `D84`; seeds `D113`; retires the pre-2024 "~20-30% week-to-week cap" placeholder in `docs/specs/m001-adaptation-rules.md` |
| `docs/research/persistent-team-identity.md` | comparative evidence on solo-first pair-sport consumer apps (SwingVision, PB Vision, UTR, PickleGo, Pickleball Stats Tracker, U-Stat) vs team-first apps (UltiAnalytics, The Rowing App, Balltime, Stat Together, Steazzi); HCI and adherence literature on shared accounts, breakup UX, and partner/team incentives; local-first collaboration literature (Kleppmann, Ink & Switch, Automerge, Keyhive); forward-compatible participant / profile / consent schema | resolves `O13` operationally; seeds `D114`, `D115`, `D116`, `D117`; reinforces `D19`, `D27`, `D29`, `D36`, `D72`, `D73`, `D75`, `D101` |
| `docs/research/pre-telemetry-validation-protocol.md` | operational protocol for the M001 14-day validation cohort — recruitment / consent scripts, per-use micro-log and session-ledger schema (with confidence flag and separate researcher-interpretation column), three signal-based pulses (days 3/7/11), 72-hour non-returner probe, preregistered one-page decision memo, role separation and readout-ordering rules, and the 5-page evidence packet | operationalizes `D91`'s banded reading and enrichment-signal framework; cross-linked from `docs/discovery/phase-0-wedge-validation.md`; no D-number changes |

## AI-Native Conventions For Future Research Notes

- Use YAML frontmatter with at least `id`, `title`, `status`, `stage`, and `type`.
- Add `authority`, `last_updated`, and `depends_on` when they clarify how the note should be used.
- Include a short `Purpose` section and an explicit `Use This Note When` section.
- For decision-shaping research, prefer explicit sections such as `Freeze Now`, `Validate Later`, `Apply To Current Setup`, and `Open Questions`.
- Add cross-links to narrower or broader notes so future agents can route themselves quickly.
- When adding or renaming a curated research note, update this file and `docs/catalog.json` in the same pass so it becomes discoverable.
