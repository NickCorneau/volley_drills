import type { ReactNode } from 'react'
import { cx } from '../../lib/cn'

type CardProps = {
  className?: string
  children: ReactNode
}

export function Card({ className, children }: CardProps) {
  return (
    <div className={cx('rounded-[12px] bg-bg-warm p-4', className)}>
      {children}
    </div>
  )
}
