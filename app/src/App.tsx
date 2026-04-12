import { Routes, Route } from 'react-router-dom'
import { CompleteScreen } from './screens/CompleteScreen'
import { ReviewScreen } from './screens/ReviewScreen'
import { RunScreen } from './screens/RunScreen'
import { SafetyCheckScreen } from './screens/SafetyCheckScreen'
import { StartScreen } from './screens/StartScreen'
import { TransitionScreen } from './screens/TransitionScreen'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col font-sans bg-bg-primary pb-[env(safe-area-inset-bottom)]">
      <main className="flex-1 px-4 pt-[env(safe-area-inset-top)]">
        {children}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<StartScreen />} />
        <Route path="/safety" element={<SafetyCheckScreen />} />
        <Route path="/run" element={<RunScreen />} />
        <Route path="/run/transition" element={<TransitionScreen />} />
        <Route path="/review" element={<ReviewScreen />} />
        <Route path="/complete" element={<CompleteScreen />} />
      </Routes>
    </Layout>
  )
}
