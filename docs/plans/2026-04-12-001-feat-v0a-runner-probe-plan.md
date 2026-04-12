---

## title: "feat: Build v0a Runner Probe Prototype"
type: feat
status: completed
date: 2026-04-12
origin: docs/superpowers/specs/2026-04-11-v0-prototype-ladder-design.md

# feat: Build v0a Runner Probe Prototype

## Overview

Build the v0a Runner Probe — a bare-bones working PWA session runner for field-testing phone-on-sand viability, solo environment fit, review completion, and honest solo framing. This is a Phase 0 validation artifact, not M001 implementation. Three preset sessions, eight screen states, local persistence, and outdoor-readable courtside UX.

## Problem Frame

The product promise depends on a self-coached beach player pulling out their phone on sand and completing a structured session loop. Before investing in full session assembly, adaptation, and repeat-use flows, the team needs honest field evidence that the phone-mediated runner survives real courtside conditions — sun glare, sand, sweat, screen dimming, and post-training fatigue during review.

The v0a Runner Probe is the fastest honest way to test whether this wedge is viable. It answers: will users actually use a phone courtside, does solo work in real environments, and is the review tolerable after real training?

(see origin: `docs/superpowers/specs/2026-04-11-v0-prototype-ladder-design.md`)

## Requirements Trace

- R1. Working PWA shell with Add to Home Screen support
- R2. Three preset sessions covering wall, open sand, and partner environments (D95)
- R3. Eight screen states: Start, Pre-Session Safety, Warm-Up, Run Block, Between-Block Transition, Cool-Down, Quick Review, Session Complete
- R4. Primary/secondary control hierarchy: timer dominant, Next/Pause largest (54-60px), secondary actions collapsed
- R5. Local persistence sufficient to survive normal run, interruption, and review flow
- R6. Resume after backgrounding or accidental close: timestamp-based safe pause, explicit resume prompt
- R7. Clear "Saved on device" messaging after review submit
- R8. No mid-session refresh or forced reload
- R9. Pre-session safety check: pain flag, training recency, contextual heat CTA
- R10. Quick review: sRPE (0-10), binary Good/Not Good with attempt count, optional note, incompleteReason if ended early
- R11. High-contrast outdoor-readable theme per D94 visual design language
- R12. Touch targets 54-60px, body text >=16px, timer digits 56-64px
- R13. Mandatory warm-up and cool-down (shortenable, not skippable)
- R14. Stop/seek-help triggers accessible from any session state (D88)
- R15. Pain override flow: inline warning with recovery-only default and deliberate override option

## Scope Boundaries

- No full ranked-fill assembly sophistication — fixed presets only
- No deep edit flows (swap drill, reorder, duration tuning)
- No delayed review / "Finish later" / home review-pending state
- No repeat-user home, adaptation UI, or next-session carry-forward
- No coach clipboard, backend, or sync
- No analytics beyond what field validation needs
- No account creation or permission gates
- This is a validation instrument, not a disguised MVP

## Context & Research

### Relevant Code and Patterns

- `app/src/types/drill.ts` — canonical drill family types with variants, workload, environment flags
- `app/src/types/session.ts` — session context, archetype, block slot types, pass grade helpers
- `app/src/data/drills.ts` — 26 drill catalog with full metadata (M001 minimum 11 drills)
- `app/src/data/archetypes.ts` — session archetypes with block layouts per time profile, `selectArchetype()`
- `app/src/data/progressions.ts` — 7 progression chains
- `app/package.json` — React 19, Vite 8, Dexie, react-router-dom already declared
- `app/src/App.tsx` — React Router layout with 6 routes (Start, Safety, Run, Transition, Review, Complete)

### External References

- Dexie.js docs for IndexedDB schema and live queries
- vite-plugin-pwa for service worker and Add to Home Screen
- Screen Wake Lock API for keeping screen active during run

## Key Technical Decisions

- **Relational Dexie schema from day 1**: Separate stores for SessionPlans, ExecutionLogs, SessionReviews per architecture constraints in the prototype ladder design. Even though v0a uses fixed presets, the schema should model them relationally so v0b naturally extends.
- **Timer state ledger**: Interval flush (every 5s) for active timer state to survive PWA eviction. Cold-boot hydrates from this continuous state.
- **Three fixed presets, not assembly**: v0a sessions are hardcoded configurations mapped to D95 preset definitions. No archetype selection or ranked fill runs at user-facing time — but the presets are built using the existing archetype/drill data structures internally.
- **React Router for screen flow**: Use react-router-dom (already in deps) with route-per-screen-state for clean navigation and URL-based resume.
- **Tailwind CSS for styling**: Install and configure Tailwind to match the D94 visual design language. Warm orange accent, high contrast, large touch targets.
- **No delayed sRPE**: v0a is immediate review only. The review screen appears right after session end.

## Open Questions

### Resolved During Planning

- **Which drills for presets?** Map D95 presets to drill catalog entries: Wall Pass Workout uses wall-rebound drills, Open Sand uses self-toss drills, Partner Pass uses partner passing drills. Exact drill IDs resolved during implementation from the existing catalog.
- **How to handle screen wake lock?** Best-effort Screen Wake Lock API request during active run. Graceful degradation if unavailable.
- **PWA approach?** vite-plugin-pwa with basic precaching. Workbox generateSW for service worker.

### Deferred to Implementation

- **Exact drill content mapping**: Which specific drill IDs from the 26-drill catalog best match each D95 preset. Implementation reads the catalog and selects the closest match.
- **Timer precision on mobile Safari**: Whether requestAnimationFrame or setInterval provides more reliable display on iOS Safari PWA. Implement and test.
- **Persistent storage API availability**: Whether navigator.storage.persist() succeeds on target iOS versions. Implement with graceful fallback.

## High-Level Technical Design

> *This illustrates the intended approach and is directional guidance for review, not implementation specification. The implementing agent should treat it as context, not code to reproduce.*

```
Screen Flow (react-router):

/               → StartScreen (pick players 1|2, pick preset, tap Start)
/safety         → PreSessionSafety (pain flag, recency, heat CTA)
/run            → RunFlow (warm-up → blocks → cool-down, timer-driven)
/run/transition → BetweenBlock (next block preview, Start next)
/review         → QuickReview (sRPE, binary metric, note)
/complete       → SessionComplete (summary, "Saved on device")

State Flow:
StartScreen → lock plan → PreSessionSafety → RunFlow (block loop) → QuickReview → Complete

Persistence (Dexie):
┌─────────────┐  ┌──────────────┐  ┌───────────────┐
│ SessionPlan  │  │ ExecutionLog │  │ SessionReview  │
│ (template)   │→ │ (run state)  │→ │ (feedback)     │
└─────────────┘  └──────────────┘  └───────────────┘

Timer Architecture:
- Display: requestAnimationFrame loop for smooth countdown
- Persistence: 5s interval flush of {startedAt, accumulatedElapsed, status}
- Recovery: on mount, read last flush, compute drift from timestamps
```

## Implementation Units

- **Unit 1: Project Foundation — Tailwind, Router, PWA**

**Goal:** Transform the placeholder app into a routable PWA with Tailwind styling and the D94 visual design language configured.

**Requirements:** R1, R11, R12

**Dependencies:** None

**Files:**

- Modify: `app/package.json`
- Modify: `app/vite.config.ts`
- Modify: `app/src/main.tsx`
- Create: `app/src/index.css` (replace with Tailwind directives + D94 theme)
- Create: `app/tailwind.config.ts`
- Create: `app/postcss.config.js`
- Modify: `app/src/App.tsx` (replace placeholder with router outlet)

**Approach:**

- Install tailwindcss, postcss, autoprefixer, vite-plugin-pwa
- Configure Tailwind with D94 color palette: accent #E8732A, pressed #C55A1B, bg white/#F5F5F0, text #1A1A1A/#6B7280, success #059669, warning #DC2626
- Set up font: Inter with system sans-serif fallback
- Configure vite-plugin-pwa with basic precaching and generateSW
- Replace App.tsx with BrowserRouter + Routes shell
- Set up base layout component with safe-area insets for mobile

**Patterns to follow:**

- Existing `app/vite.config.ts` structure for plugin additions
- D94 Visual Design Language section in prototype ladder doc

**Test scenarios:**

- Happy path: `npm run dev` starts without errors, Tailwind classes compile, routes resolve
- Happy path: `npm run build` produces PWA manifest and service worker
- Edge case: accessing unknown route redirects to start screen

**Verification:**

- Dev server starts cleanly, Tailwind utility classes render, PWA manifest present in build output

---

- **Unit 2: Dexie Database Schema & Persistence Layer**

**Goal:** Create the relational local-first Dexie schema with separate stores for plans, execution, and reviews. Include the timer state ledger for PWA eviction defense.

**Requirements:** R5, R6, R7

**Dependencies:** Unit 1

**Files:**

- Create: `app/src/db/index.ts`
- Create: `app/src/db/schema.ts`
- Create: `app/src/db/types.ts`
- Create: `app/src/db/timerLedger.ts`
- Test: `app/src/__tests__/db/schema.test.ts`

**Approach:**

- Define Dexie database with stores: sessionPlans, executionLogs, sessionReviews, timerState
- Use client-generated string IDs (nanoid or crypto.randomUUID)
- SessionPlan: preset ID, blocks array (locked snapshot), context, createdAt
- ExecutionLog: planId, status (not_started|in_progress|paused|ended_early|completed), activeBlockIndex, blockStatuses[], timestamps, accumulatedElapsed
- SessionReview: executionLogId, sessionRpe, primarySkillMetric, incompleteReason, shortNote, submittedAt
- TimerState: singleton ledger with startedAt, accumulatedElapsed, status, lastFlushedAt — flushed every 5s during active run
- Request persistent storage via navigator.storage.persist()

**Patterns to follow:**

- Architecture constraints in prototype ladder design (relational schema, timer state ledger, plan/execution/review separation)
- Canonical local-first contracts in PRD Foundation

**Test scenarios:**

- Happy path: create a session plan, verify it persists and reads back correctly
- Happy path: create execution log linked to plan, update status through lifecycle
- Happy path: timer ledger writes every 5s and reads back for cold-boot recovery
- Edge case: concurrent writes to timer ledger do not corrupt state
- Edge case: missing timer ledger on cold boot returns null (fresh start)

**Verification:**

- All Dexie operations succeed in Vitest with fake-indexeddb. Schema matches the relational separation contract.

---

- **Unit 3: Preset Session Builder**

**Goal:** Create the three D95 preset sessions as structured SessionPlan objects using existing drill catalog data. Pure function that maps preset ID to a complete plan.

**Requirements:** R2, R13

**Dependencies:** Unit 2

**Files:**

- Create: `app/src/domain/presets.ts`
- Create: `app/src/domain/types.ts`
- Test: `app/src/__tests__/domain/presets.test.ts`

**Approach:**

- Define preset configurations mapping to D95: Wall Pass Workout (solo+wall, ~12min), Open Sand Workout (solo+no wall, ~12min), Partner Pass Workout (pair+net, ~15min)
- Each preset builds a SessionPlan with mandatory warm-up block, main drill block(s), and mandatory cool-down block
- Select drills from existing `app/src/data/drills.ts` catalog matching environment and player constraints
- Use drill variant data to populate courtside steps, cues, and timing
- Block durations match D95 table: warm-up 3min, main 6-9min, cool-down 3min
- Pure function: (presetId, playerCount) => SessionPlan

**Patterns to follow:**

- `app/src/data/archetypes.ts` for block layout structure
- `app/src/types/session.ts` for SessionContext and BlockSlot types
- `app/src/data/drills.ts` for drill selection by environment flags

**Test scenarios:**

- Happy path: Wall Pass preset produces plan with warmup + wall drill block + cooldown, total ~12min
- Happy path: Open Sand preset uses self-toss drill, no wall requirement
- Happy path: Partner preset includes net-based drill for 2 players, total ~15min
- Edge case: all presets have mandatory warm-up and cool-down blocks
- Edge case: block durations sum to session total within tolerance

**Verification:**

- Each preset generates a valid plan with correct drill selection, block structure, and duration totals matching D95.

---

- **Unit 4: Start Screen — Preset Selection**

**Goal:** Build the entry screen where users pick player count (1 or 2) and select one of three prebuilt sessions, then tap Start.

**Requirements:** R2, R3, R11, R12

**Dependencies:** Unit 1, Unit 3

**Files:**

- Create: `app/src/screens/StartScreen.tsx`
- Create: `app/src/components/PresetCard.tsx`
- Create: `app/src/components/PlayerToggle.tsx`

**Approach:**

- Player count as large-tap toggle cards: "Solo" (1) and "Partner" (2)
- Filter visible presets by player count (solo shows Wall Pass + Open Sand; pair shows Partner Pass)
- Preset cards show: name, environment, duration, block summary
- Single "Start" CTA per card, or select card then primary Start button
- D94 styling: warm orange accent, 12px card radius, 16px button radius
- On Start: create SessionPlan in Dexie, navigate to /safety

**Patterns to follow:**

- D94 Visual Design Language (selection cards with descriptions, large tap cards for binary choices)
- UX Interaction Constraints from prototype ladder

**Test scenarios:**

- Happy path: selecting Solo shows 2 presets (Wall, Open Sand); selecting Partner shows 1 preset (Partner Pass)
- Happy path: tapping Start creates a SessionPlan in DB and navigates to safety screen
- Edge case: default state is Solo (1 player) selected
- Edge case: switching from Partner to Solo deselects any partner-only preset

**Verification:**

- Start screen renders with correct preset filtering by player count. Tapping Start persists a plan and navigates forward.

---

- **Unit 5: Pre-Session Safety Check**

**Goal:** Build the safety gate screen with pain flag, training recency, and contextual heat awareness CTA. Includes the pain override flow per the prototype ladder spec.

**Requirements:** R3, R9, R15

**Dependencies:** Unit 1, Unit 4

**Files:**

- Create: `app/src/screens/SafetyCheckScreen.tsx`
- Create: `app/src/components/PainOverrideCard.tsx`

**Approach:**

- Pain flag: large-tap Yes/No cards ("Pain that changes how you move?")
- Training recency: segmented control (Last trained: Today / Yesterday / 2+ days ago / First time)
- Heat CTA: conditional inline card when relevant (contextual, not blocking)
- Pain = Yes triggers inline warning card with recovery-only explanation + "Continue with recovery session" (primary) + "Override" (secondary, deliberately harder to tap)
- Override confirmation: brief "Listen to your body" message
- Store safety responses, navigate to /run on completion
- D94 styling with warning red #DC2626 on #FEE2E2 for pain surfaces

**Patterns to follow:**

- Pain-Override Flow section in prototype ladder design
- Pre-Session Safety section in courtside run flow spec
- D94 warning palette

**Test scenarios:**

- Happy path: No pain + recent training → navigates to run flow
- Happy path: Pain = Yes → shows recovery warning with adjusted session details
- Happy path: Pain override → shows confirmation, then proceeds with original session
- Edge case: training recency "First time" or "2+ days ago" → conservative defaults noted
- Error path: navigating to safety without a session plan redirects to start

**Verification:**

- Safety check correctly gates the session, pain override flow matches spec, and safety state persists.

---

- **Unit 6: Core Run Flow — Timer, Blocks, Transitions**

**Goal:** Build the core courtside run experience: block-by-block execution with timer, coaching cues, primary/secondary controls, between-block transitions, and mandatory warm-up/cool-down enforcement.

**Requirements:** R3, R4, R8, R12, R13, R14

**Dependencies:** Unit 2, Unit 3, Unit 5

**Files:**

- Create: `app/src/screens/RunScreen.tsx`
- Create: `app/src/screens/TransitionScreen.tsx`
- Create: `app/src/components/BlockTimer.tsx`
- Create: `app/src/components/RunControls.tsx`
- Create: `app/src/components/SafetyIcon.tsx`
- Create: `app/src/hooks/useTimer.ts`
- Create: `app/src/hooks/useWakeLock.ts`
- Create: `app/src/hooks/useSessionRunner.ts`
- Test: `app/src/__tests__/hooks/useTimer.test.ts`
- Test: `app/src/__tests__/hooks/useSessionRunner.test.ts`

**Approach:**

- RunScreen: displays current block with title, one coaching cue, large timer (56-64px), phase label (WORK/REST), progress indicator
- Timer: requestAnimationFrame display loop + 5s persistence flush via timerLedger
- Primary controls: Next (advance to next block) and Pause (54-60px touch targets)
- Pause state reveals secondary: Skip block, End session (warm-up/cool-down: only Shorten, no Skip per D85)
- Between-block transition: next block label, duration, one cue, primary "Start next block"
- Block lifecycle: planned → in_progress → completed/skipped; update ExecutionLog at each transition
- Auto-advance from warm-up through blocks to cool-down
- Screen Wake Lock API: request on run start, release on pause/end
- SafetyIcon: persistent shield/cross icon in top bar on every run screen, taps to reveal stop/seek-help content
- 3-2-1 pre-roll countdown before each block starts (Auto-Go)

**Execution note:** This is the core validation surface. Test timer accuracy and persistence recovery before polishing UI.

**Patterns to follow:**

- Courtside run flow spec control hierarchy
- Timer State Ledger architecture constraint
- D94 visual design, courtside UX requirements from PRD

**Test scenarios:**

- Happy path: start session → warm-up block runs → transition → main block → transition → cool-down → completes
- Happy path: timer counts down accurately, displays remaining time in large digits
- Happy path: Next advances to transition screen between blocks
- Happy path: Pause stops timer, shows secondary actions
- Edge case: warm-up/cool-down blocks show "Shorten" but not "Skip"
- Edge case: main blocks show both "Shorten" and "Skip"
- Edge case: End session during any block marks remaining blocks as skipped
- Edge case: timer persistence: kill app during block → reopen → resume prompt with correct elapsed time
- Integration: block status updates persist to ExecutionLog at each transition
- Integration: timer ledger flush every 5s survives app background

**Verification:**

- Full session can be run start-to-finish through all blocks. Timer is accurate. Persistence survives interruption. Control hierarchy matches spec.

---

- **Unit 7: Quick Review Screen**

**Goal:** Build the post-session review screen: sRPE capture, binary pass metric with attempt count, optional incomplete reason, optional note, and submit.

**Requirements:** R3, R10

**Dependencies:** Unit 2, Unit 6

**Files:**

- Create: `app/src/screens/ReviewScreen.tsx`
- Create: `app/src/components/RpeSlider.tsx`
- Create: `app/src/components/PassMetricInput.tsx`
- Create: `app/src/components/IncompleteReasonChips.tsx`

**Approach:**

- Single-screen layout, field order: RPE → metric → incomplete reason → note → submit
- sRPE: large 0-10 tap row or slider with descriptive labels at key points
- Binary pass metric: "Good" / "Not Good" large-tap cards with attempt count stepper (large +/- buttons, no keyboard)
- Incomplete reason: 3-4 predefined chips (Time, Fatigue, Pain) shown only when session ended early
- Optional short note: single text input (only place typing is allowed)
- Submit: create SessionReview in Dexie, navigate to /complete
- Target: completable in under 60 seconds

**Patterns to follow:**

- Review micro-spec field order and tap-first requirement
- UX Interaction Constraints: large-tap steppers for attemptCount, predefined chips for incompleteReason
- D94 visual design

**Test scenarios:**

- Happy path: complete full review with RPE + Good + 10 attempts → saves review, navigates to complete
- Happy path: partial session shows incomplete reason chips, selecting one saves it
- Edge case: RPE 0 (rest/no effort) is valid
- Edge case: skipping optional note still allows submit
- Edge case: attempt count cannot go below 0
- Error path: navigating to review without completed execution redirects to start

**Verification:**

- Review completes in target time. All fields save correctly to Dexie. Navigation flows correctly from run end to review to complete.

---

- **Unit 8: Session Complete Screen**

**Goal:** Build the summary screen showing session results and clear "Saved on device" confirmation.

**Requirements:** R3, R7

**Dependencies:** Unit 7

**Files:**

- Create: `app/src/screens/CompleteScreen.tsx`

**Approach:**

- Display: session name, duration completed, blocks completed count, RPE given
- Prominent "Saved on device" message with checkmark
- Primary action: "Done" returns to start screen
- Clean, calm design — not dashboard-like
- No next-session recommendation (v0a scope)

**Patterns to follow:**

- D94 visual design, success green #059669 for saved confirmation
- Session Complete screen description in prototype ladder

**Test scenarios:**

- Happy path: shows correct session summary after review submit
- Happy path: "Done" navigates back to start screen
- Edge case: partial session shows adjusted stats (fewer blocks completed)

**Verification:**

- Complete screen displays accurate session data and "Saved on device" confirmation. Done returns to start.

---

- **Unit 9: Resume & Interruption Recovery**

**Goal:** Implement timestamp-based resume after backgrounding, accidental close, or PWA eviction. On return, show explicit resume prompt with pause duration.

**Requirements:** R5, R6, R8

**Dependencies:** Unit 2, Unit 6

**Files:**

- Modify: `app/src/hooks/useSessionRunner.ts`
- Modify: `app/src/screens/RunScreen.tsx`
- Create: `app/src/components/ResumePrompt.tsx`
- Test: `app/src/__tests__/hooks/useSessionRunner.test.ts` (extend)

**Approach:**

- On app mount: check for in-progress ExecutionLog in Dexie
- If found: show ResumePrompt with session name, block paused at, time elapsed since interruption
- Resume options: "Resume" (continues from where left off, adding pause duration) or "Discard" (marks as ended_early)
- Timer recovery: read timerLedger, compute actual elapsed from timestamps (not stored tick count)
- Handle visibility change events (document.visibilitychange) to flush state
- Handle beforeunload to flush final state

**Patterns to follow:**

- Interruption recovery section in courtside run flow spec
- Timer state ledger architecture constraint
- v0a trust floor: no lost progress in normal run

**Test scenarios:**

- Happy path: background app during block → return → resume prompt shows correct elapsed time → resume continues
- Happy path: kill app during block → reopen → resume prompt appears with session state
- Edge case: resume after long interruption (hours) still shows correct data
- Edge case: discard option marks execution as ended_early and navigates to review
- Integration: timer ledger read on cold boot produces accurate time reconstruction

**Verification:**

- Interruption at any point during a session can be recovered. Resume prompt displays correct state. No progress is lost in normal use.

---

- **Unit 10: PWA Polish & Offline**

**Goal:** Ensure the app works as a proper PWA: service worker caching, offline support after first load, Add to Home Screen metadata, and no mid-session refresh.

**Requirements:** R1, R8

**Dependencies:** Unit 1, Unit 6

**Files:**

- Modify: `app/vite.config.ts` (finalize PWA config)
- Create: `app/public/manifest.json` (or configure via vite-plugin-pwa)
- Create: `app/public/icons/` (app icons at required sizes)
- Modify: `app/index.html` (meta tags for mobile, theme-color, apple-mobile-web-app)

**Approach:**

- Configure vite-plugin-pwa for precaching all app assets
- Service worker: skip waiting only at safe boundaries (not mid-session)
- Add to Home Screen: proper manifest with app name, icons, theme color (#E8732A), display: standalone
- iOS meta tags: apple-mobile-web-app-capable, apple-mobile-web-app-status-bar-style
- Viewport: width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no
- Test offline: after first load, airplane mode should still work

**Patterns to follow:**

- PWA trust floor in prototype ladder: offline reuse after first load, no mid-session refresh
- iOS 17+ baseline per M001

**Test scenarios:**

- Happy path: install PWA via Add to Home Screen, launch standalone, all screens work
- Happy path: after first load, airplane mode → app loads from cache, session runs normally
- Edge case: service worker update does not interrupt active session
- Edge case: app icon and splash screen render correctly on iOS

**Verification:**

- PWA installs and runs standalone. Offline mode works after first load. No mid-session disruptions from service worker updates.

## System-Wide Impact

- **Interaction graph:** Start → Safety → Run (block loop with transitions) → Review → Complete. Each transition persists state to Dexie. Timer ledger flushes independently on 5s interval.
- **Error propagation:** Dexie write failures should show user-visible "Save failed" but not crash the run flow. Timer continues regardless of persistence failures.
- **State lifecycle risks:** PWA eviction during run is the primary risk — mitigated by timer ledger and timestamp-based recovery. Partial writes during block transitions could leave inconsistent block statuses — mitigated by transaction-wrapped Dexie updates.
- **Unchanged invariants:** Existing drill catalog, archetype, and progression data files are read-only inputs. This plan does not modify them.

## Risks & Dependencies


| Risk                                                       | Mitigation                                                                                                     |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| iOS Safari PWA timer accuracy under backgrounding          | Timestamp-based timer recovery, not tick-counting. Test on real iOS devices.                                   |
| Screen Wake Lock API not supported on all targets          | Best-effort with graceful fallback. Timer recovery handles lock screen scenarios.                              |
| navigator.storage.persist() may be rejected                | Proceed without persistent storage guarantee. "Saved on device" copy remains accurate for current session.     |
| Drill catalog may not have perfect matches for D95 presets | Select closest matches from existing 26 drills. Content quality is a validation concern, not a blocking issue. |
| Tailwind + vite-plugin-pwa configuration conflicts         | Standard well-documented stack. Resolve during Unit 1 setup.                                                   |


## Documentation / Operational Notes

- This prototype is for field validation, not production release
- Testers should use Add to Home Screen on iOS 18.4+ for the primary test posture
- Collect qualitative feedback alongside the structured D91 metrics
- No telemetry or analytics are built in — validation evidence is collected manually

## Sources & References

- **Origin document:** [V0 Prototype Ladder Design](docs/superpowers/specs/2026-04-11-v0-prototype-ladder-design.md)
- Related specs: `docs/specs/m001-courtside-run-flow.md`, `docs/specs/m001-review-micro-spec.md`
- Related data: `app/src/types/drill.ts`, `app/src/types/session.ts`, `app/src/data/drills.ts`, `app/src/data/archetypes.ts`
- Milestone: `docs/milestones/m001-solo-session-loop.md`
- PRD: `docs/prd-foundation.md`
- Decisions: D82-D88 (safety), D90-D96 (session context, visual design, presets)

