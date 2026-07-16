import CodeExample from '../../code-example/CodeExample'

export default function QuickStartSection() {
  return (
    <section id="quick-start" className="border-t border-(--border-weak) py-24 sm:py-32">
      <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:col-span-4">
          <h2 className="text-3xl font-semibold leading-tight tracking-[-0.035em] text-(--ink) sm:text-5xl">
            Start with one import.
          </h2>
          <p className="mt-5 max-w-md text-base leading-7 text-(--muted-light)">
            Choose a framework, copy the package command, and render a typed flag component.
          </p>

          <dl className="mt-10 grid grid-cols-2 gap-x-5 gap-y-7 border-t border-(--border-weak) pt-7 text-sm">
            <div>
              <dt className="text-(--muted)">Rendering</dt>
              <dd className="mt-1 font-semibold text-(--ink)">Inline SVG</dd>
            </div>
            <div>
              <dt className="text-(--muted)">Types</dt>
              <dd className="mt-1 font-semibold text-(--ink)">Included</dd>
            </div>
            <div>
              <dt className="text-(--muted)">SSR</dt>
              <dd className="mt-1 font-semibold text-(--ink)">Supported</dd>
            </div>
            <div>
              <dt className="text-(--muted)">Runtime fetch</dt>
              <dd className="mt-1 font-semibold text-(--ink)">Not required</dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-8">
          <CodeExample />
        </div>
      </div>
    </section>
  )
}
