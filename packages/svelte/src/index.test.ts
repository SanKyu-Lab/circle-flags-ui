import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, waitFor } from '@testing-library/svelte'
import {
  CircleFlag,
  DynamicFlag,
  FlagUs,
  FlagGb,
  FlagJp,
  FlagAc,
  FLAG_REGISTRY,
  FlagUtils,
  buildMeta,
} from './index'

describe('@sankyu/svelte-circle-flags', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('exports CircleFlag, DynamicFlag and named flags', () => {
    expect(CircleFlag).toBeDefined()
    expect(DynamicFlag).toBeDefined()
    expect(FlagUs).toBeDefined()
    expect(FlagGb).toBeDefined()
    expect(FlagJp).toBeDefined()
    expect(FlagAc).toBeDefined()
  })

  it('renders an alias flag component', () => {
    const { container } = render(FlagAc, { props: { width: 64, height: 64 } })
    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
    expect(svg?.getAttribute('viewBox')).toBe('0 0 512 512')
    expect(svg?.querySelector('title')?.textContent).toBe('SH-AC')
  })

  it('exports registry and utilities', () => {
    expect(FLAG_REGISTRY.us).toBe('FlagUs')
    expect(FlagUtils.isValidCountryCode('us')).toBe(true)
    expect(FlagUtils.isValidCountryCode('not-a-code')).toBe(false)
    expect(FlagUtils.formatCountryCode('us')).toBe('US')
    expect(buildMeta).toBeDefined()
  })

  it('renders a named flag component', () => {
    const { container } = render(FlagUs, { props: { width: 64, height: 64 } })
    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
    expect(svg?.getAttribute('viewBox')).toBe('0 0 512 512')
    expect(svg?.getAttribute('width')).toBe('64')
    expect(svg?.getAttribute('height')).toBe('64')
    expect(svg?.querySelector('title')?.textContent).toBe('US')
  })

  it('renders DynamicFlag with a valid code', () => {
    const { container } = render(DynamicFlag, { props: { code: 'gb', width: 48 } })
    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
    expect(svg?.querySelector('title')?.textContent).toBe('GB')
  })

  it('renders DynamicFlag fallback for invalid code', () => {
    const { container } = render(DynamicFlag, { props: { code: 'not-a-code' } })
    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
    expect(svg?.querySelector('title')?.textContent).toBe('NOT-A-CODE')
  })

  describe('CircleFlag', () => {
    it('loads and renders an SVG from the CDN', async () => {
      const svg = '<svg><title>US</title><circle /></svg>'
      globalThis.fetch = vi.fn(() =>
        Promise.resolve({ ok: true, text: () => Promise.resolve(svg) })
      ) as unknown as typeof fetch

      const { container } = render(CircleFlag, { props: { countryCode: 'us' } })
      await waitFor(() => {
        expect(container.querySelector('div')?.innerHTML).toContain('<svg')
      })
      expect(container.querySelector('div')?.innerHTML).toContain('US')
    })

    it('shows fallback when the CDN request fails', async () => {
      globalThis.fetch = vi.fn(() =>
        Promise.resolve({ ok: false, statusText: 'Not Found' })
      ) as unknown as typeof fetch

      const { container } = render(CircleFlag, { props: { countryCode: 'xx' } })
      await waitFor(() => {
        expect(container.querySelector('text')?.textContent).toBe('XX')
      })
    })

    it('aborts in-flight requests on unmount', async () => {
      const abortSpy = vi.fn()
      const fetchNever = vi.fn(() =>
        Promise.resolve({
          ok: true,
          text: () =>
            new Promise(() => {
              // never resolves
            }),
        })
      ) as unknown as typeof fetch

      globalThis.fetch = fetchNever
      globalThis.AbortController = class extends AbortController {
        abort(reason) {
          abortSpy(reason)
          super.abort(reason)
        }
      } as unknown as typeof AbortController

      const { unmount } = render(CircleFlag, { props: { countryCode: 'us' } })
      unmount()
      expect(abortSpy).toHaveBeenCalled()
    })

    it('sanitizes SVG containing a script tag', async () => {
      const svg = '<svg><script>alert(1)</script><title>US</title></svg>'
      globalThis.fetch = vi.fn(() =>
        Promise.resolve({ ok: true, text: () => Promise.resolve(svg) })
      ) as unknown as typeof fetch

      const { container } = render(CircleFlag, { props: { countryCode: 'us' } })
      await waitFor(() => {
        expect(container.querySelector('div')?.innerHTML).toContain('US')
      })
      expect(container.querySelector('div')?.innerHTML).not.toContain('<script>')
    })

    it('renders fallback for an empty country code', () => {
      const { container } = render(CircleFlag, { props: { countryCode: '   ' } })
      expect(container.querySelector('text')?.textContent).toBe('')
    })
  })
})
