import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { SessionDraft, SetupContext } from '../../model'
import { routes } from '../../routes'
import { getCurrentDraft, regenerateDraftFocus } from '../../services/session'

export type TuneTodayFocus = 'recommended' | 'pass' | 'serve' | 'set'

type TuneTodaySource = 'setup' | 'home'

type TuneTodayLocationState = {
  source?: TuneTodaySource
}

function isTuneTodayLocationState(value: unknown): value is TuneTodayLocationState {
  return typeof value === 'object' && value !== null && 'source' in value
}

function sourceFromLocationState(value: unknown): TuneTodaySource {
  if (!isTuneTodayLocationState(value)) return 'home'
  return value.source === 'setup' ? 'setup' : 'home'
}

function focusFromContext(context: SetupContext): TuneTodayFocus {
  return context.sessionFocus ?? 'recommended'
}

function focusWarning(focus: TuneTodayFocus): string {
  switch (focus) {
    case 'pass':
      return "Can't build a passing-focused session for this setup."
    case 'serve':
      return "Can't build a serving-focused session for this setup."
    case 'set':
      return "Can't build a setting-focused session for this setup."
    case 'recommended':
      return "Can't restore the recommendation right now."
  }
}

export function useTuneTodayController() {
  const navigate = useNavigate()
  const location = useLocation()
  const source = useMemo(() => sourceFromLocationState(location.state), [location.state])
  const cancelled = useRef(false)
  const baselineDraft = useRef<SessionDraft | null>(null)

  const [draft, setDraft] = useState<SessionDraft | null>(null)
  const [focus, setFocus] = useState<TuneTodayFocus>('recommended')
  const [loading, setLoading] = useState(true)
  const [pending, setPending] = useState(false)
  const [warning, setWarning] = useState<string | null>(null)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    cancelled.current = false
    ;(async () => {
      try {
        const current = await getCurrentDraft()
        if (cancelled.current) return
        if (!current) {
          navigate(routes.setup(), { replace: true })
          return
        }
        setDraft(current)
        setFocus(focusFromContext(current.context))
        if (!current.context.sessionFocus) {
          baselineDraft.current = current
        }
      } catch {
        if (!cancelled.current) setLoadError(true)
      } finally {
        if (!cancelled.current) setLoading(false)
      }
    })()

    return () => {
      cancelled.current = true
    }
  }, [navigate])

  const totalMinutes = useMemo(
    () => draft?.blocks.reduce((sum, block) => sum + block.durationMinutes, 0) ?? 0,
    [draft],
  )

  // Noun-phrase headings are more shibui than questions: the
  // radiogroup IS the answer, so the H1 just names the surface.
  const heading = draft?.context.playerMode === 'pair' ? "Today's shared focus" : "Today's focus"

  const selectFocus = useCallback(
    async (nextFocus: TuneTodayFocus) => {
      if (!draft || pending || nextFocus === focus) return
      const previousFocus = focus
      setFocus(nextFocus)
      setPending(true)
      setWarning(null)

      const result =
        nextFocus === 'recommended' && baselineDraft.current
          ? await regenerateDraftFocus({
              mode: 'restore_baseline',
              expectedUpdatedAt: draft.updatedAt,
              baselineDraft: baselineDraft.current,
            })
          : await regenerateDraftFocus({
              mode: 'regenerate',
              expectedUpdatedAt: draft.updatedAt,
              sessionFocus: nextFocus === 'recommended' ? undefined : nextFocus,
            })

      if (cancelled.current) return
      setPending(false)

      if (result.ok) {
        setDraft(result.draft)
        setFocus(focusFromContext(result.draft.context))
      } else if (result.reason !== 'schema_blocked') {
        setFocus(previousFocus)
        setWarning(focusWarning(nextFocus))
      }
    },
    [draft, focus, pending],
  )

  const continueToSafety = useCallback(() => {
    if (!pending) navigate(routes.safety())
  }, [navigate, pending])

  const goBack = useCallback(() => {
    if (pending) return
    if (source === 'setup') {
      navigate(routes.setup(), { state: { editDraft: true } })
    } else {
      navigate(routes.home())
    }
  }, [navigate, pending, source])

  // Deterministic recovery from the load-error state: setup is
  // always a valid place to start over, regardless of where the
  // user came from. Source-aware `goBack` would route a Home-source
  // user back to Home and trap them in a Home -> Continue ->
  // load error -> Home loop if reads keep failing.
  const goBackToSetup = useCallback(() => {
    navigate(routes.setup())
  }, [navigate])

  return {
    draft,
    focus,
    heading,
    loadError,
    loading,
    pending,
    selectFocus,
    totalMinutes,
    warning,
    continueToSafety,
    goBack,
    goBackToSetup,
  }
}
