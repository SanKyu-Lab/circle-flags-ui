import RuledSection from '../../ui/RuledSection'

const specRows = [
  {
    term: 'Rendering',
    title: 'Inline SVG elements.',
    body: 'Each flag is a component that renders an <svg> element in place. Static flags make no network request.',
  },
  {
    term: 'Imports',
    title: 'One subpath per flag.',
    body: 'Import from flags/<code> and the bundle contains that flag only. The full registry stays available for runtime codes.',
  },
  {
    term: 'Server',
    title: 'Rendered to HTML on the server.',
    body: 'Named flags render during SSR in Next.js and Nuxt, so the first paint already shows the flag.',
  },
  {
    term: 'Props',
    title: 'Standard SVG attributes.',
    body: 'width, height, className, style, title, and ARIA attributes pass through to the element.',
  },
  {
    term: 'Runtime',
    title: 'Typed codes for dynamic input.',
    body: 'DynamicFlag renders a flag from a string. isFlagCode and coerceFlagCode narrow user input to FlagCode.',
  },
] as const

export default function SpecSection() {
  return (
    <RuledSection
      id="spec"
      title="What every package ships."
      intro="The four packages generate from the same SVG source and expose the same component names."
    >
      <dl className="border-t border-rule">
        {specRows.map(row => (
          <div
            key={row.term}
            className="grid gap-2 border-b border-rule py-5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6"
          >
            <dt className="pt-1 text-label font-mono uppercase text-ink-3">{row.term}</dt>
            <dd>
              <p className="text-heading text-ink">{row.title}</p>
              <p className="mt-1 max-w-2xl text-body text-ink-2">{row.body}</p>
            </dd>
          </div>
        ))}
      </dl>
    </RuledSection>
  )
}
