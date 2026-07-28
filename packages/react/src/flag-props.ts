import type { SVGProps } from 'react'
import type { FlagComponentProps as CoreFlagComponentProps } from '@sankyu/circle-flags-core'

/** Standard SVG properties accepted by generated React flag components. */
export interface FlagComponentProps extends SVGProps<SVGSVGElement>, CoreFlagComponentProps {}
