import { describe, expect, it, vi } from 'vitest'
import { coerceFlagCode } from '@sankyu/circle-flags-core'
import { CircleFlag, DynamicFlag, FlagUtils } from './index'
import { createSignal } from 'solid-js'
import type { JSX } from 'solid-js'
import { render } from 'solid-js/web'
import { FlagUs } from '../generated/flags/us'

const flush = () => new Promise(resolve => setTimeout(resolve, 0))
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

const mount = (view: () => JSX.Element) => {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const dispose = render(view, container)
  return {
    container,
    dispose: () => {
      dispose()
      container.remove()
    },
  }
}

describe('@sankyu/solid-circle-flags', () => {
  it('namespaces inline SVG ids per flag to avoid document-wide collisions', () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const dispose = render(() => <FlagUs width={32} />, container)
    const mask = container.querySelector('mask')
    const html = container.innerHTML
    dispose()
    container.remove()
    expect(mask?.id).toBe('cf-us-a')
    expect(html).toContain('url(#cf-us-a)')
  })

  it('FlagUtils.isValidCountryCode works', () => {
    expect(FlagUtils.isValidCountryCode('us')).toBe(true)
    expect(FlagUtils.isValidCountryCode('zzzz')).toBe(false)
  })

  it('FlagUtils.formatCountryCode works', () => {
    expect(FlagUtils.formatCountryCode('us')).toBe('US')
    expect(FlagUtils.formatCountryCode('cn')).toBe('CN')
  })

  it('FlagUtils.getComponentName works', () => {
    expect(FlagUtils.getComponentName('us')).toBe('FlagUs')
    expect(FlagUtils.getComponentName('gb-eng')).toBe('FlagGbEng')
  })

  it('coerceFlagCode coerces unknown code to xx', () => {
    expect(coerceFlagCode('zzzz')).toBe('xx')
  })

  it('flag components apply both class and className', () => {
    const { container, dispose } = mount(() => <FlagUs class="a" className="b" />)
    const value = container.querySelector('svg')?.getAttribute('class')
    dispose()
    expect(value).toBe('a b')
  })

  it('DynamicFlag forwards class and className to the flag', () => {
    const { container, dispose } = mount(() => <DynamicFlag code="jp" class="a" className="b" />)
    const value = container.querySelector('svg')?.getAttribute('class')
    dispose()
    expect(value).toBe('a b')
  })

  it('CircleFlag drops a stale response after the code changes', async () => {
    const { pending, aborted } = installFetch()
    const [code, setCode] = createSignal('us')
    const { container, dispose } = mount(() => <CircleFlag countryCode={code()} />)
    setCode('cn')
    await flush()
    pending.get(cdn('cn'))?.('<svg id="CN"></svg>')
    await flush()
    pending.get(cdn('us'))?.('<svg id="US"></svg>')
    await flush()
    const html = container.innerHTML
    dispose()
    expect(aborted).toContain(cdn('us'))
    expect(html).toContain('id="CN"')
    expect(html).not.toContain('id="US"')
  })

  it('CircleFlag aborts its request on dispose', async () => {
    const { aborted } = installFetch()
    const { dispose } = mount(() => <CircleFlag countryCode="de" />)
    await flush()
    dispose()
    expect(aborted).toContain(cdn('de'))
  })

  it('CircleFlag renders the loading placeholder while the request is pending', async () => {
    installFetch()
    const { container, dispose } = mount(() => <CircleFlag countryCode="us" />)
    await flush()
    const html = container.innerHTML
    dispose()
    expect(html).toContain('animate-pulse')
    expect(html).not.toContain('<text')
  })

  it('CircleFlag renders the code fallback when the request fails', async () => {
    globalThis.fetch = vi.fn(async () => ({ ok: false, statusText: 'Not Found' }) as Response)
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { container, dispose } = mount(() => <CircleFlag countryCode="zz" />)
    await flush()
    await flush()
    const text = container.querySelector('text')?.textContent
    dispose()
    warn.mockRestore()
    expect(text).toBe('ZZ')
  })

  it('CircleFlag keeps string and object styles after the SVG loads', async () => {
    const { pending } = installFetch()
    const { container, dispose } = mount(() => (
      <>
        <CircleFlag countryCode="fr" style="outline: 1px solid red" />
        <CircleFlag countryCode="it" style={{ opacity: '0.5' }} />
      </>
    ))
    await flush()
    pending.get(cdn('fr'))?.('<svg id="FR"></svg>')
    pending.get(cdn('it'))?.('<svg id="IT"></svg>')
    await flush()
    const [first, second] = Array.from(container.children) as HTMLElement[]
    const styles = [first.getAttribute('style') ?? '', second.getAttribute('style') ?? '']
    dispose()
    expect(first.tagName).toBe('DIV')
    expect(styles[0]).toContain('outline')
    expect(styles[0]).toContain('width: 48px')
    expect(styles[1]).toContain('opacity')
    expect(styles[1]).toContain('width: 48px')
  })
})
