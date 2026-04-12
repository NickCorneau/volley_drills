# Executive Summary

This Product Requirements Document (PRD) outlines a personal 'coach-yourself' beach volleyball app designed for non-professional users, including amateurs and recreational players training solo or in small groups without certified coaches. The vision is to provide a comprehensive tool that guides users from setting goals (e.g., improve serving, better side-outs) to executing structured, courtside sessions and receiving actionable feedback. The target v1 persona is the recreational adult player (18-45) who trains 1-3 times a week and struggles with unstructured practice and measuring progress. Core features include an AI-driven plan generator that creates 6-8 week programs, a library of evidence-based drills suitable for minimal equipment, a 'courtside mode' UX for easy use during practice, and a system for tracking measurable outcomes like serve accuracy without sensors. The strategic goal is to launch a phased MVP focusing on core serving, passing, and setting drills, with clear safety guardrails. Monetization will follow a hybrid freemium-to-subscription model, addressing the specific needs and budget of amateur players.

# V1 Target Persona

## Persona Name

Recreational Adult Beach Player (Beginner to Intermediate)

## Demographics

Ages 18–45, playing at a Beginner to Intermediate level. They typically train 1–3 times per week and have limited equipment, such as 1–2 balls and cones or towels. They often practice without a fixed partner or a certified coach.

## Motivations

Primary motivations are skill improvement and increased confidence for casual play. Specific goals include wanting to 'side-out better,' 'serve more consistently,' 'stop shanking passes,' get back in shape, and feel confident playing in local leagues or pick-up games.

## Frustrations

Key pain points include a lack of knowledge on what to practice, leading to unstructured sessions. They struggle to measure progress, experience low motivation between games, and face challenges with inconsistent partners and limited available time for training.

# End To End User Workflow

The complete user journey within the app begins with an onboarding process where the user selects one primary and one secondary seasonal goal, such as 'improve serve accuracy' and 'first-ball side-out'. Based on these goals, the app proposes a 6-8 week training plan with a frequency of 1-3 sessions per week. The app then auto-generates these sessions, creating a mix of technical drills focused on skills like serving and passing, along with light conditioning, warm-up blocks, and mini-games, adapting drills for beach courts or at-home environments. During a session, the user enters 'Courtside mode,' which features a user-friendly interface with large text, one-tap drill cards, timers, rep counters, and short demo clips or GIFs for each exercise. This mode facilitates 'Quick capture' of performance data, allowing the user to log metrics like serve accuracy scores, pass quality on a 0-3 scale, set target hits, and subjective feedback such as Rate of Perceived Exertion (RPE) and soreness levels. After the session, the user receives an auto-generated summary that compares their metrics against their baseline and highlights achievements through streaks and badges. The app also prompts for a brief reflection and allows for optional video uploads for self-review. The workflow culminates in a weekly review, which presents trend lines for key metrics like serve accuracy percentage and session adherence, and provides nudges to either increase the difficulty or deload for recovery.

# Drill Library And Data Model

## Drill Name

Serve Accuracy Test

## Skill Focus

Serve

## Player Count

Solo

## Instructions

Perform 10-20 serves towards a taped floor target or towel rings. Focus on a consistent toss, making contact at full extension, and finishing towards the target. Stop if shoulder pain occurs.

## Video Url

A short demo clip or looped GIF is provided in-app.

## Success Metric

Per-serve points, total/average score, and on/off target counts.

## Drill Name

Continuous Passing

## Skill Focus

Pass

## Player Count

Pair

## Instructions

Done in pairs, perform 2 sets of 10 repetitions per stance. Cues include maintaining a straight platform, a slight shoulder shrug, keeping ribs tucked, and passing the ball high enough for a hypothetical set.

## Video Url

A short demo clip or looped GIF is provided in-app.

## Success Metric

Percentage of passes that are 'settable'.

## Drill Name

6-Legged Monster

## Skill Focus

Pass

## Player Count

Pair

## Instructions

Perform 20-30 reps, mapping passes at 6 different court positions. Cues are to point shoulders to the target and use inside/outside shoulder angles depending on the pass.

## Video Url

A short demo clip or looped GIF is provided in-app.

## Success Metric

Left vs. right passing accuracy split.

## Drill Name

Passing Conditioning

## Skill Focus

Pass / Conditioning

## Player Count

Solo

## Instructions

Perform 3 sets of 30 seconds. The sequence is: pass twice, touch a designated line, and repeat.

## Video Url

A short demo clip or looped GIF is provided in-app.

## Success Metric

Number of touches without a shank; Rate of Perceived Exertion (RPE).

## Drill Name

Triangle Setting

## Skill Focus

Set

## Player Count

Small Group

## Instructions

In a group of 3-5 players, perform a catch, toss, pass, and set loop. Cues include keeping hips and shoulders square to the target, getting hands up early, and using legs to bend and extend.

## Video Url

A short demo clip or looped GIF is provided in-app.

## Success Metric

Percentage of sets that hit the target.

# Session Data Model

## Warm Up Details

Each session begins with a dynamic warm-up block. This phase includes light conditioning exercises designed to prepare the body for the technical drills that follow. The specific exercises and duration are auto-generated as part of the session plan.

## Skill Block Details

The core of the session consists of one or two 'technical' blocks. These blocks are comprised of skill-focused drills selected from the app's drill library, directly targeting the user's goals (e.g., serve accuracy, passing). Each drill includes instructions, video demos, and specific rep/time targets.

## Conditioning Details

Sessions conclude with a 'finisher' or conditioning block. This phase includes exercises for agility and stamina, such as brief alactic power elements like medicine ball throws or low-to-moderate intensity 'tempo' runs to build a conditioning base, as space and equipment allow.

## Cool Down Details

Following the main workout, a cool-down phase is recommended, especially on recovery-focused days. This would typically involve static stretching to improve flexibility and aid in muscle recovery, although specific stretches are not detailed in the provided plan.

# Skill Progression Framework

The framework for advancing users is a data-driven, AI-assisted system focused on quality of execution over sheer volume. Progression from fundamental techniques (e.g., basic passing posture) to more advanced skills (e.g., jump serving) is based on the user's consistency and performance in drills. The app's AI suggests progressions when weekly reviews show positive trends in metrics like serve accuracy, pass quality percentage, and session adherence. The primary method of increasing difficulty is by making the drills more challenging—for example, by shrinking target sizes, increasing serving distance, or using more difficult toss positions. Only after demonstrating proficiency with these harder variations does the app suggest increasing volume (reps or time). This progression is bounded by safety guardrails; the AI caps weekly increases in training load and will prompt for rest or recovery if the user flags high levels of soreness or RPE. The system is transparent, explaining why a new drill or progression is being suggested, and allows the user to manually override or maintain their current level.

# Practical Periodization Model

## Training Frequency

1–3 skill-focused sessions per week on the court, supplemented with 2 days per week of total-body resistance training using bands or bodyweight, which can be done at home. Volleyball-specific days should prioritize skill development.

## Session Focus Balance

The balance of session focus is dependent on the user's weekly availability:

- 1 session/week: A combined session with a primary technical emphasis (e.g., serving or receiving), a mini-game, and light conditioning. The skill focus should be alternated weekly.
- 2 sessions/week: Split focus across two days. For example, Day A focuses on serving and receiving, while Day B focuses on setting and attack patterning. The primary emphasis should be rotated every 2–3 weeks.
- 3 sessions/week: Two dedicated technical days (e.g., Day 1 for serve/receive, Day 2 for set/attack) plus one lighter day focused on patterning, conditioning, and recovery.

## Recovery Protocol

Recovery is integrated through multiple mechanisms. For users training three times a week, one session is designated as a lighter day for patterning, conditioning, and recovery. Additionally, the AI system is designed to prompt for rest and recovery if a user flags high levels of soreness or a high Rating of Perceived Exertion (RPE) after a session. Progression is also managed by increasing difficulty (e.g., smaller targets) before increasing volume to prevent overtraining.

# Ai Coaching Engine Guidance

The AI coaching engine is designed to act as a personal coach for amateur players. Its logic follows the entire user journey. First, during onboarding, it helps the user select one primary and one secondary seasonal goal (e.g., improve serve accuracy). Based on these goals and the user's available time (1-3 sessions/week), the AI auto-generates a personalized 6–8 week training plan. Each session plan is structured with a mix of technical drills, light conditioning/warm-up blocks, and mini-games. The AI selects appropriate drills from a curated library, provides concise coaching cues and demo clips for each, and suggests progressions (e.g., smaller targets, increased distance) based on performance. It also provides motivational feedback through gamified elements like streaks and badges, and presents weekly reviews with trend lines for key metrics (e.g., serve accuracy, pass quality) to show progress. The AI's scope is strictly limited to plan assembly, drill selection, and progress tracking within safe, preset bounds; it does not provide medical advice or return-to-play directives.

# Ai Safety Guardrails

## Injury Risk Disclaimer

The app will surface a clear, upfront disclaimer to the user, such as 'stop if pain beyond normal soreness,' and will include a link directing them to seek professional medical advice if they have health concerns. The AI will not provide medical diagnoses or return-to-play directives.

## Volume And Intensity Caps

The system has built-in, preset safety bounds to prevent overuse injuries. It will cap the rate of weekly increases in training volume and load, such as limiting the progression of reps and time per skill. The AI prioritizes increasing difficulty (e.g., smaller targets) before adding significant volume.

## Automated Rest Recommendations

The AI includes logic to automatically prompt the user with rest and recovery recommendations. This is triggered when the user logs a high Rating of Perceived Exertion (RPE) or high soreness levels following a training session.

## Proper Form Reminders

Each drill within the app is accompanied by 3–5 concise coaching cues that serve as contextual reminders for maintaining proper form. The AI can surface these cues during the workout to help the user focus on correct technique, for example, 'hips/shoulders square' for setting or 'straight platform' for passing.

# Injury Prevention Recommendations

## Program Name

Integrated Volleyball Conditioning and Prevention Protocol

## Key Components

The program is built from several evidence-based components integrated into the user's weekly schedule. The core components are: 1) Warm-up blocks included at the start of every session. 2) Strength Training: A minimum of two days per week of total-body resistance training using accessible equipment like elastic bands and bodyweight. 3) Conditioning: This includes brief, alactic power elements like medicine ball throws (e.g., underhand backward/forward) and low-to-moderate intensity 'tempo' runs to build an aerobic base.

## Implementation Guide

These components are integrated into the user's training plan as follows: A dedicated warm-up block starts every on-court session. The total-body resistance training should be performed on two separate days from the main volleyball skill sessions to ensure those days remain skill-focused. Conditioning elements like med-ball throws (e.g., 2-3 sets of 4-5 reps) and tempo runs are incorporated into the overall weekly plan as the user's schedule and available space allow, often as part of a finisher or on a lighter recovery day.

# Courtside Mobile Ux Recommendations

## Color And Contrast Guidelines

The app should utilize high-contrast drill cards and UI elements to ensure readability in bright outdoor conditions, such as on a sunny beach. This aligns with the PRD's specification for 'high-contrast drill cards' to combat glare.

## Touch Target Specifications

All interactive elements, especially buttons for logging reps or advancing drills like 'pass/fail tick buttons,' must be significantly oversized. The PRD recommends they be 'sized for sandy/sweaty hands,' which translates to a minimum functional size of at least 1cm x 1cm to ensure they can be accurately tapped during active training without frustration.

## Typography Guidelines

The app must use large, bold, and clear typography throughout the 'Courtside mode.' The PRD specifies 'large text/cues' on drill cards to ensure that instructions, timers, and rep counters are legible at a quick glance, minimizing the time the user spends looking at their screen.

## Interaction Design Principles

Interactions during a session must be simplified to the absolute minimum. The PRD emphasizes 'minimal taps,' a 'One “Next” button to advance drills,' and the ability to 'swipe to view cues.' This design philosophy avoids complex navigation and eliminates the need for typing, allowing the user to stay focused on their physical training.

# Gamification And Adherence Strategies

## Streaks Feature

The app will track consecutive days or weeks of completed training sessions to encourage consistent practice and habit formation. The PRD lists 'streaks' as a core feature for the MVP and notes the inclusion of a 'streak saver' perk to maintain motivation, a strategy proven effective by apps like Strava.

## Achievements And Badges

Users will be awarded digital badges for reaching specific milestones. The post-session summary in the PRD's workflow includes the presentation of 'streaks/badges' for accomplishments such as completing a certain number of drills, mastering a new skill, or finishing a multi-week program.

## Personal Bests Tracking

The app will track and highlight personal records to show progress over time. The workflow includes a 'post-session: auto-summary with metrics vs baseline' and a 'weekly review' that 'shows trend lines for serve accuracy, pass quality %.' This allows users to see and celebrate improvements against their own past performance.

## Community Challenges

The app will feature optional, time-based challenges that users can join. These are planned for version 1.5 ('community challenges') and as a monetization feature ('paid entry challenges'). These challenges aim to foster a sense of community and friendly competition among users, even if they are training solo.

# Skill And Consistency Metrics

## Accuracy Metric Definition

A self-reported scoring system for accuracy drills, most notably a 'Serve accuracy test block' based on a validated protocol. The user records their score for each serve based on where it lands in a predefined target area (e.g., using taped lines or towels). The citation mentions a target with scores ranging from 2 to 22 points, providing a concrete example of a 'score out of 22' system that can be implemented in a 'serve accuracy score sheet.'

## Completion Rate Tracking

The app will track adherence by measuring the number and percentage of planned sessions that the user actually completes. Section 8 of the PRD lists 'sessions_completed/week' as a key adherence metric to be tracked, providing a clear measure of the user's commitment to their training plan.

## Consistency Score

A score will be calculated to reflect the user's performance stability over time. For serving, the PRD explicitly suggests tracking 'consistency (SD across attempts),' which refers to the standard deviation of their accuracy scores. A lower standard deviation over time would indicate an improvement in consistency.

# Phased Mvp Roadmap

## Phase Name

MVP (0–3 months)

## Primary Goal

Launch the core product to validate the concept with the primary persona. This involves providing a minimal yet complete workflow from goal setting to plan generation, courtside execution, and session feedback to help players structure their training and see measurable progress.

## Key Features

Core features include: onboarding for goal selection, a 6–8 week plan generator focusing on serving, passing, and setting. It will contain 12–18 drill cards complete with cues and short video clips. The app will feature simple counters and timers, a specific serve accuracy score sheet, a post-session summary, and engagement mechanics like streaks and a weekly challenge. All assets will be available locally for offline use.

# Explicit Non Goals For Mvp

## Excluded Feature

Advanced video biomechanics

## Reason For Exclusion

This feature is technologically complex and resource-intensive, requiring advanced AI. Excluding it allows the team to focus on the core value proposition of structured drills and manual progress tracking for a faster time-to-market.

## Excluded Feature

Auto technique grading

## Reason For Exclusion

Similar to video biomechanics, automatic grading of a user's technique is a high-effort feature that is not critical for the initial MVP, which aims to provide guidance and structure rather than automated coaching feedback.

## Excluded Feature

Complex team scheduling

## Reason For Exclusion

The app's primary focus is on individual, pair, and small-group training. Complex scheduling features are outside the scope of the 'self-coach' concept and would add unnecessary complexity for the target persona.

## Excluded Feature

Indoor-specific systems

## Reason For Exclusion

To maintain a sharp focus on the beach volleyball niche and its specific environment and rules, features tailored for indoor volleyball are explicitly excluded from the MVP to avoid diluting the product's purpose.

# Monetization Strategy For Amateurs

## Freemium Model Details

The free tier will offer basic functionality to engage a large user base. This includes the initial onboarding process, access to a core training plan, a limited library of drills, manual logging capabilities, and engagement features like streaks and quests.

## Subscription Model Details

A 'Pro' subscription, available on a monthly or annual basis, will unlock the full potential of the app. Subscribers will gain access to the complete library of programs and drills, adaptive training plans that adjust to their progress, detailed analytics for features like the serve-test, data export and history, advanced quests, and access to community events.

## In App Purchase Details

One-time In-App Purchases (IAPs) will be offered for specific, high-value content. This includes themed 6–8 week specialized training plans (e.g., 'Serve Consistency,' 'Side-Out Boost'), entry into seasonal challenges that may have prizes, and credits for receiving remote feedback from a coach in future versions.

# Competitive Landscape Analysis

## App Name

Better at Beach

## Primary Focus

Structured Training Content & Drills

## Strengths

Provides high-quality, detailed beach volleyball practice drills with clear coaching cues for fundamental skills like serve receive. The content is well-regarded and aims to transform player technique from the ground up.

## Weaknesses Or Opportunity

The content appears to be presented as static articles or videos rather than an interactive, personalized training application. The opportunity is to integrate these proven drills into a dynamic app that generates personalized plans, tracks progress over time, and adapts to the user's performance.

## App Name

BeachUp

## Primary Focus

Community Building & Court Logistics

## Strengths

Features a large, established database of over 16,500 beach volleyball courts. It excels at connecting players, organizing teams, and creating matches, effectively solving the logistical challenges of the sport. It has a Pro subscription model, indicating user willingness to pay for convenience.

## Weaknesses Or Opportunity

The app's focus is entirely on community and game organization, with no features for personal skill development or structured training. The opportunity is to create a complementary training app that could potentially integrate with BeachUp (e.g., via deeplinks for court lookups) to provide a holistic solution for players who want to both play and improve.

# Equipment And Environment Considerations

The app is designed to be highly adaptable to the user's specific situation. It provides guidance and alternative drills for users with limited equipment (e.g., only one ball, using towels as targets instead of cones) and varying training spaces. The PRD specifies that the plan builder should surface 'fallback: solo/at-home variants' for drills that are typically done with a partner on a court. For example, the 'Passing Conditioning' drill has a 'solo variant.' Furthermore, the drill data model includes fields for 'equipment' and 'environment' ('sand, hard court, indoor space'), allowing the app to suggest appropriate drills. The plan also includes 'home-friendly' strength training suggestions using bodyweight or resistance bands, ensuring the app is a comprehensive training tool for the widest possible range of amateur players.