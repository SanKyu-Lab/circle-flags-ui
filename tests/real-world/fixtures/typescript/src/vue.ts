import { h } from 'vue'
import { DynamicFlag, FlagUs } from '@sankyu/vue-circle-flags'
import { FlagJp } from '@sankyu/vue-circle-flags/flags/jp'
import { buildMeta } from '@sankyu/vue-circle-flags/meta'

export const nodes = [
  h(FlagUs, { width: 32, title: 'United States' }),
  h(FlagJp, { class: 'flag' }),
  h(DynamicFlag, { code: 'de', strict: true }),
  h(DynamicFlag, { code: String(Date.now()) }),
]
export const version: string = buildMeta.version

// @ts-expect-error width takes a number or a string
export const badWidth = h(FlagUs, { width: {} })
// @ts-expect-error strict mode only accepts flag codes
export const badStrict = h(DynamicFlag, { code: 'not-a-code', strict: true })
