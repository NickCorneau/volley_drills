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
  return (
    <div className="min-h-[100dvh] flex flex-col font-sans bg-bg-primary pb-[env(safe-area-inset-bottom)]">
      <main className="flex-1 px-4 pt-[env(safe-area-inset-top)]">{children}</main>
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
