# Persistent Team Identity for Solo-First Pair-Sport Apps

> Frozen provenance. Raw desk-research pass on persistent team identity for solo-first pair-sport consumer apps, delivered 2026-04-16. Curated findings that inform product canon live in `docs/research/persistent-team-identity.md`. `citeturn*` markers are the upstream research-tool citation handles and are preserved as provenance.

## Recommended posture

The right posture for the current build slice is **stay session-first, but add explicit forward-compatible hooks now**. Do **not** ship a first-class durable Team object yet. Public product patterns across doubles tennis, pickleball, climbing, dance, rowing, ultimate, volleyball, and handball split into two camps: lightweight apps usually treat a session or match as the primary unit and then attach player tags or optional profiles; heavier products treat teams, rosters, or events as first-class because they already assume accounts, organizers, or club workflows. The middle ground that shows up repeatedly is **optional persistent people, nullable team linkage, and revocable sharing**, not mandatory shared identity. That means you can preserve the cheap path to "persistent team" later without importing the baggage of account coupling now. citeturn13search6turn13search8turn27view0turn34view0turn33view0turn32view5

The strongest reason not to build the full Team concept now is not engineering complexity by itself. It is trust complexity. Once a pair becomes a durable shared object, you inherit questions about who can link whom, who sees historical sessions, who can revoke access, what happens when partners change, and whether one person can effectively "own" the duo's history. Those failure modes are well documented in HCI research on shared accounts and post-breakup digital disentanglement, and they already surface in sports/video products as ownership asymmetries, tagging disputes, selective upload concerns, and discomfort with recording or public visibility. citeturn8search12turn8search7turn8search20turn27view0turn28search0turn30search4turn8search2

## What comparable products actually model

The most common pattern in consumer pair-sport training is **session-as-first-class with optional persistent player identity**. In doubles-focused video products, entity["company","SwingVision","tennis and pickleball app"] asks users to identify players in a match and allows tagging other players so a session appears on their profile, but its public help content centers on the recorded session and on per-session tagging rather than a durable two-person team object. entity["company","PB Vision","pickleball analytics platform"] is similar: it lets the uploader tag players by name or email, links tagged matches into player profiles, computes player lifetime ratings from many tagged games, and offers team-comparison metrics inside a game, but the primary durable objects are videos and player profiles, not a standalone "our team" record. Consumer stat apps on the entity["company","Apple","technology company"] App Store follow the same shape. Pickleball Stats Tracker lets users create profiles for themselves and regular partners and sync them across devices, while Pickleball Scorer stores player profiles, partner/opponent comparisons, and venue/event history without advertising a durable shared-team object. citeturn13search6turn13search8turn14search1turn27view0turn10view1turn10view2turn34view0turn34view2

A slightly heavier but still consumer-friendly pattern is **event- or network-scoped linkage rather than durable team identity**. entity["company","UTR Sports","tennis and pickleball platform"] models doubles partnership at event registration time: players register for an event class, can add or change a doubles partner, and participant slots are tied to player profiles for that registration flow. Newer pickleball schedulers such as PickleGo lean toward a "player network plus match history" model: users plan matches, invite friends, auto-randomize teams when slots fill, and track partner/opponent records, but the durable object is the social network plus the match history, not a permanent duo. This is the most relevant comparator for a solo-first product because it shows that persistent person identity can be valuable without forcing partnership identity to be the top-level noun in the product. citeturn1view1turn34view1turn2search6

Where apps become **team-as-first-class**, they usually belong to coach, club, or roster workflows rather than casual pair training. UltiAnalytics tells users to create one or more teams, upload stats to team websites, and pass tracking duties between devices. The Rowing App centers fleet, roster, lineups, and workouts. Volleyball products such as Balltime and Stat Together emphasize player and team stats, fan access, and club or coach roles. Handball stat products such as Steazzi likewise position themselves around player and team progression across a season. These are useful evidence that team-first data models are real and valuable, but they are a warning more than a template: they assume rosters, shared administration, and usually accounts or operator roles that your current solo-first beach-volleyball product explicitly does not want. citeturn32view5turn32view4turn4search7turn4search10turn6search18

In other inherently partner-heavy categories, the market often avoids durable shared training identity entirely. Climbing apps such as KAYA and The Topo track the individual climber's progression and social graph, but "friends & partners" means following and commenting, not a persistent partnered performance object. Ballroom and dance products such as DancePartner.com and Danceflavors are even more explicit: they are partner-discovery networks, with persistent person profiles and search/matching, but not shared training histories or co-owned pair progression records. For figure skating pairs and ice dance, the widely visible mobile layer is mostly federation/media/event tracking rather than pair-training software. That absence matters: even in domains where partnership is intrinsic to the sport, many consumer apps prefer **persistent people + sessions + social discovery** over **persistent pairs**. citeturn32view2turn32view3turn32view0turn32view1turn5search13

The practical synthesis is straightforward. **Session-first is the default for solo-first consumer training products; team-first usually arrives only when there is already an account, organizer, or club shell around the data.** If you want to preserve the option of persistent teams later, the thing to preserve now is not "team UI." It is the **integrity of participant, side, and consent data** in every session you record. citeturn13search6turn27view0turn34view0turn32view5turn32view2

## What the evidence says about retention and trust

I did **not** find credible public retention reporting from the surveyed pair-sport apps that breaks users into linked-team versus solo cohorts. The official materials explain tagging, profiles, ratings, invitations, and scheduling, but they do not publish cohort retention curves, causal uplift estimates, or even descriptive comparisons between recurrent-partner users and solo users. That is an important result in itself: the feature may matter, but the public evidence base inside pair-sport consumer apps is thin. citeturn13search5turn10view3turn34view0turn34view1turn33view0turn1view1

The broader fitness evidence says social structure can help, but only with caveats. A large study in *Nature Communications* used exogenous weather variation to estimate peer effects in a global running network of roughly 1.1 million people and found that exercise behavior is socially contagious, which is much stronger than a simple observational correlation. A more recent study of group-level fitness-app features found that role-model and comparison features can significantly increase participation. Those two results together make it plausible that pair identity, if designed well, could improve adherence and engagement in a training product. citeturn22view2turn22view0

But you should not overread that into "persistent teams improve retention." A commercial-app survey in *JMIR* found that social components were associated with higher physical activity, yet the authors explicitly cautioned that causality is unclear because more active users may simply be more likely to use apps and social features in the first place. A systematic review of social features in mHealth interventions similarly found that social features were common and experimental retention was often high, but the meta-analysis did **not** show a statistically significant effect on physical-activity outcomes. A broader systematic review on mHealth adherence found average adherence around 56%, flagged severe dropout as a foundational problem, and concluded that social and gamification features look promising but are not a universal fix. citeturn23view2turn24search2turn24search3turn25view0

The most useful causal evidence for your decision is more nuanced: **social structure helps most when individual agency is preserved rather than submerged into a collective score.** In a six-month randomized controlled trial run in entity["city","Philadelphia","Pennsylvania, US"], combined individual-and-team incentives produced substantially more goal attainment and more daily steps than either team-only incentives or control, while the team-only arm did not outperform control. A separate randomized trial found that social support plus loss-framed incentives modestly increased activity during the intervention period, but the gains faded after follow-up. A 2024 pilot of a partner-based virtual exercise intervention found excellent retention and adherence, but it was very small and therefore only shows feasibility, not robust effect size. The implication for product design is sharp: **a durable pair construct is likelier to help when it adds accountability, context, and coordination while preserving each individual's credits, controls, and exits**. citeturn26view0turn23view1turn22view4

## Where persistent linking goes wrong

The first failure mode is **unwanted capture or unwanted visibility**. Recreational players on  Reddit consistently raise courtesy and consent concerns around match recording and uploading, especially when footage becomes shareable or public. The adjacent lesson from entity["company","Strava","fitness tracking company"] is even clearer: Flyby, which linked people through co-present activity traces, was dialed back to an opt-in model after sustained privacy criticism, and its help documentation now makes explicit that both account and activity visibility must be set to "Everyone" before the feature works. For pair-sport products, this means a durable team link can never assume that co-participation implies ongoing consent to visibility. citeturn30search4turn30search1turn8search2turn8search21turn8search14

The second failure mode is **ownership asymmetry masquerading as collaboration**. PB Vision's help docs are unusually valuable here because they show the exact shape of the problem. The uploader is the video owner and has full control over tagging other players; non-owners can tag or untag themselves, but they cannot manage others and may hit an "ownership warning" if they try to edit what they do not own. That is a workable pattern for a session object, but it is not a safe default for a persistent team object. If the equivalent rule were applied to a long-lived duo, one partner would become the effective administrator of shared history. PB Vision's separate data-export feature, which explicitly emphasizes user ownership of raw and advanced stats, points in the right direction: individual exportability and revocability need to exist from the beginning, not as cleanup after shipping a coupled identity model. citeturn27view0turn28search0turn28search13

The third failure mode is **trust erosion from partner-coupled ratings and selective evidence**. PB Vision's own club guidance acknowledges the operational problem that players may upload only their best games, and it answers that concern either by club-controlled assessment sessions or by waiting for enough samples. Public player discussions around PB Vision and DUPR show why this matters: users complain when one game swings a rating too much, when a partner's strength appears to drive a result, or when reset and loophole behavior seems possible. If you ever ship a persistent team layer, users will expect the team recommendations and shared progression to be fair in the face of partner changes, uneven sample sizes, and selective logging. citeturn27view2turn31search4turn31search8turn29search5turn31search2turn31search14

The fourth failure mode is **breakup and offboarding friction**. HCI work on shared accounts shows that ending account sharing creates privacy and security burdens; another study on couples' account-sharing behavior found that breakups rapidly reverse sharing and trigger efforts to rebuild privacy boundaries; research on digital possessions after romantic breakup documents ambiguity over access, ownership, and whether to preserve, separate, or erase shared digital artifacts. A training partner breakup is not identical to a romantic breakup, but the system design problem is materially the same: one day two people want frictionless sharing; the next day one wants that sharing to stop immediately, quietly, and retroactively if possible. If your data model does not support that from day one, persistent teams will become a source of fear rather than stickiness. citeturn8search12turn8search7turn8search20

## Minimum forward-compatible data model

The right technical principle is to follow the local-first literature from entity["people","Martin Kleppmann","computer scientist"] and entity["organization","Ink & Switch","research lab"]: keep local copies authoritative, treat collaboration as something layered onto user-owned data, and assume long offline periods plus concurrent edits. Their local-first and access-control work argues that CRDT-style systems are strongest when collaboration is built from stable documents, explicit references, and history-aware authorization rather than from a central always-online source of truth. Automerge's own modeling guidance says documents are typically identified by UUIDs, a root document can link to many subordinate documents, and document granularity should match the true "unit of collaboration." That fits your problem extremely well: the session is the current unit of collaboration, and a future two-person team can be introduced later as a separate linked document rather than as a premature global noun inside today's UI. citeturn17view0turn18view0turn18view1turn19view0turn19view1turn20search3turn20search5

A forward-compatible schema sketch looks like this:

```ts
// local-first root document
type RootDoc = {
  profileDocs: DocUrl[]
  sessionDocs: DocUrl[]
  teamDocs: DocUrl[]          // usually empty today
  consentDocs: DocUrl[]
}

// canonical unit today
type SessionDoc = {
  sessionId: UUID
  sportVariant: "beach_volleyball"
  startedAt: ISODateTime
  endedAt?: ISODateTime
  participants: SessionParticipant[]
  drills: DrillEvent[]
  notes?: string
}

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

type PlayerProfileDoc = {
  profileId: UUID
  aliases: string[]
  contactHints: string[]      // email/phone hash, nickname, etc.
  discoverable: boolean
  mergedIntoProfileId?: UUID  // for later profile reconciliation
  archivedAt?: ISODateTime
}

type PairingObservationDoc = {
  observationId: UUID
  memberProfileIds: [UUID, UUID]
  firstSeenAt: ISODateTime
  lastSeenAt: ISODateTime
  sharedSessionCount: number
  activeTeamId?: UUID | null
  confidence: number          // stability of identity match
}

type TeamConsentDoc = {
  recordId: UUID
  subjectProfileId: UUID
  counterpartyProfileId: UUID
  proposalType:
    | "link_identity"
    | "share_session_history"
    | "share_progression"
    | "share_recommendations"
  status: "proposed" | "accepted" | "revoked" | "expired"
  scope: "future_only" | "selected_past_sessions" | "all_shared_sessions"
  validFrom: ISODateTime
  validTo?: ISODateTime
}

type TeamDoc = {
  teamId: UUID
  memberProfileIds: [UUID, UUID]
  status: "active" | "paused" | "archived"
  createdFromObservationId: UUID
  createdAt: ISODateTime
  archivedAt?: ISODateTime
}
```

The key idea is that **you can fill most of this schema today without exposing most of it in UI**. Right now, you only need session documents, optional player-profile documents, and participant rows with `sideIndex`, `slotIndex`, and a **nullable** `teamId`. That preserves three future options at very low cost: you can infer repeated dyads from pairing observations, you can reconcile recurring humans into optional profiles later, and you can create a first-class Team only when both product evidence and user consent support it. U-Stat shows that rich sports data can live locally with no sign-up and no data collection; Pickleball Stats Tracker shows that regular-partner profiles and multi-device sync can exist without a shared team object. In other words, **accounts are not a precondition for future teams; stable local person IDs are**. citeturn33view0turn34view0turn16search1turn17view0turn19view1

The non-negotiable rule is that **team linking and data sharing must be distinct layers**. Do not let "we played together a lot" automatically become "we now share progression state" or "either player can expose all historical sessions." Keyhive's local-first access-control work is particularly relevant here: it argues that collaboration is always about who can collaborate with whom, in what way, and for how long, and that revocation must be represented explicitly in history rather than delegated to a central server. In practical product terms, that means separate consent records for identity linking, historical session sharing, shared progression, and team-level recommendations—and every one of those grants must be revocable without breaking the underlying session ledger. citeturn19view0

## Consent design and the decision rule for when to commit

The least risky consent pattern is **mutual opt-in for durable team identity, unilateral tagging for session identity, and revocable scopes for everything else**. UTR's event flow effectively uses mutual-account participation for doubles registration. PB Vision shows a lower-friction pattern where one user can tag another into a session, but the tagged person can later claim themselves or untag themselves. That makes sense for a single match artifact. It does **not** make sense as the default for a persistent duo. If you later ship a Team entity, the acceptable default is: both users must opt in, the default scope should be future sessions only, and expanding the scope to historical sessions or shared progression should require a second explicit grant. citeturn1view1turn27view0turn19view0

The patterns to avoid are the ones most likely to feel magical in onboarding and creepy later. Avoid any-user-can-claim persistent teams, automatic backfilling of all historical sessions on first link, and uploader-owner models where one person becomes the administrator of a couple's training history. Also avoid conflating "I want recurring partner shortcuts" with "I consent to a durable shared identity." The former is a convenience feature. The latter is an interpersonal data contract. Treating them as the same thing is exactly how products walk into breakup UX disasters. citeturn27view0turn28search0turn8search12turn8search20

The decision to graduate from "minimal hook" to "full persistent team" should be based on observed behavior, not intuition. The cleanest rubric is to commit only when four conditions are met. First, recurrent-pair behavior is common enough that the app can detect a meaningful pool of stable dyads from repeated sessions. Second, users are already asking for team-level affordances indirectly—re-adding the same partner, comparing partner-specific outcomes, or wanting shared drill plans. Third, trust metrics are healthy: low rates of privacy objections, low rates of untag/revoke actions, and high acceptance of mutual link requests. Fourth, you can show uplift with a design that resists selection bias, such as randomized invite nudges, encouragement designs, or staggered rollout, because the broader literature shows why naive comparisons between "linked" and "unlinked" users are not enough. citeturn23view2turn22view2turn26view0turn22view4

The blunt product answer is this: **preserve the graph, not the relationship**. Store durable people optionally. Store every session's participants and side membership explicitly. Store a nullable `teamId` pointer everywhere it could matter later. Store a revocable consent ledger from day one. But do not turn "we trained together today" into "we are a permanent team" until the data proves users want that, and until the off-ramp is as good as the on-ramp. That is the cheapest path to future persistent teams, and it is also the safest one. citeturn16search1turn19view0turn27view0turn33view0
