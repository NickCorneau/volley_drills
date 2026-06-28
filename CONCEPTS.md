# Concepts

Shared domain vocabulary for this project — entities, named processes, and status concepts with project-specific meaning. Seeded with core domain vocabulary, then accretes as ce-compound and ce-compound-refresh process learnings; direct edits are fine. Glossary only, not a spec or catch-all.

This first pass is scoped to the **run flow / session plan / stress ladder** area. Other areas of the app are not yet covered.

## Session plan

### Session plan
The ordered set of blocks that make up one training session a tester executes end to end.

### Block
One planned slot within a session plan — a single drill to run for a set duration, carrying its drill reference, duration, coaching cue, and setup instructions. Blocks have phase roles (warm up, technique, main skill, pressure, wrap, and recovery/support variants).

### Skill focus
The volleyball skill a drill or block **primarily** trains (e.g., passing, serving, setting). A drill can list more than one skill; its *primary* skill focus is the first one, and that primary is what run-flow labels and ladder lookups key on.
*Note:* distinct from the user-selected session focus — see Flagged ambiguities.

### Focus run
The stretch of consecutive blocks that share a skill focus. It is the unit across which the "show once, then recede" rule applies, and it can be interrupted: a support slot can resolve to a drill whose primary focus differs from its neighbors, so a focus can recur non-contiguously within one session.

## Run flow

### Run flow
The courtside sequence of beats an athlete moves through to execute one planned session, one block at a time.

### Beat
A single step in the run flow with one job — for example the read-before-you-run step (read the setup and decide) versus the live, one-cue execution step. The design intent is that each beat stays single-purpose.

### Beat contract
The rule that each athlete-facing field has exactly one full-weight **home** beat ("one home per field"), and is demoted or removed on the other beats so no field is read in full more than once across the run flow.

## Stress ladder

### Stress ladder
The per-skill progression of difficulty rungs a drill can sit on, used to advance or regress a tester over time.

### Rung
A single position on a stress ladder representing one difficulty level of a skill.

### Rung intent
The authored one-line "what this rung trains" technique-how note attached to a ladder rung. Its home beat is the block-opening Transition.

### Block-opening
The status of being the block where a skill focus **first appears** in a session. A focus run's rung intent is surfaced once at its block-opening and then recedes for the rest of that run; "first appears" means first across the whole session so far, not merely different from the immediately-previous block.

## Flagged ambiguities

- **"focus"** has been used for both the user-selected, session-wide focus and a block/drill's primary skill focus. These are distinct: slot selection can match any skill a drill lists, but run-flow gating and labels read the block's *primary* skill focus.
