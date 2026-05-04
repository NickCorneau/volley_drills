/**
 * @fileoverview Plan U12 (2026-05-04): drift-prevention rule for the
 * Volleycraft UI primitive layer. Reports inline patterns that should
 * route through their canonical primitive instead.
 *
 * # Checks (currently enabled)
 *
 * ## `forbiddenRadiogroup`
 * Reports any JSX element with `role="radiogroup"` outside
 * `app/src/components/ui/ChoiceRow.tsx`. The pattern is the high-signal
 * tell that a contributor is hand-rolling the chip wrapper instead of
 * using `<ChoiceRow>` (plan U3). False-positive rate is effectively
 * zero because no other UI surface in this app uses radiogroup.
 *
 * ## `forbiddenFocusAttr`
 * Reports any JSX element with the `data-action-overlay-initial-focus`
 * attribute. After plan U2 (2026-05-04), this attribute is removed
 * from the codebase; ActionOverlay's typed `initialFocusRef` seam
 * replaces it. Re-introducing the attribute means a contributor missed
 * the migration; the rule fails their PR.
 *
 * # Checks intentionally NOT enabled (yet)
 *
 * The plan also enumerated heuristic checks for the JustFinishedPill
 * markup, ScreenHeader trio, and inline Callout panels. Those are
 * harder to detect reliably without false positives — they're deferred
 * to a follow-up rule iteration. The two high-signal checks above
 * cover the patterns most likely to drift back; the rest are caught
 * by code review.
 *
 * # Allow-list
 *
 * - The primitive files themselves (ChoiceRow.tsx, ActionOverlay.tsx)
 *   may use the patterns (they ARE the canonical home).
 * - `__tests__/` files may use the radiogroup pattern (synthetic
 *   violations are how RuleTester verifies the rule fires).
 * - Inline `eslint-disable-next-line` with a reason is the documented
 *   escape hatch for one-off legitimate uses.
 */

import path from 'node:path'

/** @type {import('eslint').Rule.RuleModule} */
const rule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow inline patterns that should route through their canonical Volleycraft primitive',
      category: 'Best Practices',
      recommended: true,
    },
    schema: [],
    messages: {
      forbiddenRadiogroup:
        'Use `<ChoiceRow>` from `components/ui` (or `components/patterns` for app-shaped composites) instead of inlining `role="radiogroup"`. ChoiceRow owns the radiogroup wrapper, ToggleChip mapping, layout, and per-option tone.',
      forbiddenFocusAttr:
        'The `data-action-overlay-initial-focus` attribute was removed in plan U2 (2026-05-04). Pass `initialFocusRef` to `ActionOverlay` (or use `<ConfirmModal>` from `components/patterns` which threads the ref internally).',
    },
  },
  create(context) {
    const filename = context.filename ?? context.getFilename()
    const normalizedFilename = filename.split(path.sep).join('/')

    const isChoiceRow = normalizedFilename.endsWith('/components/ui/ChoiceRow.tsx')
    const isTest = normalizedFilename.includes('/__tests__/')

    return {
      JSXAttribute(node) {
        const name = node.name && node.name.name
        if (typeof name !== 'string') return

        if (name === 'role') {
          if (isChoiceRow || isTest) return
          const value =
            node.value && node.value.type === 'Literal' ? node.value.value : undefined
          if (value === 'radiogroup') {
            context.report({ node, messageId: 'forbiddenRadiogroup' })
          }
          return
        }

        if (name === 'data-action-overlay-initial-focus') {
          context.report({ node, messageId: 'forbiddenFocusAttr' })
        }
      },
    }
  },
}

export default rule
