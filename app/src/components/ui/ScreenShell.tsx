/* eslint-disable react-refresh/only-export-components --
   ScreenShell uses the compound-component pattern (`ScreenShell` +
   `.Header` / `.Body` / `.Footer`) via `Object.assign`. The
   react-refresh plugin's heuristic does not recognize the `Object.assign`
   export as a component export and flags the helper function
   declarations below as "non-component exports," which is a false
   positive here (there is only one named export from this file).
   Disabling file-wide keeps the compound API readable; the fast-refresh
   penalty is negligible on a primitive that is rarely edited. */
import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
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
 *     <ScreenShell.Header>   // optional. shrink-0. rhythm: flow | landing.
 *     <ScreenShell.Body>     // flex-1 min-h-0 overflow-y-auto — scrolls.
 *                            // rhythm: cockpit | calm | landing | celebration | quiet.
 *     <ScreenShell.Footer>   // optional. shrink-0 + safe-area-bottom.
 *                            // rhythm: cta | caption.
 *   </ScreenShell>
 *
 * Zone spacing is owned by the named rhythm maps below (HEADER_RHYTHM /
 * BODY_RHYTHM / FOOTER_RHYTHM) — one spot to retune the whole app.
 * Spacing utilities in a zone's `className` are lint-blocked.
 *
 * Mechanics:
 *
 * - The outer `App` Layout fixes the viewport at `h-[100dvh]
 *   overflow-hidden`, so the shell itself does not create viewport
 *   height; it just fills whatever main offers via `h-full`.
 * - `min-h-0` on the Body wrapper is the classic flexbox-overflow
 *   trap: without it, a flex child refuses to shrink past its content,
 *   and the body bleeds out of the shell instead of scrolling.
 * - `overscroll-contain` keeps iOS rubber-band scrolling inside the
 *   body without bubbling to the document (there is no document scroll
 *   anymore — the shell locks it).
 * - Body scrollbar chrome is hidden on every platform (WebKit +
 *   Firefox + legacy Edge) — iOS Safari auto-hides already, but
 *   desktop Chrome otherwise paints a chunky always-on bar that reads
 *   crude next to the calm shibui surface. The auto-appearing fade
 *   gradients below are the scroll affordance instead; this matches
 *   the native-iOS / Linear / Stripe pattern of "drag to discover."
 * - Top + bottom fade gradients appear automatically when the body
 *   has hidden content in that direction. They are absolutely
 *   positioned `pointer-events-none` siblings of the scroll
 *   container, so they never block taps and disappear the moment
 *   the body fits within one viewport (calm screens stay calm).
 * - Footer uses `pb-[max(0.5rem,env(safe-area-inset-bottom))]` so
 *   iPhones with a home indicator keep the full inset (typically ~34
 *   px) without stacking an extra 16 px on top (`calc(1rem + env(...))`
 *   landed ~50 px — founder feedback 2026-04-22). When the inset is
 *   0 (desktop preview), 8 px keeps secondary/outline CTAs off the
 *   window edge — tighter than the old 1 rem floor but still
 *   tappable. Top safe-area is handled once upstream on `<main>` in
 *   App.tsx.
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
      className={cx('mx-auto flex min-h-0 w-full max-w-[390px] flex-1 flex-col', className)}
    >
      {children}
    </div>
  )
}

/*
 * Named zone rhythms (2026-06-11 spacing-contract pass).
 *
 * Zone-level spacing (header pt/pb, body gap + end padding, footer
 * gap/pt) is owned HERE, not at call sites. Before this pass every
 * screen hand-tuned `pt-* pb-* gap-*` strings on its zones and the
 * values drifted a few pixels per screen (footer pt-3 vs pt-4, a
 * stray px-1 on Run, an extra pt-2 on Drill Check). Screens now pick
 * a *named* rhythm; the pixel values live in these three maps so the
 * whole app retunes from one spot.
 *
 * Adding spacing classes to a zone's `className` is lint-blocked
 * (`volleycraft/screen-shell-zone-spacing`). If a screen genuinely
 * needs a new rhythm, add a named variant here instead of inlining
 * the one-off — the name is the documentation.
 */

export const HEADER_RHYTHM = {
  /** In-flow top bar: back rows, run-flow eyebrow grids, review/complete. */
  flow: 'pt-2 pb-3',
  /** Surfaces that open the app (Home brand row, onboarding skill level): extra top air. */
  landing: 'pt-6 pb-4',
} as const

export const BODY_RHYTHM = {
  /** Run-flow instrument surfaces (Run, Transition) and the Setup
      refine cluster (D158 setup-01 frame): dense glanceable read. */
  cockpit: 'gap-4 pb-4',
  /** Default. Pre-run forms, capture, review: standard section breathing. */
  calm: 'gap-6 pb-4',
  /** Card-stack surfaces (Home, Settings): airier gaps between focal cards. */
  landing: 'gap-8 pb-4',
  /** Terminal verdict beat (Complete): widest air around the hero. */
  celebration: 'gap-10 pb-4',
  /** Single-component bodies that own their internal rhythm (skill-level
      pickers). No zone gap; deeper end padding closes the scroll on these
      footer-less screens. */
  quiet: 'pb-6',
} as const

export const FOOTER_RHYTHM = {
  /** Default. CTA stacks: primary button + helper/error/caption rows. */
  cta: 'flex flex-col gap-3 pt-4',
  /** Text-only caption clusters (Home, Settings): tight centered lines. */
  caption: 'flex flex-col items-center gap-1 pt-4 text-center',
} as const

export type HeaderRhythm = keyof typeof HEADER_RHYTHM
export type BodyRhythm = keyof typeof BODY_RHYTHM
export type FooterRhythm = keyof typeof FOOTER_RHYTHM

type PartProps = {
  children: ReactNode
  className?: string
}

function Header({ children, className, rhythm = 'flow' }: PartProps & { rhythm?: HeaderRhythm }) {
  return (
    <div data-screen-shell-header className={cx('shrink-0', HEADER_RHYTHM[rhythm], className)}>
      {children}
    </div>
  )
}

type ScrollEdges = { canScrollUp: boolean; canScrollDown: boolean }

/**
 * Track whether the body has more content above / below the visible
 * viewport so the ScreenShell can toggle the fade gradients in sync.
 *
 * - Listens to `scroll` on the container (passive) for user drags.
 * - Uses a `ResizeObserver` on the container AND its children to
 *   catch content reflow (image loads, cue expanded/collapsed,
 *   router transitions mutating the subtree) so the fades refresh
 *   without a scroll event.
 * - Uses a 1 px tolerance (`> 1` / `+ 1 < scrollHeight`) because
 *   retina fractional-pixel scroll positions otherwise jitter the
 *   fade at the exact top / bottom edge.
 */
function useScrollEdges(ref: RefObject<HTMLDivElement | null>): ScrollEdges {
  const [edges, setEdges] = useState<ScrollEdges>({
    canScrollUp: false,
    canScrollDown: false,
  })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = el
      setEdges({
        canScrollUp: scrollTop > 1,
        canScrollDown: scrollTop + clientHeight < scrollHeight - 1,
      })
    }

    update()
    el.addEventListener('scroll', update, { passive: true })

    const ro = new ResizeObserver(update)
    ro.observe(el)
    Array.from(el.children).forEach((child) => ro.observe(child as Element))

    return () => {
      el.removeEventListener('scroll', update)
      ro.disconnect()
    }
  }, [ref])

  return edges
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
 *
 * Zone spacing comes from the named `rhythm` variant (see BODY_RHYTHM);
 * the `className` prop is forwarded to the scroll container for
 * non-spacing layout (e.g. `items-center` on Complete) without leaking
 * into the fade/scrollbar plumbing.
 */
function Body({ children, className, rhythm = 'calm' }: PartProps & { rhythm?: BodyRhythm }) {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const { canScrollUp, canScrollDown } = useScrollEdges(scrollRef)

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div
        ref={scrollRef}
        data-screen-shell-body
        tabIndex={0}
        // Scrollbar chrome hidden cross-browser:
        //   - `[&::-webkit-scrollbar]:hidden` → Chrome / Safari / iOS
        //   - `[scrollbar-width:none]`       → Firefox
        //   - `[-ms-overflow-style:none]`    → legacy Edge / IE
        // The fade overlays below are the visible scroll affordance.
        className={cx(
          'flex flex-1 flex-col overflow-y-auto overscroll-contain focus:outline-none',
          '[&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]',
          BODY_RHYTHM[rhythm],
          className,
        )}
      >
        {children}
      </div>
      {/*
        Top fade: appears once the user has scrolled past the first
        pixel. Short (16 px) because the header above is already a
        clear visual break; the fade just softens the re-entry of
        scrolled-behind content under the header edge.
      */}
      <div
        aria-hidden
        className={cx(
          'pointer-events-none absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-surface-calm to-transparent',
          'transition-opacity duration-150',
          canScrollUp ? 'opacity-100' : 'opacity-0',
        )}
      />
      {/*
        Bottom fade: appears whenever there is more content below the
        current viewport. Taller (28 px) than the top fade because the
        bottom of the body is the primary "discover more" direction —
        the gradient needs to read at a glance, not just on close
        inspection, otherwise it disappears into the footer's hairline.
      */}
      <div
        aria-hidden
        className={cx(
          'pointer-events-none absolute inset-x-0 bottom-0 h-7 bg-gradient-to-t from-surface-calm to-transparent',
          'transition-opacity duration-150',
          canScrollDown ? 'opacity-100' : 'opacity-0',
        )}
      />
    </div>
  )
}

/**
 * The pinned-footer zone. Bottom padding is `max(0.5rem,
 * safe-area-inset-bottom)` so CTAs are never flush against the
 * physical or logical bottom edge; top padding and content gap come
 * from the named `rhythm` variant (see FOOTER_RHYTHM).
 *
 * A subtle `border-t border-text-primary/5` sits above the footer as
 * a hairline "dock" cue — quiet enough to disappear on calm screens
 * where the body fits without scroll, visible enough to tell the eye
 * that the footer is fixed when the body *has* scrolled. This holds
 * the shibui envelope without needing a JS-driven shadow-on-scroll.
 */
function Footer({ children, className, rhythm = 'cta' }: PartProps & { rhythm?: FooterRhythm }) {
  return (
    <div
      data-screen-shell-footer
      className={cx(
        'shrink-0 border-t border-text-primary/5 bg-surface-calm pb-[max(0.5rem,env(safe-area-inset-bottom))]',
        FOOTER_RHYTHM[rhythm],
        className,
      )}
    >
      {children}
    </div>
  )
}

export const ScreenShell = Object.assign(Root, { Header, Body, Footer })
