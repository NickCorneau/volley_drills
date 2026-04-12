import { DRILLS } from '../data/drills';
import type { Drill } from '../types/drill';
import type { PlannedBlock, PresetDefinition } from './types';

const drillById = new Map<string, Drill>(DRILLS.map((d) => [d.id, d]));

function getDrill(drillId: string): Drill {
  const drill = drillById.get(drillId);
  if (!drill) {
    throw new Error(`Unknown drill: ${drillId}`);
  }
  return drill;
}

function plannedBlockFromVariant(
  blockId: string,
  blockType: PlannedBlock['type'],
  drillId: string,
  variantId: string,
  durationMinutes: number,
  required: boolean,
): PlannedBlock {
  const drill = getDrill(drillId);
  const variant = drill.variants.find((v) => v.id === variantId);
  if (!variant) {
    throw new Error(`Unknown variant ${variantId} for drill ${drillId}`);
  }
  return {
    id: blockId,
    type: blockType,
    drillName: drill.name,
    shortName: drill.shortName,
    durationMinutes,
    coachingCue: variant.coachingCues.join(' · '),
    courtsideInstructions: variant.courtsideInstructions,
    required,
  };
}

export const PRESETS: PresetDefinition[] = [
  {
    id: 'wall-pass',
    name: 'Wall Pass Workout',
    playerCount: 1,
    archetypeId: 'solo_wall',
    environment: 'Solo · ~12 min · Wall + ball',
    description:
      'Wall rebound passing: easy warm-up, wall pass volume, then cool-down.',
    totalMinutes: 12,
  },
  {
    id: 'open-sand',
    name: 'Open Sand Workout',
    playerCount: 1,
    archetypeId: 'solo_open',
    environment: 'Solo · ~12 min · Ball + markers',
    description:
      'Open sand self-toss passing: warm-up, set-window self-toss reps, cool-down.',
    totalMinutes: 12,
  },
  {
    id: 'partner-pass',
    name: 'Partner Pass Workout',
    playerCount: 2,
    archetypeId: 'pair_net',
    environment: 'Pair · ~15 min · Net + ball',
    description:
      'Partner passing at the net: warm-up tosses, partner pass main set, cool-down.',
    totalMinutes: 15,
  },
];

const PRESET_BLOCK_BUILDERS: Record<string, () => PlannedBlock[]> = {
  'wall-pass': () => [
    plannedBlockFromVariant(
      'wall-pass-warmup',
      'warmup',
      'd01',
      'd01-solo',
      3,
      true,
    ),
    plannedBlockFromVariant(
      'wall-pass-main',
      'main_skill',
      'd24',
      'd24-solo',
      6,
      false,
    ),
    plannedBlockFromVariant(
      'wall-pass-cooldown',
      'wrap',
      'd25',
      'd25-solo',
      3,
      true,
    ),
  ],
  'open-sand': () => [
    plannedBlockFromVariant(
      'open-sand-warmup',
      'warmup',
      'd01',
      'd01-solo',
      3,
      true,
    ),
    plannedBlockFromVariant(
      'open-sand-main',
      'main_skill',
      'd05',
      'd05-solo',
      6,
      false,
    ),
    plannedBlockFromVariant(
      'open-sand-cooldown',
      'wrap',
      'd25',
      'd25-solo',
      3,
      true,
    ),
  ],
  'partner-pass': () => [
    plannedBlockFromVariant(
      'partner-pass-warmup',
      'warmup',
      'd03',
      'd03-pair',
      3,
      true,
    ),
    plannedBlockFromVariant(
      'partner-pass-main',
      'main_skill',
      'd04',
      'd04-pair',
      9,
      false,
    ),
    plannedBlockFromVariant(
      'partner-pass-cooldown',
      'wrap',
      'd25',
      'd25-solo',
      3,
      true,
    ),
  ],
};

export function buildPresetBlocks(presetId: string): PlannedBlock[] {
  const build = PRESET_BLOCK_BUILDERS[presetId];
  return build ? build() : [];
}

export function getPresetsForPlayerCount(count: 1 | 2): PresetDefinition[] {
  return PRESETS.filter((p) => p.playerCount === count);
}
