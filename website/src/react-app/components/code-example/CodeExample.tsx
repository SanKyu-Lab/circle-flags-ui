import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { useShikiHtml } from '../../utils/useShikiHtml'
import { withBasePath } from '../../routing/paths'

const frameworkOptions = [
  {
    id: 'react',
    label: 'React',
    icon: 'framework-icons/react.svg',
    install: 'pnpm add @sankyu/react-circle-flags',
    lang: 'tsx',
    usage: `import { FlagUs } from '@sankyu/react-circle-flags/flags/us'

export function Locale() {
  return <FlagUs width={40} height={40} title="United States" />
}`,
  },
  {
    id: 'vue',
    label: 'Vue',
    icon: 'framework-icons/vue.svg',
    install: 'pnpm add @sankyu/vue-circle-flags',
    lang: 'vue',
    usage: `<script setup lang="ts">
import { FlagUs } from '@sankyu/vue-circle-flags/flags/us'
</script>

<template>
  <FlagUs :width="40" :height="40" title="United States" />
</template>`,
  },
  {
    id: 'solid',
    label: 'Solid',
    icon: 'framework-icons/solid.svg',
    install: 'pnpm add @sankyu/solid-circle-flags',
    lang: 'tsx',
    usage: `import { FlagUs } from '@sankyu/solid-circle-flags/flags/us'

export function Locale() {
  return <FlagUs width={40} height={40} title="United States" />
}`,
  },
  {
    id: 'svelte',
    label: 'Svelte',
    icon: 'framework-icons/svelte.svg',
    install: 'pnpm add @sankyu/svelte-circle-flags',
    lang: 'svelte',
    usage: `<script lang="ts">
  import FlagUs from '@sankyu/svelte-circle-flags/flags/us'
</script>

<FlagUs width={40} height={40} title="United States" />`,
  },
] as const

type Framework = (typeof frameworkOptions)[number]['id']

export default function CodeExample() {
  const [activeFramework, setActiveFramework] = useState<Framework>('react')
  const [copied, setCopied] = useState(false)
  const current =
    frameworkOptions.find(framework => framework.id === activeFramework) ?? frameworkOptions[0]
  const usageHtml = useShikiHtml(current.usage, current.lang)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(current.install)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-(--border-strong) bg-(--code-bg) shadow-(--shadow-md)">
      <div className="flex overflow-x-auto border-b border-(--code-border) p-2">
        {frameworkOptions.map(framework => (
          <button
            key={framework.id}
            type="button"
            onClick={() => setActiveFramework(framework.id)}
            className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-(--accent) ${
              activeFramework === framework.id
                ? 'bg-(--code-surface) text-(--code-text)'
                : 'text-(--code-muted) hover:text-(--code-text)'
            }`}
          >
            <img
              src={withBasePath(framework.icon)}
              alt=""
              className="h-4 w-4 object-contain"
              loading="lazy"
              decoding="async"
            />
            {framework.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 border-b border-(--code-border) px-4 py-3 sm:px-5">
        <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap text-sm text-(--code-text)">
          {current.install}
        </code>
        <button
          type="button"
          aria-label="Copy install command"
          onClick={handleCopy}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-(--code-muted) outline-none transition-colors hover:bg-(--code-surface) hover:text-(--code-text) focus-visible:ring-2 focus-visible:ring-(--accent)"
        >
          {copied ? (
            <Check className="h-4 w-4" aria-hidden />
          ) : (
            <Copy className="h-4 w-4" aria-hidden />
          )}
        </button>
      </div>

      <div className="min-h-72 overflow-x-auto p-5 text-sm sm:p-6">
        {usageHtml ? (
          <div dangerouslySetInnerHTML={{ __html: usageHtml }} />
        ) : (
          <pre className="m-0 text-(--code-text)">
            <code>{current.usage}</code>
          </pre>
        )}
      </div>
    </div>
  )
}
