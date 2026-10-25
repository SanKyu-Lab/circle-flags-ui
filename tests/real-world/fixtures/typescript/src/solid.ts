import { DynamicFlag, FlagUs } from '@sankyu/solid-circle-flags'
import { FlagJp } from '@sankyu/solid-circle-flags/flags/jp'
import { buildMeta } from '@sankyu/solid-circle-flags/meta'

export const elements = [
  FlagUs({ width: 32, title: 'United States' }),
  FlagJp({ class: 'flag' }),
  DynamicFlag({ code: 'de', strict: true }),
  DynamicFlag({ code: String(Date.now()) }),
]
export const version: string = buildMeta.version

// @ts-expect-error width takes a number or a string
export const badWidth = FlagUs({ width: {} })
// @ts-expect-error strict mode only accepts flag codes
export const badStrict = DynamicFlag({ code: 'not-a-code', strict: true })
