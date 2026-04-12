# Local-first Beach Volleyball Training PWA M001 Research Report

## Executive summary

The biggest existential risk in M001 isn't "AI," analytics, or even the drill library. It's **trust + retention under mobile/PWA storage realities**. If you ship a local-only beach training tool that silently loses data on iOS Safari after a short inactivity window, you will burn early users and poison word-of-mouth. Safari has a well-documented **7-day cap on "script-writable storage" (including IndexedDB and Cache API) for sites the user doesn't actively revisit**, and this cap **does not apply to installed PWAs added to the home screen**—meaning your product's reliability is tightly coupled to install behavior.

From the sport side, the biggest product assumption to challenge is the proposed wedge: **"solo-first serve-receive."** Major, credible drill resources repeatedly describe "passing/serve-receive" work as inherently requiring at least a server/feeder or partner—many "minimum participant" definitions are effectively *not solo*. For example, the FIVB drill book lists passing drills where the minimum is "1 athlete + coach assisting/participating," not truly solo. If you can't deliver a believable solo loop, you'll need either (a) a more honest "solo + wall/partner when available" framing, or (b) a pivot of initial skill focus toward something structurally solo (serving, footwork/movement, or controlled self-toss passing objectives).

On the architecture question (React + TS + Dexie local-first), desk research supports a clear direction for M001:

- Model **Session Plan** (what to do) separately from **Session Run state** (where you are right now) to survive refreshes/backgrounding without writing constantly. This aligns with IndexedDB transaction realities and mobile interruptions.
- Use **string IDs (UUID/ULID/UUIDv7)** now, not auto-increment, if you want any plausible future sync/story without rewriting everything. Dexie's own sync-oriented best practices explicitly discourage `++id` for globally-unique requirements.
- Use **embedded blocks inside Session** for M001 simplicity, but keep **progress/events** separate. Embedded is simplest for an end-to-end session loop; separate progress avoids rewriting the whole session document on every "Next" tap. (This is an inference based on Dexie indexing/query constraints + live-query reactivity costs.)
- `useLiveQuery` is sufficient as your primary read model *if you scope subscriptions carefully* (IDs first, details second) and avoid "subscribe to everything" patterns that re-render on every write. Dexie documents the reactivity model and constraints; the practical performance pattern is to subscribe to key lists/limited ranges rather than large arrays.

## Key findings with confidence levels

### Local-first PWA storage is a first-order product risk
**Finding:** Safari's storage policies can effectively delete IndexedDB/Cache data for non-installed web apps after inactivity; installed PWAs are treated differently. This directly threatens the "no backend, everything local" promise unless you (1) push install hard, and/or (2) provide export/backup.
**Confidence:** High. This behavior is explicitly documented in web.dev's storage guidance and discussed in WebKit's storage policy updates; MDN also documents quota/eviction behavior and the concept of persistent storage requests.

### "Solo-first serve-receive" is structurally hard
**Finding:** Authoritative drill material frames passing/serve-receive drills as fundamentally partner/feeder-dependent. Even "beginner" passing drills commonly specify non-solo minimum participants ("athlete + coach"), and drill objectives emphasize high reps fed by another person.
**Confidence:** High for "most structured SR drills are not truly solo"; Medium for "this kills the wedge" (depends on how you define "solo-first" and what users accept).

### Warm-up/context capture should include wind/conditions (not just skill level)
**Finding:** Beach training materials explicitly emphasize warming up to "get a feel for current conditions," and for beginners specifically emphasize anticipating ball movement in wind and learning environmental effects. This supports capturing **wind/conditions** as "minimal training context" (one tap).
**Confidence:** High.

### A <60s review can still be "load aware" using session-RPE
**Finding:** The session rating of perceived exertion (session-RPE) method is widely used/validated as a practical training-load quantification approach across exercise modes, and it is compatible with a quick post-session workflow (one numeric rating + duration, plus optional soreness/pain).
**Confidence:** High that sRPE is valid/useful in general; Medium that sRPE alone is sufficient for beach volleyball safety decisions (injury/load relationships are debated and sport-specific thresholds vary).

### Skill-acquisition evidence supports "some variability," but sports transfer evidence is mixed
**Finding:** Recent meta-analytic work finds contextual interference/random practice can improve transfer/retention in motor learning (medium effect overall), but other sports-focused meta-analytic work reports no clear contextual interference advantage in sports settings—meaning you should not hard-code "random always better." A product should offer a simple knob or progression (blocked -> variable) rather than ideology.
**Confidence:** Medium (clear evidence conflict; learning effects depend on task complexity and population).

### Dexie schema + indexing: compound indexes are powerful but constrained
**Finding:** Dexie's schema syntax supports compound indexes with `[a+b]` and compound primary keys similarly, but IndexedDB limitations prevent marking compound indexes as multiEntry (array element indexing). That matters for drill tagging and "find drills by tags + difficulty + mode" queries.
**Confidence:** High.

### ID strategy should assume future sync even if you don't build sync now
**Finding:** If there's even a non-trivial chance of future sync/multi-device, using auto-increment IDs (`++id`) now is technical debt. Dexie's sync best practices recommend globally unique string IDs rather than auto-increment for distributed consistency.
**Confidence:** High for "future sync becomes painful with ++id"; Medium for "you will definitely add sync" (product decision).

### `useLiveQuery` is "enough," but you must design for re-render economics
**Finding:** `useLiveQuery` ties UI reactivity to Dexie writes; naively subscribing to large arrays (e.g., `toArray()` on sessions) can cause frequent re-renders, especially if you persist progress frequently. A stable pattern is: subscribe to **primary keys / small ranges** and then subscribe per-row/per-session detail.
**Confidence:** High that the mechanism behaves this way; Medium on how severe it is for M001 (depends on write frequency and list sizes).

### Mobile UX constraints are not "nice-to-have": touch targets and contrast become functional requirements
**Finding:** For bright sun + sweat + sand, you should treat large touch targets and high contrast as core requirements. Apple and Google guidelines converge on ~44pt/48dp minimum touch targets; WCAG target-size guidance also emphasizes minimum target sizes for touch. Contrast guidance (e.g., WCAG) matters for outdoor readability.
**Confidence:** High.

## What this means for the product's next-step decisions

You have two intertwined decision tracks that must converge before building:

First, **define the wedge truthfully**. If M001's first believable end-to-end loop is serve-receive/passing, you must specify what "solo-first" actually means operationally. Based on drill references, a large fraction of credible passing drills are not truly solo; they rely on a feeder/server. If your user is commonly training alone, you either (a) need a solo modality that produces meaningful progress signals (even if it's not "true serve receive"), or (b) accept that your "pair fallback" is not fallback but primary.

Second, **decide what "reliable local-first" means on iOS**. If you don't address Safari's eviction behavior up front, your "high trust" stance is undermined. The product decision isn't only technical; it's UX + messaging + onboarding:
- Do you require install (or heavily gate/pressure it) to reduce eviction risk?
- Do you ship a one-tap "Export training history" so users can protect themselves even if the browser wipes?

On the architecture front, you need to specify the **domain model boundaries** that correspond to the session loop:
- "Session plan" vs "active run progress" vs "review/adaptation outcome," because each has a different durability requirement and write frequency profile (critical for IndexedDB + mobile).
- "Explainable generation" requires provenance fields (what rule/template produced this?) stored on-device, not hidden in a model call. This is desk-research supported as a necessity given your stated trust stance (inference, but grounded in local-first principles: user ownership and reliability expectations).

## Recommended options and your recommendation

### Dexie schema shape

Below is a **recommended M001 schema** that (1) supports the full loop, (2) is local-first/offline-friendly, (3) avoids sync-hostile choices, and (4) stays intentionally small.

**Core design principle:**
- **Embed "blocks/steps" in the Session plan** (simple, single-read for courtside).
- **Store run/progress separately** (so "Next step" doesn't rewrite a large document and doesn't repaint your whole sessions list).
This is an architectural inference based on Dexie's indexing model + reactivity implications.

**Tables**

**`app`** (singleton-ish configuration and pointers)
- `key` (PK, string; e.g., `"activeSessionId"`, `"installNudgedAt"`)
- `value` (structured JSON)

**`user`** (singleton)
- `id` (PK, string; constant like `"local"`)
- `skillLevel` (`"beginner" | "intermediate"`)
- `handedness` (optional)
- `constraints` (e.g., "usually solo," available ball count, time budget)

**`drills`** (template library; curated + user-edited later)
- `id` (PK, string)
- `skillTags` (array of strings; e.g., `["passing","serve-receive"]`)
- `difficulty` (enum)
- `modes` (array: `["solo","pair"]`)
- `equipment` (array: `["ball","cones"]`)
- `steps` (array of instruction/timer/scoring items)
- `source` (built-in vs user-created)

**`sessionTemplates`** (optional in M001; can be compiled into app bundle if preferred)
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

**`sessionReviews`** (fast post-session review; can also be embedded in `sessions`)
- `sessionId` (PK = sessionId)
- `completedAt`
- `outcome` (`"progress" | "hold" | "deload"`)
- `sessionRpe` (0-10)
- `notesTags` (array: "windy," "fatigue," "shoulder sore," etc.)
- `freeformNote` (optional; but default off to minimize typing)

**Why this shape fits M001:**
- You can generate a session from templates/drills, let the user edit, then run it with minimal reads (one session fetch + a live run pointer).
- You can checkpoint progress for crash/resume without building a full event-sourcing system.
- You can adapt next session using "last N sessions by focus" plus the review outcome and RPE. sRPE is a credible low-friction load signal.

### Indexing strategy with reasoning

Dexie indexing is about **query shapes you know you'll need**; each index adds write overhead and migration complexity. Dexie explicitly notes you only need to declare properties you want to index, not the full object shape.

**Recommended indexes (M001, minimal but future-aware)**

**`sessions`**
- Primary key: `id` (string)
- Secondary: `createdAt`, `startedAt`, `status`, `focus`
- Compound: `[focus+startedAt]`
  - Supports "find last 3 passing sessions" efficiently for adaptation.
- Optional compound: `[status+startedAt]`
  - Supports "show recent completed" vs "drafts" quickly.

**`sessionRuns`**
- Primary key: `sessionId`
- Secondary: `state`, `lastCheckpointAt`
- Optional: `[state+lastCheckpointAt]`
  - Supports "resume active session" and "cleanup stale runs."

**`sessionReviews`**
- Primary key: `sessionId`
- Secondary: `completedAt`, `outcome`
- Optional compound: `[outcome+completedAt]` for simple reporting later.

**`drills`**
- Primary key: `id`
- MultiEntry: `*skillTags`, `*modes` (if you want quick "solo drills only")
- Secondary: `difficulty`
Dexie/IndexedDB limitation: a **compound index cannot be multiEntry**, so do not expect `[difficulty+*skillTags]` to exist. Either filter in-memory (fine for small libraries) or create derived fields/join tables later.

**Where compound indexes are worth it (in this product)**
They're worth it when you need:
- "last N sessions for focus X" (`[focus+startedAt]`)
- "list sessions by status then date" (`[status+startedAt]`)
Everything else in M001 will likely be small enough to filter in memory without pain.

### UUIDs vs auto-increment IDs

**Recommendation: Use string IDs from day one** (UUID v4 via `crypto.randomUUID()` or a time-sortable ULID/UUIDv7). Do not use `++id`.

**Why (decision-quality):**
- Auto-increment is fine for a single-device database, but becomes a merge/sync headache the moment you introduce any export/import, multi-device, or coach workflows that aggregate multiple local DBs. Dexie's own best practices for distributed/sync contexts explicitly recommend globally unique string IDs over auto-increment.
- Dexie primary keys should not be changed later; planning the key strategy early avoids "migration-by-rebuild."

### Dexie schema versioning and migration patterns

**Recommendation: additive migrations only for M001, with disciplined version bumps.**
Dexie's versioning model uses `db.version(n).stores(...)` to declare schema changes, and `upgrade()` hooks for data migrations when needed. Dexie also advises keeping historical versions with upgraders as long as users may still have them installed.

**Practical migration stance for this product (strong opinion):**
- Avoid "reshape everything" migrations early; instead prefer adding new fields/tables and leaving old data readable. This aligns with local-first reliability expectations and reduces upgrade failure risk on flaky mobile devices.
- If you later add real sync, assume client-side migrations become much harder; Dexie Cloud guidance even discourages `Version.upgrade()` for synced tables and suggests export/import style migrations. Even if you don't use Dexie Cloud, the underlying point is credible: distributed migrations are hard.

### State management: what belongs in Dexie vs React vs a state library

**Recommended boundary (M001)**

**Dexie (durable, must survive reload / app switch):**
- Session plan (`sessions.plan`) once finalized
- Active run checkpoint (`sessionRuns`) at least on:
  - session start
  - block/step changes
  - pause/resume
  - completion
- Review outcome (progress/hold/deload), sRPE, and tags (fast, structured)
- "Active session pointer" in `app` table to support resume after crash

**React transient state (ephemeral UI, don't persist):**
- Screen glare mode toggle, font-size toggle
- Local "edit draft" form state (commit to Dexie only when user confirms)
- Timer UI details (but persist minimal checkpoint times periodically)
- Accordion open/closed, "show teaching points" toggles

**When Zustand/Jotai is warranted vs overkill (strong opinion):**
- **Overkill** in M001 if your only global state is "active session runner," because a route-level provider/context can handle it.
- **Warranted** if either becomes true:
  1) You need **global ephemeral state across multiple routes** (e.g., session runner mini-player + drill library overlay + system prompts) without prop drilling.
  2) You start implementing **more complex reactive derived state** (e.g., analytics dashboards, multi-week plans) where you want memoized selectors not tied to Dexie query lifecycles.
This recommendation is inferred from how `useLiveQuery` triggers re-renders on DB mutations and from common routing/layout patterns; `useLiveQuery` is still fine, but you don't want every UI concern to be a DB query.

### Is `useLiveQuery` sufficient, and where does it break down?

**Recommendation: yes, with guardrails.**

Use it for:
- Session list (but limit results)
- Session detail fetch by ID
- Active session run pointer
This matches Dexie's intended reactive hooks usage.

Where it breaks down:
- Subscribing to large arrays that change frequently (e.g., if you store step progress on the session record and update on every tap, a sessions list subscribed to `toArray()` will re-run constantly).
- Highly derived joins that require multiple queries; you'll either over-subscribe or re-run expensive derivations.

**Specific mitigation pattern: "IDs first, details second."**
- Subscribe to a stable list of IDs using Dexie's `primaryKeys()` for collections.
- Then render each row with its own `useLiveQuery(() => table.get(id))`.
This reduces "whole list rerenders because one row changed" in many cases (practical insight supported by Dexie's API + community guidance).

### React Router route structure for the active session flow

**Recommendation: routes represent durable workflow phases, not every step.**

Proposed routes:
- `/` -> dashboard (resume active session if exists)
- `/session/new` -> capture minimal context + generate
- `/session/:sessionId/edit` -> fast edits
- `/session/:sessionId/run` -> courtside runner
- `/session/:sessionId/review` -> <60s review (outcome + sRPE + tags)
- `/drills` -> optional library viewer (mostly for trust/"why this drill?")

Use nested/layout routes for shared chrome (e.g., minimal header, "sun mode" toggle) as documented in React Router's routing guidance on layouts/nesting.

**Strong opinion:** Don't model each step as its own URL in M001. Courtside UX wants *fast taps, no navigation jitter*. Keep step transitions in component state, with Dexie checkpointing for durability.

### Recommended project file/folder structure

**Recommendation: feature-first with a thin "db layer," not a generic repository abstraction.**
This scales from M001 without forcing overengineering.

- `src/app/`
  - router setup, top-level providers, install/persistence prompts, global styles
- `src/db/`
  - Dexie instance, schema declaration, migrations, seed/import of built-in drills
- `src/features/sessions/`
  - `new/` (context capture + generation)
  - `edit/`
  - `run/`
  - `review/`
  - domain types (`Session`, `SessionRun`, `SessionReview`)
- `src/features/drills/`
  - list/detail components, drill rendering shared with sessions
- `src/shared/`
  - UI primitives optimized for sun/sweat (big buttons, contrast)
  - id/date utilities
  - offline helpers (storage persistence check, quota diagnostics)

This structure aligns with React Router's route-centric organization recommendations in their tutorial style examples while keeping the "db" concerns centralized.

### Known Dexie + React + mobile pitfalls and failure modes

**Data eviction / loss**
- Safari's 7-day eviction behavior for non-installed apps is a real risk; install + request persistent storage helps but is not an absolute guarantee under all conditions.
- WebKit storage quotas and eviction strategy can still purge data when storage pressure hits.

**QuotaExceededError handling**
- Dexie documents `Dexie.QuotaExceededError` and notes it can surface as an inner error under `AbortError` depending on browser behavior; you must inspect inner errors to handle it reliably.

**Upgrade blocked / multi-tab weirdness**
- Dexie documents a `blocked` event when another tab holds an old connection during upgrade; you should handle it and message the user ("close other tab").

**Safari IndexedDB instability and bugs**
- Dexie maintains Safari-specific guidance and notes stability differences by Safari version; there are also longstanding reports of Safari IndexedDB lockups/background issues in the wider ecosystem.

**Transactions + async pitfalls**
- IndexedDB transactions can become inactive between event loop tasks; long awaits inside a transaction can cause "transaction inactive" failures. Dexie abstracts much of this, but the underlying reality still informs "keep DB writes small and checkpointed."

**Reactivity-driven re-render storms**
- `useLiveQuery` will re-run queries when observed data changes; if you write progress too frequently and subscribe too broadly, you can create "death by rerender," especially on weaker mobile devices.

**Courtside UX failure modes (non-technical but predictable)**
- Small touch targets and low contrast will cause mis-taps and abandonment under glare/sweat. Treat >=44pt/48dp targets and strong contrast as minimums, not polish work.

## What should be decided now vs deferred

**Decide now (before any build beyond paper prototypes)**

- **Solo-first definition and acceptance criteria:**
  What counts as a "solo session" for passing/serve-receive? If it requires a feeder, you must decide whether that's acceptable or whether M001 shifts emphasis. Evidence suggests many passing drills are not truly solo.

- **iOS reliability posture:**
  Will you require/strongly guide install? Will you ship export/backup in M001? Without this, "high trust" is not credible on Safari.

- **Domain model split:**
  Commit to Session vs SessionRun vs SessionReview boundaries (the core of your Dexie schema and UI architecture).

- **ID strategy:**
  Commit to string UUID/ULID now; do not punt this.

- **Minimal context fields:**
  At minimum, include wind/conditions and "solo vs pair" because training materials emphasize environmental adaptation and because mode strongly constrains what drills are possible.

- **Post-session review fields:**
  Decide the smallest set that can drive adaptation (outcome + session-RPE + 1-3 tags). sRPE is evidence-backed and low-friction.

**Defer (safe to postpone until M002+ unless you learn otherwise)**

- Multi-week periodization and sophisticated progression logic (you can start with "progress/hold/deload" driven by review + last session outcome).
- Coach workflows, community, social, rich analytics, and video analysis (all add heavy UX and data-model complexity and are not required to validate the core loop).
- Perfect drill taxonomy/search sophistication (a small curated set + light tagging is enough for M001; multiEntry/compound constraints mean complex faceted search is work).

## What still needs primary validation, prototype testing, or expert review

Desk research can't answer these to decision-quality; you need interviews, court-side prototyping, or coach review:

- **Is "solo-first passing/serve-receive" actually something your target users can/will do?**
  Test with 8-12 self-coached beach players: what do they do when alone, what equipment do they bring, and what feels like real progress?

- **Courtside interaction budget:**
  Observe how often people are willing to touch their phone in bright sun while training. Your design assumptions ("very short interactions") are plausible but must be measured in situ.

- **Trust threshold for "generated sessions":**
  Users may accept constrained suggestions if you show provenance ("why this drill") and keep final control human. But you need to test which explanations actually build trust rather than adding noise.

- **Safety/load gating behavior:**
  Does a simple sRPE + pain/soreness tag meaningfully change behavior for amateurs training 1-3x/week? The method is valid, but behavior change is not guaranteed.

- **Drill quality and progression logic:**
  Have an experienced beach coach review your initial drill set and progression/deload rules. Warm-up and environmental emphasis are supported by FIVB material, but your specific "progress/hold/deload" mapping needs expert sanity checks.

- **iOS install/retention funnel:**
  Prototype the install prompt + "storage persistence status" messaging. Users often don't understand PWA install value; you must test friction vs trust.

## Source list with links and a short note on why each source mattered

- FIVB **Beach Volleyball Drill-book (PDF)** — Concrete drill structures, participant requirements (often not truly solo), and environment/warm-up emphasis that directly informs "minimal context capture" and challenges the solo-first assumption.
- USA Volleyball **Beach Volleyball Quick-Guide (PDF)** — Rules clarifications around serve receive contacts and outdoor safety reminders; supports how you teach/describe serve receive and safety nudges.
- **web.dev "Storage for the web"** — Clear documentation of Safari's 7-day storage cap and the installed-PWA exception; central to product trust/risk.
- **WebKit blog: storage policy updates** — Authoritative detail on quota/eviction mechanics in WebKit/Safari; reinforces that eviction is a designed behavior.
- **MDN: Storage quotas and eviction criteria** — Practical overview of browser storage limits and eviction, supporting the need for persistence strategies and user messaging.
- **whatpwacando.today: persistent storage** — Practical explanation of `navigator.storage.persist()` behavior and conditions (engagement/install), informing implementation and UX prompts.
- **Dexie docs: `Version.stores()` and schema syntax** — Primary reference for how to declare tables/indexes (and that you only declare indexed fields).
- **Dexie docs: compound indexes** — Primary reference for `[a+b]` compound index capabilities and compound primary keys.
- **Dexie docs: multiEntry index limitations** — Key constraint: compound indexes can't be multiEntry; impacts drill tagging/search design.
- **Dexie docs: `useLiveQuery()`** — Defines constraints and informs why reactivity must be scoped.
- **Dexie docs: `Dexie.on.blocked`** — Guides handling upgrade-blocked states (multi-tab), a realistic failure mode.
- **Dexie docs: `Dexie.QuotaExceededError`** — Practical error semantics (often as inner error) critical for mobile reliability.
- **Dexie docs: IndexedDB on Safari / Safari issues** — Signals Safari-specific IndexedDB quirks and Dexie's mitigation stance.
- **MDN: IDBTransaction** — Explains why transactions go inactive between tasks; supports checkpoint-based design and "don't over-transaction" guidance.
- **Dexie Cloud best practices (used here as forward-sync evidence)** — Explicit recommendation against auto-increment IDs for distributed uniqueness; informs "choose string IDs now."
- **Ink & Switch "Local-first software" essay** (authors include Martin Kleppmann and Adam Wiggins) — Frames local-first expectations (offline, user ownership), which increases the cost of storage surprises and motivates reliability-first UX.
- **Foster 2001 (Journal of Strength & Conditioning Research)** (Carl Foster) — Foundational evidence for session-RPE as a valid, simple load monitoring approach compatible with <60s review.
- **Haddad et al. 2017 review on session-RPE (PMC)** — Consolidates validity/ecological usefulness evidence for sRPE, strengthening confidence in using it in-app.
- **Motor learning meta-analysis on contextual interference (Frontiers 2024)** — Evidence supporting random/variable practice benefits for transfer (but not absolute).
- **Sports-setting meta-analysis challenging CI benefits (ScienceDirect 2023)** — Conflicting evidence; justifies building "progression knobs" rather than hard-coded ideology.
- **Apple HIG (Buttons / hit targets)** — Minimum 44x44pt hit targets; critical for sweat/glare conditions.
- **Material Design target sizes / Android accessibility** — 48x48dp targets (~9mm) and spacing guidance; reinforces outdoor usability constraints.
- **W3C WCAG Understanding Target Size** — Accessibility framing for minimum target sizes; supports treating large targets as a requirement, not preference.
- **WebAIM contrast guidance** — Practical contrast thresholds tied to WCAG; relevant to "bright sun" readability.
- **React Router official docs (routing/layout routes/tutorial)** — Primary reference for nested/layout route structure; supports the recommended workflow-phase routing.
- **MDN PWA offline/background operation guide** — Confirms offline-first expectations and constraints for PWAs; reinforces the need for durable local state and intentional offline UX.
