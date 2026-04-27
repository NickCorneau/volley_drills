import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../../db'
import * as exportService from '../../services/export'
import { SettingsScreen } from '../SettingsScreen'

async function clearDb() {
  await Promise.all([
    db.sessionPlans.clear(),
    db.executionLogs.clear(),
    db.sessionReviews.clear(),
    db.timerState.clear(),
    db.sessionDrafts.clear(),
    db.storageMeta.clear(),
  ])
}

beforeEach(async () => {
  await clearDb()
})

describe('SettingsScreen (V0B-15 / Phase E Unit 2)', () => {
  it('Back button routes to Home', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/settings']}>
        <Routes>
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="/" element={<div data-testid="home-route">home</div>} />
        </Routes>
      </MemoryRouter>,
    )

    await user.click(await screen.findByRole('button', { name: /back/i }))
    expect(await screen.findByTestId('home-route')).toBeInTheDocument()
  })

  it('Export button calls downloadExport exactly once per tap', async () => {
    const user = userEvent.setup()
    const downloadSpy = vi.spyOn(exportService, 'downloadExport').mockResolvedValue(undefined)

    render(
      <MemoryRouter initialEntries={['/settings']}>
        <Routes>
          <Route path="/settings" element={<SettingsScreen />} />
        </Routes>
      </MemoryRouter>,
    )

    const btn = screen.getByRole('button', { name: /export training records/i })
    await user.click(btn)
    await waitFor(() => expect(downloadSpy).toHaveBeenCalledTimes(1))

    downloadSpy.mockRestore()
  })

  it('renders success copy after a completed export', async () => {
    const user = userEvent.setup()
    const downloadSpy = vi.spyOn(exportService, 'downloadExport').mockResolvedValue(undefined)

    render(
      <MemoryRouter initialEntries={['/settings']}>
        <Routes>
          <Route path="/settings" element={<SettingsScreen />} />
        </Routes>
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /export training records/i }))

    expect(await screen.findByText(/export saved.*check your downloads/i)).toBeInTheDocument()

    downloadSpy.mockRestore()
  })

  it('renders error copy when downloadExport rejects', async () => {
    const user = userEvent.setup()
    const downloadSpy = vi
      .spyOn(exportService, 'downloadExport')
      .mockRejectedValue(new Error('boom'))
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <MemoryRouter initialEntries={['/settings']}>
        <Routes>
          <Route path="/settings" element={<SettingsScreen />} />
        </Routes>
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /export training records/i }))

    expect(await screen.findByText(/export failed/i)).toBeInTheDocument()

    downloadSpy.mockRestore()
    consoleSpy.mockRestore()
  })

  // 2026-04-26 pre-D91 editorial polish (`F14`): a small build-id
  // row in the footer surfaces a copy-pasteable build identifier so
  // the founder can answer "what build are you on?" in one tap when
  // a D91 field-test tester reports a bug. Values come from the
  // Vite `define` injection in `vite.config.ts`; the test runtime
  // pins them to `'test'` / `'test'` via `src/test-setup.ts` so this
  // assertion is stable across machines and git states. See
  // `docs/plans/2026-04-26-pre-d91-editorial-polish.md` Item 6.
  it('renders the build-id row in the footer', () => {
    render(
      <MemoryRouter initialEntries={['/settings']}>
        <Routes>
          <Route path="/settings" element={<SettingsScreen />} />
        </Routes>
      </MemoryRouter>,
    )

    const buildRow = screen.getByTestId('settings-build-id')
    expect(buildRow).toBeInTheDocument()
    expect(buildRow).toHaveTextContent(/^Build test · test$/)
  })

  it('double-tap guard: a second tap while exporting does NOT trigger a second download', async () => {
    const user = userEvent.setup()
    let resolveDownload: () => void = () => {}
    const downloadSpy = vi.spyOn(exportService, 'downloadExport').mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveDownload = resolve
        }),
    )

    render(
      <MemoryRouter initialEntries={['/settings']}>
        <Routes>
          <Route path="/settings" element={<SettingsScreen />} />
        </Routes>
      </MemoryRouter>,
    )

    const btn = screen.getByRole('button', { name: /export training records/i })
    await user.click(btn)
    // Button should flip to "Exporting…" (state.kind === 'exporting' -> disabled)
    expect(screen.getByRole('button', { name: /exporting/i })).toBeDisabled()

    // A racing tap during the in-flight export is blocked by both the
    // acting.current guard AND the disabled state; simulate the worst
    // case by clicking a freshly-queried button.
    await user.click(screen.getByRole('button', { name: /exporting/i }))
    resolveDownload()
    await waitFor(() => expect(downloadSpy).toHaveBeenCalledTimes(1))

    downloadSpy.mockRestore()
  })
})
