/**
 * @fileoverview Spacing-contract pass (2026-06-11): drift-prevention rule
 * for ScreenShell zone spacing.
 *
 * Zone-level spacing (header pt/pb, body gap + end padding, footer
 * gap/pt) is owned by the named rhythm maps in
 * `components/ui/ScreenShell.tsx` (HEADER_RHYTHM / BODY_RHYTHM /
 * FOOTER_RHYTHM). Before that pass, every screen hand-tuned spacing
 * utility strings on its zones and the values drifted a few pixels per
 * screen (footer `pt-3` vs `pt-4`, a stray `px-1` on Run, an extra
 * `pt-2` on Drill Check). This rule fails at edit time when spacing
 * utilities are reintroduced on a zone's `className` so the contract
 * stays centralized.
 *
 * # What it flags
 *
 * On `<ScreenShell.Body>` and `<ScreenShell.Footer>`: any padding,
 * margin, gap, or space-between utility in `className` (string literal
 * or string arguments of a `cx(...)` call).
 *
 * On `<ScreenShell.Header>`: padding / margin / space-between
 * utilities. `gap-*` is allowed on headers — it arranges the header's
 * own content row/column (brand row, title + subtitle stack), which is
 * content layout, not zone spacing.
 *
 * # What it does NOT flag
 *
 * - Non-spacing layout (`flex`, `items-center`, `justify-between`) and
 *   typography (`text-xs`, `text-text-secondary`) on zones.
 * - Spacing classes anywhere other than the three zone elements.
 * - Dynamic className expressions it cannot statically read (template
 *   literals, conditionals) — code review owns those rare cases.
 *
 * # Escape hatch
 *
 * `// eslint-disable-next-line volleycraft/screen-shell-zone-spacing -- <reason>`
 * for a documented one-off. If a screen genuinely needs a new rhythm,
 * prefer adding a named variant to the rhythm maps — the name is the
 * documentation.
 */

import path from 'node:path'

const PAD_MARGIN_RE = /^-?(p|px|py|pt|pb|pl|pr|ps|pe|m|mx|my|mt|mb|ml|mr|ms|me)-./
const GAP_SPACE_RE = /^(gap|gap-x|gap-y|space-x|space-y)-./

/** Zone-specific predicates for a single class token. */
const ZONE_CHECKS = {
  Header: (token) => PAD_MARGIN_RE.test(token) || /^(space-x|space-y)-./.test(token),
  Body: (token) => PAD_MARGIN_RE.test(token) || GAP_SPACE_RE.test(token),
  Footer: (token) => PAD_MARGIN_RE.test(token) || GAP_SPACE_RE.test(token),
}

/** Collect statically-readable string values from a className attribute. */
function collectClassStrings(attrValue) {
  if (!attrValue) return []
  if (attrValue.type === 'Literal' && typeof attrValue.value === 'string') {
    return [attrValue.value]
  }
  if (attrValue.type === 'JSXExpressionContainer') {
    const expr = attrValue.expression
    if (expr.type === 'Literal' && typeof expr.value === 'string') return [expr.value]
    if (expr.type === 'CallExpression') {
      return expr.arguments
        .filter((arg) => arg.type === 'Literal' && typeof arg.value === 'string')
        .map((arg) => arg.value)
    }
  }
  return []
}

/** @type {import('eslint').Rule.RuleModule} */
const rule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow inline spacing utilities on ScreenShell zones; zone spacing routes through named rhythm variants',
      category: 'Best Practices',
      recommended: true,
    },
    schema: [],
    messages: {
      zoneSpacing:
        'Spacing class `{{token}}` on `ScreenShell.{{zone}}` bypasses the named rhythm contract. Zone spacing lives in {{map}} (components/ui/ScreenShell.tsx) — pick a `rhythm` variant, or add a new named variant there instead of inlining the one-off.',
    },
  },
  create(context) {
    const filename = context.filename ?? context.getFilename()
    const normalizedFilename = filename.split(path.sep).join('/')
    if (normalizedFilename.includes('/__tests__/')) return {}

    return {
      JSXOpeningElement(node) {
        const name = node.name
        if (
          name.type !== 'JSXMemberExpression' ||
          name.object.type !== 'JSXIdentifier' ||
          name.object.name !== 'ScreenShell' ||
          name.property.type !== 'JSXIdentifier'
        ) {
          return
        }
        const zone = name.property.name
        const check = ZONE_CHECKS[zone]
        if (!check) return

        const classNameAttr = node.attributes.find(
          (attr) => attr.type === 'JSXAttribute' && attr.name.name === 'className',
        )
        if (!classNameAttr) return

        for (const value of collectClassStrings(classNameAttr.value)) {
          for (const token of value.split(/\s+/)) {
            if (check(token)) {
              context.report({
                node: classNameAttr,
                messageId: 'zoneSpacing',
                data: {
                  token,
                  zone,
                  map: `${zone.toUpperCase()}_RHYTHM`,
                },
              })
              return
            }
          }
        }
      },
    }
  },
}

export default rule
