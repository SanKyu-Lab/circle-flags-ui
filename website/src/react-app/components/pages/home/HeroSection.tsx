import { useState } from 'react'
import { ArrowRight, Check, Copy, ExternalLink } from 'lucide-react'
import { FlagBr } from '@sankyu/react-circle-flags/flags/br'
import { FlagJp } from '@sankyu/react-circle-flags/flags/jp'
import { FlagUs } from '@sankyu/react-circle-flags/flags/us'
import FlagShowcase from '../../flag-showcase/FlagShowcase'
import LinkButton from '../../ui/LinkButton'
import { toRouteHref, withBasePath } from '../../../routing/paths'

interface HeroSectionProps {
  onBrowseClick: () => void
  onFlagClick?: (code: string) => void
}

const installCommand = 'pnpm add @sankyu/react-circle-flags'

export default function HeroSection({ onBrowseClick, onFlagClick }: HeroSectionProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(installCommand)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="grid min-h-[calc(100dvh-4rem)] items-center gap-12 py-16 lg:grid-cols-12 lg:gap-16 lg:py-20">
      <div className="lg:col-span-7">
        <h1 className="max-w-3xl text-[clamp(2.75rem,5vw,4.75rem)] font-bold leading-[0.98] tracking-[-0.055em] text-(--ink)">
          Flags that fit
          <span
            className="mx-3 inline-flex translate-y-1 items-center -space-x-2 align-baseline sm:mx-4"
            aria-hidden="true"
          >
            <FlagUs className="h-10 w-10 ring-4 ring-(--bg) sm:h-14 sm:w-14" />
            <FlagJp className="h-10 w-10 ring-4 ring-(--bg) sm:h-14 sm:w-14" />
            <FlagBr className="h-10 w-10 ring-4 ring-(--bg) sm:h-14 sm:w-14" />
          </span>
          every interface.
        </h1>

        <p className="mt-7 max-w-xl text-lg leading-8 text-(--muted-light)">
          Typed SVG components for React, Vue, Solid, and Svelte, verified with Vite 8, Next.js, and
          Nuxt.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <LinkButton
            href={toRouteHref('browse')}
            variant="solid"
            onClick={event => {
              event.preventDefault()
              onBrowseClick()
            }}
          >
            Browse flags
            <ArrowRight className="h-4 w-4" aria-hidden />
          </LinkButton>
          <LinkButton href={withBasePath('docs/guides/getting-started/')} target="_blank">
            Read the docs
            <ExternalLink className="h-4 w-4" aria-hidden />
          </LinkButton>
        </div>

        <div className="mt-8 flex max-w-lg items-center gap-3 rounded-xl border border-(--border-strong) bg-(--surface) p-2 pl-4">
          <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap text-sm text-(--ink-secondary)">
            {installCommand}
          </code>
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy install command"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-(--muted-light) outline-none transition-colors hover:bg-(--surface-2) hover:text-(--ink) focus-visible:ring-2 focus-visible:ring-(--accent)"
          >
            {copied ? (
              <Check className="h-4 w-4" aria-hidden />
            ) : (
              <Copy className="h-4 w-4" aria-hidden />
            )}
          </button>
        </div>
      </div>

      <div className="lg:col-span-5">
        <FlagShowcase onFlagClick={onFlagClick} />
      </div>
    </section>
  )
}
