import { useMemo, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import FlagShowcase from '../../flag-showcase/FlagShowcase'
import SpotlightCard from '../../animated-ui/SpotlightCard'
import Tabs from '../../animated-ui/Tabs'

interface HeroSectionProps {
  flagCount: number
  onBrowseClick: () => void
}

export default function HeroSection({ flagCount, onBrowseClick }: HeroSectionProps) {
  const installCommands = useMemo(
    () => [
      { id: 'pnpm', label: 'pnpm', command: 'pnpm add @sankyu/react-circle-flags' },
      { id: 'npm', label: 'npm', command: 'npm install @sankyu/react-circle-flags' },
      { id: 'yarn', label: 'yarn', command: 'yarn add @sankyu/react-circle-flags' },
      { id: 'bun', label: 'bun', command: 'bun add @sankyu/react-circle-flags' },
      {
        id: 'github',
        label: 'GitHub',
        href: 'https://github.com/SanKyu-Lab/react-circle-flags',
        external: true,
      },
    ],
    []
  )

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

  return (
    <section className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr] items-start mb-16">
      <div className="space-y-8 animate-slide-in">
        <div className="inline-flex items-center gap-2 rounded-full border border-(--border-accent) bg-(--accent) px-3 py-1.5 shadow-(--shadow-sm)">
          <span className="font-mono text-sm text-(--accent-contrast) font-semibold">
            @sankyu/react-circle-flags
          </span>
          <span className="rounded-full bg-(--accent-contrast)/20 px-2 py-0.5 text-xs text-(--accent-contrast) font-semibold">
            {flagCount}+ icons
          </span>
        </div>

        <div className="space-y-5">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]">
            <span className="gradient-text block">Circular flags</span>
            <span className="text-(--ink) block">built for React.</span>
          </h1>
          <p className="text-lg sm:text-xl text-(--muted) max-w-2xl leading-relaxed">
            Self-contained flags. Zero external requests. Zero layout shifts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <a
            href="#quick-start"
            className="btn-glow rounded-full px-8 py-4 text-base font-bold text-(--accent-contrast) shadow-lg"
          >
            Quick Start
          </a>
          <button
            onClick={onBrowseClick}
            className="cursor-alias rounded-full border-2 border-(--border-accent) px-8 py-4 text-base font-bold text-(--ink) hover:bg-(--overlay-soft) transition-all"
          >
            Browse all flags
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
          {[
            { icon: '⚛️', label: 'React-ready' },
            { icon: '💎', label: 'TypeScript' },
            { icon: '🪶', label: 'ESM + CJS' },
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
          <FlagShowcase />
        </div>
      </SpotlightCard>
    </section>
  )
}
