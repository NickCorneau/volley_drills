/**
 * Adaptation model — the visible-adaptation primitives for M002.1
 * (thin-spine v1). Pure product types; no Dexie, no React.
 *
 * `AdaptationDelta` is the single value both the Home carry-forward
 * line (R4) and the review-end accept/keep verdict (R5) read. The v1
 * shape carries one arm — stress-direction — and is deliberately a
 * discriminated union so M002.2 can add ladder magnitude and M002.3 a
 * `{ kind: 'score'; ... }` arm as one-line additions without rewriting
 * the surfaces that consume it. This mirrors the `MetricCapture`
 * discriminator pattern (D134) in `model/capture.ts`.
 *
 * Per D150 (derive-don't-persist), the only persisted adaptation state
 * is the offered delta + the human accept/keep choice, recorded as
 * additive optional fields on `SessionReview` (see `model/review.ts`).
 * The delta itself is otherwise recomputed on demand by
 * `domain/adaptation/replayAdaptation.ts`.
 */
import type { SkillFocus } from '../types/drill'

/**
 * Stress-vocabulary direction for the v1 adaptation delta. `keep` is
 * the no-change state — `composeCarryForwardLine` renders nothing for
 * it, and the review-end verdict is not offered. Forward-compatible
 * with M002.2's stress ladders, which speak the same vocabulary.
 */
export type StressDirection = 'more' | 'less' | 'keep'

/**
 * The next-time adaptation delta for a focus. v1 ships only the
 * `stress` arm; the discriminator is the permanent shape.
 *
 * **Persisted + exported shape — change with migration care.** This type
 * is stored on `SessionReview.offeredDelta` (Dexie) and emitted in the
 * founder export (`ExportPayload`). Adding a new arm
 * (e.g. `{ kind: 'score'; ... }` in M002.3) is non-breaking. But do NOT
 * add a *required* field to the existing `stress` arm — every persisted
 * v1 delta would become shape-invalid for new readers within a single
 * schemaVersion. Add such fields as optional, or as a new arm.
 *
 * `focus` is deliberately the wider `SkillFocus` rather than the v1
 * `ScopedFocus` (pass/serve/set): `model/` cannot import the domain-layer
 * `ScopedFocus` under the inward layer rule. v1 only ever populates
 * scoped focuses; consumers carry a defensive non-scoped fallback.
 */
export type AdaptationDelta = { kind: 'stress'; focus: SkillFocus; direction: StressDirection }

/**
 * The human response to an offered delta (R5). Persisted on the
 * `SessionReview` row alongside the `offeredDelta` that prompted it.
 * `kept_original` is the zero-action default — doing nothing at review
 * end records this (or leaves the field absent), never a silent
 * reshuffle.
 */
export type VerdictChoice = 'accepted' | 'kept_original'
