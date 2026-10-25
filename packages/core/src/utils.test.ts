import { afterEach, describe, expect, it, vi } from 'vitest'
import { coerceFlagCode, escapeHtml, isFlagCode, sanitizeSvg } from './utils'

const svg = (inner: string, rootAttributes = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"${rootAttributes}>${inner}</svg>`

describe('sanitizeSvg', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('keeps regular flag markup', () => {
    const output = sanitizeSvg(
      svg('<mask id="a"><circle cx="256" cy="256" r="256" fill="#fff"/></mask><use href="#a"/>')
    )
    expect(output).toContain('<mask id="a">')
    expect(output).toContain('<circle cx="256" cy="256" r="256" fill="#fff"')
    expect(output).toContain('href="#a"')
  })

  it('removes script and foreignObject elements with their content', () => {
    const output = sanitizeSvg(
      svg(
        '<script>alert(1)</script><foreignObject><div>alert(2)</div></foreignObject><circle r="1"/>'
      )
    )
    expect(output).not.toMatch(/script|foreignObject|alert/)
    expect(output).toContain('<circle r="1"')
  })

  it('removes event handler attributes, including on the root element', () => {
    const output = sanitizeSvg(svg('<circle r="1" onclick="alert(2)"/>', ' onload="alert(1)"'))
    expect(output).not.toMatch(/onload|onclick|alert/)
  })

  it.each([
    'javascript:alert(1)',
    'JaVaScRiPt:alert(1)',
    ' javascript:alert(1)',
    'java&#9;script:alert(1)',
    'java&#10;script:alert(1)',
    '&#106;avascript:alert(1)',
  ])('removes the script URL %s from href, xlink:href and src', value => {
    const output = sanitizeSvg(
      svg(
        `<a href="${value}"><text>a</text></a><a xlink:href="${value}"><text>b</text></a><image src="${value}"/>`
      )
    )
    expect(output).not.toMatch(/alert/)
  })

  it('removes set and animate elements that change a link target', () => {
    const output = sanitizeSvg(
      svg(
        '<a><set attributeName="href" to="javascript:alert(1)"/><animate attributeName=" XLINK:HREF " values="javascript:alert(2)"/><animate attributeName="opacity" values="0;1"/><text>x</text></a>'
      )
    )
    expect(output).not.toMatch(/alert|<set/)
    expect(output).toContain('attributeName="opacity"')
  })

  it('returns an empty string for markup that is not well-formed SVG', () => {
    expect(sanitizeSvg('<html><body>flag</body></html>')).toBe('')
    expect(sanitizeSvg('<svg><circle></svg>')).toBe('')
  })

  it('returns an empty string without DOMParser', () => {
    vi.stubGlobal('DOMParser', undefined)
    expect(sanitizeSvg(svg('<circle r="1"/>'))).toBe('')
  })
})

describe('flag codes', () => {
  it('coerces codes to known flags', () => {
    expect(coerceFlagCode(' US ')).toBe('us')
    expect(coerceFlagCode('zzzz')).toBe('xx')
  })

  it('only accepts normalized known codes as FlagCode', () => {
    expect(isFlagCode('us')).toBe(true)
    expect(isFlagCode('US')).toBe(false)
    expect(isFlagCode('zzzz')).toBe(false)
  })
})

describe('escapeHtml', () => {
  it('escapes the characters that start markup or end an attribute', () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe(
      '&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;'
    )
  })
})
