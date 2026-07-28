/**
 * Shared site metadata configuration
 * Used by Astro config, HeadMeta component, and Starlight
 */

export const siteConfig = {
  title: 'Circle Flags UI',
  description:
    '400+ circular SVG flag components for React, Vue, Solid, and Svelte with TypeScript, tree-shaking, and SSR support.',
  author: 'SanKyu Lab',
  themeColor: '#0a0a0a',
  keywords:
    'React,Vue,Solid,Svelte,flags,SVG,circular flags,country flags,TypeScript,tree-shaking,SSR,Astro',

  // GitHub repository
  github: {
    owner: 'SanKyu-Lab',
    repo: 'circle-flags-ui',
    url: 'https://github.com/SanKyu-Lab/circle-flags-ui',
  },

  // NPM package
  npm: {
    package: '@sankyu/react-circle-flags',
    url: 'https://www.npmjs.com/package/@sankyu/react-circle-flags',
  },

  // Site URLs
  site: 'https://react-circle-flags.js.org',
  base: '/',

  // Social image (Socialify)
  socialImage:
    'https://socialify.git.ci/SanKyu-Lab/circle-flags-ui/image?custom_description=Circular+SVG+flags+for+React%2C+Vue%2C+Solid%2C+and+Svelte&custom_language=TypeScript&description=1&font=Bitter&forks=1&issues=1&language=1&name=1&owner=1&pulls=1&stargazers=1&theme=Light',

  // Favicon
  favicon: '/favicon.svg',
} as const
