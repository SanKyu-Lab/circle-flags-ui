<script setup lang="ts">
import type { Component } from 'vue'
import { openBrowse } from '@example-shared/browse'

interface FlagItem {
  component: Component
  code: string
}

interface FlagGridProps {
  rows: FlagItem[][]
}

const props = defineProps<FlagGridProps>()
</script>

<template>
  <div
    class="w-full p-5 border border-gray-200 rounded-2xl bg-neutral-50 shadow-sm flex flex-col gap-3 items-center"
  >
    <div v-for="(row, rowIndex) in props.rows" :key="rowIndex" class="flex gap-2.5">
      <component
        v-for="(item, itemIndex) in row"
        :key="itemIndex"
        :is="item.component"
        :width="40"
        :height="40"
        class="block rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)] cursor-alias transition-opacity duration-200 hover:opacity-80"
        :aria-label="`Browse ${item.code}`"
        @click="openBrowse(item.code)"
      />
    </div>
  </div>
</template>
