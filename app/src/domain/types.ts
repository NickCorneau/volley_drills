import type { ArchetypeId, BlockSlotType } from '../types/session';

export interface PresetDefinition {
  id: string;
  name: string;
  playerCount: 1 | 2;
  archetypeId: ArchetypeId;
  environment: string;
  description: string;
  totalMinutes: number;
}

export interface PlannedBlock {
  id: string;
  type: BlockSlotType;
  drillName: string;
  shortName: string;
  durationMinutes: number;
  coachingCue: string;
  courtsideInstructions: string;
  required: boolean;
}
