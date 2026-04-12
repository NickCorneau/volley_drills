---

## id: v0a-to-v0b-transition
title: "v0a to v0b: Transition Summary and Next Steps"
type: plan
status: active
stage: validation
summary: "Clean handoff from v0a prototype fixes to field testing and v0b Starter Loop. Captures what was built, what's open, the D91 gate, and v0b scope."
authority: "Definitive summary of v0a completion state and the path to v0b. Read this before the feedback doc or chat history."
last_updated: 2026-04-12
depends_on:
  - docs/research/2026-04-12-v0a-runner-probe-feedback.md
  - docs/superpowers/specs/2026-04-11-v0-prototype-ladder-design.md
  - docs/decisions.md

# v0a to v0b: Transition Summary and Next Steps

## 1. What was accomplished

### Code: 18 fixes across 2 passes

**Pass 1 — feedback backlog (11 items):**


| ID      | Fix                                                                                                   | Severity |
| ------- | ----------------------------------------------------------------------------------------------------- | -------- |
| UX-01   | Touch targets increased to 54-60px across RunControls, SafetyCheckScreen, PassMetricInput, SafetyIcon | P1       |
| UX-02   | 3-2-1 pre-roll countdown before each block timer starts                                               | P1       |
| UX-03   | Cool-down specific warning in End Session dialog                                                      | P1       |
| UX-04   | Discard session routes to /review instead of staying on Start                                         | P1       |
| UX-05   | incompleteReason required for ended-early sessions                                                    | P1       |
| UX-06   | Pain "Yes" button uses bg-warning-surface text-warning per D94                                        | P1       |
| UX-11   | Review submit error handling with try/catch, error banner, CompleteScreen redirect debounce           | P1       |
| HARD-01 | requestPersistentStorage() called at app startup                                                      | P2       |
| UX-07   | Player toggle moved above preset cards                                                                | P2       |
| UX-08   | Removed misleading "Step 1 of 2" label                                                                | P2       |
| UX-10   | Haptic feedback (navigator.vibrate) at block transitions                                              | P2       |


**Pass 2 — review agent findings (7 items):**


| ID    | Fix                                                                                                                                                  | Severity    |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| FB-14 | Double-pause timer corruption in End Session dialog — `handleEndSessionRequest` guarded by `isRunning`, cancel no longer resumes                     | P1 critical |
| FB-15 | Double-submit guard on review with `isSubmitting` state and "Saving..." label                                                                        | P2          |
| FB-16 | 8 remaining touch target gaps: SafetyIcon (44->56px), chips (48->54px), ResumePrompt (52->54px), PainOverrideCard (44->54px), text links given min-h | P2          |
| FB-17 | Discarded-resume sessions skip forced incompleteReason (detects `endedEarlyReason === 'discarded_resume'`)                                           | P2          |
| FB-18 | CompleteScreen shows "Redirecting..." instead of blank when bundle is null                                                                           | P2          |
| FB-19 | Error handling on preroll `startBlock()` and recovery `recoverTimerState()` async paths                                                              | P2          |
| FB-20 | Dead `.catch()` removed from review button; internal try/catch handles all error paths                                                               | P3          |


**Build verification:** lint clean (0 errors, 0 warnings), TypeScript clean (0 errors), production build successful (13 precache entries).

### Docs: ~20 files updated

- **Agent entry surfaces** (AGENTS.md, README.md, llms.txt, agent-manifest.json, app/README.md): stage changed to "validation", v0a prototype acknowledged, encoding artifacts fixed, line counts refreshed.
- **Discovery and research** (phase-0-readiness-assessment.md, local-first-pwa-constraints.md, m001-testing-quality-strategy.md, outdoor-courtside-ui-brief.md): stale "no UI screens / no service worker / scaffold" claims replaced with v0a-accurate descriptions.
- **Milestones, specs, and ops** (m001-solo-session-loop.md, 4 spec files, milestones/README.md, autonomous-milestone-system.md): "planning only / no code yet" replaced with v0a cross-references; feedback doc linked for as-built deviations.
- **Machine index** (catalog.json): repo_state already "validation"; fixed non-standard "actionable" status to "active", updated line count.
- **Build plan** (v0a-runner-probe-plan.md): all 10 implementation units checked off; stale "App.tsx is placeholder" context line updated.
- **Feedback doc** (v0a-runner-probe-feedback.md): YAML frontmatter fixed (was malformed), status changed to "active", top-of-file Agent Quick Scan already compacted by collaborator.
- **Root README**: malformed YAML frontmatter fixed (`## id:` to `id:`, closing `---` added).

---

## 2. What's still open

### Must close before field testing


| Item  | What                                                                                                                                                                                                                             | Status                |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| FB-11 | Review submit -> complete flow needs one live verification on a fresh `npm run dev` build. Code fix is structurally correct (try/catch, read-back, error banner, CompleteScreen debounce). Round 2 tested against a stale build. | Needs one run-through |


### Known limitations (accepted for v0a)


| Item            | What                                                                                                             | Disposition                                              |
| --------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| HARD-03         | `vite-plugin-pwa@1.2.0` declares Vite 7 peers; app uses Vite 8. Builds clean, `npm install` shows peer warnings. | Documented in app/README.md                              |
| HARD-02 / FB-07 | SW uses `autoUpdate` + `immediate` vs D41 safe-boundary policy.                                                  | Accepted for v0a; revisit in v0b if adding sync/auth     |
| HARD-01         | `requestPersistentStorage()` called at startup but `persisted()` returns false on localhost Chrome.              | Unproven until tested via real Add to Home Screen on iOS |
| D69             | decisions.md names Vitest, RTL, Playwright, fake-indexeddb but none are in v0a deps.                             | Intentional v0a exception; noted in feedback doc         |


---

## 3. Field testing gate (D91)

### Quantitative bar

- **5+** testers each complete **2+** sessions within **14 days**
- **>50%** review completion rate
- **Kill signal:** fewer than 3 of 5 start a second session within 14 days

### Pre-test checklist

1. Verify FB-11 live (one clean dev build, full start-to-complete flow)
2. Deploy to Cloudflare Pages per `docs/ops/deploy-cloudflare-pages.md`
3. Test Add to Home Screen on iOS 18.4+ (primary test posture)
4. Prepare concierge links for second-session access (v0a has no organic next-session UI)
5. Plan manual evidence collection (no telemetry built in)

### Validation questions field testing should answer


| ID  | Question                                                                                              | Blocking           |
| --- | ----------------------------------------------------------------------------------------------------- | ------------------ |
| O4  | What does "solo" operationally mean for passing fundamentals (wall, sand, rebounder)?                 | M001 validation    |
| O5  | Is the D91 evidence strong enough to justify M001 build without overfitting to founder/friend signal? | M001 go/no-go      |
| O6  | Will users actually use a phone courtside during training?                                            | M001 validation    |
| O11 | What first-run screen count and copy minimize drop-off?                                               | Phase 0 validation |
| O12 | What minimum scored-contact threshold is needed before binary pass results trigger progression?       | Phase 0 validation |


---

## 4. v0b Starter Loop (post-gate scope)

If D91 clears, v0b is the first real build target. It adds beyond v0a:

### New surfaces

- **Full onboarding**: Home/NewUser, Skill Level, Today's Setup (D90-D93: players, equipment chips, optional wind)
- **Session assembly**: deterministic starter selection or template-based assembly (beyond fixed presets)
- **Session prep**: swap drill, shorten block, switch archetype before locking plan
- **Home screen**: state priorities per m001-home-and-sync-notes.md (NewUser, Draft, ReviewPending, LastComplete)
- **Full review contract**: Finish Later, deferred sRPE, review_pending home re-entry
- **Session summary**: one-line adaptation output with explanation
- **Repeat path**: Home/Draft or Home/LastComplete with pre-filled setup (near zero-config)
- **Duplicate and edit previous session**

### v0a polish items to fold into v0b


| ID     | Item                                                                   |
| ------ | ---------------------------------------------------------------------- |
| V0B-01 | True 0-10 RPE input (slider or tappable number row)                    |
| V0B-02 | Tap-to-type option for pass metric counters                            |
| V0B-03 | Pre-populate attempt count from session plan metadata (D96)            |
| V0B-04 | Total session elapsed timer (secondary to block timer)                 |
| V0B-05 | Landscape orientation handling                                         |
| V0B-06 | Rasterized PNG icons (192x192, 512x512) for cross-platform PWA install |
| V0B-07 | Session history on Start screen                                        |
| V0B-08 | Audio/haptic cues at block endings                                     |
| V0B-09 | +5/+10 stepper or swipe-to-increment for pass metric                   |


### v0b explicitly excludes

- Weekly planning
- Coach clipboard
- Cloud / sync
- Broad drill library beyond validation needs
- Analytics beyond what field validation requires
- Account creation or permission gates

### Transition criteria

The "Starter Loop Handoff Approved" checkpoint requires:

1. D91 quantitative bar met
2. Broader pre-build gate satisfied: courtside viability, solo feasibility, review completion in context, second-session retention
3. O7 safety review timing aligned (non-blocking for M001 testers, blocking before scaling)

---

## 5. Cross-references


| Doc                                                               | What it's for                                                                                        |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `docs/research/2026-04-12-v0a-runner-probe-feedback.md`           | Living feedback log with stable backlog IDs (FB-*, UX-*, DOC-*, HARD-*, V0B-*)                       |
| `docs/superpowers/specs/2026-04-11-v0-prototype-ladder-design.md` | v0a/v0b/repeat-loop ladder design, gate logic, scope boundaries                                      |
| `docs/plans/2026-04-12-001-feat-v0a-runner-probe-plan.md`         | Completed v0a build plan (10 units, all checked off)                                                 |
| `docs/ops/deploy-cloudflare-pages.md`                             | Cloudflare Pages deployment runbook                                                                  |
| `docs/decisions.md`                                               | D91 for field-test gate, O4-O12 for validation questions, D94-D96 for visual/preset/review decisions |
| `app/README.md`                                                   | Routes, Dexie schema, PWA config, run commands, known limitations                                    |
| `docs/specs/m001-courtside-run-flow.md`                           | Run flow spec (v0a implements subset)                                                                |
| `docs/specs/m001-review-micro-spec.md`                            | Review spec (v0b adds Finish Later, deferred sRPE)                                                   |
| `docs/specs/m001-home-and-sync-notes.md`                          | Home state priorities (v0b scope)                                                                    |
| `docs/specs/m001-session-assembly.md`                             | Assembly model (v0b scope, beyond fixed presets)                                                     |


