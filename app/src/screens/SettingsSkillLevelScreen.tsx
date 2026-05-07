import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SkillLevelPicker } from '../components/onboarding/SkillLevelPicker'
import { ScreenHeader, ScreenShell } from '../components/ui'
import { isSchemaBlocked } from '../lib/schema-blocked'
import { isSkillLevel, type SkillLevel } from '../lib/skillLevel'
import { loadVoiceFromStorage, type Voice } from '../lib/voiceFromContext'
import { routes } from '../routes'
import { getStorageMeta, setStorageMetaMany } from '../services/storageMeta'

/**
 * 2026-05-04 skill-level-mutability ship, U5: Settings sub-route for
 * the durable change to `storageMeta.onboarding.skillLevel`.
 *
 * Reuses the shared 5-card `SkillLevelPicker` with a Settings-flavored
 * heading, current-level marker, and back navigation. Critically distinct
 * from `SkillLevelScreen` (the first-open onboarding screen):
 *
 * - Heading reads as a change-flavored prompt ("Update your level"),
 *   not a first-time identity prompt ("Where are you today?").
 * - Pick writes ONLY `onboarding.skillLevel`. The `'onboarding.step'`
 *   field is NOT mutated — the user has already completed onboarding,
 *   and step writes are first-run-only.
 * - Pick navigates back to `/settings` (not forward to the next
 *   onboarding step).
 * - Reachable only from Settings — `FirstOpenGate` continues to
 *   route fresh installs to `/onboarding/skill-level`.
 *
 * See `docs/brainstorms/2026-05-04-skill-level-mutability-requirements.md`
 * §"Requirements / Settings durable change" R2-R8 for the contract.
 */
export function SettingsSkillLevelScreen() {
  const navigate = useNavigate()
  const acting = useRef(false)
  const [voice, setVoice] = useState<Voice>('solo')
  const [currentLevel, setCurrentLevel] = useState<SkillLevel | null>(null)

  useEffect(() => {
    let cancelled = false
    void loadVoiceFromStorage()
      .then((loaded) => {
        if (!cancelled && loaded) setVoice(loaded)
      })
      .catch((err) => {
        if (!cancelled && !isSchemaBlocked()) {
          console.error('SettingsSkillLevelScreen: voice load failed', err)
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    void getStorageMeta('onboarding.skillLevel', isSkillLevel)
      .then((level) => {
        if (!cancelled) setCurrentLevel(level ?? null)
      })
      .catch((err) => {
        if (!cancelled && !isSchemaBlocked()) {
          console.error('SettingsSkillLevelScreen: skill level load failed', err)
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  const handlePick = useCallback(
    async (level: SkillLevel) => {
      if (acting.current) return
      acting.current = true
      try {
        // R5: write skillLevel ONLY; do NOT mutate onboarding.step.
        await setStorageMetaMany({ 'onboarding.skillLevel': level })
        navigate(routes.settings())
      } catch (err) {
        acting.current = false
        if (isSchemaBlocked()) return
        console.error('SettingsSkillLevelScreen: failed to persist skill level', err)
      }
    },
    [navigate],
  )

  // Heading copy candidate (DQ2). Pin during U7 review under
  // .cursor/rules/courtside-copy.mdc.
  const heading = voice === 'pair' ? 'Update your shared level' : 'Update your level'

  return (
    <ScreenShell>
      <ScreenHeader backLabel="Back" onBack={() => navigate(routes.settings())} title={heading} />

      <ScreenShell.Body className="pb-6">
        <p className="mb-4 text-sm text-text-secondary">
          Your rough current level. We size today&apos;s drills to match.
        </p>
        <SkillLevelPicker
          onPick={handlePick}
          currentLevel={currentLevel ?? undefined}
          unsureSubtext="We'll size a light starter."
        />
      </ScreenShell.Body>
    </ScreenShell>
  )
}
