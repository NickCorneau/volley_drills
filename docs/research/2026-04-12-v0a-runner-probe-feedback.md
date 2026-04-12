---
id: v0a-runner-probe-feedback
title: "v0a Runner Probe: Multi-Persona Feedback & Synthesis"
date: 2026-04-12
type: research-synthesis
stage: validation
status: actionable
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
- **Key finding:** The latest same-day retest found a critical break in the `review -> complete` loop. Earlier PASS verdicts for full happy-path completion should not be treated as current truth unless re-verified.

## 1. Safety & Workflow Protocol (Trust Evaluation)

The prototype ladder design dictates strict safety constraints to build trust with a self-coached athlete.

**Positive Signal:** 
The Pain-Override structure—where flagging "Yes" to pain automatically filters out `main_skill` blocks and offers a "Recovery Technique Session"—is implemented well and serves as the strongest trust-building moment in the first-run flow.

**Critical Gaps (Friction/Trust Breakers):**
- **Missing Override Confirmation:** Tapping "Override" on the recovery card instantly drops the user into the run flow. *Spec requirement:* It must show a confirmation step: *"You chose to override the recovery default. Listen to your body and stop if pain worsens."*
- **Missing Cool-down Warning:** If a user taps "End Session" during the cool-down block, they see a generic "You still have blocks remaining" dialog. *Spec requirement:* It must specifically warn that they are cutting their cool-down short.
- **Discard Resume Skips Review:** When reopening the app to an interrupted session, tapping "Discard" marks the session `ended_early` but leaves the user on the Start screen. *Spec requirement:* Discarding a session must route the user to `/review` to capture the `incompleteReason` (e.g., time, fatigue, pain).

## 2. UX & Visual Design (The "Sandy Hands" Test)

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

## Actionable Fixes (Prioritized Backlog)

These items should be addressed in the `v0a` codebase before physical field testing.

### P1 (Required for Courtside Usability & Trust)
- [ ] **Touch Targets:** Increase `min-h-[44px]` to `min-h-[54px]` for secondary run controls, recency toggles, and pass metric steppers.
- [ ] **3-2-1 Auto-Go:** Implement a 3-second pre-roll countdown in `RunScreen.tsx` before the main block timer starts.
- [ ] **Pain Override Confirmation:** Add the missing confirmation text/step in `PainOverrideCard.tsx` before navigating to `/run`.
- [ ] **Cool-down End Warning:** Update the "End Session" confirmation dialog in `RunScreen.tsx` to conditionally warn the user if the active block is a cool-down.
- [ ] **Discard Routing:** Update `StartScreen.tsx` so that discarding a resumed session navigates to `/review?id=[logId]` instead of remaining on the Start screen.
- [ ] **Warning Palette:** Fix the active "Yes" pain button styling in `SafetyCheckScreen.tsx` to use `bg-warning-surface text-warning` per D94.

### P2 (Polish)
- [ ] **Player Toggle Hierarchy:** Move the Solo/Pair toggle above the preset cards on `StartScreen.tsx` so the filtering mechanism is understood before the content is read.
- [ ] **"Step 1 of 2" Labeling:** Remove or fix the "Step 1 of 2" header on `SafetyCheckScreen.tsx` for the no-pain path, as there is no visible step 2.

## Observations for v0b (Starter Loop)
- **Session History:** The `CompleteScreen` says "Done", but returning to the Start screen shows no record of the completed session. v0b will need the `Home/LastComplete` state to prove the data was actually saved and utilized.
- **Audio/Haptic Cues:** End users noted that a silent timer ending is easy to miss on the beach. Audio or haptic feedback at block transitions should be evaluated in v0b.
- **Pass Metric Scaling:** If users are logging 50+ attempts, tapping a `+` button 50 times is excessive friction. v0b should consider a `+5` or `+10` stepper option, or a swipe-to-increment gesture.

---

## Entry: 2026-04-12 — Comprehensive E2E Browser Test + Doc Review

### Methodology

Two parallel AI agents tested the running app (`localhost:5173`) and reviewed all project documentation simultaneously:

| Agent | Scope | Method |
|-------|-------|--------|
| Browser Test Agent | Live E2E of all user flows, 20 screenshots, visual audit, UX evaluation | Cursor IDE browser MCP, navigated every screen state, tested happy paths, edge cases, and error flows |
| Doc Review Agent | All 30+ docs in `docs/`, cross-referenced against `app/src/` implementation | Read every doc, every source file, compared specs to code, checked frontmatter, traced decision refs |

### Flows Tested (Browser)

| Flow | Verdict | Notes |
|------|---------|-------|
| Solo Wall Pass — full happy path (8 screens) | PASS | Start → Safety → Warm-Up → Run → Transition → Cool-Down → Review → Complete all work |
| Partner preset filtering | PASS | Switching to Pair correctly shows only Partner Pass Workout |
| Pain override → recovery session | PASS | Recovery default works, override requires deliberate confirmation |
| End session early → incomplete review | PASS | Bottom sheet confirmation, `incompleteReason` chips appear |
| Safety icon accessibility | PASS | Shield visible on every run screen, opens stop/seek-help dialog |
| PWA shell check | PASS (dev) | Meta tags, manifest config, `offline.html` present; full SW test needs production build |

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
- **`requestPersistentStorage()` is exported but never called.** IndexedDB data is unprotected from browser eviction.

### Confirmed Bugs & Spec Deviations

Items marked `[CONFIRMED]` were found independently by both agents. Items marked `[NEW]` are first reports from this session.

| ID | Issue | Severity | Spec Ref | Status |
|----|-------|----------|----------|--------|
| FB-01 | `[CONFIRMED]` Touch targets below 54px: recency chips (44px), pass steppers (48px), secondary run controls (44px), safety icon (36px) | P1 | R12, D49 | Open |
| FB-02 | `[CONFIRMED]` No 3-2-1 pre-roll countdown before blocks | P1 | D53 | Open |
| FB-03 | `[CONFIRMED]` Pain override confirmation exists but was missing in earlier review — now implemented | Resolved | R15 | Fixed |
| FB-04 | `[CONFIRMED]` Discard session does not route to `/review` — stays on Start screen | P1 | R10 | Open |
| FB-05 | `[NEW]` `incompleteReason` can be skipped on ended-early sessions — `canSubmit` only checks `sessionRpe` | P1 | m001-review-micro-spec | Open |
| FB-06 | `[NEW]` `requestPersistentStorage()` never called at startup | P2 | R5, D39 | Open |
| FB-07 | `[NEW]` SW uses `registerType: 'autoUpdate'` + `immediate: true` — tension with D41 safe-boundary updates | P2 | D41 | Open |
| FB-08 | `[NEW]` No pre-populated attempt count from session plan metadata | P3 | D96 | Open |
| FB-09 | `[NEW]` RPE bands (4 values) instead of 0-10 granularity — acceptable for v0a but loses signal | P3 | R10 | Deferred to v0b |
| FB-10 | `[NEW]` Coaching cue takes ~40% viewport on run screen | P3 | courtside-run-flow §3 | Open |

### Documentation Health Assessment

The doc review agent cross-referenced all 30+ docs against the implementation. Key findings:

#### Stale Content (must update)

| Doc | Issue | Impact |
|-----|-------|--------|
| `app/README.md` | Still says App.tsx is placeholder, no PWA — **actively misleading** | High — first thing any agent or developer reads |
| `AGENTS.md` | "No approved production implementation" — needs v0a vs M001 nuance | High — cold-start routing for every agent session |
| `agent-manifest.json` | `stage: "planning"` with no v0a signal | Medium — machine routing |
| `docs/README.md` | "Planning / vision stage" underplays Phase 0 prototype | Medium |
| `m001-solo-session-loop.md` | "Planning only, no code yet, blocked" without v0a footnote | Medium — reads as if nothing is built |
| v0a build plan | `status: completed` but all 10 implementation units have `- [ ]` unchecked | Low — cosmetic but confusing |

#### Cross-Doc Inconsistencies

| Conflict | Docs Involved | Resolution Needed |
|----------|---------------|-------------------|
| Training recency labels differ | `decisions.md` D83 (Today/Yesterday/2+ days ago) vs courtside-run-flow spec and app code (0 days/1 day/2+/First time) | Align D83 wording to match implementation |
| PRD says first-run captures skill level + player count | `prd-foundation.md` vs v0a (player count + preset only) | Add note that v0a intentionally defers skill level |
| Font stack: system sans vs Inter | `m001-courtside-run-flow.md` vs D94 and implementation | Align courtside spec to say Inter per D94 |
| `AGENTS.md` omits O4/O5 from open questions | `AGENTS.md` vs `decisions.md` | Add O4/O5 to AGENTS.md since they're validation-relevant |

#### Missing Documentation

- **"As-built v0a" summary:** No doc describes what was actually built, routes, stores, and known deviations from M001 specs.
- **R1-R15 traceability matrix:** The plan lists requirements but no post-build verification matrix exists.
- **D41 vs autoUpdate policy:** No doc explains why `immediate` SW registration is acceptable for v0a.
- **Test status:** Zero Vitest tests exist despite the plan listing tests for Units 2/3/6/9. No doc acknowledges this gap.

### Updated Priority Backlog

Merging the earlier review's P1/P2 items with this session's findings. Items from the original review that are confirmed still open retain their original priority. New items from this session are integrated by severity.

#### P0 — Documentation (fix before any agent touches the repo cold)

- [ ] **DOC-01**: Rewrite `app/README.md` to describe the real v0a PWA, routes, data stores, known limitations, and literal local run commands
- [ ] **DOC-02**: Update `AGENTS.md` to distinguish "v0a validation artifact shipped" from "M001 implementation gate still closed"
- [ ] **DOC-03**: Update `agent-manifest.json`, `llms.txt`, and `docs/README.md` to acknowledge Phase 0 prototype exists
- [ ] **DOC-04**: Check off v0a plan implementation units or annotate deferred items
- [ ] **DOC-05**: Align stale discovery / research docs (`docs/discovery/phase-0-readiness-assessment.md`, `docs/research/local-first-pwa-constraints.md`) with the current runnable v0a prototype and PWA wiring

#### P1 — Required for Courtside Usability & Trust

- [ ] **UX-01**: Touch targets — increase `min-h-[44px]` → `min-h-[54px]` for secondary run controls, recency toggles, pass steppers. Increase safety icon from `h-9 w-9` → at least `h-11 w-11` (`RunControls.tsx`, `SafetyCheckScreen.tsx`, `PassMetricInput.tsx`, `SafetyIcon.tsx`)
- [ ] **UX-02**: 3-2-1 Auto-Go pre-roll — implement 3-second countdown in `RunScreen.tsx` before block timer starts (D53)
- [ ] **UX-03**: Cool-down end warning — update End Session dialog to specifically warn when cutting cool-down short
- [ ] **UX-04**: Discard → Review routing — `StartScreen.tsx` `handleDiscardSession` must navigate to `/review?id=[logId]` instead of staying on Start
- [ ] **UX-05**: Require `incompleteReason` for ended-early sessions — enforce in `ReviewScreen.tsx` `canSubmit` validation
- [ ] **UX-06**: Warning palette — fix active "Yes" pain button to use `bg-warning-surface text-warning` per D94
- [ ] **UX-11**: Repair the `ReviewScreen.tsx` submit path so `Submit Review` persists a `sessionReviews` row and navigates to `/complete`; add explicit failure handling and a smoke verification path

#### P2 — Polish & Hardening

- [ ] **HARD-01**: Call `requestPersistentStorage()` at startup in `main.tsx` to protect IndexedDB from eviction
- [ ] **HARD-02**: Address D41 tension — either defer SW activation to safe boundaries or document why `autoUpdate` + `immediate` is acceptable for v0a
- [ ] **HARD-03**: Resolve or document the `vite-plugin-pwa@1.2.0` vs Vite 8 peer mismatch so clean installs do not fail or enter an invalid dependency state
- [ ] **UX-07**: Player toggle hierarchy — move Solo/Pair above preset cards on `StartScreen.tsx`
- [ ] **UX-08**: Fix "Step 1 of 2" label on `SafetyCheckScreen.tsx` (no visible step 2 on the no-pain path)
- [ ] **UX-09**: Collapse coaching cue on run screen — show first line with "More" disclosure to keep timer dominant
- [ ] **UX-10**: Add haptic/vibration via `navigator.vibrate()` at block transitions for courtside signal
- [ ] **UX-12**: Make `Resume Session` truly resume the timer, or relabel the CTA to `Reopen Session` if a second tap is intentional

#### P3 — Deferred to v0b / Starter Loop

- [ ] **V0B-01**: True 0-10 RPE input (slider or tappable number row) instead of 4 bands
- [ ] **V0B-02**: Tap-to-type option for pass metric counters (high attempt counts)
- [ ] **V0B-03**: Pre-populate attempt count from session plan metadata (D96)
- [ ] **V0B-04**: Total session elapsed timer (secondary to block timer)
- [ ] **V0B-05**: Landscape orientation handling
- [ ] **V0B-06**: Rasterized PNG icons (192x192, 512x512) alongside SVG for cross-platform PWA install
- [ ] **V0B-07**: Session history on Start screen (`Home/LastComplete` state)
- [ ] **V0B-08**: Audio/haptic cues at block endings
- [ ] **V0B-09**: `+5` / `+10` stepper or swipe-to-increment for pass metric

### D94 Visual Compliance Matrix

Full audit from the browser test agent. Every value checked against the spec:

| Property | D94 Spec | Implementation | Status |
|----------|----------|---------------|--------|
| Accent | `#E8732A` | `#E8732A` | Match |
| Accent pressed | `#C55A1B` | `#C55A1B` | Match |
| Background | `#FFFFFF` | `#FFFFFF` | Match |
| Card surface | `#F5F5F0` | `#F5F5F0` | Match |
| Text primary | `#1A1A1A` | `#1A1A1A` | Match |
| Text secondary | `#6B7280` | `#6B7280` | Match |
| Success | `#059669` | `#059669` | Match |
| Warning | `#DC2626` | `#DC2626` | Match |
| Warning surface | `#FEE2E2` | `#FEE2E2` | Match (partial — pain button uses solid red, see UX-06) |
| Info surface | `#FEF3E8` | `#FEF3E8` | Match |
| Card radius | 12px | 12px | Match |
| Button radius | 16px | 16px | Match |
| Body text | >= 16px | 16px | Match |
| Timer digits | 56-64px | 56px | Match |
| Touch targets | 54-60px | 54px primary, **44-48px secondary** | **Partial — see UX-01** |
| Font | Inter / system | Inter + system fallback | Match |

### D95 Preset Compliance

| Preset | D95 Duration | Code Duration | D95 Blocks | Code Blocks | Status |
|--------|-------------|---------------|------------|-------------|--------|
| Wall Pass Workout | ~12 min | 12 min | Warm-up 3 + Wall drill 6 + Cool-down 3 | 3 + 6 + 3 | Match |
| Open Sand Workout | ~12 min | 12 min | Warm-up 3 + Self-toss 6 + Cool-down 3 | 3 + 6 + 3 | Match |
| Partner Pass Workout | ~15 min | 15 min | Warm-up 3 + Partner drill 9 + Cool-down 3 | 3 + 9 + 3 | Match |

## Entry: 2026-04-12 — Live Mobile Retest, Persistence Verification, and Docs Discoverability Pass

### Why this entry exists

This entry was captured after a fresh same-day retest of the local app and should supersede earlier same-day PASS verdicts where findings conflict, especially around the `review -> complete` path.

### Personas exercised

| Persona | Lens | What was explicitly verified |
|---|---|---|
| End User | First-time mobile courtside experience | Session start clarity, timer legibility, friction points, what felt useful vs not useful |
| QA Retest | Functional regression check | Start, safety, run, pause, end-confirm, resume, transition, shorten, review, recovery path |
| Persistence Verifier | Local-first data trust | Whether review submit actually creates `sessionReviews` data in IndexedDB and unlocks `/complete` |
| Doc Review Agent | AI-native repo discoverability and drift | Whether current docs still describe the runnable prototype and whether setup paths are findable |

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

| Flow | Verdict | Notes |
|---|---|---|
| Start screen -> pair filtering | PASS | Pair toggle correctly reduces the preset list to the partner workout |
| Start -> safety gate -> run | PASS | Continue is gated until the required safety inputs are set |
| Run timer countdown | PASS | Timer moved from `2:49` to `2:39` during the retest |
| Pause -> end-session confirm -> go back home | PASS | Resume prompt appears on home with good context |
| Resume prompt -> run screen | PARTIAL | Session returns to a paused state rather than truly resuming |
| Transition -> shortened block path | PASS | Shortened block immediately uses a reduced timer |
| Pain -> recovery default -> override confirmation | PASS | Recovery path and override warning both appeared correctly |
| Review submit -> complete | FAIL | Submit stayed on `/review`, wrote no `sessionReviews` row, and `/complete?id=...` redirected to `/` |

### New findings from this retest

| ID | Issue | Severity | Spec / Decision Ref | Status |
|---|---|---|---|---|
| FB-11 | `Submit Review` does not complete the session loop. After selecting RPE, incrementing pass counts, adding a tag, and entering a note, the app stays on `/review`, logs no page error, writes no `sessionReviews` row, and direct `/complete?id=...` navigation bounces home. This is a real loop-breaker, not just a flaky click. | P1 | `docs/specs/m001-review-micro-spec.md`, D70 | Open |
| FB-12 | `Resume Session` on the home modal reopens the session in a paused state. The user must tap `Resume` again inside `RunScreen.tsx` before the timer continues. Either the modal CTA should actually resume the timer or the label should change. | P2 | D38, `docs/research/courtside-timer-patterns.md` | Open |

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

| Area | Confirmed mismatch | Impact |
|---|---|---|
| `README.md`, `app/README.md`, `llms.txt` | Still frame the repo as planning-only / scaffold-only despite a runnable multi-screen prototype under `app/` | High — misleading cold start for humans and agents |
| `docs/discovery/phase-0-readiness-assessment.md` | Still says there are no UI screens, no Dexie DB, and no PWA wiring | High — stale validation state |
| `docs/research/local-first-pwa-constraints.md` | Still says there is no service worker or `vite-plugin-pwa` wiring yet | High — stale implementation guidance |
| `docs/decisions.md` D41 vs `app/vite.config.ts` | Safe-boundary prompt-based updates vs `registerType: 'autoUpdate'` | Medium — trust-sensitive policy mismatch |
| `docs/decisions.md` D69 vs `app/package.json` | Docs name `Vitest`, `RTL`, `fake-indexeddb`, and `Playwright` but those are not in the app dependencies | Medium — stated quality stack does not match repo reality |
| `npm ls vite vite-plugin-pwa` in `app/` | `vite-plugin-pwa@1.2.0` declares peer support only through Vite 7 while the app is on Vite 8 | High — clean-install / cold-start reliability risk |

### Priority delta from this retest

- [ ] **UX-11**: Repair the review save -> complete loop and add a verification path that fails loudly when `sessionReviews` stays empty after submit.
- [ ] **UX-12**: Make `Resume Session` actually resume, or relabel it to `Reopen Session`.
- [ ] **DOC-05**: Add literal app startup and verification steps to `README.md` and `app/README.md` (`cd app`, install, `npm run dev`, `npm run build`, `npm run lint`, expected local URL).
- [ ] **DOC-06**: Align stale Phase 0 / PWA docs (`llms.txt`, `docs/discovery/phase-0-readiness-assessment.md`, `docs/research/local-first-pwa-constraints.md`) with the current runnable v0a prototype.
- [ ] **HARD-03**: Resolve or explicitly document the `vite-plugin-pwa` / Vite 8 peer mismatch so fresh environments do not start in an invalid state.

### Discoverability note

This feedback note is intended to be a living log, not a one-off memo. It should be indexed from the research routers so future agents can find it before repeating the same E2E and doc-drift work from scratch.

## For Agents

- **Use this section** to find prioritized work items for the v0a codebase.
- **FB-ID references** (FB-01 through FB-12) are stable identifiers for citing specific findings.
- **DOC-*, UX-*, HARD-*, V0B-*** are backlog item IDs. Use these when implementing fixes or referencing in commits.
- **When adding new entries to this doc:** use the same `## Entry: YYYY-MM-DD — [title]` heading pattern, add your personas to the frontmatter `personas_simulated` list, and assign new findings FB-IDs continuing from the last used number.
- **When findings conflict across entries:** newest dated entry wins. If a newer entry invalidates an older PASS verdict, say that explicitly.
- **Priority definitions:** P0 = doc hygiene blocking agent cold-start. P1 = required before field testing. P2 = polish before field testing. P3 = deferred to v0b.
- **Cross-references:** `docs/decisions.md` for D-refs, `docs/specs/m001-courtside-run-flow.md` for run-flow behavior, `docs/specs/m001-review-micro-spec.md` for review fields, `docs/superpowers/specs/2026-04-11-v0-prototype-ladder-design.md` for prototype ladder scope.