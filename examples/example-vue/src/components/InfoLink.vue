<script setup lang="ts">
interface InfoLinkProps {
  href: string
  className?: string
}

defineProps<InfoLinkProps>()
</script>

<template>
  <a
    :href="href"
    target="_blank"
    rel="noreferrer"
    :class="[
      'text-indigo-500 no-underline font-medium hover:text-indigo-600 hover:underline',
      className,
    ]"
  >
    <slot />
  </a>
</template>
