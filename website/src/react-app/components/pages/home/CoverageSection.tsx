import { ArrowRight } from 'lucide-react'
import LinkButton from '../../ui/LinkButton'
import { toRouteHref } from '../../../routing/paths'
import FlagMosaic from './FlagMosaic'

interface CoverageSectionProps {
  flagCount: number
  onBrowse: () => void
}

export default function CoverageSection({ flagCount, onBrowse }: CoverageSectionProps) {
  return (
    <section aria-labelledby="coverage-title" className="border-t border-rule pt-20 sm:pt-28">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h2 id="coverage-title" className="text-title text-ink">
            <span className="tabular-nums">{flagCount}</span> flags in one circular frame.
          </h2>
          <p className="mt-4 text-body text-ink-2">
            Countries, subdivisions, organizations, and historical flags share the same shape, so
            they line up at every size.
          </p>
        </div>
        <LinkButton
          href={toRouteHref('browse')}
          variant="solid"
          className="self-start lg:self-auto"
          onClick={event => {
            event.preventDefault()
            onBrowse()
          }}
        >
          Browse all flags
          <ArrowRight className="h-4 w-4" aria-hidden />
        </LinkButton>
      </div>

      <div className="mt-12">
        <FlagMosaic />
      </div>
    </section>
  )
}
