import { Navigate, Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { FirstOpenGate } from './components/FirstOpenGate'
import { SchemaBlockedOverlay } from './components/SchemaBlockedOverlay'
import { CompleteScreen } from './screens/CompleteScreen'
import { HomeScreen } from './screens/HomeScreen'
import { ReviewScreen } from './screens/ReviewScreen'
import { RunScreen } from './screens/RunScreen'
import { SafetyCheckScreen } from './screens/SafetyCheckScreen'
import { SettingsScreen } from './screens/SettingsScreen'
import { SetupScreen } from './screens/SetupScreen'
import { SkillLevelScreen } from './screens/SkillLevelScreen'
import { TodaysSetupScreen } from './screens/TodaysSetupScreen'
import { TransitionScreen } from './screens/TransitionScreen'
import { routePaths } from './routes'

function Layout({ children }: { children: React.ReactNode }) {
  // Phase F3 (2026-04-19): page field uses `bg-surface-calm` - a warm
  // off-white - so white `bg-bg-primary` focal cards (`<Card
  // variant="focal">`, HomePrimaryCard, HomeScreen secondary list,
  // SettingsScreen export block, SkillLevelScreen option buttons)
  // stand out as deliberate content blocks against a calmer field.
  // Still "slightly off-white" per the outdoor readability contract
  // in `docs/research/outdoor-courtside-ui-brief.md`, so RunScreen +
  // TransitionScreen stay readable courtside.
  //
  // 2026-04-22 iPhone-viewport layout pass: the shell is now
  // height-locked (`h-[100dvh] overflow-hidden`) instead of
  // `min-h-[100dvh]`. Previously the document itself scrolled when a
  // screen's content exceeded one viewport, which pushed the Run
  // screen's timer + controls below the fold on long drills (d26
  // stretch list, expanded coaching cue) and made testers hunt for
  // the Next / Pause buttons. With the lock, scroll happens inside
  // `ScreenShell.Body` (see `components/ui/ScreenShell.tsx`) and the
  // footer stays pinned.
  //
  // Bottom safe-area + minimum gutter moved off the shell and onto
  // `ScreenShell.Footer` (`pb-[calc(1rem+env(safe-area-inset-bottom))]`)
  // so CTAs clear the home indicator on iPhone and still get 1 rem of
  // air when `safe-area-inset-bottom` is 0 (desktop preview).
  // `pt-[env(safe-area-inset-top)]` stays on `<main>` so every screen
  // (shell or not, status-message or not) pays the notch cost once
  // here.
  //
  // `min-h-0` on `<main>` is the flex-overflow gotcha: without it
  // the flex child refuses to shrink past its intrinsic content size
  // and the shell's internal scroll never engages.
  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-surface-calm font-sans">
      <main className="flex min-h-0 flex-1 flex-col px-4 pt-[env(safe-area-inset-top)]">
        {children}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <SchemaBlockedOverlay />
      <FirstOpenGate>
        <Layout>
          <Routes>
            <Route path={routePaths.home} element={<HomeScreen />} />
            <Route path={routePaths.setup} element={<SetupScreen />} />
            <Route path={routePaths.safety} element={<SafetyCheckScreen />} />
            <Route path={routePaths.run} element={<RunScreen />} />
            <Route path={routePaths.transition} element={<TransitionScreen />} />
            <Route path={routePaths.review} element={<ReviewScreen />} />
            <Route path={routePaths.complete} element={<CompleteScreen />} />
            <Route path={routePaths.settings} element={<SettingsScreen />} />
            <Route
              path={routePaths.onboardingSkillLevel}
              element={<SkillLevelScreen />}
            />
            <Route
              path={routePaths.onboardingTodaysSetup}
              element={<TodaysSetupScreen />}
            />
            <Route path="*" element={<Navigate to={routePaths.home} replace />} />
          </Routes>
        </Layout>
      </FirstOpenGate>
    </ErrorBoundary>
  )
}
