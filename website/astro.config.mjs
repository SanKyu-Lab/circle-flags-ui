// @ts-check
import { defineConfig, fontProviders } from 'astro/config'
import react from '@astrojs/react'
import starlight from '@astrojs/starlight'
import { siteConfig } from './src/config/siteConfig'

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
