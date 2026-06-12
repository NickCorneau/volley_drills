import { render } from '@testing-library/react'

import {
  BODY_RHYTHM,
  FOOTER_RHYTHM,
  HEADER_RHYTHM,
  ScreenShell,
} from '../ScreenShell'

/**
 * Spacing-contract pin (2026-06-11). Zone spacing across the app is
 * owned by the named rhythm maps in ScreenShell — these assertions are
 * the single place the pixel values are pinned. Retuning the app's
 * spacing should change THIS file plus ScreenShell.tsx and nothing
 * else; a failure here means the contract moved, which is fine when
 * intentional (update the pins) and a drift bug when not.
 */
describe('ScreenShell zone rhythms', () => {
  it('pins the named rhythm values', () => {
    expect(HEADER_RHYTHM).toEqual({
      flow: 'pt-2 pb-3',
      landing: 'pt-6 pb-4',
    })
    expect(BODY_RHYTHM).toEqual({
      cockpit: 'gap-4 pb-4',
      calm: 'gap-6 pb-4',
      landing: 'gap-8 pb-4',
      celebration: 'gap-10 pb-4',
      quiet: 'pb-6',
    })
    expect(FOOTER_RHYTHM).toEqual({
      cta: 'flex flex-col gap-3 pt-4',
      caption: 'flex flex-col items-center gap-1 pt-4 text-center',
    })
  })

  it('applies the default rhythms (flow / calm / cta) when none is given', () => {
    const { container } = render(
      <ScreenShell>
        <ScreenShell.Header>top</ScreenShell.Header>
        <ScreenShell.Body>middle</ScreenShell.Body>
        <ScreenShell.Footer>bottom</ScreenShell.Footer>
      </ScreenShell>,
    )

    const header = container.querySelector('[data-screen-shell-header]')!
    for (const cls of HEADER_RHYTHM.flow.split(' ')) {
      expect(header.className).toContain(cls)
    }

    const body = container.querySelector('[data-screen-shell-body]')!
    for (const cls of BODY_RHYTHM.calm.split(' ')) {
      expect(body.className).toContain(cls)
    }

    const footer = container.querySelector('[data-screen-shell-footer]')!
    for (const cls of FOOTER_RHYTHM.cta.split(' ')) {
      expect(footer.className).toContain(cls)
    }
  })

  it('applies a named rhythm and still appends caller className', () => {
    const { container } = render(
      <ScreenShell>
        <ScreenShell.Body rhythm="cockpit" className="items-center">
          x
        </ScreenShell.Body>
      </ScreenShell>,
    )

    const body = container.querySelector('[data-screen-shell-body]')!
    for (const cls of BODY_RHYTHM.cockpit.split(' ')) {
      expect(body.className).toContain(cls)
    }
    expect(body.className).toContain('items-center')
    expect(body.className).not.toContain('gap-6')
  })
})
