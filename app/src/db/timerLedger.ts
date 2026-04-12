import { db } from './schema';
import type { TimerState } from './types';

const ACTIVE_ID = 'active' as const;

export async function flushTimerState(state: TimerState): Promise<void> {
  await db.timerState.put({ ...state, id: ACTIVE_ID });
}

export async function readTimerState(): Promise<TimerState | undefined> {
  return db.timerState.get(ACTIVE_ID);
}

export async function clearTimerState(): Promise<void> {
  await db.timerState.delete(ACTIVE_ID);
}
