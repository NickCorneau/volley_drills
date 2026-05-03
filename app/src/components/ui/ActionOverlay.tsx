import { useCallback, useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

import { cx } from '../../lib/cn'
import { ELEVATED_PANEL_SURFACE } from './Card'

type ActionOverlayProps = {
  title: string
  description?: ReactNode
  children: ReactNode
  role?: 'dialog' | 'alertdialog'
  onDismiss?: () => void
  closeLabel?: string
  showCloseButton?: boolean
  refocusKey?: string | number | boolean
  className?: string
  panelClassName?: string
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

const ACTION_OVERLAY_INITIAL_FOCUS_ATTR = 'data-action-overlay-initial-focus'

export function ActionOverlay({
  title,
  description,
  children,
  role = 'dialog',
  onDismiss,
  closeLabel = 'Close',
  showCloseButton = false,
  refocusKey,
  className,
  panelClassName,
}: ActionOverlayProps) {
  const titleId = useId()
  const descriptionId = useId()
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const previouslyFocusedRef = useRef<HTMLElement | null>(null)

  const getFocusable = useCallback((): HTMLElement[] => {
    const panel = panelRef.current
    if (!panel) return []
    return Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
  }, [])

  useEffect(() => {
    previouslyFocusedRef.current = (document.activeElement as HTMLElement | null) ?? null

    const overlay = overlayRef.current
    const parent = overlay?.parentElement
    if (!overlay || !parent) {
      return () => {
        const prev = previouslyFocusedRef.current
        if (prev && typeof prev.focus === 'function') {
          prev.focus()
        }
      }
    }

    const siblings = Array.from(parent.children).filter((child): child is HTMLElement => {
      return child instanceof HTMLElement && child !== overlay
    })
    const previousValues = siblings.map((sibling) => ({
      sibling,
      ariaHidden: sibling.getAttribute('aria-hidden'),
      inert: Boolean(sibling.inert),
    }))

    for (const sibling of siblings) {
      sibling.setAttribute('aria-hidden', 'true')
      sibling.inert = true
    }

    return () => {
      for (const { sibling, ariaHidden, inert } of previousValues) {
        if (ariaHidden === null) {
          sibling.removeAttribute('aria-hidden')
        } else {
          sibling.setAttribute('aria-hidden', ariaHidden)
        }
        sibling.inert = inert
      }

      const prev = previouslyFocusedRef.current
      if (prev && typeof prev.focus === 'function') {
        prev.focus()
      }
    }
  }, [])

  useEffect(() => {
    const panel = panelRef.current
    const markedTarget = panel?.querySelector<HTMLElement>(
      `[${ACTION_OVERLAY_INITIAL_FOCUS_ATTR}="true"]`,
    )
    const focusable = getFocusable()
    const initialTarget = markedTarget ?? focusable[0] ?? panel
    initialTarget?.focus()
  }, [getFocusable, refocusKey])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onDismiss) {
        e.preventDefault()
        onDismiss()
        return
      }

      if (e.key !== 'Tab') return
      const focusable = getFocusable()
      if (focusable.length === 0) {
        e.preventDefault()
        panelRef.current?.focus()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement as HTMLElement | null

      if (!active || !panelRef.current?.contains(active)) {
        e.preventDefault()
        first.focus()
        return
      }

      if (e.shiftKey && active === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [getFocusable, onDismiss])

  return createPortal(
    <div
      ref={overlayRef}
      role={role}
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      className={cx(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4',
        className,
      )}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className={cx(
          'relative w-full max-w-[340px] rounded-[12px] p-6',
          ELEVATED_PANEL_SURFACE,
          panelClassName,
        )}
      >
        {showCloseButton && onDismiss ? (
          <button
            type="button"
            onClick={onDismiss}
            aria-label={closeLabel}
            className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-text-primary/5 hover:text-text-primary active:bg-text-primary/10 active:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            &times;
          </button>
        ) : null}

        <h2 id={titleId} className="text-lg font-bold text-text-primary">
          {title}
        </h2>

        {description ? (
          <p id={descriptionId} className="mt-2 text-sm text-text-secondary">
            {description}
          </p>
        ) : null}

        {children}
      </div>
    </div>,
    document.body,
  )
}
