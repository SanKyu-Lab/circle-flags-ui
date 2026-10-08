import { useId, useRef, useState } from 'react'
import type { ComponentType, KeyboardEvent } from 'react'
import { DynamicDemo, ImportDemo, RenderDemo, StyleDemo } from './SpecDemos'

interface Feature {
  id: string
  label: string
  title: string
  body: string
  Demo: ComponentType
}

const features: readonly Feature[] = [
  {
    id: 'render',
    label: 'Rendering',
    title: 'An inline <svg>, rendered on the server.',
    body: 'Each flag is a component that outputs one <svg> element in place. Named flags render during SSR in Next.js and Nuxt and make no network request.',
    Demo: RenderDemo,
  },
  {
    id: 'imports',
    label: 'Imports',
    title: 'One subpath per flag.',
    body: 'Import from flags/<code> and the bundle contains only the flags you name.',
    Demo: ImportDemo,
  },
  {
    id: 'props',
    label: 'Props',
    title: 'Standard SVG attributes.',
    body: 'width, height, className, style, title, and ARIA attributes pass through to the element.',
    Demo: StyleDemo,
  },
  {
    id: 'runtime',
    label: 'Runtime',
    title: 'Typed codes for dynamic input.',
    body: 'DynamicFlag renders a flag from a string. isFlagCode narrows input to FlagCode, and unknown codes render a placeholder.',
    Demo: DynamicDemo,
  },
]

export default function SpecSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const baseId = useId()
  const active = features[activeIndex]

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key]
    if (!step) return
    event.preventDefault()
    const next = (activeIndex + step + features.length) % features.length
    setActiveIndex(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <section aria-labelledby="spec-title" className="border-t border-rule py-20 sm:py-28">
      <div className="grid gap-4 lg:grid-cols-12 lg:gap-8">
        <h2 id="spec-title" className="text-title text-ink lg:col-span-5">
          What every package ships.
        </h2>
        <p className="max-w-xl text-body text-ink-2 lg:col-span-6 lg:col-start-7 lg:self-end">
          The four packages generate from the same SVG source and expose the same component names.
          Each example below runs on this page.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-12">
        <div
          role="tablist"
          aria-orientation="vertical"
          aria-label="Package features"
          onKeyDown={handleKeyDown}
          className="border-t border-rule lg:col-span-5"
        >
          {features.map((feature, index) => {
            const isActive = index === activeIndex
            return (
              <button
                key={feature.id}
                ref={element => {
                  tabRefs.current[index] = element
                }}
                id={`${baseId}-tab-${feature.id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`${baseId}-panel`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveIndex(index)}
                className={`group grid w-full grid-cols-[2.5rem_minmax(0,1fr)] border-b border-l-2 border-b-rule py-5 pr-4 pl-4 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset ${
                  isActive ? 'border-l-accent bg-card' : 'border-l-transparent hover:bg-sunken'
                }`}
              >
                <span
                  className={`pt-1 font-mono text-label tabular-nums ${isActive ? 'text-accent' : 'text-ink-3'}`}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>
                  <span className="text-label font-mono uppercase text-ink-3">{feature.label}</span>
                  <span
                    className={`mt-1 block text-heading ${isActive ? 'text-ink' : 'text-ink-2 group-hover:text-ink'}`}
                  >
                    {feature.title}
                  </span>
                  {isActive ? (
                    <span className="mt-2 block text-body text-ink-2">{feature.body}</span>
                  ) : null}
                </span>
              </button>
            )
          })}
        </div>

        <div
          id={`${baseId}-panel`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${active.id}`}
          className="min-w-0 lg:sticky lg:top-24 lg:col-span-7 lg:self-start"
        >
          <active.Demo key={active.id} />
        </div>
      </div>
    </section>
  )
}
