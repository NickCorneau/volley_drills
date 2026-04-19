---
id: product-naming
title: Product Naming
status: active
stage: planning
type: research
authority: rationale for the product-name change from "Volley Drills" to "Volleycraft"; naming tests applied; rejected alternatives; rename-scope guardrails
summary: "Why the product is called Volleycraft, which tests the name had to pass, and which alternatives were rejected (and why)."
last_updated: 2026-04-19
depends_on:
  - docs/vision.md
  - docs/prd-foundation.md
  - docs/decisions.md
  - docs/research/japanese-inspired-visual-direction.md
  - docs/research/outdoor-courtside-ui-brief.md
---

# Product Naming

## Agent Quick Scan

- Use this note for the canonical rationale behind the product name **Volleycraft** and for the tests any future rename would need to beat.
- The short decision record is `D125` in `docs/decisions.md`; this note is the long-form evidence behind it.
- Not this note for brand visual direction (`docs/research/japanese-inspired-visual-direction.md`), outdoor-UI legibility rules (`docs/research/outdoor-courtside-ui-brief.md`), or trademark / domain acquisition execution (out of scope until post-`D91`).

## Bottom line

The product is **Volleycraft**. The name was chosen to satisfy, in order:

1. **Volleyball-committed.** The product is for volleyball specifically, beach-first in M001 scope with planned extension to indoor volleyball. The name must signal *volleyball*, not the broader category of *court sports*, *net sports*, or *fitness tools*.
2. **Signals "training tool" without a Facebook echo.** The suffix `-craft` reads as *practiced, deliberate skill-building* (`woodcraft`, `stagecraft`, `witchcraft`, `statecraft`). It carries the "training / practice / patient improvement" meaning that the `-book` suffix family would also carry, but without the *Facebook*-adjacent shape that `-book` compounds pattern-match to (especially `[thing-noun] + book`).
3. **Voice match to product canon.** `docs/vision.md` anchors the product as *"light on the surface, serious underneath."* The English morpheme *craft* is an unusually tight single-word match for that phrase — *a craft is patient, repeated, deliberate work that produces real skill over weeks and months*. That is the product thesis.
4. **Non-Japanese, non-martial, non-generic-tech.** The user rejected Japanese-inspired names (`Kata`, `Waza`, `Kihon`) and category-generic tech words (`Platform`). *Volleycraft* is English, volleyball-committed, and category-distinctive.
5. **Clean SEO, IP, and extension architecture.** No dominant prior brand in app stores, fitness, sport, or consumer tech. Extension shapes (`Volleycraft Pair`, `Volleycraft Club`, `Volleycraft for Coaches`, `Volleycraft Pro`) all read as natural noun phrases.

## Tests a product name had to pass

These were the evaluation lenses used in the selection pass. They are worth preserving in this note because any future rename should clear the same bar.

### Product-semantic tests

- **T1 — "What does this do" on first hearing.** A stranger hears the name and can guess it is a training tool, before any subtitle or copy. This ruled out purely atmospheric single-word names like *Driftline*, *Tideline*, and *Sandwork* — they were beach-evocative but said nothing about purpose.
- **T2 — Sport-committed, not category-committed.** The name signals *volleyball* specifically. This ruled out *Courtbook* (too broad: covers basketball, tennis, pickleball) and *Rallybook* (too broad: covers all net/racquet sports).
- **T3 — Survives the realistic extension envelope.** Beach volleyball → indoor volleyball is the realistic long-run extension path. The name must not lock the product to beach only. This ruled out *Sandbook*, *Sandcraft*, and *Sandline*.
- **T4 — Voice match to `docs/vision.md`.** *"Light on the surface, serious underneath"* is the canon posture. The name must not add hype, urgency, or corporate-SaaS tonality. This ruled out *Pro*, *Max*, *Boost*, *Platform*, and any `Coach-` prefixed name (also conflicts with `D6` / `D21` no-AI-coach positioning).

### Brand-defensibility tests

- **T5 — Distinctive, not descriptive.** The brand word must be ownable in US / EU trademark classes 009 (software) and 041 (education / training). This ruled out *Platform*, which is the entire tech industry's category vocabulary and unownable in those classes. It also weakened any name built out of a word the category already uses in ambient speech and drill sheets.
- **T6 — Clean SERP for the bare word.** Someone hears the name, Googles it, and lands on the product. This weakened *Sandline* (SERP shadowed by *Sandline International*, a 1990s private military contractor with durable Wikipedia / news presence, plus *Sandline Global* holding `sandline.com` as an active energy consultancy). It weakened *Sideout* more severely (SERP contested by *Side Out Sport*, 1988–97 beach-volleyball apparel, plus the 1990 film *Side Out* — both are culturally coded inside the exact target demographic).
- **T7 — Clean LLM / answer-engine citation.** An LLM asked *"best beach volleyball training app"* should be able to cite the product without disambiguation. Hedged answers ("Sandline, *not to be confused with the military contractor*") signal brand weakness. *Volleycraft* citations do not need hedging.
- **T8 — No adjacent-brand residue in target demographic memory.** A name whose meaning is already emotionally coded inside the 35-55 beach-volleyball demographic competes with ghosts it cannot win against. *Sideout* failed this; *Side Out Sport* apparel memorabilia and the 1990 film are still recognizable to the exact audience the product is built for.

### Linguistic / sonic tests

- **T9 — Structural distance from *Facebook*.** `[concrete noun] + book` compounds pattern-match to *Facebook* loudly. The echo is loudest on *Volleybook* (2-syl thing-noun + book, same rhythm as *Facebook*), mild on *Courtbook*, and weak on *Rallybook*. *Volleycraft* has zero Facebook echo because `-craft` sits in a completely different suffix family.
- **T10 — Cross-language legibility.** The product targets English-speaking, German, Portuguese, and Spanish-speaking beach volleyball audiences. The name should parse without instruction in all of them. *Kata* passes; *Kihon* requires explanation; *Volleycraft* passes (English-root, volleyball recognizable internationally).
- **T11 — Wordmark shape.** Two hard consonants (V, C) bookending a soft middle produces a stable, legible wordmark at any size, including at favicon scale and as a PWA home-screen label. Pairs cleanly with the existing warm-vermilion brandmark (`#E8732A`, `app/index.html`).

### Operational tests

- **T12 — Extension architecture.** All forward extensions (`Pair`, `Club`, `Coach`, `Pro`) read as clean noun phrases rather than enterprise SaaS ("Volleycraft Coach" not "Platform for Coaches").
- **T13 — Verb / narrator voice.** Copy like *"Volleycraft saved this session to your device"*, *"Volleycraft held the plan. Here's why"*, and *"Open Volleycraft. Start today's session"* reads cleanly without forced wordplay. No "clever double meaning" that has to land every time.

## Shortlist and why it lost (or won)

The selection pass evaluated a wide set of candidates. The final shortlist and the reason each was kept or cut:

| Candidate | Kept / Cut | Why |
| --- | --- | --- |
| **Volleycraft** | **Chosen.** | Passes all 13 tests. Only candidate that is volleyball-committed, Facebook-safe, voice-matched, and brand-defensible simultaneously. |
| *Volleybook* | Cut | **T9 fail.** Loudest Facebook echo in the shortlist (2-syl thing-noun + book, exact *Facebook* rhythm). User flagged this specifically during selection. |
| *Volleydeck* | Cut (held as alt) | Passes most tests but `-deck` signals *a curated set* more than *a training tool / log*. Slightly weaker on T1. Held as the clean modern-voice alternative if *Volleycraft* ever feels too artisanal. |
| *Courtbook* | Cut | **T2 fail.** Court sports includes basketball, tennis, pickleball — too broad for a volleyball-committed product. Strong on every other test. |
| *Rallybook* | Cut | **T2 fail.** Net / racquet sports umbrella — too broad. |
| *Sandbook* | Cut | **T3 fail.** Beach-only; locks out indoor volleyball. |
| *Sandcraft* | Cut | **T3 fail.** Same beach-only lock. |
| *Sandline* | Cut | **T6 fail.** *Sandline International* + *Sandline Global* contest the SERP and the `.com`. |
| *Driftline* | Cut | **T1 fail.** Atmospheric; says *beach*, doesn't say *training tool*. |
| *Tideline* | Cut | **T1 + T3 fail.** Atmospheric + beach-only. |
| *Sandwork* | Cut | **T1 + T3 fail.** Same. |
| *Throughline* | Cut | **T1 fail.** Abstract; doesn't signal volleyball or training. NPR podcast collision on the bare term. |
| *Crosscourt* | Cut | **T2 + T6 fail.** Too broad (all court sports); active Australian tennis-apparel brand *CROSSCOURT* holds `crosscourt.com`. |
| *Sideout* | Cut | **T6 + T8 fail.** *Side Out Sport* (1988–97 beach-volleyball apparel) + 1990 film *Side Out* + active *SideOut Foundation* nonprofit. Collisions sit inside the target demographic. |
| *Kata* / *Kihon* / *Waza* | Cut | User rejected Japanese-inspired framing explicitly; T4 cultural-borrowing risk + costume-adjacent brand guardrails. |
| *Platform* | Cut | **T5 fail.** Unownable in software / training classes (category vocabulary). Would never rank for its own name. |
| *Volley Drills* (incumbent) | Cut | **T1 + T4 fail.** Names the inventory (drills), not the product. Generic, SEO-saturated, forgettable as an installed home-screen label. |

## Rename scope

The rename ran across user-facing surfaces, tests that assert on those surfaces, and human-readable canonical documentation. Scope was deliberately bounded to keep the change low-risk and fully reversible pre-`D91`.

### Updated (Volleycraft)

- `app/index.html` — `<title>`, `apple-mobile-web-app-title`
- `app/vite.config.ts` — PWA manifest `name`, `short_name`, `description`
- `app/src/components/Brandmark.tsx` — `aria-label` + module docstring
- `app/src/screens/HomeScreen.tsx` — app-bar wordmark
- `app/public/offline.html` — `<title>` + `<h1>`
- `app/public/icon.svg` + `app/public/icon-maskable.svg` — `aria-label`
- Tests that assert on the displayed name: `Brandmark.test.tsx`, `HomeScreen.test.tsx`, `e2e/blocked-schema.spec.ts`, `e2e/warm-offline.spec.ts`, `e2e/phase-c3-onboarding.spec.ts`
- `app/src/db/schema.ts` — TS class renamed from `VolleyDrillsDB` to `VolleycraftDB`
- Canonical human-readable docs naming the product: top-level `README.md`, `docs/README.md`, `app/README.md`, `llms.txt`
- Research and spec docs that named the product in running prose: `docs/research/japanese-inspired-visual-direction.md`, `docs/specs/m001-phase-c-ux-decisions.md` (ASCII Home wireframe)

### Deliberately NOT updated

- **`app/src/db/schema.ts` `super('volley-drills')`** — the IndexedDB database name. Changing this orphans all existing D91-tester session data. The string is preserved with an inline comment; the TS class identifier is what was renamed. This is standard practice for product renames with live tester data.
- **Git repo slug (`volley_drills/`) and `docs/catalog.json#repo_id`** — VCS / repo-metadata identifier, decoupled from the product brand. Can be renamed deliberately post-`D91` in an infra pass.
- **`app/wrangler.jsonc#name: "volleydrills"`** — Cloudflare Workers deployment identifier. Renaming creates a new worker and requires coordinated deploy; intentionally kept stable during the pre-`D91` window.
- **Historical plan docs referencing `VolleyDrillsDB`** — `docs/plans/2026-04-16-002-*.md` and `docs/plans/2026-04-16-005-*.md` describe work that was planned and shipped under the previous name. Rewriting them misrepresents the historical record.
- **`app/package.json#name: "app"`** — already a generic scoped identifier, not the product brand.

## Positioning: volleyball-inclusive, beach-first M001 scope

The rename is deliberately **volleyball-committed** rather than **beach-only**. *Volleycraft* keeps the door open for indoor volleyball as the realistic long-run extension path.

This does **not** reopen the existing `docs/decisions.md` *Ruled out (for now)* entry for *Indoor volleyball support*. That ruled-out entry is a **current scope** decision ("M001 and Phase 1 ship beach-specific functionality"), not a **long-run brand horizon** decision. The brand name is intentionally built to survive an eventual indoor extension without forcing a rename; M001-Phase 1 shipped features stay beach-first.

If and when the product is ready to ship indoor-specific features, the *Ruled out (for now)* entry would be revisited as a separate, explicit product decision — not silently reopened by this rename.

## Open items post-`D91`

These are intentionally deferred; none block the rename itself:

- Trademark filing in classes 009 (software) and 041 (training / education) in the primary launch jurisdiction — worth the filing cost only after `D91` clears and the product is in M001 build.
- Domain acquisition posture — `.app`, `.fit`, `.com` shortlist; a single domain + one social handle is sufficient for the `D91` field-test artifact window.
- Repo-slug and Cloudflare-worker rename — infra pass post-`D91` if the product-brand name sticks past validation.
- IndexedDB database identifier (`volley-drills` → `volleycraft`) with a one-shot Dexie data migration — only worth doing if tester data volume grows enough that the mismatch becomes a cognitive drag on developers.

## Cross-references

- **Canonical rename decision**: `docs/decisions.md` `D125`.
- **Product voice / "light on surface, serious underneath"**: `docs/vision.md`.
- **Product scope and beach-first positioning**: `docs/prd-foundation.md`.
- **Visual-direction note that shaped the voice match**: `docs/research/japanese-inspired-visual-direction.md` (structural behaviors only — the note itself explicitly warns against Japanese-motif decoration, which aligns with why the brand name is English-root, not Japanese-root).
- **Brand-visual posture under outdoor legibility rules**: `docs/research/outdoor-courtside-ui-brief.md`.

## For agents

- **Authoritative for**: rationale for the product name *Volleycraft*, the naming tests any future rename must beat, and the rename-scope guardrails (which surfaces were and were not updated).
- **Edit when**: the product name changes again, a new candidate is seriously considered, or a rename-scope question (IndexedDB db name, repo slug, Cloudflare worker name) is reopened.
- **Belongs elsewhere**: product voice and principles (`docs/vision.md`), current decision status (`docs/decisions.md`), visual design direction (`docs/research/japanese-inspired-visual-direction.md`), outdoor-UI readability contract (`docs/research/outdoor-courtside-ui-brief.md`).
- **Outranked by**: `docs/decisions.md` `D125`, `docs/vision.md`.
- **Key pattern**: the 13 tests (T1-T13) are the durable evaluation rubric. Cite them by number when arguing for or against a rename candidate.
