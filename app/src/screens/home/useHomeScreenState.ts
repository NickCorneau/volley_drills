import { useCallback, useEffect, useState } from 'react'
import type { SessionDraft } from '../../db'
import { isSchemaBlocked } from '../../lib/schema-blocked'
import {
  expireStaleReviews,
  findPendingReview,
  findResumableSession,
  getCurrentDraft,
  getLastComplete,
  getRecentSessions,
  type LastCompleteBundle,
  type PendingReview,
  type RecentSessionEntry,
  type ResumableSession,
} from '../../services/session'

export interface HomeFlags {
  resume: ResumableSession | null
  reviewPending: PendingReview | null
  draft: SessionDraft | null
  lastComplete: LastCompleteBundle | null
  /**
   * Tier 1a Unit 5 (2026-04-20): last-3-sessions list. Read alongside
   * the other Home flags; `[]` on a fresh install (RecentSessionsList
   * renders nothing in that case). Not read on the Resume branch -
   * the Resume card is the only allowed surface when a resumable
   * session exists, so loading the recent list there would be work
   * the user never sees.
   */
  recentSessions: readonly RecentSessionEntry[]
}

export type HomeState = { kind: 'loading' } | { kind: 'ready'; flags: HomeFlags } | { kind: 'error' }

async function resolveHomeFlags(): Promise<HomeFlags> {
  const resume = await findResumableSession()
  if (resume) {
    return {
      resume,
      reviewPending: null,
      draft: null,
      lastComplete: null,
      recentSessions: [],
    }
  }

  // V0B-31 / D120 (C-1 Unit 1 rel-6 fix): auto-finalize past-cap
  // sessions before resolving the rest of Home state so stale records
  // fall through to LastComplete correctly.
  await expireStaleReviews()

  // Tier 1a Unit 5 (2026-04-20): read these flags together so Home paints
  // once with a consistent precedence snapshot.
  const [reviewPending, draft, lastComplete, recentSessions] = await Promise.all([
    findPendingReview(),
    getCurrentDraft(),
    getLastComplete(),
    getRecentSessions(3),
  ])

  return {
    resume: null,
    reviewPending,
    draft,
    lastComplete,
    recentSessions,
  }
}

export function useHomeScreenState() {
  const [state, setState] = useState<HomeState>({ kind: 'loading' })
  const [resolveVersion, setResolveVersion] = useState(0)
  const setError = useCallback(() => setState({ kind: 'error' }), [])
  const retry = useCallback(() => {
    setState({ kind: 'loading' })
    setResolveVersion((version) => version + 1)
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const flags = await resolveHomeFlags()
        if (cancelled) return
        setState({ kind: 'ready', flags })
      } catch {
        if (cancelled) return
        // SchemaBlockedOverlay owns the UI during a concurrent-tab upgrade.
        if (isSchemaBlocked()) return
        setState({ kind: 'error' })
      }
    })()
    return () => {
      cancelled = true
    }
  }, [resolveVersion])

  return {
    state,
    setError,
    retry,
  }
}
