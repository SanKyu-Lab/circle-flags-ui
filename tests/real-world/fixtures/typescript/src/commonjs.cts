// A CommonJS consumer: TypeScript resolves the "require" condition and the .d.cts declarations.
// solid-js publishes ESM declarations only, so a CommonJS file cannot import its types under
// node16; the Solid root entry is checked by the ESM consumer, and only /meta is checked here.
import { FlagUs as ReactFlagUs } from '@sankyu/react-circle-flags'
import { FlagJp as ReactFlagJp } from '@sankyu/react-circle-flags/flags/jp'
import { buildMeta } from '@sankyu/solid-circle-flags/meta'
import { FlagUs as VueFlagUs } from '@sankyu/vue-circle-flags'

export const components = [ReactFlagUs, ReactFlagJp, VueFlagUs]
export const version: string = buildMeta.version

// @ts-expect-error width takes a number or a string
export const badWidth = ReactFlagUs({ width: {} })
