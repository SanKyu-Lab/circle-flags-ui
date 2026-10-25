import { h } from 'vue'
import { CircleFlag, DynamicFlag, FlagAc, FlagUs } from '@sankyu/vue-circle-flags'

export const App = {
  render: () =>
    h('main', [
      h(FlagUs),
      h(DynamicFlag, { code: 'jp' }),
      h(FlagAc),
      h(CircleFlag, { countryCode: 'fr' }),
    ]),
}
