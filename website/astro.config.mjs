// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import starlight from '@astrojs/starlight'
import { siteConfig } from './src/config/siteConfig'

// https://astro.build/config
export default defineConfig({
  site: siteConfig.site,
  base: siteConfig.base,
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
  },
})
