<script setup lang="ts">
import { DynamicFlag, FlagJp, FlagUs } from '@sankyu/vue-circle-flags'

const switchedCode = ref('jp')

const flags = [
  { label: 'Named import: Japan', component: FlagJp, code: undefined },
  { label: 'Named import: United States', component: FlagUs, code: undefined },
  { label: 'Runtime code: Germany', component: DynamicFlag, code: 'de' },
]
</script>

<template>
  <main data-ssr-example="nuxt">
    <p class="eyebrow">Nuxt 4 · Server-side rendering</p>
    <h1>Flags rendered in the first HTML response</h1>
    <p class="intro">
      Named imports and DynamicFlag render during SSR. They do not need a ClientOnly wrapper.
    </p>
    <div class="flag-grid">
      <figure v-for="flag in flags" :key="flag.label">
        <component
          :is="flag.component"
          v-bind="flag.code ? { code: flag.code } : {}"
          :width="72"
          :height="72"
          :title="flag.label"
        />
        <figcaption>{{ flag.label }}</figcaption>
      </figure>
    </div>
    <div class="picker">
      <DynamicFlag :code="switchedCode" :width="48" :height="48" data-testid="switched-flag" />
      <button
        type="button"
        data-testid="flag-switch"
        @click="switchedCode = switchedCode === 'jp' ? 'br' : 'jp'"
      >
        Switch flag after hydration
      </button>
    </div>
  </main>
</template>
