import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { TransitionRedirect } from '../TransitionRedirect'

/**
 * Run-flow beat contract Stage 4 (D167, R14): the `/run/transition` route is
 * a reversible, deep-link-safe redirect into the live `/run` get-ready beat —
 * not the standalone Transition read (which would double the setup read +
 * receipt one tap before the get-ready shows them). These specs pin that the
 * orphaned route forwards (with `replace`) and preserves the `id`.
 */
function LocationProbe() {
  const location = useLocation()
  return <div data-testid="probe">{`${location.pathname}${location.search}`}</div>
}

function renderAt(entry: string) {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route path="/run/transition" element={<TransitionRedirect />} />
        <Route
          path="/run"
          element={
            <>
              <LocationProbe />
              <div>RunScreen stub</div>
            </>
          }
        />
        <Route
          path="/"
          element={
            <>
              <LocationProbe />
              <div>HomeScreen stub</div>
            </>
          }
        />
      </Routes>
    </MemoryRouter>,
  )
}

describe('TransitionRedirect (Stage 4 orphan redirect, D167)', () => {
  it('redirects a stale /run/transition deep link to the live /run get-ready, preserving the id', () => {
    renderAt('/run/transition?id=exec-stale-link')
    expect(screen.getByTestId('probe')).toHaveTextContent('/run?id=exec-stale-link')
    expect(screen.getByText('RunScreen stub')).toBeInTheDocument()
  })

  it('url-encodes the execution id on the way through', () => {
    renderAt('/run/transition?id=exec%2Fweird%20id')
    expect(screen.getByTestId('probe')).toHaveTextContent('/run?id=exec%2Fweird%20id')
  })

  it('falls back to home when no id is present (mirrors the session-not-found posture)', () => {
    renderAt('/run/transition')
    expect(screen.getByText('HomeScreen stub')).toBeInTheDocument()
    expect(screen.getByTestId('probe')).toHaveTextContent('/')
  })
})
