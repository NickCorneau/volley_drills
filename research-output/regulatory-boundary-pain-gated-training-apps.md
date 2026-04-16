# Regulatory boundary for pain-gated consumer training apps

Source: Desk research synthesis (2026-04-16)
Type: Raw research output — do not edit; curated findings go to `docs/research/`.

Curated note: `docs/research/regulatory-boundary-pain-gated-training-apps.md`

## Bottom line

The current product posture is **gray-area overall**. In the **best** implementation, it can still plausibly sit on the wellness side in the U.S. and, to a lesser extent, Canada if the app is clearly framed as a consumer fitness tool, the pain gate is described as a **training-modification convenience** rather than injury assessment or pain treatment, the load rule is described as a **coaching methodology** rather than a prescription or therapeutic protocol, and the stop/seek-help prompts are framed as **generic safety signposts** rather than diagnostic conclusions. But the exact combination described is materially more exposed than a generic logging app, and it becomes **likely unsafe** under EU/UK/Australia-style frameworks if the copy or UI implies the app is treating pain, managing an injury, making specific treatment decisions, or triaging a serious condition.

The most important practical point is that regulators across jurisdictions look at **intended purpose as expressed in labels, app-store descriptions, onboarding text, in-product copy, instructions, and marketing**, not just at the disclaimer in the terms. The FDA's 2025 warning letter to WHOOP is the clearest recent proof: FDA said the feature's disclaimers did not outweigh the fact that the function itself was designed to estimate blood pressure and was therefore inherently associated with diagnosis.

The short verdict is this: **"general wellness, not medical advice" is not enough by itself.** It works only if the product behavior, feature naming, user flows, and edge-case prompts all stay aligned with that posture. If the app starts looking like it is **assessing pain as a clinical symptom, prescribing a therapeutic training dose, or warning about a likely medical event**, you are no longer relying on a mere copy problem; you are drifting into regulated-function territory.

## The current U.S. boundary

The updated U.S. baseline is the January 6, 2026 FDA general-wellness guidance, which replaced the older 2019 version but kept the same core structure: the product must have a **general wellness intended use** and must also be **low risk**. The updated guidance gives unusually relevant examples. FDA says a wrist-worn wearable that assesses activity and recovery and outputs hours slept, sleep quality, pulse rate, and blood pressure can still be a low-risk general wellness product **if** the claims stay in general wellness and do not imply medical or clinical use. FDA also gives an example of a non-invasive elite-athlete wearable monitoring electrolyte balance, lactate, and hemoglobin in an exercise/fitness context, expressly disclaimed for diagnosis, that can remain in the general-wellness lane if the values are validated.

That does **not** mean "anything physiological is safe." The same FDA also says software becomes regulated when it performs patient-specific analysis and provides patient-specific diagnosis or treatment recommendations to patients or non-HCP users, and it separately says it may exercise enforcement discretion for software that helps patients self-manage a disease or condition **without** providing specific treatment or treatment suggestions. That distinction is the key one for the app. A readiness score or even a deterministic training progression logic can still look like coaching; a pain-driven reroute that starts to function as a patient-specific treatment recommendation is where the risk spikes.

The recent WHOOP matter shows how hard that line can bite in practice. In July 2025 FDA told WHOOP that its blood-pressure feature was being marketed without authorization, said the disclaimers were insufficient, and emphasized that a blood-pressure estimate is inherently associated with diagnosing hypo- and hypertension. In September 2025 FDA followed with a safety communication warning consumers not to use unauthorized blood-pressure features on wearables, noting that inaccurate alerts can delay treatment or drive unnecessary intervention. So in the U.S., the safest reading is this: **generic fitness adaptation is potentially okay; patient-specific medical interpretation is not; and disclaimers do not rescue a medical function.**

Applied to the three features:

- A **pain gate** is safer if written as "we can switch today's workout to a lower-load or lower-impact option" and riskier if written as "we detected an injury pattern and are assigning a rehab session."
- A **load-based progress/hold/deload rule** is safer if described as a training-methodology rule for performance goals and riskier if described as a prescribed dose, protocol, or injury-management plan.
- **Stop-and-seek-help prompts** are safer when they are fixed safety messages or general signposting, and riskier when the app uses user-specific data to infer that the person may be having a specific medical condition.

## The boundary in Europe, Canada, the UK, and Australia

### European Union (strictest of the major regimes)

Under the June 2025 revision of MDCG 2019-11, the EU remains heavily focused on **intended purpose** as stated in the label, instructions, promotional material, and sales statements. The guidance explicitly says "wellness or fitness apps" do **not** qualify as medical device software, but it also gives a directly relevant counterexample: software that uses patient data from a specific musculoskeletal pathology and is intended to **alleviate pain** by recommending **personalised rehabilitation exercises** is medical device software. Once software is intended to provide information used for therapeutic decisions, Rule 11 usually moves it into at least Class IIa.

That means the EU problem is not just "diagnosis." It is also **therapy and alleviation**. If a pain gate is positioned as a way to respond to soreness or discomfort in a general training context, there is still room. If it is positioned as a way to alleviate pain from an injury, protect an injured structure, manage recovery from a pathology, or recommend pain-specific exercise substitutions, it is walking directly toward the EU example that sits on the medical side. This is why U.S.-style "wellness" drafting does **not** transfer cleanly into EU MDR land.

### United Kingdom (similar to EU on substance; divergent on market access)

The UK MHRA's current software guidance says that monitoring general fitness, general health, and general wellbeing is **not usually** a medical purpose. It also says software is unlikely to be a device if it offers only lifestyle treatment choices or simple referral advice such as "see your GP." But the same guidance says software is most likely to be a device when it influences actual treatment, results in diagnosis or prognosis, or is intended for treatment or alleviation of disease, injury, or handicap. Most importantly for a disclaimer strategy, MHRA says generic disclaimers like "for information only" or "this product is not a medical device" are not acceptable if medical claims are made or implied elsewhere.

Post-Brexit, the UK still accepts CE-marked devices in Great Britain through transition periods and is developing international reliance pathways, so the **market-access mechanics** are diverging from the EU. But for a product-design decision, the central software-qualification logic is still very close to the EU's: fitness and wellbeing are fine, clinical inference and therapeutic direction are not.

### Canada (more non-device room, but only without immediate-action treatment logic)

The public Health Canada SaMD framework still rests on the 2019 guidance and examples that remain current on Canada.ca. Health Canada says software intended for maintaining or encouraging a healthy lifestyle, such as general wellness apps, is outside the medical-device definition, and it also says software with no direct impact on diagnosis, treatment, or management of an individual's disease or symptoms is generally outside the Regulations. The tricky part is the software-exclusion test: to remain excluded, the software must only support decisions, must not drive immediate or near-term action, and must not replace judgment where the user cannot independently review the basis for the recommendation.

Canada is also comparatively explicit that some **triage and coaching** functions can stay outside the device rules. Its examples say chat-based triage software that guides users to the most appropriate help, including emergent care advice, is not subject to the Regulations. It also says software that provides supplemental care by coaching or educating patients to help them manage their health can remain outside regulation, including software that promotes healthy weight, nutrition, exercise, and adherence to pre-determined schedules by simple prompting. But once the software provides patient-specific treatment recommendations or a diagnostic output that the user would not otherwise have, it moves into Class II or III territory.

For this app, Canada is friendlier than the EU to **signposting** and **behavior-change coaching**, but not to a pain feature that effectively acts like a treatment engine. "Here is a lighter training option today" is one thing. "Because your pain answers indicate likely tissue overload, do this rehab dose instead" is another.

### Australia (sharp exclusions framework, very instructive for product design)

The 2026 TGA guidance is unusually operational. It says that general health or wellness software may be excluded when it is for general consumer use, measures or monitors physical parameters non-invasively, and does **not** make claims or treatment decisions about a serious disease or condition. But TGA's examples show how little it takes to lose the exclusion. A fitness tracker that measures workout intensity is excluded; add a warning for users with chronic heart conditions when heart rate approaches a preset safety threshold, and it is **not excluded**. For self-management software, the exclusion fails if the software diagnoses, directly treats, or makes **specific treatment recommendations or decisions**. TGA also states that every function in multi-function software must independently satisfy the exclusion criteria.

That makes Australia especially relevant to the pain gate. If the pain gate is framed as self-management of a condition or injury, "specific treatment recommendations" must be avoided. "Lower today's training volume" may still be arguable if framed purely as wellness coaching; "perform this pain-relief session because of your injury symptoms" looks much more like a specific treatment recommendation and falls out of the exclusion logic. TGA's 2026 advertising guidance also underlines that claims themselves can change regulatory status, which means the marketing team cannot be treated as a separate compliance problem.

### Convergence and divergence

All five regimes converge on four core ideas:

1. **Intended purpose controls.**
2. "Wellness / fitness / healthy lifestyle" language is helpful only if the function and surrounding copy support it.
3. **Specific diagnosis, treatment, or patient-specific therapeutic decisions** are what usually trigger device classification.
4. Generic referral advice or safety signposting is safer than disease-specific inference or treatment logic.

The main divergence is that the U.S. and Canada preserve a broader practical zone for low-risk wellness tools and some non-device patient-support functions, while the EU, UK, and Australia move faster toward regulation when the software is framed as **alleviating pain, supporting therapy, or making treatment-related decisions**, even for consumer-facing software. For a company shipping one global product, the real constraint is therefore not the most permissive jurisdiction; it is the **strictest credible interpretation in the markets you care about.**

## How the specific feature bundle maps to the line

A **pain gate** is the most sensitive feature in the stack. Regulators are much more tolerant of generic readiness, fatigue, and soreness adaptation than of anything that sounds like managing an injury or alleviating pain. The cleanest wellness position is to treat pain input as a **user preference / readiness signal** that offers a lower-intensity or lower-impact alternative for training convenience. The risk jumps if the app presents pain as a clinical symptom, labels the replacement session as rehab or recovery from injury, or says the algorithm is helping protect, treat, or restore an injured body part. Under EU guidance, pain-alleviating personalised rehab guidance is plainly on the medical side; under FDA and TGA logic, the same shift starts to look like a patient-specific treatment suggestion.

A **deterministic progress/hold/deload rule set** is not automatically a medical-device problem. Fitness apps have long used structured progression logic. The legal risk comes from **what the rule is said to be doing**. If the rule is described as a method for adjusting training difficulty toward a performance goal, it is easier to defend as coaching. If it is described as a prescribed loading dose, a return-to-training protocol, a recovery plan for pain, or a medically safe progression, it begins to resemble treatment logic. Canada's exclusion framework and the FDA's software guidance both point in the same direction here: support and inform are safer than treat, diagnose, or drive immediate patient management.

**Stop / seek-help prompts** are the least dangerous of the three features, provided they stay simple. MHRA explicitly treats referral advice such as "see your GP" as less likely to be a device, and Health Canada's examples leave room for chat-based triage that points users toward self-care, pharmacy, primary care, or emergent care. So "Stop this workout and seek medical attention if you feel chest pain, fainting, or severe breathing difficulty" is much easier to defend than "Your symptoms indicate heat stroke" or "Your data suggests a cardiac event." The first is safety signposting. The second is diagnosis-like inference.

Looked at together, this exact bundle is **not documented in the official materials as a clean, regulator-endorsed general-wellness pattern**. What the public record shows instead is a split world: official examples that bless broad fitness/wellness tracking on one side, and official examples that classify pain-alleviation / therapeutic / patient-specific intervention logic as medical on the other. That is why the bundle is not "likely-safe" out of the box. It is a **grey implementation problem** that needs to be designed downward into wellness mode rather than assumed to be there already.

## How comparable apps hold the line in public copy

The cleanest public wellness-positioning pattern is the **split-feature** approach used by WHOOP. Its terms say the service is not medical advice, is intended for personal wellness tracking, is not for making medical decisions, and is not intended for emergency or life-threatening situations; at the same time, WHOOP carves out specific features such as Heart Screener as separately regulated where applicable. Its help materials use the same structure for Health Monitor and Blood Pressure Insights: wellness feature, not medical device, not diagnosis or disease management, consult a doctor, do not delay care. That is exactly how a company tries to preserve the wellness perimeter while isolating features that are closer to the medical line.

Future uses a different pattern: **heavy pre-participation gating plus safety escalation**. Its terms frame the service as health and fitness information for educational and entertainment purposes only, tell users not to rely on it as a substitute for professional advice, and then require users either to satisfy a PAR-Q-like set of health statements or get physician approval. Those statements expressly mention chest pain, dizziness, balance loss, joint or bone problems, blood-pressure or heart medication, and other reasons not to exercise. In support content, Future also uses "slow down" versus "stop" symptom lists rather than trying to diagnose the user.

Runna and MyFitnessPal show the classic **substitution warning** pattern: informational only, not a replacement for professional medical advice, diagnosis, or treatment, and users should never disregard or delay seeking medical care because of the service. That language is old-fashioned, but it still matters because it reinforces that the product is not the endpoint for medical judgment.

Caliber, Fitbod, and Freeletics show how apps near the training line usually handle pain and injury content in public materials: they keep the content educational, explicitly say it is not medical advice, and direct users to a clinician when pain or injury is involved. Fitbod's public back-pain content goes further and says, in substance, that even when authored by a sports-medicine doctor, the author is not *your* doctor and you should consult your care team for diagnosis and treatment. That is a very deliberate refusal to cross into individualized care.

Headspace and Calm are useful analogies even though they are not training apps. They both live close to regulated territory and handle that by repeatedly saying the product does not provide medical advice or clinical treatment and is not a substitute for professional care. Calm's EMDR-inspired content is a particularly clean example: it says the material is inspired by a clinical technique but is not a replacement for clinical therapy and directs users to a mental-health professional for guidance.

Peloton and Apple show the public-facing **exercise-risk** pattern. Peloton's Strive Score page tells users to consult a doctor and consider underlying medical conditions before using the feature. Apple's watchOS safety language tells users to consult a physician if a medical condition could be affected and to stop if they feel faint, exhausted, or short of breath, while also saying exercise carries an inherent risk of injury. Both examples keep the language in **exercise safety** rather than diagnosis.

## What the public enforcement and litigation record actually shows

The single most on-point enforcement precedent is FDA's July 2025 warning letter to WHOOP. It matters for three reasons:

1. It shows FDA will look through "wellness" branding when the function itself has a strong medical meaning.
2. It shows that **disclaimers alone are not controlling**.
3. It shows that "measurement plus implication" can be enough: FDA did not accept WHOOP's attempt to keep the feature in wellness once the feature estimated a medical parameter and the surrounding claims implied condition-related significance.

If the product ever starts to look like it is identifying injury, dangerous exertional states, or clinically meaningful symptom patterns, that precedent becomes directly relevant.

The September 2025 FDA blood-pressure safety communication is also more relevant than it looks. FDA specifically warned that inaccurate alerts can delay treatment or produce unnecessary interventions. That matters because stop/seek-help prompts are safest when they are **simple, fixed safety messages**. Once they become algorithmic alerts based on user-specific interpreted data, they inherit the same regulatory concern: users may over-rely on the software for when to seek care or not seek care.

Outside the medical-device lane, connected-fitness companies still face classic product-safety exposure. The U.S. Consumer Product Safety Commission announced in 2023 that Peloton agreed to pay a $19 million civil penalty over reporting failures and distribution of recalled treadmills tied to entrapment hazards. That is not a software-as-medical-device precedent, but it is a useful corrective: even if the training app stays outside device regulation, you do **not** escape consumer-protection, negligence, advertising, or product-safety risk. "Not a medical device" is not the same as "legally safe."

What I did **not** find in the public record is a clean, published regulator decision saying that a consumer app with the exact trio of features—pain-triggered session modification, deterministic load prescription, and symptom-triggered stop prompts—was affirmatively accepted as general wellness. That absence should not be romanticized. It does not prove the model is safe. It just means the best evidence comes from **official boundary examples and adjacent enforcement** rather than from a public blessing of the exact feature set.

## Verdict, copy bank, phrases to avoid, and when counsel is actually needed

The most honest single verdict:

**Likely-safe** if the app stays in **general training optimization**: it adjusts workout difficulty for performance goals, uses pain/discomfort only as a non-clinical readiness input, offers users easy ways to override or skip, keeps symptom prompts as generic "stop and seek care" safety advice, avoids any injury/disease claims, and avoids any suggestion that the software is prescribing treatment or making a clinical judgment.

**Gray-area** if the app automatically reroutes based on pain, uses deterministic hold/deload logic tied to symptom inputs, or names flows in ways that imply tissue protection, injury management, recovery from pathology, or medically safe progression. This is especially true if the app moves beyond "modify today's workout" into "follow this recovery plan." In the U.S. and Canada this can still be managed with disciplined intended-use drafting; in the EU, UK, and Australia it becomes materially harder.

**Likely-unsafe** if the app claims to identify, assess, diagnose, prevent, monitor, treat, or alleviate injury or pain; recommends personalised rehab or return-to-sport protocols; uses interpreted symptom or physiological data to infer a likely medical condition; or presents alerts as medical-event detection or treatment advice. That is where the product stops being "a training app with safety copy" and starts looking like SaMD.

### Terms / onboarding copy bank

- "**This app provides fitness and wellness information for general training purposes only. It is not medical advice, and it is not a substitute for professional medical diagnosis, treatment, or care.**" (Pattern consistent with WHOOP, Future, Runna, MyFitnessPal, Headspace, Calm.)
- "**Consult a qualified healthcare professional before starting a new exercise program, especially if you have an existing medical condition, a recent injury, chest pain, dizziness, loss of balance, bone or joint problems, or concerns about exercise safety.**" (Pattern from Future, Peloton Strive Score, Apple watchOS safety.)
- "**The app is not intended for emergencies or urgent medical situations. If you think you may be having a medical emergency, contact emergency services immediately.**" (Pattern from WHOOP legal copy.)

### Pain-gate copy bank

- "**Reported pain or discomfort today? We can switch you to a lower-load or lower-impact training option, or you can skip training today.**" (Keeps the function in the language of workout choice, not treatment.)
- "**This adjustment is a training preference feature. It does not diagnose injuries or recommend medical treatment. If pain is severe, new, worsening, or persistent, stop exercising and contact a qualified clinician.**" (First sentence = defensive move; second sentence is consistent with how WHOOP, Runna, MyFitnessPal, Fitbod, Freeletics, Headspace, and Calm all refuse substitution for medical care.)

### Stop / seek-help copy bank

- "**Stop this session now if you feel chest pain, faintness, dizziness, unusual breathlessness, or feel unwell enough that continuing exercise does not seem safe.**" (Aligns with Future's public stop-exercising list and Apple's exercise safety warnings.)
- "**If symptoms are severe, rapidly worsening, or you think you may need urgent care, seek medical help immediately.**" (Fits MHRA's referral-advice pattern and Health Canada's triage examples without crossing into diagnosis.)

### Phrases to actively avoid

The phrases that convert a training feature into a therapeutic or diagnostic feature by implication:

- "prescribe," "dose," "therapy," "rehab," "treat pain," "recover your injury,"
- "return-to-play protocol," "medically safe progression,"
- "detect," "screen," "red flag,"
- "clinical grade," "prevent injury,"
- "manage a condition," "monitor your condition,"
- "our algorithm knows when you should seek care."

The rationale is straightforward: official guidance across the FDA, EU, MHRA, Health Canada, and TGA repeatedly ties device status to diagnosis, treatment, alleviation, prevention, clinical decision-making, or specific treatment recommendations, and recent FDA enforcement shows those implications can overwhelm disclaimers.

### When legal counsel is actually needed

Escalate to counsel if any of these are considered:

- market for injury recovery, pain relief, rehab, return to sport, post-op recovery, chronic-condition management, pregnancy/postpartum risk management, or any use case that is recognizably clinical
- add clinician dashboards or intend use in clinical practice
- start interpreting physiological signals or symptom patterns to make user-specific medical inferences
- switch from "suggested training adjustment" to "specific treatment recommendation"
- introduce medically charged metrics such as blood pressure or ECG-like analyses
- plan to keep one globally uniform product while selling in the EU/UK/Australia
- want to say the app is clinically proven, safer, or effective for pain/injury outcomes

Those are not drafting tweaks. They are intended-purpose decisions.

The hard truth is that there is **no strong public precedent** showing that the exact triad of **pain-gated session modification + deterministic load prescription + symptom-triggered stop prompts** has already been accepted by regulators as ordinary general wellness software. The closest successful public patterns all do at least one of three things: they keep the logic firmly in performance coaching, they keep symptom language as generic safety signposting, or they split out more medical-looking features into separately governed modules. If the product is to stay on the wellness side, that is the playbook.

## Raw citations as provided by the source

Inline citation markers from the original synthesis (tool-produced reference IDs, preserved here for provenance):

- FDA updated General Wellness guidance (Jan 6, 2026): citeturn31search9, citeturn42view0
- FDA SaMD / patient-specific treatment recommendations boundary: citeturn30view4, citeturn30view2
- FDA WHOOP July 2025 warning letter: citeturn33view0
- FDA Sept 2025 blood-pressure safety communication: citeturn33view1
- EU MDCG 2019-11 (June 2025 revision): citeturn10view0, citeturn25view6, citeturn25view1
- UK MHRA software guidance: citeturn14view1, citeturn15view0, citeturn14view3, citeturn12view1, citeturn26search0, citeturn26search14
- Health Canada SaMD framework + exclusions: citeturn16search3, citeturn27view0, citeturn28view0, citeturn17view1, citeturn18view0
- Australia TGA 2026 guidance + advertising guidance: citeturn20view0, citeturn22view0, citeturn23view0, citeturn20view2, citeturn20view3
- WHOOP terms / Heart Screener / Health Monitor / Blood Pressure Insights: citeturn34search0, citeturn34search4, citeturn34search7, citeturn34search8
- Future terms + pre-participation gating + stop/slow list: citeturn40search5, citeturn40search2
- Runna / MyFitnessPal substitution warnings: citeturn38search2, citeturn38search5, citeturn37search2
- Caliber / Fitbod / Freeletics education + referral patterns: citeturn40search1, citeturn37search3, citeturn37search15, citeturn37search19, citeturn40search0, citeturn40search6, citeturn40search7
- Headspace / Calm medical-advice disclaimers: citeturn37search0, citeturn37search5, citeturn37search9
- Peloton Strive Score / Apple watchOS exercise safety: citeturn39search0, citeturn38search0
- CPSC Peloton 2023 $19M civil penalty: citeturn41search4
