import type { ExecutionLog, SessionPlan } from '../db'

export function applyBlockOverrides(plan: SessionPlan, execution?: ExecutionLog): SessionPlan {
  const overrides = execution?.blockOverrides
  if (!overrides || Object.keys(overrides).length === 0) {
    return plan
  }

  return {
    ...plan,
    blocks: plan.blocks.map((block, index) => {
      const override = overrides[index]
      if (!override) return block
      return {
        ...override,
        id: block.id,
        type: block.type,
        durationMinutes: block.durationMinutes,
        required: block.required,
      }
    }),
  }
}
