import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useHomeScreenState } from '../useHomeScreenState'
import * as sessionService from '../../../services/session'

vi.mock('../../../services/session', () => ({
  expireStaleReviews: vi.fn(),
  findPendingReview: vi.fn(),
  findResumableSession: vi.fn(),
  getCurrentDraft: vi.fn(),
  getLastComplete: vi.fn(),
  getRecentSessions: vi.fn(),
}))

describe('useHomeScreenState', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(sessionService.findResumableSession).mockResolvedValue(null)
    vi.mocked(sessionService.expireStaleReviews).mockResolvedValue(0)
    vi.mocked(sessionService.findPendingReview).mockResolvedValue(null)
    vi.mocked(sessionService.getCurrentDraft).mockResolvedValue(null)
    vi.mocked(sessionService.getLastComplete).mockResolvedValue(null)
    vi.mocked(sessionService.getRecentSessions).mockResolvedValue([])
  })

  it('resolves loading to ready flags', async () => {
    const { result } = renderHook(() => useHomeScreenState())

    expect(result.current.state.kind).toBe('loading')
    await waitFor(() => expect(result.current.state.kind).toBe('ready'))

    expect(sessionService.findResumableSession).toHaveBeenCalledTimes(1)
    expect(sessionService.expireStaleReviews).toHaveBeenCalledTimes(1)
    expect(result.current.state).toMatchObject({
      kind: 'ready',
      flags: {
        resume: null,
        reviewPending: null,
        draft: null,
        lastComplete: null,
        recentSessions: [],
      },
    })
  })

  it('retry re-enters loading and resolves again', async () => {
    let resolveRetry!: (value: null) => void
    vi.mocked(sessionService.findResumableSession)
      .mockResolvedValueOnce(null)
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveRetry = resolve
          }),
      )
    const { result } = renderHook(() => useHomeScreenState())
    await waitFor(() => expect(result.current.state.kind).toBe('ready'))

    await act(async () => {
      result.current.retry()
    })

    expect(result.current.state.kind).toBe('loading')
    resolveRetry(null)
    await waitFor(() => expect(result.current.state.kind).toBe('ready'))
    expect(sessionService.findResumableSession).toHaveBeenCalledTimes(2)
  })
})
