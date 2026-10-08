export type FrameworkId = 'react' | 'vue' | 'solid' | 'svelte'

export interface Framework {
  id: FrameworkId
  label: string
  packageName: string
  status: 'Stable' | 'Beta'
  icon: string
  lang: 'tsx' | 'vue' | 'svelte'
  usage: (code: string, componentName: string) => string
}

export const frameworks: readonly Framework[] = [
  {
    id: 'react',
    label: 'React',
    packageName: '@sankyu/react-circle-flags',
    status: 'Stable',
    icon: 'framework-icons/react.svg',
    lang: 'tsx',
    usage: (code, name) => `import { ${name} } from '@sankyu/react-circle-flags/flags/${code}'

export function Locale() {
  return <${name} width={48} height={48} />
}`,
  },
  {
    id: 'vue',
    label: 'Vue',
    packageName: '@sankyu/vue-circle-flags',
    status: 'Beta',
    icon: 'framework-icons/vue.svg',
    lang: 'vue',
    usage: (code, name) => `<script setup lang="ts">
import { ${name} } from '@sankyu/vue-circle-flags/flags/${code}'
</script>

<template>
  <${name} :width="48" :height="48" />
</template>`,
  },
  {
    id: 'solid',
    label: 'Solid',
    packageName: '@sankyu/solid-circle-flags',
    status: 'Beta',
    icon: 'framework-icons/solid.svg',
    lang: 'tsx',
    usage: (code, name) => `import { ${name} } from '@sankyu/solid-circle-flags/flags/${code}'

export function Locale() {
  return <${name} width={48} height={48} />
}`,
  },
  {
    id: 'svelte',
    label: 'Svelte',
    packageName: '@sankyu/svelte-circle-flags',
    status: 'Beta',
    icon: 'framework-icons/svelte.svg',
    lang: 'svelte',
    usage: (code, name) => `<script lang="ts">
  import ${name} from '@sankyu/svelte-circle-flags/flags/${code}'
</script>

<${name} width={48} height={48} />`,
  },
]
