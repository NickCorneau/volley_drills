---
id: vision
title: Product Vision
status: active
stage: planning
type: core
authority: product principles, strategic stance, local-first doctrine, non-goals, product promise
summary: "Product vision, principles, and strategic guardrails for the beach volleyball training OS."
last_updated: 2026-04-12
depends_on: []
---

# Vision

## Agent Quick Scan

- Use this doc for canonical product principles, strategic stance, local-first doctrine, non-goals, and product promise.
- If a proposal conflicts with a principle here, resolve that conflict before editing downstream docs.
- Not this doc for current scope, milestone acceptance, implementation detail, or decision status; use `docs/prd-foundation.md`, `docs/roadmap.md`, and `docs/decisions.md` for those.

## One-line vision

Build the personal training operating system for beach volleyball: a self-coached mobile workflow that turns real constraints into structured sessions, runs cleanly on court or at home, and improves week over week.

## End goal

An amateur beach player or pair can choose a goal, get a believable weekly plan, execute practices without chaos, and improve targeted skills over 6-8 weeks without needing a certified coach or juggling spreadsheets, notes apps, and drill PDFs. Over time, the same system should extend cleanly to coach-to-client workflows, coach-organizers, and small-group practices.

## Why this exists

Beach training often breaks down for non-pros because there is no real coach in the loop: planning is vague, execution is brittle in real conditions (wind, glare, changing partners, limited gear), and post-session learning is inconsistent. The product exists to make self-directed beach training operationally dependable, then close the loop with lightweight evidence.

## Strategic stance

- Start personal-first for self-coached amateurs and pairs.
- Design so coach-to-client and coach-organizer workflows can layer on without changing the core loop.
- Optimize for courtside mobile use and low-equipment fallback over desktop planning comfort.
- Make constraints first-class: partner availability, balls, court access, time, weather, and goals.
- Keep the loop tight: set goal -> generate session -> run -> review -> adapt.
- Keep measurement lightweight and high signal.
- Generative AI is excluded from the critical path; session generation and load planning must be fully deterministic.
- Local-first by default: the user's device is the primary copy of their training data. Cloud services, when added, are supporting peers for sync and backup, not the source of truth.

## Product principles (canonical)

These are the authoritative product principles. Other docs should reference this list, not redefine it.

- **P1.** If it is annoying on sand, it does not ship.
- **P2.** Structured objects beat unstructured chat for core workflows.
- **P3.** A few self-logged metrics collected consistently beat rich metrics collected rarely.
- **P4.** Session flow and believable progression beat drill volume.
- **P5.** Safety and load awareness are built in, not optional.
- **P6.** Every plan needs solo or pair fallback logic before it is trusted.
- **P7.** Human owns the final plan; session generation is built on strict, deterministic rules without generative AI.
- **P8.** Every recommendation is constraint-aware.
- **P9.** Feedback feeds forward into the next planning cycle.
- **P10.** Your training data lives on your device first. Starting, running, and reviewing a session must never depend on a strong network connection.

## Non-goals (for now)

- Social feed or creator content platform
- Generic fitness tracker with beach branding
- Full team operations suite (payments, broad admin tooling)
- Video-first analytics platform
- AI-generated training plans or open-ended coach chat
- Monetization mechanics in v1 (freemium/subscription design is captured in research for later)

## Product promise

Help me build and run better beach practices in minutes, then make the next session smarter using what actually happened. My training data stays on my device and belongs to me.

## For agents

- **Authoritative for**: product principles, strategic stance, local-first doctrine, non-goals, product promise.
- **Edit when**: a major strategic or principle change is agreed with the human.
- **Belongs elsewhere**: product scope and object model (`prd-foundation.md`), phase sequencing (`roadmap.md`), specific decisions (`decisions.md`).
- **Outranked by**: nothing. This is rank 1 in the source-of-truth hierarchy.
- **Key pattern**: the numbered product principles (1-10) are referenced by number throughout the repo. Do not renumber or reorder without checking downstream references.