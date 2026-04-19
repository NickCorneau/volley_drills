import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
// Phase F9 (2026-04-19): Inter is now bundled as a first-class build
// asset via Fontsource instead of loaded from `fonts.googleapis.com`
// at cold start. Side-effect import registers `@font-face` for the
// full weight axis (100–900) with subset-split `unicode-range` so the
// browser only fetches the Latin subset for an English UI. Precached
// by the existing `workbox.globPatterns: ['**/*.woff2']` rule. See
// `docs/plans/2026-04-19-feat-phase-f9-inter-self-host-plan.md` and
// `docs/vision.md` P10 (local-first).
import '@fontsource-variable/inter'
// Phase F10 (2026-04-19): JetBrains Mono Variable as the timer
// display face. Replaces the Tailwind `font-mono` system-font
// lottery (Consolas on Windows, Menlo on macOS, DejaVu on Android)
// on the BlockTimer and RunScreen preroll countdown — the two
// surfaces the athlete stares at during a session. OFL-licensed,
// bundled by Vite, precached by the same workbox glob as Inter. See
// `docs/plans/2026-04-19-feat-phase-f10-timer-display-face-plan.md`.
import '@fontsource-variable/jetbrains-mono'
import './index.css'
import './lib/pwa-register'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)

// Note (V0B-25 / D118): `navigator.storage.persist()` is no longer called at
// module load. WebKit grants persistence heuristically and responds better to
// a real user-gesture save boundary; the call moved into
// `createSessionFromDraft` (see `services/session.ts`). See
// `docs/research/local-first-pwa-constraints.md`.

// Service worker registration is performed once at module load by the
// side-effect import of `./lib/pwa-register` above. The hook exposed there
// (`useAppRegisterSW`) is subscribed from `HomeScreen` / `CompleteScreen` to
// surface an explicit update prompt at safe boundaries per D41.
