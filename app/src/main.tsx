import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
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
