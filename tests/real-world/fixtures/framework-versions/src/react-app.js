import { createElement } from 'react'
import { CircleFlag, DynamicFlag, FlagAc, FlagUs } from '@sankyu/react-circle-flags'

export const App = () =>
  createElement(
    'main',
    null,
    createElement(FlagUs),
    createElement(DynamicFlag, { code: 'jp' }),
    createElement(FlagAc),
    createElement(CircleFlag, { countryCode: 'fr' })
  )
