import { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BackButton,
  Button,
  Card,
  ScreenShell,
  StatusMessage,
} from '../components/ui'
import { downloadExport } from '../services/export'
import { isSchemaBlocked } from '../lib/schema-blocked'
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
        message:
          'Export failed. If this keeps happening let the founder know.',
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
            <h2 className="text-sm font-semibold text-text-primary">
              Export training records
            </h2>
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
          {state.kind === 'error' && (
            <StatusMessage variant="error" message={state.message} />
          )}
        </Card>
      </ScreenShell.Body>

      <ScreenShell.Footer className="pt-3">
        <p className="pb-3 text-center text-xs text-text-secondary">
          Your data stays on this device.
        </p>
      </ScreenShell.Footer>
    </ScreenShell>
  )
}
