import { render, screen } from '@testing-library/react'
import {
  CircleFlag,
  DynamicFlag,
  FlagUs,
  FlagCn,
  FlagUS,
  FlagCN,
  FlagGB,
  FlagJP,
  FlagUtils,
  FlagSizes,
  getSizeName,
  buildMeta,
  FLAG_REGISTRY,
} from './index'

describe('Main exports', () => {
  test('should export CircleFlag component', () => {
    expect(CircleFlag).toBeDefined()
    expect(typeof CircleFlag).toBe('function')
  })

  test('should export individual flag components', () => {
    expect(FlagUs).toBeDefined()
    expect(FlagCn).toBeDefined()
    expect(typeof FlagUs).toBe('function')
    expect(typeof FlagCn).toBe('function')
  })
})

describe('CircleFlag component', () => {
  test('should render with default props', () => {
    render(<CircleFlag code="us" />)
    const flag = screen.getByRole('img')
    expect(flag).toBeInTheDocument()
    expect(flag).toHaveAttribute('viewBox')
  })

  test('should render with custom props', () => {
    render(<CircleFlag code="cn" width={48} height={48} className="test-flag" />)
    const flag = screen.getByRole('img')
    expect(flag).toBeInTheDocument()
    expect(flag).toHaveClass('test-flag')
  })

  test('should render different country codes', () => {
    const { rerender } = render(<CircleFlag code="us" />)
    expect(screen.getByRole('img')).toBeInTheDocument()

    rerender(<CircleFlag code="cn" />)
    expect(screen.getByRole('img')).toBeInTheDocument()

    rerender(<CircleFlag code="jp" />)
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  test('should handle uppercase country codes', () => {
    render(<CircleFlag code="US" />)
    const flag = screen.getByRole('img')
    expect(flag).toBeInTheDocument()
  })

  test('should pass through SVG props', () => {
    const style = { border: '1px solid red' }
    render(<CircleFlag code="us" style={style} data-testid="flag" />)
    const flag = screen.getByTestId('flag')
    expect(flag).toBeInTheDocument()
  })
})

describe('DynamicFlag component', () => {
  test('should render the real flag component when available', () => {
    const { container } = render(
      <DynamicFlag code="us" title="Custom Flag Title" data-testid="dynamic-flag" />
    )
    const flag = screen.getByRole('img', { name: 'Custom Flag Title' })
    expect(flag).toBeInTheDocument()
    expect(container.querySelector('text')).toBeNull()
  })

  test('should fall back when the flag component is missing', () => {
    const { container } = render(
      <DynamicFlag code="invalid" title="Fallback Title" data-testid="fallback-flag" />
    )
    const flag = screen.getByRole('img', { name: 'Fallback Title' })
    expect(flag).toBeInTheDocument()
    const fallbackText = container.querySelector('text')
    expect(fallbackText).toBeInTheDocument()
    expect(fallbackText?.textContent).toBe('INVALID')
  })
})

describe('FlagUtils', () => {
  test('should validate country codes using the registry', () => {
    expect(FlagUtils.isValidCountryCode('us')).toBe(true)
    expect(FlagUtils.isValidCountryCode('invalid')).toBe(false)
  })

  test('should format country codes to uppercase', () => {
    expect(FlagUtils.formatCountryCode('uS')).toBe('US')
  })

  test('should get component names from codes with delimiters', () => {
    expect(FlagUtils.getComponentName('gb-wls')).toBe('FlagGbWls')
    expect(FlagUtils.getComponentName('123-abc')).toBe('FlagFlag_123Abc')
  })

  test('should expose sizes and resolve size names', () => {
    expect(FlagUtils.sizes).toEqual(FlagSizes)
    expect(FlagUtils.getSizeName(32)).toBe('md')
    expect(FlagUtils.getSizeName(999)).toBeNull()
  })
})

describe('Individual flag components', () => {
  test('FlagUs should render correctly', () => {
    render(<FlagUs data-testid="us-flag" />)
    const flag = screen.getByTestId('us-flag')
    expect(flag).toBeInTheDocument()
    expect(flag.tagName).toBe('svg')
  })

  test('FlagCn should render correctly', () => {
    render(<FlagCn data-testid="cn-flag" />)
    const flag = screen.getByTestId('cn-flag')
    expect(flag).toBeInTheDocument()
    expect(flag.tagName).toBe('svg')
  })

  test('should accept custom props', () => {
    render(
      <FlagUs
        width={64}
        height={64}
        className="custom-class"
        style={{ opacity: 0.8 }}
        data-testid="custom-flag"
      />
    )
    const flag = screen.getByTestId('custom-flag')
    expect(flag).toBeInTheDocument()
    expect(flag).toHaveClass('custom-class')
  })

  test('alias exports should render correctly', () => {
    render(
      <>
        <FlagUS data-testid="us-flag-alias" />
        <FlagCN data-testid="cn-flag-alias" />
        <FlagGB data-testid="gb-flag-alias" />
        <FlagJP data-testid="jp-flag-alias" />
      </>
    )

    expect(screen.getByTestId('us-flag-alias')).toBeInTheDocument()
    expect(screen.getByTestId('cn-flag-alias')).toBeInTheDocument()
    expect(screen.getByTestId('gb-flag-alias')).toBeInTheDocument()
    expect(screen.getByTestId('jp-flag-alias')).toBeInTheDocument()
  })
})

describe('DynamicFlag accessibility', () => {
  test('should derive default title with emoji when title is missing', () => {
    render(<DynamicFlag code="us" />)
    expect(screen.getByRole('img', { name: '🇺🇸 US' })).toBeInTheDocument()
  })

  test('should handle single-letter code with fallback emoji', () => {
    render(<DynamicFlag code="x" />)
    expect(screen.getByRole('img', { name: '🏳️ X' })).toBeInTheDocument()
  })
})

describe('getSizeName helper', () => {
  test('should return null when size not found', () => {
    expect(getSizeName(1)).toBeNull()
  })
})

describe('Registry and metadata', () => {
  test('FLAG_REGISTRY should expose known mappings', () => {
    expect(FLAG_REGISTRY.us).toBe('FlagUs')
    expect(FLAG_REGISTRY.cn).toBe('FlagCn')
  })

  test('buildMeta should include version, commit, and builtAt', () => {
    expect(buildMeta.version).toMatch(/^[0-9]+\./)
    expect(buildMeta.commit).toBeTruthy()
    expect(Number.isFinite(buildMeta.builtAt)).toBe(true)
  })
})
