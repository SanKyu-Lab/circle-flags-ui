/**
 * API Reference for @sankyu/react-circle-flags
 *
 * @packageDocumentation
 */

// Components and public metadata
export { buildMeta, CircleFlag, DynamicFlag, FLAG_REGISTRY } from './index'

// Component props and public types
export type {
  BuildMeta,
  CircleFlagProps,
  CountryCode,
  DynamicFlagProps,
  FlagCode,
  FlagComponentProps,
  FlagSizeName,
} from './index'

// Flag size constants and lookup
export { FlagSizes, getSizeName } from './index'

// Type narrowing helpers
export { coerceFlagCode, isFlagCode } from './index'

// Flag utilities
export { FlagUtils } from './index'

// Note: Individual flag components (FlagUs, FlagCn, etc.) are not documented here.
// They are visually showcased in the FlagBrowser component on the website.
