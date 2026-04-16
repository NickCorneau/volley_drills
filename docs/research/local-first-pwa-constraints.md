---
id: local-first-pwa-constraints
title: Local-First PWA Constraints
status: active
stage: validation
type: research
authority: iPhone/PWA platform constraints, storage durability, update safety, and degraded-capability defaults
summary: "iPhone/PWA platform constraints, the 2026 three-layer storage-durability model, three-state save copy, update safety, and the real-device test protocol for M001."
last_updated: 2026-04-16
depends_on:
  - docs/vision.md
  - docs/decisions.md
related:
  - docs/research/README.md
  - docs/research/dexie-schema-and-architecture.md
  - docs/research/courtside-timer-patterns.md
  - research-output/ios-pwa-storage-durability-2026.md
---

# Local-First PWA Constraints

## Purpose

Capture the platform findings that materially affect the current web-first, iPhone-heavy validation setup.

This note is about platform reality, not drill design or training content. Those stay in `docs/research/beach-training-resources.md`.

Dexie-specific schema, indexing, and architecture guidance lives in `docs/research/dexie-schema-and-architecture.md`.

The raw 2026 research drop behind the refreshed storage-durability section lives at `research-output/ios-pwa-storage-durability-2026.md`.

## Use This Note When

- you need to reason about iPhone or Safari behavior that changes product requirements
- you need storage-durability, update-safety, install-posture, or graceful-degradation guidance
- you need to decide whether a capability is mandatory, best-effort, or unsafe to promise in M001
- you are writing local-save copy, install-nudge copy, or any user-facing language about where data lives

## Bottom line

The current product direction still makes sense:

- single-device local-first remains a credible Phase 1 validation posture
- web-first delivery still fits the speed and distribution goals
- the risk is not "PWAs are impossible"
- the real risk is treating iPhone web-platform limits as implementation trivia instead of product-shaping constraints

The biggest existential risk to "no backend, everything local" is not technical difficulty but **silent data loss under Safari's storage eviction policies and WebKit implementation regressions**. This is now better understood and has a clearer mitigation path, but the earlier simplification that "installed = persistent" is wrong and has to be replaced with a three-layer durability model and three-state user copy.

## Recommended working baseline

- Official iPhone support baseline for M001: `iOS 17+` (first release with the new Storage API + Home Screen carveout story)
- Primary tested posture for repeat-use trust: `Add to Home Screen` on the **current public iOS line** at test time; as of April 2026 that is `iOS 26.x`
- Entry posture: Safari with no install requirement
- Install timing: encourage after the user sees first-session value or returns for repeat use, not before value
- Dev-bench caveat: `persisted() === false` on localhost Chrome on an iPhone is **not** evidence about production. Persistence is WebKit-heuristic and context-sensitive; measurement has to happen on the real production origin in an installed Home Screen instance (see Real-device test protocol below).

## The 2026 three-layer durability model

The earlier version of this note said: `7-day Safari cap -> installed PWA is exempt -> data is persistent.` That is too simple and overpromises. The accurate 2026 picture has **three layers** that interact.

### Layer 1: Intelligent Tracking Prevention (ITP) seven-day rule

Ordinary Safari applies a seven-day cap on script-writable storage (IndexedDB, Cache API, localStorage, sessionStorage, service-worker registrations) for sites without user interaction. The clock is tied to **days of Safari use without interaction on that site**, not simple calendar time.

- Affects: Safari browser tab, no install.
- Does not affect: Home Screen web apps, which WebKit explicitly says have their own usage counter and are not expected to be hit by this timer.

### Layer 2: Home Screen carveout from the ITP timer

Once the user adds the app to Home Screen, the installed instance is treated as a separate entity with its own usage counter. WebKit says it does not expect first-party data in Home Screen web apps to be deleted by the seven-day timer. This is a real durability upgrade over a browser tab.

**But** this is not the same as native-app-style immortality. Two important subtleties:

- Home Screen apps are **isolated** from the Safari browser namespace. If a user creates data in Safari first and then installs, the installed instance is not guaranteed to see it. This is a migration problem, not a browser oddity.
- The Home Screen carveout alone is about the ITP timer. It does **not** speak to quota-pressure eviction or implementation bugs. For those, we need Layer 3.

### Layer 3: Quota/pressure eviction + persistent-mode exemption (`persist()` / `persisted()`)

Starting with Safari 17 / iOS 17, WebKit supports the Storage API (`navigator.storage.persist()`, `persisted()`, `estimate()`). Persistent mode exempts an origin from quota-pressure eviction. But:

- WebKit **grants persistence based on heuristics**, not a user-granted permission. The heuristics consider signals like "is this a Home Screen web app." The API is real; the decision is browser-controlled.
- Eviction under storage pressure is still documented as whole-origin and LRU-ordered.
- Implementation regressions exist (see iOS 17.4 IndexedDB connection-loss bug, continuing reports on iOS 18.0.1).

The practical runtime matrix M001 should reason in terms of:

| Posture | ITP 7-day risk | Quota-pressure risk | Implementation-bug risk |
| --- | --- | --- | --- |
| Browser tab, not installed | **Yes** (Safari use without interaction) | Yes | Yes |
| Installed HSWA, `persisted() === false` | No | Yes (best-effort) | Yes |
| Installed HSWA, `persisted() === true` | No | Exempt per policy (not bug-proof) | Yes |

This matrix is what drives the copy pattern and detection logic below. `persisted() === true` is the strongest observable state; it is still **not** a backup.

## What "saved on device" means for each storage type

WebKit's policy applies at the origin/bucket level, not per-API. IndexedDB, Cache Storage, localStorage, sessionStorage, service workers, and File System sit under the same retention policy in non-installed Safari. There is no loophole where one store is safe while another is fragile.

Where they differ is practical reliability and appropriate use:

- **IndexedDB (via Dexie)**: the right primary local database for user-created structured data. Mission-critical.
- **Cache Storage**: treat as **rebuildable** app-shell and fetched-resource cache. Never the primary copy.
- **localStorage**: synchronous, small, historically more failure-prone in WebKit edge cases. Suitable for tiny preferences only.

Even when persistent mode is granted, architect as if only IndexedDB is mission-critical and everything else is auxiliary.

## High-confidence guidance

### 1. Keep M001 scoped to single-device trust

- M001 should continue to optimize for one user on one device.
- Starting, running, pausing, resuming, and reviewing must work with no network connection.
- Cross-device sync should stay deferred until the single-device loop feels trustworthy.

### 2. Treat install as the first durability upgrade, not the final one

- For any long-term data promise on iPhone, Home Screen install is the first real durability boundary.
- M001 should **strongly encourage Home Screen install**, but not gate the first useful session behind install.
- The install nudge copy should lean on repeat-use benefit and durability in plain language ("Add to Home Screen to keep your training data safe"), not on "permanent" or "synced" language, which would be wrong.
- Even with install, request `navigator.storage.persist()` at a meaningful first-save boundary and treat `persisted() === true` as the strongest observable state — not a guarantee.

### 3. Ship a three-state save copy pattern, not a blanket claim

A blanket `Saved on device` line is already live in `app/src/screens/CompleteScreen.tsx`. It is not wrong for an installed HSWA user but it overpromises for a Safari-tab user. M001 (latest, post-D91-field-test) should wire the runtime posture detection into three explicit states:

- **Browser-tab Safari, not installed**: primary `Saved in this browser on this device`; secondary *Available offline here, but iPhone Safari may remove browser data if the site is not used for a while or if browser data is cleared.*
- **Installed HSWA, `persisted() === false`**: primary `Saved on this device`; secondary *Stored locally in the installed app. Not backed up unless you enable sync or export. iOS can still remove local data if site/app data is cleared, device storage is reclaimed, or a browser bug occurs.*
- **Installed HSWA, `persisted() === true`**: primary `Saved on this device`; secondary *Stored locally with the strongest storage durability this browser currently exposes. Still not a backup. Use sync or export for recovery and moving to another device.*

See `docs/specs/m001-home-and-sync-notes.md` "Local durability language" for the canonical copy spec. See `D39` and `D118` in `docs/decisions.md` for the decision framing.

### 4. Use controlled update activation

- Session-critical flows should never auto-activate a new app version mid-session.
- Favor a refresh prompt or next-launch activation at safe boundaries such as home, review completion, or explicit restart.
- A slightly stale app is safer than mixing old and new assets during a live practice.

### 5. Design the courtside loop to survive missing device APIs

- Wake lock is helpful when available, but the run flow cannot depend on it.
- Vibration or haptics should be optional only; no critical state change should rely on them.
- Backgrounding or phone lock may interrupt timer precision, so recovery state matters more than perfect continuity.

### 6. Treat iPhone install posture as a real product variable

- In-browser Safari and Home Screen web apps behave differently in important ways (storage eviction, wake lock, notification support, namespace isolation).
- M001 should be usable in both, with Safari as the low-friction entry posture and Home Screen as the primary repeat-use posture to test most deeply.
- Given the seven-day ITP rule on browser tabs, Home Screen install should be actively encouraged, not merely supported — but the prompt should follow first-session value rather than block it.
- If Home Screen install unlocks better wake-lock behavior, that is a bonus on top of the ITP-carveout benefit.

### 7. Build the Safari→install migration bridge (or warn the user)

Home Screen apps are isolated entities without shared state with Safari. If a user creates data in Safari and then installs, the installed instance may **not** see that data. Two safe options:

- Offer a one-time export-and-import bridge on the first post-install boot when Safari-origin data is detectable.
- Or warn the user before they install that promoting to the Home Screen app will start a fresh local store.

Do not silently drop Safari-tab data at install time; that will read as data loss.

### 8. Apply the research to the current codebase

- `app/` contains a runnable v0a validation PWA with `vite-plugin-pwa`, Dexie persistence, and a service worker.
- `requestPersistentStorage()` is called at startup in `main.tsx`; it returns a boolean from `navigator.storage.persist()`.
- The service worker currently uses `registerType: 'autoUpdate'` with `immediate: true` — a v0a exception to D41 safe-boundary updates that should be revisited before broader field testing.
- The `Saved on device` line on `CompleteScreen.tsx` is currently posture-insensitive; wiring the three-state copy pattern is tracked as a pre-field-test follow-up (see Open questions below).
- A production-only storage diagnostics page does not exist yet. It should be built before any strong durability claim is made in release copy.

## IndexedDB and Dexie failure modes on mobile

These are implementation-level details that should inform defensive coding during M001 build.

### QuotaExceededError

Dexie documents `Dexie.QuotaExceededError`, but on some browsers it surfaces as an inner error wrapped in `AbortError`. Reliable handling requires inspecting inner errors, not just catching the top-level type. This matters most on mobile where storage quotas are tighter.

### Multi-tab upgrade blocked

When another tab holds an open Dexie connection during a schema version upgrade, the upgrade blocks. Dexie fires a `blocked` event. The app should handle this gracefully with a user-facing message ("Please close the other tab to continue").

### Safari IndexedDB instability

Dexie maintains Safari-specific guidance because Safari's IndexedDB implementation has historically been less stable than Chrome's. Known regressions include the iOS 17.4 "Connection to Indexed Database server lost" bug that caused real user data loss in production apps and continued to surface on iOS 18.0.1 per public developer reports. This reinforces the "checkpoint often, keep writes small" stance and the case for active health telemetry.

### Transactions and async pitfalls

IndexedDB transactions become inactive between event-loop tasks. Long `await` chains inside a transaction can cause "transaction inactive" failures. Dexie abstracts much of this, but the underlying reality supports the "keep DB writes small and checkpointed" design principle.

## Storage health telemetry

Before field testing and before any strong durability claim in release copy, the app should emit and persist minimal storage-health signals:

- IndexedDB open failures, transaction failures, unexpected `close` events
- Cache Storage open failures
- `QuotaExceededError` events with approximate write size
- Reported install posture (`matchMedia('(display-mode: standalone)')`, `navigator.standalone`)
- `persisted()` result at boot and after first post-gesture `persist()`
- `estimate()` quota/usage
- Last-successful local checkpoint timestamp
- iOS version (from UA, with the usual caveat that Safari narrows UA)

Recent WebKit regressions show why policy alone is not enough: a release can keep the documented policy unchanged while the implementation is broken on a point release. A live telemetry signal is the only way to catch that in the field without waiting for user reports.

## Real-device test protocol (pre-field-test, pre-claim)

Build a production-only storage diagnostics page on the actual HTTPS origin. It should show install posture, `persisted()` before and after `persist()`, quota/usage from `estimate()`, service-worker status, and pass/fail probes for IndexedDB, Cache Storage, and localStorage. Each probe should write a known sentinel value and checksum, read it back, and log to telemetry. Do not test only on desktop Chrome, Android Chrome, or localhost browser tabs — those are different storage policies, different heuristics, or the wrong install context.

Run four cohorts on physical iPhones:

1. **Safari tab only** — measure behavior over actual days of Safari use without interaction on the site.
2. **Installed HSWA opened daily** — baseline control for installed durability.
3. **Installed HSWA left unopened** while the user keeps using Safari for other browsing, to confirm the Home Screen carveout holds across Safari-use days.
4. **Installed HSWA under device storage pressure** — fill the phone close to full with large media/native apps, then reopen the harness and compare all three stores.

Add a **migration cohort**: put data into Safari first, then install the app and verify whether the installed instance sees it. WebKit's documented answer is "no shared state by design," so the harness validates the bridge or warning pattern.

Add a **restore cohort**: back up the device, wipe it, restore it, and check whether the Home Screen icon returns and whether the local sentinel data survives. Repeat with Quick Start to a new phone. Apple's public docs only promise whole-device restore at a broad level, not per-origin sync semantics, so treat this as product validation, not as a documented platform guarantee.

Keep the harness live in production behind an internal flag. The iOS 17.4 IndexedDB regression is the warning shot: durability on iPhone is defined by docs **plus the currently shipped build**, so the trust model must be continuously verified release by release.

## Implications for current docs

- `docs/decisions.md` captures the durability-state-machine and three-state copy decision (`D39`, `D118`), plus the supported iOS baseline and primary-tested posture (`D57`, `D58`).
- `docs/specs/m001-home-and-sync-notes.md` owns the canonical copy spec for the three states.
- `docs/specs/m001-courtside-run-flow.md` continues to treat wake lock, haptics, and background timing as best-effort helpers rather than guaranteed capabilities.
- `docs/milestones/m001-solo-session-loop.md` treats iPhone-heavy constraints as part of milestone realism, not a later implementation footnote.
- `docs/roadmap.md` Phase 1 exit criteria should include "three-state save copy wired to runtime posture detection" before durability is claimed in release copy.

## Open questions to resolve before implementation planning

- What copy and trigger should the post-value Home Screen nudge use, and how often should it reappear after decline?
- What does the real-device test matrix look like as a shippable harness, and where does it live in the repo (internal flag on the production origin)?
- When does export move from principle to explicit milestone requirement? (The iOS 17.4-style implementation-bug risk strengthens the case for M001, not Phase 1.5.)
- Should M001 include a storage-health diagnostic that warns users if persistent storage was not granted, or is the three-state copy pattern the whole surfacing?
- How should the Safari -> HSWA migration bridge behave in M001 (one-time import vs pre-install warning)?

## Source families from the research pass

- WebKit blog: 2020 ITP / Full Third-Party Cookie Blocking post (seven-day script-writable-storage rule; Home Screen carveout)
- WebKit blog: Safari 17 / iOS 17 storage-policy update (disk-percentage quota, Storage API support, heuristic persistence, LRU eviction)
- WebKit bug tracker + developer reports: iOS 17.4 "Connection to Indexed Database server lost" IndexedDB regression; continuing reports on iOS 18.0.1
- Safari 18 / 18.4 release notes (no new durability policy; Clear-Site-Data adjustments for partitioned cookies)
- Safari 26.x release notes (IndexedDB metadata fix; fingerprinter-storage restrictions in 26.0)
- W3C Storage Standard: `persist()`, `persisted()`, best-effort vs persistent buckets, user-involvement before clearing persistent
- Apple support: iCloud backup, Quick Start device transfer (whole-device, not per-origin sync)
- Firtman iOS PWA compatibility notes: App Installation Recovery with Backup
- MDN: Storage quotas and eviction criteria; IDBTransaction lifecycle
- whatpwacando.today: persistent storage — `navigator.storage.persist()` behavior and conditions
- W3C Service Workers and Screen Wake Lock specifications
- web.dev and Workbox guidance on service-worker update flows
- Vite PWA update-strategy documentation
- Dexie docs: `QuotaExceededError`, `blocked` event, Safari issues, `Version.stores()`
- Comparable product copy: Excalidraw, Figma, TickTick, Notesnook, Obsidian (distinguishing local save vs sync vs backup/export)
- Ink & Switch: "Local-first software" (framing for user ownership and reliability expectations)
- MDN: PWA offline/background operation guide
