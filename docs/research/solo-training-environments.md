---
id: solo-training-environments
title: Solo Training Environments For Amateur Beach Players
status: active
stage: validation
type: research
authority: "operational definition of 'solo' environment (resolves O4); default environment-mix planning estimate; wall-access posture"
summary: "Where amateur beach players actually do solo work, why wall access is not a safe default, and what that means for archetype defaults and drill inventory."
last_updated: 2026-04-21
depends_on:
  - docs/research/beach-training-resources.md
  - docs/specs/m001-session-assembly.md
  - docs/decisions.md
related:
  - docs/research/README.md
  - docs/prd-foundation.md
  - research-output/training-environment-distribution.md
---

# Solo Training Environments For Amateur Beach Players

## Agent Quick Scan

- Use this note to answer: where do amateur beach players do solo training, and is wall access a safe default?
- The operational answer resolves `O4` and is encoded in `D102` (Solo Open Sand is the default solo archetype) and `D103` (solo archetype selection priority).
- Not this note for adaptation thresholds, timing UX, or PoST periodization; use the respective narrower notes.

## Bottom line

No official federation survey directly answers "where do amateur beach players practice solo outside organized training?" What USA Volleyball, FIVB, AVP, Volleyball Canada, and national federations *do* publish — facility strategy, sanctioned-event geography, participation reports, and annual facility-access complaints — converges on the same picture:

- The amateur beach ecosystem is built around **public sand courts, purpose-built outdoor sand complexes, and some indoor sand** — not around rebound walls.
- Community training content is more wall-oriented than the facility reality supports, because walls are cheap to find at home or at schools and have predictable rebounds.
- For a beach-first product, **wall access is a minority convenience, not a baseline assumption**.

Confidence: **medium** on the directional conclusion; **low-to-medium** on the exact percentages.

A second desk-research pass (2026-04-16; raw provenance in `research-output/training-environment-distribution.md`) expanded the regional scope beyond North America (U.S. coasts, Northern Europe, Southern Europe, Brazil, Australia) and converged on the same conclusion from a different angle: at **default training location**, roughly **~64% open-sand-only, ~10% wall/rebounder, ~26% partner/net** globally. The wall share rises only modestly even under a relaxed "reachable within a 20-minute drive" definition, because wall access is usually borrowed from non-beach infrastructure (school walls, tennis backboards, racquetball courts) rather than being part of the beach-volleyball footprint itself. This strengthens `D102`/`D103` and sharpens the product framing below; it does not change the decisions.

## Use This Note When

- deciding what the default solo archetype should be
- deciding whether a drill library can safely lean on wall-rebound drills
- shaping the pre-session context-capture UI (`D92` — equipment toggles)
- writing product copy that describes "solo" sessions
- evaluating whether v0a/v0b preset weighting matches user reality

## Not For

- adaptation thresholds (use `docs/specs/m001-adaptation-rules.md`)
- outdoor UI glare/touch-target defaults (use `docs/research/outdoor-courtside-ui-brief.md`)
- macro periodization vocabulary (use `docs/research/periodization-post-framework.md`)
- drill-level fatigue caps or teaching-point style (use `docs/research/beach-training-resources.md` and `docs/prd-foundation.md`)

## Planning estimate: default environment mix

Location-agnostic, North America amateur beach population, single solo session:


| Environment                                               | Default share | Notes                                                                                 |
| --------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------- |
| Dedicated sand court with net (public or club)            | 35–45%        | Largest category. Courts plentiful in Los Angeles, Vancouver, Toronto, Perth.         |
| Open sand with just a ball                                | 25–35%        | Default when courts are permit-gated, crowded, or absent.                             |
| Indoor sand facility                                      | 10–20%        | Meaningful in cold climates (Canada, northern Europe); small in warm-weather markets. |
| Backyard / driveway / garage / hardscape                  | 10–20%        | Home hardscape is the real "wall" location; typically no net present.                 |
| Beach or sand venue with convenient wall/rebounder access | 3–10%         | Rare. Walls at public beaches are incidental, not infrastructure.                     |


Regional shifts:

- **Warm-weather US coasts and beach cities**: court + open-sand shares go up; indoor-sand drops; wall-at-sand stays near zero.
- **Canada and northern Europe outside peak summer**: outdoor share drops; indoor sand and home hardscape rise.
- **Australia**: outdoor-leaning but with a real indoor-sand fallback through clubs and state pathways.

If the user is **already at the beach or on sand**, the realistic mix shifts to roughly 50–60% court with net, 35–45% open sand, low single digits for wall access.

## Why wall access is not a safe default

Official federation material treats beach volleyball as a natural-beach or constructed-sand-court sport. USA Volleyball's court-building guide, FIVB World Congress material, and national federation facility strategy documents all focus on **more sand courts**, not wall infrastructure. Where facility access tightens (Canada, UK, parts of Europe), the consistent response is **indoor sand** or **home alternatives**, not walls at beaches.

Community content is the main reason wall-first impressions feel credible:

- Generic "solo volleyball" YouTube and coaching-blog content is heavily wall- and home-hardscape oriented (Sarah Pavan, Art of Coaching Volleyball, USA Volleyball coach-education material).
- Beach-specific creators behave differently. Better at Beach's 19-drill solo list contains only two explicitly wall-based drills; their home/quarantine guidance is explicit that sand is not required and pavement/self-bounce/ball-control sequences are valid substitutes.
- Reddit discussions on r/volleyball routinely ask "where can I find a wall?" — users actively hunt for walls rather than casually encountering them at beach venues.

For comparable sand-based partner sports (beach tennis, beach handball), the pattern holds: match environment is sand, but solo reps migrate to whatever hard surface is available, and underinstalled sports default even harder to indoor sand or general conditioning when outdoor access is thin.

## Access friction

Even in court-rich markets, permit systems push spontaneous solo users toward "ball plus sand" rather than "free court plus anything":

- Los Angeles County public volleyball courts across Dockweiler, Manhattan, Redondo, Venice, Zuma: first-come-first-served, but peak-hour contention is real.
- Vancouver (Locarno, Spanish Banks East/West): dozens of public courts, strong court-with-net access.
- Toronto Ashbridges Bay: ~103 courts on site, but most are permit-gated with only a handful free for public use; permit groups take precedence over casual access.
- Northern Europe (UK, Sweden): explicit federation-level pushes to convert existing hard courts into sand and to build year-round indoor beach centers (Birmingham, Gothenburg) — the center of gravity is urban sand plus indoor sand, not open-beach casual access.

Participation context: SFIA / Outdoor Foundation data shows more than 80% of US beach/sand volleyball participants are casual or recreational, on a base of ~4.18M participants (2021). Casual-heavy participants practice in the **most convenient available setting**, which strengthens the argument against planning around specialized wall infrastructure. SFIA's 2023 update puts US beach/sand volleyball at **3.917M** participants, **~71% casual** (2.769M) vs **~29% core** (1.148M) — still a casual-heavy base. (Raw: `research-output/training-environment-distribution.md`.)

## Global regional mix (default training location, 2026-04-16 desk estimate)

Planning estimates across the five largest amateur ecosystems in the sampled research. "Default" is where a recreational player trains without special planning or cross-town travel; "drive-20" is the reachable-within-20-minutes expansion.

| Region | Default open-sand-only | Default wall/rebounder | Default partner/net | Drive-20 shift (open / wall / net) | Confidence |
|---|---|---|---|---|---|
| U.S. coasts | ~62% | ~12% | ~26% | ~40% / ~15% / ~45% | medium |
| Northern Europe | ~43% | ~14% | ~43% | ~25% / ~20% / ~55% | medium |
| Southern Europe | ~68% | ~7% | ~25% | ~48% / ~10% / ~42% | medium-low |
| Brazil | ~78% | ~5% | ~17% | ~63% / ~7% / ~30% | medium-high |
| Australia | ~60% | ~12% | ~28% | ~42% / ~18% / ~40% | medium |
| **Weighted global synthesis** | **~64%** | **~10%** | **~26%** | **~45% / ~13% / ~42%** | medium |

Anchoring signals: Brazil's Rio/João Pessoa/Vitória court mapping (194 courts across 25 beaches in Rio alone; 109 Copacabana courts from 218 poles on 4.5 km); U.S. municipal inventories (LA County beach courts, Santa Monica's state beach courts across six areas, South Mission's 10 public + 4 permitted courts, Miami Beach's 18 Lummus Park courts); Sydney/Melbourne public-net inventories (South Melbourne's 12 nets up 24/7; Coogee's 2 permanent + 3 portable); Northern European organized infrastructure (Malmö's five free outdoor areas plus one indoor; England's eight Beach Volleyball Development Centres); Southern European club-plus-beach mix (Barcelona Bogatell year-round training; Carcavelos/Cascais pole-and-net scheduling). Facility audit: **1 of 14** market-facing metro venues advertised rebound-beach (Brunswick in Melbourne); **0 of 14** advertised a dedicated passing wall.

## Comparable-sport calibration

Solo modes sustain in adjacent sports when the ball-return surface is **native** to the sport or **culturally standardized**:

- **Tennis** — USTA explicitly treats wall-ball and garage-door hitting as legitimate at-home practice; a standardized backboard culture exists.
- **Pickleball** — Pickleball Canada's facility guidebook includes practice-wall case studies as an optional design feature; the City of Ottawa outdoor tennis/pickleball strategy committed to repair existing practice walls but **no new walls planned** — even where walls are understood, they are an add-on, not universal infrastructure.
- **Squash** — US Squash publishes beginner-to-advanced solo PDFs and treats solo wall work as core, because the wall **is** the game surface.

Beach volleyball is closer to the tennis/pickleball problem than to squash, except worse: the sport does not even inherit a standardized public backboard culture. The sustainable solo modalities are therefore the ones coaches already converge on — self-feed, serve, movement, touch, posture, video-assisted mechanics — not "real" passing simulation.

## Content-budget parity rule

A simple rule for keeping drill inventory honest to user environments: **the share of wall-only drills in the default library should not exceed the share of users who can do them in their default environment.** For a 26-drill seed catalog, that constrains wall-only inventory as follows (reality is that only `d24` is currently `needsWall: true`, so the library is well under budget today — the rule matters more for any future wall-heavy additions):

| World (default open-sand share) | Plausible wall-accessible share | Max wall-only drills of 26 | Drills needing rework / dual-pathing | User-weighted dead weight under a wall-first activation |
|---|---|---|---|---|
| 60% open-sand-only | ~15% | ~4 | ~22 | ~85% |
| 80% open-sand-only | ~8% | ~2 | ~24 | ~92% |
| 40% open-sand-only (optimistic) | ~40% | ~10 | ~16 | ~60% |

Lead activation cannot be wall-gated in any of these worlds without failing a majority of users. That is the quantitative form of `D102` (Solo Open Sand is default; wall-gated drills are conditional inventory).

## Subpopulations where a wall assumption is reasonable

Keep these small; they are branch cases, not trunk:

- **Rebound-beach players** at facilities like Brunswick Beach Volleyball Centre in Melbourne, where rebound is part of the offering.
- **High-commitment pathway athletes** in Northern-European / UK indoor beach ecosystems (indoor sand halls, development centres, off-season auxiliary space), where structured partner/net work is normal and wall borrowing is plausible.
- **Indoor-to-beach crossover athletes** with routine access to racquetball courts, school walls, or tennis backboards from their primary sport, motivated enough to use non-beach infrastructure for beach improvement.

Outside these niches, a wall-first product is overfitting to the motivated minority.

## Onboarding environment prompt

The actionable recommendation from the regional synthesis is to ask one structured question at onboarding:

- **Only sand and ball** (default; `solo_open` archetype)
- **Sand plus wall or rebounder** (`solo_wall` branch)
- **A partner and a net** (`pair_net` / `solo_net` branch depending on player count)

In the current product this is already encoded as `D92` equipment toggles (wall / net / cones) with last-session persistence and wall defaulting to off on first run, plus `D90` for today's player count; the three bullets above are the plain-language framing that the toggles resolve to. Product copy and any future onboarding visuals should lead with **open sand** as the assumed default and treat wall/rebounder and partner/net as explicit branches rather than equal-weight starting points. The 3-preset solo set in `app/src/domain/presets.ts` (Open Sand, Solo Serving, Wall Pass) should present in that order so the first card a solo tester sees matches the majority environment.

## Confidence and honesty

- **Directional conclusion** (wall is a minority; open-sand and court-with-net dominate): medium confidence. Multiple independent signals point the same way (federation strategy, facility inventories, community content patterns, reported access friction).
- **Exact percentages**: low-to-medium confidence. They are a planning estimate, not a census. Use them to rank defaults, not to justify specific UI weights to three significant figures.
- **Unresolved**: how many self-described "solo" users practice at home (garage/driveway) vs at a beach. This gap is the core reason `O4` stays on the validation list even after we encode the default — M001 field testing should capture it.

## Freeze now

Encoded as decisions so downstream docs and code can stop reasoning from first principles:

- Solo default archetype = **Solo Open Sand** when environment is unknown or the pre-session context does not explicitly indicate a wall. See `D102`.
- Solo archetype selection priority = **`solo_net` > `solo_wall` > `solo_open`**. Net wins when toggled (a wall at a net-equipped facility is almost always incidental); wall is reached only when explicitly toggled without a net (home/garage case); `solo_open` is the default when neither is toggled. See `D103`. This reverses the previous `selectArchetype()` wall-first behavior in `app/src/data/archetypes.ts`; the selector and the solo preset ordering in `app/src/domain/presets.ts` were realigned 2026-04-16 (see "Apply to current setup").
- Wall-gated drills are **conditional inventory** — available only when the session's context explicitly includes `wall available = yes`. See `D102`.
- Pre-session context capture (`D92`) treats wall/net/cones as equipment toggles with **"wall" defaulting to off** on first run, then remembered per-user thereafter.

## Validate later

During M001 field testing (`D91` cohort):

- Log where testers actually train (beach / open sand / indoor / home) and whether they report wall access.
- Measure whether users ever toggle "wall available = yes" unprompted, or whether wall is effectively dead inventory for beach-first testers.
- Check whether home-hardscape users turn out to be a distinct segment (different retention, different session lengths, different skill focus) that deserves its own archetype or just a flagged variant rotation.
- Revisit the percentages against real tester behavior before encoding them into any UI weighting (preset ordering, default filters, etc.).

## Apply to current setup

Audited against the repo as of 2026-04-16. The drill catalog is largely already aligned with this research; the archetype selector and preset weighting are not.

### Drill catalog (`app/src/data/drills.ts`)

- Only **d24 "Pass into a Corner"** sets `needsWall: true`. It uses `feedType: 'wall-rebound'` (consistent with `D76`).
- **d24 is not an `m001Candidate`**. The default M001 rotation is already wall-free. No drill change required.
- All other wall-adjacent ideas in the 26-drill seed are self-toss or partner variants, which matches the research's finding that beach-specific content leans toward self-toss/self-bounce/self-pass rather than wall work.
- Action: none in drills.ts. Confirm in field testing that no wall-dependent drill sneaks into the default path.

### Archetype selector (`app/src/data/archetypes.ts`)

- **Fixed 2026-04-16.** `selectArchetype()` for solo contexts now evaluates `netAvailable` before `wallAvailable`, so the effective truth table matches `D103`: `(net=T, *) → solo_net`, `(net=F, wall=T) → solo_wall`, `(net=F, wall=F) → solo_open`. A user who has both a wall and a net is overwhelmingly at a net-equipped facility with incidental wall access, not at a home wall with an incidental net. Before the fix, the selector returned `soloWall` first when `wallAvailable` was true and inverted that priority.

### Presets (`app/src/domain/presets.ts`)

- **Fixed 2026-04-16.** `getPresetsForPlayerCount(1)` now returns Open Sand → Solo Serving → Wall Pass, in that order, so the first preset a solo tester sees matches the majority environment.
- **Fixed 2026-04-16.** `solo-serving` preset is retagged from `archetypeId: 'solo_open'` to `solo_net`, matching its "Net + balls" description and the serving-to-zones behavior it actually drills. Three solo presets now map to three archetypes rather than two.

### Docs already aligned

- `docs/prd-foundation.md` already lists `wall or fence available` as a post-first-run refinement (not a mandatory first-run input).
- `docs/decisions.md` `D79` already treats environment suitability as structured boolean flags and `D92` already plans equipment toggles with last-session persistence.
- `docs/specs/m001-session-assembly.md` already defines the four archetypes; this research clarifies the default-when-unspecified and selection priority.

## Open questions specific to this note

- What share of self-described solo users are at **home** (garage/driveway/school wall) vs at a **beach or sand venue**? M001 field testing should split these.
- Should home-hardscape users see a differently framed session (e.g., "Home Pass Workout" explicitly, rather than "Solo Wall" with beach-colored copy)? Tied to positioning and marketing, not just assembly.
- When a user toggles wall-available on, should we still recommend a primarily self-toss session and treat wall drills as optional "bonus inventory"? Plausible, but pending tester evidence.
- **Surface type as a first-class axis (sand / grass / concrete / indoor / home-hardscape / other).** Currently surface is implicit in the `netAvailable` / `wallAvailable` toggles plus drill-level `environmentFlags`, and those correlations carry ~90% of what an explicit surface axis would discriminate for drill eligibility. Don't promote surface to a `SetupScreen` question for M001 — it inflates the pre-session funnel and mostly re-expresses existing toggles. Revisit when any of these tripwires fire: (a) a drill enters the catalog with deliberate floor contact (dive / sprawl / pancake / block-transition) where sand is safe and concrete is not — surface filter must precede that drill, not follow it; (b) post-session telemetry (see next bullet) reveals a meaningful home-hardscape or indoor cohort (>~20% of completions) that warrants a dedicated archetype and copy framing; (c) plyometric or high jump-volume blocks get added where impact load differs materially by surface. Cheap capture mechanism to unblock (b): a single optional post-session tag on the Review screen ("Where did you train?" — sand / grass / concrete / indoor / home / other), one tap, non-blocking. That answers the `O4` split above without touching setup. Pair with a permissive-default `compatibleSurfaces: Surface[]` field on `DrillVariant` that stays unwired until tripwire (a) or (c) fires — the day it does, the field is already there and the assembler has surface context to filter against.

## Related decisions and questions

- `O4` — operational definition of "solo"; this note and `D102` resolve it for planning purposes, pending M001 field-test confirmation.
- `D67` — 3–4 session archetypes (solo_wall, solo_net, solo_open, pair_net, pair_open).
- `D76` — feed type is a required variant field; `wall-rebound` is one of the five values.
- `D79` — structured environment flags (needs-wall, needs-net, etc.) as hard filters.
- `D92` — pre-session context capture includes wall/net/cones toggles.
- `D95` — v0a three-preset set includes Solo Wall Pass; the research argues this over-weights wall for a beach-first product and v0b/M001 preset selection should rebalance.
- `D102` (new) — Solo Open Sand is the default solo archetype; wall is conditional inventory.
- `D103` (new) — solo archetype selection priority is `solo_net > solo_wall > solo_open`; the code was realigned from its previous wall-first behavior on 2026-04-16.

## Change log

- 2026-04-16 — note created from desk research on federation facility strategy, participation data, access patterns, and community content. Resolves `O4` operationally and seeds `D102` and `D103`. Flags code corrections in `selectArchetype()` and preset ordering as follow-up items.
- 2026-04-16 — expanded regional evidence added (U.S., Northern Europe, Southern Europe, Brazil, Australia) from a second desk-research pass; raw provenance in `research-output/training-environment-distribution.md`. Added a global regional-mix table, a content-budget parity rule for wall-only drill inventory, a comparable-sport calibration (tennis, pickleball, squash), an explicit onboarding-prompt recommendation, and a subpopulations-where-wall-is-safe list. New evidence strengthens `D102` and `D103` without changing them. Code corrections in `selectArchetype()` (net > wall evaluation order) and `app/src/domain/presets.ts` (Open Sand → Solo Serving → Wall Pass order; `solo-serving` retagged to `solo_net`) applied in the same pass; `docs/specs/m001-session-assembly.md` code-alignment note updated to reflect the fix.
- 2026-04-21 — parked a future-work open question on promoting surface type (sand / grass / concrete / indoor / home-hardscape / other) to a first-class axis. Decision for M001: don't add it to `SetupScreen`; existing `netAvailable` / `wallAvailable` + drill `environmentFlags` cover ~90% of eligibility cases. Tripwires for revisiting documented (floor-contact drills, meaningful home-hardscape cohort in post-session telemetry, plyometric blocks). Suggested cheap capture path: optional post-session surface tag on Review + permissive-default unwired `compatibleSurfaces: Surface[]` field on `DrillVariant`. No code change in this pass.