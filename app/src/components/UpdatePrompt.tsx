import { Button } from './ui'

export interface UpdatePromptProps {
  needRefresh: boolean
  onUpdate: () => void
}

export function UpdatePrompt({ needRefresh, onUpdate }: UpdatePromptProps) {
  if (!needRefresh) return null
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto flex w-full max-w-[390px] items-center justify-between gap-3 rounded-lg bg-info-surface px-4 py-3 text-sm"
    >
      <span className="text-text-primary">Update available</span>
      <Button variant="primary" onClick={onUpdate}>
        Update
      </Button>
    </div>
  )
}
