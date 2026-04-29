---

## id: 2026-04-28-build17-pair-dogfeed-feedback

title: "Build 17 Pair Dogfeed Feedback (founder + Seb, 15 min, no net)"
type: research
status: active
stage: validation
authority: "Curated field feedback from the 2026-04-28 founder + Seb pair dogfeed against build 17. Captures partner-side positives, repeated frictions, and routing implications without changing canon decisions or firing gated work by itself."
summary: "Seb's 2026-04-28 build-17 pair no-net round validated the new drill subcategory/eyebrow cues and the optional-count posture, while repeating two friction clusters: cooldown/sub-block pacing beeps were not audible so he watched the timer, and the landing/entry surface still lacks an obvious way to change difficulty or skill level. Effort was moderate and appropriate. This note routes audio pacing to the existing P2-2/wake-lock/audio boundary and routes difficulty mutability to the existing skill-level-mutability evidence track."
last_updated: 2026-04-28
depends_on:

- docs/research/founder-use-ledger.md
- docs/plans/2026-04-26-pair-rep-capture-tier1b.md
- docs/plans/2026-04-20-m001-tier1-implementation.md
- docs/research/2026-04-27-cca2-dogfeed-findings.md
- docs/research/2026-04-28-audio-pacing-reliability-investigation.md
related:
- docs/research/partner-walkthrough-results/2026-04-21-tier-1a-walkthrough.md
- docs/plans/2026-04-27-per-drill-capture-coverage.md
decision_refs:
- D130
- D133

# Build 17 Pair Dogfeed Feedback

## Agent Quick Scan

- Session: 2026-04-28, founder + Seb, pair, 15 min, no net, build 17. Seb reported effort as moderate and appropriate.
- Positives: the drill subcategories were useful, and the option to count felt smart because the app did not force counting when the athlete did not want to.
- Frictions: cooldown/sub-block beeps were missing or inaudible, so Seb had to watch the timer; the landing/entry surface still does not make it obvious how to choose a new difficulty or skill-level setting.
- Routing: this note does not fire a new implementation plan by itself. It strengthens existing evidence tracks for audio pacing reliability and skill-level mutability, and it adds counterweight against making future live-count capture feel mandatory.

## Session Context

Seb's note names this as a "15 minute pair workout" on "build 17" with no net. The voice memo was delivered after the session and transcribed by the founder into the repo chat.

The memo did not include a Dexie export or exact drill list. Treat this as qualitative field feedback, not a validated execution-log trace.

## Findings

### F1 — Drill subcategories / block labels are useful

**Claim.** Seb explicitly liked "the subcategories on the drills." This validates the recent work that made block role and skill identity more visible through role/skill eyebrows and skill-led courtside copy.

**Why it matters.** The 2026-04-27 dogfeed finding F8 identified that users could not quickly tell whether a block was serving, setting, or passing. Today's positive read suggests the fix is directionally right: the structure is helping at courtside speed.

**Routing.** Positive validation only. Do not add new UI from this note.

### F2 — Optional counts are landing better than forced counts

**Claim.** Seb liked "the option to count" and called it user-thinking because "you don't always want to, or feel forced like you need to."

**Why it matters.** This is direct partner-side validation of `D133` Framing D: per-drill Difficulty is required, but Good/Total count entry stays optional. It also adds counterweight to the in-session running-counter pressure from the 2026-04-26 and 2026-04-27 sessions. A future live counter may still be justified, but it should preserve optionality and avoid making every rep feel administratively mandatory.

**Routing.** Keep under `docs/plans/2026-04-26-pair-rep-capture-tier1b.md` post-ship follow-ups and any future Framing C re-evaluation. This does not cancel the re-trigger evidence; it sharpens the design constraint.

### F3 — Cooldown/sub-block pacing beeps were missing or inaudible

**Claim.** Seb reported that beeps were missing for the timer "in between each move," especially around cooldown, so he had to watch the timer himself.

**Why it matters.** This repeats the older P2-2 pacing-audio complaint, but after the audio-primer/wake-lock and sub-block tick work had supposedly shipped. It could be an implementation regression, a metadata coverage gap, or the known iOS silent-mode / manual-lock boundary.

**Routing.** Follow-up investigation landed in `docs/research/2026-04-28-audio-pacing-reliability-investigation.md`.
It confirmed two app-side gaps and kept the remaining platform boundary explicit:

- `SafetyCheckScreen` primed audio and wake lock from Continue, but Run released wake lock before preroll/timer start.
- `d25-solo` was an active recovery candidate without `subBlockIntervalSeconds`; `d26-solo` and `d28-solo` were covered.
- There is no separate cooldown-start cue; cooldown uses the shared preroll, sub-block, end-countdown, and block-end cue system.
- Silent switch, manual lock, browser tab vs Home Screen PWA, and unsupported/denied Wake Lock remain real-device checks if the symptom repeats.

The narrow app-side fix holds wake lock while the active block is planned/prerolling/running and adds 30 s pacing metadata to `d25-solo`.

### F4 — Landing page and difficulty/skill-level mutability remain repeated asks

**Claim.** Seb called the landing page and the option to choose a new difficulty setting his "consistent point."

**Why it matters.** This reinforces the 2026-04-27 skill-level-mutability line item: the app captures `onboarding.skillLevel` once, but partner-side use keeps surfacing a need to adjust today's difficulty or skill level. The landing-page part also suggests the entry surface is not yet making the core controls feel discoverable.

**Routing.** Update the Tier 1c evidence track, but keep the existing separation:

- focus picker: "what skill do I want to train today?"
- skill-level mutability: "how hard should today's session be for me?"
- landing/home clarity: "where do I start or change those things?"

This note strengthens evidence. It does not by itself satisfy the strict scripted partner-walkthrough trigger in `docs/plans/2026-04-20-m001-tier1-implementation.md`.

### F5 — Moderate effort was appropriate

**Claim.** Seb described the effort as moderate and appropriate.

**Why it matters.** For a 15-minute no-net pair round, this is a small positive load-read: the session did not feel obviously too easy or too hard.

**Routing.** Ledger-level validation only. No load-rule change.

## Non-Findings

- Seb's microphone surprise appears to be about the voice-memo context, not an app microphone-permission issue. Do not route it as a product bug unless a future app-specific microphone expectation appears.
- The memo did not establish whether the count option was used, skipped, or merely appreciated as available.
- The memo did not establish whether the missing beeps were caused by silent mode, lock state, missing metadata, or app code.

## For Agents

- **Authoritative for**: the 2026-04-28 build-17 qualitative dogfeed read from Seb's voice memo.
- **Edit when**: a Dexie export, screenshot, or follow-up device-debug trace confirms or refutes one of the findings.
- **Belongs elsewhere**: implementation routing (`docs/plans/`), canonical decisions (`docs/decisions.md`), and the append-only behavioral session count (`docs/research/founder-use-ledger.md`).
- **Outranked by**: `docs/decisions.md`, `docs/specs/`, and validated execution-log evidence when available.