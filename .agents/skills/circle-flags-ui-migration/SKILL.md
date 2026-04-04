---
name: circle-flags-ui-migration
description: >
  Audit and migrate legacy react-circle-flags / HatScripts circle-flags usage to
  @sankyu/react-circle-flags, @sankyu/vue-circle-flags, or @sankyu/solid-circle-flags.
  Trigger keywords: react-circle-flags, CircleFlag component, hatscripts.github.io/circle-flags,
  HatScripts/circle-flags, migrate, legacy flags.
  Do NOT trigger for: code already using @sankyu/*, questions about component API only.
---

# react-circle-flags / HatScripts → @sankyu/* Migration Guide

## Quick Start (audit before migrating)

Run the audit script from the target project root (prefers `rg`, falls back to Node.js traversal):

```bash
node .agents/skills/circle-flags-ui-migration/scripts/audit-legacy-usage.mjs --root . --format md
```

Append extra directories to exclude (`--exclude` is repeatable):

```bash
node .agents/skills/circle-flags-ui-migration/scripts/audit-legacy-usage.mjs \
  --root . --format md --exclude build --exclude .turbo
```

Output includes:

- **Summary** — hit count per category + deduplicated file list, grouped by category
- **Next Steps** — migration guidance for each category that has hits

## Default Excluded Directories

`node_modules`, `.git`, `dist`, `coverage`, `website/dist`, `.pnpm-store`

## Package Reference

| Framework | Legacy package | New package |
|-----------|---------------|-------------|
| React | `react-circle-flags` | `@sankyu/react-circle-flags` |
| Vue 3 | — | `@sankyu/vue-circle-flags` |
| Solid.js | — | `@sankyu/solid-circle-flags` |

## Migration Decision Tree

### Strategy 1 — Static flag codes (recommended: named imports)

Use when all flag codes are known at build time. Only the flags you import are bundled.

```tsx
// Before
import { CircleFlag } from 'react-circle-flags'
<CircleFlag countryCode="us" height={24} />

// After — React
import { FlagUs } from '@sankyu/react-circle-flags'
<FlagUs height={24} />

// After — Vue 3
import { FlagUs } from '@sankyu/vue-circle-flags'
<FlagUs :height="24" />

// After — Solid.js
import { FlagUs } from '@sankyu/solid-circle-flags'
<FlagUs height={24} />
```

### Strategy 2 — Runtime codes with a bounded value set (recommended: named imports + map)

Use when flag codes come from an API or user input but the set of possible values is finite.

```tsx
// After — React example
import { FlagUs, FlagCn, FlagDe } from '@sankyu/react-circle-flags'

const FLAG_MAP: Record<string, React.FC> = { us: FlagUs, cn: FlagCn, de: FlagDe }

function CountryFlag({ code }: { code: string }) {
  const Flag = FLAG_MAP[code.toLowerCase()]
  return Flag ? <Flag height={24} /> : <span>{code.toUpperCase()}</span>
}
```

### Strategy 3 — Arbitrary runtime codes, offline-first (optional: DynamicFlag)

Use when any flag code must be supported at runtime without a CDN dependency.

> **Trade-off**: `DynamicFlag` bundles all 400+ flags, significantly increasing bundle size.

```tsx
// After — React
import { DynamicFlag } from '@sankyu/react-circle-flags'
<DynamicFlag code={userInputCode} height={24} />
```

## Type Utilities

- Normalise input first: `code.trim().toLowerCase()`
- `isFlagCode(code)` — narrow a normalised string to the `FlagCode` type at runtime
- `coerceFlagCode(code)` — safely coerce untrusted input, falling back to `"xx"` for unknown values

## Documentation

If this migration requires updating the docs site, refer to the `circle-flags-ui-best-practices` skill.
