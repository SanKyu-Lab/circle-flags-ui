import { useEffect, useRef, useState } from 'react'
import { FLAG_REGISTRY, FlagSizes } from '@sankyu/react-circle-flags'
import type { FlagComponent } from '../../flag-browser/flagComponent'

type MosaicItem = { code: string; Component: FlagComponent }

export default function FlagMosaic() {
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
      className="h-[26rem] overflow-hidden [mask-image:linear-gradient(to_bottom,black_70%,transparent)] sm:h-[32rem]"
    >
      {items ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(2rem,1fr))] justify-items-center gap-3">
          {items.map(({ code, Component }) => (
            <Component key={code} width={FlagSizes.md} height={FlagSizes.md} />
          ))}
        </div>
      ) : null}
    </div>
  )
}
