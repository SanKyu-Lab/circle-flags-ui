<script>
  import { CircleFlag, DynamicFlag, FlagUs } from '@sankyu/svelte-circle-flags'
  import FlagAc from '@sankyu/svelte-circle-flags/flags/ac'
</script>

<main>
  <FlagUs />
  <DynamicFlag code="jp" />
  <FlagAc />
  <CircleFlag countryCode="fr" />
</main>
