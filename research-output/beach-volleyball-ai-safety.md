# AI in M001 for a Mobile-First Beach Volleyball Training Product

## Executive summary

AI should **not** be in M001 **as a workout/session generator**. The fastest path to a believable, safe, and high-trust end-to-end loop is a **deterministic session composer** (rules + curated drill library + conservative progression) with **structured, editable outputs** and **offline-first execution**. The strongest desk-research signal is that LLM-style generation in exercise prescription commonly fails in exactly the way your product can’t afford: **plausible-looking but incomplete plans**, occasional unsafe or inconsistent details, and hard-to-predict behavior changes across model versions.

If you insist on testing AI in M001, the narrowest, safest, highest-trust role is **copy-only, non-authoritative explanation**: AI may *summarize* “why this session was chosen” and *rephrase* coaching cues **from a constrained, deterministic source of truth** (your rules and drill metadata). It must be **optional**, **skippable**, **never required to run a session**, and **never allowed to create or modify training volume/intensity**. This aligns with established human-AI interaction guidance: set accurate expectations, support efficient correction, and gracefully degrade when uncertain.

## Key findings with confidence levels

I’m using a practical confidence scale: **High** = replicated evidence / strong consensus from credible sources; **Medium** = good evidence but indirect to your exact domain; **Low** = plausible but mostly inferential or depends heavily on primary user testing.

**LLM-generated exercise guidance is often “confidently incomplete,” and that’s a safety + trust failure mode, not a minor bug. (High)**  
A mixed-methods evaluation of AI-generated exercise recommendations found **major gaps in comprehensiveness** (overall ~41% vs a gold-standard framework) even when factual accuracy of the included content was relatively high; omissions clustered around key prescription components (e.g., FITT/volume details), and readability skewed high (college level).  
Separately, coaches rating ChatGPT-generated runner training plans judged them **sub-optimal overall**; quality improved with more input detail, but even the “best” plan still had notable weaknesses (including progression issues).  
For your product, an “almost right” plan is dangerous because it encourages **automation bias** (people follow it because it looks legit) and also triggers **algorithm aversion** the moment it breaks credibility once.

**Hallucinations/omissions are not edge cases; they’re a known property of current LLM behavior, especially in “plan” sections. (High)**  
A clinical safety framework paper argues hallucinations/omissions may be intrinsic properties of current LLMs and warns they can appear with high confidence; it specifically notes higher-risk hallucinations often show up in “plan”-like sections where instructions are given.  
A broader hallucination survey similarly frames fluent-but-wrong output as a core reliability threat and emphasizes detection/mitigation is still an active research area rather than a solved product problem.  
This matters because your M001 loop literally *is* a “plan section”: generate session → run session. That is the wrong place to accept probabilistic text generation without heavy constraints.

**Trust and safety risk is amplified in self-coached physical training because users will either over-trust or abandon fast. (High)**  
Automation bias literature shows people can over-rely on decision support and fail to seek contradictory info, particularly under time pressure and cognitive load; these conditions map uncomfortably well to “courtside, bright sun, short interactions.”  
In parallel, algorithm aversion research shows users often reject algorithms after observing errors, but allowing **even limited user control/editing** increases acceptance and satisfaction.  
Product implication: M001 must be designed so the user feels **in control** (edit fast, swap drills, adjust difficulty), and the system is transparent about limits—this is easier with deterministic logic than with broad AI generation.

**Explanations can increase trust—or increase over-reliance or be ignored entirely—so “See why” must be short, contextual, and action-relevant. (High)**  
Research on explainable recommendations and trust calibration highlights two systematic failure patterns: users may **skip explanations** when they feel like overhead, or **misapply** them (misinterpret confidence, latch onto the wrong feature). It also calls out the tension between explainability and usability—explanations add cognitive work.  
So “See why this session was chosen” must be engineered like a high-trust, low-attention artifact, not a verbose AI justification.

**Your mobile context is a hostile interaction environment; open-ended chat is structurally mismatched to sunlight + glare + sweat + sand. (High)**  
Studies on situational impairments show bright sunlight/glare changes mobile interaction behavior and reduces performance; people tend to make larger/broader gestures under impairment and have reduced visual attention.  
Accessibility contrast guidance gives concrete thresholds (e.g., minimum contrast ratios) that become more important outdoors; these constraints push you toward big-tap, high-contrast, low-typing flows.  
This supports your current stance (structured workflows, minimal typing) and argues against “chat as primary UX” in M001.

**Volleyball training has meaningful overuse and acute injury patterns; load awareness and conservative progression are not optional in a self-coached planner. (Medium→High)**  
Injury surveillance in beach volleyball identifies common acute injuries (notably ankle/knee/fingers) and frequent overuse issues (low back, knee, shoulder).  
The FIVB injury-prevention material emphasizes that overuse injuries can be insidious and that load reduction/activity modification is a core treatment principle—exactly the dimension a planner can inadvertently get wrong if it pushes volume too aggressively.  
Even though M001 targets passing/serve-receive (generally less load than max jumping), repetitive practice plus self-coached “grind” behavior still makes conservative load heuristics and stop/seek-care cues important.

**Comparable fitness apps show you can deliver “adaptive planning” without generative AI, but they still need clear controls and expectations—and often require connectivity for adaptation. (Medium)**  
Fitbod documents a workout-generation approach built on preferences, workout history, duration, equipment, recovery tracking, and user feedback controls (replace, exclude, recommend more/less). That’s a deterministic/algorithmic personalization pattern with explicit user override.  
Freeletics explicitly notes its “adapt session” feature requires an active internet connection—an important reminder that many “smart adaptation” features assume connectivity by default.  
This supports a design where M001 works fully offline—and any AI layer must degrade gracefully to deterministic behavior.

## What this means for the product’s next-step decisions

The investigation question (“Should AI be in M001 at all?”) is really a **risk allocation** question. M001’s success criteria are: believable session loop, low interaction cost courtside, offline resilience, and high trust. In that frame, AI in the critical path is mostly **downside** unless you can prove it improves outcomes more than it increases variability and safety risk.

Here are the decision-relevant implications you should treat as “must specify before building,” regardless of whether AI ships:

**Define the deterministic “source of truth” first (drill library + session assembly rules + progression rules).**  
If you can’t write down deterministic rules for (a) drill selection, (b) volume/intensity caps, and (c) the progress/hold/deload mapping, then adding AI won’t fix the problem—it will hide it behind fluent text. The LLM literature repeatedly shows performance is sensitive to prompt framing/versioning and can still produce omissions/hallucinations.

**Treat “wrong plan” risk as a product safety requirement, not just correctness.**  
Volleyball injuries include both acute and overuse patterns; overuse is insidious and players often “play through” until it’s bad, so a planner that steadily ramps volume can cause harm even if no single session looks outrageous.  
This points to conservative defaults, explicit deload logic, and “stop/modify” triggers that do not depend on AI correctness.

**Engineer trust calibration, not just explainability.**  
Your “See why” needs to help users calibrate trust quickly under cognitive load; research shows explanations can be skipped or misapplied, and can increase over-reliance if not designed carefully.  
This implies the “why” artifact should be short, structured, and tied to controllable levers (“if you want harder/easier, tap here”) rather than a narrative justification.

**Design for automation bias and algorithm aversion simultaneously.**  
Courtside constraints and self-coaching increase the chance users accept defaults without scrutiny (automation bias).  
But one visibly wrong session can cause drop-off (algorithm aversion), and research suggests small, constrained user edits can materially improve acceptance of algorithmic suggestions.  
Your UI must therefore: (a) make editing cheap, (b) clearly show what inputs drove the session, and (c) never imply authority that the system can’t guarantee.

**Offline-first isn’t a “nice-to-have;” it’s a functional requirement that heavily constrains AI.**  
Some consumer “adaptive” features assume internet connectivity.  
If you add cloud AI in M001, you must decide up front whether it is acceptable to: (a) block session generation on connectivity (probably no), or (b) fragment behavior (AI sometimes, deterministic other times), which can be a trust killer unless messaged cleanly.  
On-device models are becoming more available, but betting M001 on platform-specific on-device AI is a strategic commitment with cross-platform implications.

## Recommendation

**Recommendation: ship M001 with no AI in the loop.**  
Do deterministic session generation + deterministic “why” explanations (templated) + fast user edits + offline-first runtime.

A narrow AI boundary if yes:  
AI may exist only as an **optional copy layer** that (a) summarizes deterministic rule triggers into a short “why,” and (b) rephrases coaching cues strictly from vetted drill metadata. AI must be **incapable of changing drill selection, volume, intensity, progression, or safety logic**, and must be **skippable** and **fully removable** without breaking the loop.

Fallback behavior if AI is excluded or unavailable:  
The product must **always** generate and run a session offline using deterministic rules; “See why” becomes a **templated explanation** that enumerates inputs used, rules triggered, and the one-tap levers to change the plan (harder/easier/shorter/partner mode). No spinners, no blocking, no degraded session runtime.
