# Evidence missing before building M001 and the smallest validation program to justify it

Date captured: 2026-04-12
Source type: Deep research synthesis (desk research + evidence review)
Status: Raw research artifact — mined findings go into docs/research/beach-training-resources.md

## Executive summary

M001's biggest unknowns are not "can we assemble a passing session?"—desk research says there is already abundant, credible drill content and many substitutes (free and paid). The hard unknown is whether the *specific* first user (self-coached, beginner-to-intermediate beach player) will reliably complete an end-to-end, phone-mediated loop *courtside*, under glare/sweat/sand, and then come back next week. This is a value + usability + retention problem more than a content problem.

Because digital self-help products predictably suffer high discontinuation ("attrition") even when users initially intend to use them, "interest" signals (waitlists, likes, "sounds cool") are too weak to justify committing to a build. M001 should be green-lit only after you see **repeat behavior**: people complete a session in context and ask for/run the next one with minimal prompting.

The smallest credible program that can justify moving from docs-first planning into building M001 is a **compressed 1–2 week riskiest-assumptions test** that combines: (a) a handful of real in-context usability runs (sun + sand), (b) a concierge/Wizard-of-Oz "session loop" (no backend, minimal prototype), and (c) a hard threshold for retention (a second session within ~7–10 days). This approach is consistent with "test the riskiest assumptions first," pretotype/concierge methods, and small-N iterative usability testing.

## Key findings with confidence levels

**High confidence:** The *content* for passing/serve-receive sessions is not scarce; it is abundant and structured already, including drill objectives, equipment requirements, participant counts, and teaching points. For example, the FIVB beach drill book contains a full passing section with many drills (and explicit constraints like "minimum 1 athlete + coach assisting" or receiving pair requirements).

**High confidence:** Passing/reception is inherently central to beach volleyball rally structure: the serve starts each rally and reception is the first post-serve contact, typically a forearm pass to a partner (and can also directly set). This supports "pass-first" being defensible as an *early skill focus*—but it does not, by itself, prove it is the best *product wedge*.

**Medium confidence:** "Solo-first, pass-first" is plausible but fragile. Community discussions repeatedly describe solo serve-receive practice as difficult and suggest wall-based workarounds (serve/pass against a wall, react to rebounds), implying solo passing practice often depends on access to a wall or rebounder—conditions that may not exist at many beaches. This supports making "available environment/equipment" a first-class input, not an edge case.

**High confidence:** The beach use context will materially distort mobile UX: glare and situational factors can compromise mobile interaction; even official guidance for public-safety authentication notes sun glare can reduce users' ability to see on-screen keyboards and enter text. This strongly reinforces your "minimal typing" stance and makes in-context field testing non-negotiable.

**High confidence:** "Large targets, low-precision interactions" is not a preference; it is table stakes. Established guidance recommends minimum tap target sizes (e.g., ~44×44 points on iOS, ~48×48 dp on many platforms, and ~1cm×1cm as a physical minimum to reduce fat-finger errors).

**High confidence:** Your "capture minimal context" step should aggressively eliminate input fields and rely on defaults/selection wherever possible; mobile form usability guidance explicitly frames every field as a tax and recommends using history/defaults and device capabilities (e.g., location) to reduce manual entry.

**Medium confidence:** Offline-friendly behavior is likely important, but it should be treated as a *testable requirement*, not a foregone conclusion. Offline-first is a well-defined architecture pattern and explicitly targets "spotty or slow network" and "remain usable without reliable connectivity," but the product decision is whether *your* first users actually experience this often enough (and care) to justify the complexity cost in M001.

**Medium confidence:** Safety/load awareness is not optional even in "amateur" training tools. Research in elite volleyball and beach volleyball finds that while acute time-loss injury rates can be relatively low, overuse problems (notably knee, low back, shoulder) are common in beach volleyball cohorts, and prevention guidance includes load reduction and technique correction—suggesting your post-session review should include at least a pain/soreness and perceived exertion/readiness signal that can drive "progress/hold/deload."

**High confidence:** The biggest predictor of whether M001 is worth building is not initial enthusiasm; it's whether it fits into users' lives and survives attrition. The "law of attrition" framing in eHealth argues that substantial dropout/non-usage is typical and should be measured explicitly—this generalizes well to niche self-guided training workflows.

**Medium confidence:** Substitute behavior will be entrenched because it's cheap and flexible: free drill libraries, PDFs, and videos are abundant; and existing apps already advertise "no coach needed," solo/partner options, offline use, and audio guidance. This raises the bar for M001's differentiation to "zero-friction courtside execution + next-session adaptation," not "more drills."

## What this means for the product's next-step decisions

The practical question is "what evidence is still missing before we move into building M001?" A decision-quality answer is best organized by the four risk classes (value, usability, feasibility, viability) and then narrowed using a riskiest-assumption approach.

**Value risk (is this worth doing weekly?)** is the core gap. Desk research supports that players *can* train passing and that many want help, but it cannot tell you whether your target ICP wants a structured session workflow *enough to change behavior*—especially when "just play doubles," "watch a video," or "do nothing structured" are always available substitutes. You need evidence of (1) a recurring trigger ("I'm frustrated with passing / I have a tournament / I'm training solo"), (2) a routine they will actually execute courtside, and (3) a reward that makes next-week repetition happen. Attrition literature makes it explicit that discontinuation is expected; therefore the bar for green-lighting M001 should be "second-session behavior," not a waitlist.

**Usability risk (can it be used in sun/sand with micro-interactions?)** is the second decisive gap. Your app will be used under situational impairments (glare, divided attention, wet/sandy hands). This pushes you toward: ultra-large targets, minimal text entry, and likely audio/haptics. But these are not "design best practices" you can safely assume—field testing in the real environment is the only way to confirm that a "courtside runner" is viable for your users (some might not bring a phone onto sand at all, or might intentionally go tech-free outdoors).

**Feasibility risk (can you build it fast enough?)** is comparatively manageable for M001 *if* you intentionally constrain scope. The trap is over-building "session generation" and under-building "courtside execution." The evidence from a solo-developer fitness app case study is instructive: the author started from a personal need to stay focused training alone, found video substitutes repetitive, and concluded that large-font, clear screens plus audio cues mattered because training didn't happen in front of a computer. They also found that raw customization forms confused users and required abstraction into pre-made workouts and simpler setup flows—directly relevant to your "minimal context capture + quick edit" goals.

**Business viability risk (can it sustain itself?)** is not required to build M001, but you should still validate at least one of: willingness to pay, willingness to prepay, or willingness to recruit a second user (partner) because acquisition and monetization are otherwise deferred risks that can still kill the project later. At minimum, the evidence standard should be "commitment," not compliments, because early conversations are biased.

Concretely, the missing evidence that blocks "commit to build M001" is:

- Whether users will **pull out their phone during a real beach session** and follow a structured runner (vs. preferring memory/printouts/partner-led flow).
- Whether your "solo-first" wedge works without assuming facilities (wall/rebounder) that many beaches don't have.
- Whether a **<60-second post-session review** is actually completed when tired/sweaty, and whether its signals are sufficient to drive a believable progress/hold/deload adaptation that feels trustworthy.
- Whether users do it **again next week**—the minimum retention proof that counters predictable attrition.

## Recommended validation approach

**Option to build now (full M001)**
This is only rational if you believe the primary unknowns are engineering details. The sources strongly suggest the opposite: the unknowns are behavioral and contextual (outdoor usability + habit + retention), and those will not be resolved by building "a nicer plan generator." Building now risks creating an elegant workflow no one uses after week one.

**Option to hold for more validation (classic Phase 0 discovery)**
This de-risks better but often becomes open-ended. If you do this, you should still time-box it and prioritize riskiest assumptions rather than "learn everything."

**Option to build only a thin prototype in parallel with validation (recommended)**
Use a Wizard-of-Oz / concierge approach: test a believable end-to-end loop with minimal software, substituting manual effort for planning/adaptation. This fits both your constraints (small team/solo dev) and the evidence standards implied by pretotype methods ("simulate core experience with minimal investment") and small-N usability testing ("many small tests beat one big study").

**Recommendation:** build **only a thin prototype in parallel with validation**, and do not start "real M001 development" until the prototype produces repeat-use evidence (second session within ~7–10 days) in at least a small handful of users.

The "thin prototype" here is less "an app" and more "a field-testable session runner":
- 2–3 prebuilt passing sessions (solo + partner variants) assembled from known drills, with explicit equipment/partner requirements.
- A runner UI with gigantic touch targets + almost no typing.
- A <60s review capturing 1–2 actionable signals (pain/soreness + RPE/readiness), sufficient to drive progress/hold/deload.

## What should be decided now vs deferred

**Decide now (because it determines whether M001 is even testable)**

- **Define "solo-first" operationally**: does solo mean "on sand with only a ball," "at-home with a wall," or "solo but near a rebounder/net"? Desk research shows solo serve-receive practice often leans on a wall; if you don't decide what solo means, M001 will accidentally target an unrealistic setup.
- **Minimal context inputs** for session assembly must include at least: solo vs partner availability, time available, equipment/environment available (net? wall? cones?), and a safety/readiness check. The FIVB drill content itself encodes participant/equipment constraints—ignoring them will generate unusable sessions.
- **Runner interaction contract**: how often must the user touch the phone? If it's more than brief, infrequent taps, it will fail in glare/sand. This implies making the runner mostly "readable at a glance," optionally audio-driven, and resilient to the user ignoring it for minutes at a time.
- **Evidence threshold for green-lighting build**: set it upfront as repeat behavior (second session), not NPS or stated interest—because attrition is expected.
- **Ethical stance on "fake door"** if you use it: pretotyping guidance explicitly warns against deceptive tests in sensitive domains like medicine; sports training is lower risk, but you should still avoid implying coaching authority you don't have and be transparent when human/manual work is being used.

**Defer (because it's not needed to validate the core loop)**

- Multi-week planning, rich analytics, video analysis, social/community, coach workflows, backend sync. These can become retention multipliers later, but none are required to validate the minimal "plan → run → review → adapt → repeat" loop.
- AI generation beyond tightly constrained assembly: for validation you can manually assemble sessions from known drills; automation can wait until you know what actually repeats.

## What still needs primary validation, prototype testing, or expert review

**Will they actually use a phone courtside?**
You need in-context observation (field study / contextual inquiry style) because glare, sand, and social context are decisive. Some people intentionally avoid phone use outdoors; that alone can kill a "phone-as-coach" runner.

**Does "solo passing session" work in practice for your users' environments?**
The drill library may say "minimum 1 athlete + coach assisting," but that often implies a thrower/tosser. You must test what "solo" realistically means and whether users have the facilities (wall/rebounder) that solo drills often depend on.

**Does the review truly take <60 seconds and produce believable adaptation?**
If your adaptation signal is too weak, next-session changes will feel random and reduce trust. If it's too heavy, people won't do it. A simple, validated signal like session-RPE exists and is widely discussed as ecologically useful, but you still must validate that beach players will provide it consistently.

**Will they come back next week?**
This is the highest-order validation. Attrition is common; your validation must explicitly measure drop-off and whether the product fits into real life.

**Safety/expert review (minimum bar)**
Even if beach volleyball is "relatively safe," overuse injuries (knee, back, shoulder) are salient in the sport, and prevention guidance includes load reduction and technique correction. Before you scale beyond a handful of testers, you need a coach/physio review of your initial sessions and your "deload" logic to ensure you're not prescribing unsafe volumes or progressions.

## Concrete 1–2 week compressed validation plan

**Days 1–2: risk framing + prototype skeleton**
- Assumption surfacing + risk scoring; select top 5 assumptions to test (e.g., "will use phone on sand," "solo passing session feasible," "<60s review completion," "repeat next week," "offline needed").
- Build a bare runner prototype (could be a simple mobile web flow saved to home screen) with: giant buttons, "next drill," "timer," "pause," and a 3-question review. Enforce almost no typing (pickers/toggles only).

**Days 3–5: recruit + first field runs**
- Recruit 10–12 candidates; schedule 5 field tests + 6–8 concierge participants (overlap is fine).
- Conduct 5 field usability runs: observe a user attempting to run the session in real sun/sand; capture where they refuse to touch the phone, mis-tap, or abandon the runner. Iterate immediately (multiple small tests > one big test).

**Days 6–10: concierge loop and measurement**
- For each participant, run:
  - minimal context capture (≤30 seconds)
  - deliver a passing session that matches their constraints (solo vs partner; equipment)
  - have them run it within 3 days
  - collect <60s review immediately after
- Manually label outcome: progress / hold / deload using review signals (pain/soreness + RPE/readiness).

**Days 11–14: forced "week two" test (the real gate)**
- Push an adapted next session to every participant and measure:
  - Who runs it without being chased?
  - Who runs it only with reminders?
  - Who drops? (Treat this as expected attrition; quantify it.)
- Decision gate (example thresholds you can tune):
  - ≥6 recruited → ≥4 complete session 1 → ≥2 complete session 2 (within 10–14 days) **and** at least 2 users explicitly ask for the next session or invite a partner.
  - If you miss session-2 retention, do not "build harder"; revisit wedge (skill focus, solo definition, runner design, or even whether phone courtside is viable).

## Source list

- FIVB Beach Volleyball Drill-book (PDF) — Structured drill content with objectives, equipment, participant counts, teaching points. Shifts M001 risk from "content scarcity" to "workflow/retention."
- FIVB "The Game" glossary page — Serve and reception as core rally actions; supports pass/serve-receive as a reasonable initial skill focus.
- NISTIR 8080 (NIST, PDF) — Sun glare degrades ability to see on-screen keyboards/enter text; reinforces "minimal typing" and harsh outdoor constraints.
- Nielsen Norman Group touch target guidance — Quantitative "1cm×1cm" minimum and error rationale; directly informs courtside runner interaction design.
- Apple Human Interface Guidelines (Buttons) — Minimum hit region (44×44 pt) as a mainstream platform baseline for touch targets.
- Google Material / Android Accessibility guidance — Minimum touch target baselines (~48×48 dp / ~9mm) and spacing recommendations.
- Nielsen Norman Group mobile input checklist — Each input field is a usability risk on mobile; supports designing M001 around selections/defaults and device capabilities.
- Android Developers "Build an offline-first app" — Defines offline-first and its criteria (usable without reliable network; show local data immediately); useful to scope "offline-friendly" as a product requirement but also as a complexity cost to validate.
- Wobbrock et al., situationally induced impairments — Glare and similar contexts compromise mobile interaction; supports field testing over lab-only testing.
- Eysenbach, JMIR "Law of Attrition" (PDF) — Substantial dropout/nonusage is typical in self-directed digital interventions; makes "second-session retention" the right evidence bar for M001.
- Cagan / SVPG "Four Big Risks" — Clean framework (value, usability, feasibility, viability) to define what must be validated before building vs during build.
- UK Government blog (Services in government) riskiest-assumption prioritization — Concrete method for assumption surfacing and scoring risk to avoid endless discovery and focus 1–2 week validation.
- Mind the Product on Wizard-of-Oz vs Concierge MVP — Practical distinction and justification for testing front-end vs back-end assumptions with minimal build; matches M001 validation needs.
- Pretotype It (PDF) + pretotyping techniques summary (PDF) — Formal definition of pretotyping and examples of fake-door/facade tests; supports "simulate core experience cheaply" as the correct pre-M001 move.
- Nielsen Norman Group "Why you only need to test with 5 users" — Supports using multiple small rounds of field usability tests rather than waiting for large research studies.
- Bahr & Reeser (2003) study (PDF) — Acute injury incidence plus overuse problem distribution in professional beach volleyball; supports including safety/readiness checks and deload options.
- Oslo Sports Trauma Research Center summary — Injury patterns and caveats for beach volleyball; product-level safety rationale.
- Br J Sports Med / FIVB injury surveillance paper (PDF) — Prevention implications including load reduction suggestions; informs what "deload" should mean.
- Session-RPE review (PMC) — Supports using a simple perceived exertion signal as an ecologically useful load proxy.
- Cleveland Clinic explainer of Borg CR10-style RPE — Simple explanation suitable for a <60s check-in.
- Marc G. case study on building a solo training iOS fitness app — Solo-builder pattern: users find video substitutes repetitive, need large-font + audio cues, and customization forms confuse people without abstraction.
- Volleyball training app store listing evidence — Competitors emphasize offline and audio guidance and support 1–4 player drills, suggesting these are expected patterns rather than differentiators.
- Reddit threads on solo serve-receive drills — Substitute behavior patterns (wall drills, "hard to do solo"), useful for hypothesis generation.
