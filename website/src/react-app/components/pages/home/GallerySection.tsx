import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { ArrowUpRight, Boxes, Braces, Server, SwatchBook } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FlagBr } from '@sankyu/react-circle-flags/flags/br'
import { FlagCa } from '@sankyu/react-circle-flags/flags/ca'
import { FlagCh } from '@sankyu/react-circle-flags/flags/ch'
import { FlagCn } from '@sankyu/react-circle-flags/flags/cn'
import { FlagDe } from '@sankyu/react-circle-flags/flags/de'
import { FlagFr } from '@sankyu/react-circle-flags/flags/fr'
import { FlagGb } from '@sankyu/react-circle-flags/flags/gb'
import { FlagIn } from '@sankyu/react-circle-flags/flags/in'
import { FlagJp } from '@sankyu/react-circle-flags/flags/jp'
import { FlagKr } from '@sankyu/react-circle-flags/flags/kr'
import { FlagUs } from '@sankyu/react-circle-flags/flags/us'
import { withBasePath } from '../../../routing/paths'

gsap.registerPlugin(useGSAP, ScrollTrigger)

interface GallerySectionProps {
  flagCount: number
  onFilterNavigate?: (code: string) => void
}

const frameworks = [
  { name: 'React', icon: 'framework-icons/react.svg', status: 'Stable' },
  { name: 'Vue', icon: 'framework-icons/vue.svg', status: 'Beta' },
  { name: 'Solid', icon: 'framework-icons/solid.svg', status: 'Beta' },
  { name: 'Svelte', icon: 'framework-icons/svelte.svg', status: 'Beta' },
] as const

const marqueeFlags = [
  { Component: FlagUs, code: 'us' },
  { Component: FlagJp, code: 'jp' },
  { Component: FlagBr, code: 'br' },
  { Component: FlagCh, code: 'ch' },
  { Component: FlagCa, code: 'ca' },
  { Component: FlagKr, code: 'kr' },
  { Component: FlagFr, code: 'fr' },
  { Component: FlagIn, code: 'in' },
  { Component: FlagGb, code: 'gb' },
  { Component: FlagDe, code: 'de' },
  { Component: FlagCn, code: 'cn' },
] as const

const headline = 'Built for the frontend stacks you already use.'

export default function GallerySection({ flagCount, onFilterNavigate }: GallerySectionProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      gsap.fromTo(
        '.motion-title-word',
        { opacity: 0.65, y: 8 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          ease: 'none',
          scrollTrigger: {
            trigger: '.motion-title',
            start: 'top 82%',
            end: 'top 46%',
            scrub: 0.45,
          },
        }
      )

      gsap.utils.toArray<HTMLElement>('.motion-visual').forEach(element => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: element,
              start: 'top 88%',
              end: 'bottom 12%',
              scrub: 0.5,
            },
          })
          .fromTo(element, { scale: 0.98 }, { scale: 1 })
          .to(element, { scale: 0.995 })
      })
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} className="border-t border-(--border-weak) py-24 sm:py-32">
      <div className="max-w-3xl">
        <h2 className="motion-title text-3xl font-semibold leading-tight tracking-[-0.035em] text-(--ink) sm:text-5xl">
          {headline.split(' ').map((word, index) => (
            <span key={`${word}-${index}`} className="motion-title-word mr-[0.22em] inline-block">
              {word}
            </span>
          ))}
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-7 text-(--muted-light)">
          Import one component, keep full SVG control, and use one consistent API across verified
          client and server stacks.
        </p>
      </div>

      <div className="mt-12 grid grid-flow-dense grid-cols-1 gap-3 lg:grid-cols-12">
        <article className="motion-visual min-h-72 rounded-2xl border border-(--border-strong) bg-(--surface) p-6 lg:col-span-7 sm:p-8">
          <div className="flex h-full flex-col justify-between gap-10">
            <div>
              <Boxes className="h-5 w-5 text-(--accent)" aria-hidden />
              <h3 className="mt-5 text-2xl font-semibold tracking-tight">
                One API across frameworks
              </h3>
              <p className="mt-3 max-w-lg leading-7 text-(--muted-light)">
                Framework-native components with matching names, props, and generated flag coverage.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {frameworks.map(framework => (
                <div
                  key={framework.name}
                  className="flex items-center gap-3 rounded-xl border border-(--border-weak) bg-(--surface-2)/60 p-3"
                >
                  <img
                    src={withBasePath(framework.icon)}
                    alt=""
                    className="h-7 w-7 object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                  <div>
                    <p className="text-sm font-semibold text-(--ink)">{framework.name}</p>
                    <p className="text-xs text-(--muted-light)">{framework.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="motion-visual min-h-72 rounded-2xl border border-(--border-strong) bg-(--surface-2) p-6 lg:col-span-5 sm:p-8">
          <Server className="h-5 w-5 text-(--accent)" aria-hidden />
          <h3 className="mt-5 text-2xl font-semibold tracking-tight">SSR without placeholders</h3>
          <p className="mt-3 leading-7 text-(--muted-light)">
            Static flags render directly to HTML in Next.js and Nuxt, with no client fetch in normal
            usage.
          </p>
          <div className="mt-8 rounded-xl border border-(--border-strong) bg-(--code-bg) p-4 font-mono text-sm leading-7 text-(--code-text)">
            <span className="text-(--code-keyword)">import</span> {'{ FlagUs }'}{' '}
            <span className="text-(--code-keyword)">from</span>
            <br />
            <span className="text-(--code-string)">'@sankyu/react-circle-flags/flags/us'</span>
          </div>
        </article>

        <article className="motion-visual min-h-64 rounded-2xl border border-(--border-strong) bg-(--surface-2) p-6 lg:col-span-5 sm:p-8">
          <Braces className="h-5 w-5 text-(--accent)" aria-hidden />
          <h3 className="mt-5 text-2xl font-semibold tracking-tight">Deterministic imports</h3>
          <p className="mt-3 leading-7 text-(--muted-light)">
            Per-flag subpaths give bundlers an explicit boundary while the dynamic registry remains
            available when needed.
          </p>
          <a
            href={withBasePath('docs/guides/getting-started/bundle-size/')}
            className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-(--ink) hover:text-(--accent)"
          >
            Bundle guidance
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>
        </article>

        <article className="motion-visual min-h-64 rounded-2xl border border-(--border-strong) bg-(--surface) p-6 lg:col-span-7 sm:p-8">
          <SwatchBook className="h-5 w-5 text-(--accent)" aria-hidden />
          <h3 className="mt-5 text-2xl font-semibold tracking-tight">SVG props stay yours</h3>
          <p className="mt-3 max-w-xl leading-7 text-(--muted-light)">
            Set size, title, class names, inline styles, and accessibility attributes without
            learning a custom styling layer.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <FlagUs className="h-11 w-11 opacity-55" />
            <FlagUs className="h-14 w-14" />
            <FlagUs className="h-16 w-16 ring-2 ring-(--accent) ring-offset-4 ring-offset-(--surface)" />
          </div>
        </article>
      </div>

      <div className="motion-visual mt-16 overflow-hidden border-y border-(--border-weak) py-5">
        <div className="flag-marquee-track flex w-max items-center gap-3">
          {[...marqueeFlags, ...marqueeFlags].map(({ Component, code }, index) => (
            <button
              key={`${code}-${index}`}
              type="button"
              aria-hidden={index >= marqueeFlags.length}
              tabIndex={index >= marqueeFlags.length ? -1 : 0}
              aria-label={
                index < marqueeFlags.length ? `Browse ${code.toUpperCase()} flag` : undefined
              }
              onClick={() => onFilterNavigate?.(code)}
              className="group flex items-center gap-3 rounded-xl border border-(--border-weak) bg-(--surface) px-3 py-2 text-sm text-(--muted-light) outline-none transition-colors hover:border-(--border-strong) hover:text-(--ink) focus-visible:ring-2 focus-visible:ring-(--accent)"
            >
              <Component className="h-8 w-8 transition-transform duration-300 group-hover:scale-105" />
              <span>{code.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="mt-5 text-sm text-(--muted)">
        {flagCount}+ generated flag components and aliases.
      </p>
    </section>
  )
}
