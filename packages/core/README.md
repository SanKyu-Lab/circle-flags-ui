# @sankyu/circle-flags-core

Internal shared utilities and types for circle-flags-ui packages.

**This is a private package** - not published to npm. It provides shared functionality for:

- `@sankyu/react-circle-flags`
- `@sankyu/vue-circle-flags` (coming soon)
- `@sankyu/solid-circle-flags` (coming soon)

## Exports

- `FlagComponentProps` - Base props interface for flag components
- `FlagMetadata` - Metadata structure for generated flags
- `BuildMeta` - Build metadata interface
- `FlagSizes` - Standard flag size presets
- `FLAG_REGISTRY` - Generated mapping of flag codes to component names
- `FlagCode` - Union type of all valid flag codes
- `codeToEmoji()` - Convert country code to emoji flag
- `codeToComponentName()` - Convert country code to PascalCase component name
- `getSizeName()` - Get size preset name from pixel value

## License

MIT
