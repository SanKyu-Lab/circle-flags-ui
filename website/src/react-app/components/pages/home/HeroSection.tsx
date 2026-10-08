import { ArrowRight, ArrowUpRight } from 'lucide-react'
import LinkButton from '../../ui/LinkButton'
import { toRouteHref, withBasePath } from '../../../routing/paths'
import SpecimenPanel from './SpecimenPanel'

interface HeroSectionProps {
  flagCount: number
  onBrowse: () => void
}

export default function HeroSection({ flagCount, onBrowse }: HeroSectionProps) {
  return (
    <section className="grid items-center gap-12 py-14 lg:min-h-[calc(100dvh-4rem)] lg:grid-cols-12 lg:gap-8 lg:py-16">
      <div className="lg:col-span-5 lg:pr-6">
        <h1 tabIndex={-1} className="max-w-xl text-display text-ink outline-none">
          Circular flags as typed components.
        </h1>

        <p className="mt-6 max-w-lg text-lede text-ink-2">
          <span className="tabular-nums">{flagCount}</span> SVG flags for React, Vue, Solid, and
          Svelte. Import one flag per file, render it on the server, and style it like any other SVG
          element.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <LinkButton
            href={toRouteHref('browse')}
            variant="solid"
            onClick={event => {
              event.preventDefault()
              onBrowse()
            }}
          >
            Browse flags
            <ArrowRight className="h-4 w-4" aria-hidden />
          </LinkButton>
          <LinkButton href={withBasePath('docs/guides/getting-started/')}>
            Read the docs
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </LinkButton>
        </div>

        <dl className="mt-12 grid max-w-md grid-cols-3 border-t border-rule pt-5">
          {[
            { term: 'Flags', value: String(flagCount) },
            { term: 'Frameworks', value: '4' },
            { term: 'License', value: 'MIT' },
          ].map(item => (
            <div key={item.term}>
              <dt className="text-label font-mono uppercase text-ink-3">{item.term}</dt>
              <dd className="mt-1 text-heading text-ink tabular-nums">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="min-w-0 lg:col-span-7">
        <SpecimenPanel />
      </div>
    </section>
  )
}
