import { BackButton, Button, Card, ScreenShell, StatusMessage, ToggleChip } from '../components/ui'
import type { TuneTodayFocus } from './tuneToday/useTuneTodayController'
import { useTuneTodayController } from './tuneToday/useTuneTodayController'

const FOCUS_OPTIONS: readonly { value: TuneTodayFocus; label: string }[] = [
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
    heading,
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
      <ScreenShell.Header className="flex items-center gap-2 pt-2 pb-3">
        <BackButton label="Back" onClick={goBack} />
        <h1 className="flex-1 text-center text-xl font-semibold tracking-tight text-text-primary">
          {heading}
        </h1>
        <div className="w-12" />
      </ScreenShell.Header>

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

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-text-primary">Focus</h2>
          <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Focus">
            {FOCUS_OPTIONS.map((option) => (
              <ToggleChip
                key={option.value}
                label={option.label}
                selected={focus === option.value}
                onTap={() => void selectFocus(option.value)}
              />
            ))}
          </div>
          {warning && <StatusMessage variant="error" message={warning} />}
        </section>
      </ScreenShell.Body>

      <ScreenShell.Footer className="flex flex-col gap-4 pt-4">
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
