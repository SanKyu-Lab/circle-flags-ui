// The example apps under examples/, installed from the packed tarballs, built for production
// and opened in Chromium. SSR apps also have their first HTML response checked.
const vitePreview = port => [
  'pnpm',
  'exec',
  'vite',
  'preview',
  '--host',
  '127.0.0.1',
  '--port',
  String(port),
  '--strictPort',
]
const nodeServer = entry => () => ['node', entry]

// SSR examples render a DynamicFlag for "jp" next to a button that switches it to "br".
// Clicking the button only works once the page has hydrated.
const flagSwitch = {
  click: '[data-testid="flag-switch"]',
  target: '[data-testid="switched-flag"]',
  label: 'BR',
}

const ssr = framework => ({
  description: `data-ssr-example="${framework}" and the flag markup`,
  contains: [`data-ssr-example="${framework}"`, 'cf-jp-a', 'cf-us-a'],
})

export const apps = [
  { id: 'example-react', dir: 'examples/example-react', start: vitePreview, minFlags: 21 },
  { id: 'example-vue', dir: 'examples/example-vue', start: vitePreview, minFlags: 21 },
  { id: 'example-solid', dir: 'examples/example-solid', start: vitePreview, minFlags: 21 },
  { id: 'example-svelte', dir: 'examples/example-svelte', start: vitePreview, minFlags: 21 },
  {
    id: 'example-next',
    dir: 'examples/example-next',
    start: port => ['pnpm', 'exec', 'next', 'start', '-H', '127.0.0.1', '-p', String(port)],
    minFlags: 4,
    ssr: ssr('next'),
    interact: flagSwitch,
  },
  {
    id: 'example-nuxt',
    dir: 'examples/example-nuxt',
    start: nodeServer('.output/server/index.mjs'),
    minFlags: 4,
    ssr: ssr('nuxt'),
    interact: flagSwitch,
  },
  {
    id: 'example-solidstart',
    dir: 'examples/example-solidstart',
    start: nodeServer('.output/server/index.mjs'),
    minFlags: 4,
    ssr: ssr('solidstart'),
    interact: flagSwitch,
  },
  {
    id: 'example-sveltekit',
    dir: 'examples/example-sveltekit',
    start: nodeServer('build'),
    minFlags: 4,
    ssr: ssr('sveltekit'),
    interact: flagSwitch,
  },
]
