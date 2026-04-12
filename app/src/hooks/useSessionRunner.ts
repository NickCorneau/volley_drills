import { useCallback, useEffect, useRef, useState } from 'react';
import { db, flushTimerState, clearTimerState, readTimerState } from '../db';
import type {
  ExecutionLog,
  SessionPlan,
  SessionPlanBlock,
} from '../db';

export type SessionRunnerOptions = {
  getAccumulatedElapsed?: () => number;
};

export function useSessionRunner(
  executionLogId: string,
  options?: SessionRunnerOptions,
) {
  const [execution, setExecution] = useState<ExecutionLog | null>(null);
  const [plan, setPlan] = useState<SessionPlan | null>(null);

  const executionRef = useRef<ExecutionLog | null>(null);
  const planRef = useRef<SessionPlan | null>(null);

  useEffect(() => {
    executionRef.current = execution;
    planRef.current = plan;
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const exec = await db.executionLogs.get(executionLogId);
      if (cancelled) return;
      if (!exec) {
        setExecution(null);
        setPlan(null);
        return;
      }
      const p = await db.sessionPlans.get(exec.planId);
      if (cancelled) return;
      setExecution(exec);
      setPlan(p ?? null);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [executionLogId]);

  const currentBlockIndex = execution?.activeBlockIndex ?? 0;
  const currentBlock: SessionPlanBlock | null =
    plan?.blocks[currentBlockIndex] ?? null;
  const totalBlocks = plan?.blocks.length ?? 0;
  const isPaused = execution?.status === 'paused';

  const persistExecution = useCallback(async (updated: ExecutionLog) => {
    await db.executionLogs.put(updated);
    setExecution(updated);
  }, []);

  const startBlock = useCallback(async () => {
    const exec = executionRef.current;
    const p = planRef.current;
    if (!exec || !p) return;
    const idx = exec.activeBlockIndex;
    if (idx >= p.blocks.length) return;

    const blockStatus = exec.blockStatuses[idx];
    if (blockStatus?.status === 'in_progress') return;

    const now = Date.now();
    const blockStatuses = [...exec.blockStatuses];
    blockStatuses[idx] = { ...blockStatuses[idx], status: 'in_progress', startedAt: now };

    await persistExecution({
      ...exec,
      status: 'in_progress',
      blockStatuses,
      startedAt: exec.startedAt || now,
      pausedAt: undefined,
    });
  }, [persistExecution]);

  const pauseBlock = useCallback(
    async (accumulatedElapsed: number) => {
      const exec = executionRef.current;
      if (!exec) return;

      await persistExecution({ ...exec, status: 'paused', pausedAt: Date.now() });

      const blockStart =
        exec.blockStatuses[exec.activeBlockIndex]?.startedAt ?? Date.now();
      await flushTimerState({
        id: 'active',
        executionLogId,
        blockIndex: exec.activeBlockIndex,
        startedAt: blockStart,
        accumulatedElapsed,
        status: 'paused',
        lastFlushedAt: Date.now(),
      });
    },
    [executionLogId, persistExecution],
  );

  const resumeBlock = useCallback(async () => {
    const exec = executionRef.current;
    if (!exec) return;
    await persistExecution({ ...exec, status: 'in_progress', pausedAt: undefined });
  }, [persistExecution]);

  const advanceBlock = useCallback(
    async (status: 'completed' | 'skipped'): Promise<boolean> => {
      const exec = executionRef.current;
      const p = planRef.current;
      if (!exec || !p) return false;

      const idx = exec.activeBlockIndex;
      const now = Date.now();
      const blockStatuses = [...exec.blockStatuses];
      blockStatuses[idx] = { ...blockStatuses[idx], status, completedAt: now };

      const nextIdx = idx + 1;
      const isLast = nextIdx >= p.blocks.length;

      await persistExecution({
        ...exec,
        activeBlockIndex: nextIdx,
        blockStatuses,
        status: isLast ? 'completed' : exec.status,
        completedAt: isLast ? now : undefined,
      });
      await clearTimerState();
      return isLast;
    },
    [persistExecution],
  );

  const completeBlock = useCallback(
    () => advanceBlock('completed'),
    [advanceBlock],
  );

  const skipBlock = useCallback(
    () => advanceBlock('skipped'),
    [advanceBlock],
  );

  const endSession = useCallback(
    async (reason?: string) => {
      const exec = executionRef.current;
      if (!exec) return;
      const now = Date.now();

      const blockStatuses = exec.blockStatuses.map((bs, i) => {
        if (i === exec.activeBlockIndex && bs.status === 'in_progress') {
          return { ...bs, status: 'skipped' as const, completedAt: now };
        }
        if (i >= exec.activeBlockIndex && bs.status === 'planned') {
          return { ...bs, status: 'skipped' as const };
        }
        return bs;
      });

      await persistExecution({
        ...exec,
        status: 'ended_early',
        blockStatuses,
        completedAt: now,
        endedEarlyReason: reason,
      });
      await clearTimerState();
    },
    [persistExecution],
  );

  const shortenBlock = useCallback((): number => {
    const p = planRef.current;
    const exec = executionRef.current;
    if (!p || !exec) return 0;
    const block = p.blocks[exec.activeBlockIndex];
    return block ? Math.max(10, (block.durationMinutes * 60) / 2) : 0;
  }, []);

  const flushTimer = useCallback(
    async (accumulatedElapsed: number) => {
      const exec = executionRef.current;
      if (!exec) return;

      const blockStart =
        exec.blockStatuses[exec.activeBlockIndex]?.startedAt ?? Date.now();
      await flushTimerState({
        id: 'active',
        executionLogId,
        blockIndex: exec.activeBlockIndex,
        startedAt: blockStart,
        accumulatedElapsed,
        status: exec.status === 'paused' ? 'paused' : 'running',
        lastFlushedAt: Date.now(),
      });
    },
    [executionLogId],
  );

  const recoverTimerState = useCallback(
    async (blockDurationSeconds: number): Promise<number | null> => {
      const exec = executionRef.current;
      if (!exec) return null;
      const saved = await readTimerState();
      if (
        saved &&
        saved.executionLogId === executionLogId &&
        saved.blockIndex === exec.activeBlockIndex
      ) {
        return Math.max(0, blockDurationSeconds - saved.accumulatedElapsed);
      }
      return null;
    },
    [executionLogId],
  );

  const getAccumulatedElapsedRef = useRef(options?.getAccumulatedElapsed);
  useEffect(() => {
    getAccumulatedElapsedRef.current = options?.getAccumulatedElapsed;
  });

  useEffect(() => {
    const flushFromLifecycle = () => {
      const getElapsed = getAccumulatedElapsedRef.current;
      if (!getElapsed) return;
      const exec = executionRef.current;
      if (!exec) return;
      if (exec.status !== 'in_progress' && exec.status !== 'paused') return;
      const bs = exec.blockStatuses[exec.activeBlockIndex];
      if (bs?.status !== 'in_progress') return;
      void flushTimer(getElapsed());
    };

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flushFromLifecycle();
    };

    const onBeforeUnload = () => {
      flushFromLifecycle();
    };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [flushTimer]);

  return {
    plan,
    execution,
    currentBlock,
    currentBlockIndex,
    totalBlocks,
    isPaused,
    startBlock,
    pauseBlock,
    resumeBlock,
    completeBlock,
    skipBlock,
    shortenBlock,
    nextBlock: startBlock,
    endSession,
    flushTimer,
    recoverTimerState,
  };
}
