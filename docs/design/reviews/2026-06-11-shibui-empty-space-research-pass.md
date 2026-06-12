---
id: 2026-06-11-shibui-empty-space-research-pass
title: "Shibui / Empty-Space Research and Design Pass (2026-06-11)"
status: active
stage: validation
type: design-review
summary: "Founder-requested shibui / ma research-and-design pass: external research synthesis (ma, kanso, seijaku, calm technology, iA-style reduction) folded against the repo's Japanese-inspired direction, plus a full live 390×844 walk. Verdict: the run flow is the strongest ma in the app and should be defended; the highest-leverage unrealized canon item is the recommendation-first Setup restructure the visual-direction doc has called for since 2026-04-19. Five ranked, evidence-gated proposals (S1–S5) plus one canon nit (S6). No code shipped; suggestions only."
authority: "Point-in-time research + design pass capture. Not source of truth on its own. Canonical shibui thesis stays in docs/research/japanese-inspired-visual-direction.md; readability floors stay in docs/research/outdoor-courtside-ui-brief.md."
last_updated: 2026-06-11
depends_on:
  - docs/research/japanese-inspired-visual-direction.md
  - docs/research/outdoor-courtside-ui-brief.md
  - docs/research/brand-ux-guidelines.md
  - docs/design/reviews/2026-06-11-design-language-deep-pass.md
  - docs/design/reviews/2026-06-11-red-team-design-language-review.md
related:
  - .cursor/rules/courtside-copy.mdc
decision_refs:
  - D91
  - D127
  - D130
  - D137
  - D152
  - D153
---

# Shibui / Empty-Space Research and Design Pass (2026-06-11)

## Agent Quick Scan

- Third design pass of 2026-06-11, deliberately different in kind from the same-day red team (adherence audit) and deep pass (challenge/reconcile/ship): this one grounds the shibui / `ma` thesis in **external research** and asks where the app under-uses or mis-uses empty space.
- **Nothing shipped.** Five ranked proposals (S1–S5) + one canon nit (S6), each evidence-gated. The settled dispositions from the same-day deep pass are honored — see "Not re-surfaced" below.
- Headline: the **active run face is the best ma in the app** (one cue, active void, dominant timer) — defend it. The biggest gap is **Setup**, where the visual-direction doc's "make the recommendation feel more central than the controls used to refine it" has never been implemented.
- External research verdict on the core tension: restraint and outdoor glanceability are mostly **allies**; the rule is "restrain hue count and decoration, not luminance contrast." The app's token system already obeys this.

## Method

- **External research**: web-research synthesis on shibui/shibusa, `ma`, kanso, seijaku, calm technology (Weiser & Brown, Amber Case), iA's reduction process, Super Normal (Fukasawa/Morrison), NN/g flat-design signifier findings, and macro/micro whitespace taxonomy. Distilled below; source list at the end.
- **Live walk** at 390×844 CSS px (DPR 2) on the dev server: Home (`last_complete`, ended-early variant), Setup, Safety, Run (segmented active, paused 2-action, `Now`-surface active, paused 4-action grid), End-session bottom sheet, Transition ×2, Drill check, Review (ended-early), Complete (pair verdict), Settings, onboarding Skill level. Screenshots session-local, not archived (matches prior pass convention).
- **Canon re-read**: the four design contracts plus `index.css` tokens, `ScreenShell`, `surfaces.ts`, `JustFinishedPill`, `HomeScreen`.
- Method disclosure: the walk wrote one synthetic ended-early session (Pair + Net, ~15 min plan, RPE Right, reason Time) into the dev IndexedDB history.

## External grounding (distilled)

Heuristics from the research synthesis that materially sharpen the repo's existing thesis (the rest confirmed what `japanese-inspired-visual-direction.md` already says):

1. **Space must have a job.** Every gap is either *active* (structuring; pointing at the focal thing) or *passive* (legibility relief). Space with no role is just low density, not `ma`.
2. **Ma is relational.** Emptiness exists in conversation with the one thing it frames (tokonoma logic). Audit question per screen: *what does this emptiness point at?*
3. **Separate macro and micro whitespace.** Macro = gaps between major blocks; micro = line-height, padding, label-to-field gaps. Tune independently; related items must sit closer to each other than to unrelated ones (Gestalt proximity).
4. **Shibui restrains palette, not contrast.** Neutrals + one semantic accent; muted ≠ low-contrast. Keep 4.5:1 / 3:1 floors. (Allies with the outdoor brief, not in tension with it.)
5. **Calm-tech minimum-attention rule.** Every widget must earn courtside attention; prefer periphery over interruption.
6. **iA's reduction sequence**: structure first, ornament last — and the over-removal lesson (total removal drops the temperature to "0° Kelvin"). Subtract until removal hurts, then add one back.
7. **Typography is the interface.** With ornament removed, type does the hierarchy work: 1–2 typefaces, ~2 sizes per glance-screen, deliberate weight contrast.
8. **Failure modes to audit**: missing signifiers on flat tappables (NN/g); hidden primary navigation; emptiness without hierarchy ("minimal vs bare"); pointless minimalism that removes orienting context; `ma` misread as density-zero where the user actually wants efficiency (mid-session).

## What already embodies shibui (defend these)

- **Run `Now` surface**: drill name, one cue behind an accent rule, one disclosure, a large *active* void, then the dominant 72 px timer + controls in the thumb band. This is textbook tokonoma structure; the void points at the timer. Best screen in the app.
- **Drill check**: one focal card, one question, gating hint + disabled-primary "not yet" voice, nothing else.
- **Complete**: verdict as the single focal element, quiet recap card, clean jo-ha-kyū resolution. The solo path's deliberate eyebrow omission (intentional `ma`, §7.7) holds.
- **Surface discipline**: one focal card per screen (`FOCAL_SURFACE_CLASS`), soft cards for everything subordinate, `shadow-lg` modal-only. Failures found by the red team were bypasses, not the system.
- **Mid-screen voids on Safety / Drill check are working `ma`, not waste**: content top-anchors, the CTA pins to the thumb band, and the void separates "read" from "commit." Recorded here so a future pass doesn't "fix" them by stretching content.
- **Quiet affordances with real signifiers**: the quiet-tertiary tier keeps a permanent underline (non-color cue — passes the NN/g signifier check); scroll overflow is conveyed by fade gradients instead of scrollbar chrome; saves confirm inline without toasts.
- **No erratic motion** (seijaku): two ≤150 ms fade keyframes in the whole app, both state-explaining, both `motion-reduce`-aware.

## Findings and proposals (ranked, all evidence-gated)

### S1 · Setup: make the recommendation central, demote the controls (highest leverage)

**Observation.** Setup renders four equally-weighted labeled sections (Players / Net / Time / Focus) — 12 chips of identical visual rank — with the assembled-duration line in an info Callout above the CTA. There is no focal zone until the eye reaches `Build session`; the screen reads as a form, not as "confirm today's recommendation."

**Canon.** `japanese-inspired-visual-direction.md` → Translate to Volleycraft → Setup has said since 2026-04-19: *"present fewer equally-weighted chips at once; make the recommendation feel more central than the controls used to refine it; let whitespace and grouping explain the structure before labels do."* This is the largest unrealized canon item in the app, and the red team's B− on the Japanese direction traces partly here.

**Proposal (experiment).** Lead the screen with the resolved recommendation as the focal statement (e.g. a single line in the focal voice: `Pair + Net · 40 min · Recommended focus`, sourced from the live draft), and visually subordinate the four chip sections into a "refine" cluster beneath it — tighter intra-cluster gaps (macro/micro split per research heuristic 3), section h2s dropped to the quiet label voice. **Semantics unchanged**: all chips stay real selectable options, `Recommended` remains a true focus choice (the red-team falsification stands), mandatory-focus behavior untouched, duration-honesty Callout untouched (deep-pass falsified candidate — not re-surfaced).

**Guardrails.** No contrast or tap-target loss; the chips must still read as obviously tappable (signifier check). D137 spine unchanged (Setup → Safety).

**Gate.** Founder-use evidence: does the first-glance read become "this is today's plan, adjust if needed"? Screenshot comp first; ship only behind the same one-pass polish discipline as prior tiers.

### S2 · Transition: quiet the previous-block receipt

**Observation.** `JustFinishedPill` (warm panel + filled green circle + semibold drill name + green status line) occupies the full-width top slot on Transition and Drill check. On a screen whose job is *the next drill*, the heaviest-and-first element celebrates the previous one. The eye lands on closure before it lands on `Up next`.

**Canon.** Jo-ha-kyū (§6 of the visual-direction note) wants flows to *finish cleanly* — the receipt is legitimate — but one focal zone per screen (§4.2) assigns Transition's focal zone to the `Up next` title + CTA. The pill was consolidated verbatim in plan U6 (2026-05-04) from copy-pasted inline code; the treatment itself has never been separately decided, so this does not contradict a documented decision.

**Proposal (experiment).** Demote the receipt to a single quiet line — small success-tone check glyph + `{drill} · Complete` in `text-sm text-text-secondary` — no panel fill, no semibold. Keep the `Skipped` variant equally visible (data honesty). Drill check may keep the fuller pill (there the just-finished drill *is* the subject being rated; the receipt is load-bearing context).

**Gate.** Founder-use: does block-to-block scanning feel faster without losing the "that one's banked" reassurance? Watch for the over-removal failure mode (research heuristic 6) — if the quiet line reads as unconfirmed completion, restore the pill.

### S3 · Review: collapse the empty Good-passes card to a line

**Observation.** When no counts were logged anywhere, the `Good passes` card renders two sentences that both report absence ("Captured between blocks on 1 drill." / "Counts not logged for any drill.") inside full card chrome. The same-day deep pass already quieted the *voice*; the *structure* still spends a card slot announcing nothing actionable.

**Canon.** §6.2 empty-state rule: "for list views that may be legitimately empty, a single line of `text-text-secondary` body copy is enough." Kanso: omit what does not serve.

**Proposal (experiment).** When the aggregate is wholly empty, drop the card chrome and render one quiet line in the card's place (keep it — it teaches where capture lives; pointless-minimalism failure mode says don't delete the orientation entirely). The card returns whenever any count exists.

**Gate.** Founder-use; trivially reversible.

### S4 · Run segmented face: gloss underlines should recede mid-run

**Observation.** The segmented active face (e.g. Beach Prep Three) shows four segment rows, each with 1–2 dotted gloss underlines (`A-skip`, `ankle hops`, `lateral shuffles`, `pivot-back starts`) — 4–5 visible gloss triggers during a DO-CONFIRM glance. The texture noise competes with the one load-bearing row (the active segment).

**Canon.** Courtside-copy rule 12(a) renders one cue by default for exactly this reason; the learned preference is "a term needs explaining once, then should recede." Glosses remain fully available on the Transition READ-DO surface and in the `Show more cues` disclosure.

**Proposal (experiment).** Render the gloss affordance only on the *active* segment row; upcoming/past rows render plain text. No change to Transition or disclosure surfaces; tap targets and a11y semantics unchanged.

**Gate.** Founder-use during a real warm-up; revert if a mid-drill "what is that movement?" moment loses its inline answer.

### S5 · Home: candidate relocation of `Start a different session` (file under the open focal-competition question)

**Observation.** The `last_complete` focal card stacks six text elements (state line, labeled metadata, focal CTA, `Then:` queue line, then two — three when ended-early — underlined quiet-tertiary links). The links are escape paths from the plan the card asserts; `ma` would let them recede to the page field below the card rather than ride inside it.

**Status.** `D152` ratified the card internals 2026-06-03→11, and the deep pass explicitly left "Home focal competition" open **for founder-use evidence**. This is therefore a *candidate for the D130 window-close re-evaluation* (2026-07-20), not a ship-now: move `Start a different session` (and possibly `Repeat full plan`) outside the card as page-field quiet-tertiaries, leaving the card as plan + one action + queue line.

### S6 · Canon nit: §3.4 separator rule contradicts its own examples

`brand-ux-guidelines.md` §3.4 states "One middle dot separator max per meta line," but the documented (and shipped) Home last-complete format is `Last session: Pair + Net · 6 of 38 min · ended early today` — two separators (three segments). Reconcile the rule ("keep meta lines to at most three `·`-separated segments" matches shipped reality) or the format. Doc-only.

## Not re-surfaced (settled dispositions honored)

| Item seen on this walk | Why left alone |
| --- | --- |
| `Tap Resume to continue` paused helper | Deep-pass falsified candidate — founder-field-feedback addition |
| Setup duration-honesty Callout weight | Deep-pass falsified — data honesty outranks visual calm (§9.2) |
| `Recommended` chip semantics | Red-team falsified P0 — real selectable focus option |
| Review h1 centered; danger discard confirm | `D153` ratified |
| Ended-early reason chip in warning red (sole saturated element on Review) | Belongs to the already-open warning-tone vocabulary-split proposal (deep pass) |
| 12 px paused-grid labels; 14 px body floor | `D127` cluster, routed to the `D130` window close |
| `Locking your phone pauses the timer…` footer line | Travels with ADV-3 timer semantics (red-team routing) |
| Five equal-weight onboarding skill cards | Field-validated promotion (2026-04-21 walkthrough); heavier than typical shibui by evidence, not accident |
| Transition showing full instructions + all cues | READ-DO surface by design (courtside-copy frame); density is the job here |

## Verification

- Doc-only pass: `bash scripts/validate-agent-docs.sh` after catalog/README updates.
- No app code touched; no tests required.

## Sources (external research pass)

- Presentation Zen — 7 Japanese aesthetic principles; D. Atrash — Zen and the art of UX
- Wikipedia — Ma (negative space); Uism — redefining ma in Japanese digital aesthetics
- Interaction Design Foundation — negative space (macro/micro, active/passive taxonomy)
- SubUX / Pimp my Type — line length and line height numbers
- Weiser & Brown (1995) and Amber Case — calm technology principles
- iA — "Writer for iPad", "On Icons" (reduction sequence; over-removal lesson)
- Reading Design — Super Normal (Fukasawa/Morrison); T. West — Super Normal applied to apps
- NN/g — flat design and long-exposure signifier findings; T. Kenny — false simplicity
- VP0 / boia.org / weareaffective — sunlight contrast and glanceable wearable design
