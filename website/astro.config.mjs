// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import starlight from '@astrojs/starlight'

// https://astro.build/config
export default defineConfig({
  site: 'https://sankyu-lab.github.io',
  base: '/',
  integrations: [
    react(),
    starlight({
      title: 'Sankyu Lab - React Circle Flags',
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/SanKyu-Lab/react-circle-flags',
        },
      ],
      sidebar: [
        {
          label: 'Guides',
          items: [
            // Each item here is one entry in the navigation menu.
            { label: 'Getting Started', slug: 'docs/guides/getting-started' },
            { label: 'Installation', slug: 'docs/guides/getting-started/installation' },
            { label: 'Basic Usage', slug: 'docs/guides/getting-started/usage' },
            { label: 'Styling', slug: 'docs/guides/getting-started/styling' },
            { label: 'Dynamic Flags', slug: 'docs/guides/getting-started/dynamic-flags' },
            { label: 'TypeScript', slug: 'docs/guides/getting-started/typescript' },
            { label: 'Bundle Size', slug: 'docs/guides/getting-started/bundle-size' },
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
      ],
    }),
  ],
  vite: {
    server: {
      fs: {
        allow: ['..'],
      },
    },
  },
})
