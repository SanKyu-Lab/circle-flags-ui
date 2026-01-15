# circle-flags-ui

A monorepo for circular flag components across multiple UI frameworks.

## Packages

| Package                                        | Description                       | npm                                                                                                                         |
| ---------------------------------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| [@sankyu/react-circle-flags](./packages/react) | React circular flag components    | [![npm](https://img.shields.io/npm/v/@sankyu/react-circle-flags)](https://www.npmjs.com/package/@sankyu/react-circle-flags) |
| [@sankyu/vue-circle-flags](./packages/vue)     | Vue 3 circular flag components    | Coming soon                                                                                                                 |
| [@sankyu/solid-circle-flags](./packages/solid) | Solid.js circular flag components | Coming soon                                                                                                                 |

## Features

- 🎯 **Tree-shakable** - Only bundle the flags you use
- 📦 **TypeScript** - Full type definitions included
- ⚡ **Zero dependencies** - Only requires the framework as peer dependency
- 🎨 **Inline SVG** - No external requests, works offline
- 🔧 **Fully customizable** - All standard SVG props supported
- 📱 **SSR compatible** - Works with Next.js, Nuxt, SolidStart, etc.
- 🪶 **Lightweight** - Each flag is ~1KB

## Development

```bash
# Install dependencies
pnpm install

# Generate flag components
pnpm run gen:flags

# Build all packages
pnpm run build

# Run tests
pnpm run test
```

## Project Structure

```
circle-flags-ui/
├── packages/
│   ├── core/      # Shared types and utilities (private)
│   ├── react/     # @sankyu/react-circle-flags
│   ├── vue/       # @sankyu/vue-circle-flags (coming soon)
│   └── solid/     # @sankyu/solid-circle-flags (coming soon)
├── scripts/       # Shared build scripts
└── website/       # Documentation site
```

## Credits

- Flag designs from [HatScripts/circle-flags](https://github.com/HatScripts/circle-flags)

## License

MIT © [Sankyu Lab](https://github.com/Sankyu-Lab)
