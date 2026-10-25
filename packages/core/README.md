# @sankyu/circle-flags-core

Shared types, utilities and flag data for the circle-flags-ui framework packages:

- `@sankyu/react-circle-flags`
- `@sankyu/vue-circle-flags`
- `@sankyu/solid-circle-flags`
- `@sankyu/svelte-circle-flags`

The framework packages depend on this package and re-export what applications need, so
applications usually do not install it directly.

## Exports

- `FlagComponentProps` - Base props interface for flag components
- `FlagMetadata` - Metadata structure for generated flags
- `BuildMeta` - Build metadata interface
- `FlagSizes` - Standard flag size presets
- `FLAG_REGISTRY` - Generated mapping of flag codes to component names
- `FLAG_ALIASES` - Generated mapping of alias codes to their canonical codes
- `FlagCode` - Union type of all valid flag codes
- `isFlagCode()` - Check whether a string is a known flag code
- `coerceFlagCode()` - Normalize a string to a known flag code, with a fallback
- `codeToEmoji()` - Convert country code to emoji flag
- `codeToComponentName()` - Convert country code to PascalCase component name
- `getSizeName()` - Get size preset name from pixel value
- `escapeHtml()` - Escape text for HTML content and attribute values
- `sanitizeSvg()` - Remove scripts, event handlers and `javascript:` links from an SVG string

Raw SVG markup is available per flag:

```ts
import { svg } from '@sankyu/circle-flags-core/svg/us'
```

## License

MIT
