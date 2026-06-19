<script lang="ts">
  import type { Component } from 'svelte'
  import { openBrowse } from '../libs/shared/browse'

  interface FlagItem {
    component: Component
    code: string
  }

  interface Props {
    rows: FlagItem[][]
  }

  let { rows }: Props = $props()
</script>

<div
  class="flex w-full flex-col items-center gap-3 rounded-2xl border border-gray-200 bg-neutral-50 p-5 shadow-sm"
>
  {#each rows as row}
    <div class="flex gap-2.5">
      {#each row as item}
        <button
          type="button"
          class="block cursor-alias rounded-full transition-opacity duration-200 hover:opacity-80"
          aria-label={`Browse ${item.code}`}
          onclick={() => openBrowse(item.code)}
        >
          <item.component
            width={40}
            height={40}
            class="block rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]"
          />
        </button>
      {/each}
    </div>
  {/each}
</div>
