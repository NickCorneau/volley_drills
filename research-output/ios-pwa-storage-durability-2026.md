# iOS PWA storage durability in 2026

Raw research drop (2026-04-16). Frozen provenance for the curated note at
`docs/research/local-first-pwa-constraints.md`.

For a local-first product, the honest 2026 answer is this: on iPhone, **"saved on device" is true for an installed Add-to-Home-Screen web app, but it is not the same thing as "guaranteed to survive anything."** In iOS Safari without install, script-writable storage is still subject to the long-standing Intelligent Tracking Prevention rule that deletes site storage after **seven days of Safari use without user interaction on that site**. For Home Screen web apps, WebKit's documented intent is different: they have their **own usage counter**, are **not supposed** to be hit by Safari's seven-day ITP timer, and starting with Safari 17 / iOS 17 they also participate in the Storage API and the newer quota/eviction model. But installed web apps are still not native-app-style immortal storage: WebKit still documents **best-effort eviction** under overall quota and storage pressure, uses **heuristics** for `persist()`, and developers have continued to report production-only IndexedDB regressions on iOS 17.4 and even 18.0.1. The right product claim is therefore: **saved on this device, not backed up unless you enable sync/export, and still vulnerable to user clearing, OS reclamation, and browser bugs**.

## What the platform actually promises

The standards story and the WebKit story are not identical. The Storage Standard says the browser should clear **best-effort** storage under storage pressure first, and only if pressure continues should it involve the user before clearing **persistent** storage. In spec terms, `persisted()` answers whether the bucket is persistent, and `persist()` requests that the bucket be placed into persistent mode. That is the model many web developers assume.

WebKit's public policy is more conditional. Since Safari 17 / iOS 17, WebKit says the Storage API is "fully supported," `estimate()` returns quota information, persistent mode exempts an origin from eviction, and "critical bugs" were fixed so storage mode survives across sessions. But in the same storage-policy post, WebKit explicitly says it **grants persistence based on heuristics**, "like whether the website is opened as a Home Screen Web App." That means iOS does not expose a simple user-granted persistent-storage permission model like Firefox does; it exposes a heuristic one. The API is real, but the decision is browser-controlled.

That distinction matters for the team's current confusion. A `persisted() === false` result on localhost in Chrome on iPhone does **not** tell you the production state of an installed Safari web app. First, heuristics are origin- and context-sensitive; dev localhost, browser-tab usage, and installed standalone usage are not the same condition. Second, on iPhone the historical baseline has been WebKit everywhere; only in the EU from iOS 17.4 onward can approved browser apps use alternative engines, and Apple eventually restored Home Screen web apps there while keeping them built on the existing WebKit architecture. So "Chrome on iOS localhost" is the wrong test bed for "Safari Home Screen web app on production origin."

## What changed across iOS versions

### iOS 17

iOS 17 was the inflection point. WebKit formally switched from the old 1 GB-ish quota behavior to a disk-percentage model, documented origin quota and overall quota, said standalone Home Screen web apps have the **same quota class** as browser apps, and added full Storage API support. WebKit also documented the new eviction model: origin-wide deletion, generally **least recently used**, with active pages and persistent-mode origins potentially excluded. That was a real improvement over the old "mysterious quota prompt in Safari / failure in Home Screen app" era.

But iOS 17 did **not** repeal the older ITP behavior for ordinary Safari browsing. WebKit's 2020 privacy post is still the core public statement: Safari deletes **IndexedDB, localStorage, sessionStorage, service worker registrations, and cache** after seven days of Safari use without user interaction on the site. In that same post, WebKit drew an explicit carveout for Home Screen web apps, saying their days-of-use counter is separate and that it does **not expect** first-party data in such web apps to be deleted by ITP. That is the root of the installed-vs-not-installed durability split that still defines the platform.

### iOS 17.4

The headline 17.4 event was political, not storage-technical: in beta, Apple temporarily removed Home Screen web apps in parts of the EU while preparing for alternative browser engines, then reversed course before release and restored the existing WebKit-based Home Screen web app functionality. So for storage durability, the final public 17.4 story is not "PWAs died"; it is "existing HSWA behavior stayed, but Apple showed willingness to change packaging rules quickly."

The more important storage story in 17.4 was an **IndexedDB regression**. A widely reported WebKit bug tied to iOS 17.4 caused "Connection to Indexed Database server lost" failures, with multiple developers reporting real user data loss and saying reloads or reopens often did not recover the database connection. WebKit later said it believed an OS-side fix landed in iOS 17.6 beta and iOS 18 beta, but developers continued reporting similar failures afterward. For a local-first app, that bug matters more than any marketing line about "full Storage API support," because it shows that production durability can still be undermined by platform regressions even when the documented policy sounds favorable.

### iOS 18 and iOS 18.4

Public WebKit release notes for Safari 18 did **not** announce a new storage-durability policy. The storage item in Safari 18 was removal of the last AppCache remnants, not a redefinition of eviction or persistence. Safari 18.4's storage note was about `Clear-Site-Data` behavior for partitioned cookies, again not a new policy for IndexedDB / Cache Storage / localStorage durability. In other words, the best public reading is that the **Safari 17 storage model continued through iOS 18**, with bug fixes and adjacent changes but no announced "native-app-like permanence" upgrade.

That unchanged-policy reading is also why the 17.4-era IndexedDB bug still matters. Developers reported in October 2024 that the connection-loss problem still occurred on iOS 18.0.1. So there is no clean story where iOS 18 suddenly turned installed PWAs into fully reliable long-term databases. The public evidence says the policy stayed mostly the same and implementation quality continued to vary by release.

### Current public release in April 2026

A date clarification matters here. As of **April 16, 2026**, Apple's current public iPhone line is **iOS 26.4.x**, not iOS 18.x. Apple's support pages show iOS 26.4 released on March 24, 2026, and Apple deployment docs reference iOS 26.4.1. Safari 26.4's storage note is still not a new durability policy; it mentions an IndexedDB metadata fix. Safari 26.0 also added a privacy measure that blocks known fingerprinting scripts from setting long-lived script-written storage, which shows storage policy is still moving in narrow, privacy-motivated ways. The important point is that **Apple has not publicly announced a replacement for the Safari 17 storage model**. The current public evidence says: same broad model, continuing implementation fixes.

## What "saved on device" means for each storage type

WebKit's policy applies at the origin/storage-bucket level, not as three independent durability classes for IndexedDB, Cache Storage, and localStorage. The official scope of the modern storage policy includes **localStorage, Cache API, IndexedDB, Service Worker, and File System** data; the 2020 ITP post also explicitly lists IndexedDB, localStorage, and service-worker cache among the script-writable stores that get purged in ordinary Safari after seven days without interaction. So for the product claim, there is no special loophole where localStorage is fragile but IndexedDB is safe, or vice versa, in non-installed Safari. They all sit under the same broad retention policy.

Where they differ is practical reliability and appropriate use. IndexedDB is still the right primary local database for user-created structured data. Cache Storage is best treated as **rebuildable** storage for app shell and fetched resources. localStorage remains synchronous, small, and historically more failure-prone in WebKit edge cases; old WebKit bugs include localStorage/sessionStorage becoming disconnected from persistent backing and Home Screen apps intentionally not sharing storage with Safari. Even when persistent mode is granted, you should still architect as if only IndexedDB is mission-critical and everything else is auxiliary.

The installed/non-installed split is also still real at the store namespace level. WebKit explicitly says Home Screen apps are isolated entities without shared state with the browser, and developer reports have shown Safari and the Home Screen instance keeping separate storage. So if a user opens the URL in Safari, creates data there, and later installs the web app, you cannot assume the installed app sees the same local DB. That is a product and migration problem, not just a browser oddity.

## What actually causes data loss

There are four distinct loss modes, and mixing them up is where teams overpromise.

The first is **ITP inactivity deletion in non-installed Safari**. This is the documented seven-day rule, and the clock is based on **Safari use without user interaction**, not simply wall-clock time. For Home Screen web apps, WebKit says the usage counter is their own, tied to actual web-app use, and it does not expect first-party data there to be deleted by ITP. That means a 7 / 14 / 30 / 60 / 90 day matrix should not be described as a single calendar-time durability ladder. For browser tabs, seven days is a real boundary. For installed Home Screen apps, there is **no public WebKit document** establishing a 14-day, 30-day, 60-day, or 90-day idle purge schedule.

The second is **quota and storage-pressure eviction**. WebKit says eviction can happen when overall quota is exceeded or the system is under storage pressure, that eviction is normally whole-origin and LRU-ordered, and that persistent-mode origins may be excluded. Hitting origin quota yields a `QuotaExceededError`; hitting overall quota or storage pressure can delete origin data. The Storage Standard imagines user involvement before clearing persistent data, but the practical web-platform experience on Safari has often looked like silent disappearance or follow-on errors, not a friendly system dialog. WebKit's own old quota prompt is gone in Safari 17+, and bug reports show storage loss surfacing as logout, missing settings, or broken IndexedDB connections.

The third is **explicit user action**: clearing browser/site data, removing app/site state, deleting the Home Screen app if that instance owns the only local copy, restoring from a backup that does not contain the expected origin state, or logging out of an app that intentionally clears local versions. Comparable products treat these as real risks and communicate them as such.

The fourth is **browser bugs and process crashes**. The iOS 17.4 IndexedDB regression is the clearest recent example, and the Safari 17 storage-erasure bug on macOS is another reminder that WebKit storage regressions can exist outside the documented policy. For a local-first product, the correct mental model is not merely "what is the policy," but "what survives policy plus bugs."

## What iCloud changes and what it does not

The public documentation available from Apple describes **whole-device transfer and restore** via iCloud backup and Quick Start, not a per-origin guarantee that Safari / Home Screen web-app storage is continuously synced across devices. Separately, Maximiliano Firtman's long-running iOS PWA compatibility note lists **"App Installation Recovery with Backup"** as supported on iOS, which matches the general idea that installation state can return with device restore. Those two facts support a narrow conclusion: **backup/restore may help reproduce the installed app state on a restored device, but you should not market local web storage as iCloud-synced app data.**

So the safe product position is: do **not** assume IndexedDB, Cache Storage, or localStorage replicate to the user's other devices through iCloud in the way native app sync systems do. If you want cross-device continuity, you must build or buy an explicit sync or export path. Comparable apps communicate exactly that distinction: local copy, sync, and backup are different promises.

## The right detection strategy in production

You cannot prove "native-style permanence" on iOS from one boolean. What you can do is build the strongest truthful state model the platform exposes.

At runtime, detect four things on the **real production origin** and on a **real iPhone**. First, detect installation posture: `matchMedia('(display-mode: standalone)')`, `navigator.standalone`, and whether a service worker is active. Second, call `navigator.storage.persisted()` on boot. Third, after an actual user gesture tied to "save locally/offline," call `navigator.storage.persist()` and immediately re-check `persisted()`. Fourth, record `navigator.storage.estimate()` plus real write/read probes for IndexedDB, Cache Storage, and localStorage, and keep a durable sentinel record with a schema version and checksum. That is the most faithful way to map the WebKit model to a product state machine.

The key rule is this: on iOS, treat `persisted() === true` as the **strongest observable signal** that WebKit has placed the origin in persistent mode. Treat `persisted() === false` as **not persistent yet**, even if the app is installed. Why so strict? Because WebKit's own docs say requests are heuristic and because installed Home Screen apps are intended to be exempt from ITP even before you reason about persistent mode. In other words, there are two durability layers on iPhone: the Home Screen carveout from the seven-day Safari timer, and the newer persistent-mode exemption from eviction. Those are related, but not identical.

For product decisions, the most useful runtime matrix is:

- **Browser tab, not installed** → local browser storage only; treat as seven-day-risky on iPhone Safari.
- **Installed, `persisted() === false`** → better than a browser tab because of the Home Screen carveout, but still best-effort under pressure and bug risk.
- **Installed, `persisted() === true`** → strongest local-only durability state WebKit publicly exposes, but still **not a backup** and not a guarantee against user clearing or implementation regressions.

You also need health telemetry. Listen for IndexedDB open failures, transaction failures, unexpected `close` events, cache open failures, and `QuotaExceededError`. Ship those with OS version, install posture, `persisted()` result, free-space estimate, and last-successful local checkpoint timestamp. Recent WebKit bugs show why this matters: the policy can be unchanged while the implementation is broken on a point release.

## The copy that is honest without being self-defeating

The bad pattern is a blanket claim like "Saved on device" with no distinction between local, durable, synced, and backed up. Public product docs from Excalidraw, Figma, TickTick, Notesnook, and Obsidian converge on a better pattern: distinguish **local save**, **sync**, and **backup/export**. Excalidraw's public site says drawings are stored locally in LocalStorage, while its paid tier separately says scenes are securely saved in the cloud; Figma says offline changes sync when connection returns and that "Save local copy" is only a snapshot / last resort; Notesnook says backups are stored locally encrypted and that note history is local-only; Obsidian says Sync makes off-site copies while a local copy remains on the device; TickTick separately markets real-time sync and exposes backup/import settings.

The especially telling signal is Excalidraw's January 2026 issue asking them to change the reassuring line "All your data is stored locally in your browser" because users can misread it as a guarantee against loss. That is exactly the trap this team should avoid. "Local" is not the same as "durable," and "durable" is not the same as "backed up."

The copy pattern I would recommend is three explicit states.

For **browser-tab Safari on iPhone**:
**Saved in this browser on this device**
Secondary copy: *Available offline here, but iPhone Safari may remove browser data if the site is not used for a while or if browser data is cleared.*

For **installed Home Screen app, `persisted() === false`**:
**Saved on this device**
Secondary copy: *Stored locally in the installed app. Not backed up unless you enable sync or export. iOS can still remove local data if site/app data is cleared, device storage is reclaimed, or a browser bug occurs.*

For **installed Home Screen app, `persisted() === true`**:
**Saved on this device**
Secondary copy: *Stored locally with the strongest storage durability this browser currently exposes. Still not a backup. Use sync or export for recovery and moving to another device.*

That wording does not undersell the product. It tells the truth: the user really does have a local copy, but recovery and cross-device continuity are separate features.

## The real-device test protocol you should run before shipping the claim

Build a production-only storage diagnostics page on the actual HTTPS origin. It should show install posture, `persisted()` before and after `persist()`, quota/usage from `estimate()`, service-worker status, and pass/fail probes for IndexedDB, Cache Storage, and localStorage. Each probe should write a known sentinel value and checksum, read it back, and log to the telemetry endpoint. Do **not** test only on desktop Chrome, Android Chrome, or localhost browser tabs. Those are different storage policies, different heuristics, or the wrong install context.

Run four cohorts on physical iPhones: Safari tab only; installed Home Screen app opened daily; installed app left unopened while the user keeps using Safari for other browsing; and installed app under device storage pressure. For the inactivity cohorts, measure in terms of **actual days of Safari use** and **actual days of installed-app non-use**, because WebKit's seven-day rule is tied to Safari use, not simple elapsed calendar time. For the storage-pressure cohort, fill the phone close to full with large media/native apps, then reopen the harness and compare all three stores. This is the only way to learn whether the app is relying on the Home Screen carveout alone or is actually getting persistent mode remembered in the field.

Add a migration cohort. Put data into Safari first, then install the app and verify whether the installed instance sees it. WebKit's documented answer is "no shared state by design," so you need either a one-time import bridge or a product flow that warns users before they "promote" a browser session into an installed app. Otherwise you will create a fake data-loss incident at install time.

Add a restore cohort. Back up the device, wipe it, restore it, and check whether the Home Screen icon returns and whether the local sentinel data survives. Then repeat with Quick Start to a new phone. Because Apple's public docs only promise device restore/transfer at a broad level, not per-origin sync semantics, you should treat this test as product validation, not as a documented platform guarantee.

Finally, keep this harness live in production behind an internal flag. The iOS 17.4 IndexedDB regression is the warning shot: the storage story on iPhone is not defined once and forever by docs. It is defined by docs **plus the currently shipped build**. The trust model should therefore be continuously verified, release by release. The strongest claim you can responsibly make in 2026 is not "permanent," but "saved locally on this device, with explicit sync/export available for backup and transfer."

## The factual picture to use internally

If you need one internal sentence to align the team, use this:

**Non-installed iPhone Safari remains seven-day-risky. Installed Home Screen web apps are intended to be exempt from that timer and can often become persistent via WebKit heuristics, but they are still not equivalent to native-app storage guarantees. `persisted() === true` is the strongest observable state; anything less should be treated as best-effort local storage, not backup.**

And if you need one user-facing sentence, use this:

**Saved on this device. Not backed up unless you enable sync or export.**
