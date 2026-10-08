---
name: circle-flags-ui-design
description: Presentation rules for the Circle Flags UI React site (landing page and flag browser, rendered by website/src/react-app). Readers are frontend developers who evaluate and copy a flag component library. The goal is a light "specimen sheet" look where the flags carry all saturated color and the interface stays neutral, ruled, and precise.
version: 2026-10-08
---

# Circle Flags UI design.md

## 1. Scope and Priority

- [MUST] Applies to pages rendered by `website/src/react-app` (landing page type and catalog page type) and to their shared navigation and footer.
- [MUST] Does not apply to the Starlight documentation pages under `/docs` and `/reference`. Starlight keeps its own theme.
- [MUST] Priority for conflicts: factual copy and user requirements, then accessibility, then the reader task (see, choose, copy), then the rules in this file, then decoration.
- [SHOULD] One light theme. The root element carries `data-theme="light"`. Decision: the flags read as printed specimens on paper; source: redesign request on 2026-10-08.

## 2. Brand and Readers

- [SHOULD] Readers scan on desktop first, often with an editor open beside the browser. Primary information appears within the first viewport at 1440 × 900 without scrolling.
- [SHOULD] "Precise" means: every flag sample shows its code or size in mono text next to it, and every code sample shows the real import path.
- [SHOULD] "Neutral" means: saturated color comes only from flag artwork. Interface color is paper, ink, rules, and one accent for links, selection, and focus.
- [SHOULD] Copy tone is plain and declarative. Sentences state what the package does. No exclamation marks, no superlatives, no "blazing", "seamless", or "magic".

## 3. Page Structure and Composition

### Landing page type

- [SHOULD] First viewport: a 12-column split at `lg` (≥1024px). Columns 1–5 hold the `h1`, the lede, the primary and secondary action, and the install command. Columns 6–12 hold the interactive specimen panel. Below `lg` the text stacks above the panel.
- [SHOULD] The first viewport shows a working component, not an illustration. The specimen panel renders real flag components that the reader can switch.
- [SHOULD] Each later section is a "ruled section": a 1px `rule` top border, then a 12-column grid at `lg`. Columns 1–4 hold the section `h2` and one short paragraph. Columns 5–12 hold the content. Below `lg` the two parts stack.
- [SHOULD] Content inside ruled sections uses ruled rows (definition lists or tables), not card grids.
- [SHOULD] The page ends with a full-width flag mosaic section, then the footer.

### Catalog page type

- [SHOULD] First viewport: page `h1` and one line of count text, then a sticky filter bar, then a dense grid of flag tiles.
- [SHOULD] The sticky filter bar sticks directly below the header (`top-16`). It never slides under the header.
- [SHOULD] The detail of a selected item opens as a floating panel fixed to the bottom center of the viewport, 672px wide at `sm` and wider. Below `sm` it spans the viewport width with a 12px inset and scrolls inside a 75dvh limit. It is the only surface that uses `shadow-float`.

## 4. Visual Rules

### Typography

- [MUST] Fonts load only through the Astro Fonts API in `website/astro.config.mjs` (`--font-sans` DM Sans 400/500/600, `--font-mono` Fira Code 400/500). Do not use weights that are not loaded.
- [SHOULD] Type roles use the `text-*` tokens in Chapter 5. A role token sets size, line height, letter spacing, and weight together. Do not add separate `leading-*`, `tracking-*`, or `font-*` weight classes to a role token, except `font-medium` on `text-body` for emphasis.
- [SHOULD] Codes, sizes, package names, import paths, counts in labels, and section labels use `font-mono`. Country names and prose use `font-sans`.
- [SHOULD] Flag codes display in uppercase in labels (`JP`) and in lowercase inside code (`flags/jp`).
- [SHOULD] Numbers in rows and labels use `tabular-nums`.

### Color

- [MUST] Body text on `paper` or `card` uses `ink` or `ink-2`. `ink-3` is only for labels and metadata of 12px or more.
- [SHOULD] `accent` marks only: links on hover, the selected item, the pressed state of a toggle, and focus rings. Do not use `accent` as a fill for large areas or for decoration.
- [SHOULD] Code panels use the `code*` colors. A code panel is the only dark surface on the page.
- [SHOULD] Status text (Stable, Beta) is plain text: `ink` for Stable, `ink-3` for Beta. No colored badges.

### Space and layout

- [SHOULD] Page container: `mx-auto w-full max-w-7xl px-5 sm:px-8`. The header and the footer use the same container.
- [SHOULD] Ruled sections use `py-20 sm:py-28`. The first viewport section uses `min-h-[calc(100dvh-4rem)]` at `lg` and vertical padding `py-14 lg:py-16`.
- [SHOULD] Section `h2` to its paragraph: `mt-4`. Paragraph to actions: `mt-8`. Ruled row padding: `py-5`.

### Surfaces

- [SHOULD] Three surface levels: `paper` (page), `card` (panels and tiles, with a 1px `rule` border), `sunken` (wells inside a panel, for example behind a large flag). Do not put a `card` inside a `card`.
- [SHOULD] Radii: controls `rounded-md`, panels and code panels `rounded-xl`, flags and flag wells `rounded-full`.
- [SHOULD] No gradients, glows, blur backgrounds, or noise textures. Exception: the mosaic fades out at its lower edge with a `mask-image` gradient.

### Flags and images

- [SHOULD] Flag components render at sizes from `FlagSizes` (16, 24, 32, 48, 64, 96, 128). Do not render a flag at another size.
- [SHOULD] Flags have no drop shadow, ring, or border by default. The selected flag in a picker shows a 2px `accent` ring with a 2px `card` offset.
- [SHOULD] Framework logos from `website/public/framework-icons/*.svg` appear at 16px or 20px, inline with the framework name. No logo tiles.

### Controls and states

- [MUST] Each focusable element shows `focus-visible:ring-2 focus-visible:ring-accent` with `outline-none`.
- [MUST] Toggle buttons that select one option of a group expose `aria-pressed`.
- [SHOULD] Primary action: `LinkButton variant="solid"` (ink fill, paper text). Secondary action: `LinkButton` default (rule-strong border, transparent fill).
- [SHOULD] Hover on rows and tiles changes the border to `rule-strong` or the background to `sunken`. Hover does not move or scale elements.
- [SHOULD] Copy buttons swap the Copy icon for a Check icon for 1.4s after success. If the clipboard call fails, the icon stays Copy and the failure is logged.
- [SHOULD] Empty catalog result: centered `text-body text-ink-2` sentence and a reset action in the grid area.

### Motion

- [SHOULD] Motion only confirms a change: switching the specimen flag plays `animate-specimen-in` (opacity and 0.96→1 scale, 180ms, ease-out). The mosaic does not animate.
- [MUST] Under `prefers-reduced-motion: reduce`, animations and transitions are disabled.

## 5. Available Primitives

All tokens live in the `@theme` block of `website/src/react-app/index.css`. Tailwind generates utilities from them (`bg-paper`, `text-ink-2`, `border-rule`, `text-title`).

| Role             | Name                                                                                              | Usage condition                                                   | Status      |
| ---------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ----------- |
| Page background  | `paper`                                                                                           | Page body, header                                                 | Implemented |
| Panel surface    | `card`                                                                                            | Specimen panel, tiles, detail panel                               | Implemented |
| Well surface     | `sunken`                                                                                          | Area behind a large flag, hover fill of rows                      | Implemented |
| Primary text     | `ink`                                                                                             | Headings, primary values                                          | Implemented |
| Secondary text   | `ink-2`                                                                                           | Paragraphs, lede                                                  | Implemented |
| Metadata text    | `ink-3`                                                                                           | Mono labels, counts, Beta status                                  | Implemented |
| Hairline         | `rule`                                                                                            | Section borders, row separators, panel borders                    | Implemented |
| Strong hairline  | `rule-strong`                                                                                     | Secondary button border, hover border                             | Implemented |
| Accent           | `accent`, `accent-soft`                                                                           | Selection, focus, link hover; `accent-soft` fills a selected tile | Implemented |
| Code panel       | `code`, `code-surface`, `code-ink`, `code-muted`, `code-rule`                                     | Dark code panels only                                             | Implemented |
| Display title    | `text-display`                                                                                    | The single `h1` of the landing page                               | Implemented |
| Section title    | `text-title`                                                                                      | `h2` of ruled sections, `h1` of the catalog page                  | Implemented |
| Row heading      | `text-heading`                                                                                    | `h3` in ruled rows and the detail panel                           | Implemented |
| Lede             | `text-lede`                                                                                       | First paragraph under `h1`                                        | Implemented |
| Body             | `text-body`                                                                                       | Paragraphs and row descriptions                                   | Implemented |
| Label            | `text-label` with `font-mono uppercase`                                                           | Section labels, field labels, size captions                       | Implemented |
| Floating shadow  | `shadow-float`                                                                                    | Catalog detail panel only                                         | Implemented |
| Specimen motion  | `animate-specimen-in`                                                                             | Swap of the specimen flag                                         | Implemented |
| Action link      | `LinkButton` (`variant`: `solid`, `ghost`) in `components/ui/LinkButton.tsx`                      | Primary and secondary actions                                     | Implemented |
| Copy control     | `CopyButton` (`text`, `label`, `tone`: `paper`, `code`) in `components/ui/CopyButton.tsx`         | Any copyable command or snippet                                   | Implemented |
| Ruled section    | `RuledSection` (`id`, `title`, `intro`, `children`) in `components/ui/RuledSection.tsx`           | Landing sections after the first viewport                         | Implemented |
| Highlighted code | `HighlightedCode` (`code`, `lang`: `tsx`, `vue`, `svelte`) in `components/ui/HighlightedCode.tsx` | Code inside dark code panels                                      | Implemented |

Example:

```tsx
<RuledSection id="frameworks" title="Same API in four frameworks." intro="Short paragraph.">
  <table className="w-full text-left">…</table>
</RuledSection>
```

Extension boundary:

- [MUST] Pages use only the token names above. Do not guess unlisted names such as `bg-surface` or `text-muted`.
- [SHOULD] Page-specific CSS is not allowed. Use Tailwind utilities that combine the tokens. Keyframes and base element styles live only in `index.css`.
- [SHOULD] Pages do not change the borders, radii, or type roles of `LinkButton`, `CopyButton`, or `RuledSection` through `className`. `className` may only set layout (margin, width, grid placement).

## 6. Copy and Number Formats

- [SHOULD] Headings are sentences that end with a period, 3–9 words, sentence case.
- [SHOULD] Button labels are verb phrases of 1–3 words ("Browse flags", "Read the docs").
- [SHOULD] Counts show the exact number from the registry, without "+" (`432 flags`).
- [SHOULD] Pixel sizes show as `48px` in labels; size names show in mono lowercase (`lg`).
- [SHOULD] Do not state compatibility, versions, or performance that the repository does not verify.

## 7. Anti-Patterns

- [SHOULD] A centered hero with a card grid as the page structure.
- [SHOULD] Cards inside cards.
- [SHOULD] Decorative icon tiles or colored icon backgrounds; a lucide icon above each feature heading.
- [SHOULD] Font sizes, font weights, or color literals outside the tokens (for example `text-[11px]`, `bg-[oklch(…)]`, `text-white`).
- [SHOULD] Small low-contrast text for primary information.
- [SHOULD] Pill labels for ordinary metadata (capital, currency, status).
- [SHOULD] Marquees, auto-scrolling strips, or scroll-scrubbed text effects.
- [SHOULD] Hover lift or scale on tiles and buttons.

## 8. Implementation and Integration

- Style entry: `website/src/react-app/index.css`, imported once by `AppEntry.tsx`. It holds `@import 'tailwindcss'`, the `@theme` tokens, `@layer base` element styles, and keyframes.
- Fonts: `fonts` in `website/astro.config.mjs`, emitted by `<Font>` in `website/src/components/HeadMeta.astro`.
- Theme: the root wrapper in `App.tsx` sets `data-theme="light"`. There is no theme switch.
- Components: `website/src/react-app/components/ui/` for primitives, `components/layout/` for header and footer, `components/pages/` for page compositions. Framework names, logos, and status labels come from `utils/frameworks.ts`.
- Flag components: named imports from `@sankyu/react-circle-flags/flags/<code>` for fixed flags; `flagComponentMap` in `components/flag-browser/flagComponent.ts` for full-registry rendering, loaded lazily.

## Glossary

| Concept          | Name in code      |
| ---------------- | ----------------- |
| Specimen panel   | `SpecimenPanel`   |
| Ruled section    | `RuledSection`    |
| Flag mosaic      | `FlagMosaic`      |
| Copy control     | `CopyButton`      |
| Action link      | `LinkButton`      |
| Code highlighter | `HighlightedCode` |
| Size presets     | `FlagSizes`       |
