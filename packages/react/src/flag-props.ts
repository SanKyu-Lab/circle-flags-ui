import type { SVGProps } from 'react'
import type { FlagComponentProps as CoreFlagComponentProps } from '@sankyu/circle-flags-core'

export interface FlagComponentProps extends SVGProps<SVGSVGElement>, CoreFlagComponentProps {}
