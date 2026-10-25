import { CircleFlag, DynamicFlag, FlagUs } from '@sankyu/react-circle-flags'
import { FlagJp } from '@sankyu/react-circle-flags/flags/jp'
import { buildMeta } from '@sankyu/react-circle-flags/meta'

export const elements = [
  FlagUs({ width: 32, title: 'United States' }),
  FlagJp({ className: 'flag' }),
  DynamicFlag({ code: 'de', strict: true }),
  DynamicFlag({ code: String(Date.now()) }),
  CircleFlag({ countryCode: 'fr' }),
]
export const version: string = buildMeta.version

// @ts-expect-error width takes a number or a string
export const badWidth = FlagUs({ width: {} })
// @ts-expect-error strict mode only accepts flag codes
export const badStrict = DynamicFlag({ code: 'not-a-code', strict: true })
