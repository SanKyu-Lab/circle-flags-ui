// @ts-check
import { defineConfig, fontProviders } from 'astro/config'
import react from '@astrojs/react'
import starlight from '@astrojs/starlight'
import { siteConfig } from './src/config/siteConfig'
import starlightLlmsTxt from 'starlight-llms-txt'
import starlightTypeDoc from 'starlight-typedoc'
import starlightAutoSidebar from 'starlight-auto-sidebar'
import starlightLinksValidator from 'starlight-links-validator'

const isAstroCheck = process.argv.includes('check')
const skipTypeDoc = process.env.SKIP_TYPEDOC === 'true'

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
  ...(isAstroCheck || skipTypeDoc
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
    projectName: '@sankyu/react-circle-flags',
    description:
      'A React component library providing 400+ circular SVG country flags with full TypeScript support, tree-shaking optimization, and SSR compatibility.',
    details: `This library converts SVG flags from the HatScripts/circle-flags repository into optimized React components. Each flag component supports standard SVG properties, has a default size of 48px.

The package uses a dual-entry build configuration for optimal tree-shaking, ensuring users only bundle the flag components they actually import.`,
    customSets: [
      {
        label: 'Getting Started Guide',
        description:
          'Essential documentation for new users: installation, basic usage, styling, dynamic flags, TypeScript support, and bundle size optimization',
        paths: ['**/guides/getting-started/**'],
      },
      {
        label: 'Advanced Usage',
        description: 'Advanced topics including CDN usage and other expert-level configurations',
        paths: ['**/guides/advanced/**'],
      },
      {
        label: 'Migration Guide',
        description: 'Instructions for migrating from the original react-circle-flags package',
        paths: ['**/migration/**'],
      },
      {
        label: 'API Reference',
        description:
          'Complete API documentation for all exported components, types, and utility functions',
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
        url: 'https://github.com/SanKyu-Lab/react-circle-flags',
        description: 'Source code, issue tracker, and contribution guidelines',
      },
      {
        label: 'NPM Package',
        url: 'https://www.npmjs.com/package/@sankyu/react-circle-flags',
        description: 'Package information, version history, and installation command',
      },
      {
        label: 'Interactive Demo',
        url: 'https://react-circle-flags.js.org/',
        description: 'Live React demo with flag browser and code examples',
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
          items: [{ label: 'Using CDN', slug: 'docs/guides/advanced/cdn-usage' }],
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
