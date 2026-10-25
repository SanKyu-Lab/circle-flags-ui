<script lang="ts">
  import { DynamicFlag, FlagUs } from '@sankyu/svelte-circle-flags'
  import FlagJp from '@sankyu/svelte-circle-flags/flags/jp'
</script>

<FlagUs width={32} title="United States" />
<FlagJp class="flag" />
<DynamicFlag code="de" strict />
<DynamicFlag code={String(Date.now())} />
