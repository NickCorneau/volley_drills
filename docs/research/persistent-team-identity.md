---
id: persistent-team-identity
title: Persistent Team Identity For Beach Pairs
status: active
stage: planning
type: research
authority: "operational posture on O13 (persistent team identity); forward-compatible participant/consent contract; graduation gate for shipping a first-class Team object (D114-D117)"
summary: "Stay session-first with forward-compatible participant, side, and consent hooks; do not ship a durable Team object until behavior, trust, and uplift evidence support it."
last_updated: 2026-04-16
depends_on:
  - docs/vision.md
  - docs/decisions.md
  - docs/prd-foundation.md
  - docs/research/dexie-schema-and-architecture.md
related:
  - docs/research/README.md
  - docs/research/solo-training-environments.md
  - docs/research/d91-retention-gate-evidence.md
  - research-output/persistent-team-identity-pair-sport-apps.md
---

# Persistent Team Identity For Beach Pairs

## Agent Quick Scan

- Use this note to answer: should the app ship a first-class `Team` object for beach pairs now, and if not, what are the minimum forward-compatible hooks?
- The operational answer resolves `O13` for planning purposes and is encoded in `D114` (session-first posture), `D115` (forward-compatible participant schema), `D116` (layered, revocable consent), and `D117` (graduation gate before a Team object ships).
- Not this note for courtside UI, adaptation rules, onboarding screen count, warm-up content, or regulatory posture; use the respective narrower notes.

## Bottom line

The current build slice should **stay session-first** and **add a small set of forward-compatible hooks now** so persistent pair identity can ship later at low cost and without trust debt. Do **not** ship a first-class durable `Team` object in M001 or v0b.

Public product patterns in consumer pair-sport training split cleanly:

- **Lightweight / solo-first consumer apps** (SwingVision, PB Vision, Pickleball Stats Tracker, Pickleball Scorer, PickleGo, UTR Sports): the durable object is the session/match/video plus optional player profiles. Partnership is an event-scoped or per-match tag, not a top-level noun.
- **Team-first apps** (UltiAnalytics, The Rowing App, Balltime, Stat Together, Steazzi): the durable object is a roster or club, but these products already assume accounts, organizers, or coach/club operator roles — shells we explicitly do not want at this stage (see `D19`, `D72`, `D73`).

Even sports where partnership is intrinsic (climbing belay partners, ballroom, figure skating pairs) rarely ship a durable shared-training object at the consumer layer; they prefer **persistent people + sessions + social discovery** over **persistent pairs**.

The strongest reason not to build the full `Team` concept now is not engineering complexity — it is **trust complexity**. Once a pair becomes a durable shared object, the product inherits: who can link whom, who sees historical sessions, who can revoke access, what happens when partners change, whether one person effectively "owns" the duo's history, and how breakups are handled. HCI research on shared accounts and post-breakup digital disentanglement, and visible product failure modes at PB Vision, Strava Flyby, and DUPR, all show these are not edge cases.

Confidence: **high** on the posture recommendation (stay session-first now; don't ship a durable Team yet); **medium-high** on the forward-compatible schema shape; **medium** on the specific graduation gate thresholds, because the underlying fitness-adherence literature cautions strongly against naive linked-vs-solo cohort comparisons.

See `research-output/persistent-team-identity-pair-sport-apps.md` for the full provenance pass.

## Use This Note When

- deciding whether to introduce a `Team` entity in M001, v0b, or any near-term slice
- shaping the session data model beyond `playerCount: 1 | 2` (today's shape in `app/src/db/types.ts`)
- scoping a "save this partner so I don't re-type their name" feature
- writing product copy that implies shared progression, team rating, or co-owned history
- reviewing a proposal that wants to backfill past sessions onto a new shared identity
- evaluating any sharing / invite / claim UX

## Not For

- whether today's session should support 3+ players (use `D101`)
- who can see a session when coach sharing is added (use `D29`, `D75`, and `docs/specs/m001-home-and-sync-notes.md` when it grows)
- multi-device sync architecture (out of scope; `D40` holds the current posture)
- courtside UI for pair sessions (use `docs/research/outdoor-courtside-ui-brief.md` and M001 run-flow spec)

## What comparable products actually model

### Session-first with optional persistent people (the dominant pattern)

- **SwingVision, PB Vision** — the durable object is a recorded session plus player profiles; tagging is per-session and can be unilaterally applied by the uploader, then claimed/untagged by the tagged player. There is no standalone "our team" record.
- **Pickleball Stats Tracker, Pickleball Scorer** — create profiles for yourself and regular partners, sync across devices, get partner/opponent comparison views — but the durable object is still the profile plus match history, not a shared duo.
- **U-Stat** — rich sport data stored locally, no account, no data collection. A concrete existence proof that meaningful stat history does not require an account layer or a shared identity layer.

### Event- or network-scoped partnership (the middle ground)

- **UTR Sports** — doubles partnership exists at event-registration time: register for a class, add/change a partner, participant slots tie to player profiles. Partnership is a property of the event, not a durable top-level entity.
- **PickleGo** — "player network plus match history" model: invite friends, plan matches, auto-randomize teams, track partner/opponent records. The durable thing is the social graph plus the match ledger, not a permanent duo.

### Team-first (the warning, not the template)

- **UltiAnalytics** (ultimate), **The Rowing App**, **Balltime / Stat Together** (volleyball), **Steazzi** (handball) — team or roster is the top-level noun. In every case the surrounding assumption is a coach, club, organizer, or shared admin role. That shell is not present in a self-coached solo-first product and should not be imported sideways through a `Team` entity.

### Persistent-partner absence in partner-intrinsic sports

- **Climbing** (KAYA, The Topo): "friends & partners" is a social graph (follow/comment), not a shared performance object.
- **Ballroom/dance** (DancePartner.com, Danceflavors): partner-discovery networks with persistent people, not shared training histories.
- **Figure skating pairs / ice dance**: consumer mobile layer is mostly federation/event tracking, not pair-training software.

Even where partnership is the sport, consumer apps prefer **persistent people + sessions + social discovery** over **persistent pairs**. That is strong external evidence against premature pair-as-entity modeling in our slice.

### Reinforcing analogues (2026-04-16 supplementary pass)

A later desk-research pass surfaced four additional product patterns that reinforce — and do not overturn — the posture above. Summarized here so downstream readers do not have to re-derive them:

- **DUPR (pickleball ratings platform).** The clearest direct evidence that modern doubles systems do not make the pair the primary durable identity: each player has singles and doubles ratings, a doubles match's "team rating" is computed from the average of the two player ratings, and updates apply to each player individually after the match. All-player match-validation is an integrity layer, not a shared-entity layer. That is exactly the split the session-first posture assumes — shared session record, durable meaning lands on each body/account.
- **Tennis Fit (solo-first → doubles).** App-store release notes explicitly add doubles tracking in response to user demand; the product extends to "track all four players and analyze team performance and the partnership" without introducing a durable team object. This is the evolutionary path our schema should be able to support: richer participant modeling and partnership analysis layered on a session model, not a reshape onto `Team`.
- **SwingVision 2026 Family Sharing.** Adding Family Sharing shows that one-phone capture eventually needs to let value travel beyond the phone-holder — but even then the durable unit stays account/session owner plus tagged players, not a formal pair object. Confirms that pair salience belongs in tagging and sharing UX when the time comes, not in the object model ahead of time.
- **Kitman Labs / Teamworks kiosk pattern.** Serious athlete-monitoring products solve "one device, many bodies" with **participant-aware capture** (each athlete taps their own photo and answers their own questions), not with a collective load number. When subjective load ever becomes dual-capture in this product, it should follow the same pattern: person-level fields on participant records, not a shared RPE on the pair.

### Beach-specific product patterns

Two beach-volleyball consumer products worth noting because they illustrate the other side of the split (coordination / event identity vs individual-level skill):

- **BeachUp / Beach Volleyball App.** User reviews explicitly object to strictly solo-first creation semantics ("creating an entire event as solo player feels wrong") and praise badges that show individual experience. Reads as: in real beach-volleyball usage, the canonical social unit of **scheduling** is often pair or group, while the canonical unit of **skill/experience** still lives per person. Same split the session-first posture takes.
- **VolleyTrain, PlayBeach.** Beach-specific training products that explicitly frame partner as a **training modality** ("solo or with a partner"), not a durable schema entity. Beach-specific evidence against over-indexing on partner permanence in the training layer.

### Pair-native accountability (the Sweatmates reference)

Sweatmates is the cleanest pair-native consumer analog, so it is worth spelling out what it models and what it does not:

- Pair is the **habit contract**: couples, weekly shared goals, instant partner visibility on a raw check-in.
- The check-in itself is still **person-specific** — one person logs a workout, the partner sees it — so the shared unit is accountability, the action is attributed to a body.
- What survives in the review evidence is "literally 10 seconds" friction; the loudest negative reviews are about camera / paywall friction, not about the pair framing.

Directional implications for this product:

- Pair-native framing at the **workflow** level (mode fork, pair-addressed verdict, partner-named Complete copy) is supported by the evidence as a real retention lever.
- That does **not** imply a durable Team object. It implies visible pair context within a session and low-friction capture.
- Every extra input step in a motivationally-fragile early window is dangerous. When dual-capture RPE is ever considered, the Sweatmates reading is a caution against forcing it on day one; the Kitman Labs reading is what the shape should look like when it does land.

None of these additions change `D114`–`D117`; they strengthen the same conclusion from different angles and give downstream product / plan docs a broader evidence base to cite without re-doing the research.

## What the retention and trust evidence says

**No** credible public retention reporting was found from the surveyed pair-sport apps that breaks users into linked-team vs solo cohorts. That absence is itself a signal: even products shipping linked-team features do not publish evidence that the linking drives retention.

Broader fitness evidence:

- A *Nature Communications* study of ~1.1M runners used weather as an exogenous instrument and found exercise behavior is socially contagious — a real causal effect, not just correlation.
- A group-feature fitness-app study found role-model and comparison features can significantly increase participation.
- A *JMIR* commercial-app survey found that social features correlated with more activity, but the authors explicitly warned against causal inference — active users are more likely to use social features in the first place.
- A systematic review of social features in mHealth interventions found widespread use and high experimental retention, but no statistically significant meta-analytic effect on physical-activity outcomes.
- A broader mHealth adherence review pegged average adherence around ~56% and flagged severe dropout as a foundational problem; social and gamification features are "promising, not a universal fix."

The most useful causal design for our decision is the Philadelphia six-month RCT on step incentives: **combined individual-and-team incentives** beat team-only and control; **team-only did not outperform control**. A separate RCT on social support + loss-framed incentives produced modest gains that faded post-intervention. A 2024 partner-based virtual exercise pilot showed excellent retention and adherence, but the sample was too small to generalize.

Implication for our product: a durable pair construct is **likelier to help when it adds accountability, context, and coordination while preserving each individual's credits, controls, and exits.** Any future Team feature that submerges individual progress into a collective score is not supported by the evidence.

For the D91 cohort readout specifically: the honest planning band for pair-vs-solo D14 retention is a **relative uplift of roughly +25% to +60%**, center-of-mass around **+40%**, or **+10–15 percentage points absolute** in an n=5-ish cohort, with a noise floor around +5 pp given the sample size. Pair testers returning as solo when coordination breaks is still evidence that pair framing is working, not failing — coordination drag should be logged separately rather than counted as pair retention failure. Full interpretive logic in `docs/research/d91-retention-gate-evidence.md` → *Pair-vs-solo stratified reading*.

## Where persistent linking goes wrong (four failure modes)

1. **Unwanted capture or unwanted visibility.** Recreational players consistently raise consent concerns around match recording/uploading. Strava Flyby was dialed back to opt-in after sustained privacy criticism, with explicit account + activity visibility requirements. Co-participation never implies ongoing consent to visibility.
2. **Ownership asymmetry masquerading as collaboration.** PB Vision's uploader-owns model is acceptable per session: the uploader controls tagging, non-owners can only self-claim/self-untag. It is **not** safe as the default for a durable duo, because one partner would become the effective administrator of shared history. Individual exportability and revocability need to exist from day one, not as cleanup after shipping coupled identity.
3. **Trust erosion from partner-coupled ratings and selective evidence.** PB Vision and DUPR show the pattern: users complain when one game swings a rating, when a partner's strength appears to drive a result, or when reset/loophole behavior is possible. A future Team layer must be fair under partner changes, uneven sample sizes, and selective logging.
4. **Breakup and offboarding friction.** HCI work on shared accounts and post-romantic-breakup digital disentanglement documents the exact pattern: yesterday frictionless sharing, today a need for immediate, quiet, possibly retroactive revocation. A training-partner breakup is not identical but the system-design problem is the same. If the data model does not support this from day one, persistent teams become a source of fear rather than stickiness.

## Forward-compatible data model (the minimum hook set)

The local-first literature (Kleppmann, Ink & Switch; Automerge modeling guidance; Keyhive access-control work) argues for: keep local copies authoritative; treat collaboration as a layer on user-owned data; document granularity should match the real "unit of collaboration"; revocation must be represented in history, not delegated to a central server.

The session is the current unit of collaboration. A future two-person team is a separate linked document that gets introduced later.

Full reference schema lives in `research-output/persistent-team-identity-pair-sport-apps.md`. The essentials:

```ts
type SessionParticipant = {
  participantId: UUID
  localProfileId?: UUID       // optional durable person identity
  displayNameSnapshot: string // preserve what user saw at session time
  sideIndex: 0 | 1            // who was together in this session
  slotIndex: 0 | 1            // left/right or player A/B on that side
  role: "self" | "partner" | "opponent" | "guest"
  source: "manual" | "contact" | "invite" | "imported"
  teamId?: UUID | null        // reserved pointer; almost always null today
}
```

Plus, reserved for later and not required today:

- `PlayerProfileDoc` — optional durable local person identity (aliases, discoverable flag, merged-into pointer for reconciliation, archive timestamp).
- `PairingObservationDoc` — derived, not user-facing: lets the app infer recurring dyads from session history when the feature is eventually designed.
- `TeamConsentDoc` — append-only ledger of separate grants per scope: `link_identity`, `share_session_history`, `share_progression`, `share_recommendations`; each with `status ∈ {proposed, accepted, revoked, expired}` and an explicit `scope ∈ {future_only, selected_past_sessions, all_shared_sessions}`.
- `TeamDoc` — a proper two-member durable object, created from an accepted `link_identity` consent plus an observation, and only when the graduation gate below is met.

### What the minimum hook set actually requires today

- **Session records.** When session records grow beyond `playerCount: 1 | 2` (today's shape in `app/src/db/types.ts` as of 2026-04-16), they MUST use `SessionParticipant[]` with `sideIndex`, `slotIndex`, nullable `teamId`, nullable `localProfileId`, and `displayNameSnapshot`. The snapshot preserves what the user saw at session time, independent of later profile edits.
- **Player identity.** Persistent people are **optional** and **durable-local**; no account, email, or contact required. Discoverability defaults to off.
- **Consent.** Treat identity linking, historical-session sharing, shared progression, and team-level recommendations as **four separate, independently revocable grants**. Do not collapse them into a single "shared team" toggle.
- **Ownership.** Individual exportability and revocability are day-one invariants. A tagged partner must be able to self-untag; a partner linked into a future team must be able to revoke that link without requiring uploader cooperation and without breaking the underlying session ledger.

### Why this is cheap today

The current schema (`app/src/db/types.ts`) stores `playerCount: 1 | 2` on `SessionPlan` and has no partner identity at all. Nothing about the current app or tests binds us to a participantless shape — the forward-compatible hook only materializes when the product first needs to store a partner name, a partner role, or a side assignment. `D101` (3+ players deferred) keeps the feature from leaking into M001; this note keeps the shape honest when the feature eventually lands.

## Consent design and the decision rule for when to commit

**Least risky consent pattern:** mutual opt-in for durable team identity, unilateral tagging for session identity, revocable scopes for everything else.

- Mutual opt-in for a durable team (analogous to UTR's doubles registration and the Automerge/Keyhive access-control posture).
- Unilateral per-session tagging is acceptable (analogous to PB Vision), provided the tagged person can self-claim and self-untag, and provided tagging never auto-links identity into a durable team.
- Default scope when a team is first linked is **future sessions only**. Expanding to historical sessions or to shared progression requires a second explicit grant.
- Recurring-partner shortcuts ("remember this name") are a convenience feature and MUST NOT be conflated with durable shared identity. Shortcut-level data never silently promotes itself into a `Team`.

**Patterns to avoid (likely "magical onboarding, creepy later"):**

- Any-user-can-claim persistent teams.
- Automatic backfilling of all historical sessions on first link.
- Uploader-owner models for durable duos (fine per-session, unsafe for long-lived shared history).
- Collapsing "save this partner's name" and "I consent to a durable shared identity" into one action.

### Graduation gate — when to commit to a full Team entity

Commit only when all four conditions hold:

1. **Recurrent-pair behavior is measurable.** The app can detect a meaningful pool of stable dyads from repeated sessions, not from self-reports. In our product this means the session model has already grown to participant rows with `sideIndex` / `slotIndex` and some kind of profile or alias reconciliation is in place.
2. **Users are indirectly asking for team affordances.** Examples: re-adding the same partner, comparing partner-specific outcomes, requesting shared drill plans.
3. **Trust metrics are healthy.** Low rates of privacy objections, low rates of untag/revoke actions, high acceptance of mutual link requests — all measured before and during any pilot.
4. **Selection-bias-resistant uplift evidence exists.** Staggered rollout, randomized invite nudges, or encouragement designs that let us separate "linked users engage more" from "already-engaged users link." The broader fitness literature is explicit that naive linked-vs-unlinked comparisons are not enough.

Until all four are satisfied, the posture is: preserve the graph, not the relationship.

## Freeze now

Encoded as decisions so downstream docs and code can stop reasoning from first principles:

- **Posture.** Session-first with forward-compatible hooks; no first-class durable `Team` object in M001 or v0b. See `D114`.
- **Session participant schema (for when session records grow beyond `playerCount`).** UUID-addressed participant rows with `sideIndex`, `slotIndex`, nullable `teamId`, nullable `localProfileId`, `displayNameSnapshot`, role, and source. See `D115`.
- **Consent layering.** Identity linking, historical-session sharing, shared progression, and team-level recommendations are four separate, independently revocable grants. Unilateral per-session tagging is allowed only with self-claim/self-untag rights; durable team identity is mutual opt-in only. See `D116`.
- **Graduation gate.** Do not ship a first-class `Team` object until all four conditions above are met (recurrent behavior, indirect demand, trust metrics, selection-bias-resistant uplift). See `D117`.

## Validate later

During and after the M001 field-test window (`D91` cohort):

- **Do recurring partners even show up?** Log whether the same partner name is re-entered across sessions; if recurrence is rare, persistent team identity is a lower-priority future feature regardless of product polish.
- **Does the partner-tag pattern generate any visible trust friction?** Watch for objections, untag-style requests, or "can I delete this partner's data" requests even in the minimal shape.
- **Does "save this partner" creep toward implied sharing?** Any indirect user belief that entering a partner name creates a shared object is a red flag and should be reflected in copy and UI before any durable Team work begins.
- **Pilot design readiness.** When the feature is later considered, plan a staggered-rollout or randomized-invite design from the start; retrofitting causal evidence onto a naive launch is much harder than doing it once.

## Apply to current setup

Audited against the repo as of 2026-04-16. No immediate code changes are required; the main deliverable is the posture lock-in plus routing docs updates.

### App code (`app/src/db/types.ts`, `app/src/domain/presets.ts`, `app/src/services/session.ts`)

- Session records currently carry `playerCount: 1 | 2` and no partner identity. That remains acceptable until the session builder grows beyond the v0b thin-slice scope.
- Action: when a future slice first needs to store a partner name, side, or role, introduce `SessionParticipant[]` exactly as described above rather than extending `SessionPlan` with ad-hoc partner-name fields. Do not add `teamId` / `Team` tables at that time; add only the participant rows and (if needed) optional local profile rows. This is the smallest change that avoids reshape later.
- Action: do not introduce partner-facing sharing, invite, or visibility features as part of v0b or M001. Coach sharing remains governed by `D29` and `D75`.

### Docs already aligned

- `docs/vision.md` explicitly calls out "a persistent beach pair should be able to create a team identity" as an end-goal. This note does not weaken that goal; it scopes the path to it.
- `docs/prd-foundation.md` Later objects list is updated to include `PlayerProfile`, `Team`, `TeamConsent`, and `SessionParticipant` so the object model makes the forward-compatible hooks explicit.
- `docs/decisions.md` `O13` is sharpened to point at this note; `D114`, `D115`, `D116`, and `D117` encode the posture.
- `docs/research/dexie-schema-and-architecture.md` references this note so the Dexie M001 shape is not treated as the final session-shape contract once partner identity eventually lands.

## Open questions specific to this note

- **Does "save this partner" belong in v0b?** The research is clear that recurring-partner shortcuts are a convenience feature distinct from shared identity, but the v0b thin-slice may still not need them. Decide when / if pair sessions graduate beyond a single-line name field.
- **What minimum observation threshold should trigger an `observation` record later?** Placeholder: ≥3 shared sessions with the same partner name within a reasonable window, with some alias-reconciliation tolerance. Real thresholds belong to the slice that first ships the feature.
- **How should the product surface export / revoke controls?** The research says these must be day-one invariants for any durable Team shipment. Concrete UX belongs to that future slice.

## Related decisions and questions

- `O13` — persistent team identity for beach pairs; this note resolves the posture for planning purposes and seeds `D114`–`D117`. Remaining in-product validation (recurring-partner prevalence, trust friction, indirect demand) is on the M001 field-test list.
- `D14`, `D27`, `D28`, `D40` — local-first product stance, which this note extends (collaboration as a layer, not a coupling) and relies on for the consent-as-history model.
- `D29`, `D75` — async coach sharing is the currently sanctioned inter-user data flow. This note does not expand that; team-level sharing is deferred behind the graduation gate.
- `D36` — client-generated immutable string IDs. The forward-compatible participant / profile / consent IDs follow the same contract.
- `D90`, `D101` — player-count inputs and 3+ player deferral. Together with this note, they mean `SessionParticipant[]` does not become required until either pair mode grows to store partner identity or multi-player support ships post-M001.
- `O1`, `O2` — coach premium model and multi-week planning both imply shared goals and therefore interact with any future Team entity. This note is directionally upstream of both: a Team object should not ship before them.

## Change log

- 2026-04-16 — note created from desk research on comparable pair-sport consumer products (SwingVision, PB Vision, UTR, PickleGo, UltiAnalytics, The Rowing App, Balltime, Stat Together, Steazzi, KAYA, The Topo, DancePartner, Danceflavors, U-Stat, Pickleball Stats Tracker), HCI research on shared accounts and post-breakup disentanglement, fitness adherence literature (JMIR, Nature Communications, Philadelphia RCT, step-incentive and loss-framing trials), Strava Flyby privacy history, PB Vision/DUPR trust-erosion evidence, and local-first collaboration literature (Kleppmann, Ink & Switch, Automerge, Keyhive). Raw provenance in `research-output/persistent-team-identity-pair-sport-apps.md`. Resolves `O13` operationally and seeds `D114`–`D117`.
- 2026-04-16 — added reinforcing analogues (DUPR person-level durable identity, Tennis Fit solo→doubles evolution without a Team object, SwingVision 2026 Family Sharing, Kitman Labs / Teamworks kiosk participant-aware capture), beach-specific patterns (BeachUp / Beach Volleyball App scheduling-unit vs individual-skill split, VolleyTrain / PlayBeach partner-as-modality framing), and a Sweatmates subsection separating pair-native accountability from durable Team identity. Linked the D91 cohort readout to the pair-vs-solo stratified reading band in `docs/research/d91-retention-gate-evidence.md`. No decision changes; `D114`–`D117` and the v0b exclusion of persistent partner/team identity stand. This is evidence depth, not posture drift.
