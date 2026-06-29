import { FOCAL_SURFACE_CLASS } from '../ui/Card'
import { cx } from '../../lib/cn'
import { SKILL_LEVEL_LABEL, SKILL_LEVELS, type SkillLevel } from '../../lib/skillLevel'

/**
 * Shared 5-card Skill Level picker body. Extracted from
 * `SkillLevelScreen` so the onboarding screen and the new Settings
 * sub-route (`SettingsSkillLevelScreen`) render identical chrome with
 * different headers and post-pick callbacks.
 *
 * Origin: 2026-05-04 skill-level-mutability ship, U4. See
 * `docs/brainstorms/2026-05-04-skill-level-mutability-requirements.md`
 * §"Architecture Direction" / R21 + KD3 for the reuse contract.
 *
 * Behavior preserved verbatim from `SkillLevelScreen`'s body:
 * - Four functional bands rendered first; "Not sure yet" rendered last.
 * - Pick callback receives the chosen `SkillLevel`; the wrapper
 *   handles persistence + navigation per its surface's needs.
 *
 * Voice (solo vs pair) extension point: today's band descriptors are
 * neutral between solo and pair voices ("Pass easy serves" works in
 * both), so this component does NOT take a `voice` prop — voice-
 * driven copy lives at the wrapper screen level (heading copy in
 * `SkillLevelScreen` and `SettingsSkillLevelScreen`). When the full
 * D121 pair-vs-solo pronoun pass lands and per-band descriptors need
 * to diverge, reintroduce the prop here. Until then a `voice` prop
 * would be dead code (PAIR_COPY === SOLO_COPY for descriptors).
 */

const BAND_DESCRIPTORS: Record<Exclude<SkillLevel, 'unsure'>, string> = {
  foundations: 'Keeping a friendly toss alive.',
  rally_builders: 'Pass easy serves, short rallies.',
  side_out_builders: 'Pass to a spot, then hit the third touch.',
  competitive_pair: 'Tougher serves, game-like play.',
}

const BANDS = SKILL_LEVELS.filter((l): l is Exclude<SkillLevel, 'unsure'> => l !== 'unsure')

export interface SkillLevelPickerProps {
  onPick: (level: SkillLevel) => Promise<void> | void
  currentLevel?: SkillLevel
  /**
   * T6 competing-focal-weight (2026-06-22 shibui audit): the band to
   * mark as the recommended default, giving the five equal option cards
   * a single dominant entry point. This is the suggested band, NOT the
   * "if unsure" path — the "Not sure yet" card remains the dedicated
   * opt-out for a user who won't self-assess. Opt-in — passed by the
   * onboarding `SkillLevelScreen` and omitted by the Settings sub-route
   * (a returning user already has a Current band, so a recommendation
   * there would be noise). A band that is both
   * `currentLevel` and `recommendedLevel` shows only "Current" (current
   * state outranks a suggestion); in practice the two never co-occur
   * because only onboarding passes `recommendedLevel`.
   *
   * Typed `Exclude<SkillLevel, 'unsure'>` (unlike `currentLevel`, which
   * a user can genuinely have set to `unsure`): a recommended "start
   * here" default must be one of the four functional bands, never the
   * "Not sure yet" card, so a nonsensical recommendation fails at the
   * call site instead of silently badging the unsure card.
   */
  recommendedLevel?: Exclude<SkillLevel, 'unsure'>
  /**
   * Custom copy under the "Not sure yet" card. Defaults to
   * `DEFAULT_UNSURE_SUBTEXT`; the Settings sub-route passes its own copy
   * explicitly.
   */
  unsureSubtext?: string
}

// T2 (2026-06-22 shibui audit, one home per fact): this default used to
// append "You can change this after.", repeating the onboarding header
// subtitle's "Change anytime." The subtitle is the single home for the
// change-later fact, so the clause was trimmed here.
const DEFAULT_UNSURE_SUBTEXT = "We'll size a light starter."

export function SkillLevelPicker({
  onPick,
  currentLevel,
  recommendedLevel,
  unsureSubtext,
}: SkillLevelPickerProps) {
  const renderCard = (level: SkillLevel, description: string) => {
    const isCurrent = level === currentLevel
    const isRecommended = !isCurrent && level === recommendedLevel
    return (
      <button
        type="button"
        onClick={() => void onPick(level)}
        aria-current={isCurrent ? 'true' : undefined}
        className={cx(
          'flex min-h-[64px] w-full flex-col items-start gap-1 px-5 py-4 text-left outline-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent hover:bg-bg-warm active:bg-bg-warm',
          FOCAL_SURFACE_CLASS,
          isCurrent && 'outline outline-1 outline-accent',
        )}
      >
        {/*
          Title at `text-base` (16px) so it reads a step above the
          `text-sm` descriptor below — within-card hierarchy was carried
          by weight alone when both lines sat at 14px. The "Current" /
          "Recommended" badge keeps its own `text-xs`.
        */}
        <span className="flex w-full items-center justify-between gap-3 text-base font-semibold text-text-primary">
          <span>{SKILL_LEVEL_LABEL[level]}</span>
          {(isCurrent || isRecommended) && (
            <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
              {isCurrent ? 'Current' : 'Recommended'}
            </span>
          )}
        </span>
        <span className="text-sm text-text-secondary">{description}</span>
      </button>
    )
  }

  return (
    <ul className="flex flex-col gap-4" aria-label="Skill level options">
      {BANDS.map((level) => (
        <li key={level}>
          {renderCard(level, BAND_DESCRIPTORS[level])}
        </li>
      ))}
      <li>
        {renderCard('unsure', unsureSubtext ?? DEFAULT_UNSURE_SUBTEXT)}
      </li>
    </ul>
  )
}
