---
name: circle-flags-ui-best-practices
description: >
  Maintain docs and llms.txt for circle-flags-ui following established conventions.
  Trigger keywords: edit or add MDX doc pages, update install/usage/TypeScript/migration guides,
  adjust llms.txt generation config (starlightLlmsTxt), verify llms*.txt build artifacts.
  Do NOT trigger for: modifying component source, changing build config,
  migrating legacy APIs (see circle-flags-ui-migration skill instead).
---

# circle-flags-ui — Docs & llms.txt Best Practices

## Quick Start

1. Determine whether this is a **doc content change** or an **llms.txt config change** (see decision below).
2. After making changes, run the verification commands in order to catch broken links, formatting issues, or artifact drift.

## Task Decision Tree

### A) Doc content change (MDX)

Applies when:

- Editing `.mdx` pages under `website/src/content/docs/**` (installation, usage, TypeScript, migration, deprecation notices, etc.)

Action:

- Edit only the relevant `.mdx` file(s), keeping page structure and component usage consistent with existing pages.

### B) llms.txt generation config change

Applies when:

- Adjusting the llms copy, set groupings, promoted entries, or include/exclude rules.

Action:

- Edit only the `starlightLlmsTxt({ ... })` call in `website/astro.config.mjs`, specifically these fields:
  - `details`
  - `customSets`
  - `promote`
  - `exclude`
  - `optionalLinks`

> **Background**: `starlightLlmsTxt` comes from the `@astrojs/starlight-llms-txt` plugin. It generates
> structured doc summaries for AI search engines (ChatGPT, Perplexity, etc.), complementing the standard sitemap.

Build artifacts (auto-generated on `pnpm -F website build`):

- `website/dist/llms.txt`
- `website/dist/llms-small.txt`
- `website/dist/llms-full.txt`

## Writing Conventions

- Frontmatter must use only `title` and `description`.
- Reuse Starlight components. Cross-framework examples must be wrapped in `Tabs`:

  ```mdx
  import { Tabs, TabItem } from '@astrojs/starlight/components'

  <Tabs>
    <TabItem label="React">
      {/* React code */}
    </TabItem>
    <TabItem label="Vue 3">
      <!-- Vue code -->
    </TabItem>
    <TabItem label="Solid.js">
      {/* Solid code */}
    </TabItem>
  </Tabs>
  ```

  Other available components: `CardGrid` / `Card`, `LinkCard`.

- All cross-framework examples must be kept in sync (React / Vue 3 / Solid.js):
  - Keep API names, props, and naming consistent across the three tabs.
  - Pay particular attention to: `width`/`height` prop syntax, and `class` (Vue) vs `className` (React/Solid).
- Link strategy:
  - Prefer stable internal paths (e.g. `/docs/...`, `/reference/...`).
  - Stay consistent with the relative/absolute link style already used in the docs — do not mix styles.

## Constraints

- **Do not** add a sidebar entry without also updating the sidebar config in `website/astro.config.mjs`.
- **Do not** use inline `<style>` tags or hard-coded colour values in `.mdx` files — reuse Starlight theme variables instead.
- **Do not** add migration code examples here; that content belongs in the `circle-flags-ui-migration` skill.

## llms.txt Maintenance

- The entry points and set groupings come from `starlightLlmsTxt({ ... })` in `website/astro.config.mjs`.
- Whenever doc paths or the sidebar structure change:
  - Verify `customSets[*].paths` still covers the intended pages.
  - Verify `promote` still points to valid pages.

## Verification Commands

Run these in order after any change:

```bash
# 1. Build the site and generate llms artifacts
pnpm -F website build

# 2. Check code formatting (prevents CI failures)
pnpm run format:check

# 3. Optional: visual spot-check in the browser
pnpm -F website dev
```
