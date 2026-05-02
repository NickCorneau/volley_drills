---
id: calm-courtside-ux-style-ideation-2026-05-02
title: "Ideation: calm courtside UX/style improvements (2026-05-02)"
type: ideation
status: active
stage: validation
authority: "Ranked ideation artifact for UX/design/style changes adjacent to the 2026-05-02 calm recurring-user Home pass. Identifies high-leverage surfaces worth exploring under the current M001 / D130 founder-use posture. Does not author requirements; ce-brainstorm develops the selected survivor."
summary: "Fresh six-frame ideation pass for shibui, low-cognitive-load, courtside-mobile UI improvements. Six survivors: Active Session Glance System, Capture By Exception, Consequence-First Safety, Post-Session Receipt Layer, Local-First Trust Cues, and Tune Today Intent Dial. Active Session Glance System selected for ce-brainstorm."
last_updated: 2026-05-02
related:
  - docs/design/README.md
  - docs/research/brand-ux-guidelines.md
  - docs/research/japanese-inspired-visual-direction.md
  - docs/research/outdoor-courtside-ui-brief.md
  - app/README.md
decision_refs:
  - D91
  - D130
---

# Ideation: calm courtside UX/style improvements

## Grounding Context

This pass started from the user's clarification that "0 -> 1" applies to recurring users too: the app should protect attention, keep athletes calm and focused, and only spend cognitive effort when necessary.

Codebase context:

- Volleycraft is a React/Vite/TypeScript/Dexie local-first volleyball training PWA under `app/`.
- The current design direction is calm/shibui, courtside-mobile-first, low typing, outdoor legibility, and high-quality athlete UI rather than generic SaaS/dashboard/AI-coach UI.
- The latest Home pass already simplified recurring cards around direct actions such as `Continue`, `Repeat last session`, and `Finish review`.
- Local leverage points are Run density, active-session glanceability, `/run/check`, Tune Today, Safety consequence copy, Review/Complete, and Settings/offline/export confidence.
- `app/README.md` explicitly names body-scale shift and Run-screen content density as deferred design work.

External context:

- Wearable and field-work patterns favor one or two critical tasks, seconds-long interactions, glanceable states, offline confidence, local capture first, status cues, and post-session detail expansion.
- Coaching products commonly sell richer video, admin, cloud, and dashboard workflows. Volleycraft's strongest differentiation is restraint: a pocket field tool, not a coaching SaaS dashboard.

Past learnings:

- No prior `docs/solutions/` learning entries were found for this topic.
- Candidate durable learning after this pass: recurring-user surfaces should not carry first-time explanation; courtside UI should privilege low-typing tap flows; Home/Run/Setup copy should have one owner rather than scattered onboarding fragments.

## Ranked Ideas

### 1. Active Session Glance System

**Description:** Rework Run around a rangefinder/watch-face posture: one dominant reading, one current cue, one clear next action, and only quiet context for current/next/done. This can include a stricter hierarchy for timer/reps, a single "what now" coaching cue, and a restrained status treatment for where the athlete is in the session.

**Rationale:** Run is the moment with the highest attention cost, and the repo already names Run content density as deferred. The most valuable next design pass is likely not another Home polish pass; it is making the live training screen answer "what now?" in a five-second glance.

**Downsides:** Medium implementation surface. Over-simplifying Run could hide useful drill instruction, so this needs phone screenshots and dogfood before declaring success.

**Confidence:** 90%

**Complexity:** Medium

**Status:** Explored

### 2. Capture By Exception

**Description:** Make `/run/check` feel like a receipt or field notebook: default to a quick "felt right / log issue" style path, with counts, difficulty, streak, and details folded until needed.

**Rationale:** Per-drill capture is valuable, but post-block attention is scarce. This preserves local-first data capture while reducing the feeling of a form between drills.

**Downsides:** Needs care not to reduce useful signal quality for diagnostics and progress tracking.

**Confidence:** 88%

**Complexity:** Medium

**Status:** Unexplored

### 3. Consequence-First Safety

**Description:** Reframe Safety around outcomes: `Train normal`, `Go lighter`, or `Stop today`, with a one-line consequence receipt and calmer severity styling.

**Rationale:** Safety is high-stakes but should feel protective, not alarmist or medicalized. The user should know what the app will do with their answer without reading policy-like copy.

**Downsides:** Copy must stay precise enough for safety posture and test expectations.

**Confidence:** 82%

**Complexity:** Low-Medium

**Status:** Unexplored

### 4. Post-Session Receipt Layer

**Description:** Make Complete/Review first show closure: logged locally, session length/focus, one honest takeaway, and `Done`; stats, export, and detail expand after the athlete asks.

**Rationale:** After training, the app should make the athlete feel finished and safe, not force analysis when tired.

**Downsides:** Existing detail must not feel lost or buried; motivated users still need access to specifics.

**Confidence:** 84%

**Complexity:** Medium

**Status:** Unexplored

### 5. Local-First Trust Cues

**Description:** Introduce small consistent local/offline/export confidence language across Complete, Settings, and possibly Home: `Saved on this device`, `Ready offline`, `Export available`.

**Rationale:** Local-first trust is invisible until anxiety appears. Quiet repeated reassurance fits a field-tool product and reinforces the app's identity.

**Downsides:** Can become decorative clutter if repeated too often or placed in primary focal zones.

**Confidence:** 78%

**Complexity:** Low

**Status:** Unexplored

### 6. Tune Today Intent Dial

**Description:** Make Tune Today feel like a small pre-run ritual: focus choices with one-line consequence/confidence copy.

**Rationale:** Tune Today sits directly before Safety and can either feel like setup churn or a focusing breath before training.

**Downsides:** Less urgent than Run/Check because the current chip polish may already be acceptable.

**Confidence:** 72%

**Complexity:** Low-Medium

**Status:** Unexplored

## Rejection Summary

| # | Idea | Reason Rejected |
|---|------|-----------------|
| 1 | Dedicated glare mode typography pass | Valuable, but overlaps with Active Session Glance System and risks reopening the rejected broad `text-base` direction. |
| 2 | Dive-watch timer bezel | Interesting visual metaphor, but likely too much chrome before simpler Run hierarchy is proven. |
| 3 | Bench-handoff control band | Good pair-native idea, but broader than this pass and mostly an interaction-layout brainstorm. |
| 4 | Full training object visual system | Too abstract and expensive; should emerge from concrete Run/Check/Complete patterns. |
| 5 | Auto-quiet while timer runs | Strong principle, but better folded into Active Session Glance System than shipped as a separate mechanism. |
| 6 | Next tap prediction everywhere | Already partially happening on Home; broad automation risks hidden behavior and should wait for specific surfaced friction. |
| 7 | Remember less, resume better | Mostly product behavior/history policy, not a near-term design/style improvement. |
| 8 | Haptic/audio status pairing as standalone | Useful, but crosses into platform/reliability and should follow visible status decisions. |
| 9 | Tune Today three physical dials | Too much new pre-run model; the simpler intent dial survivor preserves the useful part. |
| 10 | Watch-face session complication as standalone | Good pattern, but better absorbed into local trust cues and active-session status. |
| 11 | Quiet Now / Next / Done rail as standalone | Duplicates the Active Session Glance System; should be a sub-pattern, not separate work. |
| 12 | No-typing Review receipt chips | Useful variant of Post-Session Receipt Layer, not a separate top-level initiative. |

## Handoff

`Active Session Glance System` is selected for `ce-brainstorm`.
