import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Brandmark } from '../components/Brandmark'
import { HomePrimaryCard } from '../components/HomePrimaryCard'
import { HomeSecondaryRow } from '../components/HomeSecondaryRow'
import { SoftBlockModal } from '../components/SoftBlockModal'
import { UpdatePrompt } from '../components/UpdatePrompt'
import { Button } from '../components/ui'
import { selectPrimaryCard, selectSecondaryRows } from '../domain/homePriority'
import type {
  PrimaryVariant,
  SecondaryRow,
} from '../domain/homePriority'
import type { SessionDraft } from '../db'
import { useAppRegisterSW } from '../lib/pwa-register'
import { isSchemaBlocked } from '../lib/schema-blocked'
import { routes } from '../routes'
import { buildDraftFromCompletedBlocks } from '../domain/sessionBuilder'
import {
  discardSession,
  expireStaleReviews,
  findPendingReview,
  findResumableSession,
  getCurrentDraft,
  getLastComplete,
  saveDraft,
  skipReview,
  type LastCompleteBundle,
  type PendingReview,
  type ResumableSession,
} from '../services/session'
import {
  markSoftBlockDismissed,
  readSoftBlockDismissed,
} from '../services/softBlock'

/**
 * C-4: Home screen with flat 4-row precedence.
 *
 * Four independent flags (resume / reviewPending / draft / lastComplete)
 * derived from parallel Dexie reads; a fifth state (new_user) is
 * derived from the absence of the other four. `selectPrimaryCard` +
 * `selectSecondaryRows` (domain/homePriority.ts) decide what renders.
 *
 * The soft-block modal (D-C1) intercepts non-review CTA taps when a
 * review is pending, unless the dismissal has been marked for this
 * execId via A7's `storageMeta.ux.softBlockDismissed.{execId}`. The
 * A7 helper's clearSoftBlockDismissed fires inside terminal-review
 * writers' A3 transactions (C-1), so storageMeta stays bounded.
 */

interface HomeFlags {
  resume: ResumableSession | null
  reviewPending: PendingReview | null
  draft: SessionDraft | null
  lastComplete: LastCompleteBundle | null
}

type HomeState =
  | { kind: 'loading' }
  | { kind: 'ready'; flags: HomeFlags }
  | { kind: 'error' }

type SoftBlockTarget = {
  pendingReview: PendingReview
  innerAction: () => void
} | null

export function HomeScreen() {
  const navigate = useNavigate()
  const [state, setState] = useState<HomeState>({ kind: 'loading' })
  const acting = useRef(false)
  const [confirmingSkip, setConfirmingSkip] = useState(false)
  const [softBlockTarget, setSoftBlockTarget] =
    useState<SoftBlockTarget>(null)
  const { needRefresh, updateApp } = useAppRegisterSW()

  // Mount counter so the error-state "Try again" can trigger a fresh
  // resolve by bumping the counter; the mount effect re-runs.
  const [resolveVersion, setResolveVersion] = useState(0)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const resume = await findResumableSession()
        if (cancelled) return
        if (resume) {
          // Resume overrides everything per precedence row 1; don't
          // bother fetching the rest.
          setState({
            kind: 'ready',
            flags: {
              resume,
              reviewPending: null,
              draft: null,
              lastComplete: null,
            },
          })
          return
        }

        // V0B-31 / D120 (C-1 Unit 1 rel-6 fix): auto-finalize past-cap
        // sessions before resolving the rest of Home state so stale
        // records fall through to LastComplete correctly.
        await expireStaleReviews()
        if (cancelled) return

        const [reviewPending, draft, lastComplete] = await Promise.all([
          findPendingReview(),
          getCurrentDraft(),
          getLastComplete(),
        ])
        if (cancelled) return

        setState({
          kind: 'ready',
          flags: { resume: null, reviewPending, draft, lastComplete },
        })
      } catch {
        if (cancelled) return
        // SchemaBlockedOverlay owns the UI during a concurrent-tab
        // upgrade.
        if (isSchemaBlocked()) return
        setState({ kind: 'error' })
      }
    })()
    return () => {
      cancelled = true
    }
  }, [resolveVersion])

  // --- action handlers ---

  const handleResume = useCallback(() => {
    if (state.kind !== 'ready' || !state.flags.resume) return
    navigate(routes.run(state.flags.resume.execution.id))
  }, [navigate, state])

  const handleDiscard = useCallback(async () => {
    if (state.kind !== 'ready' || !state.flags.resume || acting.current) return
    acting.current = true
    try {
      const execId = state.flags.resume.execution.id
      await discardSession(state.flags.resume.execution)
      navigate(routes.review(execId))
    } catch {
      acting.current = false
      if (isSchemaBlocked()) return
      setState({ kind: 'error' })
    }
  }, [navigate, state])

  // First-tap: flips the card into the two-step confirm row.
  const handleRequestSkip = useCallback(() => {
    if (state.kind !== 'ready' || !state.flags.reviewPending) return
    setConfirmingSkip(true)
  }, [state])

  // Second-tap: actually writes the skipped stub and routes to /complete.
  const handleConfirmSkip = useCallback(async () => {
    if (
      state.kind !== 'ready' ||
      !state.flags.reviewPending ||
      acting.current
    ) {
      return
    }
    acting.current = true
    try {
      const execId = state.flags.reviewPending.executionId
      await skipReview(execId)
      acting.current = false
      setConfirmingSkip(false)
      navigate(routes.complete(execId))
    } catch {
      acting.current = false
      if (isSchemaBlocked()) return
      setState({ kind: 'error' })
    }
  }, [navigate, state])

  const handleCancelSkip = useCallback(() => {
    setConfirmingSkip(false)
  }, [])

  const handleFinishReview = useCallback(() => {
    if (state.kind !== 'ready' || !state.flags.reviewPending) return
    navigate(routes.review(state.flags.reviewPending.executionId))
  }, [navigate, state])

  const handleStartWorkout = useCallback(
    () => navigate(routes.setup()),
    [navigate],
  )

  // --- soft-block interception + non-review CTA handlers ---
  //
  // All non-review Home CTAs pass through the D-C1 soft-block modal
  // when a review is pending AND the tester hasn't already dismissed it
  // for this execId. We memoize the intercepted handlers as a bundle so
  // React only rebuilds them when `state` (flags) or `navigate`
  // actually change — this also keeps `react-hooks/refs` happy (the
  // intercept factory closes over state, so calling it during render
  // inline triggers that rule).
  //
  // Phase F Unit 1 (2026-04-19) simplified the LastComplete CTA set:
  // - `Edit` + `Same as last time` cut; their wiring
  //   (`handleLastCompleteEdit` / `handleSameAsLast`) is gone.
  // - `Start a different session` is new: routes to fresh `/setup`
  //   (no `?from=repeat`, no pre-fill, no banner). Same target URL as
  //   NewUser Start, different user-facing label.
  //
  // C-5 wires the remaining repeat-path handlers:
  // - handleRepeat: /setup?from=repeat (with stale-context banner)
  // - handleRepeatWhatYouDid: partial draft from completed blocks
  const interceptedHandlers = useMemo(() => {
    const intercept = (inner: () => void | Promise<void>) => async () => {
      if (state.kind !== 'ready' || !state.flags.reviewPending) {
        await inner()
        return
      }
      try {
        const dismissed = await readSoftBlockDismissed(
          state.flags.reviewPending.executionId,
        )
        if (dismissed) {
          await inner()
          return
        }
      } catch {
        if (isSchemaBlocked()) return
        // On non-schema-blocked error, intercept conservatively so the
        // tester sees the modal rather than silently proceeding.
      }
      setSoftBlockTarget({
        pendingReview: state.flags.reviewPending,
        innerAction: () => {
          void inner()
        },
      })
    }
    return {
      // NewUser lands on Home post-onboarding (FirstOpenGate routes
      // pre-onboarding testers to /onboarding/skill-level first). The
      // Start CTA enters the regular Setup flow, which applies the
      // persisted skill level during plan build.
      handleNewUserStart: intercept(() => navigate(routes.setup())),
      handleDraftStart: intercept(() => navigate(routes.safety())),
      handleDraftEdit: intercept(() => navigate(routes.setup())),
      handleRepeat: intercept(() =>
        navigate(`${routes.setup()}?from=repeat`),
      ),
      // Phase F Unit 1: LastComplete's sole secondary. Fresh setup —
      // no `?from=repeat`, no pre-fill, no banner — for the tester
      // whose answer to "same as last time?" is *no*. The intercept
      // ensures review_pending still fires the soft-block modal.
      handleStartDifferentSession: intercept(() =>
        navigate(routes.setup()),
      ),
      // C-5 Unit 3: ended-early secondary CTA. Builds a partial draft
      // from only the blocks that actually completed and routes to
      // /safety. Uses the state-captured `lastComplete` bundle so we
      // don't re-query Dexie for consistency with the render.
      handleRepeatWhatYouDid: intercept(async () => {
        if (state.kind !== 'ready' || !state.flags.lastComplete) return
        try {
          const draft = buildDraftFromCompletedBlocks(
            state.flags.lastComplete.log,
            state.flags.lastComplete.plan,
          )
          if (!draft) {
            // Nothing worth repeating — defensive fallback to the
            // pre-filled Setup path so the tester can adjust.
            navigate(`${routes.setup()}?from=repeat`)
            return
          }
          await saveDraft(draft)
          navigate(routes.safety())
        } catch (err) {
          if (isSchemaBlocked()) return
          console.error('Repeat-what-you-did failed:', err)
          navigate(`${routes.setup()}?from=repeat`)
        }
      }),
    }
  }, [navigate, state])

  const handleSoftBlockFinish = useCallback(() => {
    const t = softBlockTarget
    setSoftBlockTarget(null)
    if (!t) return
    navigate(routes.review(t.pendingReview.executionId))
  }, [navigate, softBlockTarget])

  const handleSoftBlockSkipAndContinue = useCallback(async () => {
    const t = softBlockTarget
    if (!t) return
    try {
      await markSoftBlockDismissed(t.pendingReview.executionId)
    } catch (err) {
      if (!isSchemaBlocked()) {
        console.error('softBlock mark failed:', err)
      }
    }
    setSoftBlockTarget(null)
    t.innerAction()
  }, [softBlockTarget])

  const handleSoftBlockClose = useCallback(() => {
    setSoftBlockTarget(null)
  }, [])

  // --- render ---

  if (state.kind === 'loading') {
    return (
      <div className="mx-auto flex w-full max-w-[390px] flex-col items-center gap-6 pt-16">
        <Brandmark size={56} />
        <p className="text-text-secondary">Loading...</p>
      </div>
    )
  }

  if (state.kind === 'error') {
    return (
      <div className="mx-auto flex w-full max-w-[390px] flex-col items-center gap-6 pt-16">
        <Brandmark size={56} />
        <p className="text-text-secondary">Something went wrong</p>
        <Button
          variant="ghost"
          onClick={() => {
            setState({ kind: 'loading' })
            setResolveVersion((v) => v + 1)
          }}
        >
          Try again
        </Button>
      </div>
    )
  }

  const { flags } = state
  const flagSummary = {
    resume: flags.resume !== null,
    reviewPending: flags.reviewPending !== null,
    draft: flags.draft !== null,
    lastComplete: flags.lastComplete !== null,
  }
  const primary: PrimaryVariant = selectPrimaryCard(flagSummary)
  const secondary: SecondaryRow[] = selectSecondaryRows(flagSummary)

  return (
    <div className="mx-auto flex w-full max-w-[390px] flex-col gap-8 pb-12 pt-2">
      {/* App-bar-scale brand row: inline icon + wordmark, subtle so the
          primary card carries the visual weight. Pre-polish pass this
          was a centered 4xl emoji + bold 2xl title that read like a
          launch splash on every Home render — out of place once a
          tester has seeded data and the primary card is the hero.
          Phase F1 (2026-04-19): slightly more top padding so the
          header doesn't feel crowded against the primary card below. */}
      <header className="flex items-center gap-2 pt-4">
        <Brandmark size={28} />
        <h1 className="text-base font-semibold tracking-tight text-text-primary">
          Volley Drills
        </h1>
      </header>

      <UpdatePrompt needRefresh={needRefresh} onUpdate={updateApp} />

      {renderPrimary(primary, flags, {
        handleResume,
        handleDiscard,
        handleFinishReview,
        handleRequestSkip,
        handleConfirmSkip,
        handleCancelSkip,
        confirmingSkip,
        ...interceptedHandlers,
      })}

      {/* Phase F1 (2026-04-19): secondary rows used to render as a
          flex-col of independent bordered cards, which competed with
          the primary card for visual weight. They now sit inside a
          single calmer container grouped by a hairline divider, so
          the Home screen reads as "one focal card, one supporting
          cluster" instead of a flat stack of competing mini-cards.
          Variant API unchanged; HomeSecondaryRow flattens its own
          surface to match. */}
      {secondary.length > 0 && (
        <ul
          role="list"
          aria-label="Other active actions"
          className="divide-y divide-text-primary/5 overflow-hidden rounded-[16px] bg-bg-primary shadow-sm ring-1 ring-text-primary/5"
        >
          {secondary.map((row) =>
            renderSecondary(row, flags, {
              handleFinishReview,
              handleDraftOpen: interceptedHandlers.handleDraftStart,
              handleRepeat: interceptedHandlers.handleRepeat,
            }),
          )}
        </ul>
      )}

      {flags.resume && (
        <section className="mt-4 flex flex-col gap-4">
          <Button
            variant="outline"
            fullWidth
            onClick={handleStartWorkout}
          >
            Start New Workout
          </Button>
        </section>
      )}

      {softBlockTarget && (
        <SoftBlockModal
          pendingReview={softBlockTarget.pendingReview}
          onFinish={handleSoftBlockFinish}
          onSkipAndContinue={() => void handleSoftBlockSkipAndContinue()}
          onClose={handleSoftBlockClose}
        />
      )}

      <footer className="mt-auto flex flex-col items-center gap-1 text-center text-xs text-text-secondary">
        <Link
          to={routes.settings()}
          className="inline-flex min-h-[44px] items-center px-2 underline underline-offset-2"
        >
          Settings
        </Link>
        <p>Your data stays on this device</p>
      </footer>
    </div>
  )
}

// --- render helpers (extracted for readability) ---

interface PrimaryHandlers {
  handleResume: () => void
  handleDiscard: () => void
  handleFinishReview: () => void
  handleRequestSkip: () => void
  handleConfirmSkip: () => void
  handleCancelSkip: () => void
  confirmingSkip: boolean
  handleDraftStart: () => void
  handleDraftEdit: () => void
  handleRepeat: () => void
  handleRepeatWhatYouDid: () => void
  /**
   * Phase F Unit 1 (2026-04-19): replaces the pre-Phase-F
   * `handleSameAsLast` + `handleLastCompleteEdit` pair. Routes to fresh
   * `/setup` (no pre-fill, no banner) — the "today is different" path
   * on the LastComplete card.
   */
  handleStartDifferentSession: () => void
  handleNewUserStart: () => void
}

function renderPrimary(
  primary: PrimaryVariant,
  flags: HomeFlags,
  h: PrimaryHandlers,
) {
  switch (primary) {
    case 'resume':
      if (!flags.resume) return null
      return (
        <HomePrimaryCard
          variant="resume"
          data={flags.resume}
          onResume={h.handleResume}
          onDiscard={h.handleDiscard}
        />
      )
    case 'review_pending':
      if (!flags.reviewPending) return null
      return (
        <HomePrimaryCard
          variant="review_pending"
          data={flags.reviewPending}
          confirmingSkip={h.confirmingSkip}
          onFinish={h.handleFinishReview}
          onSkip={h.handleRequestSkip}
          onConfirmSkip={h.handleConfirmSkip}
          onCancelSkip={h.handleCancelSkip}
        />
      )
    case 'draft':
      if (!flags.draft) return null
      return (
        <HomePrimaryCard
          variant="draft"
          data={flags.draft}
          onStart={h.handleDraftStart}
          onEdit={h.handleDraftEdit}
        />
      )
    case 'last_complete':
      if (!flags.lastComplete) return null
      return (
        <HomePrimaryCard
          variant="last_complete"
          data={flags.lastComplete}
          onRepeat={h.handleRepeat}
          onStartDifferent={h.handleStartDifferentSession}
          onRepeatWhatYouDid={
            flags.lastComplete.log.status === 'ended_early'
              ? h.handleRepeatWhatYouDid
              : undefined
          }
        />
      )
    case 'new_user':
      return <HomePrimaryCard variant="new_user" onStart={h.handleNewUserStart} />
    default: {
      const _exhaustive: never = primary
      throw new Error(`Unhandled primary variant: ${String(_exhaustive)}`)
    }
  }
}

interface SecondaryHandlers {
  handleFinishReview: () => void
  handleDraftOpen: () => void
  handleRepeat: () => void
}

function renderSecondary(
  row: SecondaryRow,
  flags: HomeFlags,
  h: SecondaryHandlers,
) {
  switch (row.kind) {
    case 'review_pending_advisory':
      if (!flags.reviewPending) return null
      return (
        <HomeSecondaryRow
          key="review_pending"
          variant="review_pending_advisory"
          data={flags.reviewPending}
          onFinish={h.handleFinishReview}
        />
      )
    case 'draft':
      if (!flags.draft) return null
      return (
        <HomeSecondaryRow
          key="draft"
          variant="draft"
          data={flags.draft}
          onOpen={h.handleDraftOpen}
        />
      )
    case 'last_complete':
      if (!flags.lastComplete) return null
      return (
        <HomeSecondaryRow
          key="last_complete"
          variant="last_complete"
          data={flags.lastComplete}
          onRepeat={h.handleRepeat}
        />
      )
    default: {
      const _exhaustive: never = row
      throw new Error(`Unhandled secondary row: ${String(_exhaustive)}`)
    }
  }
}
