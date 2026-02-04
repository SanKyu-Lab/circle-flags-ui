import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, test, vi } from 'vitest'
import {
  CircleFlag,
  DynamicFlag,
  FlagUtils,
  FlagSizes,
  getSizeName,
  buildMeta,
  FLAG_REGISTRY,
} from './index'
import { FlagUs } from '../generated/flags/us'
import { FlagCn } from '../generated/flags/cn'

type FetchMock = ReturnType<typeof vi.fn>

const getFetchMock = () => globalThis.fetch as unknown as FetchMock

describe('Main exports', () => {
  test('should export CircleFlag component', () => {
    expect(CircleFlag).toBeDefined()
    expect(typeof CircleFlag).toBe('function')
  })

  test('should export DynamicFlag component', () => {
    expect(DynamicFlag).toBeDefined()
    expect(typeof DynamicFlag).toBe('function')
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
    render(<CircleFlag countryCode="us" />)
    const flag = screen.getByRole('img')
    expect(flag).toBeInTheDocument()
    expect(flag).toHaveAttribute('viewBox')
  })

  test('should support backward compatible "code" prop', () => {
    render(<CircleFlag code="us" />)
    const flag = screen.getByRole('img')
    expect(flag).toBeInTheDocument()
    expect(flag).toHaveAttribute('viewBox')
  })

  test('should prioritize countryCode over code', () => {
    render(<CircleFlag countryCode="cn" code="us" data-testid="flag" />)
    const flag = screen.getByTestId('flag')
    expect(flag).toBeInTheDocument()
  })

  test('should render with custom props', () => {
    render(<CircleFlag countryCode="cn" width={48} height={48} className="test-flag" />)
    const flag = screen.getByRole('img')
    expect(flag).toBeInTheDocument()
    expect(flag).toHaveClass('test-flag')
  })

  test('should render different country codes', () => {
    const { rerender } = render(<CircleFlag countryCode="us" />)
    expect(screen.getByRole('img')).toBeInTheDocument()

    rerender(<CircleFlag countryCode="cn" />)
    expect(screen.getByRole('img')).toBeInTheDocument()

    rerender(<CircleFlag countryCode="jp" />)
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  test('should handle uppercase country codes', () => {
    render(<CircleFlag countryCode="US" />)
    const flag = screen.getByRole('img')
    expect(flag).toBeInTheDocument()
  })

  test('should pass through SVG props', () => {
    const style = { border: '1px solid red' }
    render(<CircleFlag countryCode="us" style={style} data-testid="flag" />)
    const flag = screen.getByTestId('flag')
    expect(flag).toBeInTheDocument()
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
})

describe('CircleFlag CDN loading', () => {
  const fetchMock = getFetchMock()

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('should show loading state initially', () => {
    fetchMock.mockImplementation(() => new Promise(() => {})) // Never resolves

    render(<CircleFlag countryCode="us" data-testid="flag" />)
    const flag = screen.getByTestId('flag')
    expect(flag).toBeInTheDocument()
  })

  test('should show error fallback on fetch failure', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    fetchMock.mockRejectedValue(new Error('Network error'))

    render(<CircleFlag countryCode="us" data-testid="flag" />)

    await waitFor(() => {
      const text = screen.getByText('US')
      expect(text).toBeInTheDocument()
    })
  })

  test('should use custom CDN URL when provided', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      text: async () => '<svg></svg>',
    })

    render(
      <CircleFlag countryCode="io" cdnUrl="https://hatscripts.github.io/circle-flags/flags/" />
    )

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        'https://hatscripts.github.io/circle-flags/flags/io.svg'
      )
    })
  })

  test('should mark error state when country code is missing', async () => {
    render(<CircleFlag data-testid="flag-without-code" />)

    await waitFor(() => {
      const flag = screen.getByTestId('flag-without-code')
      expect(flag).toHaveAttribute('aria-label', '🏳️ ')
    })

    expect(fetchMock).not.toHaveBeenCalled()
  })

  test('should handle non-ok responses and show fallback', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    fetchMock.mockResolvedValue({
      ok: false,
      statusText: 'Not Found',
      text: async () => '<svg></svg>',
    })

    render(<CircleFlag countryCode="us" data-testid="flag-error" />)

    await waitFor(() => {
      expect(screen.getByText('US')).toBeInTheDocument()
    })

    expect(warnSpy).toHaveBeenCalledWith(
      'Failed to load flag for country code: us',
      expect.any(Error)
    )
  })

  test('should render fetched SVG with injected size attributes', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      text: async () => '<svg viewBox="0 0 1 1"><circle cx="0" cy="0" r="1"/></svg>',
    })

    render(<CircleFlag countryCode="us" data-testid="flag-success" />)

    await waitFor(() => {
      const container = screen.getByRole('img', { name: '🇺🇸 US' })
      expect(container.innerHTML).toContain('width="100%" height="100%"')
    })
  })

  test('should sanitize external SVG content before injection', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      text: async () => '<svg><script>alert(1)</script><circle cx="0" cy="0" r="1"/></svg>',
    })

    render(<CircleFlag countryCode="us" data-testid="flag-sanitized" />)

    await waitFor(() => {
      const container = screen.getByTestId('flag-sanitized')
      expect(container.innerHTML).not.toContain('<script>')
    })
  })

  test('should strip event handler attributes from fetched SVG', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      text: async () =>
        '<svg><circle cx="0" cy="0" r="1" onload="alert(1)" onclick="alert(2)"/></svg>',
    })

    render(<CircleFlag countryCode="us" data-testid="flag-events" />)

    await waitFor(() => {
      const container = screen.getByTestId('flag-events')
      expect(container.innerHTML).not.toContain('onload')
      expect(container.innerHTML).not.toContain('onclick')
    })
  })

  test('should strip javascript: hrefs from fetched SVG', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      text: async () =>
        '<svg><use href="javascript:alert(1)" xlink:href="javascript:alert(2)"/></svg>',
    })

    render(<CircleFlag countryCode="us" data-testid="flag-href" />)

    await waitFor(() => {
      const container = screen.getByTestId('flag-href')
      expect(container.innerHTML).not.toContain('javascript:')
    })
  })

  test('should run href sanitizer branch with DOMParser present', async () => {
    const originalParser = global.DOMParser
    let parserCalled = false

    class MockParser {
      parseFromString() {
        parserCalled = true
        return {
          querySelector: () => null,
          documentElement: {
            outerHTML: '<svg><use/></svg>',
            querySelectorAll: (selector: string) => {
              if (selector === 'script,foreignObject') {
                return [{ remove: vi.fn() }]
              }
              if (selector === '*') {
                return [
                  {
                    attributes: [
                      {
                        name: 'href',
                        value: 'javascript:alert(1)',
                        removeAttribute: vi.fn(),
                      },
                      {
                        name: 'xlink:href',
                        value: 'javascript:alert(2)',
                        removeAttribute: vi.fn(),
                      },
                    ],
                  },
                ]
              }
              return []
            },
          },
        }
      }
    }

    // @ts-expect-error - override for test
    global.DOMParser = MockParser as unknown as typeof DOMParser
    fetchMock.mockResolvedValue({
      ok: true,
      text: async () => '<svg><use href="javascript:alert(1)"/></svg>',
    })

    render(<CircleFlag countryCode="us" data-testid="flag-href-parser" />)

    await waitFor(() => {
      const container = screen.getByTestId('flag-href-parser')
      expect(parserCalled).toBe(true)
      expect(container.innerHTML).not.toContain('javascript:')
    })

    global.DOMParser = originalParser
  })

  test('should fall back when DOMParser is unavailable', async () => {
    const originalParser = global.DOMParser
    // @ts-expect-error - simulate absence
    global.DOMParser = undefined
    fetchMock.mockResolvedValue({
      ok: true,
      text: async () => '<svg><script>alert(1)</script></svg>',
    })

    render(<CircleFlag countryCode="us" data-testid="flag-no-parser" />)

    await waitFor(() => {
      const container = screen.getByTestId('flag-no-parser')
      expect(container.innerHTML).toContain('<script>')
    })

    global.DOMParser = originalParser
  })
})

describe('getSizeName helper', () => {
  test('should return null when size not found', () => {
    expect(getSizeName(1)).toBeNull()
  })
})

describe('DynamicFlag component', () => {
  test('should render with default props', () => {
    render(<DynamicFlag code="us" />)
    const flag = screen.getByRole('img')
    expect(flag).toBeInTheDocument()
    expect(flag).toHaveAttribute('viewBox')
  })

  test('should render with custom props', () => {
    render(<DynamicFlag code="cn" width={64} height={64} className="test-flag" />)
    const flag = screen.getByRole('img')
    expect(flag).toBeInTheDocument()
    expect(flag).toHaveClass('test-flag')
  })

  test('should render different country codes', () => {
    const { rerender } = render(<DynamicFlag code="us" />)
    expect(screen.getByRole('img')).toBeInTheDocument()

    rerender(<DynamicFlag code="cn" />)
    expect(screen.getByRole('img')).toBeInTheDocument()

    rerender(<DynamicFlag code="jp" />)
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  test('should handle uppercase country codes', () => {
    render(<DynamicFlag code="US" />)
    const flag = screen.getByRole('img')
    expect(flag).toBeInTheDocument()
  })

  test('should handle invalid country codes', () => {
    render(<DynamicFlag code="invalid" data-testid="invalid-flag" />)
    const flag = screen.getByTestId('invalid-flag')
    expect(flag).toBeInTheDocument()
    expect(flag.tagName.toLowerCase()).toBe('svg')
    expect(flag).toHaveAttribute('aria-label', 'INVALID')
    expect(flag.querySelector('title')?.textContent).toBe('INVALID')
    expect(flag.querySelector('text')).toBeNull()
  })

  test('should log error when registry entry is missing implementation', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const registry = FLAG_REGISTRY as Record<string, string>
    registry['missing'] = 'FlagMissing'

    render(<DynamicFlag code="missing" data-testid="missing-flag" />)

    expect(errorSpy).toHaveBeenCalledWith('Flag component not found for code: missing')
    expect(screen.getByText('Flag not found: missing')).toBeInTheDocument()

    delete registry['missing']
  })
})

describe('Registry and metadata', () => {
  test('FLAG_REGISTRY should expose known mappings', () => {
    expect(FLAG_REGISTRY.us).toBe('FlagUs')
    expect(FLAG_REGISTRY.cn).toBe('FlagCn')
  })

  test('buildMeta should include version, commit, circleFlagsCommit, and builtAt', () => {
    expect(buildMeta.version).toMatch(/^[0-9]+\./)
    expect(buildMeta.commitHash).toBeTruthy()
    expect(buildMeta.circleFlagsCommitHash).toBeTruthy()
    expect(Number.isFinite(buildMeta.builtTimestamp)).toBe(true)
  })

  test('buildMeta should use provided build-time constants when available', async () => {
    vi.resetModules()
    const mockCommit = 'abc123'
    const mockCircleFlagsCommit = 'def456'
    const mockBuiltAt = '1700000000'

    ;(globalThis as Record<string, unknown>).__REACT_CIRCLE_FLAGS_COMMIT__ = mockCommit
    ;(globalThis as Record<string, unknown>).__REACT_CIRCLE_FLAGS_CIRCLE_FLAGS_COMMIT__ =
      mockCircleFlagsCommit
    ;(globalThis as Record<string, unknown>).__REACT_CIRCLE_FLAGS_BUILT_AT__ = mockBuiltAt

    const metaModule = await import('./meta')

    expect(metaModule.buildMeta.commitHash).toBe(mockCommit)
    expect(metaModule.buildMeta.circleFlagsCommitHash).toBe(mockCircleFlagsCommit)
    expect(metaModule.buildMeta.builtTimestamp).toBe(Number(mockBuiltAt))

    delete (globalThis as Record<string, unknown>).__REACT_CIRCLE_FLAGS_COMMIT__
    delete (globalThis as Record<string, unknown>).__REACT_CIRCLE_FLAGS_CIRCLE_FLAGS_COMMIT__
    delete (globalThis as Record<string, unknown>).__REACT_CIRCLE_FLAGS_BUILT_AT__
  })

  test('buildMeta should fall back to Date.now when builtAt is invalid', async () => {
    vi.resetModules()
    const nowSpy = vi.spyOn(Date, 'now').mockReturnValue(999999)
    ;(globalThis as Record<string, unknown>).__REACT_CIRCLE_FLAGS_BUILT_AT__ = 'invalid'

    const metaModule = await import('./meta')

    expect(metaModule.buildMeta.builtTimestamp).toBe(999999)
    expect(metaModule.buildMeta.commitHash).toBe('dev')
    expect(metaModule.buildMeta.circleFlagsCommitHash).toBe('unknown')

    delete (globalThis as Record<string, unknown>).__REACT_CIRCLE_FLAGS_BUILT_AT__
    nowSpy.mockRestore()
  })
})
