import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'

import { CircleFlag, DynamicFlag, FlagUtils } from './index'
import { FlagUs } from '../generated/flags/us'

const cdn = (code: string) => `https://hatscripts.github.io/circle-flags/flags/${code}.svg`

const installFetch = () => {
  const pending = new Map<string, (svg: string) => void>()
  const aborted: string[] = []
  globalThis.fetch = vi.fn(
    (url: string, init: RequestInit) =>
      new Promise<Response>((resolve, reject) => {
        init.signal?.addEventListener('abort', () => {
          aborted.push(url)
          reject(Object.assign(new Error('aborted'), { name: 'AbortError' }))
        })
        pending.set(url, svg =>
          resolve({ ok: true, statusText: 'OK', text: async () => svg } as Response)
        )
      })
  ) as unknown as typeof fetch
  return { pending, aborted }
}

describe('@sankyu/vue-circle-flags', () => {
  it('FlagUtils.isValidCountryCode works', () => {
    expect(FlagUtils.isValidCountryCode('us')).toBe(true)
    expect(FlagUtils.isValidCountryCode('zzzz')).toBe(false)
  })

  it('namespaces inline SVG ids per flag to avoid document-wide collisions', () => {
    const wrapper = mount(FlagUs, { props: { width: 32 } })
    expect(wrapper.find('mask').attributes('id')).toBe('cf-us-a')
    expect(wrapper.html()).toContain('url(#cf-us-a)')
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

  it('DynamicFlag applies the default size and accepts strict codes', () => {
    const wrapper = mount(() => h(DynamicFlag, { code: 'jp', strict: true }))
    const svg = wrapper.find('svg')
    expect(svg.attributes('width')).toBe('48')
    expect(svg.attributes('height')).toBe('48')
    expect(svg.attributes('aria-label')).toBe('JP')
  })

  it('DynamicFlag types reject unknown codes in strict mode', () => {
    // @ts-expect-error strict mode only accepts FlagCode values
    const strictInvalid = () => h(DynamicFlag, { code: 'not-a-code', strict: true })
    const looseUnknown = () => h(DynamicFlag, { code: 'not-a-code' })
    expect(typeof strictInvalid).toBe('function')
    expect(typeof looseUnknown).toBe('function')
  })

  it('CircleFlag shows loading state before fetch resolves', async () => {
    const fetchNever = vi.fn(() => new Promise(() => {})) as unknown as typeof fetch
    globalThis.fetch = fetchNever

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

    globalThis.fetch = fetchOk

    const wrapper = mount(CircleFlag, { props: { countryCode: 'us' } })
    await flushPromises()

    const html = wrapper.html()
    expect(html).not.toContain('<script')
    expect(html).not.toContain('onload=')
    expect(html).toContain('<svg')
  })

  it('CircleFlag shows the fallback when the response is not well-formed SVG', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    globalThis.fetch = vi.fn(
      async () =>
        ({
          ok: true,
          statusText: 'OK',
          text: async () => '<html><body>Not Found</body></html>',
        }) as unknown as Response
    ) as unknown as typeof fetch

    const wrapper = mount(CircleFlag, { props: { countryCode: 'us' } })
    await flushPromises()

    expect(wrapper.find('text').text()).toBe('US')
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })

  it('CircleFlag aborts the previous request when the code changes', async () => {
    const { pending, aborted } = installFetch()
    const wrapper = mount(CircleFlag, { props: { countryCode: 'us' } })
    await flushPromises()
    await wrapper.setProps({ countryCode: 'cn' })
    pending.get(cdn('cn'))?.('<svg id="CN"></svg>')
    await flushPromises()
    pending.get(cdn('us'))?.('<svg id="US"></svg>')
    await flushPromises()
    expect(aborted).toContain(cdn('us'))
    expect(wrapper.html()).toContain('id="CN"')
    expect(wrapper.html()).not.toContain('id="US"')
  })

  it('CircleFlag ignores a pending response after the code is cleared', async () => {
    const { pending, aborted } = installFetch()
    const wrapper = mount(CircleFlag, { props: { countryCode: 'us' } })
    await flushPromises()
    await wrapper.setProps({ countryCode: '' })
    pending.get(cdn('us'))?.('<svg id="US"></svg>')
    await flushPromises()
    expect(aborted).toContain(cdn('us'))
    expect(wrapper.html()).not.toContain('id="US"')
  })

  it('CircleFlag aborts its request on unmount', async () => {
    const { aborted } = installFetch()
    const wrapper = mount(CircleFlag, { props: { countryCode: 'de' } })
    await flushPromises()
    wrapper.unmount()
    expect(aborted).toContain(cdn('de'))
  })

  it('CircleFlag keeps string and array styles after the SVG loads', async () => {
    const { pending } = installFetch()
    const text = mount(CircleFlag, {
      props: { countryCode: 'fr' },
      attrs: { style: 'outline: 1px solid red' },
    })
    const list = mount(CircleFlag, {
      props: { countryCode: 'it' },
      attrs: { style: [{ outline: '1px solid red' }, { opacity: 0.5 }] },
    })
    await flushPromises()
    pending.get(cdn('fr'))?.('<svg id="FR"></svg>')
    pending.get(cdn('it'))?.('<svg id="IT"></svg>')
    await flushPromises()
    const textStyle = text.find('div').attributes('style')
    const listStyle = list.find('div').attributes('style')
    expect(textStyle).toContain('outline')
    expect(textStyle).toContain('width: 48px')
    expect(listStyle).toContain('outline')
    expect(listStyle).toContain('opacity: 0.5')
  })
})
