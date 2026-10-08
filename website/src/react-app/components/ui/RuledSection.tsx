import type { ReactNode } from 'react'

interface RuledSectionProps {
  id: string
  title: string
  intro: ReactNode
  children: ReactNode
}

export default function RuledSection({ id, title, intro, children }: RuledSectionProps) {
  const headingId = `${id}-title`

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="grid gap-10 border-t border-rule py-20 sm:py-28 lg:grid-cols-12 lg:gap-8"
    >
      <div className="lg:col-span-4 lg:pr-8">
        <h2 id={headingId} className="text-title text-ink">
          {title}
        </h2>
        <div className="mt-4 max-w-md text-body text-ink-2">{intro}</div>
      </div>
      <div className="min-w-0 lg:col-span-8">{children}</div>
    </section>
  )
}
