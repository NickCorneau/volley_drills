---
id: regulatory-boundary-pain-gated-training-apps
title: Regulatory Boundary For Pain-Gated Consumer Training Apps
status: active
stage: validation
type: research
authority: "regulatory posture for the pain gate + deterministic load rule + stop/seek-help bundle; avoid-phrases list and cross-jurisdiction framing for D86"
summary: "Cross-jurisdiction boundary (US / EU / UK / Canada / Australia) for a consumer training app that combines a pain-triggered session modification, deterministic progress/hold/deload, and symptom-triggered stop prompts; action-oriented synthesis for the M001 product posture."
last_updated: 2026-04-16
depends_on:
  - docs/decisions.md
  - docs/specs/m001-adaptation-rules.md
  - docs/prd-foundation.md
related:
  - docs/research/README.md
  - docs/research/onboarding-safety-gate-friction.md
  - docs/research/beach-training-resources.md
  - research-output/regulatory-boundary-pain-gated-training-apps.md
  - research-output/beach-volleyball-safety-guardrails.md
  - research-output/beach-volleyball-ai-safety.md
---

# Regulatory Boundary For Pain-Gated Consumer Training Apps

## Agent Quick Scan

- Use this note when touching any user-visible copy, feature name, or marketing claim tied to the pain gate (`D83`), the deterministic `progress/hold/deload` rule (`D11`, `D18`, `D21`), or the stop/seek-help surface (`D88`). Also use before any intended-purpose change.
- This note **supports and tightens `D86`** (general training support, not medical advice). It does not overturn any decision. It does sharpen `O7` (expert safety reviews) by pre-specifying the copy audit that counsel would be asked to sign off on.
- Not this note for the evidence base behind the safety check itself (use `research-output/beach-volleyball-safety-guardrails.md` and `docs/research/onboarding-safety-gate-friction.md`) or for drill-level progression math (use `docs/research/binary-scoring-progression.md`).
- Raw provenance lives at `research-output/regulatory-boundary-pain-gated-training-apps.md`.

## Use This Note When

- drafting or reviewing any user-visible copy on `SafetyCheckScreen`, `PainOverrideCard`, `SafetyIcon`, onboarding, run-mode prompts, or the app-store description
- naming a feature, block type, or session variant that is triggered by pain, fatigue, or symptom input
- writing release notes, ads, social posts, or blog copy that describe what the app does
- deciding whether a new feature (e.g., video analysis, physiological measurement, injury-specific modules) can stay on the wellness side at all
- deciding whether the product is ready for legal/compliance review before scaling beyond testers (`O7`)

## Not For

- resolving whether to ship a specific variant of the safety gate (use `docs/research/onboarding-safety-gate-friction.md`)
- drill-level progression math (use `docs/research/binary-scoring-progression.md`)
- evidence base for the safety contract itself (use `research-output/beach-volleyball-safety-guardrails.md`)
- regulatory submissions, 510(k) / MDR Class IIa planning, or any SaMD work — those require counsel and are out of scope for a wellness-positioned M001

## Bottom line

The feature bundle (pain-gated session modification + deterministic progress/hold/deload + stop/seek-help prompts) is **gray-area overall**. In the best implementation it can sit on the wellness side in the U.S. and Canada. It becomes **materially more exposed** in the EU, UK, and Australia if the copy or UI implies the app is treating pain, managing an injury, making specific treatment decisions, or triaging a serious condition.

Regulators across jurisdictions look at **intended purpose as expressed in labels, app-store descriptions, onboarding, in-product copy, instructions, and marketing**, not just at the disclaimer in the terms. The short verdict: **"general wellness, not medical advice" is not enough by itself.** It works only if the product behavior, feature naming, user flows, and edge-case prompts all stay aligned with that posture. The 2025 FDA WHOOP warning letter is the most on-point recent proof that disclaimers do not rescue a medical function.

Confidence: **high** on the directional conclusion; **medium** on the specific U.S. classification outcome for our bundle (no public precedent for this exact trio); **low-to-medium** on predicting EU/UK/AU outcomes in any individual case.

## What changes (and does not change) in the repo

### Freeze now (reinforced interpretation of existing canon)

The research reinforces several existing decisions and sharpens their interpretation. Treat the following as settled in light of this note:

- `D6`, `D11`, `D18`, `D20`, `D21` — deterministic rules-only logic. Any shift to AI-driven or symptom-interpretive reroutes would push us past "coaching methodology" into patient-specific recommendation territory under FDA and TGA logic.
- `D23` — first-pass review stays sRPE + one skill metric. Adding readiness / pain interpretation to the review (not just the pre-session gate) would start to resemble symptom monitoring.
- `D83` — the pain gate is a **binary readiness input for today's training option**, not a clinical assessment. Framing must stay in workout-choice language, not injury-assessment language.
- `D86` — general training support, not medical advice. This note is the operational version of that decision: it names the specific feature-level implications and the specific copy patterns that either protect or break the wellness posture.
- `D88` — stop/seek-help triggers must remain **generic, fixed safety messages**, not interpreted alerts driven by user-specific data.
- Ruled-out items already include `ACWR risk scoring`, `return-to-play guidance`, and `deep recovery analytics / HRV`. The research adds indirect support for all three.

### Apply to current setup (specific audit findings)

Audited against the repo and app source as of 2026-04-16. Nothing forces a decision reversal, but three concrete copy-level drifts exist on the "pain branch" of `SafetyCheckScreen`. They are within the spirit of `D86` but sit closer than necessary to the EU/TGA treatment-recommendation line, because they describe the re-routed session using **therapeutic-coded vocabulary** ("recovery," "protect," "further injury") rather than **training-choice vocabulary** ("lighter," "lower-load," "skip").

Current surfaces and recommended shift:

| Surface | Current copy | Why it drifts | Recommended shift |
| --- | --- | --- | --- |
| `PainOverrideCard` heading | "Session adjusted for recovery" | "recovery" reads as "recovery from injury" when triggered by a pain answer (EU MDCG 2019-11 counterexample on pain alleviation) | "Switched to a lighter session" |
| `PainOverrideCard` body | "Your session has been switched to recovery-only technique work. This protects you while you're dealing with pain." | "protects you" + "pain" implies tissue protection / injury management; leans into EU/TGA treatment-recommendation territory | "We've switched you to lower-load technique work today. You can also skip training if you prefer." |
| `PainOverrideCard` session badge | "Recovery Technique Session · N min · Low intensity" | The session name, when reached via the pain branch, reads as a pain-relief / rehab variant | "Lighter Technique Session · N min · Low intensity" |
| `PainOverrideCard` override warning | "Training through pain risks further injury." | "further injury" implies the app has inferred an injury from the pain answer; closer to diagnosis-like inference | "If pain is severe, new, worsening, or persistent, stop training and consult a qualified clinician." |
| `services/session.ts` `presetName` (pain-triggered path) | "Recovery Technique Session" | Same concern as the visible card; the name also propagates into the session record | "Lighter Technique Session" |
| `SafetyCheckScreen` error-path copy | "Could not build a recovery session. Try changing your setup." | Low visibility but uses the same therapeutic vocabulary | "Could not build a lighter session. Try changing your setup." |

Surfaces that are **not** at issue and should not be changed:

- `RunScreen` cool-down skip copy ("may affect your recovery") is wellness-coaching language about post-exercise physiological recovery, not injury recovery. Safe.
- Internal identifiers — `skillFocus: 'recovery'`, `buildRecoveryDraft`, `useRecovery`, `onContinueRecovery`, `recoveryMinutes` — are code-only and have no user-visible regulatory exposure. Leaving them avoids a larger refactor for no compliance benefit.
- `SafetyIcon` stop-list wording ("dizzy, chest pain, or unusual shortness of breath, stop immediately and seek help") is clean generic safety signposting.
- `SafetyCheckScreen`'s "Any pain that changes how you move?" is the research-backed DOMS-vs-pain phrasing from `docs/specs/m001-adaptation-rules.md` and is fine.
- The heat-tips list uses generic safety advice and does not infer a condition.

### Validate later

- A full marketing / app-store description audit **before** any public launch or paid acquisition — app-store copy is the single most common place wellness positioning accidentally collapses (see `D86` and the avoid-phrase list below).
- Whether the "strictest credible interpretation" principle (see below) should become a codified decision (`D105`-candidate) — deferred until the target markets for first launch are actually chosen. The M001 product is not yet shipping to the EU/UK/AU.
- Whether the stop/seek-help list should ever become contextual ("show only the relevant three under heat conditions") — currently fixed and generic, which is the safer posture per the FDA Sept 2025 blood-pressure safety communication.

## Strictest-credible-interpretation posture

For a single global product, the real constraint is **not** the most permissive jurisdiction; it is the **strictest credible interpretation in the markets you care about**. Until target markets for first launch are chosen, the default product posture should be to sit inside the intersection of:

- **U.S.**: updated FDA general-wellness guidance (Jan 2026) + FDA software guidance on patient-specific recommendations.
- **Canada**: Health Canada SaMD guidance + exclusion rules (support, do not drive, do not replace judgment).
- **EU**: MDCG 2019-11 (June 2025 revision) — the most restrictive example set, particularly the pain-alleviation / personalised rehab counterexample.
- **UK**: MHRA software guidance — substantively close to EU on the qualification test.
- **Australia**: TGA 2026 consumer health/wellness guidance + advertising rules (advertising claims themselves can change regulatory status).

All five regimes converge on four principles:

1. **Intended purpose controls** — as expressed in labels, app-store descriptions, onboarding, in-product copy, and marketing.
2. Wellness / fitness / healthy-lifestyle framing is helpful only if feature behavior, copy, and naming support it.
3. **Specific diagnosis, treatment, or patient-specific therapeutic decisions** are what usually trigger device classification.
4. Generic referral advice and safety signposting are safer than disease-specific inference or treatment logic.

Divergence: the U.S. and Canada preserve a broader practical zone for low-risk wellness tools and some non-device patient-support functions; the EU, UK, and Australia move faster toward regulation when software is framed as **alleviating pain, supporting therapy, or making treatment-related decisions**, even for consumer-facing software.

## Feature-by-feature mapping

### Pain gate

Most sensitive feature in the bundle. Regulators are much more tolerant of generic readiness, fatigue, and soreness adaptation than of anything that sounds like managing an injury or alleviating pain.

- **Wellness framing (safer):** treat pain input as a **readiness / preference signal** that offers a lower-intensity or lower-impact alternative for training convenience. Let users override or skip easily.
- **Drift signals (gray / unsafe):** labeling the replacement session as rehab or recovery-from-injury; claiming the algorithm protects, treats, or restores an injured body part; presenting pain as a clinical symptom; auto-assigning a "pain-relief session" or a "return-to-play" plan.

Under EU guidance, pain-alleviating personalised rehab guidance is **plainly medical**. Under FDA and TGA logic, the same shift looks like a patient-specific treatment suggestion even in the U.S.

### Deterministic progress / hold / deload

Not automatically a medical-device problem. Fitness apps have long used structured progression logic. Risk depends on **what the rule is said to be doing**.

- **Wellness framing (safer):** method for adjusting training difficulty toward a performance goal.
- **Drift signals:** "prescribed loading dose," "return-to-training protocol," "recovery plan for pain," "medically safe progression," "injury-management plan."

`D11`, `D18`, `D21`, `D64`, and `D89` already encode the "coaching adaptation" framing; this note just asks future copy to stay there.

### Stop / seek-help prompts

The least dangerous of the three features, provided they stay simple.

- **Safer:** fixed, generic safety messages and referral advice ("if you feel chest pain, fainting, or severe breathing difficulty, stop and seek help"). MHRA explicitly treats referral advice such as "see your GP" as less likely to be a device; Health Canada's examples leave room for chat-based triage.
- **Riskier:** symptom- or physiology-driven alerts that infer a specific medical condition ("your symptoms indicate heat stroke," "your data suggests a cardiac event"). These resemble diagnosis and inherit the FDA blood-pressure-alert concern that inaccurate alerts can delay treatment or produce unnecessary interventions.

## Avoid-phrase list (action surface)

Never ship user-visible copy, feature names, or marketing claims that include these terms or direct equivalents:

- `prescribe`, `dose`, `therapy`, `rehab`, `rehabilitation`
- `treat pain`, `alleviate pain`, `pain relief`
- `recover your injury`, `manage your injury`, `injury recovery plan`
- `return-to-play protocol`, `return-to-sport`, `post-op`
- `medically safe progression`, `clinical grade`, `clinically proven`
- `detect`, `screen`, `red flag` (in the sense of symptom interpretation)
- `prevent injury`, `reduce injury risk` (as a claim about the product's effect)
- `manage a condition`, `monitor your condition`
- `our algorithm knows when you should seek care`

The rationale is cross-jurisdiction: official guidance across the FDA, EU, MHRA, Health Canada, and TGA repeatedly ties device status to **diagnosis, treatment, alleviation, prevention, clinical decision-making, or specific treatment recommendations**. Recent FDA enforcement (WHOOP, 2025) shows those implications can overwhelm disclaimers.

Words that are **acceptable** in the right context:

- `recovery` — when clearly referring to post-exercise physiological recovery (cool-down, rest day, sleep), not when referring to recovery from injury or a re-routed session triggered by a pain answer.
- `deload` — as a coaching methodology term applied to load, not as a treatment decision for a condition.
- `lighter`, `lower-load`, `lower-impact`, `skip today` — preferred wellness-framing vocabulary for pain-triggered alternatives.
- `consult a qualified clinician`, `see your GP`, `seek medical attention` — safe referral advice.
- `stop training` / `stop this session` — generic safety signposting.

## Copy banks (to reference when drafting new surfaces)

### Terms / onboarding

- "This app provides fitness and wellness information for general training purposes only. It is not medical advice, and it is not a substitute for professional medical diagnosis, treatment, or care."
- "Consult a qualified healthcare professional before starting a new exercise program, especially if you have an existing medical condition, a recent injury, chest pain, dizziness, loss of balance, bone or joint problems, or concerns about exercise safety."
- "The app is not intended for emergencies or urgent medical situations. If you think you may be having a medical emergency, contact emergency services immediately."

### Pain gate

- "Reported pain or discomfort today? We can switch you to a lower-load or lower-impact training option, or you can skip training today."
- "This adjustment is a training preference feature. It does not diagnose injuries or recommend medical treatment. If pain is severe, new, worsening, or persistent, stop exercising and contact a qualified clinician."

### Stop / seek-help

- "Stop this session now if you feel chest pain, faintness, dizziness, unusual breathlessness, or feel unwell enough that continuing exercise does not seem safe."
- "If symptoms are severe, rapidly worsening, or you think you may need urgent care, seek medical help immediately."

## Public enforcement reference points

- **FDA WHOOP warning letter (July 2025):** the most on-point recent enforcement precedent. FDA held that the blood-pressure feature was being marketed without authorization, that the disclaimers were insufficient, and that a blood-pressure estimate is inherently associated with diagnosing hypo- and hypertension. Relevance here: disclaimers do not rescue a medical function.
- **FDA safety communication on wearable blood-pressure features (Sept 2025):** warned that inaccurate alerts can delay treatment or drive unnecessary intervention. Relevance: symptom- or physiology-driven alerts that infer a condition inherit this concern. Keep stop/seek-help as fixed generic signposting.
- **CPSC v. Peloton (2023, $19M civil penalty):** not a SaMD precedent, but a reminder that "not a medical device" is not the same as "legally safe." Consumer-protection, product-safety, advertising, and negligence exposure persist.

## Escalation triggers (when to call counsel, not just re-read policy)

Escalate to qualified counsel, not just further policy reading, if the product is considered for:

- marketing for injury recovery, pain relief, rehab, return to sport, post-op recovery, chronic-condition management, pregnancy / postpartum risk management, or any use case that is recognizably clinical
- adding clinician dashboards or intended use in clinical practice
- interpreting physiological signals or symptom patterns to make user-specific medical inferences
- switching from "suggested training adjustment" to "specific treatment recommendation"
- introducing medically charged metrics such as blood pressure, ECG, SpO2, glucose, or similar
- shipping one globally uniform product while selling in the EU / UK / Australia
- making claims that the app is clinically proven, safer, or effective for pain or injury outcomes

These are not drafting tweaks. They are intended-purpose decisions.

## Open questions specific to this note

- What is the first target market for public launch? Until chosen, the strictest-credible-interpretation posture governs. If launch is U.S.-only and Canada-only, there is more practical room than this note implies. If launch includes the EU, UK, or Australia, the therapeutic / pain-alleviation trap must be designed out up front.
- Does the current pain branch need a tighter inline "consult a clinician" line for severe/persistent pain, surfaced *before* the override, not only in terms? The research suggests yes when pain severity is self-reported, but the specific placement is a UX test inside the `D91` cohort, not a regulatory obligation on its own.
- Should the session record persist the pain-branch session under a regulatory-clean name (`lighter_technique`) independent of the user-facing label? Useful if the UI copy ever changes again; out of scope for v0b.

## Related decisions and open questions

- `D6`, `D11`, `D18`, `D20`, `D21` — deterministic, AI-excluded adaptation; reinforced by this note.
- `D23` — lightweight first-pass review; guards against drifting into symptom monitoring.
- `D56`, `D82`, `D83`, `D88` — safety contract; this note names the specific language that protects the wellness posture.
- `D86` — general training support, not medical advice; this note is the operational surface for that decision.
- `O7` — pre-scaling expert safety reviews; sharpens the legal/compliance track item with a concrete copy-audit scope.

## Change log

- 2026-04-16 — note created from a desk-research synthesis covering the updated FDA general-wellness guidance (Jan 2026), FDA SaMD software guidance, MDCG 2019-11 (June 2025 revision), UK MHRA software guidance, Health Canada SaMD framework and exclusions, Australia TGA 2026 guidance and advertising rules, the 2025 FDA WHOOP warning letter and blood-pressure safety communication, and public wellness-positioning patterns from WHOOP, Future, Runna, MyFitnessPal, Fitbod, Caliber, Freeletics, Headspace, Calm, Peloton, and Apple. Strengthens `D86`; sharpens `O7`; seeds a concrete copy audit of `PainOverrideCard`, `services/session.ts` preset naming, and the `SafetyCheckScreen` error-path string.
