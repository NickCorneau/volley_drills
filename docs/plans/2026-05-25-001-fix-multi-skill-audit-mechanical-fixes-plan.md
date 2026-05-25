---
title: "Fix: multi-skill audit doc — mechanical reconciliation pass"
type: fix
status: active
date: 2026-05-25
origin: docs/reviews/2026-05-24-multi-skill-app-audit.md
---

# Fix: multi-skill audit doc — mechanical reconciliation pass

## Summary

Apply the practical short list of mechanical fixes from the 2026-05-25 ce-doc-review of the 2026-05-24 multi-skill app audit. Six findings touching one file (`docs/reviews/2026-05-24-multi-skill-app-audit.md`): three coherence cleanups in the §0 leverage table (count contradiction, broken stable-IDs claim, `n1` vs `A6 axe test` rename), one factual completeness expansion (A3's hardcoded-orange enumeration), one as-built-spec quarantine of dead radius tokens in §5, and one tier/trigger anchor pass on every open recommendation. No code changes; no behavior changes. The audit doc is currently untracked — committing its 2026-05-24 state in the same pass so the fix commits have a clean diff base.

---

## Problem Frame

The 2026-05-25 ce-doc-review surfaced 36 findings on the 2026-05-24 multi-skill app audit. Six of those are mechanical, low-cost, high-confidence fixes the audit can absorb without re-litigating its substantive recommendations: three internal-coherence defects in the §0 leverage table that make the doc self-contradicting on its own counts and IDs, one factual completeness hole (A3's `#E8732A` enumeration omits several real hardcoded sites in `app/`), one as-built-spec hygiene issue (§5's token table lists `--radius-card`/`--radius-button` as part of the system even though they have zero references and the audit elsewhere flags them as dead), and one structural omission (every open recommendation lacks a tier/trigger anchor under D124/D127/D130 founder-use mode). The deeper P1 premise concerns (Theme 2 framing, §6 research-method recommendations, §7 evidence claims) are intentionally **out of scope** here — they need engagement, not mechanical edits, and live as deferred review residuals.

---

## Assumptions

*This plan was authored in pipeline mode without synchronous user confirmation. The items below are agent inferences that fill gaps:*

- The user's `/lfg` invocation with no explicit arguments inherits the "practical short list" from the immediately preceding doc-review triage (findings 6, 7, 8, 11, 25, 26).
- The audit doc's currently-untracked state should be committed as-is (its 2026-05-24 form) before the fix commits land, so each fix commit has an isolated diff.
- Single-branch flow per AGENTS.md (commit to `main`, push to `origin`) — not a feature-branch + PR flow. The lfg pipeline's `ce-commit-push-pr` step adapts accordingly.
- Finding 26's "the third hardcoded site" framing was an under-count; the accurate fix enumerates **every** hardcoded `#E8732A` site in `app/` so A3's "two oranges, one hardcoded in an SVG" framing matches reality.
- Finding 25's "tier/trigger anchor" addition is a per-row annotation in the §0 leverage table, not a wholesale restructure of the audit's recommendations subsections.

---

## Requirements

- R1. The §0 leverage table's A2 row and §1 token-coverage table agree on radius arbitrary counts (one canonical "distinct values" number; one canonical "~N sites" approximation). (finding 6 / coh-1)
- R2. The "IDs are stable (A1–A7)" legend matches the IDs actually used in the audit, OR the audit renames `n1`/`n2` to fit. (finding 7 / coh-2)
- R3. The "Fixes applied in this pass" paragraph refers to the axe-select-then-scan item by the same identifier the §0 table and §2 use. (finding 8 / coh-3)
- R4. §5's as-built primitive spec does not list dead tokens as part of the system without explicit quarantine framing. (finding 11 / dl-6)
- R5. Every open recommendation (A2/A3/A4/n1/§4-lint/§3-CenteredHeader) carries an explicit tier/trigger anchor (e.g., "post-M001", "Tier 2 polish", "post-D101 unlock", or "deferred — no trigger") so a future agent reading the audit can route work without inferring scope. (finding 25 / sg-3)
- R6. A3's hardcoded-`#E8732A` enumeration accurately reflects the codebase: every hardcoded site in `app/` is named, and sites that cannot consume a CSS variable (HTML `<meta>`, SVG fills, PWA manifest) are flagged separately from sites that can. (finding 26 / feas-2 — expanded)

---

## Scope Boundaries

- Not modifying any code in `app/` — this is a documentation reconciliation pass only.
- Not engaging the four P1 premise findings (Theme 2 framing reshapes D124, §7 strongest-evidence claim, single displacement event → "observed", §6 research-velocity-substitution). Those need substantive review and authorial judgment, not mechanical edits.
- Not engaging the eight P2 design-lens decisions on radius binary commitment, touch-target rung values, A6 success-tone re-check, 44-vs-54-60 floor arbitration, `CenteredHeader` spec, ToggleChip/ChoiceRow state coverage, or system preferences. Per finding 25's anchoring, several of these collapse into "decide when the upstream rec fires."
- Not actually shipping A2 (radius sweep), A3 (brand-color tokenization), or A4 (touch-target scale) — those are the very recommendations whose tier/trigger this plan is anchoring. The audit's open-recommendations stay open; only their framing in the audit gets fixed.
- Not auditing every `docs/` reference to `#E8732A` (research notes, decisions, archived plans). Only `app/` runtime sites are in scope for R6.

### Deferred to Follow-Up Work

- The 28 remaining doc-review findings (4 P1 premise, 16 P2 substantive, 1 P3, 10 FYI) — record as residual review findings per the lfg pipeline step 5 handoff.

---

## Context & Research

### Relevant Code and Patterns

- `docs/reviews/2026-05-24-multi-skill-app-audit.md` — the only file edited by this plan.
- `app/src/index.css:115-116` — `--radius-card: 12px` / `--radius-button: 16px` confirmed defined-but-unreferenced (grep across `app/` returns only the definition lines).
- Hardcoded `#E8732A` sites confirmed by repo grep:
  - `app/src/components/Brandmark.tsx:37` — SVG `fill` (already named in A3)
  - `app/vite.config.ts:95` — VitePWA manifest `theme_color`
  - `app/index.html:7` — `<meta name="theme-color">`
  - `app/public/offline.html:6` — `<meta name="theme-color">`
  - `app/public/icon.svg:2` — SVG `fill`
  - `app/public/icon-maskable.svg:2` — SVG `fill`
- `.cursor/rules/machine-scannable-docs.mdc` — durable docs under `docs/` need YAML frontmatter; the audit doc already has it. No frontmatter changes needed.
- `AGENTS.md` "Operational Constraints" — single-branch flow on `main`, push to `origin` after every commit.

### Institutional Learnings

- None directly applicable. The audit doc itself functions as the prior-art surface; this plan is its mechanical-fix follow-on.

### External References

- None. All evidence is in-repo.

---

## Key Technical Decisions

- **Commit the untracked audit doc as-is in its own commit before the fix commits.** Without this baseline, the four fix commits would each carry the entire audit doc as "added" rather than "modified," obscuring what each fix actually changes. This is doc hygiene, not scope creep.
- **Reconcile A2 to "5 distinct values, ~25 sites" rather than "4 distinct values, ~20 sites."** The leverage row already enumerates the five values explicitly (`[12px]`, `[16px]`, `[14px]`, `[8px]`, `[2px]`); the §1 table's "4 distinct values" is the wrong number. ~25 vs ~20 is fuzzier (both approximate); pick ~25 since the §1 table is the more deliberate token-coverage view.
- **For finding 7 (broken A1–A7 legend), update the legend, not the IDs.** Renaming `n1`/`n2` to `A8`/`A9` cascades into the §2 accessibility table, the "Fixes applied" paragraph (which already references `n1`), and any other doc that may cite `n1`. Updating the legend to acknowledge the `n*` namespace is a one-line edit; renumbering is not.
- **For finding 11 (dead tokens in §5), mark them as "Defined but unwired — pending A2 decision (post-M001)" rather than removing them.** The audit's whole point is that they're dead; deleting them from the as-built spec would erase the very evidence A2 cites. Quarantining preserves the contradiction explicitly.
- **For finding 25 (tier/trigger anchors), add a new column to the §0 leverage table** (`Trigger`) rather than embedding the anchor in prose. Column form forces every row to declare its anchor and makes "no trigger named" visually obvious. Status legend gets one new value.
- **For finding 26, expand A3's enumeration into a sub-table inside the row** rather than just adding the missed sites inline. The new info (CSS-variable-incompatible sites: HTML `<meta>`, SVG fills, PWA manifest) is structurally different from the original framing and needs structure.

---

## Open Questions

### Resolved During Planning

- *Should finding 7 be fixed by updating the legend or by renumbering `n1`/`n2`?* — Update the legend (lower blast radius).
- *Should finding 11 quarantine the dead tokens or delete them from §5?* — Quarantine (preserves the audit's own evidence for A2).
- *Should A3's missed-sites fix only add `vite.config.ts` (per the original feas-2) or enumerate all six hardcoded sites?* — Enumerate all six; the feas-2 framing was incomplete.

### Deferred to Implementation

- *Whether to add a "Status" subcolumn (✅/⬜/🔭) to A3's expanded enumeration sub-table* — defer to write-time judgment based on layout fit.

---

## Implementation Units

- U1. **§0 leverage-table coherence cleanup**

**Goal:** Fix the three internal-coherence defects in the §0 top-findings table and its surrounding paragraph (findings 6, 7, 8) so the table no longer self-contradicts on counts, IDs, or naming.

**Requirements:** R1, R2, R3

**Dependencies:** None.

**Files:**
- Modify: `docs/reviews/2026-05-24-multi-skill-app-audit.md`

**Approach:**
- Edit A2 row's prose to read "~25 source call-sites hardcode 5 distinct radius arbitraries" (matching the §1 table's "5 distinct values" after R6 below also flips §1's "4" to "5").
- Edit §1 token-coverage table's Radius row to read "**0 references**; ~25 hardcoded `rounded-[…]` arbitraries across **5** distinct values (A2)" (changing 4 → 5).
- Edit the legend paragraph above the leverage table from "IDs are stable (A1–A7) and match the per-skill sections below." to "IDs are stable: A1–A7 for net-new audit findings; `n1`/`n2` for accessibility findings that complement the e2e critique. All match the per-skill sections below."
- Edit the "Fixes applied in this pass" paragraph's last line from "the **A6 axe \"select-then-scan\" test**" to "**`n1`** (the A6 axe \"select-then-scan\" test)" — preserving the cross-reference to A6 while making the identifier match the table.

**Patterns to follow:**
- Existing §0 leverage table format (pipe-delimited, ID-second-column).

**Test scenarios:**
- *Test expectation: none — pure documentation reconciliation. Verify by reading the diff.*

**Verification:**
- The §0 leverage table's A2 row count language matches the §1 token-coverage table's count language exactly.
- The legend explicitly accommodates `n1`/`n2`.
- The "Fixes applied" paragraph uses `n1` as the primary identifier.

---

- U2. **§5 as-built handoff: quarantine dead radius tokens**

**Goal:** Stop §5's as-built primitive spec from listing `--radius-card`/`--radius-button` as part of the sanctioned system without explicit quarantine framing (finding 11).

**Requirements:** R4

**Dependencies:** None.

**Files:**
- Modify: `docs/reviews/2026-05-24-multi-skill-app-audit.md`

**Approach:**
- In §5's Tokens table, change the radius row's Usage column from "**defined but unused — see A2**" to "**Defined but unwired — pending A2 decision; not part of the active system**". The strengthened wording stops a future contributor from reading the row as a sanctioned token.
- Add a one-sentence footnote below §5's Tokens table: "Rows marked *defined but unwired* are not part of the active as-built system; they reflect tokens authored ahead of consumers and are pending the A2 decision (see leverage table)."

**Patterns to follow:**
- §5's existing Tokens table structure.

**Test scenarios:**
- *Test expectation: none — pure documentation reconciliation.*

**Verification:**
- A future contributor scanning §5's Tokens table cannot reasonably treat `--radius-card`/`--radius-button` as sanctioned without seeing the quarantine flag.

---

- U3. **§0 leverage table: add Trigger column with explicit anchors**

**Goal:** Add a per-row tier/trigger anchor to every open recommendation in the §0 leverage table so future agents can route work without inferring scope (finding 25).

**Requirements:** R5

**Dependencies:** U1 (touches the same table; sequence after U1 to avoid merge friction in the diff).

**Files:**
- Modify: `docs/reviews/2026-05-24-multi-skill-app-audit.md`

**Approach:**
- Add a new column `Trigger` to the §0 leverage table, between the existing `Status` and `Pointer` columns. (The leverage rationale paragraph above the table notes this column.)
- Populate the column for each row:
  - A1 (✅ Done) — `n/a (shipped)`
  - A6 (✅ Done) — `n/a (shipped)`
  - n1 (⬜ Open) — `M001 in-flight (CI guard)`
  - A2 (⬜ Open) — `Post-M001; folds into design-system polish track if D101 fires earlier`
  - A3 (⬜ Open) — `Post-M001; bundle with A2 if both fire`
  - A5 (✅ Done) — `n/a (shipped)`
  - A4 (⬜ Open) — `Post-M001; gated on README's 54–60 px standard call`
  - A7 (🔭 Strategic) — `Post-M001 re-eval (2026-07-20); D101 sequencing input`
- Apply the same anchor convention to the Recommendations subsections in §1, §2, §4, §6 — each open bullet gets a parenthetical anchor when one applies (e.g., "Pre-write the `D91` interview guide now (deferred until D91 fires; not pre-work for the gate)").
- For §6's "scripted solo usability session" and "5-task usability test of 2-3 of the 'couple people'": add an anchor that names the specific decision the test informs, OR mark "deferred — no trigger named" if the audit author wants to leave the cohort question open. Plan picks the latter (safer default).

**Patterns to follow:**
- Existing §0 leverage table column shape.
- `docs/status/post-m001-content-backlog.md` as the eventual landing surface for trigger-gated items if the audit is later split.

**Test scenarios:**
- *Test expectation: none — pure documentation reconciliation.*

**Verification:**
- Every row in the §0 leverage table has a non-empty Trigger cell.
- Every open-bullet recommendation in §1/§2/§4/§6 has a parenthetical anchor.

---

- U4. **§0 + §1: A3 hardcoded-color enumeration completeness**

**Goal:** Replace A3's "Brandmark fills `#E8732A`" framing with an accurate enumeration of every hardcoded `#E8732A` site in `app/`, separated by whether the site can consume a CSS variable (finding 26 — expanded scope).

**Requirements:** R6

**Dependencies:** U1, U3 (touches the same table; sequence last in the §0 edits).

**Files:**
- Modify: `docs/reviews/2026-05-24-multi-skill-app-audit.md`

**Approach:**
- Replace A3's leverage-table prose with: "**Brand color untokenized at 6 sites in `app/`.** `Brandmark.tsx`, `vite.config.ts` (PWA `theme_color`), `index.html`/`offline.html` (`<meta>`), and two SVG icons all hardcode `#E8732A`; the accent token is `#b45309`. Of the 6 sites, only `Brandmark.tsx` can consume a CSS variable directly — the other 5 are HTML/SVG/manifest contexts that need a build-time pipeline or a hand-edit on each token change."
- In §1's Color row of the token-coverage table, expand "1 hardcoded brand pair in `Brandmark.tsx`" to "6 hardcoded brand sites in `app/` (1 React component, 2 HTML `<meta>`, 2 SVG icons, 1 PWA manifest entry); only the React site can consume a CSS variable."
- In §1's "Priority actions" item 2, add a sentence: "Five of the six sites cannot consume a CSS variable; reconciliation needs either a build-time substitution or accepting the hand-edit cost."
- Pointer column for A3 row: change from "`Brandmark.tsx:37` vs `index.css:1`" to "6 sites; see §1 token coverage" (the §1 listing carries the detail).

**Patterns to follow:**
- §1's existing token-coverage row format.

**Test scenarios:**
- *Test expectation: none — pure documentation reconciliation.*

**Verification:**
- A3's enumeration matches the actual repo state (verified by `rg "#E8732A" app/`).
- A reader scanning A3 understands the fix has 6 sites + a CSS-variable-incompatibility constraint, not just 1 site.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Editing an untracked audit doc loses work if WSL crashes mid-edit | Commit the untracked audit doc as its 2026-05-24 baseline before the fix commits start; each fix commit is then small and recoverable |
| 30+ unrelated modified files in the working tree get accidentally swept into a fix commit | Stage only the audit doc on each commit (`git add docs/reviews/2026-05-24-multi-skill-app-audit.md`); never use `git add -A` or `git commit -a` |
| A future radius decision (A2) renames the tokens, making U2's quarantine note stale | Quarantine framing already references "pending A2 decision" — when A2 fires, the row gets re-edited or removed in that same pass |
| `Trigger` column overflows narrow renders | Keep anchors concise (3-6 words); table renders fine in standard markdown viewers |

---

## Documentation / Operational Notes

- After commits land, no docs-catalog update needed — the audit doc's `id`, `title`, `status`, `last_updated`, and `summary` frontmatter fields don't change. Bump `last_updated` to `2026-05-25` in the audit doc as part of U1.
- No `docs/catalog.json` change required — the entry already exists and the routing/summary doesn't materially shift.
- No `bash scripts/validate-agent-docs.sh` run needed — the audit doc isn't a routing-critical surface and frontmatter is unchanged structurally.

---

## Sources & References

- Origin (this plan's "what to fix" source): in-session ce-doc-review on `docs/reviews/2026-05-24-multi-skill-app-audit.md` (2026-05-25, 26 actionable + 10 FYI findings; this plan addresses 6 of the 26).
- Audit doc being modified: `docs/reviews/2026-05-24-multi-skill-app-audit.md`.
- Repo operating model: `AGENTS.md` "Operational Constraints" — single-branch flow on `main`.
- Hardcoded `#E8732A` site list: `rg "#E8732A" app/` output verified during planning (2026-05-25).
