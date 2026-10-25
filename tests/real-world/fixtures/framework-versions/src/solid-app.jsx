import { CircleFlag, DynamicFlag, FlagAc, FlagUs } from '@sankyu/solid-circle-flags'

export const App = () => (
  <main>
    <FlagUs />
    <DynamicFlag code="jp" />
    <FlagAc />
    <CircleFlag countryCode="fr" />
  </main>
)
