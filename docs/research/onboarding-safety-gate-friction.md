---
id: onboarding-safety-gate-friction
title: Onboarding Friction In Safety-Gated Fitness Apps
status: active
stage: validation
type: research
authority: "evidence base for safety-gate placement, first-run screen count, and progressive profiling in M001"
summary: "What public data says about whether a dedicated pre-session safety screen hurts activation, and what to test instead."
last_updated: 2026-05-02
depends_on:
  - docs/research/beach-training-resources.md
  - docs/specs/m001-courtside-run-flow.md
  - docs/specs/m001-adaptation-rules.md
  - docs/decisions.md
related:
  - docs/research/README.md
  - docs/prd-foundation.md
  - docs/roadmap.md
  - research-output/onboarding-safety-gate-friction.md
---

# Onboarding Friction In Safety-Gated Fitness Apps

## Agent Quick Scan

- Use this note when deciding how to place the pre-session safety check (`D83`) relative to today's setup, or when designing A/B variants for first-run drop-off (`O11`).
- This note informs `O11` (screen count) and `O16` (standalone vs folded safety gate). It does not override `D82`, `D83`, or `D86`.
- Not this note for the medical/regulatory stance (use `docs/specs/m001-adaptation-rules.md` "Safety contract" and `D86`), for the load primitive (`D84`), or for the run-mode UI contract (use `docs/specs/m001-courtside-run-flow.md`).
- The evidence strengthens `D43`, `D44`, `D45`, `D82`, `D83`, and `D92`; it does not overturn any decision. Fitbod (plan-settings injury flow) and Runna ("Not Feeling 100%") are the two closest-category live-app analogues for the progressive-safety pattern.

## Bottom line

The public evidence does **not** support a simple rule like "every extra onboarding screen costs 8–12%." In this vertical, the strongest published signals cut both ways: long onboarding can **increase** trial starts when the extra steps clearly build trust, personalization, or perceived efficacy, but question-heavy flows also create measurable drop-off when users do not see immediate value. Publicly inspectable flows also show enormous variance — Peloton ~26 screens, Oura ~25, Apple Health ~15, adidas Running ~33, Nike Training Club ~29, the coach-led strength app Ladder a 3-step video sequence, Me+ ~45–50 screens / 7–10 minutes, Noom up to ~113 screens / 10–15 minutes — which is hard to reconcile with any universal per-screen tax. The defensible conclusion is narrower: in health, fitness, and meditation, **extra screens help only when they visibly improve the first-session promise**; otherwise they are pure tax.

For the M001 safety check specifically, the evidence points toward a **compressed first-pass safety gate, folded into the first decision point or immediately adjacent to it**, rather than a standalone "medical wall" screen that delays session value. If the safety check is a short red-flag filter, it should behave like **adaptive branching**: most users clear it in seconds, while the minority with pain, pregnancy-equivalent red flags, injury history, or contraindications see deeper follow-up. That is the pattern most aligned with what public data says about activation, retention, and screening burden. Live-app analogues in this vertical already ship exactly that shape: Fitbod keeps Injuries / Limitations inside plan settings and only deepens the question on a declared problem, and Runna's "Not Feeling 100%" flow lets users scale back 3–14 days with graded return-to-load and explicit clinician-escalation thresholds.

Our stack is already on the highest-probability branch of the public decision matrix: `D45` rules out account creation before first-session value, and `D83` specifies a short 2–3 tap check. The remaining open design choice is **standalone vs folded vs minimum-gate placement** for those 2–3 taps, which is exactly what `O11` / `O16` are for.

Confidence: **medium-high** on the directional conclusion; **low-to-medium** on any specific conversion delta for beach volleyball. No public A/B specifically tests "standalone safety screen vs folded red-flag questions" in a consumer fitness app, so the strongest recommendation is to run that variant ourselves inside the `D91` cohort.

## Use This Note When

- deciding whether to keep the standalone `SafetyCheckScreen.tsx` in v0b or fold its red-flag questions into `SetupScreen.tsx`
- writing A/B variants for `O11` and `O16`
- choosing copy for the pain flag, training-recency, and heat CTA (question-first vs answer-first)
- defending the first-run budget against future "let's add one more profile question" asks
- reviewing whether progressive profiling is being implemented correctly (inline explanation, immediate consequence, context-driven follow-up)

## Not For

- the regulatory stance on medical advice vs general training support (use `D86` and `docs/specs/m001-adaptation-rules.md` "Regulatory positioning")
- the load primitive, adaptation rules, or deload thresholds (use `docs/specs/m001-adaptation-rules.md`)
- outdoor readability / touch target defaults (use `docs/research/outdoor-courtside-ui-brief.md`)
- solo environment defaults (use `docs/research/solo-training-environments.md`)
- pre-session context capture shape beyond the safety gate (use `D92` and `docs/specs/m001-courtside-run-flow.md` "Session Prep")

## Public app evidence on screen count

The cleanest public number is a **Headspace** onboarding redesign case study. The older flow showed **38% drop-off from onboarding start to finish**. The redesign removed or delayed several heavy elements (scientific explainer content, the first mandatory meditation) and produced a **~10% relative increase in week-two engagement** plus higher 90-day conversion. Directly relevant to us: deferring nonessential education to post-activation moments improved early retention.

Counter-evidence comes from a **RevenueCat** write-up of **Lose It!**, which explicitly tested *longer* onboarding and saw **double-digit increases in trial start rate** as onboarding grew — until diminishing returns set in. The wrinkle is that added questions worked because they strengthened the *promise of personalization* and premium value, not because more screens are inherently good. The same RevenueCat piece describes a UK top-grossing health-and-fitness app (**Me+**) using roughly **45–50 screens** and taking **7–10 minutes** before first use, which shows how far successful apps in the category are willing to push length when length clearly buys perceived fit or authority. **Noom** has been teardown-reported at **up to ~113 screens** over **10–15 minutes**, at the far end of the same pattern.

Public growth material from **Zumba** adds a complementary constraint. In its original flow, only **40%** of users who completed onboarding ever saw a paywall, because the paywall lived after the first class. Bringing the paywall forward and later shifting from "question-first" to "answer-first" web onboarding improved acquisition economics enough to push blended web CPA below app CPA. Not a pure screen-count experiment, but strong evidence that **what comes before value matters more than raw screen count**, and that front-loaded questioning needs to produce persuasive answers, not just capture data.

A separate **implemented mobile-app onboarding redesign case study** reports a **25% drop** from welcome screen to the last question, and **37% total drop** once an additional "insights" sequence was included; the redesign later lifted short-term activation ~65%, yet four-week retention still decayed to ~7%. That is the clearest single-study reminder that **extra onboarding pages can buy activation when they sharpen value, but they rarely create retention by themselves**.

Category benchmarks from **Airship** reinforce the harsh retention floor: Health & Fitness apps average **12% Day-14 retention** (i.e., ~88% gone by day 14), and users spend only **~2.5 minutes per day** in the category. Airship's activation work also shows that top-10 apps in a category have **~56% higher Day-30 activation** than category averages, with a heuristic to ask only for information that is needed in the first 14 days. **Amplitude** adds that reaching **7% Day-7 retention** puts a product in the top activation quartile, and that **69% of top D7 performers are also top three-month performers** — i.e., early activation linkage exists, but it must be *earned* at D7 before it compounds. **RevenueCat**'s broader editorial stance is complementary: signups, session length, and onboarding completion are vanity metrics unless they map to core-value actions and sustained usage.

Taken together, the honest summary for M001 is: **a dedicated third screen must earn its keep very quickly**, and the threshold for "keeps its keep" is that the screen visibly improves the first session the user is about to run.

### Category screen-count teardowns (variance, not a rule)

The fitness/health/wellness app set shows enormous variance in onboarding length, which is the clearest single reason to reject any universal per-screen tax:

| App | Observed onboarding length | Shape |
| --- | --- | --- |
| Apple Health | ~15 screens | permissions-led, lightweight |
| Oura | ~25 screens | hardware-paired, baselining |
| Peloton | ~26 screens | broad catalog setup |
| Nike Training Club | ~29 screens | preference + goal quiz |
| adidas Running | ~33 screens | goal + metrics |
| Me+ | ~45–50 screens / 7–10 min | long quiz funnel, paid plan sell |
| Noom | up to ~113 screens / 10–15 min | quiz-to-plan-preview to paywall |
| Ladder (coach-led strength) | ~3-step video sequence | fast-to-first-session |

The short-flow coach-led model optimizes for time-to-first-session; the long-quiz model optimizes for personalized-plan sell and perceived expertise before a trial or paywall. Neither correlates with a simple screen-count penalty. What the apps that succeed at length appear to share is **visible plan construction, explanatory framing for each question, and a payoff that materializes before any hard ask**.

## Public evidence on front-loading safety gates

Direct published A/B data on "deferring versus front-loading pain, pregnancy, injury, or PAR-Q-style screening inside consumer fitness apps" is extremely thin. No credible public experiment of the form "medical questions on screen one vs after first workout" from a named mainstream consumer app surfaced. What *does* exist is a combination of screening-tool evidence and digital-health onboarding evidence, both pointing the same way:

- **PAR-Q+ / ePARmed-X+**: the evolution from older exercise-clearance models to the current risk-stratification approach reportedly reduces physician referrals to roughly **1%** of participants, versus roughly **15%** under the original PAR-Q. The system was explicitly redesigned so that only a small minority hit the higher-friction path. The winning pattern in exercise screening is **short front door + adaptive follow-up**, not "ask everyone everything up front."
- **CSEP Get Active Questionnaire (general)**: a **4-question self-screen** designed to *screen in* the majority of users, reduce perceived barriers, and refer only those triggering a "yes" response. CSEP explicitly frames the tool as empowering users and lowering barriers — not as a medical form.
- **CSEP Get Active Questionnaire for Pregnancy (GAQ-P)**: same shape — **4 questions**, self-administered, with escalation to a health professional only on a "yes." Created because blanket medical clearance had become a key barrier to participation.
- **PLOS One online vs face-to-face APSS comparison**: the seven compulsory Stage-1 questions of the Adult Pre-Exercise Screening System showed **>94% agreement** between online and face-to-face administration. Agreement fell for deeper risk-factor reporting, which is exactly why the branching model works: **brief red flags up front are reliable; long self-reported medical profiling is where signal quality degrades**. This is the clearest public justification that a short digital gate is *not* signal-poor relative to an in-person intake.
- **JMIR chronic-pain onboarding study**: simple email onboarding produced **63% adoption**, video onboarding **~77%**, assisted onboarding **100%**. But week-4 survival was **44% / 53% / 40%** across those same conditions — i.e., reducing startup friction lifted initial adoption without meaningfully rescuing four-week retention. Implication: if we must ask risk questions, the question is less "front-load or defer?" and more "how guided, concise, and obviously useful is the path — and what keeps delivering value after the first safe session?"

## Live-app progressive-safety analogues

The closest public analogues to what we are building — not meditation apps, not calorie quizzes, but training products that actually have to react to user pain and load — have converged on **progressive safety profiling inside the plan**, not a pre-session medical wall:

- **Fitbod** does not force a full injury intake at the front door. Injuries / Limitations live in **plan settings** (not onboarding). The app asks deeper follow-up only *after* the user declares a problem, then updates future workouts by excluding aggravating movements and recommending safer alternatives. That is the textbook shape for a training app: short entry, in-plan depth, continuous adaptation.
- **Runna** added a **"Not Feeling 100%"** feature that lets users scale back training for **3–14 days**, choose how aggressively to return, backdate the adjustment by up to a week, and escalate to a proper break plus clinician advice for symptoms lasting beyond two weeks or for more serious concerns. Public reporting tied this to criticism that earlier plans had pushed users into overuse injuries; the company publicly bound new beginner plans and safer workload adjustments to this model of **progressive adaptation** rather than relying on one-time onboarding answers.

Both examples are important for M001 because they show that, in our vertical, mature products have already chosen to treat safety as a **state the app keeps watching**, not as a one-time form. They also map cleanly onto our existing decisions: `D83` is the short entry gate, `D87` is the conservative default when preparedness is unknown, and `D11`/`D18` are the deterministic adaptation surface that a "Not Feeling 100%"-style control would sit on top of.

## Public evidence on progressive profiling

The strongest public evidence favors **progressive profiling**, with an important caveat: the first wave can still be long if each question visibly earns its keep. The category rewards **perceived personalization**, not indiscriminate interrogation.

- **Headspace redesign** specifically removed scientific facts from onboarding and moved education later; it also removed the mandatory first meditation because getting users "through the onboarding door" mattered more than proving efficacy inline.
- **Headspace × Phiture** lifecycle work later increased **new-user activation by 26%**, **week-one retention by 109%**, and **same-day paid conversions by 49%** through targeted in-app messaging, deep linking, and follow-up prompts. The pattern is "collect the minimum needed to personalize now, then deepen the profile through contextual follow-up," not "collect less forever."
- A scoping review of remote digital-health studies reported a **48% median completion rate** across studies; main participation levers were **motivation, task complexity, and scientific requirements**. Complexity reduction via passive capture or technical support improved completion. Baseline questionnaires and device handling were counted as task complexity, not neutral overhead.
- A 2023 scoping review of mHealth barriers identified **use/adherence** and **usability** as the dominant friction categories, with **data privacy/security** recurring. Folded with the chronic-pain onboarding numbers above, that explains why standalone medical-style screens stacked on top of account creation compound poorly: the privacy cost, the effort cost, and the delayed-value cost all hit before the user sees a plan.
- A **3,034-user fitness-app survival analysis** reported that dropout hazard **rose until roughly 1.3 to 2 weeks** before easing. That is the same window `D91` depends on, which means the first-weeks behavioral data a progressive-profiling loop would capture is exactly when churn decisions are being made — an argument to treat post-first-session safety capture as retention work, not as delayed admin.

The Airship **12% Day-14** floor plus the Amplitude **7% D7 top-quartile / 69% overlap** finding is what makes this matter for us: if a profile question does not improve workout safety, content fit, or first-session confidence, it is competing against a very short retention window and a tight top-quartile activation bar.

## Patterns that have tested well for safety-gated flows

The public record supports a short list of patterns that consistently outperform a separate, mandatory "medical questionnaire" wall:

- **Two-stage gate:** first-stage red flags for everyone, deeper branching only for "yes" users. PAR-Q+ and the CSEP GAQ / GAQ-P are both built this way; the PLOS One APSS comparison shows the Stage-1 version preserves >94% agreement with in-person administration.
- **Explain the why inline and show the consequence immediately.** Long onboarding works when users understand why a question exists and see the output right away, e.g., tailored routines, proof screens, or projections.
- **"Answer first" over "question first".** Zumba's move away from question-first web onboarding is especially relevant for safety questions: "We'll avoid impact today because you reported knee pain" is better than a standalone pain checkbox with no visible payoff.
- **Keep the first-session ask to the minimum needed for safe personalization.** Airship's activation guidance is to collect only what is needed in the first 14 days; Headspace's redesign improved outcomes by pushing nonessential science and education later.
- **Treat safety as a state, not a one-time form.** Fitbod keeps injury handling in plan settings; Runna's "Not Feeling 100%" adapts load over 3–14 days with graded return and explicit escalation thresholds. The fitness-app survival evidence says the 1.3–2 week window is where to keep collecting, not where to stop.
- **Use follow-up nudges to complete the richer profile later.** Post-onboarding lifecycle work can materially improve activation and week-one retention, which is exactly the right home for any richer medical / profile payload that is important but not activation-critical.

## Decision matrix: account wall × screen count × safety placement

The research synthesizes into a four-configuration matrix across three variables that matter more than raw screen count: whether there is an account wall before first value, how many onboarding steps there are, and whether safety is folded / branched / isolated.

| Configuration | Expected activation | Expected D7 / D14 effect | Safety-signal quality | Practical verdict |
| --- | --- | --- | --- | --- |
| **No account + 2 screens + embedded red-flag micro-gate** (branches only on "yes") | Highest | Best default for broad consumer training; time-to-first-workout stays short | Good if the gate is 1–4 high-signal questions with branching | **Best default** for most safety-gated training apps. |
| **No account + 3 screens + isolated safety screen for everyone** | Medium | Holds D7 only if the screen clearly changes the starter plan; otherwise pure tax | Higher than folded placement *only if* it branches intelligently | Only worth it if the third screen visibly improves the first safe session. |
| **Account required + 2 screens + full safety folded into the first screen** | Medium-to-low | Often weak for D7 / D14; privacy + effort both paid before value | Mixed: dense first screens hurt completion and can degrade answer quality | Usually the worst tradeoff. |
| **Account required + 3+ screens + branched safety + plan preview + delayed hard ask** | Medium | Can outperform shorter flows when each step builds commitment and shows plan quality | High, if red flags are brief up front and deeper detail is conditional | Best option when you *must* ask more or sell a premium personalized plan — long funnels like Me+ / Noom work here. |

**Where M001 already sits:** `D45` (no account before first starter session), `D83` (short 2–3 tap check), `D92` (single structured pre-session context step) place us on **row 1 or row 2** of the matrix — i.e., already on the highest-probability branch. The only remaining design choice is whether those 2–3 safety taps live as a standalone `SafetyCheck` screen (row 2), as embedded red-flag chips inside `Setup` that branch only on positives (row 1), or as a minimum pre-`Run` gate with the richer profile deferred to after the first session (a progressive-profiling variant of row 1). That is the full decision surface for `O11` / `O16`.

## Apply to current setup

Audited against the repo as of 2026-04-16. Nothing in the research overturns an existing decision. Several decisions are directly strengthened, and two open questions (`O11`, new `O16`) sharpen with testable variants.

### What the evidence confirms (no change needed)

- `D43` (first-run prioritizes immediate session value over full intake) — confirmed by Headspace, Zumba, Airship, Amplitude top-quartile activation linkage.
- `D44` (mandatory first-run inputs limited to skill level + today's player count) — confirmed; matches the "screen in the majority quickly" pattern.
- `D45` (no account creation before first starter session) — strengthened; the chronic-pain mHealth study is the cleanest published evidence that unassisted account creation is itself a meaningful adoption barrier. Our stack sits on the "best default" branch of the public decision matrix because of this decision.
- `D46` (10-15 min starter session, not a full practice build) — confirmed; Headspace evidence and the mobile-app redesign case study both show a shorter, more believable first promise beats a longer one for retention, even when a longer one lifts short-term activation.
- `D82` (safety enforced by workflow structure, not copy-only disclaimers) — confirmed; the structured fast-tap pattern is the one with evidence behind it.
- `D83` (short 2-3 tap safety check: pain flag, training recency, heat CTA) — strengthened; PAR-Q+, CSEP GAQ (4-question general), GAQ-P, and the PLOS One Stage-1 APSS study all use / validate this exact shape and show >94% online vs face-to-face agreement on compulsory Stage-1 items.
- `D87` (conservative defaults when preparedness is unknown) — consistent with the "screen in the majority, escalate minority" pattern.
- `D92` (pre-session context capture is a single structured step with last-session defaults) — confirmed.

### What the evidence challenges (test, do not flip)

The current v0b flow is `Home / Setup → Tune today → Safety → Run`, with `SafetyCheckScreen.tsx` still as a standalone readiness screen. The research argues this remains the weaker evidence-backed default *when the safety check is genuinely short* — the default case for us, since the check is a binary pain flag plus a recency chip row plus an optional heat CTA. The public record points toward folding short red-flag questions into the adjacent decision point and using adaptive branching only for "yes" answers. Fitbod and Runna are the two closest-category live-app analogues and both put safety inside plan adaptation rather than at the front door.

The research does not prove our standalone screen is worse — no named consumer fitness app has published the exact A/B. It does, however, give us strong evidence-based reasons to run that test inside the `D91` cohort.

See `O11` (screen count and copy) and `O16` (standalone vs folded safety gate).

### Code surfaces that would need follow-up if v0b tests the folded variant

These are listed for discoverability; they should not be changed until the variant decision is made.

- `app/src/screens/SetupScreen.tsx`: would gain a compact safety row (pain flag + recency chips) and an inline heat link, sized to keep the screen under one scroll on a 390px viewport.
- `app/src/screens/SafetyCheckScreen.tsx`: would become a branch destination reached only when `painFlag === true`, training recency is `0 days`, or another red flag fires. The PainOverrideCard already handles the "yes" branch well and can be reused.
- `app/src/routes.ts`: `routes.safetyFromDraft()` usage would become conditional. Navigation from Setup would go directly to `createSessionFromDraft` and `routes.run(execId)` on the clean path, and to `routes.safetyFromDraft()` only on a "yes" answer.
- `app/src/services/session.ts::createSessionFromDraft`: already accepts `painFlag`, `trainingRecency`, `heatCta`, `painOverridden` — the contract is compatible with a folded flow.
- `app/e2e/accessibility.spec.ts` and any future e2e coverage: safety-step assertions would need a "standalone vs folded" fork.

## Freeze now

Encoded so downstream docs and code can stop reasoning from first principles about the evidence:

- The M001 safety contract (`D82`, `D83`, `D86`, `D88`) is **not** weakened by this research. A short, workflow-structural safety gate is required; the only open question is placement and framing.
- For v0a field testing (`D91` cohort), the default remains the standalone `SafetyCheckScreen` as documented in `docs/specs/m001-courtside-run-flow.md` §2.5. Do not swap the default before tester evidence lands.
- Any A/B variants of the safety gate must preserve the current hard requirements: binary pain flag, training-recency capture (or auto-derivation), heat CTA on hot days, stop/seek-help reachable from any screen.
- Safety copy must read as "what this means for today's session," not as a medical questionnaire. "We'll avoid impact today because you reported knee pain" beats "pain (yes/no)". This is the answer-first pattern applied to safety.

## Validate later

Cohort constraint: the `D91` cohort is 5 testers. That is too small to split three ways concurrently; an N≈1–2 per arm gives noise, not signal. The variants must be run **sequentially** against separate cohorts, with a clear primary hypothesis each time.

- **Variant A (control, ships in v0b):** standalone `SafetyCheckScreen` between `Setup` and `Run` — today's v0a behavior. This is the `D91` baseline. Do not change it before tester evidence lands.
- **Variant B (folded, Phase 0 follow-on only if needed):** pain flag + recency chips appended to `SetupScreen`, with branching to the richer safety flow only when a red flag fires. Heat CTA becomes a link, not a dedicated section. Run **only if** Variant A evidence shows the standalone safety step is a real activation cost (per-step drop-off concentrated at `/safety`, qualitative reads of "medical" or "in the way"). `V0B-17` (variant-ready routing, architectural only) keeps this switch cheap if it is needed.
- **Variant C (minimum gate + progressive, Phase 1 / Phase 1.5):** only the pain flag and an auto-derived or single-tap recency gate before `Run`; all richer safety/profile capture (ankle history, prior injury, heat awareness detail) captured post-first-session via a one-screen profile prompt at the next Home visit. Needs larger population and adds a post-session profile surface that v0b does not ship. Do not attempt this in the `D91` cohort.

For the Variant A baseline read (and any follow-on), capture:

- time from Home/`Start session` tap to first warm-up block start
- drop-off at Setup, at Safety (if present), and at the first warm-up block
- whether users who hit the pain "yes" branch actually complete the recovery session or bail
- qualitative read: do testers describe the safety step as "useful," "tolerable," "medical," or "in the way"?
- whether recency = `0 days` or `First time` users accept the scaled-down default session or override it

Compare against the baseline `D91` quantitative bar. Do not redefine success around "safety questions feel nicer"; the retention and activation bars are unchanged.

Also validate inline (these do not require a separate cohort):

- **Answer-first copy** for the pain flag's "yes" branch (today we show `PainOverrideCard` after the Yes tap — that is already answer-first in shape; validate that the copy reads as consequence-first, not question-first). `V0B-16` ships the answer-first framing on the "No" path too.
- Whether the heat CTA placement (inline disclosure vs link vs post-first-warm-up nudge) changes whether users actually read it on hot days.

## Open questions specific to this note

- What exact percentage of field testers have a pain-flag "yes" answer on a first session? If the number is tiny (say, under 5%), the "standalone medical wall" cost is borne by the 95% who do not need it, which strengthens the folded variant. If the number is meaningful (say, 20%+), the standalone screen earns more of its keep because the branching is visibly justified.
- Does training-recency `0 days` or `First time` reliably correlate with worse first-session RPE or early-end rate? If so, the recency tap is doing real work for safety and belongs immediately before Run, not deferred.
- Should the heat CTA be contextual (temperature-based), self-declared, or always-on? The research supports contextual, but the app currently has no weather input in v0a.
- Is there a courtside moment — e.g., after warm-up, before the first main block — where a single "still feel OK to keep going?" tap would produce better signal than all three pre-session taps combined? Literature is silent; testable in v0b.

## Related decisions and questions

- `D43` — first-run activation prioritizes immediate session value; strengthened by Headspace and Airship evidence.
- `D44` — mandatory first-run inputs limited to skill level + today's player count; confirmed.
- `D45` — no account creation before first starter session; confirmed.
- `D46` — 10-15 minute starter session; confirmed.
- `D82` — safety enforced by workflow structure; confirmed.
- `D83` — pre-session check is short pain flag + recency + contextual heat CTA; strengthened.
- `D86` — general training support, not medical advice; unaffected.
- `D87` — conservative defaults when preparedness is unknown; consistent.
- `D92` — single structured pre-session context step; confirmed as the right shape for a folded variant.
- `O11` — first-run screen count and copy; sharpened with three concrete variants (A/B/C above).
- `O16` (new) — standalone vs folded safety-gate placement; added by this note.

## Change log

- 2026-04-16 — note created from desk research synthesis on Headspace, Lose It!, Me+, Zumba, Airship, PAR-Q+, CSEP GAQ-P, JMIR chronic-pain onboarding, and a digital-health scoping review. Strengthens `D43`, `D44`, `D82`, `D83`, `D92`; sharpens `O11`; seeds `O16`.
- 2026-04-16 — `Validate later` section tightened: the three variants must be sequential, not concurrent, given the 5-tester `D91` cohort. Variant A ships as the v0b baseline; Variant B is a follow-on only if needed (architecturally prepared via `V0B-17`); Variant C is Phase 1 / Phase 1.5. Answer-first copy on the "No" path is `V0B-16`, shipping in v0b without needing a cohort.
- 2026-04-16 — second desk-research pass integrated: added category screen-count teardowns (Peloton, Oura, Apple Health, adidas Running, NTC, Ladder, Noom, Me+); added PLOS One APSS online-vs-face-to-face >94% Stage-1 agreement and the 4-question CSEP GAQ (general); added live-app progressive-safety analogues (Fitbod plan-settings injury flow, Runna "Not Feeling 100%"); added Amplitude 7% D7 top-quartile / 69% overlap stat; added 3,034-user fitness-app survival hazard peaking at 1.3–2 weeks; added chronic-pain mHealth week-4 survival (44/53/40%); added implemented mobile-app onboarding case study (25/37% drop, 65% activation lift, 7% four-week retention); added RevenueCat vanity-metrics framing and 2023 mHealth barriers scoping review; added explicit account-wall × screen-count × safety-placement decision matrix with our stack mapped to it; strengthened `D45` citation. Raw provenance preserved at `research-output/onboarding-safety-gate-friction.md`.
