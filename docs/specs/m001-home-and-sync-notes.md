---

## id: M001-home-sync

title: M001 Home And Connectivity Notes
status: active
stage: validation
type: spec
authority: home screen states, weak-connectivity behavior, sync copy principles
summary: "Home screen states, first-run activation path, weak-connectivity behavior, and the three-state save copy that matches the iPhone durability model."
last_updated: 2026-04-19
depends_on:

- docs/milestones/m001-solo-session-loop.md
- docs/prd-foundation.md
- docs/vision.md
- docs/research/local-first-pwa-constraints.md
decision_refs:
- D27
- D28
- D39
- D41
- D57
- D58
- D70
- D118

# M001 Home And Connectivity Notes

> **Authority note (2026-04-16):** Home state CTA copy and multi-state precedence are owned by [`docs/specs/m001-phase-c-ux-decisions.md`](./m001-phase-c-ux-decisions.md) Surface 2 and the consolidated plan at [`docs/plans/2026-04-16-003-rest-of-v0b-plan.md`](../plans/2026-04-16-003-rest-of-v0b-plan.md). This spec remains authoritative for the three-state save copy (`D118`), weak-connectivity behavior, and install-posture principles. Where the two disagree, the Phase C UX spec wins for Home CTAs; this spec wins for durability and save copy.

## Purpose

Capture the first mobile home-state assumptions and the user-visible behavior under weak connectivity.

The v0a validation prototype in `app/` currently implements a partial version of this spec. M001 full build remains gated by field testing. See `docs/research/2026-04-12-v0a-runner-probe-feedback.md` for as-built deviations.

## Default home state

The first mobile surface should answer one question:

`What should I do right now?`

It should not behave like a dashboard, drill browser, or coach console in the first milestone.

It should also inherit the same outdoor-ready visual posture as run mode: one high-contrast light theme, large readable type, and one dominant primary action.

## Home state variants

### State 1: New user, before the first draft exists

**v3 change (H9):** There is no standalone Home/NewUser welcome screen. First-open routes directly to the Skill Level screen with a one-line preamble *"Welcome. Let's get you started."* Home never renders a separate NewUser card; the Home "Start first workout" CTA on an empty device simply routes to Skill Level.

Primary action from an empty Home (no `onboarding.completedAt` yet):

- `Start first workout` → routes to Skill Level (not to a separate welcome screen)

First-run intake captures only:

- `skill level` (four pair-first functional bands + "Not sure yet" — D121 / D-C4)
- today's player count + equipment chips + optional wind (Today's Setup)

No second onboarding screen beyond Skill Level + Today's Setup. Defer time profile, broader environment filters, explicit goals, account creation, and permissions until after the first starter session or when the user chooses to edit.

Do not ask for `Add to Home Screen` before the user can see a useful starter session.

### State 2: Session draft ready

Primary action:

- `Start session`

Secondary actions:

- `Change setup` (re-enters Setup pre-filled with the current draft; overwrites on Build. Renamed from `Edit session` per Phase F 2026-04-19 for plainer user voice; behavior unchanged. Player-mode toggle lives inside Setup per `D-C`.)

### State 3: Review pending

Primary action:

- `Finish review`

Secondary action:

- `Skip review` (writes a terminal skipped stub per `D-C1`; not a "come back later" deferral)

Window: this state is shown only while the session is **inside the 2-hour Finish Later cap** measured from `ExecutionLog.completedAt` (`V0B-31`, `D120`). Past the cap, the home priority falls through to `State 4` and the session reads `Saved too late for planning` in history. The review form is locked and cannot be edited; adaptation never consumes an expired record.

### State 4: Last session complete, no draft ready

Primary action:

- `Repeat this session` (per `D-C5` — duplicate-and-edit is folded into Repeat; pre-fills Setup from the last session with the StaleContextBanner's "Adjust if today's different" nudge visible)

Secondary action:

- `Start a different session` (routes to fresh `/setup` with no pre-fill and no banner — the "today is different" path)

**Cut from v0b by Phase F (2026-04-19):** the `Same as last time` one-tap text link (was a narrow shortcut bypassing the StaleContextBanner) and the `Edit` text link (was redundant with Repeat — same `/setup?from=repeat` URL). See `docs/specs/m001-phase-c-ux-decisions.md` Surface 2 + Surface 6 for the post-Phase-F wireframes. Users certain nothing has changed still only need one tap on the pre-filled Setup's `Build Session` button.

(Age-branch copy variant cut from v0b per `H11` / `C15`; flat precedence applies at all ages.)

## New user home after a first draft is generated

Show:

- current primary skill focus
- next suggested session
- session duration
- why it is short and starter-friendly
- one primary action: `Start session`

Secondary actions:

- `Edit session`

(The `See why` affordance was cut per `H7` in the approved red-team fix plan; the `SessionDraft.rationale` schema field stays for M001-build.)

If the app is still running in Safari, this is an acceptable point to suggest `Add to Home Screen` with simple durability and repeat-use wording.

## Repeat user home

Show:

- next suggested session
- last session result
- simple status of review/adaptation

Preferred emphasis:

- `Start session`

Secondary actions:

- `Repeat this session` (per `D-C5`)
- `Adjust for today`

If the app is still running in Safari, repeat-user home is also an acceptable place to remind the user about `Add to Home Screen`.

## Install posture for M001

- Official iPhone support baseline is `iOS 17+`.
- Primary tested posture is `Add to Home Screen` on `iOS 18.4+`.
- The app must still open and work in Safari with no install requirement.
- Encourage `Add to Home Screen` after the user sees first-session value or returns for repeat use.
- Declining install should not block session start, session resume, or review completion.

## Home-state priorities

Canonical v0b precedence (per `D-C8` and the approved red-team fix plan v3): exactly one primary card at a time, with precedence `resume > review_pending > draft > last_complete > new_user`. Flat 4-row — no age branching. All other states render as compact secondary rows below the primary card, never as competing primary CTAs. All age-tier branches (`>7d` subtext, `>21d` demote, `>28d` Welcome back) are **not in v0b** — the 14-day D91 window makes them unreachable, and seasonal-returner concerns are M001-build scope (H11 / C5 / C15).

Lower priority (not in v0b):

- browsing drills
- inspecting history
- profile/configuration work

## Weak-connectivity and durability behavior

Planning default: local-first storage for the validation phase. Final cross-device sync can wait, but local durability and user-facing save language cannot.

Planning assumption:

- single user
- single device
- no backend in M001
- local progress should feel trustworthy even before a backend exists

### User-visible states in M001

- `Saved on device`
- `Resume session`
- `Review pending` (within the 2-hour Finish Later cap; `V0B-31`, `D120`)
- `Saved too late for planning` (past the cap; read-only history entry)
- `Update ready`

### Future-only states once a cloud peer exists

- `Backup pending`
- `Could not back up yet`

### Rules

- Starting and running a session should not depend on strong signal or a remote round trip.
- In-progress session state and pending-review state should persist locally as the user goes, not only at final submit.
- Review submission should succeed locally even with no network.
- The app should never imply data loss if the session is safely stored on device.
- M001 should not show `Sync pending` or `Could not sync yet` unless a real cloud peer exists.
- If a future backup attempt fails, use a quiet retry pattern instead of a blocking error wall.
- `Backup pending` should surface as a subtle status on review confirmation and home, not as a loud interruption during an active session.
- `Could not back up yet` should appear on home or after save confirmation, not as a blocking modal during training.
- Any app update prompt or version activation should wait for a safe boundary such as home, review confirmation, or next launch. Do not interrupt an active session with a refresh demand.

### Storage durability baseline

- Request persistent browser storage at the first meaningful save boundary, or as soon after as feels natural in the flow.
- If persistent storage is unavailable, do not block usage. Keep local-save copy honest and treat export or backup as a follow-on safeguard.
- Local save success and any future backup or sync success are separate states.
- Persist at meaningful boundaries such as session start, block transitions, pause/resume, early end, review draft change, and final review submit.
- iPhone durability sits in a three-layer model (ITP 7-day timer, Home Screen carveout, quota-pressure eviction + heuristic persistent mode). Treat `persisted() === true` as the strongest observable state, not as a guarantee. See `D118` and `docs/research/local-first-pwa-constraints.md`.

### Local durability language

- `Saved on device` means the session is stored locally on this device.
- It does not mean the session is backed up remotely or available on another device.
- Do not use `synced`, `backed up`, or equivalent copy unless that is actually true.
- Save copy is **posture-sensitive**: the primary line and the secondary explanation both depend on install posture and `persisted()` result.

#### Three-state save copy (per `D118`)

The app detects three runtime states and picks a matching primary + secondary line. Until the detector ships, the safest default is State B language (installed, not persisted) rather than the unqualified `Saved on device` headline, which overpromises for Safari-tab users.

- **State A — Browser tab, not installed** (`display-mode: browser` and `navigator.standalone !== true`)
  - Primary: `Saved in this browser on this device`
  - Secondary: *Available offline here, but iPhone Safari may remove browser data if the site is not used for a while or if browser data is cleared.*

- **State B — Installed Home Screen web app, `persisted() === false`** (`display-mode: standalone` or `navigator.standalone === true`, with `persist()` not granted)
  - Primary: `Saved on this device`
  - Secondary: *Stored locally in the installed app. Not backed up unless you enable sync or export. iOS can still remove local data if site/app data is cleared, device storage is reclaimed, or a browser bug occurs.*

- **State C — Installed Home Screen web app, `persisted() === true`**
  - Primary: `Saved on this device`
  - Secondary: *Stored locally with the strongest storage durability this browser currently exposes. Still not a backup. Use sync or export for recovery and moving to another device.*

Detection precedence: if the app has not yet run `persist()` against a real user gesture, assume State B rather than State C for copy purposes. Re-evaluate on boot and after the first post-gesture `persist()`.

Do not auto-escalate to `backed up` or `synced` language in any of the three states. Those are earned by a real cloud peer, not by persistent mode.

### Allowed actions under weak connectivity


| Action                              | Expected M001 behavior       |
| ----------------------------------- | ---------------------------- |
| Start a loaded session              | Allowed                      |
| Resume an interrupted local session | Allowed                      |
| Advance blocks                      | Allowed                      |
| Pause / resume                      | Allowed                      |
| Finish session                      | Allowed                      |
| Save review                         | Allowed; write locally first |
| Pull a brand-new remote session     | Not part of M001             |


### Update-ready behavior

- `Update ready` should surface as a quiet safe-boundary action on home or after review confirmation.
- If a new version is discovered during an active session, defer the prompt until the user reaches home, finishes review, or explicitly exits.
- Preserve local state before any user-accepted refresh.

## What users need to understand

Users do not need sync mechanics.

They only need to know:

- their session is safe on this device
- they can keep going without signal
- if backup exists later, it can catch up quietly in the background
- `Saved on device` means the session lives on this phone, not everywhere

## Copy principles

Good:

- `Saved on device`
- `Update ready`
- `You can keep training`
- `Resume where you left off`
- `No account needed to start`

Bad:

- `Conflict detected`
- `Transport error`
- `Sync queue failure`
- `Saved everywhere`

## Pair fallback note

If a session assumes a pair and reality changes, the home surface should expose a simple fallback adjustment before the run starts.

This should feel like a practical adjustment, not an error state.

## Async share assumptions (forward-looking, not M001 scope)

M001 is single-user, single-device, no backend. But the session object model should not paint itself into a corner that makes coach clipboard sharing impossible later. These assumptions define the boundaries without designing transport or backend architecture.

### Smallest shareable session artifact

A session that can eventually be shared with a coach must carry:

- a stable, client-generated immutable ID
- an ordered drill list with each drill's parameters and constraints
- editable session-level parameters (duration, player count, focus)
- a compact completion record: did the session happen, sRPE, one skill proxy, short note, and the derived adaptation outcome (progress / hold / deload)

This is the same object model M001 already needs for local persistence and duplicate/edit. No extra schema is required for future sharing; the session just needs to be serializable and identifiable.

### Sharing posture

- Sharing is async and proposal-based, not live co-editing. A coach receives a snapshot, not a live cursor.
- The athlete's device remains the source of truth for their training data. A shared snapshot is a copy, not a transfer of ownership.
- Sharing should work offline-first: the athlete completes and reviews a session locally, and the share happens as eventual sync when connectivity is available.
- If a share fails, the session is still safely stored on device. The share can retry quietly.

### User-visible messaging for future share states

When sharing exists, the user-visible language should follow the same device-first pattern as local save:

- `Shared with coach` — the snapshot was delivered
- `Share pending` — the session is complete locally but has not reached the coach yet
- `Could not share yet` — subtle, non-blocking, with quiet retry

These states should never interrupt an active session or review flow.

### What this section intentionally does not define

- Transport mechanism (push, pull, pub/sub, cloud peer relay)
- Backend schema or API design
- CRDT or conflict resolution strategy
- Coach-side UI for receiving or acting on shared sessions
- Multi-athlete management or roster structures

These belong in Phase 1.5+ implementation planning if the coach clipboard gate clears.

## Open follow-up for implementation planning

- when to ask for persistent browser storage in the first-save flow
- what export or backup fallback should exist if persistent storage is unavailable on a user's device
- what user-visible distinction, if any, should exist between local save success and later cloud backup once a peer exists
- what exact copy and placement should the `Update ready` action use on home and post-review surfaces
- whether the session completion record should include a structured "coach-readable" summary or just raw fields

## Related docs

- `docs/vision.md`
- `docs/prd-foundation.md`
- `docs/decisions.md`
- `docs/specs/m001-quality-and-testing.md`