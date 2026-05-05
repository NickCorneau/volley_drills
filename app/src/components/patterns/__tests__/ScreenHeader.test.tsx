import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ScreenShell } from '../../ui/ScreenShell'
import { ScreenHeader } from '../ScreenHeader'

function renderHeader(props: Parameters<typeof ScreenHeader>[0]) {
  return render(
    <ScreenShell>
      <ScreenHeader {...props} />
    </ScreenShell>,
  )
}

describe('ScreenHeader', () => {
  it('renders the BackButton with the supplied label and forwards onBack', async () => {
    const user = userEvent.setup()
    const onBack = vi.fn()
    renderHeader({ backLabel: 'Back', onBack, title: 'Settings' })

    const back = screen.getByRole('button', { name: /back/i })
    await user.click(back)
    expect(onBack).toHaveBeenCalledTimes(1)
  })

  it('renders the title as an h1 with canonical typography', () => {
    renderHeader({ backLabel: 'Back', onBack: () => {}, title: 'Today\u2019s setup' })
    const heading = screen.getByRole('heading', { level: 1, name: /today\u2019s setup/i })
    expect(heading.className).toMatch(/text-xl/)
    expect(heading.className).toMatch(/font-semibold/)
    expect(heading.className).toMatch(/text-center/)
  })

  it('renders the default right-cell spacer when `right` is omitted', () => {
    const { container } = renderHeader({
      backLabel: 'Back',
      onBack: () => {},
      title: 'Settings',
    })
    const headerWrapper = container.querySelector('[data-screen-shell-header]')
    expect(headerWrapper).not.toBeNull()
    const spacer = headerWrapper!.querySelector('div[aria-hidden]')
    expect(spacer).not.toBeNull()
    expect(spacer!.className).toContain('w-12')
  })

  it('renders the supplied `right` node instead of the default spacer', () => {
    renderHeader({
      backLabel: 'Back',
      onBack: () => {},
      title: 'Settings',
      right: (
        <button type="button" data-testid="action">
          Action
        </button>
      ),
    })
    expect(screen.getByTestId('action')).toBeInTheDocument()
  })

  it('uses backAriaLabel when supplied (overrides the BackButton default)', () => {
    renderHeader({
      backLabel: 'Skill level',
      onBack: () => {},
      title: 'Today\u2019s setup',
      backAriaLabel: 'Back to skill level selection',
    })
    expect(
      screen.getByRole('button', { name: 'Back to skill level selection' }),
    ).toBeInTheDocument()
  })

  it('appends caller-supplied className to the ScreenShell.Header wrapper', () => {
    const { container } = renderHeader({
      backLabel: 'Back',
      onBack: () => {},
      title: 'Settings',
      className: 'my-custom-class',
    })
    const headerWrapper = container.querySelector('[data-screen-shell-header]')
    expect(headerWrapper!.className).toContain('my-custom-class')
    expect(headerWrapper!.className).toContain('flex items-center gap-2 pt-2 pb-3')
  })
})
