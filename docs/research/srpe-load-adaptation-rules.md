---
id: srpe-load-adaptation-rules
title: Deterministic sRPE-Load Adaptation Rules For Amateur Skill Sessions
status: active
stage: validation
type: research
authority: concrete operating bands, minimum-history phases, and precedence-ordered rule table for the deterministic sRPE-load adaptation engine behind `D11` / `D18` / `D21` / `D84`
summary: "Post-ACWR literature synthesis for the deterministic progress/hold/deload engine: baseline3 + peak30 + 14-day rolling comparison, small-and-earned progress bands, and history phases tuned for 1-3 sessions/week skill-dominant use."
last_updated: 2026-04-16
depends_on:
  - docs/decisions.md
  - docs/specs/m001-adaptation-rules.md
  - docs/research/regulatory-boundary-pain-gated-training-apps.md
  - docs/research/binary-scoring-progression.md
related:
  - docs/research/README.md
  - docs/research/beach-training-resources.md
---

# Deterministic sRPE-Load Adaptation Rules For Amateur Skill Sessions

## Use This Note When

- setting or sharpening the concrete progress / hold / deload thresholds in `docs/specs/m001-adaptation-rules.md`
- deciding how the engine should treat novelty spikes (a single session much larger than prior 30-day peak) vs. cumulative 14-day change
- deciding what a "trusted baseline" means for a 1-3 sessions-per-week amateur population and how the engine should behave before one exists
- justifying why the engine defaults to **Hold** and treats false progression as more costly than false holding
- cross-checking the spec language against `D86` (no ACWR "danger zone" messaging; no injury-risk scoring) before copy ships

## Not For

- replacing `docs/specs/m001-adaptation-rules.md` as the implementation-ready adaptation spec
- replacing `docs/decisions.md` as the source of truth for decided policy (D11, D18, D21, D84, D86)
- generating user-facing copy; pain and load framing must go through the regulatory avoid-phrase list in `docs/research/regulatory-boundary-pain-gated-training-apps.md`
- predicting injury risk or assigning a risk score to a user or session; that is explicitly ruled out by `D86`

## Source Markers

Inline tokens of the form `citeturn…` are raw provenance markers from the upstream literature-search tool used to assemble this note. They identify where a claim came from in the research run. Keep them when editing until they are replaced with durable citations.

## Executive conclusion

For this product, the most defensible deterministic engine is **not** an acute:chronic workload ratio clone. The post-ACWR literature has moved toward **individual baselines, longitudinal interpretation, multimodal monitoring, and broad decision bands**, while warning that single workload cutoffs are easy to overclaim and often logically weak. In practical terms, that means the engine should anchor each decision to the athlete's **recent tolerated session median**, **recent session peak**, and **basic symptom/data-quality gates**, not to a universal "safe ratio." citeturn38view0 citeturn25search7 citeturn38view1 citeturn35search18

For this specific user base — amateur, self-coached, short skill sessions, only 1–3 times per week — the safest default is to treat **false progression as more costly than false holding**. A good deterministic rule set therefore makes **progress small and earned**, keeps **hold** as the default neutral verdict, and uses **deload** whenever there is pain, a clear novelty spike, or conflicting/sparse data. A defensible operating band is: **progress usually at about +5% to +10% above the athlete's recent baseline, occasionally up to +15% only with clean history; hold around baseline; deload when short-term increase exceeds roughly +20% or when a single session exceeds about +10% of the athlete's prior 30-day peak exposure**. Those bands are better defended as **conservative exposure-management rules** than as precise injury-prediction thresholds. citeturn33search8 citeturn27search25 citeturn38view0

## What the post-ACWR literature actually supports

The honest state of the field is that **ACWR has not been cleanly replaced by one superior magic number**. Recent framework papers and practice surveys point instead to **multimodal athlete monitoring systems** that combine load, wellness/readiness, and injury/illness surveillance, then interpret those data against **athlete-specific baselines** using simple distribution-based thresholds such as standard-deviation bands or minimum detectable change. That is what current serious practitioner use looks like: not a single ratio, but a **contextual dashboard with decision support**. citeturn38view0 citeturn38view1 citeturn35search18

That shift is not just fashion. A 2024 editorial explicitly argued that training-load management still suffers from **ambiguities and weak logic** when single metrics are treated as if they were causal injury predictors. A 2026 review likewise reframed monitoring around **training effects** — adaptation, maintenance, or maladaptation — rather than simplistic "good/bad" daily readiness labels. The same review emphasized that practical monitoring works best when deviations are interpreted **longitudinally and within context**, not as universal cutoffs. citeturn25search7 citeturn38view0

The evidence base is also narrower than many apps imply. A 2023 systematic review of internal and external load monitoring methods found broad use of sRPE, duration, heart rate, and external-load tools, but the literature remains methodologically heterogeneous and much stronger in **elite and organized sport** than in recreational, sparse-frequency, self-coached athletes. A 2024 review in elite team sport further noted that associations between load and injury are often **weak or highly variable**, which is exactly why a simple deterministic app should avoid pretending that one ratio can "predict" injury. citeturn7view0 citeturn27search7

The newer cohort evidence also cuts against naïve ACWR reuse. In a 5,205-runner cohort published in 2025, **single-session novelty spikes** mattered: injury rates rose when one run exceeded **10% of the longest run in the prior 30 days**. In that same study, the ACWR showed a **negative dose-response relationship**, and the simple week-to-week ratio showed **no relationship**. That does not mean ACWR is useless descriptively, but it does mean it is a poor choice for a consumer app's primary decision rule. citeturn33search8

## Why skill-dominant sessions need a different interpretation

For this target use case, the central asymmetry is real: **the same sRPE-load does not mean the same thing in a skill-dominant session as in a conditioning-dominant session**. sRPE is an internal-load measure, but the sources of perceived effort can be very different — technical difficulty, cognitive demand, repeated accelerations, movement density, or true cardiometabolic stress. That is why the same global score can hide very different tissue and locomotor demands. citeturn38view0 citeturn19search15

Recent racquet-sport work shows this clearly. In elite junior tennis, a 2025 pilot study found that **offensive and defensive strategy conditions changed external running and shot-load variables**, while internal RPE did **not** differ significantly between conditions. Another 2025 tennis study found playing-style differences in decelerations and stroke-load variables with **no significant RPE differences across most variables**. In plain English: athletes can report similar effort while doing materially different movement work. citeturn20view0 citeturn20view1

The same problem appears in technical/tactical team-sport work. A 2023 beach-volleyball study found broadly similar internal loads across analytical and situational tactical-technical methods, with only certain weeks differentiating the methods. That paper also cites earlier beach-volleyball evidence that sRPE is useful for **conditioning and technical sessions** but more limited for **tactical training and games**. A 2025 soccer drill-type study likewise focused on how the relationship between RPE and objective load changes **across drill types**, not just across session totals. citeturn22view0 citeturn19search15

That is the practical reason the engine should behave differently from a conditioning engine. A **15-minute passing session at RPE 5-6** produces a moderate sRPE-load numerically, but in a skill-first context it should usually be interpreted as **moderate internal strain with ambiguous external/tissue stress**, not as proof that the athlete needs harder conditioning next time. So the deterministic engine should be **stricter about progression**, **more tolerant of holding**, and **especially sensitive to novelty spikes**, because the sRPE number alone cannot tell you whether the load came from technical concentration or from a true physical overload. citeturn20view0 citeturn20view1 citeturn22view0

## Direct-to-engineering rule set

### Derived variables

| Variable | Deterministic definition |
|---|---|
| `session_load` | `sRPE × session_minutes` |
| `eligible_session` | non-missing sRPE and minutes, completed, no symptom-driven stop, no moderate/worsening pain flag, review present |
| `baseline3` | median of the last 3 **eligible** sessions within the prior 42 days |
| `peak30` | maximum of all completed `session_load` values in the prior 30 days |
| `curr14` | sum of completed `session_load` values in the rolling 14-day window including the current session |
| `prev14` | sum of completed `session_load` values in the immediately preceding 14-day window |
| `trusted_history` | at least 5 eligible sessions and at least 28 days of coverage |
| `emerging_history` | 3-4 eligible sessions over at least 14 days |

The absolute session envelope implied by the product design is simple arithmetic: **30-160 AU** for 10-20 minutes at RPE 3-8. Within that envelope, **30-45 AU is very light**, **45-100 AU is usual**, **100-130 AU is high for this product**, and **>130 AU is atypically high**. Those are **not universal sport-science injury thresholds**; they are product-envelope guardrails that matter mainly when individual history is sparse.

### Precedence-ordered rule table

The safest way to convert the literature into engineering rules is to use **precedence**. When several rows match, the **highest row wins**.

| Rank | Precedence rule | Verdict | Engineering note | Evidence status |
|---|---|---|---|---|
| 1 | Session stopped early because of pain, injury, dizziness, or illness | **Deload** | Include actual load in recent accumulation, but exclude from `eligible_session` set | Directly aligned with symptom-gated load management and the need to pair load with health surveillance. citeturn34view1 citeturn39search11 citeturn38view1 |
| 2 | Pain flagged and it is more than mild, worsening, or still present the next day | **Deload** | If pain severity is unavailable and pain is only binary, bias to **Hold** at minimum and **Deload** if recurrent or movement-limiting | Pain-monitoring literature allows some training into moderate discomfort in rehab, but progression is individualized and symptom escalation is a clear stop/go divider; for an injury-sensitive consumer app this justifies conservative bias. citeturn34view1 |
| 3 | Mild/transient pain flag only, with no symptom-driven stop | **Hold** | Count actual load in `curr14`; do **not** let the session become an eligible baseline session | Conservative substitution from pain-monitoring literature; safe because binary pain in a consumer app is too crude to justify progression. citeturn34view1 |
| 4 | Missing sRPE or missing minutes | **Hold** | Exclude from rolling load and baseline; **do not impute** | Missing-data literature shows workload calculations are distorted by missingness and that imputation is a specialized research choice, not a safe app default. citeturn36search0 citeturn36search3 citeturn35search8 |
| 5 | Review missing but sRPE and minutes are present | **Hold** | Include actual load in `curr14`; exclude from `eligible_session` set for progression | Same rationale: the stress happened, but tolerance was not confirmed. citeturn36search0 citeturn36search3 |
| 6 | Fewer than 3 eligible sessions in the prior 42 days | **Hold** | Conservative mode. Never auto-progress from sparse history | Modern frameworks support individualized baselines and longitudinal context; with fewer than 3 good sessions you do not really have either. citeturn38view0 |
| 7 | `session_load > 1.10 × peak30` | **Deload** | Treat as a novel peak exposure; do not auto-progress from it even if the athlete "felt fine" | Strongest recent cohort signal: session-specific spikes above +10% of prior 30-day max increased injury rate, while ACWR and simple week-to-week ratio were not useful. Transfer here is conservative because the runner data are not skill-session data. citeturn33search8 |
| 8 | `session_load > 1.15 × baseline3` | **Deload** | Single-session overshoot beyond the normal progress band | Conservative transfer from "too much, too soon" literature; precise threshold is not directly validated in this population. citeturn27search25 citeturn38view0 |
| 9 | `curr14 > 1.20 × prev14`, but only when both windows contain at least 2 completed sessions | **Deload** | Use rolling 14-day windows instead of calendar weeks for sparse users | Weekly increases of 20-60% have prospective injury associations in runners; for 1-3 sessions/week, a 14-day rolling comparison is the more stable engineering implementation. citeturn27search25 citeturn38view0 |
| 10 | `1.05 × baseline3 < session_load ≤ 1.10 × baseline3`, no pain/data flags, and the last 2 eligible sessions were symptom-free | **Progress** | This is the default progress band | Best-supported conservative overload zone: small step-up, earned by recent tolerance. citeturn27search25 citeturn33search8 citeturn38view0 |
| 11 | `1.10 × baseline3 < session_load ≤ 1.15 × baseline3`, no flags, `session_load ≤ 1.10 × peak30`, **and** the prior eligible verdict was **Hold** rather than **Progress** | **Progress** | Conditional progress only. This creates a "step-up then repeat" shape instead of a staircase every session | Evidence is thin here; this is a conservative substitution supported by load/recovery logic and deload literature rather than direct cohort proof. citeturn25search3 citeturn38view0 |
| 12 | `0.90 × baseline3 ≤ session_load ≤ 1.05 × baseline3` | **Hold** | Baseline-consolidation zone | This maps to maintenance/stability rather than a need to push or pull back. citeturn38view0 |
| 13 | Two **Progress** verdicts already occurred in the last 3 eligible sessions | **Hold** | Force one consolidation session before another upward step | Conservative substitution to prevent monotonic staircases; compatible with deliberate unloading principles. citeturn25search3 citeturn38view0 |
| 14 | Three consecutive eligible sessions each `< 0.85 × baseline3`, or `curr14 < 0.80 × prev14` with no pain/gap flags | **Progress** | Under-stimulation / drift-down rule | Published literature supports distinguishing adaptation from maintenance and maladaptation, but this exact under-stim band is an engineering default, not a validated universal threshold. citeturn38view0 |
| 15 | `session_load > 130 AU` in this product | **Hold** by default; **Deload** if any other red flag is also present | Never auto-progress from a high absolute load in a short-skill app | Conservative product guardrail derived from the app's own 10-20 minute design envelope, not from a universal sport-science cutoff. |

### Weekly-equivalent change bands

The weekly-equivalent change bands that fall out of those rules are straightforward. For this population, **0% to +10%** is the clearest conservative progress zone; **+10% to +15%** is acceptable only after clean recent tolerance and not on back-to-back progressions; **+15% to +20%** is a **hold/not-progress** zone; and **>+20%** is a **deload/step-back** zone. The literature is much stronger for "avoid large spikes" than for "this exact increase is optimal," so the engine should be humble about that distinction. citeturn27search25 citeturn33search8 citeturn38view0

### Worked example

For the user example, a **15-minute passing session at RPE 5-6** equals **75-90 AU**. In this engine that usually sits in the **hold / small-progress band**, not because 75-90 AU is universally special, but because it is a **moderate skill-session load** inside the product's normal operating range. The engine should only call **Progress** if that 75-90 AU is a **small, tolerated rise** above the athlete's own recent baseline. It should not call **Progress** merely because the number looks "hard enough" in isolation.

## Minimum-history and sparse-data policy

The literature supports baselines and longitudinal interpretation, but it does **not** give a clean, published answer for "how many sessions before a consumer app can trust itself" in this exact population. So the policy below is partly evidence-based and partly a clearly marked conservative substitution. The core logic is simple: with 1-3 sessions per week, **calendar history is as important as session count**. citeturn38view0 citeturn33search8

| Phase | Criterion | Allowed verdict behavior | Rationale |
|---|---|---|---|
| Conservative bootstrap | 0-2 eligible sessions, or less than 14 days of coverage | **Hold** or **Deload** only; never auto-Progress | You do not have a stable individualized baseline yet. citeturn38view0 |
| Emerging baseline | 3-4 eligible sessions over at least 14 days | **Progress** allowed only in the +5% to +10% band and only with two clean prior eligible sessions | Small-sample baseline is now usable, but still fragile. This is a conservative substitution. citeturn38view0 citeturn33search8 |
| Trusted baseline | At least 5 eligible sessions and at least 28 days of coverage | Full rule table active | This is the first point where median baseline, recent peak, and short-term trend all become interpretable together. Conservative substitution, but aligned with longitudinal-baseline logic. citeturn38view0 |
| Re-entry after short gap | More than 14 but fewer than 28 days since last eligible session | Drop back one phase for the next 2 eligible sessions | Longitudinal signal has weakened; recent tolerance is less certain. Conservative substitution. citeturn38view0 citeturn33search8 |
| Re-entry after long gap | 28 days or more since last eligible session | Treat as a new user until 3 fresh eligible sessions are logged | The prior 30-day peak reference is no longer meaningful and the adaptation context has broken. Conservative substitution. citeturn33search8 citeturn38view0 |

One-sentence rule for engineering: **the engine should not trust its own progression signal until it has at least 3 eligible sessions spanning at least 14 days, and it should not fully trust it until 5 eligible sessions spanning at least 28 days.**

## Special cases and override rules

Pain-flagged sessions should **not** be handled the same way as clean sessions. The best reading of the adaptation and pain-monitoring literature is not "all pain means stop," but it is also definitely not "pain is fine, keep progressing." In rehab settings, athletes often continue loading into **moderate discomfort**, but progression is symptom-guided and carefully individualized, and the evidence is strongest for pain/function outcomes rather than performance or reinjury outcomes. In a consumer app serving amateurs, the safer translation is: **mild transient pain = Hold; moderate, worsening, recurrent, or next-day pain = Deload; no pain session should ever be upgraded to Progress just because it was completed**. citeturn34view1

Incomplete sessions should be split by cause. If the athlete stopped because of **symptoms**, that is a **Deload** and the session should be excluded from the eligible baseline, though its actual completed load should still count in recent accumulated exposure. If the session was incomplete for **logistical reasons** rather than symptoms, the safest verdict is **Hold**: include the actual load in `curr14`, but do not let the session certify new tolerance. That approach matches the logic of individualized monitoring: exposure happened, but tolerance was not fully demonstrated. citeturn38view0 citeturn38view1

Missing review data should **bias against progression**. Missing-data research in load monitoring shows that missingness distorts accumulated workload estimates and that when imputation is done, it is done with statistical machinery in dense research or team datasets. A low-frequency consumer app does not have that support structure. So the defensible rule is: **do not impute subjective review data for progression decisions**. If load can still be computed, count it as exposure but not as proof of tolerance; if load cannot be computed, exclude it and return **Hold** because the engine lacks enough information. citeturn36search0 citeturn36search3 citeturn35search8

If the app ever expands beyond skill-dominant practice, it should use a **different mode or a required session-type tag**. The current rules are intentionally conservative because sRPE-only load is ambiguous across technical, tactical, and conditioning sessions. A conditioning session at the same sRPE-load should almost certainly be governed by a different progression ceiling, because recent ball-sport and racquet-sport evidence shows that global RPE can stay flat while objective movement demands change materially across strategies and drills. citeturn20view0 citeturn20view1 citeturn22view0

## Where the evidence is thin and expert review should override

The biggest uncertainty is not ACWR anymore. It is **generalizability**. The literature is still dominated by elite or organized-sport cohorts, and even the stronger "too much, too soon" papers are mostly from **running** or high-performance team sports. There is very little direct evidence for **amateur, self-coached, 10-20 minute, skill-dominant practice**. That is why the thresholds above should be described internally as **conservative operating defaults**, not as validated injury-risk probabilities. citeturn7view0 citeturn27search7 citeturn38view0

Human review should override the engine when any of the following are true: the athlete has **recurrent pain**, there was a **recent injury or layoff**, the athlete changed from **skill practice to conditioning-heavy sessions**, the app sees repeated **Deload** verdicts without obvious improvement, or a supposedly routine session suddenly lands in the product's **high absolute band**. Those are exactly the contexts where the post-ACWR literature says simplistic metrics are least trustworthy and context matters most. citeturn25search7 citeturn38view0 citeturn38view1

## Shortest implementation summary

**Use sRPE-load, but interpret it through three gates: symptoms, athlete-specific baseline, and novelty. Default to Hold. Progress only in small steps after clean history. Deload when symptoms appear, when the session is a true novelty spike, or when recent load has risen faster than the athlete's sparse history can justify.** citeturn38view0 citeturn33search8 citeturn27search25

## Apply To Current Setup

- `docs/specs/m001-adaptation-rules.md` — replace the placeholder "~20-30%" weekly cap with the precedence-ordered bands, the `baseline3` + `peak30` + `curr14/prev14` derived variables, and the minimum-history phases table. Remove the sRPE-load line from "What still needs validation" and replace it with a field-validation item scoped to the derived bands.
- `docs/decisions.md` — add a decision that freezes `baseline3` + `peak30` + rolling-14d as the planning defaults sharpening `D84`, and move "exact sRPE-load change caps for amateur beach sessions" from pending to field-validation-only.
- `docs/research/README.md` and `docs/catalog.json` — register this note in the research index and catalog.
- Avoid-phrase list (`docs/research/regulatory-boundary-pain-gated-training-apps.md`) still applies to any copy derived from this note: the engine reasons in internal load terms, but surfaces to the user must not use "injury risk," "danger zone," "clinically proven," or return-to-play language.

## Freeze Now

- `session_load = sRPE × minutes` as the internal-load primitive (already frozen in `D84`).
- Deterministic engine shape: symptom gate, baseline gate, novelty gate. No AI in the verdict path (`D6`, `D11`, `D21`).
- **Hold** is the neutral default; **Progress** must be earned; **Deload** overrides both.
- No ACWR ratio, no "risk zone," no injury-probability output to the user (`D86`).

## Validate Later

- Exact progression band widths (+5-10% vs +10-15%) against real tester cohorts.
- Whether `peak30 × 1.10` or a slightly different multiplier is the right single-session spike cutoff for skill sessions specifically; the runner cohort is the closest available evidence, not a perfect transfer.
- Whether `curr14 / prev14` rolling-2-week comparison is more stable in practice than an ISO-week comparison for 1-3 sessions/week users.
- Whether a binary pain flag is sufficient on its own or whether an optional three-level severity (mild / moderate / movement-limiting) reduces the false-Deload rate without compromising safety.
- Whether the absolute "high" band (>130 AU in-envelope) is experienced as conservative or annoying by testers.

## Open Questions

- Engineering encoding: does the precedence-ordered rule table belong entirely in `docs/specs/m001-adaptation-rules.md`, or should the numeric constants be hoisted into a single declarative config for the future engine module (`app/src/domain/adaptation.ts`)? Lean is toward a thin spec-owned config when the engine is first built; until then the spec is canon and prose is enough.
- Session-type tagging: should sessions carry a required `session_kind` tag (skill / conditioning / mixed) before expanding rule modes, to avoid silently applying skill-session caps to conditioning work? Currently out of M001 scope but worth pre-seating in the schema.

## Cross-References

- `docs/specs/m001-adaptation-rules.md` — implementation-ready spec; this note is the evidence base it cites.
- `docs/decisions.md` — D11, D18, D21, D84, D86, D87, D104 (binary-score gate interacts with the same "earned progression" posture).
- `docs/research/regulatory-boundary-pain-gated-training-apps.md` — avoid-phrase list and `D86` posture that any user-facing surface derived from this engine must respect.
- `docs/research/binary-scoring-progression.md` — complementary gate: binary pass-rate and minimum-attempt windows sit in front of this sRPE-load engine, not behind it.
- `docs/research/warmup-cooldown-minimum-protocols.md` — warm-up/cool-down time is part of `session_minutes` and therefore part of `session_load`; the absolute-envelope band assumes the mandatory blocks are included.
