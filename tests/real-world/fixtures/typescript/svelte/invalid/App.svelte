<script lang="ts">
  import { DynamicFlag, FlagUs } from '@sankyu/svelte-circle-flags'
</script>

<!-- Both lines must fail type checking: width takes a number or a string, and strict mode
     only accepts flag codes. -->
<FlagUs width={{}} />
<DynamicFlag code="not-a-code" strict />
