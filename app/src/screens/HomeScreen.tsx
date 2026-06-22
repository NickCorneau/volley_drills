import { useCallback, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Brandmark } from '../components/Brandmark'
import { HomePrimaryCard } from '../components/HomePrimaryCard'
import { HomeSecondaryRow } from '../components/HomeSecondaryRow'
import { CarryForwardCell } from '../components/home/CarryForwardCell'
import { PlanForTodayLine } from '../components/home/PlanForTodayLine'
import { RecentSessionsList } from '../components/RecentSessionsList'
import { SkipReviewModal } from '../components/SkipReviewModal'
import { SoftBlockModal } from '../components/SoftBlockModal'
import { UpdatePrompt } from '../components/UpdatePrompt'
import { Button, ScreenShell } from '../components/ui'
import { selectPrimaryCard, selectSecondaryRows } from '../domain/homePriority'
import type { PrimaryVariant, SecondaryRow } from '../domain/homePriority'
import { useAppRegisterSW } from '../lib/pwa-register'
import { isSchemaBlocked } from '../lib/schema-blocked'
import { routes } from '../routes'
import { startPlanSession } from '../services/planLaunch'
import { discardSession, skipReview, type PendingReview } from '../services/session'
import { markSoftBlockDismissed, readSoftBlockDismissed } from '../services/softBlock'
import { useHomeScreenState, type HomeFlags } from './home/useHomeScreenState'

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

type SoftBlockTarget = {
  pendingReview: PendingReview
  innerAction: () => void
} | null

export function HomeScreen() {
  const navigate = useNavigate()
  const { state, setError, retry } = useHomeScreenState()
  const acting = useRef(false)
  const [confirmingSkip, setConfirmingSkip] = useState(false)
  const [softBlockTarget, setSoftBlockTarget] = useState<SoftBlockTarget>(null)
  const [nonReviewActionPending, setNonReviewActionPending] = useState(false)
  const { needRefresh, updateApp } = useAppRegisterSW()

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
      setError()
    }
  }, [navigate, setError, state])

  // First-tap: opens the SkipReviewModal (centered role=dialog) so the
  // destructive confirm matches the rest of the app's modal language
  // (`End session early?`, `ResumePrompt`, `SoftBlockModal`). The card
  // itself no longer hosts an inline two-step row (2026-04-27
  // reconciled-list R11).
  const handleRequestSkip = useCallback(() => {
    if (state.kind !== 'ready' || !state.flags.reviewPending) return
    setConfirmingSkip(true)
  }, [state])

  // Modal `Yes, skip` tap: actually writes the skipped stub and routes
  // to /complete.
  const handleConfirmSkip = useCallback(async () => {
    if (state.kind !== 'ready' || !state.flags.reviewPending || acting.current) {
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
      setError()
    }
  }, [navigate, setError, state])

  const handleCancelSkip = useCallback(() => {
    setConfirmingSkip(false)
  }, [])

  const handleFinishReview = useCallback(() => {
    if (state.kind !== 'ready' || !state.flags.reviewPending) return
    navigate(routes.review(state.flags.reviewPending.executionId))
  }, [navigate, state])

  const handleStartSession = useCallback(() => navigate(routes.setup()), [navigate])

  // --- soft-block interception + non-review CTA handlers ---
  //
  // All non-review Home CTAs pass through the D-C1 soft-block modal
  // when a review is pending AND the tester hasn't already dismissed it
  // for this execId. We memoize the intercepted handlers as a bundle so
  // React only rebuilds them when `state` (flags) or `navigate`
  // actually change - this also keeps `react-hooks/refs` happy (the
  // intercept factory closes over state, so calling it during render
  // inline triggers that rule).
  //
  // D158 (2026-06-12): the Repeat affordances (one-tap full repeat,
  // ended-early subset repeat) were retired after seven unused weeks
  // of founder-use mode — Setup's `getLastContext()` chip prefill plus
  // the focal plan-launch CTA cover the same intents. `Start a
  // different session` is the single remaining escape hatch: fresh
  // `/setup` (pre-filled physical chips, no banner), rendered as a
  // page-level link below the focal card rather than inside it.
  const interceptedHandlers = useMemo(() => {
    const beginNonReviewAction = () => {
      if (nonReviewActionPending) return false
      setNonReviewActionPending(true)
      return true
    }
    const intercept = (inner: () => void | Promise<void>) => async () => {
      if (state.kind !== 'ready' || !state.flags.reviewPending) {
        await inner()
        return
      }
      try {
        const dismissed = await readSoftBlockDismissed(state.flags.reviewPending.executionId)
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
      handleNewUserStart: intercept(() => {
        if (!beginNonReviewAction()) return
        navigate(routes.setup())
      }),
      handleDraftStart: intercept(() => {
        if (!beginNonReviewAction()) return
        navigate(routes.safety())
      }),
      handleDraftEdit: intercept(() => {
        if (!beginNonReviewAction()) return
        navigate(routes.setup(), { state: { editDraft: true } })
      }),
      // Home-coherence: the focal action on the LastComplete card. Starts
      // a session steered to the plan's next focus (staleness head),
      // reusing the last session's physical conditions, and routes
      // through the Setup -> Safety spine. Falls back to a fresh Setup
      // when there is no prior context to reuse or assembly fails. The
      // intercept keeps review_pending firing the soft-block modal.
      handleStartPlan: intercept(async () => {
        if (state.kind !== 'ready' || !state.flags.lastComplete || !state.flags.plan) return
        if (!beginNonReviewAction()) return
        try {
          const started = await startPlanSession({
            priorContext: state.flags.lastComplete.plan.context ?? null,
            nextFocus: state.flags.plan.nextFocus,
          })
          navigate(started ? routes.safety() : routes.setup())
        } catch (err) {
          if (isSchemaBlocked()) {
            setNonReviewActionPending(false)
            return
          }
          console.error('Start plan session failed:', err)
          navigate(routes.setup())
        }
      }),
      // Phase F Unit 1 (2026-04-19): fresh setup (physical chips
      // pre-filled, no banner) for the tester whose answer to "same as
      // last time?" is *no*. D158: rendered by HomeScreen as a
      // page-level link below the focal cluster, no longer a card prop.
      // The intercept keeps the review_pending soft-block contract.
      handleStartDifferentSession: intercept(() => {
        if (!beginNonReviewAction()) return
        navigate(routes.setup())
      }),
    }
  }, [navigate, nonReviewActionPending, state])

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
        <p className="text-text-secondary">Loading…</p>
      </div>
    )
  }

  if (state.kind === 'error') {
    return (
      <div className="mx-auto flex w-full max-w-[390px] flex-col items-center gap-6 pt-16">
        <Brandmark size={56} />
        <p className="text-text-secondary">Something went wrong</p>
        <Button variant="ghost" onClick={retry}>
          Try again
        </Button>
      </div>
    )
  }

  // 2026-04-22 iPhone-viewport layout pass: moved to `ScreenShell` so
  // the brand row stays fixed at the top, the primary/secondary/recent
  // cluster scrolls in the body when needed (tester with a Draft + a
  // review-pending advisory + recent-sessions-list can otherwise run
  // out of 100dvh on a 390 × 844 iPhone), and the Settings link +
  // data-locality line pin to the footer so the tester never loses
  // the data-promise footer when they reach the bottom of the list.

  const { flags } = state
  const flagSummary = {
    resume: flags.resume !== null,
    reviewPending: flags.reviewPending !== null,
    draft: flags.draft !== null,
    lastComplete: flags.lastComplete !== null,
  }
  const primary: PrimaryVariant = selectPrimaryCard(flagSummary)
  const secondary: SecondaryRow[] = selectSecondaryRows(flagSummary)

  // The plan line + carry-forward orient toward "what's next"; they stay
  // out of the way of the focused review_pending state (and are already
  // null on the exclusive resume branch). They are also suppressed on the
  // brand-new cold-start (new_user): with no history the plan line is a
  // generic fresh-start assertion that competes with the focal "Start
  // first session" card.
  const showPlanLayer =
    flags.plan !== null && primary !== 'review_pending' && primary !== 'new_user'
  // The descriptive plan line is additionally absorbed by the
  // last_complete focal card, whose primary CTA ("Start passing session")
  // now states the next focus and launches it — rendering the line above
  // would duplicate that. The `draft` primary is absorbed for the same
  // reason (T6 competing-focal-weight, 2026-06-22 shibui audit): the draft
  // card already states the assembled "what's next" session, so the plan
  // line above it is a second equal "what's next" frame. The carry-forward
  // cell still shows (a separate signal), so it stays on the broader
  // showPlanLayer gate.
  const showPlanLine =
    showPlanLayer && primary !== 'last_complete' && primary !== 'draft'

  return (
    <ScreenShell>
      {/* App-bar-scale brand row: inline icon + wordmark, subtle so the
          primary card carries the visual weight. Optical balance: the
          mark is a 24 px square with full ink; the wordmark sits at
          `text-xl` semibold so cap height reads close to the ball
          curves - avoids the “app icon dwarfing the title” effect from
          pairing a 28 px mark with `text-lg` bold (F11). See
          `docs/research/brand-ux-guidelines.md` §1 (type hierarchy). */}
      <ScreenShell.Header rhythm="landing" className="flex items-center gap-2.5">
        <Brandmark size={24} className="shrink-0" />
        <h1 className="text-xl font-semibold leading-none tracking-tight text-text-primary">
          Volleycraft
        </h1>
      </ScreenShell.Header>

      <ScreenShell.Body rhythm="landing">
        <UpdatePrompt needRefresh={needRefresh} onUpdate={updateApp} />

        {/* M002.1 thin-spine cluster: the plan line orients the focal
            card and the carry-forward footnotes it, so the three sit
            tighter to each other (gap-4) than to the zones below (body
            gap-8) and read as one "what's next" group rather than three
            equally-spaced siblings. When the plan layer is suppressed
            (review_pending / resume), the wrapper holds the lone primary
            card and the gap is inert. */}
        <div className="flex flex-col gap-4">
          {showPlanLine && flags.plan && <PlanForTodayLine plan={flags.plan} />}

          {renderPrimary(primary, flags, {
            handleResume,
            handleDiscard,
            handleFinishReview,
            handleRequestSkip,
            ...interceptedHandlers,
            actionDisabled: nonReviewActionPending,
          })}

          {showPlanLayer && flags.carryForwardLine && (
            <CarryForwardCell line={flags.carryForwardLine} />
          )}
        </div>

        {/* D158: the single escape hatch when today's conditions changed
            — a page-level quiet link below the focal cluster (shibui
            v2-04 comp), not a card-interior stack. Fresh `/setup` with
            the physical chips pre-filled from the last session. */}
        {primary === 'last_complete' && (
          <Button
            variant="link"
            disabled={nonReviewActionPending}
            onClick={interceptedHandlers.handleStartDifferentSession}
          >
            Start a different session
          </Button>
        )}

        {/* Phase F1 (2026-04-19): secondary rows used to render as a
          flex-col of independent bordered cards, which competed with
          the primary card for visual weight. They now sit inside a
          single quiet container grouped by a hairline divider, so
          the Home screen reads as "one focal card, one supporting
          cluster" instead of a flat stack of competing mini-cards.
          Variant API unchanged; HomeSecondaryRow flattens its own
          surface to match. 2026-05-02 recurrence pass: the rail keeps
          the border/radius but drops the focal-card shadow so a saved
          draft or last session does not ask for equal attention. */}
        {secondary.length > 0 && (
          <ul
            role="list"
            aria-label="Other active actions"
            className="divide-y divide-text-primary/5 overflow-hidden rounded-focal border border-text-primary/10 bg-bg-primary"
          >
            {secondary.map((row) =>
              renderSecondary(row, flags, {
                handleFinishReview,
                handleDraftOpen: interceptedHandlers.handleDraftStart,
              }),
            )}
          </ul>
        )}

        {flags.resume && (
          <section className="mt-4 flex flex-col gap-4">
            <Button variant="outline" fullWidth onClick={handleStartSession}>
              Start new session
            </Button>
          </section>
        )}

        {/* Tier 1a Unit 5 (2026-04-20): last-3-sessions trailer. Gated
          on `!flags.resume` because the Resume primary card is the
          only legal Home surface when a resumable session exists -
          showing a history list below a "Resume your session" modal
          would compete with that single-action framing. Also gated on
          `recentSessions.length > 0` inside the component itself, so
          a fresh install renders nothing here. Supports adversarial
          memo Condition 2 (visible session history removes the
          founder's reason to keep a parallel notes app). */}
        {!flags.resume && (
          <RecentSessionsList entries={flags.recentSessions} receipt={flags.receipt} />
        )}

        {softBlockTarget && (
          <SoftBlockModal
            pendingReview={softBlockTarget.pendingReview}
            onFinish={handleSoftBlockFinish}
            onSkipAndContinue={() => void handleSoftBlockSkipAndContinue()}
            onClose={handleSoftBlockClose}
          />
        )}

        {/* 2026-04-27 reconciled-list R11: Skip-review confirm modal.
            Mounted at the screen root next to SoftBlockModal so the
            destructive confirm reads as a centered role=dialog (matches
            `End session early?` on RunScreen and the rest of the app's
            modal language) instead of the previous inline two-step row
            inside ReviewPendingCard. State (`confirmingSkip`) and
            handlers stay HomeScreen-owned; the card simplified to just
            `Finish review` + `Skip review` link. */}
        {confirmingSkip && state.flags.reviewPending && (
          <SkipReviewModal
            planName={state.flags.reviewPending.planName}
            onConfirm={() => void handleConfirmSkip()}
            onCancel={handleCancelSkip}
          />
        )}
      </ScreenShell.Body>

      <ScreenShell.Footer rhythm="caption" className="text-xs text-text-secondary">
        <Link
          to={routes.settings()}
          className="inline-flex min-h-[44px] items-center px-2 underline underline-offset-2"
        >
          Settings
        </Link>
        {/* Phase F12 (2026-04-19): added trailing period to match
            SettingsScreen footer copy. Same sentence, same
            punctuation. */}
        <p>Your data stays on this device.</p>
      </ScreenShell.Footer>
    </ScreenShell>
  )
}

// --- render helpers (extracted for readability) ---

interface PrimaryHandlers {
  handleResume: () => void
  handleDiscard: () => void
  handleFinishReview: () => void
  handleRequestSkip: () => void
  handleDraftStart: () => void
  handleDraftEdit: () => void
  /**
   * Home-coherence: the focal action on the LastComplete card — starts a
   * session steered to the plan's next focus (staleness head).
   */
  handleStartPlan: () => void
  handleNewUserStart: () => void
  actionDisabled: boolean
}

function renderPrimary(primary: PrimaryVariant, flags: HomeFlags, h: PrimaryHandlers) {
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
          onFinish={h.handleFinishReview}
          onSkip={h.handleRequestSkip}
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
      // flags.plan is null only on the exclusive resume branch, which
      // never renders last_complete; composePlan otherwise always
      // returns a plan (a fresh start still yields a deterministic head).
      if (!flags.plan) return null
      return (
        <HomePrimaryCard
          variant="last_complete"
          nextFocus={flags.plan.nextFocus}
          backlog={flags.plan.backlog}
          onStartPlan={h.handleStartPlan}
          actionDisabled={h.actionDisabled}
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
}

function renderSecondary(row: SecondaryRow, flags: HomeFlags, h: SecondaryHandlers) {
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
    default: {
      const _exhaustive: never = row
      throw new Error(`Unhandled secondary row: ${String(_exhaustive)}`)
    }
  }
}
