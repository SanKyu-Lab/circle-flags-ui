import { describe, expect, it } from 'vitest'
import { coerceFlagCode } from '@sankyu/circle-flags-core'
import { FlagUtils } from './index'

describe('@sankyu/solid-circle-flags', () => {
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
})
