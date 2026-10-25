import { createSignal, For } from 'solid-js'
import type { JSX } from 'solid-js'
import { DynamicFlag, FlagJp, FlagUs } from '@sankyu/solid-circle-flags'
import './app.css'

const flags: { label: string; render: () => JSX.Element }[] = [
  {
    label: 'Named import: Japan',
    render: () => <FlagJp width={72} height={72} title="Japan" />,
  },
  {
    label: 'Named import: United States',
    render: () => <FlagUs width={72} height={72} title="United States" />,
  },
  {
    label: 'Runtime code: Germany',
    render: () => <DynamicFlag code="de" width={72} height={72} title="Germany" />,
  },
]

export default function App() {
  const [selected, setSelected] = createSignal<string>('jp')

  return (
    <main data-ssr-example="solidstart">
      <p class="eyebrow">SolidStart 2 · Server-side rendering</p>
      <h1>Flags rendered in the first HTML response</h1>
      <p class="intro">
        Named imports and DynamicFlag render on the server and hydrate in the browser. They do not
        need a clientOnly wrapper.
      </p>
      <div class="flag-grid">
        <For each={flags}>
          {flag => (
            <figure>
              {flag.render()}
              <figcaption>{flag.label}</figcaption>
            </figure>
          )}
        </For>
      </div>
      <div class="picker">
        <DynamicFlag code={selected()} width={48} height={48} data-testid="switched-flag" />
        <button
          type="button"
          data-testid="flag-switch"
          onClick={() => setSelected(code => (code === 'jp' ? 'br' : 'jp'))}
        >
          Switch flag after hydration
        </button>
      </div>
    </main>
  )
}
