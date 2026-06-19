import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/svelte'
import {
  CircleFlag,
  DynamicFlag,
  FlagUs,
  FlagGb,
  FlagJp,
  FLAG_REGISTRY,
  FlagUtils,
  buildMeta,
} from './index'

describe('@sankyu/svelte-circle-flags', () => {
  it('exports CircleFlag, DynamicFlag and named flags', () => {
    expect(CircleFlag).toBeDefined()
    expect(DynamicFlag).toBeDefined()
    expect(FlagUs).toBeDefined()
    expect(FlagGb).toBeDefined()
    expect(FlagJp).toBeDefined()
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
})
