import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SkillLevelPicker } from '../components/onboarding/SkillLevelPicker'
import { ScreenShell } from '../components/ui'
import { isSchemaBlocked } from '../lib/schema-blocked'
import { type SkillLevel } from '../lib/skillLevel'
import { loadVoiceFromStorage, type Voice } from '../lib/voiceFromContext'
import { routes } from '../routes'
import { setStorageMetaMany } from '../services/storageMeta'

/**
 * C-3 Unit 2 / D121 / D-C4 (pair-first functional-bands onboarding).
 *
 * First-open lands here (via `FirstOpenGate`). Four action-anchored
 * functional bands + a "Not sure yet" escape. Each tap atomically
 * writes `onboarding.skillLevel` + `onboarding.step = 'todays_setup'` to
 * `storageMeta` via `setStorageMetaMany` (a single transaction so a
 * crash between writes cannot leave `step` pointing at a screen that
 * depends on an unwritten `skillLevel`) and navigates to Today's Setup.
 *
 * Surface decisions per the C-3 plan Key Decisions 3 and 8:
 * - Short action-anchored descriptors, not D121's long helper sentences.
 *   Copy table is module-local so it's easy to tweak without migrations.
 * - "Not sure yet" is a text button (not a fifth primary chip) to keep
 *   the primary rail four-tall.
 * - No back arrow - first-open = no prior screen (H9).
 *
 * Phase F Unit 2 (2026-04-19) amendment, revised 2026-04-19 (D128):
 * - Voice is `storageMeta.lastPlayerMode`-driven when a signal exists
 *   (written on every `createSessionFromDraft` call). A returning
 *   tester's prior mode is what they see next time.
 * - **Cold-state default is solo voice** ("Where are you today?"),
 *   aligning screen one with `D5` (solo is the lead activation path).
 *   The original Phase F cut defaulted to pair and let solo voice
 *   light up only for returning solo testers; D128 flips that because
 *   pair-voice-on-cold-open misframes the lead audience on their very
 *   first screen ("Where's the pair today?" reads as "not for me" to a
 *   solo user). Returning pair testers still see pair voice because
 *   `lastPlayerMode === 'pair'` overrides the default.
 * - Taxonomy enum (`SkillLevel`) is **unchanged** - only the rendered
 *   copy differs. Persisted `storageMeta.onboarding.skillLevel` stays
 *   identical across voices so the M001-build adaptation engine sees
 *   one taxonomy regardless of how the onboarding copy read on the
 *   day.
 *
 * See `docs/decisions.md` D-C4 Phase F amendment, D122 bullet 3, and
 * D128 (cold-state voice default follow-on).
 */

/**
 * Heading copy is screen-level (the SkillLevelPicker body is shared
 * with `SettingsSkillLevelScreen`, which uses different headings).
 * Band descriptors live inside `SkillLevelPicker` and are voice-driven
 * there. This keeps the D121 / D128 first-open contract intact while
 * letting the Settings sub-route reuse the same picker body.
 */
function headingForVoice(voice: Voice): string {
  return voice === 'pair' ? 'Where\u2019s the pair today?' : 'Where are you today?'
}

export function SkillLevelScreen() {
  const navigate = useNavigate()
  const acting = useRef(false)
  // D128 (2026-04-19): render solo-voice copy until the async voice
  // read resolves. On the cold-state first-open this is the final
  // value (aligns screen one with D5: solo is the lead activation
  // path). On a returning pair tester, the copy flips to pair voice
  // once `loadVoiceFromStorage` resolves (single Dexie read, <5 ms
  // in practice). The brief flicker is acceptable because (a) first
  // open is a single render with no flip, and (b) the returning-pair
  // case only happens after at least one pair session completed - the
  // user has already been onboarded once and the flicker is not their
  // first impression.
  const [voice, setVoice] = useState<Voice>('solo')

  useEffect(() => {
    let cancelled = false
    void loadVoiceFromStorage()
      .then((loaded) => {
        if (cancelled) return
        if (loaded) setVoice(loaded)
      })
      .catch((err) => {
        if (!cancelled && !isSchemaBlocked()) {
          console.error('SkillLevelScreen: voice load failed', err)
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
        await setStorageMetaMany({
          'onboarding.skillLevel': level,
          'onboarding.step': 'todays_setup',
        })
        navigate(routes.onboardingTodaysSetup())
      } catch (err) {
        acting.current = false
        if (isSchemaBlocked()) return
        console.error('SkillLevelScreen: failed to persist skill level', err)
      }
    },
    [navigate],
  )

  const heading = headingForVoice(voice)

  return (
    <ScreenShell>
      {/*
        2026-04-22 iPhone-viewport layout pass: converted to `ScreenShell`
        for consistency. Skill level has no pinned CTA — the tap-target
        cards ARE the CTAs — so the footer is intentionally absent and
        the body fills the viewport. The five option cards plus heading
        + subtitle can overflow on short viewports (iPhone SE 375 × 667);
        the body scrolls independently in that case without dragging
        the rest of the chrome offscreen.

        2026-05-04 (skill-level-mutability ship, U4): the 5-card body
        is extracted to `SkillLevelPicker` so the Settings sub-route
        can reuse the same chrome with different headers and post-pick
        callbacks. This screen wraps the picker with the onboarding-
        flavored heading + subtitle and the onboarding completion
        write inside `handlePick`.
      */}
      <ScreenShell.Header className="flex flex-col gap-2 pt-8 pb-4">
        <h1 className="text-xl font-semibold tracking-tight text-text-primary">{heading}</h1>
        <p className="text-sm text-text-secondary">
          Your rough current level. We size today&apos;s drills to match. Change anytime.
        </p>
      </ScreenShell.Header>

      <ScreenShell.Body className="pb-6">
        <SkillLevelPicker onPick={handlePick} />
      </ScreenShell.Body>
    </ScreenShell>
  )
}
