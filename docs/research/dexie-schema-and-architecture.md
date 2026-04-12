---
id: dexie-schema-and-architecture
title: Dexie Schema and Architecture Guidance
status: active
stage: planning
type: research
authority: Dexie schema shape, persistence boundaries, migration guidance, and IndexedDB implementation guardrails
summary: "Dexie schema shape, persistence design, migration guidance, and IndexedDB guardrails."
last_updated: 2026-04-12
depends_on:
  - docs/prd-foundation.md
  - docs/research/local-first-pwa-constraints.md
related:
  - docs/research/README.md
  - docs/research/m001-testing-quality-strategy.md
---

# Dexie Schema and Architecture Guidance

## Purpose

Capture Dexie-specific schema, indexing, reactivity, migration, and project-structure guidance for M001 implementation. This is implementation-level detail that supplements the canonical data contracts in `docs/prd-foundation.md` and the platform constraints in `docs/research/local-first-pwa-constraints.md`.

## Use This Note When

- you need to design or review IndexedDB / Dexie tables, migrations, or write boundaries
- you need to decide how session plans, active runs, reviews, and app state should persist locally
- you need Dexie-specific detail that is too implementation-level for the PRD or milestone specs

## Recommended M001 schema shape

Design principle: embed blocks/steps in the Session plan (simple, single-read for courtside), but store run/progress separately (so "Next step" doesn't rewrite a large document and doesn't repaint the whole sessions list).

### Tables

**`app`** (singleton configuration and pointers)
- `key` (PK, string; e.g., `"activeSessionId"`, `"installNudgedAt"`)
- `value` (structured JSON)

**`user`** (singleton)
- `id` (PK, string; constant like `"local"`)
- `skillLevel` (`"beginner" | "intermediate"`)
- `handedness` (optional)
- `constraints` (e.g., "usually solo", available ball count, time budget)

**`drills`** (template library; curated + user-edited later)
- `id` (PK, string)
- `skillTags` (array of strings; e.g., `["passing", "serve-receive"]`)
- `difficulty` (enum)
- `modes` (array: `["solo", "pair"]`)
- `equipment` (array: `["ball", "cones"]`)
- `steps` (array of instruction/timer/scoring items)
- `source` (built-in vs user-created)

**`sessionTemplates`** (optional in M001; can be compiled into app bundle)
- `id` (PK, string)
- `skillFocus` (string)
- `difficulty`
- `blocks` (array referencing drill IDs + parameters)
- `generatorVersion` (string)

**`sessions`** (the plan the user finalizes and runs)
- `id` (PK, string)
- `createdAt`, `updatedAt` (numbers or ISO strings)
- `scheduledFor` (optional)
- `startedAt`, `endedAt` (optional)
- `status` (`"draft" | "ready" | "in_progress" | "completed" | "abandoned"`)
- `focus` (e.g., `"passing/serve-receive"`)
- `context` snapshot (wind/conditions, solo/pair, time budget)
- `plan` (embedded blocks/steps with local IDs)
- `provenance` (template IDs used, human edits flag, rationale text snippets)

**`sessionRuns`** (durable checkpointing for an in-progress session)
- `sessionId` (PK = sessionId)
- `state` (`"active" | "paused" | "done"`)
- `currentBlockIdx`, `currentStepIdx`
- `startedAt`, `lastCheckpointAt`
- `completedStepIds` (array or set-like structure)
- `timer` minimal snapshot (optional: `stepEndsAt`)

**`sessionReviews`** (fast post-session review)
- `sessionId` (PK = sessionId)
- `completedAt`
- `outcome` (`"progress" | "hold" | "deload"`)
- `sessionRpe` (0-10)
- `notesTags` (array: "windy", "fatigue", "shoulder sore", etc.)
- `freeformNote` (optional)

### Why this shape

- Generate a session from templates/drills, let the user edit, then run with minimal reads (one session fetch + a live run pointer).
- Checkpoint progress for crash/resume without building a full event-sourcing system.
- Adapt next session using "last N sessions by focus" plus the review outcome and RPE.
- Aligns with the canonical plan/execution/review separation in `docs/prd-foundation.md`.

### Mapping to PRD object model

| PRD object | Schema table | Notes |
|---|---|---|
| Session | `sessions` | Plan snapshot with embedded blocks |
| SessionBlock | Embedded in `sessions.plan` | Simpler for M001 than a separate table |
| SessionRunState | `sessionRuns` | Separate to avoid rewriting session on every tap |
| SessionReview | `sessionReviews` | Separate for adaptation queries |
| Drill | `drills` | Template library |
| TrainingContext | `sessions.context` | Snapshot at session creation time |
| AdaptationState | Derived from last N `sessionReviews` | No separate table needed in M001 |

## Indexing strategy

Dexie indexing is about query shapes you know you'll need. Each index adds write overhead and migration complexity. Only declare properties you intend to query against.

### sessions

- Primary key: `id` (string)
- Secondary: `createdAt`, `startedAt`, `status`, `focus`
- Compound: `[focus+startedAt]` — supports "find last 3 passing sessions" for adaptation
- Optional compound: `[status+startedAt]` — supports "show recent completed" vs "drafts"

### sessionRuns

- Primary key: `sessionId`
- Secondary: `state`, `lastCheckpointAt`
- Optional: `[state+lastCheckpointAt]` — supports "resume active session" and "cleanup stale runs"

### sessionReviews

- Primary key: `sessionId`
- Secondary: `completedAt`, `outcome`
- Optional compound: `[outcome+completedAt]` — for simple reporting later

### drills

- Primary key: `id`
- MultiEntry: `*skillTags`, `*modes` (for "solo drills only" queries)
- Secondary: `difficulty`

### Compound index limitation

A compound index cannot be multiEntry in IndexedDB. Do not expect `[difficulty+*skillTags]` to work. For M001's small drill library, filter in-memory after a multiEntry lookup. Derived fields or join tables are a later optimization if the library grows significantly.

## `useLiveQuery` patterns

`useLiveQuery` is sufficient as the primary read model for M001 if subscriptions are scoped carefully.

### Where it works well

- Session list (limited results)
- Session detail fetch by ID
- Active session run pointer

### Where it breaks down

- Subscribing to large arrays that change frequently (e.g., `toArray()` on sessions while writing progress to the same table)
- Highly derived joins that require multiple queries

### Mitigation: "IDs first, details second"

Subscribe to a stable list of IDs using Dexie's `primaryKeys()` for collections, then render each row with its own `useLiveQuery(() => table.get(id))`. This avoids "whole list re-renders because one row changed."

### When to consider Zustand or Jotai

Overkill in M001 if the only global state is the active session runner (a route-level provider/context handles that). Warranted when either:
1. Global ephemeral state spans multiple routes without prop drilling (e.g., session runner mini-player + drill library overlay)
2. Complex reactive derived state needs memoized selectors not tied to Dexie query lifecycles

## Schema versioning and migration stance

Use additive migrations only for M001, with disciplined version bumps.

- Dexie's `db.version(n).stores(...)` declares schema changes, with `upgrade()` hooks for data transforms.
- Keep historical versions with upgraders as long as users may have them installed.
- Avoid "reshape everything" migrations early. Prefer adding new fields/tables and leaving old data readable.
- If sync is added later, client-side migrations become much harder. Dexie Cloud guidance discourages `Version.upgrade()` for synced tables and suggests export/import style migrations. The underlying point is credible even without Dexie Cloud.

## State management boundaries

### Dexie (durable, must survive reload / app switch)

- Session plan once finalized
- Active run checkpoint at block/step changes, pause/resume, and completion
- Review outcome, sRPE, and tags
- Active session pointer in `app` table for crash resume

### React transient state (ephemeral UI, don't persist)

- Glare mode toggle, font-size toggle
- Local edit-draft form state (commit to Dexie only on confirm)
- Timer UI details (persist minimal checkpoint times periodically)
- Accordion open/closed, "show teaching points" toggles

## Recommended project structure

Feature-first with a thin db layer, not a generic repository abstraction.

```
src/app/         — router setup, top-level providers, install/persistence prompts, global styles
src/db/          — Dexie instance, schema declaration, migrations, seed/import of built-in drills
src/features/
  sessions/
    new/         — context capture + generation
    edit/
    run/
    review/
    types.ts     — Session, SessionRun, SessionReview domain types
  drills/
    list/detail components, drill rendering shared with sessions
src/shared/
  ui/            — primitives optimized for sun/sweat (big buttons, contrast)
  utils/         — id/date utilities
  offline/       — storage persistence check, quota diagnostics
```

## Sources

- Dexie docs: Version.stores() and schema syntax
- Dexie docs: compound indexes and compound primary keys
- Dexie docs: multiEntry index limitations
- Dexie docs: useLiveQuery()
- Dexie docs: Dexie.on.blocked
- Dexie docs: Dexie.QuotaExceededError
- Dexie docs: IndexedDB on Safari / Safari issues
- Dexie Cloud best practices (forward-sync evidence for ID strategy)
- MDN: IDBTransaction (transaction inactivity between tasks)
- React Router official docs (routing/layout routes)

## Related docs

- `docs/prd-foundation.md` — canonical object model and local-first contracts
- `docs/research/local-first-pwa-constraints.md` — platform-level PWA constraints
- `docs/research/courtside-timer-patterns.md` — timer and interruption recovery patterns
- `docs/specs/m001-courtside-run-flow.md` — user-visible run flow
