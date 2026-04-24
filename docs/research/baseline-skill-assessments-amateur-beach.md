---
id: baseline-skill-assessments-amateur-beach
title: Per-Skill Baseline Skill Assessments For Amateur Beach Volleyball
status: draft
stage: validation
type: research
authority: "Decision-relevant distillation of external vendor evidence on self-administered baseline skill assessments (passing / serving / setting) for adult recreational beach volleyball players (2–5 years experience, 1–3 sessions/week, self-coached). Informs any future Phase 1.5 baseline-test surface; validates current product posture that partner-mode is the only high-fidelity configuration for pass and set. Not authoritative for per-drill progression math (`D80`, `D104`, governed by `docs/research/binary-scoring-progression.md`), onboarding-band taxonomy (`D121`), or Tier 1b drill content."
summary: "Three-vendor synthesis on self-administered baseline skill assessments for amateur beach volleyball. All three vendors received 2026-04-22. Convergent findings: serve is the only skill with strong self-administered psychometric support (Costa 2024 serve accuracy test anchors the recommendation at ICC 0.81–0.91; 2 of 3 vendors endorse); pass and set require partner (or wall for set) for any fidelity, with Zetou 2005 / NCSU / AAHPERD-style 10-trial target protocols the convergent partner-mode shape; solo-no-wall-no-partner pass and set are control drills at best, never baselines (3-of-3 vendor agreement on the framing, most explicit in vendor 3); Lidor 2007 fatigue overlay is dropped on empirical grounds (vendor 3 contradicts vendor 1 citing the original study's null result); environmental posture is standardize-collection + within-player comparison, do not cross-normalize scores (vendor 3 posture wins a 1-1-1 split); self-scoring bias is directional with convergent r ≈ 0.47 athletics anchor (Mabe & West 1982 independently confirmed by Karpen review). Two independent mechanisms (biphasic flip-at-mastery, vendor 2; outlier-anchoring / best-moment bias, vendor 3 via Guenther 2015) argue against a purely monotonic bias correction — flagged as candidate open questions for `binary-scoring-progression.md`, do not re-parameterize `D104` yet. Three-vendor unanimity on the gap: no volleyball-specific self-scoring evidence exists; the app must fill this via its own data. Vendor 2's 5-left / 5-right wind side-switch kept as an optional procedural addition for the serve test (single-source but orthogonal to scoring). Vendor 3's Ðolo 2023 float-specialist alternate and Harner 1982 two-wall solo-set are flagged for future design surfaces (float mode, off-sand home-practice mode) but not adopted as defaults."
last_updated: 2026-04-22
depends_on:
  - docs/research/briefs/README.md
  - docs/research/briefs/2026-04-22-brief-per-skill-baseline-tests.md
  - docs/research/briefs/responses/2026-04-22-per-skill-baseline-tests-vendor-1.md
  - docs/research/briefs/responses/2026-04-22-per-skill-baseline-tests-vendor-2.md
  - docs/research/briefs/responses/2026-04-22-per-skill-baseline-tests-vendor-3.md
related:
  - docs/research/binary-scoring-progression.md
  - docs/research/skill-correlation-amateur-beach.md
  - docs/research/solo-training-environments.md
  - docs/research/outdoor-courtside-ui-brief.md
  - docs/research/warmup-cooldown-minimum-protocols.md
  - docs/research/fivb-coaches-manual-crosscheck.md
  - docs/research/vdm-development-matrix-takeaways.md
  - docs/research/ltd3-development-matrix-synthesis.md
  - docs/research/pre-telemetry-validation-protocol.md
decision_refs:
  - D80
  - D104
  - D121
  - O12
---

# Per-Skill Baseline Skill Assessments For Amateur Beach Volleyball

## Agent Quick Scan

- **Bottom line.** Three independent external vendors converge on the same asymmetric product posture: **ship serve as a confident self-administered baseline**; treat **pass and set as partner-mode-primary, with solo/no-wall versions honestly labeled as control drills or deferred**. None of the three located a direct measurement on the target population (adult recreational beach, 2–5 years, 1–3 sessions/week, self-coached). The recommendation is an inference from three overlapping evidence bases with one beach-validated anchor (Zetou 2005, n=40, r ≈ 0.97 passing) + one modern psychometric anchor (Costa 2024, ICC 0.81 novice / 0.84 experienced / 0.91 total, Cohen's d = 2.20) + convergent practitioner / federation material.
- **Serve (ship as a baseline).** Target-based accuracy test anchored on **Costa 2024 graduated ring scoring** (2–22 points across concentric 1/2/3/4 m rings), 10 overhand serves, solo-administered. Vendors 1 and 3 endorse Costa; vendor 2 dissents toward a simpler 0/1/2 quadrant scheme but does not cite or rebut Costa — read as oversight rather than principled rebuttal. Pair with **Zetou 2005 beach zone geometry** for output labeling so the user sees beach-native terms (short / deep, line / angle). Adopt **vendor 2's 5-left / 5-right side-switch across the 10 trials** to cancel wind in the aggregate score (single-source but orthogonal to scoring and low-cost). Optional mode for standing-float specialists: **Ðolo 2023** float-service tests (ICC 0.77 no-net, 0.87 at 6 m off-net) — vendor 3 single-source, label as a float-serve calibration test, not a general serve grade. **Drop Lidor 2007 fatigue overlay** on empirical grounds (vendor 3 directly contradicts vendor 1: original study found no rested-vs-exertion difference).
- **Pass (partner mode only for fidelity).** Partner mode: 10 partner-served balls → forearm-pass to a target zone near the net, ordinal scoring. Three vendors, three compatible source lineages (vendor 1: Zetou 2005 r ≈ 0.97; vendor 2: VSAT ICC >0.80; vendor 3: NCSU r = 0.73 / AAHPERD α = 0.812). Use Zetou target geometry + NCSU-style zone numbering. **Solo mode is a control drill, not a baseline** (3-of-3 vendor agreement on framing; vendor 3 sharpest: *"do not pretend there is a strong solo/no-wall beach-valid baseline if there is not"*). If shipped at all, use vendor 1's discrete 10-self-toss-to-target structure with vendor 3's explicit *"control drill, not a validated reception score"* label.
- **Set (partner mode primary; solo is conditional and low-confidence).** Partner mode: 10 partner-fed balls → set to a POP target at the net. Three compatible lineages (Zetou 2005 r ≈ 0.85–0.95; AAHPERD/VSAT ICC >0.80; NCSU r = 0.88 — the strongest of the classic NCSU subtests). Solo mode: **defer or label low-confidence**. Three vendors propose three different protocols; none has published beach-adult psychometrics. If a solo option ships at all, use vendor 1's Thissen-Milder bump-allowed continuous cycle (practitioner-converged) with vendor 3's control-drill label; do not ship a hand-set-only default. For **solo + wall** (rare beach-courtside configuration), Harner 1982 two-wall overhand passing test (r = 0.87, validity 0.8274) is the strongest candidate per vendor 3 — but wall access is not a safe default per [`docs/research/solo-training-environments.md`](./solo-training-environments.md), so Harner is a candidate for a future off-sand home-practice mode, not a beach courtside default.
- **Cross-cutting posture.** 10 scored trials + 1–2 familiarization per accuracy test (30 s × 2–3 for wall tests); rubrics outcome-vs-physical-marker only (landing mark, ring, zone, court lines, net tape), never self-rated technique quality; self-scoring bias anchored on r ≈ 0.47 athletics (Mabe & West 1982 ↔ Karpen review — two independent anchors converge on the same number); expected field-ICC compression 10–20 % beyond published values; environmental posture = standardize collection (same court / balls / net / time-of-day / serve direction), log wind tag + sand Likert, **compare within-player only, do not cross-normalize scores at launch**.
- **What this evidence changes in this repo.** Validates the current product posture that pass and set are not solo-baseline-viable in the absence of a partner or wall — reinforces `docs/research/solo-training-environments.md` on the wall-not-a-safe-default framing. Validates the per-skill architecture already present at the drill and chain layers (consistent with [`docs/research/skill-correlation-amateur-beach.md`](./skill-correlation-amateur-beach.md)). Flags two independent mechanisms (biphasic, outlier-anchoring) as candidate open questions for [`binary-scoring-progression.md`](./binary-scoring-progression.md) — **do not re-parameterize `D104` yet**; wait for the app's own self-score-vs-video data. Does not modify `D80`, `D104`, `D121`, or any plan or spec; this note is evidence-informational, not a canon change.
- **What this evidence does not settle.** No volleyball-specific self-scoring evidence exists (3-of-3 vendor agreement on the gap); the app's own data must close it. The solo-set protocol choice remains 1-1-1-split-plus-defer across vendors; if the product ever surfaces a solo-set baseline, revisit. The `≥50` scored-contacts gating threshold from `binary-scoring-progression.md` is not addressed by any vendor at this abstraction level; remains a canon commitment not engaged with here.
- **Scope.** Vendor 1, vendor 2, and vendor 3 all folded in (all received 2026-04-22). 3-of-N state is complete for this brief; if a vendor 4 response arrives later, fold it in using the convention documented in [Scope and provenance](#scope-and-provenance).

## Use This Note When

- deciding whether the app should include a self-administered baseline skill assessment surface, and if so, which protocols to deploy for each of pass / serve / set
- choosing between solo-mode, partner-mode, or wall-mode protocols when a baseline-test surface is scoped
- reasoning about self-scoring bias magnitude, direction, and correction strategy in any future baseline-assessment or progression-gate design pass
- defending a decision to defer solo-no-wall pass or set baselines rather than shipping them as weak proxies
- evaluating environmental-covariate handling (wind, sand, sun, heat) for outdoor skill-assessment protocols

## Not For

- replacing `docs/research/binary-scoring-progression.md` as the source of per-drill progression-gate math (`D80` latent target, `D104` operational rule, Jeffreys posterior, hysteresis, minimum-attempt threshold) — those remain governed there
- replacing `docs/research/skill-correlation-amateur-beach.md` as the source of the per-skill-vs-scalar architectural posture — that note owns the architectural question; this note owns the assessment-protocol question
- replacing `D121` onboarding-band taxonomy — that remains a coarse starting-band hint, not tracked proficiency
- Tier 1b drill content expansion (`docs/plans/2026-04-22-tier1b-serving-setting-expansion.md`) — Tier 1b authors training drills, not assessment protocols; baseline assessments are a Phase 1.5 item per the roadmap
- derivation of per-skill training-load progressions or sRPE-engine constants — see `docs/research/srpe-load-adaptation-rules.md`

## Executive conclusion

The three-vendor posture is asymmetric and defensible: ship serve, gate pass and set on partner-or-wall availability. The asymmetry reflects the psychometric reality, not a product compromise — the underlying literature simply does not support a fully self-administered, beach-validated, high-fidelity baseline for pass and set. The vendor briefs differ most on *how prescriptive* to be about solo-no-wall fallbacks: vendor 1 labels them platform-control surrogates, vendor 2 ships them as implicit baselines with lower reliability, vendor 3 argues they should be deferred or honestly framed as control drills. Vendor 3's posture wins the framing decision on honesty grounds.

Six convergent arrows, each supported by at least two of three vendors:

1. **Zetou 2005 is the only peer-reviewed beach-validated battery covering pass / serve / set.** All three vendors cite it, all three flag that the accessible abstract does not expose full coefficients or scoring geometry, and all three use it as the beach-authenticity anchor on top of which non-beach evidence is layered. Its n = 40 sample and adolescent-skewed age range (13–26) mean the reliability coefficients it reports (r ≈ 0.97 passing, r ≈ 0.85–0.95 setting) are the strongest direct beach signal available but are not directly transferable to an adult recreational 2–5-year cohort.

2. **Costa 2024 is the strongest modern psychometric anchor for self-administered serving.** Vendors 1 and 3 endorse it (ICC 0.81 novice / 0.84 experienced / 0.91 total, Cohen's d = 2.20, cluster analysis reclassifies 90.9 %); vendor 2 does not cite it. The test's ring-target geometry ports cleanly to sand (tape or cones at 1/2/3/4 m radii); its graduated 2–22 scoring avoids the back-edge scoring-cliff Costa itself critiques in the NCSU family. The target user is populationally close (undergraduate novice-to-experienced discrimination).

3. **10 scored trials per accuracy test is the convergent minimum viable dose.** All three vendors. Vendor 1: 6–10 range. Vendor 2: strict 10. Vendor 3: 6–10 range, with a historical note that one older wall-volley variant was too noisy at 10 hits but improved to r ≈ 0.83 at 20 hits (hints at a future dose question but does not override the default). For continuous / wall tests: 30 s × 2–3 trials.

4. **Rubrics must be outcome-vs-physical-marker, not technique-quality self-ratings.** Vendor 1: "externally-defined concrete criteria over Likert technique ratings." Vendor 2: "strip all qualitative judgment from the user." Vendor 3 most explicit: "never use self-rated technique quality as the primary baseline score when you can use visible landing zones, counts, or wall hits instead." The axis that resolves apparent vendor-1-vs-vendor-2 tension on continuous-vs-binary preference is **outcome-vs-technique**, not information-per-trial — continuous is fine when the outcome is physically measurable (landing-mark distance, ring), binary / rigid ordinal is safer when the alternative would be a subjective judgment call.

5. **Partner mode is the only high-fidelity configuration for pass and set.** Three vendors, three independent source lineages, identical partition: *"a solo player cannot self-administer a true serve-receive test"* (vendor 2); *"an ecologically valid setting test requires an incoming pass"* (vendor 2); *"do not pretend there is a strong solo/no-wall beach-valid baseline if there is not"* (vendor 3). The partition is not negotiable under the current literature.

6. **Self-scoring bias is directional (overestimation), with two independent numerical anchors converging on r ≈ 0.47 athletics self-vs-observer correlation.** Vendor 1 cites Mabe & West 1982; vendor 3 independently reproduces the same number via the Karpen review (which reports r ≈ 0.29 general, r ≈ 0.47 athletics — exactly matching vendor 1). Vendor 2 adds a compatible effect-size variant (Cohen's d ≈ 0.29 individual-sport self-scoring meta-analysis). Expected field-ICC compression beyond published values: 10–20 %. **No vendor located volleyball-specific self-scoring evidence** — the gap is asserted by three independent sources and must be closed by the app's own data.

Two complicating mechanisms surface at the 2-of-3 level and are strong enough to flag, weak enough to not re-parameterize canon:

- **Biphasic bias (vendor 2).** Low-skill athletes overestimate; near-mastery athletes underestimate. A monotonic bias-correction term would over-correct at one end of the skill range. No volleyball-specific replication.
- **Outlier-anchoring / best-moment bias (vendor 3, via Guenther et al. 2015, *J Applied Social Psychology*).** 81.3 % of players in one sample / 76.9 % in another judge their best game as more representative of their true ability than their worst; 50 % of those choosing their best game pick a perfect performance. A scoring pipeline that does not down-weight outlier successes would inherit this anchoring bias. No volleyball-specific replication.

Both argue — from different mechanisms — against a purely monotonic bias correction. The correct handling is **flag both in [`binary-scoring-progression.md`](./binary-scoring-progression.md) as candidate open questions; do not re-parameterize `D104` yet**; the app's own self-score-vs-video data will adjudicate after launch.

Three vendor-specific contributions are flagged for future design surfaces but are not adopted by this note:

- **Vendor 2's 5-left / 5-right side-switch procedure** for the serve test is elegant, orthogonal to scoring, and low-cost; adopt as an optional procedural addition when the serve baseline surface is designed. Single-source.
- **Vendor 3's Ðolo 2023 float-serve alternate** (FST no-net ICC 0.77; FST 6 m off-net ICC 0.87) is worth considering as an optional float-specialist calibration mode alongside Costa primary, since performance analysis per vendor 1 shows float variants dominate in amateur and women's elite beach. Single-source.
- **Vendor 3's Harner 1982 two-wall test** (r = 0.87, validity 0.8274) is the strongest candidate for a solo + wall setting mode, but wall access is not a safe beach courtside default per existing canon (`docs/research/solo-training-environments.md`). Candidate for any future off-sand home-practice mode. Single-source.

**Practical implication for this repo:** this note is evidence-informational. It validates existing product posture (partner-mode primacy for pass and set; per-skill architecture; wall-not-a-safe-default); it flags candidate open questions for a future `binary-scoring-progression.md` refinement (biphasic + outlier-anchoring); it does not authorize unilateral changes to any `D*` item, plan, spec, or code. When a Phase 1.5 baseline-tests surface is next scoped, this note is the spec input.

## Vendor 1 evidence ladder (2026-04-22)

Condensed from [`docs/research/briefs/responses/2026-04-22-per-skill-baseline-tests-vendor-1.md`](./briefs/responses/2026-04-22-per-skill-baseline-tests-vendor-1.md). Full catalog, caveats, and verbatim citations live in that file.

| Evidence layer | Strength for per-skill | Representative anchor | Why it applies (or doesn't) |
|---|---|---|---|
| Direct measurement in target population | — | None located | The study that would settle the question does not exist in open literature. |
| Beach-specific battery (pass / serve / set) | High, beach-authenticity | Zetou, Giatsis & Tzetzis (2005, *J Human Movement Studies* 49(3)), n=40, 13–26 yr; r ≈ 0.97 passing, r ≈ 0.85–0.95 setting | Only peer-reviewed beach-validated battery; adolescent-skewed and small-sample, but the only direct beach signal on all three skills. |
| Modern-psychometric solo serve test | High, modern | Costa, Valentini, Nascimento & Ugrinowitsch (2024, *J Human Sport and Exercise* 19(2), DOI 10.55860/jj2b1p83); ICC 0.81 novice / 0.84 experienced / 0.91 total; Cohen's d = 2.20; cluster reclassifies 90.9 % | Indoor-validated, extrapolated to sand; graduated 2–22 ring scoring avoids the back-edge cliff in NCSU-family tests. Target population (undergraduate novice-to-experienced) is close to the app's users. |
| Partner-mode pass protocol | High | Gabbett & Georgieff (2006, *IJSPP* 1(2), DOI 10.1123/ijspp.1.2.95); partner-tossed to setter target, ICC 0.85–0.98, typical error 0.2–10 %; discriminates junior national > state > novice | Indoor-validated; drop the coach-rated technique rubric that is not amateur-feasible and keep accuracy-only scoring. |
| Solo-pass surrogate | Medium (honestly labeled) | Pocek et al. (2023, *J Funct Morphol Kinesiol*, PMC10204436); self-toss kinesthetic-differentiation forearm-pass, ICC 0.78–0.87 indoor female | **Platform-control surrogate, not a reception test** — user controls ball entry. Acceptable for solo baseline if honestly labeled. |
| Solo bump-set test | Medium (practitioner-converged) | Thissen-Milder & Mayhew (1991, *J Sports Med Phys Fitness* 31(3), PMID 1798309); continuous bump↔set above net height within 15×15 ft; classified 78 % of HS starters vs non-starters | Exact ICC unpublished; practitioner-converged with Special Olympics BVSAT-Bump-Set (2024) and Better at Beach Level 3 (20 consecutive) — three independent sources. |
| Self-scoring bias anchor | Moderate (non-volleyball extrapolation) | Mabe & West (1982, *J Applied Psychology* 67(3)) meta-analysis: r ≈ 0.47 self-vs-objective for athletics (highest of any domain); Dunning et al. 2004 *PSPI* 5(3) | No volleyball-specific evidence; ~10–20 % ICC compression expected from self-administration. |
| Mitigation literature | Moderate | Aguayo-Albasini et al. (2024, *BMC Psychology*, DOI 10.1186/s40359-024-01643-7): calibration tutorial lifted inter-rater ICC to 0.94 | Ship-ready product mechanism: 30-s calibration tutorial per test showing each score level. |
| Beach environmental literature | Moderate | Giatsis et al. 2018 *J Sports Sci* 36(9); Kasprzak & Łopuch 2022 *Applied Sciences* 12(14) 6985 (0 of 11 Wrocław courts met FIVB standards); FIVB WBGT >32 °C threshold (Bahr & Reeser 2012 *BJSM*) | Sand reduces jump height 5–15 % vs rigid; sand quality varies wildly across recreational courts; no peer-reviewed wind / accuracy quantification exists. |
| Performance-analysis context | Strong for priorities | Giatsis & Zahariadis 2008; Palao & Ortega 2015; Medeiros 2017; Papadopoulou 2020; Buscà 2012 *J Sports Sci* 30(3) | Attack efficacy and serve efficacy are top 2 match-outcome discriminators. Float variants dominate women's elite beach (jump-float 44.8 % efficacy, ~80 % floats overall per Koch & Tilp 2009). |

### Vendor 1 headline stance

- **Primary: asymmetric hybrid.** Partner-mode tests on Zetou 2005 protocols. Solo-mode serve on Costa 2024 concentric-ring + Zetou zone overlay. Solo-mode set on Thissen-Milder bump-set. Solo-mode pass on Pocek self-toss, explicitly labeled as platform-control surrogate.
- **Expected ICCs:** 0.75–0.90 partner-mode / 0.70–0.85 solo adaptations; minus ~10–20 % for self-scoring bias.
- **Environmental handling:** log wind (Beaufort ≥3 flag), sand condition (loose/firm/wet), time-of-day, heat (WBGT >32 °C); never compare scores across conditions without within-player baseline.
- **Optional add:** Lidor 2007 fatigue overlay for users who want a fatigue-adjusted serve score (vendor 3 later contradicts this on empirical grounds — see reconciliation).
- **Gaps flagged:** no G-study decomposition exists; no self-score-vs-video agreement study; no normative adult-recreational data; no peer-reviewed hand-set cleanness rubric; no serve-type-specific psychometrics for float vs jump-float vs jump-topspin.

## Vendor 2 evidence ladder (2026-04-22)

Condensed from [`docs/research/briefs/responses/2026-04-22-per-skill-baseline-tests-vendor-2.md`](./briefs/responses/2026-04-22-per-skill-baseline-tests-vendor-2.md). Full catalog and verbatim citations live in that file.

| Evidence layer | Strength for per-skill | Representative anchor | Why it applies (or doesn't) |
|---|---|---|---|
| Beach-specific battery | High | Zetou 2005 battery; cited as ICC 0.980 average / 0.961 single measures | Used as the beach-authenticity anchor; different coefficient presentation than vendor 1 but consistent with the same source. |
| Partner-mode pass | High (coach-administered) | Volleyball Skills Assessment Test (VSAT); ICC >0.80 for the forearm-bump subtest across populations | AAHPERD-derived; 10 tossed balls to a 6-ft circle, ordinal scoring; partner-dependent, acknowledged as disqualified for solo amateur use. |
| Solo-pass endurance | Medium (honest about ceiling) | Practitioner vertical pass-to-self; no peer-reviewed ICC, estimated ~0.60–0.70 field reliability | Flagged with an explicit validity ceiling at Better-at-Beach Level 4 — intermediate-or-below tool only. Advanced amateurs hit 30-rep cap without error. |
| Solo-serve test | High (beach-adapted) | Zetou beach-serve + VSAT; 10 serves, 4-quadrant zones | Does not cite Costa 2024. Recommends 3-level ordinal (0 miss / 1 in-bounds / 2 target quadrant) rather than Costa's graduated 2–22. |
| Wind-neutralization procedure | Moderate (procedural, single-source) | 5 serves from left baseline endpoint + 5 from right, mirroring beach-match 7-point side-switch | Novel procedural addition; orthogonal to scoring. Cancels wind in the aggregate score rather than logging and normalizing it. |
| Solo-set protocol | Low-Medium (untested) | Alternating Set-to-Self Positional Challenge: self-toss high, move feet to square, set parallel to net-tape toward antenna; 10 reps 5-per-side, binary success | No published psychometrics; construct-validity argument (footwork-to-POP is the amateur setter's actual failure mode); rejects Thissen-Milder continuous cycle because self-judging hand-set cleanness is unreliable. |
| Self-scoring bias anchor | Moderate (individual-sport extrapolation) | Individual-sport self-scoring meta-analysis (Taylor & Francis Online, DOI 10.1080/1750984X.2025.2556393): Cohen's d ≈ 0.29 individual sport vs d ≈ 0.14 team sport; higher on subjective vs objective measures | Convergent direction with vendor 1's r ≈ 0.47 athletics anchor; different effect-size scale. |
| Biphasic bias mechanism | Novel (vendor 2 contribution) | PeerJ 2024 monophasic-vs-biphasic self-assessment paper | Proposes that low-skill athletes overestimate while near-mastery athletes underestimate; a monotonic bias correction would over-correct at one end of the skill range. No volleyball-specific replication. |
| Outlier-anchoring self-judgment | — | Not addressed | Vendor 2 silent on outlier-anchoring; vendor 3 surfaces this separately. |
| Environmental handling | Moderate | Match data wind-speed 7.01–18.00 km/h alters physical performance; FIVB sand-quality standards; 7-point side-switch in match rules | Standardized via in-test 5/5 side-switch for wind; 1-tap Hard/Medium/Deep Likert for sand; orient upward-tracking tests perpendicular to sun azimuth or mandate polarized sunglasses. |

### Vendor 2 headline stance

- **Primary: solo-first, Zetou-and-VSAT-anchored.** Modified Zetou 10-serve with 5/5 side-switch; Vertical Pass-to-Self endurance cap-30; Alternating Set-to-Self Positional Challenge.
- **Rubric preference:** binary / rigid ordinal over qualitative continuous, specifically when self-scoring is involved. Strip all qualitative judgment from the user.
- **Environmental handling:** in-test wind cancellation + sand Likert (Hard/Medium/Deep) + sun-azimuth orientation.
- **Gaps flagged:** sand viscosity as a longitudinal-tracking confound; double-contact self-reporting in hand-setting; validity ceiling for advanced amateurs on endurance tests.
- **Novel mitigation proposal:** phone-video spin-check (phone propped on bag) to auto-invalidate hand-set reps with excessive rotation. Not feasible to ship at launch; flagged for future consideration.

## Vendor 3 evidence ladder (2026-04-22)

Condensed from [`docs/research/briefs/responses/2026-04-22-per-skill-baseline-tests-vendor-3.md`](./briefs/responses/2026-04-22-per-skill-baseline-tests-vendor-3.md). Full catalog and verbatim citations live in that file (including preserved `citeturnXXviewN` tool-artifact markers).

| Evidence layer | Strength for per-skill | Representative anchor | Why it applies (or doesn't) |
|---|---|---|---|
| Beach-specific battery | Signpost only | Zetou 2005 — accessible abstract confirms pass / serve / set tests exist and were reliable, but does not expose coefficients or full scoring geometry | Rates "high concept relevance, medium implementation readiness, unknown coefficient transparency" — recommends obtaining full-text before locking any beach-specific baseline. |
| Partner-mode pass | High | NCSU Volleyball Skills Test Battery (Bartlett 1991, *JOPERD* 62(2), DOI 10.1080/07303084.1991.10606554); 10 tossed balls (5 left + 5 right) over 3.20 m rope to 1–5 zones; reliability 0.73 passing, 0.88 overhand pass/setting | Indoor-derived, strongly outcome-based, partner-dependent; structurally identical to vendor 1 (Zetou 2005) and vendor 2 (VSAT). Third independent source lineage. |
| Partner-mode pass (outdoor-validated) | Medium | AAHPERD-style underhand pass outdoor implementation; 10 trials over 2.24 m rope to 3 m × 2 m target; Cronbach's α = 0.812 underhand pass (beginners on outdoor court) | First direct evidence that AAHPERD-derived pass tests work outside the indoor gym, but on beginners not beach adults. |
| Solo-serve test | High (strongest in Costa family) | Costa et al. 2024 (same as vendor 1): ICC 0.81/0.84/0.91, Cohen's d = 2.20, bullseye 2–22 scoring | Endorses Costa 2024 as the strongest modern option; vendors 1 and 3 together tip the 3-vendor vote 2-of-3 in favor of Costa over vendor 2's quadrant scheme. |
| Serve-type-specific alternate | Medium (single-source, beach-relevant) | Ðolo, Grgantov & Kuvačić (2023, *J Funct Morphol Kinesiol*, DOI 10.3390/jfmk8020063): FST with-net ICC 0.66, no-net ICC 0.77, 6 m off-net ICC 0.87; 3 max serves + 6 scored attempts to personalized 50 %/75 % of max target | Distance-control baseline for standing-float servers; vendor 1's performance-analysis evidence shows float variants dominate amateur and women's elite beach. Candidate for an optional float-specialist mode. |
| Fatigue overlay | **Directly contradicts vendor 1** | Lidor et al. (2007, *JSCR* 21(3), DOI 10.1519/R-19455.1, PMID 17685685): target-based service test in rested and post-exertion conditions showed **no differences between rested and exertion conditions**, **no differences between teams** | "Adds hassle without clearly improving discrimination." Drop the Lidor fatigue overlay from recommended defaults. |
| Partner-mode set | High (strongest NCSU subtest) | NCSU overhand pass/setting: 10 reps over 4 m rope to 1–5 zones; reliability 0.88 | Third independent source lineage for the 10-rep-to-POP-target shape; vendor 1 (Zetou) + vendor 2 (AAHPERD/VSAT) + vendor 3 (NCSU) all converge. |
| Solo + wall set | High (single-source, wall-required) | Harner 1982, Eastern Illinois University master's thesis: two-wall overhand passing test, 30 s × 3 trials; reliability r = 0.87, validity r = 0.8274 against coach ratings | Strongest solo-friendly hand-setting option identified in any brief. Hard constraint: requires two walls at right angles, rarely available on beach courts. Candidate for off-sand home-practice mode per [`docs/research/solo-training-environments.md`](./solo-training-environments.md). |
| Solo + wall set proxies | Medium (wall proxies) | Russell–Lange (30 s × 3 trials; r = 0.87 best / .90 sum; validity .63–.80); Brady's Wall Volleys (0.92 reliability, 0.86 validity) | Strong psychometrics but generic volleying, not beach-setting-specific. Noted, not recommended as primary. |
| Solo no-wall pass or set | **Explicit recommendation against** | — | "Do not pretend there is a strong solo/no-wall beach-valid baseline if there is not. Either defer or allow a wall-based proxy explicitly labeled a control drill, not a validated reception / setting score." Most conservative of the three vendors on the solo question. |
| Self-scoring bias anchor | Moderate (independent confirmation of vendor 1 anchor) | Karpen review: average self-assessment correlation r ≈ 0.29 general, r ≈ 0.47 athletics | **Independently confirms vendor 1's r ≈ 0.47 Mabe & West anchor** — two separate reviews converge on the same athletics-domain number. |
| Outlier-anchoring mechanism | Novel (vendor 3 contribution) | Guenther, Taylor & Alicke (2015, *J Applied Social Psychology*, DOI 10.1111/jasp.12303): 81.3 % / 76.9 % of baseball / softball players judge best game as more representative; 50 % of those choosing their best game pick a perfect performance | Distinct from vendor 2's biphasic flip. Both argue against monotonic bias correction; the mechanism and implications differ (biphasic reverses direction at mastery; outlier-anchoring systematically over-weights extreme positive cases). |
| Environmental posture | Moderate (anti-normalization) | FIVB Heat Stress Monitoring Protocol (WBGT captures temperature + humidity + wind + solar radiation; courtside underestimates possible); match-analysis on wind and ball-flight | **Argues against mathematical post-hoc normalization.** Recommends: standardize collection (same court / balls / net / time-of-day / serve direction), record environment metadata, simple wind tag (calm / mild cross / strong cross / into / with), compare players only to their own prior tests under similar conditions. |
| Federation beach benchmark | Low (grey literature) | Unnamed federation-style beach baseline document listing serve proficiencies for location / jump-top / jump-float / wind adjustment and bump-vs-hand setting | Supports the product decision to separate bump and hand sets in the UI taxonomy; not a validation study. |

### Vendor 3 headline stance

- **Primary: asymmetric "ship serve, gate pass/set on partner-or-wall."** Simplified Costa 2024 + optional Ðolo 2023 float alternate for serve; partner-mode pass (NCSU/AAHPERD) or defer / control-drill label; partner-mode set (NCSU/Zetou signpost) primary + solo+wall Harner if applicable or defer.
- **Environmental handling:** standardize collection, simple wind tag, within-player-only comparison. **Do not cross-normalize scores.** FIVB WBGT >32 °C threshold.
- **Self-scoring mitigations:** never self-rated technique quality; "visible landing zones, counts, or wall hits." Study design to close the literature gap: a pragmatic reliability study in the target population comparing self-score vs observer-score, estimating ICC + SEM + MDC, stratified by solo/wall/solo/net/partner-fed.
- **Direct contradiction with vendor 1:** drop Lidor 2007 fatigue overlay. Original study's null result makes the overlay's discriminative value unsupported.

## Where the vendors disagree (reconciliation)

| Axis | Vendor 1 | Vendor 2 | Vendor 3 | Repo-facing reconciliation |
|---|---|---|---|---|
| **Serve scoring geometry** | Costa 2024 graduated 2–22 concentric rings | Zetou-derived 4-quadrant 0/1/2 ordinal | Simplified Costa 2024 (endorses vendor 1) | **2-of-3 for Costa rings.** Vendor 2 does not cite or rebut Costa; reads as oversight rather than principled disagreement. Use Costa rings + Zetou zone geometry for output labeling. |
| **Wind handling inside a serve test** | Log wind + Beaufort ≥3 flag (around-test only) | Mandatory 5-left / 5-right side-switch inside the 10 trials | Standardize: same serve direction each time; simple wind tag; within-player comparison only | **Keep vendor 2's side-switch as an optional procedural addition** for the serve test; adopt vendor 3's around-test posture (same court / balls / direction; within-player comparison). Both are compatible — side-switch cancels wind inside the aggregate score, vendor 3's posture governs cross-session comparability. |
| **Solo-pass protocol** | Pocek 2023 self-toss to target (platform-control surrogate, labeled honestly) | Vertical Pass-to-Self continuous count, cap-30 | Don't ship a solo-pass baseline; use control-drill label if anything | **3-of-3 on framing (solo-pass ≠ reception test), 1-1-1 on specific protocol.** Ship vendor 1's protocol *only if* a solo option is shipped at all, with vendor 3's explicit "control drill, not a validated reception score" label. Vendor 1's discrete 10-trial structure is compatible with the `binary-scoring-progression.md` Jeffreys posterior; vendor 2's max-streak is not. |
| **Solo-set protocol (no wall)** | Thissen-Milder continuous bump↔set (30/50 cap) | Alternating Set-to-Self Positional Challenge (10 reps, 5 per antenna, binary) | Don't ship; defer or label low-confidence | **3-of-3 lean away from a confident solo-set default.** If shipped at all, use vendor 1's Thissen-Milder bump-allowed with vendor 3's control-drill label; do not ship a hand-set-only default (vendor 2's and vendor 3's cleanness critiques are strong enough to block that). Partner-mode remains primary. |
| **Lidor 2007 fatigue overlay** | Optional add-on for users who want fatigue-adjusted score | Silent | Explicitly drop: original study's null result makes it non-discriminative | **Drop from recommended defaults.** Vendor 3 contradicts vendor 1 on direct empirical grounds; vendor 2 silent; 2-of-3 against inclusion. Vendor 1's inclusion reads as oversight of the null result, not a principled justification. |
| **Environmental normalization** | Log covariates; imply cross-condition normalization possible | In-test wind cancellation + sand Likert | Do **not** mathematically normalize; standardize collection + within-player comparison only | **Vendor 3 posture wins the 1-1-1 split.** Standardize collection rules, log metadata, compare within-player. Vendor 2's in-test side-switch is kept because it's orthogonal to the posture. Vendor 1's logging is retained; the "normalize" implication is dropped. |
| **Self-scoring bias magnitude anchor** | r ≈ 0.47 athletics (Mabe & West 1982) | Cohen's d ≈ 0.29 individual-sport meta | r ≈ 0.29 general / r ≈ 0.47 athletics (Karpen review) | **r ≈ 0.47 athletics** is the repo-facing anchor — independently confirmed by vendor 1 (Mabe & West) and vendor 3 (Karpen). Vendor 2's d ≈ 0.29 effect-size variant is compatible (different scale, same direction). Expected 10–20 % ICC compression unchanged. |
| **Bias correction shape** | Monotonic (directional overestimation) | Biphasic (flip near mastery) | Outlier-anchoring (over-weight best performances) | **Flag both biphasic and outlier-anchoring as candidate open questions for `binary-scoring-progression.md`. Do not re-parameterize `D104` yet.** Two independent mechanisms from two vendors argue against monotonic; neither has volleyball-specific evidence. App data adjudicates. |
| **Rubric preference framing** | Continuous > ordinal > binary (information content) | Binary / rigid ordinal > qualitative continuous (self-scoring robustness) | Outcome-based over technique-quality-based | **All three compatible under the outcome-vs-technique axis.** Continuous is fine when outcome is physically measurable; binary / rigid ordinal is safer when the alternative would be subjective judgment. Vendor 3's framing resolves the vendor-1-vs-vendor-2 apparent tension. |
| **Trial dose for accuracy tests** | 6–10 scored + 1–2 familiarization | Exactly 10 | 6–10 (with historical note that some older wall-volley variants needed 20 for r ≈ 0.83) | **10 scored trials + 1–2 familiarization.** Narrowest interpretation of the 3-vendor range; vendor 2's fixed 10 is contained in the range; vendor 3's 20-rep note is a post-launch reliability-check consideration, not a default override. |
| **Sand-compliance Likert labels** | loose / firm / wet | Hard / Medium / Deep | Silent | **Defer labeling decision to surface design.** Both defensible; lean vendor 2's Hard / Medium / Deep because it maps directly onto Kasprzak & Łopuch 2022's depth/compaction literature. |
| **Hand-set cleanness rubric** | Acknowledge gap; practitioner-derived Trinsey-style 6-point possible | Acknowledge gap; phone-video spin-check as future mitigation | Acknowledge gap; "no validated beach-amateur bump-set-only baseline exists" | **3-of-3 agreement on the literature gap.** No rubric ships from this note. Vendor 2's CV spin-check and vendor 3's "separate bump / hand sets in UI taxonomy" are both candidate Phase 1.5+ mechanisms; federation-style benchmark documents support the UI separation without providing a validation basis. |

### What the reconciliation does not change

- No decision in `docs/decisions.md` is modified. `D80`, `D104`, `D121`, `O12`, `D91` all remain as written; this note is evidence-informational.
- No code changes land from this distillation alone. No plans or specs are rewritten. Tier 1b drill content expansion (`docs/plans/2026-04-22-tier1b-serving-setting-expansion.md`) is an unrelated scope — baseline assessments are a Phase 1.5 item per the existing brief's internal motivation.
- The synthesis does not manufacture a consensus where vendors disagree. The three-vendor 1-1-1 split on the specific solo-set protocol remains unresolved; any future solo-set surface design must revisit, not inherit a false consensus from this note.

## Synthesis stability: what would change this

The current recommendation (ship serve, partner-mode-primary for pass and set, solo-no-wall as control drill or defer) is robust across all three vendors. A vendor 4 response, a new direct-measurement study, or evidence produced internally would **change the recommendation** only if it crossed one of the following pre-registered bars. Evaluate future evidence against these bars rather than re-litigating the whole synthesis.

### Evaluation trace: vendors 1 / 2 / 3 (2026-04-22)

Recorded in-place per the convention used in [`docs/research/skill-correlation-amateur-beach.md`](./skill-correlation-amateur-beach.md).

- **Bar 1 (would flip to "ship solo-pass / solo-set as a confident baseline"): NOT crossed.** No vendor claims the solo-no-wall psychometrics support a baseline. Vendor 3 explicitly refuses the framing. Vendor 2 ships a solo protocol but flags the reliability (~0.60–0.70 estimated) below the 0.75 field-reliability threshold.
- **Bar 2 (would shift magnitude or specific protocol within the existing posture): CROSSED.** Vendor 3 tipped the serve-scoring 1-1 tie (after vendors 1 and 2) in favor of Costa 2024 graduated rings; vendor 3 contradicted vendor 1 on the Lidor fatigue overlay; vendor 3 surfaced the outlier-anchoring mechanism as a second independent argument against monotonic bias correction. All three handled by updating the Executive conclusion and the Reconciliation table; no repo-facing reversal of the partner-primary / solo-is-control-drill posture.
- **Bar 3 (would narrow or complicate scope): partial.** Vendor 3's wall-vs-no-wall distinction introduces a subcohort (solo+wall users) for which Harner 1982 is the strongest candidate protocol. Existing canon (`docs/research/solo-training-environments.md`) already treats wall access as not a safe default; the narrowing stays compatible. Vendor 3's float-specialist mode via Ðolo 2023 similarly narrows the serve-users subcohort.
- **Bar 4 (would prompt internal measurement, not a literature update): reinforced.** All three vendors effectively say the literature has hit its ceiling on self-score-vs-video agreement in amateur volleyball. Vendor 3's proposed pragmatic reliability study design (adults 2–5 years, on sand, no coach, phone-guided, compare self-score vs observer-score, estimate test-retest ICC / SEM / MDC, stratify by solo/wall/solo/net/partner-fed) becomes the reference design if the repo ever scopes a baseline-assessment cohort study. Out of M001 scope; surfaces as a candidate open question below.

No repo-facing recommendation was reversed. The synthesis state is 3-of-N complete; if no further response arrives, this is the final synthesis as written.

### Bar 1 — Would flip to "solo-no-wall pass or set is a confident baseline"

- A direct beach-adult psychometric study on a solo-no-wall pass or set protocol showing **test-retest ICC ≥ 0.80 in the target population** with **criterion validity ≥ 0.70 against a partner-mode reference**. Nothing in the current evidence approaches this.
- **OR** an internal app-cohort study (e.g., the `pre-telemetry-validation-protocol`-style design vendor 3 proposes) showing the same thresholds on the product's actual users.

### Bar 2 — Would shift a specific protocol without flipping the posture

- Evidence that Costa 2024 ring scoring has a scoring-cliff problem at beach ring boundaries (analogous to Costa's own critique of NCSU back-edges). Response: fall back to vendor 2's 0/1/2 quadrant scheme; keep vendor 2's 5/5 side-switch.
- Evidence that phone-video spin detection is feasible and accurate on-device. Response: open up hand-set-only solo protocols with automated cleanness flags (vendor 2's proposal becomes actionable).
- Evidence that the Lidor 2007 null result does not replicate in a different design. Response: revisit optional fatigue-overlay mode.

### Bar 3 — Would narrow or complicate scope

- Evidence that the **first 0–6 months / true beginners** regime shows different self-scoring bias or reliability patterns. Add a subcohort row; do not change the target-cohort recommendation.
- Evidence that the **4+ year tournament tail** shows partner-mode-only configurations are the empirical norm there too. Expected; already framed.
- Evidence that **serve-type differentiation** (float vs jump-float vs jump-topspin) has measurable within-test reliability differences. Response: annotate the optional Ðolo 2023 float-alternate mode; do not change the Costa primary.

### Bar 4 — Would prompt internal measurement, not a literature update

- Any vendor response reinforcing that the literature-inference approach has hit its ceiling on volleyball-specific self-scoring evidence. All three vendors effectively land here. The next quality-increasing move is **an internal measurement on the product's own cohort**, scaffolded on [`docs/research/pre-telemetry-validation-protocol.md`](./pre-telemetry-validation-protocol.md). Design reference: vendor 3's pragmatic study outline, paired with vendor 1's explicit call for a G-study decomposition of person × trial × day × rater × environment variance.

### Stability check: where the current synthesis could be fragile

Three honest weak points worth naming:

1. **No vendor has a direct measurement on the target population.** The entire synthesis is an inference from adjacent literature and theory. A single well-designed direct study on adult recreational beach players would outweigh the entire current evidence stack.
2. **Zetou 2005 is the only beach-validated battery and its full text is not in any vendor's hands.** All three flag this. The accessible abstract is consistent across vendors; the coefficients vendor 1 reports (r ≈ 0.97 passing, r ≈ 0.85–0.95 setting) are presented as "adequate" or "cited as" rather than directly quoted. A third party obtaining the full text and publishing the scoring geometry would materially strengthen the partner-mode recommendations.
3. **No vendor located volleyball-specific self-scoring evidence.** The r ≈ 0.47 anchor is a cross-domain extrapolation, confirmed by two independent general-athletics reviews but not by any volleyball-specific study. The biphasic and outlier-anchoring mechanisms are both from outside volleyball. This is the clearest literature gap and the one with the highest per-dollar ROI for internal measurement.

## Apply To Current Setup

| Surface | Current posture | Change required by reconciled vendor evidence? | Notes |
|---|---|---|---|
| `app/src/data/drills.ts` — per-drill `skillFocus` | per-skill | No | Validated. This note reinforces [`docs/research/skill-correlation-amateur-beach.md`](./skill-correlation-amateur-beach.md)'s per-skill posture. |
| Chain structure (serving, setting, passing chains) | per-skill | No | Validated. |
| Progression gate (`D80` / `D104`, binary Good / Not Good on 50 attempts) | per-drill-variant + fatigue context; monotonic bias correction | **Flag only, no change** | Two independent mechanisms (biphasic, outlier-anchoring) argue against monotonic bias correction. Do **not** re-parameterize `D104` yet; surface as candidate open questions in `docs/research/binary-scoring-progression.md`. |
| `D121` onboarding `skillLevel` enum | single-scalar coarse band with "unsure" escape | No | Starting-band hint, not tracked proficiency. Orthogonal to baseline-assessment protocol choice. |
| Tier 1b drill content expansion (`docs/plans/2026-04-22-tier1b-serving-setting-expansion.md`) | drill authoring + progression links + vocabulary sweep | No | Baseline assessments are a Phase 1.5 item per the brief's internal motivation; Tier 1b is drill content, not assessment protocols. |
| `docs/research/binary-scoring-progression.md` | self-scoring bias framed as directional-and-monotonic; numerical prior +5 pp / +8 pp injury-sensitive | **Small extension** | Add a subsection recording the 2026-04-22 3-vendor convergence on bias direction, the r ≈ 0.47 athletics anchor (Mabe & West ↔ Karpen), the calibration-video mitigation (Aguayo-Albasini 2024 ICC lift to 0.94), and the biphasic + outlier-anchoring candidate open questions. Core claims and numerical priors unchanged. |
| `docs/research/solo-training-environments.md` | wall-access not a safe default for solo beach training | No | Vendor 3's Harner 1982 evidence reinforces the existing posture (wall available = Harner is strongest solo-set option; wall not available = solo-set protocols have no strong candidate). |
| Any future Phase 1.5 baseline-assessment surface | undefined | **Yes (design default)** | Serve: Costa 2024 rings + Zetou zone overlay + optional vendor-2 5/5 side-switch; optional Ðolo 2023 float-specialist mode. Pass: partner-mode only as baseline; solo = control drill with explicit label, or defer. Set: partner-mode only as baseline; solo-no-wall = defer or control-drill label; solo+wall = Harner (off-sand home-practice surface, if it ever exists). Rubrics outcome-vs-physical-marker only; 10 trials + familiarization; environmental posture standardize-and-self-compare, do not cross-normalize. |
| Environmental-covariate logging at any future baseline surface | undefined | **Yes (design default)** | Log wind tag (calm / mild cross / strong cross / into / with); log sand Likert (Hard / Medium / Deep per vendor 2, mapping to depth/compaction literature); flag WBGT > 32 °C; do not cross-normalize scores. Compare within-player only. |

No code changes land from this note alone. No decisions in `docs/decisions.md` change from this note alone. The note's job is to record the evidence direction so any Phase 1.5 baseline-assessment design pass starts from the right default.

## Open Questions Flagged For Future Consideration

These are candidate open questions surfaced by the reconciled vendor evidence. They are **not** added to `docs/decisions.md` as formal `O*` items from this note; raise them there when a downstream design surface forces the question.

1. **Volleyball-specific self-scoring agreement in amateur adults on sand.** 3-of-3 vendor agreement that this evidence does not exist in the literature. The highest-ROI internal measurement: a prospective validation inside a `pre-telemetry-validation-protocol`-style cohort, where users self-score and the app re-scores via phone video. Would replace the 10–20 % ICC-compression extrapolation with a real number and would inform the biphasic-vs-monotonic bias-correction question directly.
2. **Biphasic bias correction shape (vendor 2 contribution).** If bias direction reverses near mastery, `D104`'s monotonic correction will systematically over-correct at one end of the skill range. Out of M001 scope; candidate for a post-launch `binary-scoring-progression.md` refinement once the app has enough corrected-vs-raw calibration data to test the inflection point.
3. **Outlier-anchoring / best-moment correction (vendor 3 contribution).** Distinct from biphasic: athletes over-weight their best performances as representative. If dominant, the scoring pipeline would need a winsorization or best-X% trim term rather than a reversing correction factor. Same scope gate as biphasic — flag, do not implement.
4. **Solo-set protocol choice when a Phase 1.5 baseline-assessment surface is scoped.** 1-1-1 split across vendors (Thissen-Milder continuous; toss-move-set positional; defer). If the surface ships at all, revisit with the app's own data after a trial period comparing the two candidates; do not inherit a false consensus from this note.
5. **Ðolo 2023 float-specialist alternate serve mode.** Vendor 3 single-source. Performance-analysis evidence (vendor 1) shows floats dominate the amateur and women's elite cohorts. Worth considering as an optional mode alongside Costa primary; not adopted as a default.
6. **Harner 1982 two-wall setting test for any future off-sand home-practice mode.** Vendor 3 single-source. Wall-not-a-safe-default per existing canon on beach surfaces; relevant only if the product adds a non-beach mode.
7. **Phone-video spin detection (vendor 2 proposal).** If feasible and accurate on-device at ship time, opens up hand-set-only protocols with automated cleanness flags. Currently speculative; flag for any future computer-vision feature pass.
8. **G-study decomposition of person × trial × day × rater × environment variance on the app's own data.** Vendor 1 explicit recommendation. Closes the "how many trials to detect a true 10 % skill change" question, which neither literature nor any of the three vendor briefs answer. Out of M001 scope; candidate for post-launch once N allows.
9. **Full-text acquisition of Zetou, Giatsis & Tzetzis 2005.** All three vendors flag the accessible abstract as incomplete on coefficients and scoring geometry. Obtaining the full paper would materially strengthen the partner-mode recommendations and would replace inferred coefficients with directly cited ones.

## Scope and provenance

- **State of this synthesis:** 3-of-N vendors folded in (vendor 1, vendor 2, and vendor 3, all received 2026-04-22). The note is usable standalone at this state — the reconciled recommendation and Synthesis-stability section are written to stand whether or not any further responses arrive. If no further response arrives, this is the final synthesis as written.
- **How vendor 4+ folds in without rewriting** (same convention as [`docs/research/skill-correlation-amateur-beach.md`](./skill-correlation-amateur-beach.md)):
  1. File the verbatim response under `docs/research/briefs/responses/<date>-per-skill-baseline-tests-vendor-4.md` (naming per `docs/research/briefs/README.md`).
  2. Add a `## Vendor 4 evidence ladder` section mirroring the vendor 1 / vendor 2 / vendor 3 shape; do not modify existing ladders.
  3. Add a `Vendor 4` column to the "Where the vendors disagree" table (between `Vendor 3` and `Repo-facing reconciliation`). Update the rightmost column cells only if vendor 4 materially shifts the reconciled take; otherwise leave as-is.
  4. Evaluate vendor 4's evidence against the pre-registered bars in [Synthesis stability](#synthesis-stability-what-would-change-this) and add a dated evaluation-trace block inside that section. Update Agent Quick Scan, Executive conclusion, and the summary frontmatter only if one of those bars is crossed.
  5. Bump `last_updated` and append to the `depends_on` block.
- **Verbatim sources:**
  - Vendor 1: [`docs/research/briefs/responses/2026-04-22-per-skill-baseline-tests-vendor-1.md`](./briefs/responses/2026-04-22-per-skill-baseline-tests-vendor-1.md)
  - Vendor 2: [`docs/research/briefs/responses/2026-04-22-per-skill-baseline-tests-vendor-2.md`](./briefs/responses/2026-04-22-per-skill-baseline-tests-vendor-2.md)
  - Vendor 3: [`docs/research/briefs/responses/2026-04-22-per-skill-baseline-tests-vendor-3.md`](./briefs/responses/2026-04-22-per-skill-baseline-tests-vendor-3.md)
  - Those files are the authoritative record of what each vendor actually said; this note is the repo-facing distillation. If the two layers drift, the verbatim files are correct and this note is stale.
- **Revision-by-replacement convention** (`docs/research/briefs/README.md`) does not apply to this note — this note is internal curated research, not a vendor-facing artifact. Edit in place as evidence accumulates.
- **Citation-quality notes across vendors:**
  - **Vendor 1** has the strongest citation density: named authors, journal + year + N + DOI / PMID for most claims; reports when coefficients are cited vs measured; explicit about which numbers are extrapolations.
  - **Vendor 2** is the outlier on citation specificity: most numeric claims are cited to general references (individual-sport meta-analysis, FIVB match-analysis data) rather than named primary sources with N. The directional arguments survive without the specific anchors; prefer vendor 1 or vendor 3 for downstream quantitative claims.
  - **Vendor 3** carries tool-artifact formatting (inline `citeturnXXviewN` / `citeturnXXsearchN` markers and `entity["organization","..."]` tokens) which are preserved verbatim in the response file. The resolved reference list at the bottom of vendor 3's file contains the attributed citations (Costa 2024 DOI, Gabbett 2006 DOI, Harner 1982 thesis, Lidor 2007 DOI / PMID, Ðolo 2023 DOI, Karpen review PMC, Guenther 2015 DOI, etc.). The artifacts do not affect the substance of the argument.
  - **Convergent citation reliability is highest on:** Costa 2024 (vendors 1 and 3 independently cite with the same coefficients), Zetou 2005 (all three cite, all three flag the full-text gap), Mabe & West 1982 / Karpen review (vendors 1 and 3 independently anchor the r ≈ 0.47 athletics number), and Lidor 2007 null result (vendor 3 directly citing contradicts vendor 1's optional-add recommendation).
