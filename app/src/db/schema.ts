import Dexie, { type Table } from 'dexie';
import type {
  ExecutionLog,
  SessionPlan,
  SessionReview,
  TimerState,
} from './types';

export class VolleyDrillsDB extends Dexie {
  sessionPlans!: Table<SessionPlan, string>;
  executionLogs!: Table<ExecutionLog, string>;
  sessionReviews!: Table<SessionReview, string>;
  timerState!: Table<TimerState, string>;

  constructor() {
    super('volley-drills');
    this.version(1).stores({
      sessionPlans: 'id',
      executionLogs: 'id, planId',
      sessionReviews: 'id, executionLogId',
      timerState: 'id',
    });
  }
}

export const db = new VolleyDrillsDB();
