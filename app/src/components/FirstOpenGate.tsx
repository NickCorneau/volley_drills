import { useEffect, useState, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { isOnboardingStep } from '../lib/onboarding'
import { isSchemaBlocked } from '../lib/schema-blocked'
import { routes } from '../routes'
import { getStorageMeta } from '../services/storageMeta'

/**
 * C-3 Unit 1 (red-team fix plan v3 H9 / H15): first-open routing gate.
 *
 * When `storageMeta.onboarding.completedAt` is absent and the app opens `/`,
 * redirect to the appropriate onboarding screen
 * based on `storageMeta.onboarding.step` (default: `skill_level`). When
 * the key IS set (either the tester already completed C-3 OR the C-0 v4
 * upgrade backfilled it for an existing v0a tester), render children
 * untouched.
 *
 * The gate renders `null` until the Dexie read resolves to avoid
 * HomeScreen flashing behind an in-flight redirect. The read is fast
 * (single `storageMeta.get(key)`); tests treat the ~5 ms as the render
 * budget and use `findBy*` queries that tolerate it.
 *
 * Schema-blocked handling: when a concurrent tab triggers a schema
 * upgrade during the read, `getStorageMeta` rejects with
 * `DatabaseClosedError`. SchemaBlockedOverlay already owns the UI in
 * that case, so we suppress the fallback and leave the gate in its
 * loading state. The overlay reload will re-run this effect.
 */

const isTimestamp = (v: unknown): v is number =>
  typeof v === 'number' && Number.isFinite(v) && v > 0

export function FirstOpenGate({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [resolved, setResolved] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const completedAt = await getStorageMeta('onboarding.completedAt', isTimestamp)
        if (cancelled) return
        if (completedAt != null) {
          setResolved(true)
          return
        }
        // Not yet completed - route to the step the user left off on,
        // defaulting to Skill Level.
        const step = await getStorageMeta('onboarding.step', isOnboardingStep)
        if (cancelled) return
        const target =
          step === 'todays_setup' ? routes.onboardingTodaysSetup() : routes.onboardingSkillLevel()
        // R1 (C-3): only `/` is the first-open entry; deep links like `/run`
        // or `/safety` must still resolve so those screens can handle errors
        // and redirects without being forced through onboarding first.
        const isHomePath = pathname === '/' || pathname === ''
        if (isHomePath) {
          navigate(target, { replace: true })
        }
        setResolved(true)
      } catch (err) {
        if (cancelled || isSchemaBlocked()) return
        console.error('FirstOpenGate read failed:', err)
        // On non-schema-blocked failure, unblock the render so the tester
        // sees something instead of a silent loading screen. The worst
        // case is they reach Home without onboarding; Home's own resolve
        // + the C-0 backfill will reconcile most of that.
        setResolved(true)
      }
    })()
    return () => {
      cancelled = true
    }
    // `pathname` is intentionally excluded: we only want the gate to
    // resolve once on mount / route-tree-mount, not on every navigation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate])

  if (!resolved) return null
  return <>{children}</>
}
