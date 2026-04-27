import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { PerDrillCapture } from '../components/PerDrillCapture'
import { SafetyIcon } from '../components/SafetyIcon'
import { Button, ScreenShell, StatusMessage } from '../components/ui'
import type {
  DifficultyTag,
  PerDrillCapture as PerDrillCaptureRecord,
  SessionPlanBlock,
} from '../db'
import { getBlockMetricType, getBlockSuccessRule } from '../domain/drillMetadata'
import { COUNT_BASED_METRIC_TYPES } from '../domain/policies'
import { useSessionRunner } from '../hooks/useSessionRunner'
import { isSchemaBlocked } from '../lib/schema-blocked'
import { routes } from '../routes'
import { loadReviewDraft, saveReviewDraft } from '../services/review'

/**
 * 2026-04-27 pre-D91 editorial polish (plan Item 9): dedicated reflective
 * beat between Run and Transition. The just-finished drill's required
 * difficulty chip + optional Good/Total counts live here so that the
 * next-drill briefing on `/run/transition` is single-purpose.
 *
 * Why a dedicated screen:
 *   - Pre-Item-9 the `PerDrillCapture` component sat at the top of the
 *     Transition body, *above* the Up Next briefing (drill name,
 *     rationale, full courtside instructions, coaching cue). On a
 *     390 px viewport the reflective beat and the rehearsal beat
 *     competed for the same scroll, and on any non-trivial cue the
 *     Start CTA was buried below the fold.
 *   - The capture / next-drill split also matched a "Tag how that drill
 *     went to keep going" gating hint with a grey CTA — UI-state
 *     masking a layout problem. With the split, gating becomes
 *     architectural: you can't reach Up Next without committing the
 *     chip, because the screens are in series.
 *   - The Jo-Ha-Kyu cadence reads naturally: "you finished" → "what was
 *     that?" → "here's what's next" → "go." Two screens, one job each.
 *
 * Bypass logic: when the just-finished block was not a count-eligible
 * main_skill / pressure block (warmup, technique, wrap, or skipped),
 * the user has nothing to reflect on, so the screen redirects to
 * `/run/transition` immediately on mount via `replace` so the back
 * button does not land on a blank reflective beat. The bypass keeps
 * `RunScreen` callers symmetric: every block-end navigates to
 * `routes.drillCheck(...)` regardless of capture eligibility, and this
 * screen owns the decision.
 *
 * Capture state lifecycle is lifted verbatim from the previous
 * `TransitionScreen` implementation (D133, 2026-04-26). The component
 * tree, draft persistence rules, and capture-target derivation are
 * unchanged; only the host surface moved. See
 * `docs/plans/2026-04-26-pre-d91-editorial-polish.md` Item 9.
 */

function mergePerDrillCapture(
  captures: PerDrillCaptureRecord[],
  next: PerDrillCaptureRecord,
): PerDrillCaptureRecord[] {
  return [...captures.filter((c) => c.blockIndex !== next.blockIndex), next].sort(
    (a, b) => a.blockIndex - b.blockIndex,
  )
}

export function DrillCheckScreen() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const executionLogId = searchParams.get('id') ?? ''
  const pendingCaptureSave = useRef<Promise<boolean> | null>(null)

  const runner = useSessionRunner(executionLogId)
  const { plan, execution, loaded, currentBlockIndex, totalBlocks } = runner

  // The reflective beat is about the *just-finished* block, which is
  // one index behind the runner's `currentBlockIndex` after the Run
  // screen advances on block-end. When the block was not advanced (mid-
  // session error, hard refresh on /run/check) the previous block may
  // not exist; the bypass below catches that.
  const prevBlockIdx = currentBlockIndex - 1
  const prevBlock = plan?.blocks[prevBlockIdx] ?? null
  const prevBlockStatus = execution?.blockStatuses[prevBlockIdx] ?? null

  // Capture target = the just-finished block, IFF it was a main_skill /
  // pressure block that completed (not skipped) and is identifiable in
  // the drill catalog. Warmup, movement_proxy, technique, and wrap
  // blocks do not capture; skipped blocks do not capture. Same gate as
  // the pre-Item-9 TransitionScreen logic.
  const captureTarget: SessionPlanBlock | null =
    prevBlock &&
    prevBlockStatus?.status === 'completed' &&
    (prevBlock.type === 'main_skill' || prevBlock.type === 'pressure') &&
    prevBlock.drillId &&
    prevBlock.variantId
      ? prevBlock
      : null

  const playerCount = plan?.playerCount ?? 1
  const captureMetricType = useMemo(
    () => getBlockMetricType(captureTarget, playerCount),
    [captureTarget, playerCount],
  )
  const showCaptureCounts =
    captureMetricType !== null && COUNT_BASED_METRIC_TYPES.has(captureMetricType)
  // V0B-28 forced-criterion prompt source (D104 layer-1). Resolved
  // alongside the metric type from the same variant so the rule and
  // the count-eligibility decision can never disagree. Renders inside
  // the expanded `Add counts` body inside `PerDrillCapture`.
  const captureSuccessRule = useMemo(
    () => getBlockSuccessRule(captureTarget, playerCount),
    [captureTarget, playerCount],
  )

  const [captures, setCaptures] = useState<PerDrillCaptureRecord[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [difficulty, setDifficulty] = useState<DifficultyTag | null>(null)
  const [captureGood, setCaptureGood] = useState(0)
  const [captureTotal, setCaptureTotal] = useState(0)
  const [captureNotCaptured, setCaptureNotCaptured] = useState(false)
  const [captureSaveError, setCaptureSaveError] = useState<string | null>(null)

  // Rehydrate the full captures list from any existing review draft on
  // mount. Tier 1b drafts hold per-drill captures across the whole
  // session so a tester who Finishes Later, closes the tab, and resumes
  // does not lose tags they already tapped.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const draft = await loadReviewDraft(executionLogId)
        if (cancelled) return
        setCaptures(draft?.perDrillCaptures ?? [])
        setHydrated(true)
      } catch (err) {
        if (cancelled) return
        if (isSchemaBlocked()) {
          setHydrated(true)
          return
        }
        console.error('DrillCheck draft load failed:', err)
        setHydrated(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [executionLogId])

  // When the capture target shifts (Finish-Later resume on a different
  // block) mirror the existing capture's values into the input state,
  // or reset to empty defaults if no capture exists yet for this block.
  useEffect(() => {
    if (!hydrated) return
    if (!captureTarget) {
      setDifficulty(null)
      setCaptureGood(0)
      setCaptureTotal(0)
      setCaptureNotCaptured(false)
      return
    }
    const existing = captures.find((c) => c.blockIndex === prevBlockIdx)
    if (existing) {
      setDifficulty(existing.difficulty)
      setCaptureGood(existing.goodPasses ?? 0)
      setCaptureTotal(existing.attemptCount ?? 0)
      setCaptureNotCaptured(existing.notCaptured === true)
    } else {
      setDifficulty(null)
      setCaptureGood(0)
      setCaptureTotal(0)
      setCaptureNotCaptured(false)
    }
    // `captures` deliberately omitted: the merge effect below feeds back
    // into `captures`; including it here would re-clobber the very edit
    // the user just made.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, captureTarget, prevBlockIdx])

  const buildCurrentCapture = useCallback((): PerDrillCaptureRecord | null => {
    if (!captureTarget) return null
    if (difficulty == null) return null
    if (!captureTarget.drillId || !captureTarget.variantId) return null
    return {
      drillId: captureTarget.drillId,
      variantId: captureTarget.variantId,
      blockIndex: prevBlockIdx,
      difficulty,
      capturedAt: Date.now(),
      ...(captureNotCaptured
        ? { notCaptured: true }
        : showCaptureCounts && (captureGood > 0 || captureTotal > 0)
          ? {
              goodPasses: captureGood,
              attemptCount: captureTotal,
            }
          : {}),
    }
  }, [
    captureGood,
    captureNotCaptured,
    captureTarget,
    captureTotal,
    difficulty,
    prevBlockIdx,
    showCaptureCounts,
  ])

  const persistMergedCaptures = useCallback(
    (merged: PerDrillCaptureRecord[]): Promise<boolean> => {
      const pending = saveReviewDraft({
        executionLogId,
        sessionRpe: null,
        goodPasses: 0,
        totalAttempts: 0,
        perDrillCaptures: merged,
      })
        .then(() => {
          setCaptureSaveError(null)
          return true
        })
        .catch((err) => {
          if (!isSchemaBlocked()) {
            console.error('DrillCheck draft save failed:', err)
            setCaptureSaveError('Could not save this drill check. Try again.')
          }
          return false
        })

      pendingCaptureSave.current = pending
      void pending.then(() => {
        if (pendingCaptureSave.current === pending) {
          pendingCaptureSave.current = null
        }
      })
      return pending
    },
    [executionLogId],
  )

  const flushCurrentCapture = useCallback(async (): Promise<boolean> => {
    const next = buildCurrentCapture()
    if (!next) return false
    const merged = mergePerDrillCapture(captures, next)
    setCaptures(merged)
    return persistMergedCaptures(merged)
  }, [buildCurrentCapture, captures, persistMergedCaptures])

  // Persist every meaningful per-drill change immediately. Difficulty
  // is the gate: until the user taps a chip there is nothing honest to
  // record (D133 mandates difficulty as the required field).
  useEffect(() => {
    if (!hydrated) return
    const next = buildCurrentCapture()
    if (!next) return
    setCaptures((prev) => {
      const merged = mergePerDrillCapture(prev, next)
      void persistMergedCaptures(merged)
      return merged
    })
    // `captures` intentionally not in deps: setCaptures uses the prev
    // callback so we don't need to re-run when captures change.
  }, [hydrated, buildCurrentCapture, persistMergedCaptures])

  // Bypass: no capture target → the user has nothing to reflect on for
  // the previous block (warmup → main, technique block, skipped block,
  // or first block where there is no previous block). Forward to
  // Transition immediately so the user never sees a blank reflective
  // beat. `replace: true` keeps the back button pointing at Run, not
  // at this skipped beat. Gated on `loaded` so we don't redirect before
  // the runner has resolved the plan / execution.
  useEffect(() => {
    if (!loaded) return
    if (!plan || !execution) return
    if (execution.status === 'completed' || currentBlockIndex >= totalBlocks) {
      navigate(routes.review(executionLogId), { replace: true })
      return
    }
    if (!captureTarget) {
      navigate(routes.transition(executionLogId), { replace: true })
    }
  }, [
    loaded,
    plan,
    execution,
    captureTarget,
    currentBlockIndex,
    totalBlocks,
    executionLogId,
    navigate,
  ])

  const captureSatisfied = difficulty !== null

  const handleContinue = useCallback(async () => {
    if (!captureSatisfied) return
    const pending = pendingCaptureSave.current
    if (pending) {
      const saved = await pending
      if (!saved) return
    }
    const saved = await flushCurrentCapture()
    if (!saved) return
    if (navigator.vibrate) navigator.vibrate(50)
    navigate(routes.transition(executionLogId))
  }, [captureSatisfied, executionLogId, flushCurrentCapture, navigate])

  if (!plan || !execution) {
    if (loaded) {
      return (
        <StatusMessage
          variant="empty"
          message="Session not found."
          action={
            <Link
              to={routes.home()}
              className="min-h-[54px] inline-flex items-center px-4 font-semibold text-accent underline-offset-2 hover:underline"
            >
              Back to home
            </Link>
          }
        />
      )
    }
    return <StatusMessage variant="loading" />
  }

  // While the bypass effect is mid-flight (no capture target), render
  // the loading spinner so the next paint is the redirected screen
  // rather than a brief flash of an empty drill-check body.
  if (!captureTarget) {
    return <StatusMessage variant="loading" />
  }

  return (
    <ScreenShell>
      {/*
        Header mirrors the Transition header rhythm so the run-flow
        sequence reads as one continuous instrument: SafetyIcon left,
        soft-eyebrow center, "Block N/M" right. The eyebrow says
        "Drill check" instead of "Transition" so the user's mental
        model differentiates the reflective beat from the rehearsal
        beat — same rhythm, different job. Block counter uses the
        *previous* block index (one-indexed) since we're checking in
        on the just-finished block, not the upcoming one.
      */}
      {/* Header counter reads "Last: N/M" so the temporal direction is
          explicit and reads as a matched pair with TransitionScreen's
          "Next: N/M" header. The user just finished block `prevBlockIdx
          + 1` of `totalBlocks` and is reflecting on it; Transition
          immediately downstream looks forward to block N+1. The pair
          (Last → Next) makes the run-flow rhythm feel intentional
          rather than incidental. */}
      <ScreenShell.Header className="flex items-center justify-between pt-2 pb-3">
        <SafetyIcon />
        <span className="text-sm font-medium text-text-secondary">Drill check</span>
        <span className="text-sm font-medium text-text-secondary">
          Last: {prevBlockIdx + 1}/{totalBlocks}
        </span>
      </ScreenShell.Header>

      {/*
        Body is intentionally sparse: the just-finished pill (so the
        user knows which drill they're tagging) and the PerDrillCapture
        component, top-aligned so the eye lands on the pill immediately
        below the header and the "Last → Next" run-flow rhythm reads as
        a matched pair with TransitionScreen (whose body is also
        top-aligned). The previous `justify-center` posture floated the
        pill mid-screen on tall viewports, which read as a loading state
        and pushed the chips past the thumb zone; the Continue CTA is
        footer-anchored regardless, so vertical centering bought us
        nothing on tap-reach. A small `pt-2` keeps the pill from
        slamming against the header hairline. No "Up next" content here
        — that lives on the next screen by design.
      */}
      <ScreenShell.Body className="items-stretch gap-6 pb-4 pt-2">
        <div className="flex items-start gap-2.5 rounded-[12px] bg-bg-warm p-3">
          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success text-white">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-text-primary">{captureTarget.drillName}</p>
            <p className="text-sm text-success">Complete</p>
          </div>
        </div>

        <PerDrillCapture
          drillName={captureTarget.drillName}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          showCounts={showCaptureCounts}
          successRuleDescription={captureSuccessRule ?? undefined}
          goodPasses={captureGood}
          attemptCount={captureTotal}
          notCaptured={captureNotCaptured}
          onGoodChange={setCaptureGood}
          onAttemptChange={setCaptureTotal}
          onToggleNotCaptured={() => {
            setCaptureNotCaptured((prev) => {
              const next = !prev
              if (next) {
                setCaptureGood(0)
                setCaptureTotal(0)
              }
              return next
            })
          }}
        />
      </ScreenShell.Body>

      {/*
        Footer: single Continue button, gated on a chip selection. The
        gating hint mirrors the Review screen's `missingHint` voice
        (fail-quiet, polite live region) so a grey button is never
        silent at courtside. Single-CTA footer also signals the
        single-purpose nature of this screen — there is no "skip", no
        "swap", no shorten. The only way out forward is to tag.
      */}
      <ScreenShell.Footer className="flex flex-col gap-3 pt-4">
        {captureSaveError && <StatusMessage variant="error" message={captureSaveError} />}
        {!captureSatisfied && (
          <p
            className="text-center text-sm text-text-secondary"
            aria-live="polite"
            data-testid="drill-check-gating-hint"
          >
            Tag how that drill went to keep going.
          </p>
        )}
        <Button variant="primary" fullWidth onClick={handleContinue} disabled={!captureSatisfied}>
          Continue
        </Button>
      </ScreenShell.Footer>
    </ScreenShell>
  )
}
