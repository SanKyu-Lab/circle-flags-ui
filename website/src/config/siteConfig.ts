/**
 * Shared site metadata configuration
 * Used by Astro config, HeadMeta component, and Starlight
 */

export const siteConfig = {
  title: '@sankyu/react-circle-flags',
  description:
    '400+ circular SVG flag components for React with TypeScript, tree-shaking, and SSR support.',
  author: 'SanKyu Lab',
  themeColor: '#0a0a0a',
  keywords:
    'React,flags,SVG,circular flags,country flags,TypeScript,tree-shaking,SSR,Astro,Next.js',

  // GitHub repository
  github: {
    owner: 'SanKyu-Lab',
    repo: 'react-circle-flags',
    url: 'https://github.com/SanKyu-Lab/react-circle-flags',
  },

  // NPM package
  npm: {
    package: '@sankyu/react-circle-flags',
    url: 'https://www.npmjs.com/package/@sankyu/react-circle-flags',
  },

  // Site URLs
  site: 'https://sankyu-lab.github.io/react-circle-flags',
  base: '/react-circle-flags',

  // Social image (Socialify)
  socialImage:
    'https://socialify.git.ci/SanKyu-Lab/react-circle-flags/image?custom_description=%F0%9F%93%A6NPM+Package%3A+%40sankyu%2Freact-circle-flags&custom_language=TypeScript&description=1&font=Bitter&forks=1&issues=1&language=1&logo=https%3A%2F%2Fraw.githubusercontent.com%2FSanKyu-Lab%2Freact-circle-flags%2Frefs%2Fheads%2Fmain%2Fwebsite%2Fpublic%2Ffavicon.svg&name=1&owner=1&pulls=1&stargazers=1&theme=Light',

  // Favicon
  favicon: '/react-circle-flags/favicon.svg',
} as const
