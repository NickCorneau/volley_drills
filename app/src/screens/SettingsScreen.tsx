import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BackButton, Button, Card, ScreenShell, StatusMessage } from '../components/ui'
import { useInstallPosture } from '../hooks/useInstallPosture'
import { BUILD_DATE, BUILD_VERSION } from '../lib/buildInfo'
import { formatTotalDurationLine } from '../lib/format'
import { isSchemaBlocked } from '../lib/schema-blocked'
import { getStorageCopy } from '../lib/storageCopy'
import { downloadExport } from '../services/export'
import { getSessionTallySummary, type SessionTallySummary } from '../services/session'
import { routes } from '../routes'

/**
 * V0B-15 (Phase E Unit 2): minimal Settings surface for the founder
 * JSON export.
 *
 * Deliberately one button. Any scope creep ("reset data", "clear
 * drafts", "switch skill level") lands in M001-build - for the 5-tester
 * D91 cohort the only settings-surface job is giving the founder a way
 * to collect raw training records from each device.
 *
 * Header matches the SafetyCheckScreen / SetupScreen pattern so the
 * back-to-home affordance lives in the same thumb zone across the app.
 *
 * Phase F2 (2026-04-19): the export block now uses the shared focal
 * Card variant (same surface language as HomePrimaryCard post-F1) so
 * Settings feels like part of the same design family as Home. Pure
 * visual alignment - no behavior change.
 */

type ExportState =
  | { kind: 'idle' }
  | { kind: 'exporting' }
  | { kind: 'success' }
  | { kind: 'error'; message: string }

export function SettingsScreen() {
  const navigate = useNavigate()
  const acting = useRef(false)
  const [state, setState] = useState<ExportState>({ kind: 'idle' })
  // 2026-04-27 reconciled-list `R13`: quiet `Logged: N sessions · H:MM
  // total` investment footer. Single-shot read on mount — Settings is
  // a leaf screen with no live-update requirement, and the footer
  // hides entirely when `count === 0` so first-week testers see no
  // row. `null` until the read resolves so the row never flashes a
  // wrong value during the initial render.
  const [tally, setTally] = useState<SessionTallySummary | null>(null)
  useEffect(() => {
    let cancelled = false
    getSessionTallySummary().then(
      (summary) => {
        if (!cancelled) setTally(summary)
      },
      (err) => {
        if (isSchemaBlocked()) return
        // Fail quiet — the footer simply hides for this render.
        console.error('Settings tally read failed:', err)
      },
    )
    return () => {
      cancelled = true
    }
  }, [])
  // 2026-04-23 walkthrough closeout polish item 3: the
  // posture-sensitive Safari-eviction explainer moved off the Complete
  // screen's terminal verdict surface and into this sub-section. The
  // three D118 posture variants (browser-tab / installed-not-persisted
  // / installed-persisted) are authoritatively sourced from
  // `storageCopy.ts` so the Complete `Why is this?` link and this
  // detail stay in lockstep if the posture copy is revised later.
  const { posture } = useInstallPosture()
  const storageCopy = getStorageCopy(posture)

  const handleExport = useCallback(async () => {
    if (acting.current) return
    acting.current = true
    setState({ kind: 'exporting' })
    try {
      await downloadExport()
      setState({ kind: 'success' })
    } catch (err) {
      acting.current = false
      if (isSchemaBlocked()) {
        // Schema-blocked overlay owns the UI during a concurrent-tab
        // upgrade; suppress our error toast.
        setState({ kind: 'idle' })
        return
      }
      console.error('Export failed:', err)
      setState({
        kind: 'error',
        message: 'Export failed. If this keeps happening let the founder know.',
      })
      return
    }
    acting.current = false
  }, [])

  return (
    <ScreenShell>
      {/*
        2026-04-22 iPhone-viewport layout pass: converted to `ScreenShell`
        for consistency — the export card is short enough that this screen
        fits a 390 × 844 iPhone today, but aligning the layout primitive
        with the rest of the app keeps the back-button position, top-bar
        rhythm, and footer ("Your data stays on this device.") on the
        same grid as SetupScreen / SafetyCheckScreen / ReviewScreen.
      */}
      <ScreenShell.Header className="flex items-center gap-2 pt-2 pb-3">
        <BackButton label="Back" onClick={() => navigate(routes.home())} />
        <h1 className="flex-1 text-center text-xl font-semibold tracking-tight text-text-primary">
          Settings
        </h1>
        <div className="w-12" />
      </ScreenShell.Header>

      <ScreenShell.Body className="gap-8 pb-4">
        <Card variant="focal">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Export training records</h2>
            <p className="mt-1 text-sm text-text-secondary">
              Downloads your session history as a JSON file you can share.
            </p>
          </div>
          <Button
            variant="primary"
            fullWidth
            onClick={handleExport}
            disabled={state.kind === 'exporting'}
          >
            {state.kind === 'exporting' ? 'Exporting\u2026' : 'Export training records'}
          </Button>
          {state.kind === 'success' && (
            <p
              role="status"
              aria-live="polite"
              className="rounded-[12px] bg-success/10 px-4 py-3 text-center text-sm font-medium text-success"
            >
              Export saved. Check your downloads.
            </p>
          )}
          {state.kind === 'error' && <StatusMessage variant="error" message={state.message} />}
        </Card>

        {/* 2026-04-23 walkthrough closeout polish item 3: About local
            storage sub-section, below the Export card. Scope-guardian
            A7 discipline (Settings stays single-card minimal in Tier
            1b) allows this addition because it is the *same* D118
            copy previously on CompleteScreen's terminal verdict
            surface, not net-new content — it moved here to keep the
            Complete screen shibui-calm and to give the explainer a
            permanent home users can consult on their own time. Per
            the posture-sensitive `storageCopy.ts`, the headline stays
            "Saved on this device" (installed states) or "Saved in
            this browser on this device" (browser-tab) and the body
            carries the posture-specific durability caveat. This is
            the surface that the Complete `Why is this?` link lands
            on. */}
        <section
          aria-labelledby="settings-storage-heading"
          data-testid="settings-storage-info"
          data-posture={posture}
          className="flex flex-col gap-2 rounded-[12px] border border-text-secondary/15 bg-bg-warm/40 p-4"
        >
          <h2 id="settings-storage-heading" className="text-sm font-semibold text-text-primary">
            About local storage
          </h2>
          <p className="text-sm font-medium text-text-primary">{storageCopy.primary}</p>
          <p className="text-sm leading-relaxed text-text-secondary">{storageCopy.secondary}</p>
          <p className="text-sm leading-relaxed text-text-secondary">
            Use Export training records above to move your history between devices or keep a copy
            off-device.
          </p>
        </section>
      </ScreenShell.Body>

      <ScreenShell.Footer className="pt-3">
        {/* 2026-04-27 reconciled-list `R13` (Settings investment footer):
            quiet `Logged: N sessions · H:MM total` row above the
            existing privacy promise. Hidden entirely when no sessions
            have been logged so first-week testers see no row at all.
            Source-of-truth: `getSessionTallySummary()` read once on
            mount; per-session minute math mirrors `formatDurationLine`
            so this total matches the sum of per-row durations the
            user sees on Complete / Recent Sessions. Excludes
            `discarded_resume` stubs via the existing
            `isTerminalSession` predicate (`A8`). */}
        {tally && tally.count > 0 && (
          <p
            className="pb-1 text-center text-xs text-text-secondary"
            data-testid="settings-investment-footer"
          >
            Logged: {tally.count} {tally.count === 1 ? 'session' : 'sessions'} ·{' '}
            {formatTotalDurationLine(tally.totalMinutes)} total
          </p>
        )}
        <p className="pb-2 text-center text-xs text-text-secondary">
          Your data stays on this device.
        </p>
        {/* 2026-04-26 pre-D91 editorial polish (`F14`): build-id row
            for D91 field-test debugging hygiene. When a tester reports
            a bug, the founder's first triage question is "what build
            are you on?" — this row is the answer. Monospace so the
            identifier reads as copyable rather than human prose.
            Values come from Vite `define` injection in
            `vite.config.ts` via the typed `lib/buildInfo.ts` accessor.

            2026-04-27 source change: build identifier is now
            `git describe --tags --always --dirty` output instead of
            a bare short SHA. On a clean build at a tagged commit this
            renders as e.g. `Build v0b-alpha.16 · 2026-04-27` —
            more memorable for triage than `Build 47745e2 · 2026-04-27`
            and same character budget. Inter-tag commits render as
            `v0b-alpha.16-3-g1234567`; uncommitted-tree builds append
            `-dirty`. See `docs/plans/2026-04-26-pre-d91-editorial-polish.md`
            Item 6. */}
        <p
          className="pb-3 text-center font-mono text-[11px] text-text-secondary/80"
          data-testid="settings-build-id"
        >
          Build {BUILD_VERSION} · {BUILD_DATE}
        </p>
      </ScreenShell.Footer>
    </ScreenShell>
  )
}
