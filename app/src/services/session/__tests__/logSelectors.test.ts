import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../../db'
import type { ExecutionLog } from '../../../db'
import { getResumableExecutionLogs, getTerminalExecutionLogs } from '../logSelectors'

async function clearDb() {
  await db.executionLogs.clear()
}

function exec(id: string, status: ExecutionLog['status']): ExecutionLog {
  return {
    id,
    planId: `plan-${id}`,
    status,
    activeBlockIndex: 0,
    blockStatuses: [{ blockId: 'block-1', status: 'planned' }],
    startedAt: 1000,
  }
}

describe('session logSelectors', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it('selects resumable execution logs by indexed status', async () => {
    await db.executionLogs.bulkPut([
      exec('not-started', 'not_started'),
      exec('in-progress', 'in_progress'),
      exec('paused', 'paused'),
      exec('completed', 'completed'),
      exec('ended', 'ended_early'),
    ])

    const logs = await getResumableExecutionLogs()

    expect(logs.map((log) => log.id).sort()).toEqual(['in-progress', 'not-started', 'paused'])
  })

  it('selects terminal execution logs by indexed status', async () => {
    await db.executionLogs.bulkPut([
      exec('not-started', 'not_started'),
      exec('in-progress', 'in_progress'),
      exec('paused', 'paused'),
      exec('completed', 'completed'),
      exec('ended', 'ended_early'),
    ])

    const logs = await getTerminalExecutionLogs()

    expect(logs.map((log) => log.id).sort()).toEqual(['completed', 'ended'])
  })
})
