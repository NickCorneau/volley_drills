---
id: local-first-pwa-constraints
title: Local-First PWA Constraints
status: active
stage: planning
type: research
authority: iPhone/PWA platform constraints, storage durability, update safety, and degraded-capability defaults
summary: "iPhone/PWA platform constraints, storage durability, and update safety for M001."
last_updated: 2026-04-12
depends_on:
  - docs/vision.md
  - docs/decisions.md
related:
  - docs/research/README.md
  - docs/research/dexie-schema-and-architecture.md
  - docs/research/courtside-timer-patterns.md
---

# Local-First PWA Constraints

## Purpose

Capture the platform findings that materially affect the current web-first, iPhone-heavy validation setup.

This note is about platform reality, not drill design or training content. Those stay in `docs/research/beach-training-resources.md`.

Dexie-specific schema, indexing, and architecture guidance lives in `docs/research/dexie-schema-and-architecture.md`.

## Use This Note When

- you need to reason about iPhone or Safari behavior that changes product requirements
- you need storage-durability, update-safety, install-posture, or graceful-degradation guidance
- you need to decide whether a capability is mandatory, best-effort, or unsafe to promise in M001

## Bottom line

The current product direction still makes sense:

- single-device local-first remains a credible Phase 1 validation posture
- web-first delivery still fits the speed and distribution goals
- the risk is not "PWAs are impossible"
- the real risk is treating iPhone web-platform limits as implementation trivia instead of product-shaping constraints

The biggest existential risk to "no backend, everything local" is not technical difficulty but **silent data loss under Safari's storage eviction policies**. This is now better understood and has a clear mitigation path.

## Recommended working baseline

- Official iPhone support baseline for M001: `iOS 17+`
- Primary tested posture for repeat-use trust: `Add to Home Screen` on `iOS 18.4+`
- Entry posture: Safari with no install requirement
- Install timing: encourage after the user sees first-session value or returns for repeat use, not before value

## High-confidence guidance

### 1. Keep M001 scoped to single-device trust

- M001 should continue to optimize for one user on one device.
- Starting, running, pausing, resuming, and reviewing must work with no network connection.
- Cross-device sync should stay deferred until the single-device loop feels trustworthy.

### 2. Safari's 7-day storage cap is a first-order product risk

Safari applies a **7-day cap on script-writable storage** (IndexedDB, Cache API, and related mechanisms) for sites the user doesn't actively revisit. After 7 days of inactivity, Safari may purge all locally stored data.

This cap **does not apply to installed PWAs** added to the Home Screen. Once a user adds the app to their Home Screen, their data is treated as persistent and is not subject to the 7-day eviction window.

This means the product's data reliability is tightly coupled to install behavior:
- A user who bookmarks or visits in Safari but never installs may lose all training history after a week of not opening the app.
- A user who installs to Home Screen gets durable local storage.

**Implications:**
- M001 should **strongly encourage Home Screen install**, but not gate the first useful session behind install.
- The install prompt should communicate the durability benefit in plain language (e.g., "Add to Home Screen to keep your training data safe").
- Even with install, request `navigator.storage.persist()` where supported as an additional durability signal.
- Ship a one-tap "Export training history" as a safety net regardless of install status.

Sources: web.dev "Storage for the web", WebKit blog storage policy updates, MDN storage quotas and eviction criteria.

### 3. Treat `Saved on device` as strong local truth, but not as backup

- Local save messaging is still correct and important.
- It should not imply remote backup, cross-device availability, or cloud durability.
- Storage eviction and durability limits on iPhone web apps mean durability promises must stay precise until export or backup exists.

### 4. Use controlled update activation

- Session-critical flows should never auto-activate a new app version mid-session.
- Favor a refresh prompt or next-launch activation at safe boundaries such as home, review completion, or explicit restart.
- A slightly stale app is safer than mixing old and new assets during a live practice.

### 5. Design the courtside loop to survive missing device APIs

- Wake lock is helpful when available, but the run flow cannot depend on it.
- Vibration or haptics should be optional only; no critical state change should rely on them.
- Backgrounding or phone lock may interrupt timer precision, so recovery state matters more than perfect continuity.

### 6. Treat iPhone install posture as a real product variable

- In-browser Safari and Home Screen web apps behave differently in important ways (storage eviction, wake lock, notification support).
- M001 should be usable in both, with Safari as the low-friction entry posture and Home Screen as the primary repeat-use posture to test most deeply.
- Given the Safari 7-day eviction finding, **Home Screen install should be actively encouraged**, not merely supported, but the prompt should follow first-session value rather than block it.
- If Home Screen install unlocks better wake-lock behavior, that is a bonus on top of the storage durability benefit.

### 7. Apply the research to the current codebase, not an imagined future one

- `app/` is currently a React/Vite scaffold with Dexie dependencies, not a shipped PWA shell.
- There is no service worker or `vite-plugin-pwa` wiring yet.
- That is acceptable at this stage; the main value of this research is to shape the implementation plan before the PWA layer lands.

## IndexedDB and Dexie failure modes on mobile

These are implementation-level details that should inform defensive coding during M001 build.

### QuotaExceededError

Dexie documents `Dexie.QuotaExceededError`, but on some browsers it surfaces as an inner error wrapped in `AbortError`. Reliable handling requires inspecting inner errors, not just catching the top-level type. This matters most on mobile where storage quotas are tighter.

### Multi-tab upgrade blocked

When another tab holds an open Dexie connection during a schema version upgrade, the upgrade blocks. Dexie fires a `blocked` event. The app should handle this gracefully with a user-facing message ("Please close the other tab to continue").

### Safari IndexedDB instability

Dexie maintains Safari-specific guidance because Safari's IndexedDB implementation has historically been less stable than Chrome's. Known issues include lockups and background-tab corruption. This reinforces the "checkpoint often, keep writes small" stance.

### Transactions and async pitfalls

IndexedDB transactions become inactive between event-loop tasks. Long `await` chains inside a transaction can cause "transaction inactive" failures. Dexie abstracts much of this, but the underlying reality supports the "keep DB writes small and checkpointed" design principle.

Sources: Dexie docs on QuotaExceededError, blocked event, Safari issues, and MDN IDBTransaction.

## Implications for current docs

- `docs/decisions.md` should capture update-safety and graceful-degradation guardrails.
- `docs/specs/m001-home-and-sync-notes.md` should be explicit that local save is not the same as backup or sync.
- `docs/specs/m001-courtside-run-flow.md` should treat wake lock, haptics, and background timing as best-effort helpers rather than guaranteed capabilities.
- `docs/milestones/m001-solo-session-loop.md` should treat iPhone-heavy constraints as part of milestone realism, not a later implementation footnote.

## Open questions to resolve before implementation planning

- What copy and trigger should the post-value Home Screen nudge use, and how often should it reappear after decline?
- What device test matrix is required before any courtside pilot?
- When does export move from principle to explicit milestone requirement? (The Safari eviction risk strengthens the case for M001, not Phase 1.5.)
- Should M001 include a storage-health diagnostic that warns users if persistent storage was not granted?

## Source families from the research pass

- web.dev: "Storage for the web" — Safari 7-day cap and installed-PWA exception
- WebKit blog: storage policy updates — quota/eviction mechanics detail
- MDN: Storage quotas and eviction criteria — practical overview of browser limits
- whatpwacando.today: persistent storage — `navigator.storage.persist()` behavior and conditions
- W3C Service Workers and Screen Wake Lock specifications
- MDN storage, persistence, eviction, and vibration references
- web.dev and Workbox guidance on service-worker update flows
- Vite PWA update-strategy documentation
- Dexie docs: QuotaExceededError, blocked event, Safari issues, Version.stores()
- MDN: IDBTransaction — transaction inactivity between event-loop tasks
- Ink & Switch: "Local-first software" — framing for user ownership and reliability expectations
- MDN: PWA offline/background operation guide
