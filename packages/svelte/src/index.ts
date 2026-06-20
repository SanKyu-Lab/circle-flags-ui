import {
  codeToComponentName,
  FlagSizes,
  getSizeName,
  FLAG_REGISTRY,
  type FlagCode,
  type FlagSizeName,
} from '@sankyu/circle-flags-core'

export { default as CircleFlag } from './CircleFlag.svelte'
export { default as DynamicFlag } from './DynamicFlag.svelte'

export { FlagSizes, getSizeName }
export type { FlagSizeName }

export const FlagUtils = {
  isValidCountryCode: (code: string): boolean => {
    return Object.prototype.hasOwnProperty.call(FLAG_REGISTRY, code.toLowerCase())
  },

  formatCountryCode: (code: string): string => {
    return code.toUpperCase()
  },

  getComponentName: codeToComponentName,

  sizes: FlagSizes,
  getSizeName,
} as const

export { buildMeta } from './meta'
export type { BuildMeta } from './meta'

export type CountryCode = FlagCode

export * from './flags'

export { FLAG_REGISTRY, coerceFlagCode, isFlagCode, type FlagCode } from '@sankyu/circle-flags-core'
