import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'
import { FlagUs, FlagCn, FlagJp, FlagGb, FlagDe } from '../../generated/flags'

// Sample flag components for testing
const sampleFlags = [
  { name: 'FlagUs', component: FlagUs },
  { name: 'FlagCn', component: FlagCn },
  { name: 'FlagJp', component: FlagJp },
  { name: 'FlagGb', component: FlagGb },
  { name: 'FlagDe', component: FlagDe },
]

describe('Flag Components', () => {
  describe.each(sampleFlags)('$name', ({ name, component: FlagComponent }) => {
    test(`should render as SVG element`, () => {
      render(<FlagComponent data-testid={`${name.toLowerCase()}-flag`} />)
      const flag = screen.getByTestId(`${name.toLowerCase()}-flag`)
      expect(flag.tagName).toBe('svg')
    })

    test(`should accept width and height props`, () => {
      render(
        <FlagComponent width={48} height={48} data-testid={`${name.toLowerCase()}-sized-flag`} />
      )
      const flag = screen.getByTestId(`${name.toLowerCase()}-sized-flag`)
      expect(flag).toBeInTheDocument()
    })

    test(`should accept custom className`, () => {
      render(
        <FlagComponent
          className="custom-flag-class"
          data-testid={`${name.toLowerCase()}-styled-flag`}
        />
      )
      const flag = screen.getByTestId(`${name.toLowerCase()}-styled-flag`)
      expect(flag).toHaveClass('custom-flag-class')
    })

    test(`should accept custom style prop`, () => {
      const customStyle = { border: '2px solid red', borderRadius: '50%' }
      render(
        <FlagComponent
          style={customStyle}
          data-testid={`${name.toLowerCase()}-inline-styled-flag`}
        />
      )
      const flag = screen.getByTestId(`${name.toLowerCase()}-inline-styled-flag`)
      expect(flag).toBeInTheDocument()
    })

    test(`should have viewBox attribute`, () => {
      render(<FlagComponent data-testid={`${name.toLowerCase()}-viewbox-flag`} />)
      const flag = screen.getByTestId(`${name.toLowerCase()}-viewbox-flag`)
      expect(flag).toHaveAttribute('viewBox')
    })

    test(`should support data attributes`, () => {
      render(<FlagComponent data-country="test" data-testid={`${name.toLowerCase()}-data-flag`} />)
      const flag = screen.getByTestId(`${name.toLowerCase()}-data-flag`)
      expect(flag).toHaveAttribute('data-country', 'test')
    })

    test(`should support event handlers`, () => {
      const handleClick = vi.fn()
      render(
        <FlagComponent onClick={handleClick} data-testid={`${name.toLowerCase()}-clickable-flag`} />
      )
      const flag = screen.getByTestId(`${name.toLowerCase()}-clickable-flag`)
      fireEvent.click(flag)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })
})

describe('Flag component consistency', () => {
  test('all flag components should have similar structure', () => {
    const flags = [FlagUs, FlagCn, FlagJp, FlagGb, FlagDe]

    flags.forEach((FlagComponent, index) => {
      const { container } = render(<FlagComponent data-testid={`consistency-flag-${index}`} />)
      const flag = container.querySelector('svg')
      expect(flag).toBeInTheDocument()
      expect(flag?.tagName).toBe('svg')
    })
  })

  test('all flag components should support standard SVG props', () => {
    const commonProps = {
      width: 32,
      height: 32,
      className: 'test-class',
      style: { opacity: 0.8 },
      'data-test': 'test-value',
    }

    sampleFlags.forEach(({ component: FlagComponent }) => {
      const { container } = render(<FlagComponent {...commonProps} />)
      const flag = container.querySelector('svg')
      expect(flag).toBeInTheDocument()
    })
  })
})
