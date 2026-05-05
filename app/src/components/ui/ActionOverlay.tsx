import { useCallback, useEffect, useId, useRef } from 'react'
import type { ReactNode, RefObject } from 'react'
import { createPortal } from 'react-dom'

import { cx } from '../../lib/cn'
import { ELEVATED_PANEL_SURFACE } from './surfaces'

type ActionOverlayProps = {
  title: string
  description?: ReactNode
  children: ReactNode
  role?: 'dialog' | 'alertdialog'
  onDismiss?: () => void
  closeLabel?: string
  showCloseButton?: boolean
  refocusKey?: string | number | boolean
  /**
   * Plan U2 (2026-05-04): typed initial-focus seam. When provided and
   * `.current` resolves to a focusable element, it wins over the
   * first-focusable fallback. Pairing with `refocusKey` re-runs the
   * focus effect (e.g. ResumePrompt's confirming-state flip swaps which
   * ref is passed; the key bump is no longer strictly required because
   * the ref identity change re-runs the effect, but it stays in the
   * API as an escape hatch for callers that point a single ref at a
   * different element across re-renders).
   *
   * Replaces the legacy `data-action-overlay-initial-focus="true"`
   * string attribute, which was removed at the end of U2 (no callers
   * left). New callers MUST use this seam; the ESLint guardrail in U12
   * will fail at edit time if the attribute is re-introduced.
   */
  initialFocusRef?: RefObject<HTMLElement | null>
  className?: string
  panelClassName?: string
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function ActionOverlay({
  title,
  description,
  children,
  role = 'dialog',
  onDismiss,
  closeLabel = 'Close',
  showCloseButton = false,
  refocusKey,
  initialFocusRef,
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
    // Precedence: typed `initialFocusRef` > first focusable element > panel itself.
    // The legacy `[data-action-overlay-initial-focus="true"]` attribute path
    // was removed at the end of U2 (2026-05-04) once all callers migrated.
    const refTarget = initialFocusRef?.current ?? null
    const focusable = getFocusable()
    const initialTarget = refTarget ?? focusable[0] ?? panel
    initialTarget?.focus()
  }, [getFocusable, refocusKey, initialFocusRef])

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
