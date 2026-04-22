/* eslint-disable react-refresh/only-export-components --
   ScreenShell uses the compound-component pattern (`ScreenShell` +
   `.Header` / `.Body` / `.Footer`) via `Object.assign`. The
   react-refresh plugin's heuristic does not recognize the `Object.assign`
   export as a component export and flags the helper function
   declarations below as "non-component exports," which is a false
   positive here (there is only one named export from this file).
   Disabling file-wide keeps the compound API readable; the fast-refresh
   penalty is negligible on a primitive that is rarely edited. */
import type { ReactNode } from 'react'
import { cx } from '../../lib/cn'

/**
 * ScreenShell — three-zone layout primitive for app/ screens.
 *
 * Encodes the "pinned-footer, scrollable body" pattern every screen
 * should use so the CTA stack never slips below the fold on an iPhone
 * viewport. Rolled out 2026-04-22 to replace the earlier pattern where
 * each screen was a plain `flex flex-col` that let the document scroll
 * at the root and dropped the timer / Continue / Submit below the fold
 * on tall content (most obvious on RunScreen with long drill
 * instructions or an expanded coaching cue).
 *
 * Structure:
 *
 *   <ScreenShell>
 *     <ScreenShell.Header>   // optional. shrink-0.
 *     <ScreenShell.Body>     // flex-1 min-h-0 overflow-y-auto — scrolls.
 *     <ScreenShell.Footer>   // optional. shrink-0 + safe-area-bottom.
 *   </ScreenShell>
 *
 * Mechanics:
 *
 * - The outer `App` Layout fixes the viewport at `h-[100dvh]
 *   overflow-hidden`, so the shell itself does not create viewport
 *   height; it just fills whatever main offers via `h-full`.
 * - `min-h-0` on the Body is the classic flexbox-overflow trap: without
 *   it, a flex child refuses to shrink past its content, and the body
 *   bleeds out of the shell instead of scrolling.
 * - `overscroll-contain` keeps iOS rubber-band scrolling inside the
 *   body without bubbling to the document (there is no document scroll
 *   anymore — the shell locks it).
 * - Footer owns `pb-[env(safe-area-inset-bottom)]` so the home
 *   indicator cannot eat half of a primary CTA on a modern iPhone. Top
 *   safe-area is handled once upstream on `<main>` in App.tsx.
 *
 * Modals (End-session confirm, SchemaBlockedOverlay, SoftBlockModal)
 * continue to use `fixed inset-0 z-50` and render *outside* the shell,
 * so the viewport lock does not interfere with them.
 */

type ScreenShellProps = {
  children: ReactNode
  className?: string
}

function Root({ children, className }: ScreenShellProps) {
  return (
    <div
      data-screen-shell
      className={cx(
        'mx-auto flex h-full w-full max-w-[390px] flex-col',
        className,
      )}
    >
      {children}
    </div>
  )
}

type PartProps = {
  children: ReactNode
  className?: string
}

function Header({ children, className }: PartProps) {
  return (
    <div data-screen-shell-header className={cx('shrink-0', className)}>
      {children}
    </div>
  )
}

/**
 * Body carries `tabIndex={0}` so the scrollable region is reachable
 * by keyboard users — axe-core's `scrollable-region-focusable` rule
 * (WCAG 2.1 SC 2.1.1 Keyboard) fires otherwise because an
 * `overflow-y-auto` container with no focusable descendants strands
 * keyboard-only users who need arrow-keys to see off-screen content.
 * Attaching the tabIndex to the container (rather than role="region"
 * with an aria-label) keeps the body semantically unlabeled — each
 * screen already has a proper `<h1>` / page title inside either the
 * header or the body, and a second labelled landmark would add noise
 * for screen readers. The focus ring is suppressed because the body
 * is not an action target; the visible cue is the screen's header +
 * content itself.
 */
function Body({ children, className }: PartProps) {
  return (
    <div
      data-screen-shell-body
      tabIndex={0}
      className={cx(
        'flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain focus:outline-none',
        className,
      )}
    >
      {children}
    </div>
  )
}

/**
 * The pinned-footer zone. Carries safe-area-bottom so the home
 * indicator does not clip CTAs.
 *
 * A subtle `border-t border-text-primary/5` sits above the footer as
 * a hairline "dock" cue — quiet enough to disappear on calm screens
 * where the body fits without scroll, visible enough to tell the eye
 * that the footer is fixed when the body *has* scrolled. This holds
 * the shibui envelope without needing a JS-driven shadow-on-scroll.
 */
function Footer({ children, className }: PartProps) {
  return (
    <div
      data-screen-shell-footer
      className={cx(
        'shrink-0 border-t border-text-primary/5 bg-surface-calm pb-[env(safe-area-inset-bottom)]',
        className,
      )}
    >
      {children}
    </div>
  )
}

export const ScreenShell = Object.assign(Root, { Header, Body, Footer })
