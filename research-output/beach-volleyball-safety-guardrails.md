# Minimum safety and load‑management guardrails for M001 in a self‑coached beach volleyball training app

Source: Desk research synthesis (2026-04-11)
Type: Raw research output — do not edit; curated findings go to docs/research/

## Executive summary

A credible "minimum safety layer" for M001 should do three things well: (a) prevent obviously unsafe sessions from being suggested or run, (b) reduce the chance of "too much, too soon" when the product has sparse inputs, and (c) stay on the right side of "general wellness / training support" rather than drifting into diagnosis or clinical decision support. The strongest desk‑research support for an M001 guardrail set comes from (1) volleyball‑specific injury patterns and prevention guidance (notably ankle sprains and overuse of shoulder/knee/low back) and (2) broader sport load consensus emphasizing avoiding rapid spikes and respecting recovery.

Beach volleyball has lower acute time‑loss injury rates than many sports, but meaningful disability still comes from overuse problems (low back, knee pain/tendinopathy, shoulder). That points to M001 guardrails that focus less on "rare catastrophic events" (still covered by "stop if" guidance) and more on (i) pain‑aware decision points, (ii) conservative progression/hold/deload based on a simple internal load signal (session RPE × duration), and (iii) mandatory warm‑up/cool‑down blocks that borrow from evidence‑supported volleyball warm‑ups.

Finally, the product's safety posture should be expressed explicitly and consistently so it does not imply medical intent. The most relevant regulatory "edge" to keep in view at planning stage is how "general wellness" positioning differs from Software as a Medical Device under regulators like the U.S. FDA and Health Canada.

## Key findings with confidence levels

### Beach volleyball safety risks are dominated by predictable injury buckets, not mysteries

**High confidence:** In a landmark prospective/retrospective study of world‑class beach volleyball, the most common overuse conditions were low back pain, knee pain, and shoulder problems; the paper also emphasizes that acute time‑loss injury rates are lower than many team sports but overuse represents a significant source of disability.

**Implication for M001:** Your default safety posture should primarily manage overuse risk (volume, recovery, pain) rather than only acute trauma.

### Ankle sprains and recurrence risk are "boring but important," and prevention has actionable components

**High confidence:** Volleyball injury prevention guidance from FIVB and the NATA position statement both emphasize (a) ankle sprains are common, (b) previous sprain is a consistent risk factor for reinjury, and (c) preventive measures like bracing/taping and sensorimotor/balance training are part of evidence‑supported prevention/management.

**Implication for M001:** A minimal onboarding question about prior ankle sprain (or "ankle issues in last 12 months") can justify conservative lateral movement and landing volume, plus optional "brace/tape if returning from a sprain" copy.

### "Avoid spikes" is strongly supported; specific spike math like ACWR is contested

**High confidence (principle):** A major IOC consensus statement stresses that excessive and rapid increases in load (week‑to‑week changes in intensity/duration/frequency) are associated with increased injury risk across many sports.

**Medium confidence (specific thresholds):** That same consensus popularized acute:chronic load ratio thresholds (e.g., "safer" ranges vs higher ratios), but later critiques argue ACWR can be statistically misleading and not causally established, and methodological variations can materially change findings.

**Implication for M001:** Implement "spike avoidance" via conservative heuristics (limits on week‑to‑week load jumps, rest after hard sessions), but do **not** ship ACWR‑driven injury‑risk claims or specific "you're in the danger zone" messaging in M001.

### Session‑RPE × duration is a strong "minimum viable load signal"

**High confidence:** A large review of the session‑RPE method concludes it is valid and reliable across many sports and that it deliberately combines intensity and duration to estimate internal training load; a separate validity study illustrates computing s‑RPE as duration × RPE and shows strong relationships with heart‑rate‑based load measures (in a different sport context, but the measurement logic is general).

**Implication for M001:** If you need one number to drive progress/hold/deload, sRPE‑load is defensible and low‑friction.

### One extra "readiness" signal is likely worth it, but don't pretend it's precise

**Medium confidence:** A systematic review of single‑item athlete self‑report wellbeing measures (fatigue, soreness, sleep quality, stress, mood) finds they're widely used, but relationships with training load range from none to very large and are often trivial‑to‑moderate in larger datasets; the review also emphasizes clinical utility is not settled and that these items often function as communication/status indicators rather than robust objective markers.

**Implication for M001:** Add one readiness question only if it is framed as "helps you decide" rather than "predicts injury." Pain/injury status is the highest‑value readiness item.

### You can operationalize soreness vs pain without medicalizing the app

**High confidence:** Physical therapy guidance distinguishes normal post‑exercise soreness (often peaking 24–72 hours and resolving in a few days) from injury‑suggestive pain that is localized, persistent, may be sharp with movement, and can change gait/movement; it explicitly advises not to push through pain. Separately, a classic DOMS review notes DOMS can change movement patterns and potentially increase injury risk if returning prematurely.

**Implication for M001:** A "pain that changes how you move = stop/modify" rule is evidence‑consistent and does not require diagnosis.

### Heat risk is real in beach contexts; minimal "stop/seek help" guidance is warranted

**High confidence:** Exertional heat illnesses remain a concern in sport; the NATA statement highlights exertional heat stroke as a leading cause of sudden death in sport and emphasizes preparedness and recognition, while Health Canada lists clear heat exhaustion and heat stroke symptoms and instructs immediate action and emergency response for heat stroke.

**Implication for M001:** Include explicit "stop if" heat symptoms in visible copy; don't attempt algorithmic medical triage.

### Warm‑up programs in volleyball can measurably reduce injury, but adherence and population mismatch are risks for inference

**Medium confidence:** The "VolleyVeilig" warm‑up program was associated with reduced acute and upper‑extremity injury rates and reduced injury burden/severity in youth volleyball; this supports warm‑up being "real safety behavior," not fluff. But it's youth/indoor‑dominant evidence, so translation to adult recreational beach is plausible but not proven.

**Implication for M001:** Make warm‑up mandatory in workflow, but keep it short and usable courtside; validate adherence with prototypes.

## What this means for the product's next-step decisions

### M001 needs an explicit "safety contract" that is enforced by workflow, not buried in terms

Desk research strongly suggests your biggest preventable harm modes are (1) users training through pain, (2) abrupt load spikes due to enthusiasm or miscalibration, and (3) heat‑related issues in an outdoor setting. In M001, those failure modes are best addressed by **structured, fast taps** that (a) gate the session, (b) shape the default session into a conservative plan, and (c) capture just enough feedback to adjust next time.

### The core design decision is whether safety is "advice" or "guardrails"

If safety is only copy, many users will ignore it. The volleyball and load literature is blunt: rapid changes in load and training through pain are problems; recovery matters. For M001, "guardrails" should mean:

- if pain/injury is flagged, the app **defaults** to a modified session (or a rest/recovery session) and requires an explicit user override to proceed with intensity
- if the last session was hard (high RPE or high sRPE‑load), the default next session is automatically easier unless the user actively chooses otherwise
- if a user has not trained recently, the default session is scaled down even if they "feel fine" (because preparedness is unknown)

### Avoid accidental "medical device intent"

At planning stage, it is already useful to state what the product will **not** do: it will not diagnose injury, treat conditions, or claim to reduce injury risk through personalized risk scoring. That matters because regulator guidance distinguishes low‑risk general wellness products from software intended for medical purposes.

### M001 must specify a minimum input schema that supports conservative load logic offline

The load‑management consensus emphasizes balancing load and recovery and avoiding rapid changes. To do that with sparse inputs, you need to decide which 2–4 taps are "mandatory truth" each session. A planning-stage, decision-quality stance is:

- **Hard requirement:** capture last session RPE and duration (or in‑session timer) to compute sRPE‑load.
- **Hard requirement:** capture "pain that changes how you move?" (yes/no) because the soreness‑vs‑pain distinction is safety critical and largely self‑observable.
- **Likely requirement:** capture time since last session (auto if the app is used every time; otherwise a single tap). This supports "return after layoff" conservatism, consistent with "too much too soon" injury mechanisms discussed in clinical guidance.
- **Optional:** one readiness item (energy/sleep) if friction is acceptable; evidence suggests it may be more valuable as a communication/status signal than a precise quantitative predictor.

## Recommended options and recommendation

### Option A: Minimal friction, maximal conservatism

Asks only (a) pain/injury flag, (b) intended session duration, (c) post-session RPE, and (d) one skill metric. Uses ultra-conservative defaults (shorter sessions, slower progress).

Upside: lowest UI friction in harsh courtside conditions.
Downside: without time‑since‑last‑session and a basic "recent training volume" proxy, the system can still accidentally recommend a "normal" session after a layoff, which violates the consensus principle about preparedness and rapid increases.

### Option B: One extra readiness/context signal (recommended)

Adds exactly one additional pre-session tap: either "trained in last 7 days? (0 / 1 / 2+)" or "How ready do you feel today? (low/ok/high)."

Upside: meaningfully improves the app's ability to be conservative after gaps and to recommend hold/deload. Aligned with consensus emphasis on recovery/balance and with evidence that brief self-report measures are widely used.
Downside: slightly higher friction; needs prototype testing in sun/sweat/sand.

### Option C: More complex monitoring (ACWR, monotony/strain, etc.)

Computes ACWR-like ratios or "risk zones," potentially with stronger messaging.

Upside: superficially "sports-science credible."
Downside: ACWR is debated; strong critiques argue the metric can be misleading and not causally established, and results vary by methodology. Shipping it early risks false authority.

**Recommendation:** Choose Option B.

## Minimum M001 safety guardrail set

- **Pre‑use gating (one-time + occasional re-check):** a lightweight PAR‑Q+–style screen. Any "yes" routes to "get clearance / consult a qualified professional before vigorous training."
- **Pre‑session safety check (fast):**
  - "Any pain that changes how you move?" (yes/no). If yes → default to recovery/technique-only session; require explicit override to do more.
  - "Training in last 7 days?" (0 / 1 / 2+) or "Days since last session?" If low preparedness → automatically scale down volume.
  - "Heat warning" CTA (not a quiz): a single tap that reveals heat exhaustion/stroke symptoms and "stop if…" guidance.
- **Mandatory session structure:** warm-up block + main work + cool-down block; user can shorten but cannot remove entirely (only "minimum version").
- **Load capture + adaptation primitive:** post-session RPE (0–10) + duration to compute sRPE‑load; next-session progress/hold/deload decisions use conservative caps on change and avoid back-to-back hard sessions.
- **Stop/seek help triggers (always accessible offline):** chest pain, extreme breathlessness, irregular heartbeat, dizziness/fainting, confusion, and heat stroke red flags; plus injury pain that persists or worsens.
- **Ankle history modifier (optional but high value):** if ankle sprain in last 12 months → recommend brace/tape consideration and bias sessions toward controlled movement and proprioception basics.

## What belongs in visible product copy

- "This is training guidance, not medical advice. You are responsible for your choices." Pattern is common in consumer fitness.
- "Stop if…" symptom list for serious cardio/respiratory symptoms and heat illness; "heat stroke is an emergency—call emergency services."
- Plain‑language soreness vs pain: "Soreness peaks 1–3 days and fades; pain that's sharp, local, or changes movement = modify/stop."
- Short rationale for conservatism: "Big jumps in training load increase injury risk; we ramp gradually."
- Warm-up positioning: "Warm-up and cool-down reduce fatigue-related risk and support recovery."

## What belongs in hidden logic

- Conservative scaling when preparedness is unknown (new user, long gap): default shorter duration, fewer high-intensity reps, more technique.
- sRPE‑load computation and conservative change caps; "no back-to-back hard sessions unless user explicitly overrides."
- Pain/injury flag overrides session generation (swap to low-impact technical work or rest recommendation).
- Heat "nag" frequency logic (show once per hot day/session) without attempting medical classification or diagnosis.
- Avoid ACWR-based "risk zone" outputs in M001; keep spike avoidance heuristic and describe it qualitatively.

## What still requires expert review

- Exact progression/deload thresholds for amateur beach serve‑receive sessions (how many reps/sets, what counts as "hard" on sand) and how that maps to RPE.
- Drill library safety (movement demands, dive progression, landing mechanics) for solo-first workflows.
- Final wording of disclaimers and risk‑related copy to stay within general‑wellness intent under regulators; confirm you are not accidentally making medical claims through UX behaviors or personalization language.

## What should be decided now vs deferred

### Decide now (changes product shape)

- Safety stance and boundaries: explicit "general training support, not medical advice" posture, plus rules on what the app will never claim (no diagnosis, no injury-risk scoring).
- Hard-stop surfaces: where "stop if…" appears (onboarding, pre-session, in-session, post-session), and what triggers an interrupt modal vs a passive note.
- Pain semantics: a simple, user-legible definition such as "pain that changes how you move" (vs normal soreness) and the resulting action (stop/modify).
- Load heuristic: sRPE × duration as the internal load primitive, and a conservative rule for week‑to‑week change and for post‑hard‑session recovery.
- Mandatory warm-up and cool-down blocks: timebox and content category (ankle/landing, shoulder activation, gradual intensity).

### Defer

- ACWR-based risk scoring or "danger zone" messaging (evidence contested; high overconfidence risk).
- Deep recovery analytics (HRV, wearable integrations) (more complexity, unclear added value for M001's first wedge).
- Return-to-play guidance for specific injuries (quickly becomes clinical/medical advice; should be clinician-led).
- Technique diagnostics (video/AI) and anything implying coaching authority in injury prevention without expert backing.

## What still needs primary validation, prototype testing, or expert review

### Primary validation and prototype testing

- **Courtside friction reality:** Can a user reliably answer 2–3 safety taps in bright sun with sand/sweat? Test with clickable prototypes in real conditions.
- **User interpretation of "pain vs soreness":** Prototype the exact phrasing and see if people correctly classify common scenarios (DOMS vs tendon pain vs acute sprain).
- **Tolerance for conservative defaults:** Some users will feel patronized; others will appreciate it. Validate whether "hold/deload" recommendations are followed and whether users override them.
- **Session content safety and realism for solo/pair drills:** The biggest hidden safety risk is drill selection that creates uncontrolled dives, awkward landings, or repetitive volume that isn't apparent from a text plan. This needs coach review and on-sand testing.

### Expert review before any public launch

- **Volleyball coach review:** drill biomechanics, appropriate progressions for beginner/intermediate serve‑receive, and whether "mandatory" warm-up elements are reasonable and not overly long.
- **Sports medicine / sports PT review:** your "stop/modify/seek help" rules, your pain definitions, and your approach to users with prior ankle sprains or persistent shoulder pain.
- **Sports scientist / S&C review:** your sRPE-based progression caps and deload triggers so they are conservative but not nonsensical.
- **Legal/compliance review:** your positioning and claims against general-wellness vs SaMD boundaries; your disclaimers and required warnings; and your storage/handling of health-adjacent user data.
- **Copy/legal pattern review:** sanity-check your disclaimer surfaces against common industry patterns (e.g., Peloton terms emphasize "not medical advice" and "consult a healthcare professional").

## Source list with notes

### Consensus and load management

- IOC consensus statement on load and injury risk: foundational articulation of "avoid rapid load changes," recovery balance, and why preparedness matters; also shows how ACWR entered practice.
- ACWR systematic review (PubMed): supports that some associations exist and ACWR may be used as part of multifaceted monitoring, but does not resolve methodological debates.
- ACWR critique (OPUS): concise statement that ACWR lacks causal evidence and can create statistical artifacts.
- JOSPT paper on ACWR methodological sensitivity: demonstrates that ACWR–health relationships vary substantially by method.

### Volleyball and beach volleyball injury patterns and prevention

- Bahr et al. beach volleyball injury study: direct evidence for overuse injury burden (low back, knee, shoulder) and the framing that acute time-loss injury may be lower but overuse matters.
- FIVB injury prevention guidance: volleyball-specific prevention concepts translatable into non-clinical app guardrails (load reduction for overuse, warm-up/cool-down importance, ankle sprain mechanisms).
- VolleyVeilig warm-up effectiveness study: strongest "warm-up can reduce injuries in volleyball" evidence in the set.
- AAOS volleyball injury prevention article: accessible, mainstream medical framing of common volleyball injuries and importance of preparation/warm-up.
- NATA ankle sprain position statement: evidence-based statements about recurrence, sensorimotor training, and prophylactic taping/bracing.

### Practical safety screening, pain/soreness, and stop guidance

- PAR‑Q+ form: evidence-informed screening questions adaptable into low-typing onboarding and "seek clearance" gates.
- PAR‑Q safety PDF: explicit "stop exercising immediately" symptom list.
- APTA ChoosePT article: operationalizes soreness vs pain and gives app-appropriate behavioral guidance.
- DOMS review (PubMed): supports the mechanism that soreness can affect ROM and movement patterns, increasing risk if returning too soon.

### Session RPE and minimal monitoring

- Session‑RPE review (Frontiers): evidence base for validity/reliability and the definition of sRPE as intensity + duration.
- sRPE validity study (Frontiers): concrete example of computing sRPE as duration × RPE.
- Single-item wellbeing measures systematic review: supports that brief readiness items are common but not definitively predictive.
- CDC intensity guidance page: provides a simple 0–10 scale mapping (moderate 5–6, vigorous 7–8).

### Heat illness (beach context)

- NATA exertional heat illnesses statement: framing and urgency (EHS as a leading cause of sudden death in sport) plus prevention/recognition emphasis.
- Health Canada heat illness fact sheet: clear symptom lists and emergency actions suitable for consumer copy.
- FIVB heat stress monitoring protocol + related federation report summary: establishes that beach volleyball has sport-specific heat stress monitoring practices.

### Regulatory/compliance boundaries and disclaimer patterns

- FDA "General Wellness: Policy for Low Risk Devices" guidance: relevant for framing intended use/claims and avoiding medical device positioning.
- Health Canada SaMD guidance: relevant for deciding what feature/claim language could push into medical device territory.
- Peloton Terms of Service: representative example of strong "not medical advice" disclaimers used by a mainstream fitness platform.
