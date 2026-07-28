import type {
  FlagCode,
  FlagComponentProps as CoreFlagComponentProps,
} from '@sankyu/circle-flags-core'
import type { SVGAttributes } from 'svelte/elements'

export interface FlagComponentProps
  extends Omit<SVGAttributes<SVGSVGElement>, 'width' | 'height' | 'title'>, CoreFlagComponentProps {
  width?: number | string
  height?: number | string
  className?: string
  title?: string
}

/**
 * @deprecated `CircleFlag` is deprecated and not recommended for new code.
 *
 * Prefer named imports or `DynamicFlag` instead.
 */
export interface CircleFlagProps extends CoreFlagComponentProps {
  countryCode?: string
  /** @deprecated Use `countryCode` instead. */
  code?: string
  cdnUrl?: string
  class?: string
  className?: string
  [key: string]: unknown
}

type DynamicFlagPropsBase = FlagComponentProps & {
  title?: string
}

export type DynamicFlagProps =
  | (DynamicFlagPropsBase & { strict?: false; code: string })
  | (DynamicFlagPropsBase & { strict: true; code: FlagCode })
