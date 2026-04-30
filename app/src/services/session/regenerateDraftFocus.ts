import { db } from '../../db'
import type { SessionDraft, SetupContext } from '../../db'
import { buildDraft } from '../../domain/sessionBuilder'
import { isSchemaBlocked } from '../../lib/schema-blocked'
import { findLastCompletedDrillIdsByType } from './queries'

export type RegenerateDraftFocusResult =
  | { ok: true; draft: SessionDraft; changed: boolean }
  | { ok: false; reason: 'load' | 'stale' | 'build' | 'save' | 'schema_blocked' }

export interface RegenerateDraftFocusInput {
  expectedUpdatedAt: number
  sessionFocus?: SetupContext['sessionFocus']
  baselineDraft?: SessionDraft
  useBaseline?: boolean
}

function contextWithFocus(
  context: SetupContext,
  sessionFocus: SetupContext['sessionFocus'],
): SetupContext {
  const next: SetupContext = { ...context }
  if (sessionFocus) {
    next.sessionFocus = sessionFocus
  } else {
    delete next.sessionFocus
  }
  return next
}

function withFreshTimestamp(draft: SessionDraft): SessionDraft {
  return {
    ...draft,
    id: 'current',
    updatedAt: Date.now(),
  }
}

export async function regenerateDraftFocus(
  input: RegenerateDraftFocusInput,
): Promise<RegenerateDraftFocusResult> {
  try {
    let result: RegenerateDraftFocusResult | undefined

    await db.transaction('rw', db.sessionDrafts, db.executionLogs, db.sessionPlans, async () => {
      const current = await db.sessionDrafts.get('current')
      if (!current) {
        result = { ok: false, reason: 'load' }
        return
      }

      if (current.updatedAt !== input.expectedUpdatedAt) {
        result = { ok: false, reason: 'stale' }
        return
      }

      if (!input.useBaseline && current.context.sessionFocus === input.sessionFocus) {
        result = { ok: true, draft: current, changed: false }
        return
      }

      const nextDraft = input.useBaseline
        ? input.baselineDraft
        : buildDraft(contextWithFocus(current.context, input.sessionFocus), {
            lastCompletedByType: await findLastCompletedDrillIdsByType(),
          })

      if (!nextDraft) {
        result = { ok: false, reason: 'build' }
        return
      }

      const replacement = withFreshTimestamp(nextDraft)
      await db.sessionDrafts.put(replacement)
      result = { ok: true, draft: replacement, changed: true }
    })

    return result ?? { ok: false, reason: 'save' }
  } catch {
    return { ok: false, reason: isSchemaBlocked() ? 'schema_blocked' : 'save' }
  }
}
