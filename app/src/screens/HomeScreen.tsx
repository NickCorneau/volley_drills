import { useCallback, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Brandmark } from '../components/Brandmark'
import { HomePrimaryCard } from '../components/HomePrimaryCard'
import { HomeSecondaryRow } from '../components/HomeSecondaryRow'
import { RecentSessionsList } from '../components/RecentSessionsList'
import { SoftBlockModal } from '../components/SoftBlockModal'
import { UpdatePrompt } from '../components/UpdatePrompt'
import { Button, ScreenShell } from '../components/ui'
import { FOCAL_SURFACE_CLASS } from '../components/ui/Card'
import { selectPrimaryCard, selectSecondaryRows } from '../domain/homePriority'
import type { PrimaryVariant, SecondaryRow } from '../domain/homePriority'
import { useAppRegisterSW } from '../lib/pwa-register'
import { isSchemaBlocked } from '../lib/schema-blocked'
import { routes } from '../routes'
import { buildDraft, buildDraftFromCompletedBlocks } from '../domain/sessionBuilder'
import { discardSession, saveDraft, skipReview, type PendingReview } from '../services/session'
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

  // First-tap: flips the card into the two-step confirm row.
  const handleRequestSkip = useCallback(() => {
    if (state.kind !== 'ready' || !state.flags.reviewPending) return
    setConfirmingSkip(true)
  }, [state])

  // Second-tap: actually writes the skipped stub and routes to /complete.
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

  const handleStartWorkout = useCallback(() => navigate(routes.setup()), [navigate])

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
  // Phase F Unit 1 (2026-04-19) simplified the LastComplete CTA set:
  // - `Edit` + `Same as last time` cut; their wiring
  //   (`handleLastCompleteEdit` / `handleSameAsLast`) is gone.
  // - `Start a different session` is new: routes to fresh `/setup`
  //   (no pre-fill cue, no banner). Same target URL as NewUser Start,
  //   different user-facing label.
  //
  // 2026-04-22 one-tap Repeat: `handleRepeat` used to route to
  // `/setup?from=repeat` where the tester saw every last-session
  // toggle pre-filled + a stale-context banner + had to tap Build
  // session. That ceremony fought the user's stated intent ("repeat
  // this session" literally means "same conditions"), contradicted
  // the adjacent `handleRepeatWhatYouDid` which already bypassed
  // Setup, and matched no industry peer (Spotify / Peloton / Strava /
  // Amazon "Buy it again" all treat Repeat as one-tap-execute). Now
  // it rebuilds a fresh draft from the last plan's `SetupContext`
  // via `buildDraft()` and routes straight to `/safety`. If
  // rebuilding fails (archetype or drill catalog drift since the
  // last session) the handler falls back to `/setup` so the tester
  // can still proceed by hand. `Start a different session` is the
  // explicit escape when today's conditions genuinely changed.
  const interceptedHandlers = useMemo(() => {
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
      handleNewUserStart: intercept(() => navigate(routes.setup())),
      handleDraftStart: intercept(() => navigate(routes.safety())),
      handleDraftEdit: intercept(() => navigate(routes.setup())),
      // One-tap Repeat: rebuild a fresh full-plan draft from the last
      // session's SetupContext and route straight to `/safety`. No
      // Setup detour, no stale-context banner, no toggle review. The
      // `Start a different session` CTA right below is the explicit
      // escape hatch when today's conditions changed.
      handleRepeat: intercept(async () => {
        if (state.kind !== 'ready' || !state.flags.lastComplete) return
        const priorContext = state.flags.lastComplete.plan.context
        if (!priorContext) {
          navigate(routes.setup())
          return
        }
        try {
          const draft = buildDraft(priorContext)
          if (!draft) {
            navigate(routes.setup())
            return
          }
          await saveDraft(draft)
          navigate(routes.safety())
        } catch (err) {
          if (isSchemaBlocked()) return
          console.error('Repeat session failed:', err)
          navigate(routes.setup())
        }
      }),
      // Phase F Unit 1: LastComplete's sole secondary. Fresh setup for
      // the tester whose answer to "same as last time?" is *no*. The
      // intercept ensures review_pending still fires the soft-block
      // modal.
      handleStartDifferentSession: intercept(() => navigate(routes.setup())),
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
            navigate(routes.setup())
            return
          }
          await saveDraft(draft)
          navigate(routes.safety())
        } catch (err) {
          if (isSchemaBlocked()) return
          console.error('Repeat-what-you-did failed:', err)
          navigate(routes.setup())
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
          onClick={retry}
        >
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

  return (
    <ScreenShell>
      {/* App-bar-scale brand row: inline icon + wordmark, subtle so the
          primary card carries the visual weight. Optical balance: the
          mark is a 24 px square with full ink; the wordmark sits at
          `text-xl` semibold so cap height reads close to the ball
          curves - avoids the “app icon dwarfing the title” effect from
          pairing a 28 px mark with `text-lg` bold (F11). See
          `docs/research/brand-ux-guidelines.md` §1 (type hierarchy). */}
      <ScreenShell.Header className="flex items-center gap-2.5 pt-6 pb-4">
        <Brandmark size={24} className="shrink-0" />
        <h1 className="text-xl font-semibold leading-none tracking-tight text-text-primary">
          Volleycraft
        </h1>
      </ScreenShell.Header>

      <ScreenShell.Body className="gap-8 pb-6">
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
            className={`divide-y divide-text-primary/5 overflow-hidden ${FOCAL_SURFACE_CLASS}`}
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
            <Button variant="outline" fullWidth onClick={handleStartWorkout}>
              Start New Workout
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
        {!flags.resume && <RecentSessionsList entries={flags.recentSessions} />}

        {softBlockTarget && (
          <SoftBlockModal
            pendingReview={softBlockTarget.pendingReview}
            onFinish={handleSoftBlockFinish}
            onSkipAndContinue={() => void handleSoftBlockSkipAndContinue()}
            onClose={handleSoftBlockClose}
          />
        )}
      </ScreenShell.Body>

      <ScreenShell.Footer className="flex flex-col items-center gap-1 pt-3 text-center text-xs text-text-secondary">
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
   * `/setup` (no pre-fill, no banner) - the "today is different" path
   * on the LastComplete card.
   */
  handleStartDifferentSession: () => void
  handleNewUserStart: () => void
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
            flags.lastComplete.log.status === 'ended_early' ? h.handleRepeatWhatYouDid : undefined
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
