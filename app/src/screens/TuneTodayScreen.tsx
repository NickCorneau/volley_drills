import {
  Button,
  Card,
  ChoiceRow,
  type ChoiceRowOption,
  ChoiceSection,
  ScreenHeader,
  ScreenShell,
  StatusMessage,
} from '../components/ui'
import type { TuneTodayFocus } from './tuneToday/useTuneTodayController'
import { useTuneTodayController } from './tuneToday/useTuneTodayController'

const FOCUS_OPTIONS: readonly ChoiceRowOption<TuneTodayFocus>[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'pass', label: 'Passing' },
  { value: 'serve', label: 'Serving' },
  { value: 'set', label: 'Setting' },
]

export function TuneTodayScreen() {
  const {
    continueToSafety,
    draft,
    focus,
    goBack,
    goBackToSetup,
    goToSettings,
    heading,
    levelRelaxed,
    loadError,
    loading,
    pending,
    selectFocus,
    totalMinutes,
    warning,
  } = useTuneTodayController()

  if (loading) {
    return <StatusMessage variant="loading" />
  }

  if (loadError || !draft) {
    return (
      <StatusMessage
        variant="empty"
        message="Could not load your saved session."
        action={
          <Button variant="ghost" onClick={goBackToSetup}>
            Back to setup
          </Button>
        }
      />
    )
  }

  return (
    <ScreenShell>
      <ScreenHeader backLabel="Back" onBack={goBack} title={heading} />

      <ScreenShell.Body className="gap-6 pb-4">
        <Card variant="focal" aria-label="Your setup">
          <div>
            <p className="text-sm font-medium text-text-secondary">Your setup</p>
            <p className="mt-1 text-xl font-semibold tracking-tight text-text-primary">
              {draft.archetypeName}
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              {totalMinutes} min · {draft.blocks.length} blocks
            </p>
          </div>
        </Card>

        <ChoiceSection title="Focus">
          <ChoiceRow<TuneTodayFocus>
            value={focus}
            onChange={(next) => void selectFocus(next)}
            options={FOCUS_OPTIONS}
            layout="grid-2"
            ariaLabel="Focus"
          />
          {warning && <StatusMessage variant="error" message={warning} />}
        </ChoiceSection>
      </ScreenShell.Body>

      <ScreenShell.Footer className="flex flex-col gap-2 pt-4">
        {/* 2026-05-04 skill-level-mutability ship (R10 / KD9): inline
            relaxation eyebrow above Continue when the engine had to
            relax the user's saved level for >=1 focus-controlled slot
            in the active draft. Tappable to Settings; Continue still
            routes to Safety unchanged. Renders nothing on legacy
            drafts (levelRelaxed undefined) or fully-honored builds.
            Uses the shared Button `link` variant per
            .cursor/rules/component-patterns.mdc so the tap target
            meets the same 44px floor as every other tertiary action
            in the app. */}
        {levelRelaxed && (
          <Button
            variant="link"
            onClick={goToSettings}
            aria-live="polite"
            data-testid="tune-today-level-relaxed-eyebrow"
          >
            Today&apos;s session is calibrated to your saved level. Adjust in Settings.
          </Button>
        )}
        <Button
          variant="primary"
          fullWidth
          disabled={pending}
          aria-label="Continue to safety check"
          onClick={continueToSafety}
        >
          Continue
        </Button>
      </ScreenShell.Footer>
    </ScreenShell>
  )
}
