import { DynamicFlag, FlagJp, FlagUs } from '@sankyu/react-circle-flags'

const flags = [
  { label: 'Named import: Japan', component: <FlagJp width={72} height={72} title="Japan" /> },
  {
    label: 'Named import: United States',
    component: <FlagUs width={72} height={72} title="United States" />,
  },
  {
    label: 'Runtime code: Germany',
    component: <DynamicFlag code="de" width={72} height={72} title="Germany" />,
  },
]

export default function Page() {
  return (
    <main data-ssr-example="next">
      <p className="eyebrow">Next.js App Router · Server Component</p>
      <h1>Flags rendered in the first HTML response</h1>
      <p className="intro">
        This Server Component does not add a <code>use client</code> directive. The package declares
        its own client boundary and Next.js still prerenders the flag markup on the server.
      </p>
      <div className="flagGrid">
        {flags.map(flag => (
          <figure key={flag.label}>
            {flag.component}
            <figcaption>{flag.label}</figcaption>
          </figure>
        ))}
      </div>
    </main>
  )
}
