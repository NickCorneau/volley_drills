import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FOCAL_SURFACE_CLASS } from '../components/ui/Card'
import { isSchemaBlocked } from '../lib/schema-blocked'
import {
  SKILL_LEVEL_LABEL,
  SKILL_LEVELS,
  type SkillLevel,
} from '../lib/skillLevel'
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
 * - No back arrow — first-open = no prior screen (H9).
 *
 * Phase F Unit 2 (2026-04-19) amendment:
 * - Voice swaps from pair to solo when `storageMeta.lastPlayerMode ===
 *   'solo'` (written on every `createSessionFromDraft` call). A
 *   returning tester with a prior solo session sees "Where are you
 *   today?" and solo-pronoun descriptors; first-open cold state
 *   defaults to pair voice.
 * - Taxonomy enum (`SkillLevel`) is **unchanged** — only the rendered
 *   copy differs. Persisted `storageMeta.onboarding.skillLevel` stays
 *   identical across voices so the M001-build adaptation engine sees
 *   one taxonomy regardless of how the onboarding copy read on the
 *   day.
 *
 * See `docs/decisions.md` D-C4 Phase F amendment + D122.
 */

interface Copy {
  heading: string
  descriptors: Record<Exclude<SkillLevel, 'unsure'>, string>
}

const PAIR_COPY: Copy = {
  heading: "Where\u2019s the pair today?",
  descriptors: {
    foundations: 'Keeping a friendly toss alive.',
    rally_builders: 'Pass easy serves, short rallies.',
    side_out_builders: 'Pass to target, attack the 3rd.',
    competitive_pair: 'Tougher serves, game-like play.',
  },
}

const SOLO_COPY: Copy = {
  heading: 'Where are you today?',
  descriptors: {
    foundations: 'Keeping a friendly toss alive.',
    rally_builders: 'Pass easy serves, short rallies.',
    side_out_builders: 'Pass to target, attack the 3rd.',
    competitive_pair: 'Tougher serves, game-like play.',
  },
}

/**
 * Band descriptors stay in functional-ability voice (neutral between
 * solo and pair — "Pass easy serves" works in both) so the only surface
 * that flips is the heading. This keeps Phase F's copy delta minimal
 * and preserves D121's action-anchored framing. When the full D121
 * pair-vs-solo pronoun pass lands in M001-build, these strings are the
 * extension point.
 */
function copyForVoice(voice: Voice): Copy {
  return voice === 'solo' ? SOLO_COPY : PAIR_COPY
}

const BANDS = SKILL_LEVELS.filter(
  (l): l is Exclude<SkillLevel, 'unsure'> => l !== 'unsure',
)

export function SkillLevelScreen() {
  const navigate = useNavigate()
  const acting = useRef(false)
  // Phase F Unit 2: render pair-voice copy until the async voice read
  // resolves. On the cold-state first-open this is the final value;
  // on a returning solo tester the copy flips once `loadVoiceFromStorage`
  // resolves (single Dexie read, <5 ms in practice). The flicker is
  // acceptable because the first-open case is a single render and the
  // returning-solo-tester case only happens after at least one prior
  // session completed — no regression on the thesis-critical first open.
  const [voice, setVoice] = useState<Voice>('pair')

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

  const copy = copyForVoice(voice)

  return (
    <div className="mx-auto flex w-full max-w-[390px] flex-col gap-6 pb-12 pt-8">
      <header className="flex flex-col gap-2">
        <p className="text-sm text-text-secondary">
          Welcome. Let&rsquo;s get you started.
        </p>
        <h1 className="text-xl font-bold tracking-tight text-text-primary">
          {copy.heading}
        </h1>
        <p className="text-sm text-text-secondary">You can change this later.</p>
      </header>

      {/* Phase F2 (2026-04-19): option cards now use the same calm
          focal-surface language as HomePrimaryCard / SettingsScreen —
          soft shadow + hairline ring instead of a hard `border-2`, a
          touch more vertical breathing between options, and slightly
          more internal padding so each option reads as a calm,
          deliberate choice rather than a checkbox row. */}
      <ul
        className="flex flex-col gap-4"
        aria-label="Skill level options"
      >
        {BANDS.map((level) => (
          <li key={level}>
            <button
              type="button"
              onClick={() => void handlePick(level)}
              className={`flex min-h-[64px] w-full flex-col items-start gap-1 px-5 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:bg-bg-warm ${FOCAL_SURFACE_CLASS}`}
            >
              <span className="text-base font-semibold text-text-primary">
                {SKILL_LEVEL_LABEL[level]}
              </span>
              <span className="text-sm text-text-secondary">
                {copy.descriptors[level]}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => void handlePick('unsure')}
        className="mx-auto min-h-[44px] px-3 text-sm font-medium text-text-secondary underline underline-offset-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {SKILL_LEVEL_LABEL.unsure}
      </button>
    </div>
  )
}
