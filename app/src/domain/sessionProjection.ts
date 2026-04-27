import type { ExecutionLog, SessionPlan } from '../db'

export function applyBlockOverrides(plan: SessionPlan, execution?: ExecutionLog): SessionPlan {
  const overrides = execution?.blockOverrides
  if (!overrides || Object.keys(overrides).length === 0) {
    return plan
  }

  return {
    ...plan,
    blocks: plan.blocks.map((block, index) => overrides[index] ?? block),
  }
}
