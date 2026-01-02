# React Circle Flags Website

The official documentation and demo website for the `@sankyu/react-circle-flags` library.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended)

### Installation

The website depends on the parent library via local file reference:

```bash
# From the website directory
cd website
pnpm install
```

### Development

```bash
# Start development server at http://localhost:4321
pnpm dev
```

### Build

```bash
# Build parent library first
cd ..
pnpm build

# Then build website
cd website
pnpm build
```

Output is generated in the `dist/` directory.

### Preview Production Build

```bash
pnpm preview
```

## Integration with Parent Library

### TypeScript Path Mapping

The `tsconfig.json` maps imports to the parent library source:

```json
{
  "compilerOptions": {
    "paths": {
      "@sankyu/react-circle-flags": ["../src/index.tsx"]
    }
  }
}
```

This allows importing directly from source:

```typescript
import { FLAG_REGISTRY, FlagUS } from '@sankyu/react-circle-flags'
```

### Vite File System Access

`astro.config.mjs` allows accessing the parent directory:

```javascript
vite: {
  server: {
    fs: {
      allow: ['..']
    }
  }
}
```

## License

This project is part of the `@sankyu/react-circle-flags` monorepo. See the parent package for license information.

## Related

- **[@sankyu/react-circle-flags](../)**
- **[circle-flags](https://github.com/HatScripts/circle-flags)** - Original SVG flag collection
