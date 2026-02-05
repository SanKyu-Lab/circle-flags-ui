// @ts-check
import { defineConfig, fontProviders } from 'astro/config'
import react from '@astrojs/react'
import starlight from '@astrojs/starlight'
import { fileURLToPath } from 'node:url'
import { siteConfig } from './src/config/siteConfig'
import starlightLlmsTxt from 'starlight-llms-txt'
import starlightTypeDoc from 'starlight-typedoc'
import starlightAutoSidebar from 'starlight-auto-sidebar'
import starlightLinksValidator from 'starlight-links-validator'

const isAstroCheck = process.argv.includes('check')
const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true'

const isTypeDocEnabled = process.env.RUN_TYPEDOC === 'true'
const shouldRunTypeDoc = isCI && isTypeDocEnabled && process.env.SKIP_TYPEDOC !== 'true'

const reactPkgEntry = fileURLToPath(new URL('../packages/react/src/index.tsx', import.meta.url))
const reactPkgSrcDir = fileURLToPath(new URL('../packages/react/src/', import.meta.url))
const corePkgEntry = fileURLToPath(new URL('../packages/core/src/index.ts', import.meta.url))
const corePkgSrcDir = fileURLToPath(new URL('../packages/core/src/', import.meta.url))

const starlightPlugins = [
  starlightAutoSidebar(),
  ...(!isAstroCheck
    ? [
        starlightLinksValidator({
          errorOnFallbackPages: false,
          errorOnRelativeLinks: false,
        }),
      ]
    : []),
  ...(isAstroCheck || !shouldRunTypeDoc
    ? []
    : [
        starlightTypeDoc({
          entryPoints: ['../packages/react/src/docs.ts'],
          tsconfig: '../packages/react/tsconfig.json',
          output: 'reference/api',
          // @ts-ignore
          publicPath: '/docs',
          sidebar: { label: 'API Reference', collapsed: false },
          typeDoc: {
            excludePrivate: true,
            excludeProtected: true,
            excludeInternal: true,
            readme: 'none',
            gitRevision: 'main',
            entryPointStrategy: 'resolve',
            flattenOutputFiles: true,
            hideBreadcrumbs: true,
            fileExtension: '.md',
            useCodeBlocks: true,
            expandObjects: true,
            indexFormat: 'table',
            exclude: ['**/*.test.ts', '**/*.test.tsx', '**/node_modules/**', '**/dist/**'],
          },
          // eslint-disable-next-line no-undef
          watch: process.env.NODE_ENV === 'development',
        }),
      ]),
  starlightLlmsTxt({
    projectName:
      'circle-flags-ui Docs (@sankyu/react-circle-flags, @sankyu/vue-circle-flags, @sankyu/solid-circle-flags)',
    description:
      'Documentation for circle-flags-ui: 400+ circular SVG flags across React (stable), Vue 3 (beta), and Solid.js (beta), with TypeScript types, SSR support, and tree-shaking.',
    details: `Vibe-coding assistant guidance:

- Start from \`guides/getting-started/installation\`, then choose one framework path (React, Vue 3, or Solid.js) and keep code examples framework-consistent.
- Prefer named flag imports for smallest bundles. Use \`DynamicFlag\` only when codes are runtime values.
- For runtime strings, normalize with \`trim().toLowerCase()\`, then use \`isFlagCode()\` or \`coerceFlagCode()\`.
- \`FlagUtils.formatCountryCode()\` returns uppercase display text; size presets come from \`FlagSizes\` / \`FlagUtils.sizes\` and use \`xs | sm | md | lg | xl | xxl | xxxl\`.
- \`CircleFlag\` is deprecated. Use named imports or \`DynamicFlag\` in new code.
- CDN usage is for prototypes/sandboxes; for production and offline-first UX, install from npm and bundle locally.

Use \`/llms-small.txt\` for fast context loading, \`/llms-full.txt\` for complete context, and \`/_llms-txt/*.txt\` for focused subsets.`,
    customSets: [
      {
        label: 'Getting Started Guide',
        description:
          'Core onboarding path for coding assistants: install, render flags, style, handle dynamic codes, and apply TypeScript-safe patterns',
        paths: ['**/guides/getting-started/**'],
      },
      {
        label: 'Advanced Usage',
        description:
          'Advanced implementation guidance including FlagUtils, type utilities, and practical CDN tradeoffs',
        paths: ['**/guides/advanced/**'],
      },
      {
        label: 'Migration Guide',
        description:
          'Migration notes from legacy react-circle-flags usage to the current circle-flags-ui patterns',
        paths: ['**/migration/**'],
      },
      {
        label: 'API Reference',
        description: 'Typed API surface for components, utility functions, and exported types',
        paths: ['**/reference/**'],
      },
    ],
    promote: [
      'guides/getting-started',
      'guides/getting-started/installation',
      'guides/getting-started/usage',
      'reference/api',
    ],
    exclude: ['migration/**'],
    optionalLinks: [
      {
        label: 'GitHub Repository',
        url: 'https://github.com/SanKyu-Lab/circle-flags-ui',
        description: 'Source code, issue tracker, and contribution guidelines',
      },
      {
        label: 'NPM (React Package)',
        url: 'https://www.npmjs.com/package/@sankyu/react-circle-flags',
        description: 'Stable React package information and release history',
      },
      {
        label: 'NPM (Vue Package)',
        url: 'https://www.npmjs.com/package/@sankyu/vue-circle-flags',
        description: 'Vue 3 beta package information',
      },
      {
        label: 'NPM (Solid Package)',
        url: 'https://www.npmjs.com/package/@sankyu/solid-circle-flags',
        description: 'Solid.js beta package information',
      },
      {
        label: 'LLMs Small Context',
        url: 'https://react-circle-flags.js.org/llms-small.txt',
        description: 'Token-optimized context for fast AI coding assistance',
      },
      {
        label: 'LLMs Full Context',
        url: 'https://react-circle-flags.js.org/llms-full.txt',
        description: 'Complete documentation context for deep reasoning',
      },
    ],
  }),
]

// https://astro.build/config
export default defineConfig({
  site: siteConfig.site,
  base: siteConfig.base,
  experimental: {
    fonts: [
      {
        provider: fontProviders.fontsource(),
        name: 'DM Sans',
        cssVariable: '--font-sans',
        weights: [400, 500, 700],
        styles: ['normal'],
        subsets: ['latin'],
        fallbacks: ['system-ui', '-apple-system', 'sans-serif'],
        optimizedFallbacks: true,
      },
      {
        provider: fontProviders.fontsource(),
        name: 'Syne',
        cssVariable: '--font-display',
        weights: [700, 800],
        styles: ['normal'],
        subsets: ['latin'],
        fallbacks: ['system-ui', 'sans-serif'],
        optimizedFallbacks: true,
      },
      {
        provider: fontProviders.fontsource(),
        name: 'Fira Code',
        cssVariable: '--font-mono',
        weights: [400, 500],
        styles: ['normal'],
        subsets: ['latin'],
        fallbacks: ['Menlo', 'SFMono-Regular', 'ui-monospace', 'monospace'],
        optimizedFallbacks: true,
      },
      {
        provider: fontProviders.fontsource(),
        name: 'Crimson Pro',
        cssVariable: '--font-serif',
        weights: [400, 600],
        styles: ['normal'],
        subsets: ['latin'],
        fallbacks: ['Georgia', 'Times New Roman', 'serif'],
        optimizedFallbacks: true,
      },
    ],
  },
  integrations: [
    react(),
    starlight({
      title: siteConfig.title,
      description: siteConfig.description,
      plugins: starlightPlugins,
      logo: {
        src: './src/assets/favicon.svg',
        alt: 'React Circle Flags',
      },
      favicon: siteConfig.favicon,
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: siteConfig.github.url,
        },
      ],
      sidebar: [
        {
          label: 'Guides',
          items: [
            { label: 'Getting Started', slug: 'docs/guides/getting-started' },
            { label: 'Installation', slug: 'docs/guides/getting-started/installation' },
            { label: 'Basic Usage', slug: 'docs/guides/getting-started/usage' },
            { label: 'Styling', slug: 'docs/guides/getting-started/styling' },
            { label: 'Dynamic Flags', slug: 'docs/guides/getting-started/dynamic-flags' },
            { label: 'TypeScript', slug: 'docs/guides/getting-started/typescript' },
            {
              label: 'Bundle Size & Tree-shaking',
              slug: 'docs/guides/getting-started/bundle-size',
            },
          ],
        },
        {
          label: 'Advanced',
          items: [
            { label: 'FlagUtils Toolkit', slug: 'docs/guides/advanced/flag-utils' },
            { label: 'Type Utilities', slug: 'docs/guides/advanced/type-utilities' },
            { label: 'Using CDN', slug: 'docs/guides/advanced/cdn-usage' },
          ],
        },
        {
          label: 'Deprecated',
          items: [{ label: 'CircleFlag', slug: 'docs/deprecated/circleflag' }],
        },
        {
          label: 'Migration',
          items: [
            { label: 'From react-circle-flags', slug: 'docs/migration/from-react-circle-flags' },
          ],
        },
        {
          label: 'API Reference',
          autogenerate: { directory: 'reference/api' },
        },
        {
          label: 'Examples',
          items: [
            {
              label: 'Example React App',
              link: '/',
              attrs: { target: '_blank' },
            },
          ],
        },
        {
          label: 'Related Links',
          items: [
            {
              label: 'LLMs.txt (Entry)',
              link: '/llms.txt',
              attrs: { target: '_blank', rel: 'noreferrer' },
            },
            {
              label: 'LLMs Small (Fast)',
              link: '/llms-small.txt',
              attrs: { target: '_blank', rel: 'noreferrer' },
            },
            {
              label: 'LLMs Full (Complete)',
              link: '/llms-full.txt',
              attrs: { target: '_blank', rel: 'noreferrer' },
            },
            {
              label: 'GitHub Repository',
              link: siteConfig.github.url,
              attrs: { target: '_blank', rel: 'noreferrer' },
            },
            {
              label: 'NPM Package',
              link: siteConfig.npm.url,
              attrs: { target: '_blank', rel: 'noreferrer' },
            },
          ],
        },
      ],
      editLink: {
        baseUrl: `${siteConfig.github.url}/blob/main/website/`,
      },
    }),
  ],
  // Build options
  build: {
    format: 'directory',
  },
  vite: {
    resolve: {
      alias: [
        { find: '@sankyu/react-circle-flags', replacement: reactPkgEntry },
        { find: /^@sankyu\/react-circle-flags\/(.*)$/, replacement: `${reactPkgSrcDir}$1` },
        { find: '@sankyu/circle-flags-core', replacement: corePkgEntry },
        { find: /^@sankyu\/circle-flags-core\/(.*)$/, replacement: `${corePkgSrcDir}$1` },
      ],
    },
    server: {
      fs: {
        allow: ['..'],
      },
    },
    build: {
      assetsInlineLimit: 0,
      rollupOptions: {
        output: {
          assetFileNames: assetInfo => {
            // Keep font files in _astro/files directory to match CSS references
            if (assetInfo.name && /\.(woff|woff2|ttf|eot)$/.test(assetInfo.name)) {
              return '_astro/files/[name][extname]'
            }
            return '_astro/[name]-[hash][extname]'
          },
        },
      },
    },
  },
})
