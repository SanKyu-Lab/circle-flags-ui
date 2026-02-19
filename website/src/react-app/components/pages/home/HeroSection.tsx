import { useState } from 'react'
import { Check, Copy, ExternalLink, Package, ShieldCheck, Zap } from 'lucide-react'
import { buildMeta } from '@sankyu/react-circle-flags'
import FlagShowcase from '../../flag-showcase/FlagShowcase'
import SpotlightCard from '../../animated-ui/SpotlightCard'
import Tabs from '../../animated-ui/Tabs'
import LinkButton from '../../ui/LinkButton'
import { toRouteHref, withBasePath } from '../../../routing/paths'

type Framework = 'react' | 'vue' | 'solid'

interface FrameworkOption {
  id: Framework
  label: string
  badge?: string
  icon: string
  packageName: string
  status: string
}

const frameworkOptions: FrameworkOption[] = [
  {
    id: 'react',
    label: 'React',
    icon: 'framework-icons/react.svg',
    packageName: '@sankyu/react-circle-flags',
    status: 'Stable',
  },
  {
    id: 'vue',
    label: 'Vue 3',
    badge: 'Beta',
    icon: 'framework-icons/vue.svg',
    packageName: '@sankyu/vue-circle-flags',
    status: 'Beta',
  },
  {
    id: 'solid',
    label: 'Solid',
    badge: 'Beta',
    icon: 'framework-icons/solid.svg',
    packageName: '@sankyu/solid-circle-flags',
    status: 'Beta',
  },
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

const stackFeatures = [
  {
    icon: Package,
    label: 'Tree-Shakeable',
    detail: 'Named imports keep bundles lean.',
  },
  {
    icon: ShieldCheck,
    label: 'SSR Friendly',
    detail: 'No external request in normal usage.',
  },
  {
    icon: Zap,
    label: 'Fast Setup',
    detail: 'One install command, ready in minutes.',
  },
] as const

export default function HeroSection({ flagCount, onBrowseClick, onFlagClick }: HeroSectionProps) {
  const [activeFramework, setActiveFramework] = useState<Framework>('react')
  const installCommands = installCommandsByFramework[activeFramework]
  const activeFrameworkMeta =
    frameworkOptions.find(option => option.id === activeFramework) ?? frameworkOptions[0]

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

  const handleFrameworkChange = (framework: Framework) => {
    setActiveFramework(framework)
    const firstCommand = installCommandsByFramework[framework][0]
    setManager(firstCommand?.id ?? 'pnpm')
  }

  return (
    <section className="relative mb-20 grid items-start gap-8 lg:grid-cols-[1.12fr_0.88fr]">
      <div className="relative space-y-8 animate-slide-in">
        <div className="hero-halo" aria-hidden />

        <div className="inline-flex items-center gap-2 rounded-full border border-(--border-accent) bg-(--overlay-soft) px-3 py-1.5 shadow-(--shadow-sm)">
          <span className="font-mono text-sm text-(--ink) font-semibold">
            @sankyu/react-circle-flags@{`v${buildMeta.version}`}
          </span>
          <span className="rounded-full border border-(--border-weak) bg-(--surface) px-2 py-0.5 text-xs text-(--ink-secondary) font-semibold">
            {flagCount}+ icons
          </span>
        </div>

        <div className="space-y-5">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.03]">
            <span className="gradient-text block">Global Flag UI.</span>
            <span className="text-(--ink) block">Ship once for React, Vue, and Solid.</span>
          </h1>
          <p className="text-base sm:text-lg text-(--muted-light) max-w-2xl leading-relaxed">
            400+ circular SVG flags with TypeScript types, SSR compatibility, and predictable render
            behavior.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {stackFeatures.map(item => (
            <div
              key={item.label}
              className="rounded-2xl border border-(--border-weak) bg-(--surface-glass) px-4 py-3 backdrop-blur-lg"
            >
              <item.icon className="mb-2 h-4 w-4 text-(--accent)" aria-hidden />
              <p className="text-sm font-semibold text-(--ink)">{item.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-(--muted)">{item.detail}</p>
            </div>
          ))}
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

        <div className="rounded-3xl border border-(--border-strong) bg-(--surface-2)/75 p-4 shadow-(--shadow-md) backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs uppercase tracking-[0.24em] text-(--muted)">Framework Selector</p>
            <span className="text-xs rounded-full border border-(--border-weak) bg-(--overlay-soft) px-2.5 py-1 text-(--ink-secondary)">
              {activeFrameworkMeta.status}
            </span>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {frameworkOptions.map(option => {
              const isActive = option.id === activeFramework
              return (
                <button
                  key={option.id}
                  onClick={() => handleFrameworkChange(option.id)}
                  className={`framework-option ${
                    isActive
                      ? 'border-(--accent) bg-(--overlay-mid) shadow-[0_0_0_1px_var(--accent)]'
                      : 'border-(--border-weak) bg-(--overlay-soft)'
                  }`}
                >
                  <div className="framework-logo-wrap">
                    <img
                      src={withBasePath(option.icon)}
                      alt={`${option.label} logo`}
                      className="framework-logo"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <span className="text-sm font-semibold text-(--ink)">{option.label}</span>
                  <span className="text-xs text-(--muted)">{option.packageName}</span>
                  {option.badge ? (
                    <span className="mt-1 rounded-full border border-(--border-weak) px-2 py-0.5 text-[10px] text-(--muted)">
                      {option.badge}
                    </span>
                  ) : (
                    <span className="mt-1 rounded-full border border-(--border-weak) px-2 py-0.5 text-[10px] text-(--muted)">
                      Stable
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <div className="mt-4 rounded-2xl border border-(--border-weak) bg-(--overlay-soft) p-3.5">
            <Tabs
              items={installCommands.map(entry => ({
                id: entry.id,
                label: entry.label,
              }))}
              activeId={manager}
              onChange={setManager}
            />
            {commandText ? (
              <div className="relative mt-3 rounded-xl border border-(--border) bg-(--surface) px-4 py-3">
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
      </div>

      <SpotlightCard
        className="rounded-3xl border border-(--border-strong) p-8 shadow-(--shadow-lg) animate-rise delay-200 !bg-(--surface)"
        spotlightColor="oklch(0.65 0.16 250 / 0.22)"
      >
        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 rounded-full border border-(--border-weak) bg-(--overlay-soft) px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-(--accent) animate-pulse" />
              <span className="text-xs font-semibold text-(--ink-secondary)">
                Interactive Preview
              </span>
            </div>
            <p className="text-xs text-(--muted)">Click a flag to jump into browser mode</p>
          </div>
          <FlagShowcase onFlagClick={onFlagClick} />
        </div>
      </SpotlightCard>
    </section>
  )
}
