import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, waitFor } from '@testing-library/svelte'
import {
  CircleFlag,
  DynamicFlag,
  LazyFlag,
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

  it('renders an alias flag with its own default title', () => {
    const { container } = render(FlagAc, { props: { width: 64, height: 64 } })
    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
    expect(svg?.getAttribute('viewBox')).toBe('0 0 512 512')
    expect(svg?.getAttribute('aria-label')).toBe('AC')
    expect(svg?.querySelector('title')?.textContent).toBe('AC')
    expect(svg?.innerHTML).toContain('cf-sh-ac-a')
  })

  it('lets an alias flag take a custom title', () => {
    const { container } = render(FlagAc, { props: { title: 'Ascension Island' } })
    expect(container.querySelector('svg')?.getAttribute('aria-label')).toBe('Ascension Island')
  })

  it('DynamicFlag renders an alias code with the alias title', () => {
    const { container } = render(DynamicFlag, { props: { code: 'ac' } })
    expect(container.querySelector('svg')?.getAttribute('aria-label')).toBe('AC')
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

  it('namespaces inline SVG ids per flag to avoid document-wide collisions', () => {
    const { container } = render(FlagUs, { props: { width: 32 } })
    const mask = container.querySelector('mask')
    expect(mask?.id).toBe('cf-us-a')
    expect(container.innerHTML).toContain('url(#cf-us-a)')

    render(FlagJp, { props: { width: 32 } })
    const jpMask = document.querySelector('mask[id^="cf-jp-"]')
    expect(jpMask).toBeTruthy()
    // No bare upstream ids leak into the shared document
    expect(document.querySelectorAll('[id="a"]')).toHaveLength(0)
  })

  it('renders DynamicFlag with a valid code', () => {
    const { container } = render(DynamicFlag, { props: { code: 'gb', width: 48 } })
    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
    expect(svg?.querySelector('title')?.textContent).toBe('GB')
  })

  it('renders LazyFlag after its async chunk resolves', async () => {
    const { container } = render(LazyFlag, { props: { code: 'us', width: 32 } })
    await waitFor(() => {
      expect(container.querySelector('svg')).toBeTruthy()
    })
    expect(container.querySelector('svg')?.getAttribute('width')).toBe('32')
    expect(container.querySelector('mask')?.id).toBe('cf-us-a')
  })

  it('resolves LazyFlag unknown codes to the XX fallback flag', async () => {
    const { container } = render(LazyFlag, { props: { code: 'not-a-code' } })
    await waitFor(() => {
      expect(container.querySelector('svg')).toBeTruthy()
    })
    expect(container.querySelector('title')?.textContent).toBe('XX')
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

    it('shows fallback when the response is not well-formed SVG', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      globalThis.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          text: () => Promise.resolve('<html><body>Not Found</body></html>'),
        })
      ) as unknown as typeof fetch

      const { container } = render(CircleFlag, { props: { countryCode: 'us' } })
      await waitFor(() => {
        expect(container.querySelector('text')?.textContent?.trim()).toBe('US')
      })
      expect(warn).toHaveBeenCalled()
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
