---

## id: M001-home-sync

title: M001 Home And Connectivity Notes
status: active
stage: validation
type: spec
authority: home screen states, weak-connectivity behavior, sync copy principles
summary: "Home screen states, first-run activation path, and weak-connectivity behavior."
last_updated: 2026-04-12
depends_on:

- docs/milestones/m001-solo-session-loop.md
- docs/prd-foundation.md
- docs/vision.md
decision_refs:
- D27
- D28
- D39
- D41
- D57
- D58
- D70

# M001 Home And Connectivity Notes

## Purpose

Capture the first mobile home-state assumptions and the user-visible behavior under weak connectivity.

The v0a validation prototype in `app/` currently implements a partial version of this spec. M001 full build remains gated by field testing.

## Default home state

The first mobile surface should answer one question:

`What should I do right now?`

It should not behave like a dashboard, drill browser, or coach console in the first milestone.

It should also inherit the same outdoor-ready visual posture as run mode: one high-contrast light theme, large readable type, and one dominant primary action.

## Home state variants

### State 1: New user, before the first draft exists

Primary action:

- `Start first workout`

Supportive context:

- default first focus: `passing fundamentals for serve receive`
- a one-line explanation that this will create a short starter session, not a long setup flow

First-run intake should capture only:

- `skill level`
- today's player count

Immediately after, one compact `Today's Setup` step per `D90`-`D93` captures equipment chips and optional wind with 2-4 taps. This is a single "today" moment, not a second onboarding screen. See `docs/superpowers/specs/2026-04-11-v0-prototype-ladder-design.md` for the full first-run screen sequence.

Defer time profile, broader environment filters, explicit goals, account creation, and permissions until after the first starter session or when the user chooses to edit.

Do not ask for `Add to Home Screen` before the user can see a useful starter session.

### State 2: Session draft ready

Primary action:

- `Start session`

Secondary actions:

- `Edit session`
- `Switch to solo/pair fallback`

### State 3: Review pending

Primary action:

- `Finish last review`

Secondary action:

- `Review later`

### State 4: Last session complete, no draft ready

Primary action:

- `Duplicate last`

Secondary action:

- `Create new session`

## New user home after a first draft is generated

Show:

- current primary skill focus
- next suggested session
- session duration
- why it is short and starter-friendly
- one primary action: `Start session`

Secondary actions:

- `See why this session was chosen`
- `Edit session`

If the app is still running in Safari, this is an acceptable point to suggest `Add to Home Screen` with simple durability and repeat-use wording.

## Repeat user home

Show:

- next suggested session
- last session result
- simple status of review/adaptation

Preferred emphasis:

- `Start session`

Secondary actions:

- `Duplicate last`
- `Adjust for today`

If the app is still running in Safari, repeat-user home is also an acceptable place to remind the user about `Add to Home Screen`.

## Install posture for M001

- Official iPhone support baseline is `iOS 17+`.
- Primary tested posture is `Add to Home Screen` on `iOS 18.4+`.
- The app must still open and work in Safari with no install requirement.
- Encourage `Add to Home Screen` after the user sees first-session value or returns for repeat use.
- Declining install should not block session start, session resume, or review completion.

## Home-state priorities

Highest priority:

1. resume an in-progress session
2. finish a pending review
3. start the current draft session
4. see current focus
5. understand next recommendation

Lower priority:

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
- `Review pending`
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

### Local durability language

- `Saved on device` means the session is stored locally on this device.
- It does not mean the session is backed up remotely or available on another device.
- Do not use `synced`, `backed up`, or equivalent copy unless that is actually true.

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