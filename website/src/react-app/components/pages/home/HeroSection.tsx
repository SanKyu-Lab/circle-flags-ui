import { useState } from 'react'
import { Check, Copy, ExternalLink } from 'lucide-react'
import FlagShowcase from '../../flag-showcase/FlagShowcase'
import SpotlightCard from '../../animated-ui/SpotlightCard'
import Tabs from '../../animated-ui/Tabs'
import LinkButton from '../../ui/LinkButton'
import { toRouteHref, withBasePath } from '../../../routing/paths'
import { buildMeta } from '@sankyu/react-circle-flags'

type Framework = 'react' | 'vue' | 'solid'

const frameworkOptions: { id: Framework; label: string; badge?: string }[] = [
  { id: 'react', label: 'React' },
  { id: 'vue', label: 'Vue 3', badge: 'Beta' },
  { id: 'solid', label: 'Solid', badge: 'Beta' },
]

const installCommandsByFramework = {
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
  solid: [
    { id: 'pnpm', label: 'pnpm', command: 'pnpm add @sankyu/solid-circle-flags' },
    { id: 'npm', label: 'npm', command: 'npm install @sankyu/solid-circle-flags' },
    { id: 'yarn', label: 'yarn', command: 'yarn add @sankyu/solid-circle-flags' },
    { id: 'bun', label: 'bun', command: 'bun add @sankyu/solid-circle-flags' },
  ],
}

interface HeroSectionProps {
  flagCount: number
  onBrowseClick: () => void
  onFlagClick?: (code: string) => void
}

export default function HeroSection({ flagCount, onBrowseClick, onFlagClick }: HeroSectionProps) {
  const [activeFramework, setActiveFramework] = useState<Framework>('react')
  const installCommands = installCommandsByFramework[activeFramework]

  const [manager, setManager] = useState(installCommands[0]?.id ?? 'pnpm')
  const [copied, setCopied] = useState(false)
  const activeCommand = installCommands.find(entry => entry.id === manager) ?? installCommands[0]
  const commandText = activeCommand?.command ?? ''

  const handleCopy = async () => {
    if (!commandText) return
    try {
      await navigator.clipboard.writeText(commandText)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      setCopied(false)
    }
  }

  const handleFlagClick = (code: string) => {
    onFlagClick?.(code)
  }

  return (
    <section className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr] items-start mb-16">
      <div className="space-y-8 animate-slide-in">
        <div className="inline-flex items-center gap-2 rounded-full border border-(--border-accent) bg-(--accent) px-3 py-1.5 shadow-(--shadow-sm)">
          <span className="font-mono text-sm text-(--accent-contrast) font-semibold">
            @sankyu/react-circle-flags@{`v${buildMeta.version}`}
          </span>
          <span className="rounded-full bg-(--accent-contrast)/20 px-2 py-0.5 text-xs text-(--accent-contrast) font-semibold">
            {flagCount}+ icons
          </span>
        </div>

        <div className="space-y-5">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]">
            <span className="gradient-text block">Circular flags</span>
            <span className="text-(--ink) block">for React, Vue & Solid.</span>
          </h1>
          <p className="text-lg sm:text-xl text-(--muted) max-w-2xl leading-relaxed">
            Self-contained flags. Zero external requests. Zero layout shifts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <LinkButton href="#quick-start" variant="solid" className="cursor-pointer">
            Quick Start
          </LinkButton>
          <LinkButton
            href={toRouteHref('browse')}
            target="_blank"
            variant="ghost"
            onClick={event => {
              event.preventDefault()
              onBrowseClick()
            }}
          >
            Browse All Flags
            <ExternalLink className="h-4 w-4" aria-hidden />
          </LinkButton>
          <LinkButton
            href={withBasePath('docs/guides/getting-started/')}
            target="_blank"
            variant="ghost"
          >
            Read the Docs
            <ExternalLink className="h-4 w-4" aria-hidden />
          </LinkButton>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
          {[
            { icon: '⚛️', label: 'React' },
            { icon: '💚', label: 'Vue 3' },
            { icon: '🟦', label: 'Solid' },
            { icon: '💎', label: 'TypeScript' },
            { icon: '🎨', label: 'Accessible SVGs' },
          ].map(item => (
            <div
              key={item.label}
              className="flex items-center gap-2 rounded-full bg-(--surface) border border-(--border) px-4 py-2 shadow-(--shadow-sm)"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        <div className="space-y-3 rounded-2xl border border-(--border-strong) bg-(--surface-2) p-4 shadow-(--shadow-md)">
          {/* Framework Selector */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase tracking-wider text-(--muted)">Framework</span>
            <div className="flex rounded-lg border border-(--border-weak) bg-(--overlay-soft) p-1">
              {frameworkOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => setActiveFramework(option.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    activeFramework === option.id
                      ? 'bg-(--accent) text-white'
                      : 'text-(--muted) hover:text-(--ink)'
                  }`}
                >
                  {option.label}
                  {option.badge && (
                    <span className="ml-1.5 text-[10px] opacity-75">{option.badge}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
          <Tabs
            items={installCommands.map(entry => ({
              id: entry.id,
              label: entry.label,
            }))}
            activeId={manager}
            onChange={setManager}
          />
          {commandText ? (
            <div className="relative rounded-xl border border-(--border-weak) bg-(--overlay-soft) px-4 py-3">
              <pre className="overflow-x-auto text-sm text-(--ink)/90">
                <code className="whitespace-pre text-left">$ {commandText}</code>
              </pre>
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
      </div>

      <SpotlightCard
        className="rounded-3xl border border-(--border-strong) p-8 shadow-(--shadow-lg) animate-rise delay-200 !bg-(--surface)"
        spotlightColor="oklch(0.65 0.16 250 / 0.22)"
      >
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-(--overlay-soft) px-3 py-1">
              <span className="w-2 h-2 rounded-full bg-(--accent) animate-pulse" />
              <span className="text-xs font-semibold text-(--muted)">Live preview</span>
            </div>
          </div>
          <FlagShowcase onFlagClick={handleFlagClick} />
        </div>
      </SpotlightCard>
    </section>
  )
}
