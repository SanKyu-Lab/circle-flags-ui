import { useMemo, useState } from 'react'
import { Check, Copy, ExternalLink } from 'lucide-react'
import Tabs from '../animated-ui/Tabs'
import LinkButton from '../ui/LinkButton'
import { useShikiHtml } from '../../utils/useShikiHtml'
import { withBasePath } from '../../routing/paths'

interface CodeToken {
  type?: 'keyword' | 'string' | 'comment'
  value: string
}

const usageLines: CodeToken[][] = [
  [
    { type: 'keyword', value: 'import' },
    { value: ' { FlagUs, FlagCn } ' },
    { type: 'keyword', value: 'from' },
    { value: ' ' },
    { type: 'string', value: "'@sankyu/react-circle-flags'" },
  ],
  [],
  [{ type: 'keyword', value: 'function' }, { value: ' Header() {' }],
  [{ value: '  return (' }],
  [{ value: '    <div className="flex items-center gap-3">' }],
  [{ value: '      <FlagUs width={40} height={40} />' }],
  [{ value: '      <FlagCn width={40} height={40} />' }],
  [{ value: '    </div>' }],
  [{ value: '  )' }],
  [{ value: '}' }],
]

const renderLine = (line: CodeToken[], index: number) => (
  <div key={index} className="whitespace-pre leading-6">
    {line.length === 0 ? <>&nbsp;</> : null}
    {line.map((token, tokenIndex) => (
      <span
        key={tokenIndex}
        className={
          token.type === 'keyword'
            ? 'token keyword'
            : token.type === 'string'
              ? 'token string'
              : token.type === 'comment'
                ? 'token comment'
                : undefined
        }
      >
        {token.value}
      </span>
    ))}
  </div>
)

const frameworkOptions = [
  { id: 'react', label: 'React' },
  { id: 'vue', label: 'Vue 3' },
]

const installCommands = {
  react: [
    { id: 'pnpm', label: 'pnpm', command: 'pnpm add @sankyu/react-circle-flags' },
    { id: 'npm', label: 'npm', command: 'npm install @sankyu/react-circle-flags' },
    { id: 'yarn', label: 'yarn', command: 'yarn add @sankyu/react-circle-flags' },
    { id: 'bun', label: 'bun', command: 'bun add @sankyu/react-circle-flags' },
  ],
  vue: [
    { id: 'pnpm', label: 'pnpm', command: 'pnpm add @sankyu/vue-circle-flags' },
    { id: 'npm', label: 'npm', command: 'npm install @sankyu/vue-circle-flags' },
    { id: 'yarn', label: 'yarn', command: 'yarn add @sankyu/vue-circle-flags' },
    { id: 'bun', label: 'bun', command: 'bun add @sankyu/vue-circle-flags' },
  ],
}

const usageCodeByFramework = {
  react: `import { FlagUs, FlagCn } from '@sankyu/react-circle-flags'

function Header() {
  return (
    <div className="flex items-center gap-3">
      <FlagUs width={40} height={40} />
      <FlagCn width={40} height={40} />
    </div>
  )
}`,
  vue: `<script setup lang="ts">
import { FlagUs, FlagCn } from '@sankyu/vue-circle-flags'
</script>

<template>
  <div class="flex items-center gap-3">
    <FlagUs :width="40" :height="40" />
    <FlagCn :width="40" :height="40" />
  </div>
</template>`,
}

export default function CodeExample() {
  const [activeFramework, setActiveFramework] = useState<'react' | 'vue'>('react')
  const [activeManager, setActiveManager] = useState('pnpm')
  const [copied, setCopied] = useState(false)

  const currentInstallCommands = installCommands[activeFramework]
  const usageCode = usageCodeByFramework[activeFramework]
  const usageHtml = useShikiHtml(usageCode, activeFramework === 'vue' ? 'vue' : 'tsx')

  const activeCommand =
    currentInstallCommands.find(entry => entry.id === activeManager) ?? currentInstallCommands[0]
  const commandText = activeCommand?.command ?? ''
  const commandHtml = useShikiHtml(commandText ? `$ ${commandText}` : '', 'bash')

  const handleCopy = async () => {
    if (!commandText) return
    try {
      await navigator.clipboard.writeText(commandText)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Framework Selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase tracking-[0.2em] text-(--muted)">Framework</span>
        <div className="flex rounded-lg border border-(--border-weak) bg-(--overlay-soft) p-1">
          {frameworkOptions.map(option => (
            <button
              key={option.id}
              onClick={() => setActiveFramework(option.id as 'react' | 'vue')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeFramework === option.id
                  ? 'bg-(--accent) text-white'
                  : 'text-(--muted) hover:text-(--ink)'
              }`}
            >
              {option.label}
              {option.id === 'vue' && (
                <span className="ml-1.5 text-[10px] opacity-75">Beta</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="code-block p-4 space-y-3 rounded-2xl border border-(--border-strong) bg-[#192732]">
        <Tabs items={currentInstallCommands} activeId={activeManager} onChange={setActiveManager} />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.2em] text-(--muted)">Install</p>
          <LinkButton
            href={withBasePath('docs/guides/getting-started/installation/')}
            target="_blank"
            variant="ghost"
            className="p-0"
          >
            Installation Guide
            <ExternalLink className="h-4 w-4" aria-hidden />
          </LinkButton>
        </div>
        {commandText ? (
          <div className="relative rounded-xl border border-(--border-weak) bg-(--overlay-soft) px-4 py-3">
            {commandHtml ? (
              <div
                className="overflow-x-auto text-sm"
                dangerouslySetInnerHTML={{ __html: commandHtml }}
              />
            ) : (
              <pre className="overflow-x-auto text-sm text-(--ink)/90">
                <code className="whitespace-pre text-left">$ {commandText}</code>
              </pre>
            )}
            <button
              type="button"
              aria-label="Copy install command"
              onClick={handleCopy}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-(--border) bg-(--overlay-soft) p-2 text-(--ink) shadow-(--shadow-sm) hover:bg-(--overlay-mid) transition-all"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span className="sr-only">{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        ) : null}
      </div>
      <div className="code-block p-4 bg-[#192732]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.2em] text-(--muted)">Usage</p>
          <LinkButton
            href={withBasePath('docs/guides/getting-started/usage/')}
            target="_blank"
            variant="ghost"
            className="p-0"
          >
            Usage Guide
            <ExternalLink className="h-4 w-4" aria-hidden />
          </LinkButton>
        </div>
        {usageHtml ? (
          <div className="mt-3 overflow-hidden" dangerouslySetInnerHTML={{ __html: usageHtml }} />
        ) : (
          <pre className="mt-3 overflow-x-auto text-sm text-(--ink)/90">
            <code>{usageLines.map(renderLine)}</code>
          </pre>
        )}
      </div>
    </div>
  )
}
