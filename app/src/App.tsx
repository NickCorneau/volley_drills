import { Navigate, Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { FirstOpenGate } from './components/FirstOpenGate'
import { SchemaBlockedOverlay } from './components/SchemaBlockedOverlay'
import { CompleteScreen } from './screens/CompleteScreen'
import { DrillCheckScreen } from './screens/DrillCheckScreen'
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
  // height-locked (`h-[100dvh]`) instead of `min-h-[100dvh]`.
  // Previously the document itself scrolled when a screen's content
  // exceeded one viewport, which pushed the Run screen's timer +
  // controls below the fold on long drills (d26 stretch list,
  // expanded coaching cue) and made testers hunt for the Next /
  // Pause buttons. With the lock, scroll happens inside
  // `ScreenShell.Body` (see `components/ui/ScreenShell.tsx`) and the
  // footer stays pinned.
  //
  // 2026-04-27 Android-PWA viewport correction (Seb feedback): the
  // height source is now `var(--app-height, 100dvh)`, where
  // `--app-height` is written by `startAppHeightTracking()` in
  // `lib/appHeight.ts` from `visualViewport.height`. Pure `100dvh`
  // occasionally resolves to a stale, too-large value on Android
  // Chrome WebAPK after a service-worker `skipWaiting` + reload,
  // which extended the locked shell below the actually-visible
  // screen and trapped the bottom CTA row off-screen until the user
  // force-quit the PWA. The CSS fallback to `100dvh` keeps the page
  // sane in the brief window before the JS tracker runs and in
  // jsdom-style environments where it doesn't run at all.
  //
  // Overflow on the root is `overflow-y-auto` rather than
  // `overflow-hidden` as a belt-and-suspenders safety net: in steady
  // state the inner flex chain sizes to the locked height exactly
  // and there's nothing to scroll, but if a future viewport-edge
  // bug ever sneaks past the JS tracker the page can still scroll
  // to expose its full content instead of trapping the user. This
  // is a no-op on every screen we ship today.
  //
  // Bottom safe-area + minimum gutter live on `ScreenShell.Footer`
  // (`pb-[max(0.5rem,env(safe-area-inset-bottom))]`) so CTAs clear the
  // home indicator on iPhone without `calc(1rem + env(...))` stacking,
  // and desktop preview still gets 8 px off the window edge. See
  // `ScreenShell.tsx` for the full rationale.
  // `pt-[env(safe-area-inset-top)]` stays on `<main>` so every screen
  // (shell or not, status-message or not) pays the notch cost once
  // here.
  //
  // `min-h-0` on `<main>` is the flex-overflow gotcha: without it
  // the flex child refuses to shrink past its intrinsic content size
  // and the shell's internal scroll never engages.
  return (
    <div
      className="flex flex-col overflow-y-auto bg-surface-calm font-sans"
      style={{ height: 'var(--app-height, 100dvh)' }}
    >
      <main className="flex min-h-0 flex-1 flex-col px-4 pt-[env(safe-area-inset-top)]">
        {/*
          Route roots (ScreenShell, etc.) must participate in this flex
          column or `main` keeps unused height below a content-sized
          screen — same `surface-calm` as the footer, so iPhone testers
          read it as “huge padding under the CTAs” even when the real
          culprit is flex distribution, not `ScreenShell.Footer` pb.
          `min-h-0` preserves the overflow chain for internal Body scroll.
        */}
        <div className="flex min-h-0 flex-1 flex-col [&>*]:min-h-0 [&>*]:flex-1">
          {children}
        </div>
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
            <Route path={routePaths.drillCheck} element={<DrillCheckScreen />} />
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
