import { useEffect, useRef, useState } from 'react'
import { FLAG_REGISTRY, FlagSizes } from '@sankyu/react-circle-flags'
import type { FlagComponent } from '../../flag-browser/flagComponent'
import { withBasePath } from '../../../routing/paths'

type MosaicItem = { code: string; Component: FlagComponent }

interface FlagMosaicProps {
  onSelect: (code: string) => void
}

export default function FlagMosaic({ onSelect }: FlagMosaicProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [items, setItems] = useState<MosaicItem[] | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      entries => {
        if (!entries.some(entry => entry.isIntersecting)) return
        observer.disconnect()
        import('../../flag-browser/flagComponent')
          .then(({ flagComponentMap }) => {
            setItems(
              (Object.entries(FLAG_REGISTRY) as Array<[string, string]>).map(
                ([code, componentName]) => ({ code, Component: flagComponentMap[componentName] })
              )
            )
          })
          .catch((error: Error) => {
            console.error('Failed to load the flag registry for the mosaic', error)
          })
      },
      { rootMargin: '400px 0px' }
    )
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="min-h-[26rem] max-lg:h-[26rem] max-lg:overflow-hidden max-lg:[mask-image:linear-gradient(to_bottom,black_70%,transparent)] sm:max-lg:h-[32rem]"
    >
      {items ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(2.25rem,1fr))] justify-items-center gap-3 pb-20">
          {items.map(({ code, Component }) => (
            <a
              key={code}
              href={withBasePath(`browse?countryCode=${encodeURIComponent(code)}`)}
              tabIndex={-1}
              title={code.toUpperCase()}
              onClick={event => {
                event.preventDefault()
                onSelect(code)
              }}
              className="rounded-full p-0.5 transition-shadow hover:ring-2 hover:ring-accent"
            >
              <Component width={FlagSizes.md} height={FlagSizes.md} className="block" />
            </a>
          ))}
        </div>
      ) : null}
    </div>
  )
}
