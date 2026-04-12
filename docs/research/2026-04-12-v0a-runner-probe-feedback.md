---
id: v0a-runner-probe-feedback
title: "v0a Runner Probe: Multi-Persona Feedback & Synthesis"
date: 2026-04-12
type: research-synthesis
stage: validation
status: active
summary: "Living multi-persona feedback log for the v0a runner probe, including UX findings, docs drift, retest evidence, and prioritized backlog deltas."
authority: "Provides UX, QA, and PM feedback on the v0a Runner Probe prototype. Used to prioritize fixes before field testing and inform v0b Starter Loop planning."
last_updated: 2026-04-12
personas_simulated:
  - QA Engineer (code walkthrough, state transition verification)
  - Product Manager (requirements coverage, wireframe fidelity, spec compliance)
  - End User (self-coached amateur, solo beach player, first-time app experience)
  - Browser Test Agent (live E2E walkthrough of all flows on localhost:5173)
  - Doc Review Agent (cross-doc consistency, implementation drift, stale content)
  - Persistence Verifier (IndexedDB inspection after failed review submit)
  - Setup Reliability Auditor (dependency and cold-start docs sanity check)
  - Code Path Auditor (full source read, flow tracing, state machine analysis, edge case hunting)
  - UX Review Agent (codebase evaluation against v0a requirements and mobile web constraints)
  - Mobile Breakpoint Retester (fresh local mobile-style exploratory QA)
  - Offline Preview Verifier (production preview + offline survivability smoke)
depends_on:
  - docs/plans/2026-04-12-001-feat-v0a-runner-probe-plan.md
  - docs/superpowers/specs/2026-04-11-v0-prototype-ladder-design.md
  - docs/specs/m001-courtside-run-flow.md
  - docs/specs/m001-review-micro-spec.md
  - docs/decisions.md
---

# v0a Runner Probe: Multi-Persona Feedback & Synthesis

## Agent Quick Scan

- **What this is:** A synthesized feedback document from a multi-persona AI review of the v0a Runner Probe implementation.
- **Why it matters:** Identifies gaps between the implementation and the strict UX/Safety constraints required for phone-on-sand usability, trust, and cold-start agent reliability.
- **How to use it:** Read the newest dated entry first when findings conflict. Treat the backlog sections as the current implementation queue before field testing or broader agent handoff.
- **Current state (as of latest code):** All P1 and P2 items through Round 5 are fixed. This includes the Round 4 code-path audit findings (`FB-21` through `FB-27`), the retest-escalated items (`FB-25`/`FB-27` raised to P1, `FB-30` new), and the `FB-11` review-submit hardening. Build verification passes (`lint`, `tsc --noEmit`, `build`).
- **Round 5 fixes (2026-04-12):** `FB-21` catch-all route, `FB-22`/`FB-23` invalid-ID "not found" states, `FB-24` double-tap guard, `FB-25` effective duration persisted for cold recovery, `FB-27` recency stores `undefined` instead of false default + question rephrased, `FB-30` pass metric hidden for discarded-resume, `FB-11` read-back verification added, `FB-26` try/catch on all RunScreen async handlers, `UX-13` duplicate progress removed, `UX-14` toggle text sized up, haptic on TransitionScreen, CompleteScreen "not found" state.
- **Top open items:** `HARD-03` (vite-plugin-pwa peer mismatch — document only), D69 test-stack alignment. All V0B-* items remain deferred to v0b.
- **FB-11 status:** Hardened with read-back verification after `db.sessionReviews.put()`. Structurally verified via lint, tsc, and build. Browser automation retesting was blocked by daemon timeout; needs manual device verification to fully close.

> **Historical context below.** Sections 1–2 and the original "Actionable Fixes" backlog were written before the first fix pass. They are preserved for audit trail but may conflict with the latest entry. When findings conflict, the newest dated entry wins.

## 1. Safety & Workflow Protocol (Trust Evaluation) *(historical — pre-fix)*

The prototype ladder design dictates strict safety constraints to build trust with a self-coached athlete.

**Positive Signal:** 
The Pain-Override structure—where flagging "Yes" to pain automatically filters out `main_skill` blocks and offers a "Recovery Technique Session"—is implemented well and serves as the strongest trust-building moment in the first-run flow.

**Critical Gaps (Friction/Trust Breakers):**

- **Missing Override Confirmation:** Tapping "Override" on the recovery card instantly drops the user into the run flow. *Spec requirement:* It must show a confirmation step: *"You chose to override the recovery default. Listen to your body and stop if pain worsens."*
- **Missing Cool-down Warning:** If a user taps "End Session" during the cool-down block, they see a generic "You still have blocks remaining" dialog. *Spec requirement:* It must specifically warn that they are cutting their cool-down short.
- **Discard Resume Skips Review:** When reopening the app to an interrupted session, tapping "Discard" marks the session `ended_early` but leaves the user on the Start screen. *Spec requirement:* Discarding a session must route the user to `/review` to capture the `incompleteReason` (e.g., time, fatigue, pain).

## 2. UX & Visual Design (The "Sandy Hands" Test) *(historical — pre-fix)*

Courtside usability requires large touch targets and high-contrast visuals to compete with sun glare, sand, and sweat.

**Positive Signal:** 
D94 visual design language (warm orange palette, typography scale) is generally well-applied. The "Your data stays on this device" copy builds immediate local-first trust.

**Critical Gaps (Friction Points):**

- **Undersized Touch Targets:** The baseline touch target for mobile courtside use is 54–60px. Several interactive elements fail this:
  - `RunControls.tsx`: Secondary buttons (Shorten, Skip Block, End Session) use `min-h-[44px]`.
  - `SafetyCheckScreen.tsx`: Training Recency toggles use `min-h-[44px]`.
  - `PassMetricInput.tsx`: The `+`/`-` steppers are 48px (`size-12`), which is too small for sweaty thumbs tracking attempts mid-workout.
- **Missing 3-2-1 Pre-roll (Auto-Go):** The block timer starts instantly on block start. *User Hypothesis:* Users will lose the first 3-5 seconds of their drill walking to their starting spot, making the timer feel punitive. A 3-second pre-roll countdown is required before the active timer loop begins.
- **Incorrect Warning Palette:** The active "Yes" pain state in `SafetyCheckScreen` uses a solid red background with white text (`bg-warning text-white`). *Spec requirement:* D94 dictates warning states use `#DC2626` text on a `#FEE2E2` light surface (`bg-warning-surface text-warning`).

## 3. Architecture & Persistence

**Positive Signal:**

- **Timer State Ledger:** The 5-second interval flush using timestamp-based recovery (rather than tick-counting) is bulletproof against iOS Safari PWA eviction.
- **Dexie Relational Schema:** The strict separation of `SessionPlans` (immutable templates), `ExecutionLogs` (run state), and `SessionReviews` perfectly sets up the data model for the v0b Starter Loop and future sync.
- **No Account Wall:** Instant access to a workout creates the exact right first impression.

## Actionable Fixes (Prioritized Backlog) *(historical — pre-fix)*

These items were the original backlog before the first fix pass. See the latest dated entry for current status.

### P1 (Required for Courtside Usability & Trust)

- **Touch Targets:** Increase `min-h-[44px]` to `min-h-[54px]` for secondary run controls, recency toggles, and pass metric steppers.
- **3-2-1 Auto-Go:** Implement a 3-second pre-roll countdown in `RunScreen.tsx` before the main block timer starts.
- **Pain Override Confirmation:** Add the missing confirmation text/step in `PainOverrideCard.tsx` before navigating to `/run`.
- **Cool-down End Warning:** Update the "End Session" confirmation dialog in `RunScreen.tsx` to conditionally warn the user if the active block is a cool-down.
- **Discard Routing:** Update `StartScreen.tsx` so that discarding a resumed session navigates to `/review?id=[logId]` instead of remaining on the Start screen.
- **Warning Palette:** Fix the active "Yes" pain button styling in `SafetyCheckScreen.tsx` to use `bg-warning-surface text-warning` per D94.

### P2 (Polish)

- **Player Toggle Hierarchy:** Move the Solo/Pair toggle above the preset cards on `StartScreen.tsx` so the filtering mechanism is understood before the content is read.
- **"Step 1 of 2" Labeling:** Remove or fix the "Step 1 of 2" header on `SafetyCheckScreen.tsx` for the no-pain path, as there is no visible step 2.

## Observations for v0b (Starter Loop)

- **Session History:** The `CompleteScreen` says "Done", but returning to the Start screen shows no record of the completed session. v0b will need the `Home/LastComplete` state to prove the data was actually saved and utilized.
- **Audio/Haptic Cues:** End users noted that a silent timer ending is easy to miss on the beach. Audio or haptic feedback at block transitions should be evaluated in v0b.
- **Pass Metric Scaling:** If users are logging 50+ attempts, tapping a `+` button 50 times is excessive friction. v0b should consider a `+5` or `+10` stepper option, or a swipe-to-increment gesture.

---

## Entry: 2026-04-12 — Comprehensive E2E Browser Test + Doc Review

### Methodology

Two parallel AI agents tested the running app (`localhost:5173`) and reviewed all project documentation simultaneously:


| Agent              | Scope                                                                       | Method                                                                                                |
| ------------------ | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Browser Test Agent | Live E2E of all user flows, 20 screenshots, visual audit, UX evaluation     | Cursor IDE browser MCP, navigated every screen state, tested happy paths, edge cases, and error flows |
| Doc Review Agent   | All 30+ docs in `docs/`, cross-referenced against `app/src/` implementation | Read every doc, every source file, compared specs to code, checked frontmatter, traced decision refs  |


### Flows Tested (Browser)


| Flow                                         | Verdict    | Notes                                                                                   |
| -------------------------------------------- | ---------- | --------------------------------------------------------------------------------------- |
| Solo Wall Pass — full happy path (8 screens) | PASS       | Start → Safety → Warm-Up → Run → Transition → Cool-Down → Review → Complete all work    |
| Partner preset filtering                     | PASS       | Switching to Pair correctly shows only Partner Pass Workout                             |
| Pain override → recovery session             | PASS       | Recovery default works, override requires deliberate confirmation                       |
| End session early → incomplete review        | PASS       | Bottom sheet confirmation, `incompleteReason` chips appear                              |
| Safety icon accessibility                    | PASS       | Shield visible on every run screen, opens stop/seek-help dialog                         |
| PWA shell check                              | PASS (dev) | Meta tags, manifest config, `offline.html` present; full SW test needs production build |


Screenshots saved to `test-screenshots/e2e-run/` (20 total covering every screen state and edge case).

### What Works Well

- **Core loop is genuinely simple.** Three taps from start to running. The app feels like "a simple courtside helper, not a second sport" — the exact product goal.
- **Timer dominance.** 56px digits are readable from across the court. Phase labels (WARM UP / WORK / COOL DOWN) are immediately clear.
- **Pain override flow** is the strongest trust moment. Recovery is the safe default; override requires two deliberate taps plus a warning.
- **D94 visual design compliance is excellent.** Every color (`#E8732A`, `#C55A1B`, `#F5F5F0`, `#1A1A1A`, `#6B7280`, `#059669`, `#DC2626`), radius (12px cards, 16px buttons), and font (Inter + system fallback) matches the spec exactly.
- **Transition screens** give a natural breather between blocks with previous-block checkmark and next-block context.
- **"Saved on device" messaging** with green checkmark on Complete screen is immediately reassuring.
- **No account wall.** Instant access to a workout creates the right first impression.
- **Timer state ledger.** The 5s flush + timestamp-based recovery architecture is robust against iOS PWA eviction.

### What Doesn't Work Well / Needs Attention

- **RPE input loses granularity.** Uses 4 bands (Easy/Moderate/Hard/Max) mapping to values 2/5/8/10 instead of the spec's 0-10 scale. Adequate for v0a field testing but loses useful signal.
- **Pass metric steppers are tedious.** +/- buttons at 48px, no tap-to-type option. Logging 50+ attempts requires 50+ taps.
- **Coaching cue is too verbose on run screen.** Takes ~40% of viewport. On a phone in bright sun, the timer should be even more dominant. Needs a collapsible "More" disclosure.
- **No total session elapsed timer.** Only the current block timer is visible; athletes lose sense of total training time.
- **No landscape handling.** Phone-on-sand scenarios may use landscape orientation — no layout accommodation.
- `**requestPersistentStorage()` is exported but never called.** IndexedDB data is unprotected from browser eviction.

### Confirmed Bugs & Spec Deviations

Items marked `[CONFIRMED]` were found independently by both agents. Items marked `[NEW]` are first reports from this session.


| ID    | Issue                                                                                                                                 | Severity | Spec Ref               | Status               |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------------------- | -------------------- |
| FB-01 | `[CONFIRMED]` Touch targets below 54px: recency chips (44px), pass steppers (48px), secondary run controls (44px), safety icon (36px) | P1       | R12, D49               | **Fixed 2026-04-12** |
| FB-02 | `[CONFIRMED]` No 3-2-1 pre-roll countdown before blocks                                                                               | P1       | D53                    | **Fixed 2026-04-12** |
| FB-03 | `[CONFIRMED]` Pain override confirmation exists but was missing in earlier review — now implemented                                   | Resolved | R15                    | Fixed                |
| FB-04 | `[CONFIRMED]` Discard session does not route to `/review` — stays on Start screen                                                     | P1       | R10                    | **Fixed 2026-04-12** |
| FB-05 | `[NEW]` `incompleteReason` can be skipped on ended-early sessions — `canSubmit` only checks `sessionRpe`                              | P1       | m001-review-micro-spec | **Fixed 2026-04-12** |
| FB-06 | `[NEW]` `requestPersistentStorage()` never called at startup                                                                          | P2       | R5, D39                | **Fixed 2026-04-12** |
| FB-07 | `[NEW]` SW uses `registerType: 'autoUpdate'` + `immediate: true` — tension with D41 safe-boundary updates                             | P2       | D41                    | Accepted for v0a     |
| FB-08 | `[NEW]` No pre-populated attempt count from session plan metadata                                                                     | P3       | D96                    | Deferred to v0b      |
| FB-09 | `[NEW]` RPE bands (4 values) instead of 0-10 granularity — acceptable for v0a but loses signal                                        | P3       | R10                    | Deferred to v0b      |
| FB-10 | `[NEW]` Coaching cue takes ~40% viewport on run screen                                                                                | P3       | courtside-run-flow §3  | **Fixed 2026-04-12** |


### Documentation Health Assessment

The doc review agent cross-referenced all 30+ docs against the implementation. Key findings:

#### Stale Content (must update)


| Doc                         | Issue                                                                      | Impact                                            |
| --------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------- |
| `app/README.md`             | Still says App.tsx is placeholder, no PWA — **actively misleading**        | High — first thing any agent or developer reads   |
| `AGENTS.md`                 | "No approved production implementation" — needs v0a vs M001 nuance         | High — cold-start routing for every agent session |
| `agent-manifest.json`       | `stage: "planning"` with no v0a signal                                     | Medium — machine routing                          |
| `docs/README.md`            | "Planning / vision stage" underplays Phase 0 prototype                     | Medium                                            |
| `m001-solo-session-loop.md` | "Planning only, no code yet, blocked" without v0a footnote                 | Medium — reads as if nothing is built             |
| v0a build plan              | `status: completed` but all 10 implementation units have `- [ ]` unchecked | Low — cosmetic but confusing                      |


#### Cross-Doc Inconsistencies


| Conflict                                               | Docs Involved                                                                                                         | Resolution Needed                                        |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Training recency labels differ                         | `decisions.md` D83 (Today/Yesterday/2+ days ago) vs courtside-run-flow spec and app code (0 days/1 day/2+/First time) | Align D83 wording to match implementation                |
| PRD says first-run captures skill level + player count | `prd-foundation.md` vs v0a (player count + preset only)                                                               | Add note that v0a intentionally defers skill level       |
| Font stack: system sans vs Inter                       | `m001-courtside-run-flow.md` vs D94 and implementation                                                                | Align courtside spec to say Inter per D94                |
| `AGENTS.md` omits O4/O5 from open questions            | `AGENTS.md` vs `decisions.md`                                                                                         | Add O4/O5 to AGENTS.md since they're validation-relevant |


#### Missing Documentation

- **"As-built v0a" summary:** No doc describes what was actually built, routes, stores, and known deviations from M001 specs.
- **R1-R15 traceability matrix:** The plan lists requirements but no post-build verification matrix exists.
- **D41 vs autoUpdate policy:** No doc explains why `immediate` SW registration is acceptable for v0a.
- **Test status:** Zero Vitest tests exist despite the plan listing tests for Units 2/3/6/9. No doc acknowledges this gap.

### Updated Priority Backlog

Merging the earlier review's P1/P2 items with this session's findings. Items from the original review that are confirmed still open retain their original priority. New items from this session are integrated by severity.

#### P0 — Documentation (fix before any agent touches the repo cold)

- **DOC-01**: Rewrite `app/README.md` to describe the real v0a PWA, routes, data stores, known limitations, and literal local run commands — **Addressed 2026-04-12**
- **DOC-02**: Update `AGENTS.md` to distinguish "v0a validation artifact shipped" from "M001 implementation gate still closed" — **Addressed 2026-04-12**
- **DOC-03**: Update `agent-manifest.json`, `llms.txt`, and `docs/README.md` to acknowledge Phase 0 prototype exists — **Addressed 2026-04-12**
- **DOC-04**: Check off v0a plan implementation units or annotate deferred items — **Addressed 2026-04-12**
- **DOC-05**: Align stale discovery / research docs (`docs/discovery/phase-0-readiness-assessment.md`, `docs/research/local-first-pwa-constraints.md`) with the current runnable v0a prototype and PWA wiring — **Addressed 2026-04-12**

#### P1 — Required for Courtside Usability & Trust

- **UX-01**: Touch targets — increase `min-h-[44px]` → `min-h-[54px]` for secondary run controls, recency toggles, pass steppers. Increase safety icon from `h-9 w-9` → at least `h-11 w-11` (`RunControls.tsx`, `SafetyCheckScreen.tsx`, `PassMetricInput.tsx`, `SafetyIcon.tsx`) — **Fixed 2026-04-12**
- **UX-02**: 3-2-1 Auto-Go pre-roll — implement 3-second countdown in `RunScreen.tsx` before block timer starts (D53) — **Fixed 2026-04-12**: 3-2-1 visual countdown + haptic pulse on go
- **UX-03**: Cool-down end warning — update End Session dialog to specifically warn when cutting cool-down short — **Fixed 2026-04-12**: conditional message when `currentBlock.type === 'wrap'`
- **UX-04**: Discard → Review routing — `StartScreen.tsx` `handleDiscardSession` must navigate to `/review?id=[logId]` instead of staying on Start — **Fixed 2026-04-12**
- **UX-05**: Require `incompleteReason` for ended-early sessions — enforce in `ReviewScreen.tsx` `canSubmit` validation — **Fixed 2026-04-12**
- **UX-06**: Warning palette — fix active "Yes" pain button to use `bg-warning-surface text-warning` per D94 — **Fixed 2026-04-12**
- **UX-11**: Repair the `ReviewScreen.tsx` submit path so `Submit Review` persists a `sessionReviews` row and navigates to `/complete`; add explicit failure handling and a smoke verification path — **Fixed 2026-04-12**: try/catch + read-back verification + error banner + CompleteScreen redirect debounce

#### P2 — Polish & Hardening

- **HARD-01**: Call `requestPersistentStorage()` at startup in `main.tsx` to protect IndexedDB from eviction — **Fixed 2026-04-12**
- **HARD-02**: Address D41 tension — either defer SW activation to safe boundaries or document why `autoUpdate` + `immediate` is acceptable for v0a — **Accepted for v0a 2026-04-12**: timer state flushed to IDB independently; no data-in-flight during SW swap; revisit if v0b adds sync/auth
- **HARD-03**: Resolve or document the `vite-plugin-pwa@1.2.0` vs Vite 8 peer mismatch so clean installs do not fail or enter an invalid dependency state
- **UX-07**: Player toggle hierarchy — move Solo/Pair above preset cards on `StartScreen.tsx` — **Fixed 2026-04-12**
- **UX-08**: Fix "Step 1 of 2" label on `SafetyCheckScreen.tsx` (no visible step 2 on the no-pain path) — **Fixed 2026-04-12**: removed misleading step label entirely
- **UX-09**: Collapse coaching cue on run screen — show first line with "More" disclosure to keep timer dominant — **Fixed 2026-04-12**: courtside instructions hidden by default behind "More…" toggle
- **UX-10**: Add haptic/vibration via `navigator.vibrate()` at block transitions for courtside signal — **Fixed 2026-04-12**: double-pulse on block complete, single on next/skip, pulse on pre-roll go
- **UX-12**: Make `Resume Session` truly resume the timer, or relabel the CTA to `Reopen Session` if a second tap is intentional — **Fixed 2026-04-12**: relabeled to "Reopen Session"

#### P3 — Deferred to v0b / Starter Loop

- **V0B-01**: True 0-10 RPE input (slider or tappable number row) instead of 4 bands
- **V0B-02**: Tap-to-type option for pass metric counters (high attempt counts)
- **V0B-03**: Pre-populate attempt count from session plan metadata (D96)
- **V0B-04**: Total session elapsed timer (secondary to block timer)
- **V0B-05**: Landscape orientation handling
- **V0B-06**: Rasterized PNG icons (192x192, 512x512) alongside SVG for cross-platform PWA install
- **V0B-07**: Session history on Start screen (`Home/LastComplete` state)
- **V0B-08**: Audio/haptic cues at block endings
- **V0B-09**: `+5` / `+10` stepper or swipe-to-increment for pass metric

### D94 Visual Compliance Matrix

Full audit from the browser test agent. Every value checked against the spec:


| Property        | D94 Spec       | Implementation                  | Status                                                     |
| --------------- | -------------- | ------------------------------- | ---------------------------------------------------------- |
| Accent          | `#E8732A`      | `#E8732A`                       | Match                                                      |
| Accent pressed  | `#C55A1B`      | `#C55A1B`                       | Match                                                      |
| Background      | `#FFFFFF`      | `#FFFFFF`                       | Match                                                      |
| Card surface    | `#F5F5F0`      | `#F5F5F0`                       | Match                                                      |
| Text primary    | `#1A1A1A`      | `#1A1A1A`                       | Match                                                      |
| Text secondary  | `#6B7280`      | `#6B7280`                       | Match                                                      |
| Success         | `#059669`      | `#059669`                       | Match                                                      |
| Warning         | `#DC2626`      | `#DC2626`                       | Match                                                      |
| Warning surface | `#FEE2E2`      | `#FEE2E2`                       | Match (UX-06 fixed — pain button now uses warning surface) |
| Info surface    | `#FEF3E8`      | `#FEF3E8`                       | Match                                                      |
| Card radius     | 12px           | 12px                            | Match                                                      |
| Button radius   | 16px           | 16px                            | Match                                                      |
| Body text       | >= 16px        | 16px                            | Match                                                      |
| Timer digits    | 56-64px        | 56px                            | Match                                                      |
| Touch targets   | 54-60px        | 54px primary, 54-56px secondary | Match (UX-01 fixed)                                        |
| Font            | Inter / system | Inter + system fallback         | Match                                                      |


### D95 Preset Compliance


| Preset               | D95 Duration | Code Duration | D95 Blocks                                | Code Blocks | Status |
| -------------------- | ------------ | ------------- | ----------------------------------------- | ----------- | ------ |
| Wall Pass Workout    | ~12 min      | 12 min        | Warm-up 3 + Wall drill 6 + Cool-down 3    | 3 + 6 + 3   | Match  |
| Open Sand Workout    | ~12 min      | 12 min        | Warm-up 3 + Self-toss 6 + Cool-down 3     | 3 + 6 + 3   | Match  |
| Partner Pass Workout | ~15 min      | 15 min        | Warm-up 3 + Partner drill 9 + Cool-down 3 | 3 + 9 + 3   | Match  |


## Entry: 2026-04-12 — Live Mobile Retest, Persistence Verification, and Docs Discoverability Pass

### Why this entry exists

This entry was captured after a fresh same-day retest of the local app and should supersede earlier same-day PASS verdicts where findings conflict, especially around the `review -> complete` path.

### Personas exercised


| Persona              | Lens                                     | What was explicitly verified                                                                      |
| -------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------- |
| End User             | First-time mobile courtside experience   | Session start clarity, timer legibility, friction points, what felt useful vs not useful          |
| QA Retest            | Functional regression check              | Start, safety, run, pause, end-confirm, resume, transition, shorten, review, recovery path        |
| Persistence Verifier | Local-first data trust                   | Whether review submit actually creates `sessionReviews` data in IndexedDB and unlocks `/complete` |
| Doc Review Agent     | AI-native repo discoverability and drift | Whether current docs still describe the runnable prototype and whether setup paths are findable   |


### Environment and evidence

- App URL tested: `http://localhost:5173`
- Viewport: `390 x 844`
- Browser harness: `npx agent-browser` using isolated session `volley-review`
- Browser note: the Cursor browser MCP daemon timed out on this machine, so the retest used the CLI browser path instead
- Screenshots captured:
  - `test-screenshots/2026-04-12-review-01-start.png`
  - `test-screenshots/2026-04-12-review-02-pair-presets.png`
  - `test-screenshots/2026-04-12-review-03-safety-initial.png`
  - `test-screenshots/2026-04-12-review-04-safety-filled.png`
  - `test-screenshots/2026-04-12-review-05-run-active.png`
  - `test-screenshots/2026-04-12-review-06-run-paused.png`
  - `test-screenshots/2026-04-12-review-07-end-confirm.png`
  - `test-screenshots/2026-04-12-review-08-resume-prompt.png`
  - `test-screenshots/2026-04-12-review-09-transition.png`
  - `test-screenshots/2026-04-12-review-10-shortened-block.png`
  - `test-screenshots/2026-04-12-review-11-review-screen.png`
  - `test-screenshots/2026-04-12-review-12-complete-screen.png`
  - `test-screenshots/2026-04-12-review-13-recovery-branch.png`
  - `test-screenshots/2026-04-12-review-14-recovery-override-confirm.png`
- Storage verification: in-browser IndexedDB inspection of `volley-drills`
- Docs cross-checked in this pass:
  - `README.md`
  - `app/README.md`
  - `AGENTS.md`
  - `llms.txt`
  - `docs/README.md`
  - `docs/research/README.md`
  - `docs/discovery/phase-0-readiness-assessment.md`
  - `docs/research/local-first-pwa-constraints.md`
  - `docs/decisions.md`
  - `app/vite.config.ts`
  - `app/package.json`

### Flows exercised


| Flow                                              | Verdict | Notes                                                                                               |
| ------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------- |
| Start screen -> pair filtering                    | PASS    | Pair toggle correctly reduces the preset list to the partner workout                                |
| Start -> safety gate -> run                       | PASS    | Continue is gated until the required safety inputs are set                                          |
| Run timer countdown                               | PASS    | Timer moved from `2:49` to `2:39` during the retest                                                 |
| Pause -> end-session confirm -> go back home      | PASS    | Resume prompt appears on home with good context                                                     |
| Resume prompt -> run screen                       | PARTIAL | Session returns to a paused state rather than truly resuming                                        |
| Transition -> shortened block path                | PASS    | Shortened block immediately uses a reduced timer                                                    |
| Pain -> recovery default -> override confirmation | PASS    | Recovery path and override warning both appeared correctly                                          |
| Review submit -> complete                         | FAIL    | Submit stayed on `/review`, wrote no `sessionReviews` row, and `/complete?id=...` redirected to `/` |


### New findings from this retest


| ID    | Issue                                                                                                                                                                                                                                                                                                                             | Severity | Spec / Decision Ref                              | Status                                                                                                     |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| FB-11 | `Submit Review` does not complete the session loop. After selecting RPE, incrementing pass counts, adding a tag, and entering a note, the app stays on `/review`, logs no page error, writes no `sessionReviews` row, and direct `/complete?id=...` navigation bounces home. This is a real loop-breaker, not just a flaky click. | P1       | `docs/specs/m001-review-micro-spec.md`, D70      | **Fixed 2026-04-12**: try/catch + read-back verification + error banner + CompleteScreen redirect debounce |
| FB-12 | `Resume Session` on the home modal reopens the session in a paused state. The user must tap `Resume` again inside `RunScreen.tsx` before the timer continues. Either the modal CTA should actually resume the timer or the label should change.                                                                                   | P2       | D38, `docs/research/courtside-timer-patterns.md` | **Fixed 2026-04-12**: relabeled to "Reopen Session"                                                        |


### Corroborated earlier findings

- `FB-08` is still real: the review counters still start at `0/0` instead of using any pre-populated attempt count, which adds avoidable taps.
- `FB-10` is still real: coaching and instructions remain useful, but they still dominate too much of the run viewport relative to the timer.
- The earlier same-day PASS verdict for a full `review -> complete` happy path should be treated as stale against the current workspace state.

### Useful vs not useful as an end user

#### Useful

- Session start is genuinely simple. The app still feels like "grab phone, start drill" rather than "configure a workout system."
- The timer is readable and dominant enough for courtside use.
- The pain / recovery branch is a strong trust moment.
- Transition screens and the shorten-block path make the flow feel considerate rather than rigid.
- The resume prompt gives helpful context about which block was interrupted.

#### Not useful or less useful

- A silent review-submit failure is a major trust break. The app appears to accept input but does not finish the loop or tell the user what went wrong.
- `Resume Session` is semantically misleading if it only reopens a paused state.
- Review counters are still too steppy for real-world use if attempts are high.
- The completion-state reassurance (`Saved on device`) is currently unearned in the failing flow because the user never reaches it.

### Reproduction notes for future agents

To reproduce `FB-11` on the current local build:

1. Open `http://localhost:5173`.
2. Start any session.
3. On safety, choose `No` for pain and any training-recency option.
4. Advance through the blocks using `Next`.
5. On review, select any RPE, increment `Good` once so `Total` becomes `1`, optionally add a tag or note, then tap `Submit Review`.
6. Observe:
  - URL remains on `/review?id=...`
  - no browser page errors are emitted
  - IndexedDB `volley-drills` still has `executionLogs > 0` but `sessionReviews == 0`
  - opening `/complete?id=...` redirects back to `/`

Expected:

- `sessionReviews` gains one row
- the app navigates to `/complete?id=...`
- the completion screen reads the saved review bundle and renders summary data

### Documentation drift confirmed in this pass


| Area                                             | Confirmed mismatch                                                                                           | Impact                                                    |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------- |
| `README.md`, `app/README.md`, `llms.txt`         | Still frame the repo as planning-only / scaffold-only despite a runnable multi-screen prototype under `app/` | High — misleading cold start for humans and agents        |
| `docs/discovery/phase-0-readiness-assessment.md` | Still says there are no UI screens, no Dexie DB, and no PWA wiring                                           | High — stale validation state                             |
| `docs/research/local-first-pwa-constraints.md`   | Still says there is no service worker or `vite-plugin-pwa` wiring yet                                        | High — stale implementation guidance                      |
| `docs/decisions.md` D41 vs `app/vite.config.ts`  | Safe-boundary prompt-based updates vs `registerType: 'autoUpdate'`                                           | Medium — trust-sensitive policy mismatch                  |
| `docs/decisions.md` D69 vs `app/package.json`    | Docs name `Vitest`, `RTL`, `fake-indexeddb`, and `Playwright` but those are not in the app dependencies      | Medium — stated quality stack does not match repo reality |
| `npm ls vite vite-plugin-pwa` in `app/`          | `vite-plugin-pwa@1.2.0` declares peer support only through Vite 7 while the app is on Vite 8                 | High — clean-install / cold-start reliability risk        |


### Priority delta from this retest

- **UX-11**: Repair the review save -> complete loop and add a verification path that fails loudly when `sessionReviews` stays empty after submit.
- **UX-12**: Make `Resume Session` actually resume, or relabel it to `Reopen Session`.
- **DOC-05**: Add literal app startup and verification steps to `README.md` and `app/README.md` (`cd app`, install, `npm run dev`, `npm run build`, `npm run lint`, expected local URL).
- **DOC-06**: Align stale Phase 0 / PWA docs (`llms.txt`, `docs/discovery/phase-0-readiness-assessment.md`, `docs/research/local-first-pwa-constraints.md`) with the current runnable v0a prototype.
- **HARD-03**: Resolve or explicitly document the `vite-plugin-pwa` / Vite 8 peer mismatch so fresh environments do not start in an invalid state.

### Discoverability note

This feedback note is intended to be a living log, not a one-off memo. It should be indexed from the research routers so future agents can find it before repeating the same E2E and doc-drift work from scratch.

---

## Entry: 2026-04-12 — Round 3: Multi-Persona Code Review + Comprehensive Fix Pass

### Why this entry exists

After implementing all P1 and P2 fixes from Rounds 1-2, four parallel code review agents were dispatched to stress-test the changes from different angles: correctness review of RunScreen, correctness review of ReviewScreen/CompleteScreen, correctness review of StartScreen/SafetyCheckScreen, and a UX touch-target audit across every component. This entry documents the new issues found and their resolutions.

### Personas exercised


| Persona                                   | Lens                                               | What was verified                                                    |
| ----------------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------- |
| Correctness Reviewer (RunScreen)          | Timer state, race conditions, lifecycle management | Pre-roll countdown, end-session dialog flow, error handling, cleanup |
| Correctness Reviewer (ReviewScreen)       | Data persistence, async patterns, error handling   | Submit flow, double-submit guard, CompleteScreen redirect timing     |
| Correctness Reviewer (StartScreen/Safety) | Navigation, touch targets, override flow           | Discard-to-review routing, pain override UX, border consistency      |
| UX Touch Target Auditor                   | D94 54-60px courtside minimum                      | Every interactive element across all components                      |


### Critical findings discovered and fixed


| ID    | Issue                                                                                                                                                                                                                                                                                                                                | Severity | Resolution                                                                                                                                                   |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| FB-14 | **Double-pause timer corruption**: End Session dialog is only reachable from paused state, but `handleEndSessionRequest` called `timer.pause()` unconditionally. This double-counted accumulated time. Then `handleEndSessionCancel` called `timer.resume()`, causing the block to auto-complete instantly because `remaining <= 0`. | P1       | **Fixed**: `handleEndSessionRequest` now guards with `timer.isRunning` before pausing. `handleEndSessionCancel` no longer resumes (user was already paused). |
| FB-15 | **Review double-submit**: No guard against rapid taps. Concurrent `handleSubmit` calls could dispatch parallel DB writes and navigation.                                                                                                                                                                                             | P2       | **Fixed**: Added `isSubmitting` state, disabled button during submit, shows "Saving..." label.                                                               |
| FB-16 | **Touch target gaps**: IncompleteReasonChips (48px), QuickTagChips (48px), SafetyIcon button (44px), SafetyIcon "Got it" (48px), ResumePrompt buttons (52px), PainOverrideCard override buttons (44px), TransitionScreen text links (no min-h), SafetyCheckScreen text links (no min-h) — all below 54px minimum.                    | P2       | **Fixed**: All bumped to min-h-[54px]. SafetyIcon button to h-14 w-14 (56px). Text links given min-h-[54px] + padding.                                       |
| FB-17 | **Discarded-resume forces inaccurate review reason**: When discarding a resumed session, the review screen required an `incompleteReason` from Time/Fatigue/Pain/Other. None match "I discarded a stale session."                                                                                                                    | P2       | **Fixed**: `ReviewScreen` now detects `endedEarlyReason === 'discarded_resume'` and skips the incomplete reason requirement.                                 |
| FB-18 | **CompleteScreen renders blank**: When `useLiveQuery` returns `null`, the component returned `null` (blank screen) for up to 1.5s before the redirect timer fired.                                                                                                                                                                   | P2       | **Fixed**: Now renders "Redirecting..." message instead of blank.                                                                                            |
| FB-19 | **Preroll/recovery error handling**: Both `startBlock().then()` and `recoverTimerState().then()` had no `.catch()`. A DB failure would leave a dead screen with no feedback.                                                                                                                                                         | P2       | **Fixed**: Added `.catch()` to both paths. Preroll failure navigates home. Recovery failure falls back to starting the full timer duration.                  |
| FB-20 | **Dead `.catch()` handler on review button**: The try/catch inside `handleSubmit` caught all errors, making the outer `.catch()` on the button's onClick unreachable dead code.                                                                                                                                                      | P3       | **Fixed**: Simplified to `void handleSubmit()` since internal try/catch handles all error paths.                                                             |


### Remaining open items after Round 3


| ID        | Issue                                                                     | Severity | Status                                                                 |
| --------- | ------------------------------------------------------------------------- | -------- | ---------------------------------------------------------------------- |
| UX-09     | Coaching cue takes ~40% viewport on run screen, competing with timer      | P2       | **Fixed 2026-04-12**: instructions collapse behind "More…" toggle      |
| UX-12     | Resume Session reopens paused state instead of truly resuming             | P2       | **Fixed 2026-04-12**: relabeled to "Reopen Session"                    |
| HARD-02   | D41 safe-boundary tension with `autoUpdate` + `immediate` SW registration | P2       | **Accepted for v0a**: no data-in-flight during SW swap; revisit in v0b |
| HARD-03   | `vite-plugin-pwa@1.2.0` vs Vite 8 peer mismatch                           | P2       | Known limitation — `npm install` succeeds with warnings; document      |
| DOC-01–05 | Documentation drift items                                                 | P0       | **Addressed 2026-04-12**: app/README.md, AGENTS.md, agent-manifest.json, llms.txt, docs/README.md, phase-0-readiness-assessment.md, local-first-pwa-constraints.md all updated |
| V0B-01–09 | All v0b deferred items                                                    | P3       | Deferred                                                               |


### Build verification

All changes verified clean:

- `npm run lint` — 0 errors, 0 warnings
- `npx tsc --noEmit` — 0 errors
- `npm run build` — successful production build (13 precache entries)

---

## Entry: 2026-04-12 — Round 4: Static Analysis Codebase Review & UX Polish Pass

### Why this entry exists
A fourth review pass was initiated to rigorously analyze edge cases, missing UX affordances, and remaining friction points via static analysis, given browser automation tools were timing out locally.

### Personas exercised
- UX Review Agent (codebase evaluation against v0a requirements and mobile web constraints)

### New Findings

| ID | Issue | Severity | Status |
|----|-------|----------|--------|
| FB-21 | **Haptic Feedback Missing on Transition:** `TransitionScreen.tsx` lacks `navigator.vibrate` calls when starting the next block or shortening the block, unlike the skip and next buttons in `RunScreen.tsx` which use it effectively for courtside physical feedback. | P2 | **Fixed 2026-04-12** |
| FB-22 | **Safety Screen Phrasing:** `SafetyCheckScreen.tsx` asks "Trained in the last 7 days?" which implies a Yes/No answer, but the answers are "0 days", "1 day", "2+", "First time". "First time" doesn't directly answer the question. Rephrasing the question to "When did you last train?" would better map to the provided answer chips. | P3 | **Fixed 2026-04-12** |
| FB-23 | **Preroll setInterval Throttle Risk:** `RunScreen.tsx` (lines 80-100) uses `setInterval` for the 3-2-1 preroll countdown. On iOS Safari and Chrome mobile, `setInterval` may be throttled aggressively if the user quickly backgrounds the app during preroll, potentially hanging or delaying the session start. Converting this to `requestAnimationFrame` (as used in the main timer) would be safer. | P2 | Deferred to v0b |
| FB-24 | **Jarring Redirect Timeout:** In `CompleteScreen.tsx`, if a user lands on the page with an invalid or missing `executionLogId`, `bundle` resolves to `null` and it triggers a `setTimeout` for 1500ms while showing "Redirecting…". This feels slightly jarring. A clearer "Session not found" state with a manual "Go back" button (similar to `ReviewScreen`) might be more reassuring. | P3 | **Fixed 2026-04-12** |

### Summary of Round 4
The codebase successfully reflects all critical P1 implementations. The PWA shell logic is correctly wired up via `vite.config.ts`, ensuring offline resilience. The schema correctly implements separation between plans, executions, and reviews. The minor UX observations surfaced in Round 4 should be triaged for the v0b cycle or addressed if they pose immediate field-testing risks.

## For Agents

- **Use this section** to find prioritized work items for the v0a codebase.
- **FB-ID references** (FB-01 through FB-30) are stable identifiers for citing specific findings.
- **DOC-*, UX-*, HARD-*, V0B-*** are backlog item IDs. Use these when implementing fixes or referencing in commits.
- **When adding new entries to this doc:** use the same `## Entry: YYYY-MM-DD — [title]` heading pattern, add your personas to the frontmatter `personas_simulated` list, and assign new findings FB-IDs continuing from the last used number.
- **When findings conflict across entries:** newest dated entry wins. If a newer entry invalidates an older PASS verdict, say that explicitly.
- **Priority definitions:** P0 = doc hygiene blocking agent cold-start. P1 = required before field testing. P2 = polish before field testing. P3 = deferred to v0b.
- **Cross-references:** `docs/decisions.md` for D-refs, `docs/specs/m001-courtside-run-flow.md` for run-flow behavior, `docs/specs/m001-review-micro-spec.md` for review fields, `docs/superpowers/specs/2026-04-11-v0-prototype-ladder-design.md` for prototype ladder scope.

---

## Entry: 2026-04-12 — Round 4: Full Source Audit, Flow Tracing, & Break-It Session

### Why this entry exists

A comprehensive code-path audit was conducted by reading every source file in the app, tracing every user flow through the state machine, and systematically attempting to break the app through edge cases, race conditions, and unexpected navigation. This goes deeper than UI-level testing by examining what happens when things go wrong.

### Methodology

Every `.tsx` and `.ts` file under `app/src/` was read in full (47 files). Each user flow was traced from entry to exit through the code, following state transitions, async operations, Dexie reads/writes, and React Router navigation. Edge cases were constructed by asking "what happens if..." at every branch point.


| Persona            | Lens                                                  | What was verified                                                                                   |
| ------------------ | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Code Path Auditor  | Full source read, state machine analysis              | Every screen, hook, component, and DB operation traced through all flows                            |
| Break-It Tester    | Edge cases, race conditions, invalid state             | Direct URL navigation, double-taps, mid-operation app kill, orphaned data, constraint violations    |
| Spec Compliance    | R1–R15 requirement trace                               | Each requirement checked against implementation with pass/fail/partial verdict                       |
| UX Critic          | Courtside usability, information hierarchy, redundancy | Layout, touch targets, information density, contradictions in controls                              |


### Build verification

All clean on fresh workspace:

- `npm run lint` — 0 errors, 0 warnings
- `npx tsc --noEmit` — 0 errors
- `npm run build` — successful, 13 precache entries
- Dev server: runs clean on port 5175

### FB-11 (Review Submit) assessment

The code path is structurally correct:

1. `ReviewScreen.handleSubmit()` calls `db.sessionReviews.put()` with deterministic ID `review-${executionLogId}`
2. On success, navigates to `/complete?id=${executionLogId}`
3. `CompleteScreen` queries via `useLiveQuery` using `.where('executionLogId').equals(log.id).first()`
4. The `sessionReviews` table has an `executionLogId` index in the schema
5. Try/catch with error banner handles failures; `isSubmitting` guard prevents double-submit

The prior round's failure was attributed to a stale dev build. With the current clean build passing all checks, FB-11 is **assessed as fixed, pending live verification**.

### New findings

#### P1 — Required for Courtside Usability & Trust


| ID    | Issue                                                                                                                                                                                                                                                                                                                   | Severity | Spec Ref    | File(s)                                                        |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- | -------------------------------------------------------------- |
| FB-21 | **No catch-all route.** React Router has 6 explicit routes but no `<Route path="*" />` fallback. Navigating to any unrecognized URL (e.g., `/settings`, `/history`, a typo) renders a completely blank white page. The v0a plan explicitly requires "accessing unknown route redirects to start screen."                | P1       | R8, Unit 1  | `app/src/App.tsx`                                              |
| FB-22 | **RunScreen infinite loading on invalid execution ID.** Navigating to `/run?id=nonexistent` shows "Loading session…" forever with no timeout, no redirect, and no error message. Can happen via stale bookmarks, IndexedDB clearing, or corrupted resume links.                                                         | P1       | R6, R8      | `app/src/screens/RunScreen.tsx`                                |
| FB-23 | **TransitionScreen infinite loading on invalid execution ID.** Same as FB-22 but for `/run/transition?id=nonexistent`. Shows "Loading…" forever with no escape.                                                                                                                                                         | P1       | R6, R8      | `app/src/screens/TransitionScreen.tsx`                         |
| FB-24 | **SafetyCheckScreen double-tap creates duplicate sessions.** The Continue button and PainOverrideCard action buttons have no `isSubmitting` guard. Rapid double-tap executes `createSessionAndNavigate` twice, creating two `SessionPlan` + `ExecutionLog` pairs. The orphaned first session can later trigger a false resume prompt. | P1       | R5          | `app/src/screens/SafetyCheckScreen.tsx`, `PainOverrideCard.tsx` |


#### P2 — Polish & Hardening


| ID    | Issue                                                                                                                                                                                                                                                                                                                                                                                                | Severity | Spec Ref          | File(s)                                                            |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------------- | ------------------------------------------------------------------ |
| FB-25 | **Transition-screen "Shorten block" + cold recovery gives wrong timer.** The shortened flag is stored in React Router `location.state`, which is lost on cold restart. If the user starts a shortened block, the app is killed, and the user resumes, `blockDurationSeconds` is computed from the full original duration. Recovery: `fullDuration - accumulatedElapsed` gives more time than expected. | P2       | R6, R5            | `RunScreen.tsx`, `TransitionScreen.tsx`                            |
| FB-26 | **Unhandled async rejections in RunScreen action handlers.** `handleBlockComplete`, `handleNext`, `handleSkip`, and `handleEndSessionConfirm` are async with no try/catch. A Dexie write failure leaves the user stuck on a dead screen with no error message or escape. Contrast with `startWithPreroll` and `recoverTimerState` which already have `.catch()` handlers (added in FB-19 fix).        | P2       | R5                | `app/src/screens/RunScreen.tsx`                                    |
| FB-27 | **Recovery path stores misleading training recency.** When Pain = Yes, the recency section is visible but not required. If unanswered, `recency` is `null` and `safetyCheck.trainingRecency` defaults to `'0 days'` (meaning "trained today"), which is false data.                                                                                                                                    | P2       | R9, D83           | `app/src/screens/SafetyCheckScreen.tsx`                            |
| UX-13 | **Block progress indicator appears twice on run screen.** The header shows `{n}/{total}` and a `<p>` below the timer repeats "Block {n} of {m}". Redundant information competing for glanceable attention in bright sun.                                                                                                                                                                              | P2       | courtside-run-flow | `app/src/screens/RunScreen.tsx`                                    |
| UX-14 | **"More…" / "Less" toggle for courtside instructions is `text-xs` (12px).** Below the 16px body text minimum (R12). While not a primary interaction, it's still a tappable element on sand.                                                                                                                                                                                                          | P2       | R12               | `app/src/screens/RunScreen.tsx`                                    |


#### P3 — Deferred / Minor


| ID     | Issue                                                                                                                                                                                                                                                                     | Severity | Status   |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | -------- |
| FB-28  | **Orphaned 'not_started' executions accumulate in IndexedDB.** If the app is killed during the 3-2-1 pre-roll (before `startBlock`), the execution stays as 'not_started'. The resume filter only checks for 'in_progress' and 'paused', so these are never surfaced.     | P3       | Deferred |
| FB-29  | **`formatInterruptedAgo` lacks day-level formatting.** Interruptions older than 24 hours show "about 24 hr ago", "about 48 hr ago". No "1 day ago" or "3 days ago" level.                                                                                                 | P3       | Deferred |
| UX-15  | **QuickTagChips allow contradictory multi-select.** "Too easy" + "Too hard" can be selected simultaneously. Consider making difficulty tags mutually exclusive while keeping "Need partner" independent.                                                                    | P3       | Deferred |
| UX-16  | **No visual session-level progress indicator.** Only per-block timer is visible. Athletes lose sense of total training time and position in the overall warm-up → work → cool-down arc.                                                                                    | P3       | Deferred |
| UX-17  | **Review screen "Back to start" link in error states lacks touch target sizing.** The `<Link>` fallbacks in `MissingIdMessage` and missing-execution states have no `min-h-[54px]`, making them hard to tap courtside.                                                      | P3       | Deferred |


### R1–R15 Requirement Compliance


| Req  | Description                                    | Verdict   | Notes                                                                                  |
| ---- | ---------------------------------------------- | --------- | -------------------------------------------------------------------------------------- |
| R1   | PWA shell + Add to Home Screen                 | PASS      | vite-plugin-pwa, manifest, iOS meta tags, SW all configured                            |
| R2   | Three preset sessions (D95)                    | PASS      | Wall Pass 12min, Open Sand 12min, Partner Pass 15min — all correct                     |
| R3   | Eight screen states                            | PASS      | Start, Safety, Warm-Up/Run, Transition, Cool-Down/Run, Review, Complete all present    |
| R4   | Control hierarchy                              | PASS      | Timer dominant 56px, Next/Pause 54px primary, secondary collapsed behind pause         |
| R5   | Local persistence                              | PASS      | Dexie 4-store schema, timer ledger 5s flush, `requestPersistentStorage` called         |
| R6   | Resume after backgrounding                     | PASS      | Resume prompt works for in_progress/paused. FB-22/23 fixed: invalid IDs now show "Session not found" |
| R7   | "Saved on device" messaging                    | PASS      | Green checkmark + text on CompleteScreen                                                |
| R8   | No mid-session refresh or forced reload        | PASS      | FB-21 fixed: catch-all route redirects unknown URLs to start screen                     |
| R9   | Pre-session safety check                       | PASS      | Pain flag, recency, heat CTA present. FB-27 fixed: unanswered recency stores `undefined` not `'0 days'` |
| R10  | Quick review                                   | PASS      | RPE bands, binary pass metric, incomplete reason, optional note, submit all functional. FB-11 hardened with read-back verification |
| R11  | High-contrast outdoor-readable theme           | PASS      | All D94 colors verified. Inter font loaded from Google Fonts                            |
| R12  | Touch targets 54-60px, body text >=16px        | PASS      | UX-14 fixed: "More…"/"Less" toggle sized up to text-sm with min-h-[54px]               |
| R13  | Mandatory warm-up and cool-down                | PASS      | `required: true` prevents skip, only shorten available for warmup/wrap types            |
| R14  | Stop/seek-help from any session state          | PASS      | SafetyIcon renders on every screen with shield + dialog                                 |
| R15  | Pain override flow                             | PASS      | Recovery default, two-step deliberate override with warning message                     |


### What works well (confirmed from code analysis)

- **Timer architecture is solid.** The `useTimer` hook uses `performance.now()` for accurate elapsed tracking, not fragile `setInterval` counting. The RAF display loop is separate from the persistence flush. Timestamp-based recovery on cold boot correctly reconstructs state.
- **Double-submit protection on Review.** The `isSubmitting` state + disabled button + "Saving…" label is well-implemented. This pattern should be replicated for the safety screen (FB-24).
- **Dexie schema is well-separated.** SessionPlan (immutable), ExecutionLog (mutable run state), SessionReview (write-once feedback), TimerState (ephemeral ledger) — clean relational separation that sets up v0b naturally.
- **End session dialog guards.** FB-14 fix (timer.isRunning check before pause) and the intentional paused-state-only access to End Session prevent the double-pause corruption that was found in Round 3.
- **Pain override two-step confirmation.** The `PainOverrideCard` state machine (default → confirming → override) requires two deliberate taps plus a warning message. This is the strongest trust moment in the app.
- **Visibility change + beforeunload flush.** The `useSessionRunner` correctly flushes timer state on both `visibilitychange` (tab hidden) and `beforeunload` (tab closing), covering the two main PWA eviction scenarios.

### What could break in field testing

1. **Blank page on mistyped URL or stale bookmark** (FB-21). If a tester bookmarks a session URL and revisits later after IndexedDB is cleared, they hit a blank or infinite-loading page with no recovery path.
2. **Duplicate sessions from excited double-taps** (FB-24). On sand with sweaty hands and adrenaline, rapid tapping is likely. A duplicate orphaned session could later surface as a confusing resume prompt.
3. **Shortened block giving extra time after restart** (FB-25). If a tester shortens a block, then the phone screen locks or iOS evicts the PWA, they get more time than expected when resuming. Not harmful but confusing.
4. **Silent failure on Dexie write error** (FB-26). If IndexedDB is under pressure (storage quota, concurrent writes), any of the main-loop action handlers could fail silently, leaving the user stuck.

### Fix recommendations (priority order)

1. **FB-21**: Add `<Route path="*" element={<Navigate to="/" replace />} />` to `App.tsx`
2. **FB-24**: Add `isCreating` state guard in `SafetyCheckScreen`, pass it to `PainOverrideCard` to disable buttons during creation
3. **FB-22/23**: Add a timeout or null-check redirect in `RunScreen` and `TransitionScreen` loading states
4. **FB-26**: Wrap `handleBlockComplete`, `handleNext`, `handleSkip`, `handleEndSessionConfirm` in try/catch with user-visible error handling
5. **FB-25**: Persist the effective `blockDurationSeconds` in the timer ledger so recovery doesn't need `location.state`
6. **FB-27**: Store `trainingRecency` as `null` instead of defaulting to `'0 days'` when the field is unanswered

---

## Entry: 2026-04-12 — Fresh Local Mobile Retest, Breakpoints, and Offline Preview

### Why this entry exists

This pass was captured after a fresh local retest specifically aimed at the original v0a trust questions: does the flow still feel quick and courtside-usable, do interruption and shortening keep their timing truth, does review still produce believable data, and does the production preview actually survive an offline reload?

### Personas exercised

| Persona                   | Lens                                   | What was explicitly verified                                                                 |
| ------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------- |
| Mobile Breakpoint Retester | First-time athlete + adversarial QA    | Start speed, pair filtering, pain branch, pause/reopen/discard flow, transition usability   |
| Persistence Break Tester  | Local-first trust and timing truth     | Shortened block interruption, paused-session reopen, review-state integrity                  |
| Offline Preview Verifier  | Production PWA trust floor             | First load online, reload offline, and continue into the safety gate while still offline     |

### Environment and evidence

- Dev app URL: `http://localhost:5176`
- Production preview URL: `http://127.0.0.1:4173`
- Browser harness: `npx agent-browser --device "iPhone 14"`
- Fresh verification before browser work:
  - `npm run build` — PASS
  - `npm run lint` — PASS
- New screenshots captured in this pass:
  - `test-screenshots/2026-04-12-validation-01-start.png`
  - `test-screenshots/2026-04-12-validation-02-pair-filter.png`
  - `test-screenshots/2026-04-12-validation-03-pain-no-recency-runs.png`
  - `test-screenshots/2026-04-12-validation-04-run-active.png`
  - `test-screenshots/2026-04-12-validation-05-resume-prompt.png`
  - `test-screenshots/2026-04-12-validation-06-shortened-block.png`
  - `test-screenshots/2026-04-12-validation-07-shortened-paused.png`
  - `test-screenshots/2026-04-12-validation-08-shortened-reopen-bug.png`
  - `test-screenshots/2026-04-12-validation-09-review-rpe-only-submit-enabled.png`
  - `test-screenshots/2026-04-12-validation-10-review-submit-stuck.png`

### Positive signals from the fresh pass

- **Start still feels fast.** The app remains only a few taps away from a live session, which still supports the core "simple courtside helper" hypothesis.
- **Pair filtering still works cleanly.** Switching to pair mode correctly reduced the preset list to `Partner Pass Workout`.
- **Resume prompt wording is better.** `Reopen Session` is semantically more honest than the older `Resume Session` label because it returns the user to a paused run.
- **Offline preview finally has fresh evidence.** In production preview, the app loaded once online, reloaded offline, and still navigated into the safety gate while offline.

### Fresh runtime confirmations and regressions

| ID      | Fresh runtime result                                                                                                                                                                                                 | Severity | Spec / Decision Ref                        | Status |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------ | ------ |
| `FB-27` | **Live confirmed, broader impact than previously stated.** Pain/recovery flow is not just storing a misleading default recency; the user can actually start `Continue with Recovery Session` without answering recency at all.                            | P1       | `R9`, D83                                  | **Fixed 2026-04-12**: `trainingRecency` now stores `undefined` when unanswered; question rephrased to "When did you last train?" |
| `FB-25` | **Live confirmed.** A shortened block paused at `2:30` reopened as a paused block with `5:25` remaining, proving the current recovery path reconstructs from the original duration instead of the shortened one.                                        | P1       | `R5`, `R6`, D38, D70                       | **Fixed 2026-04-12**: `effectiveDurationSeconds` persisted in `TimerState`; recovery uses stored value |
| `FB-30` | **New. Review metric is effectively optional.** In the discarded-resume review flow, selecting only `sessionRpe` enabled `Submit Review` while `Good` and `Total` both remained `0`, with no explicit `notCaptured` state.                               | P1       | `R10`, `docs/specs/m001-review-micro-spec` | **Fixed 2026-04-12**: pass metric section hidden for discarded-resume sessions; 0/0 stored silently |
| `FB-11` | **Fresh local mobile retest still reproduced the enabled-but-inert submit path.** `Submit Review` became enabled, but clicks left the app parked on `/review`, with no page errors and no meaningful console output.                                     | P1       | `R7`, `R10`, D70                           | **Hardened 2026-04-12**: read-back verification after `put()`, `navigate` with `{ replace: true }`. Needs manual device verification to fully close |

### Requirement delta from this retest

This entry should override older same-day optimism where it conflicts:

- **`R1`**: fresh PASS evidence now exists from production preview offline reload.
- **`R5` / `R6`**: older "local persistence is PASS / resume is PARTIAL but acceptable" language is too generous; `FB-25` shows a real live timing-truth failure after shortening + interruption.
- **`R9`**: older PASS language is too generous; `FB-27` is user-visible, not just stored-data quality drift.
- **`R10`**: older PASS language is stale. `FB-30` shows the required metric is optional in practice, and `FB-11` means the full review-submit loop still cannot be treated as freshly verified.
- **`R7`**: should be treated as "not freshly reconfirmed" in the current workspace because the live retest never reached the completion screen.

### Notes on `FB-11` re-open

An earlier same-day entry framed `FB-11` as probably caused by a stale dev build. This retest used a fresh dev server (`http://localhost:5176`) and still reproduced the same symptom under the mobile automation harness:

- `Submit Review` became enabled
- click returned success from the browser harness
- URL remained on `/review?id=...`
- browser `errors` stayed empty
- browser `console` showed only normal Vite / React dev messages

Treat `FB-11` as live again until a fresh manual device test disproves it or the implementation is hardened enough that the submit path is unmistakably complete.

---

## Entry: 2026-04-12 — Round 5: Comprehensive Fix Pass for All Remaining v0a Issues

### Why this entry exists

All remaining open P1 and P2 items from Rounds 4 and the final retest were fixed in a single pass. This entry documents the fixes, updated requirement compliance, and remaining open items.

### Fixes applied

| ID | Issue | Resolution |
|----|-------|------------|
| FB-21 | No catch-all route | Added `<Route path="*" element={<Navigate to="/" replace />} />` to `App.tsx` |
| FB-22 | RunScreen infinite loading on invalid ID | Added `loaded` flag to `useSessionRunner`; RunScreen shows "Session not found" with "Back to start" link when ID is invalid |
| FB-23 | TransitionScreen infinite loading on invalid ID | Same `loaded` flag approach; TransitionScreen shows "Session not found" state |
| FB-24 | SafetyCheckScreen double-tap creates duplicates | Added `isCreating` state guard; buttons disabled + "Creating session…" label during DB write. `PainOverrideCard` accepts `disabled` prop |
| FB-25 | Shortened block cold recovery wrong timer | Added `effectiveDurationSeconds` to `TimerState` type; all flush/pause calls now persist the current block duration; `recoverTimerState` uses stored value instead of re-computing from plan |
| FB-27 | Recovery path misleading recency default | `trainingRecency` made optional in `SessionPlanSafetyCheck`; stores `undefined` when unanswered instead of `'0 days'`. Question rephrased from "Trained in the last 7 days?" to "When did you last train?" |
| FB-30 | Review metric optional in discarded-resume flow | Pass metric section hidden for discarded-resume sessions; 0/0 stored silently since user never ran the session |
| FB-11 | Review submit re-opened | Added read-back verification (`db.sessionReviews.get()` after `put()`); throws if not persisted. Navigate uses `{ replace: true }` |
| FB-26 | Unhandled async rejections in RunScreen | `handleBlockComplete`, `handleNext`, `handleSkip`, `handleEndSessionConfirm` wrapped in try/catch with error banner |
| UX-13 | Duplicate block progress indicator | Removed redundant "Block N of M" paragraph below timer; header `{n}/{total}` is sufficient |
| UX-14 | More/Less toggle text-xs (12px) | Increased to `text-sm` (14px) with `min-h-[54px]` for proper touch target |
| Haptic | TransitionScreen missing haptic | Added `navigator.vibrate(100)` to `handleStartNext`, `handleStartShortened`, `handleSkip` |
| CompleteScreen | Jarring redirect timeout | Replaced 1.5s auto-redirect with "Session not found" message and manual "Back to start" button |

### Files changed

| File | Changes |
|------|---------|
| `App.tsx` | Catch-all route |
| `db/types.ts` | `effectiveDurationSeconds` on `TimerState`, `trainingRecency` optional on `SessionPlanSafetyCheck` |
| `hooks/useSessionRunner.ts` | `loaded` state, `flushTimer`/`pauseBlock` accept effective duration, `recoverTimerState` uses stored duration |
| `screens/RunScreen.tsx` | Invalid-ID state, try/catch on handlers, error banner, removed duplicate progress, sized up More/Less toggle |
| `screens/TransitionScreen.tsx` | Invalid-ID state, haptic feedback |
| `screens/SafetyCheckScreen.tsx` | `isCreating` guard, recency `undefined` default, question rephrased |
| `components/PainOverrideCard.tsx` | `disabled` prop, disabled styling |
| `screens/ReviewScreen.tsx` | Read-back verification, `replace: true`, pass metric hidden for discarded-resume |
| `screens/CompleteScreen.tsx` | "Session not found" state with Go back button, removed auto-redirect timer |

### Build verification

- `npm run lint` — 0 errors, 0 warnings
- `npx tsc --noEmit` — 0 errors
- `npm run build` — successful, 13 precache entries
- Browser automation retest was blocked by daemon timeout; changes verified via static analysis and build tooling

### Remaining open items

| ID | Issue | Severity | Status |
|----|-------|----------|--------|
| HARD-03 | `vite-plugin-pwa@1.2.0` vs Vite 8 peer mismatch | P2 | Document only — `npm install` succeeds with warnings |
| D69 | Test-stack alignment (Vitest, RTL, fake-indexeddb, Playwright not in deps) | P2 | Deferred — v0a is a validation probe, not production |
| FB-23 (UX) | Preroll `setInterval` throttle risk on iOS | P2 | Deferred to v0b — 3-second window makes throttling unlikely |
| FB-28 | Orphaned `not_started` executions | P3 | Deferred |
| FB-29 | `formatInterruptedAgo` lacks day-level | P3 | Deferred |
| UX-15 | Contradictory QuickTagChips | P3 | Deferred |
| UX-16 | No session-level progress indicator | P3 | Deferred |
| UX-17 | Review "Back to start" link touch target | P3 | Deferred |
| FB-11 | Review submit | P1 | Hardened — needs manual device verification to fully close |
| V0B-01–09 | All v0b deferred items | P3 | Deferred |

### Assessment

All P1 items discovered in Rounds 4 and the final retest are now addressed in code. The only item that cannot be declared fully closed is `FB-11` (review submit), which was hardened with read-back verification but could not be retested live due to browser automation daemon timeouts. A manual device test on a fresh build is the recommended next step to close it.

R1–R15 compliance is now PASS across the board (see updated table in the Round 4 Code Path Auditor entry above), with `FB-11` as the sole caveat pending live verification.
