import type { ReactElement } from 'react'
import { coerceFlagCode, FLAG_REGISTRY, type FlagCode } from '@sankyu/circle-flags-core'

import * as AllFlags from '../generated/flags'

import type { FlagComponentProps } from './flag-props'

export type CountryCode = FlagCode

type DynamicFlagPropsBase = FlagComponentProps & {
  // Explicitly include title to avoid type resolution differences across toolchains (e.g. Astro/TS).
  title?: string
}

export type DynamicFlagProps =
  | (DynamicFlagPropsBase & { strict?: false; code: string })
  | (DynamicFlagPropsBase & { strict: true; code: CountryCode })

export const DynamicFlag = ({
  code,
  strict: _strict,
  width = 48,
  height = 48,
  title,
  ...props
}: DynamicFlagProps): ReactElement => {
  void _strict
  const normalizedInput = code.trim().toLowerCase()
  const resolvedCode = coerceFlagCode(code, 'xx')
  const componentName = FLAG_REGISTRY[resolvedCode]
  const isFallback = resolvedCode === 'xx' && normalizedInput !== 'xx'

  const fallbackTitle = (() => {
    if (!isFallback) return title
    const upperCode = code.trim().toUpperCase()
    return title ?? (upperCode.length > 0 ? upperCode : 'XX')
  })()

  const FlagComponent = AllFlags[componentName as keyof typeof AllFlags] as unknown as (
    props: FlagComponentProps
  ) => ReactElement

  if (!FlagComponent || typeof FlagComponent !== 'function') {
    console.error(`Flag component not found for code: ${code}`)
    return <div>Flag not found: {code}</div>
  }

  return <FlagComponent width={width} height={height} title={fallbackTitle} {...props} />
}
