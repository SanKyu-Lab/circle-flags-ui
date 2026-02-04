import { describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import { CircleFlag, DynamicFlag, FlagUtils } from './index'

describe('@sankyu/vue-circle-flags', () => {
  it('FlagUtils.isValidCountryCode works', () => {
    expect(FlagUtils.isValidCountryCode('us')).toBe(true)
    expect(FlagUtils.isValidCountryCode('zzzz')).toBe(false)
  })

  it('DynamicFlag renders fallback for unknown code', () => {
    const wrapper = mount(DynamicFlag, { props: { code: 'zzzz' } })
    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
    expect(svg.attributes('aria-label')).toBe('ZZZZ')
    expect(wrapper.html()).toContain('<title>ZZZZ</title>')
  })

  it('DynamicFlag renders a real flag component for known code', () => {
    const wrapper = mount(DynamicFlag, { props: { code: 'us' } })
    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
    expect(svg.attributes('aria-label')).toBe('US')
    expect(svg.html()).toContain('<title>')
    expect(svg.html()).toContain('US')
  })

  it('CircleFlag shows loading state before fetch resolves', async () => {
    const fetchNever = vi.fn(() => new Promise(() => {})) as unknown as typeof fetch
    globalThis.fetch = fetchNever as any

    const wrapper = mount(CircleFlag, { props: { countryCode: 'us' } })
    await flushPromises()

    expect(wrapper.find('circle.animate-pulse').exists()).toBe(true)
  })

  it('CircleFlag sanitizes fetched SVG (removes <script> and on* attributes)', async () => {
    const svg = `<svg viewBox="0 0 512 512"><script>alert(1)</script><circle onload="alert(1)" cx="1" cy="1" r="1"/></svg>`

    const fetchOk = vi.fn(async () => {
      return {
        ok: true,
        statusText: 'OK',
        text: async () => svg,
      } as unknown as Response
    }) as unknown as typeof fetch

    globalThis.fetch = fetchOk as any

    const wrapper = mount(CircleFlag, { props: { countryCode: 'us' } })
    await flushPromises()

    const html = wrapper.html()
    expect(html).not.toContain('<script')
    expect(html).not.toContain('onload=')
    expect(html).toContain('<svg')
  })
})
