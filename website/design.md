---
name: circle-flags-ui-design
description: Presentation rules for the Circle Flags UI website in light and dark themes, covering the React pages (landing page and flag browser, rendered by website/src/react-app) and the Starlight documentation pages. Readers are frontend developers who evaluate and copy a flag component library. The goal is a "specimen sheet" look where the flags carry all saturated color and the interface stays neutral, ruled, and precise.
version: 2026-10-08
---

# Circle Flags UI design.md

## 1. Scope and Priority

- [MUST] Applies to pages rendered by `website/src/react-app` (landing page type and catalog page type), to their shared navigation and footer, and to the Starlight documentation pages under `/docs` and `/reference` (documentation page type).
- [MUST] The React pages and the documentation pages read colors from the same tokens. Do not define a color for one part of the site that the other part cannot use.
- [MUST] Priority for conflicts: factual copy and user requirements, then accessibility, then the reader task (see, choose, copy), then the rules in this file, then decoration.
- [SHOULD] Two themes, light and dark. `<html>` carries `data-theme="light"` or `data-theme="dark"`. The first visit follows `prefers-color-scheme`; the header toggle stores an explicit choice. Decision: user request on 2026-10-08.
- [MUST] Both themes use the same token names. Components never branch on the theme; only token values change.

## 2. Brand and Readers

- [SHOULD] Readers scan on desktop first, often with an editor open beside the browser. Primary information appears within the first viewport at 1440 × 900 without scrolling.
- [SHOULD] "Precise" means: every flag sample shows its code or size in mono text next to it, and every code sample shows the real import path.
- [SHOULD] "Neutral" means: saturated color comes only from flag artwork. Interface color is paper, ink, rules, and one accent for links, selection, and focus.
- [SHOULD] Copy tone is plain and declarative. Sentences state what the package does. No exclamation marks, no superlatives, no "blazing", "seamless", or "magic".

## 3. Page Structure and Composition

### Landing page type

- [SHOULD] First viewport: a 12-column split at `lg` (≥1024px). Columns 1–5 hold the `h1`, the lede, the primary and secondary action, and the install command. Columns 6–12 hold the interactive specimen panel. Below `lg` the text stacks above the panel.
- [SHOULD] The first viewport shows a working component, not an illustration. The specimen panel renders real flag components that the reader can switch.
- [SHOULD] Later sections use one of two layouts. A "ruled section" (`RuledSection`) has a 1px `rule` top border and a 12-column grid at `lg`: columns 1–4 hold the `h2` and one short paragraph, columns 5–12 hold the content. A "feature explorer" has the `h2` in columns 1–5 and the paragraph in columns 7–12 on one row, then a vertical tab list in columns 1–5 and a sticky demo panel in columns 6–12. Below `lg` both layouts stack.
- [SHOULD] A feature explorer tab shows its index (`01`), a mono label, and a `text-heading` title. Only the selected tab shows its body text. The selected tab has a 2px `accent` left border and a `card` fill.
- [SHOULD] A demo panel is one `card` with three stacked parts: a `sunken` stage (minimum height 18rem) that renders real components, an optional control row, and a code panel. The code always matches the rendered state.
- [SHOULD] Content inside ruled sections uses ruled rows (definition lists or tables), not card grids.
- [SHOULD] The page ends with a full-width flag mosaic section, then the footer. Each mosaic flag is a link to the catalog page with that flag selected. At `lg` the mosaic shows every flag; below `lg` it is cut to a fixed height and fades out.

### Catalog page type

- [SHOULD] First viewport: page `h1` and one line of count text, then a sticky filter bar, then a dense grid of flag tiles.
- [SHOULD] The sticky filter bar sticks directly below the header (`top-16`). It never slides under the header.
- [SHOULD] The detail of a selected item opens as a floating panel fixed to the bottom center of the viewport, 672px wide at `sm` and wider. Below `sm` it spans the viewport width with a 12px inset and scrolls inside a 75dvh limit. It is the only surface that uses `shadow-float`.

### Documentation page type

- [SHOULD] Layout follows Starlight: left sidebar, content column, right table of contents. The header matches the React header: logo and name on the left, then the site links (Home, Browse, Docs, GitHub) in `ink-3` with the current one in `ink`, then search and the theme select on the right. Below 50rem only the logo, search, and the menu button show.
- [SHOULD] The page `h1` uses the `text-title` values. Each content `h2` starts a ruled block: a 1px `rule` top border and 1.5rem top padding.
- [SHOULD] Sidebar group labels use the label style (mono, uppercase, 12px, `ink-3`). The current sidebar link has a `sunken` fill and a 2px `accent` left edge, the same marker as a selected feature explorer tab.
- [SHOULD] Content links are `ink` with a `rule-strong` underline offset 4px; on hover both turn `accent`.
- [SHOULD] Asides are `sunken` wells with a 2px colored left edge. The edge and title keep the Starlight semantic color of the aside variant.
- [SHOULD] Link cards and pagination links are `card` surfaces with a 1px `rule` border and `rounded-xl`; hover changes the border to `rule-strong`. They have no shadow.
- [SHOULD] Code blocks use the dark code panel colors and `github-dark-default` in both themes, with `rounded-xl` and no shadow.

## 4. Visual Rules

### Typography

- [MUST] Fonts load only through the Astro Fonts API in `website/astro.config.mjs` (`--font-sans` DM Sans 400/500/600, `--font-mono` Fira Code 400/500). Do not use weights that are not loaded.
- [SHOULD] Type roles use the `text-*` tokens in Chapter 5. A role token sets size, line height, letter spacing, and weight together. Do not add separate `leading-*`, `tracking-*`, or `font-*` weight classes to a role token, except `font-medium` on `text-body` for emphasis.
- [SHOULD] Codes, sizes, package names, import paths, counts in labels, and section labels use `font-mono`. Country names and prose use `font-sans`.
- [SHOULD] Flag codes display in uppercase in labels (`JP`) and in lowercase inside code (`flags/jp`).
- [SHOULD] Numbers in rows and labels use `tabular-nums`.

### Color

- [SHOULD] All neutral tokens (`paper`, `card`, `sunken`, `ink*`, `rule*`, `code*`) share one cool hue (264–268) with chroma of 0.02 or less. Do not mix warm and cool neutrals. Decision: a single-temperature gray lets the flag colors stand out; source: palette revision on 2026-10-08.
- [SHOULD] `accent` is a deep indigo (hue 272). It stays distinct from the flag blues because it has a higher chroma and a violet shift.
- [MUST] Body text on `paper` or `card` uses `ink` or `ink-2`. `ink-3` is only for labels and metadata of 12px or more.
- [SHOULD] `accent` marks only: links on hover, the selected item, the pressed state of a toggle, and focus rings. Do not use `accent` as a fill for large areas or for decoration.
- [SHOULD] Code panels use the `code*` colors and the Shiki theme `github-dark-default`. In the light theme a code panel is the only dark surface. In the dark theme `code` is darker than `paper`.
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

- [SHOULD] Flag components render at sizes from `FlagSizes` (16, 24, 32, 48, 64, 96, 128). Exception: flags in a picker grid fill their square grid cell (`h-full w-full`), so the row of choices spans the full panel width.
- [SHOULD] Flags have no drop shadow, ring, or border by default. The selected flag in a picker shows a 2px `accent` ring with a 2px `card` offset; unselected picker flags show at 80% opacity. A mosaic flag shows a 2px `accent` ring on hover.
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
- [SHOULD] Page changes animate. The outgoing page fades out and moves up 6px in 140ms; the incoming page fades in from 10px below in 240ms after a 60ms delay. The header carries `view-transition-name: site-header` on every page, so it morphs in place instead of fading. This applies to full page loads between same-origin pages and to route changes inside the React app.
- [SHOULD] After a route change inside the React app, focus moves to the new page `h1` (`tabIndex={-1}`).
- [MUST] Under `prefers-reduced-motion: reduce`, animations and transitions are disabled.

## 5. Available Primitives

Color values live in `website/src/styles/tokens.css` (`--cf-*`, light and dark sets). `website/src/react-app/index.css` exposes them to Tailwind with `@theme inline` and defines the type and motion tokens in `@theme`. Tailwind generates utilities from them (`bg-paper`, `text-ink-2`, `border-rule`, `text-title`). Documentation pages use the `--cf-*` properties directly.

| Role             | Name                                                                                                 | Usage condition                                                   | Status      |
| ---------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ----------- |
| Page background  | `paper`                                                                                              | Page body, header                                                 | Implemented |
| Panel surface    | `card`                                                                                               | Specimen panel, tiles, detail panel                               | Implemented |
| Well surface     | `sunken`                                                                                             | Area behind a large flag, hover fill of rows                      | Implemented |
| Primary text     | `ink`                                                                                                | Headings, primary values                                          | Implemented |
| Secondary text   | `ink-2`                                                                                              | Paragraphs, lede                                                  | Implemented |
| Metadata text    | `ink-3`                                                                                              | Mono labels, counts, Beta status                                  | Implemented |
| Hairline         | `rule`                                                                                               | Section borders, row separators, panel borders                    | Implemented |
| Strong hairline  | `rule-strong`                                                                                        | Secondary button border, hover border                             | Implemented |
| Accent           | `accent`, `accent-soft`                                                                              | Selection, focus, link hover; `accent-soft` fills a selected tile | Implemented |
| Code panel       | `code`, `code-surface`, `code-ink`, `code-muted`, `code-rule`                                        | Dark code panels only                                             | Implemented |
| Display title    | `text-display`                                                                                       | The single `h1` of the landing page                               | Implemented |
| Section title    | `text-title`                                                                                         | `h2` of ruled sections, `h1` of the catalog page                  | Implemented |
| Row heading      | `text-heading`                                                                                       | `h3` in ruled rows and the detail panel                           | Implemented |
| Lede             | `text-lede`                                                                                          | First paragraph under `h1`                                        | Implemented |
| Body             | `text-body`                                                                                          | Paragraphs and row descriptions                                   | Implemented |
| Label            | `text-label` with `font-mono uppercase`                                                              | Section labels, field labels, size captions                       | Implemented |
| Floating shadow  | `shadow-float`                                                                                       | Catalog detail panel only                                         | Implemented |
| Specimen motion  | `animate-specimen-in`                                                                                | Swap of the specimen flag                                         | Implemented |
| Action link      | `LinkButton` (`variant`: `solid`, `ghost`) in `components/ui/LinkButton.tsx`                         | Primary and secondary actions                                     | Implemented |
| Copy control     | `CopyButton` (`text`, `label`, `tone`: `paper`, `code`) in `components/ui/CopyButton.tsx`            | Any copyable command or snippet                                   | Implemented |
| Ruled section    | `RuledSection` (`id`, `title`, `intro`, `children`) in `components/ui/RuledSection.tsx`              | Landing sections after the first viewport                         | Implemented |
| Highlighted code | `HighlightedCode` (`code`, `lang`: `tsx`, `vue`, `svelte`) in `components/ui/HighlightedCode.tsx`    | Code inside dark code panels                                      | Implemented |
| Theme toggle     | `ThemeToggle` in `components/layout/ThemeToggle.tsx`, state from `useTheme()` in `utils/useTheme.ts` | Header only                                                       | Implemented |

Example:

```tsx
<RuledSection id="frameworks" title="Same API in four frameworks." intro="Short paragraph.">
  <table className="w-full text-left">…</table>
</RuledSection>
```

Extension boundary:

- [MUST] Pages use only the token names above. Do not guess unlisted names such as `bg-surface` or `text-muted`.
- [SHOULD] Page-specific CSS is not allowed on React pages. Use Tailwind utilities that combine the tokens. Keyframes and base element styles live only in `index.css`; page transition keyframes live only in `transitions.css`.
- [SHOULD] Documentation styling lives only in `docs.css` and the `expressiveCode` config. It overrides Starlight through `--sl-*` variables first and through documented Starlight class names (`.sl-markdown-content`, `.sidebar-content`, `.starlight-aside`, `.sl-link-card`, `.pagination-links`) second.
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

- Tokens: color values live in `website/src/styles/tokens.css` as `--cf-*` custom properties, with a light set on `:root` and a dark set on `:root[data-theme='dark']`. `website/src/react-app/index.css` maps them to Tailwind names with `@theme inline`. `website/src/styles/docs.css` maps them to Starlight `--sl-color-*` variables.
- Style entry (React pages): `website/src/react-app/index.css`, imported once by `AppEntry.tsx`. It imports Tailwind, `tokens.css`, and `transitions.css`, and holds the type tokens, `@layer base` element styles, and keyframes.
- Style entry (documentation pages): `customCss` in the Starlight config of `website/astro.config.mjs` loads `tokens.css`, `transitions.css`, and `docs.css`. `expressiveCode` in the same config sets the code block theme and colors.
- Page transitions: `website/src/styles/transitions.css` (cross-document opt-in and keyframes). Route changes inside the React app call `document.startViewTransition` in `routing/useSpaPathRouter.ts`.
- Fonts: `fonts` in `website/astro.config.mjs`, emitted by `<Font>` in `website/src/components/HeadMeta.astro` (React pages) and `website/src/components/starlight/DocsHead.astro` (documentation pages).
- Theme: both parts store the choice in `localStorage['starlight-theme']`. On React pages an inline script in `HeadMeta.astro` sets `data-theme` on `<html>` before first paint; `useTheme()` reads and toggles it. On documentation pages Starlight's theme provider does the same. `theme-color` has one value per color scheme (`siteConfig.themeColor`, `siteConfig.themeColorDark`).
- Documentation header: `website/src/components/starlight/DocsHeader.astro`, registered as the Starlight `Header` override. It reuses Starlight `Search` and `ThemeSelect`.
- Components: `website/src/react-app/components/ui/` for primitives, `components/layout/` for header and footer, `components/pages/` for page compositions. Framework names, logos, and status labels come from `utils/frameworks.ts`.
- Flag components: named imports from `@sankyu/react-circle-flags/flags/<code>` for fixed flags; `flagComponentMap` in `components/flag-browser/flagComponent.ts` for full-registry rendering, loaded lazily.

## Glossary

| Concept          | Name in code      |
| ---------------- | ----------------- |
| Specimen panel   | `SpecimenPanel`   |
| Ruled section    | `RuledSection`    |
| Feature explorer | `SpecSection`     |
| Demo panel       | `DemoFrame`       |
| Theme toggle     | `ThemeToggle`     |
| Flag mosaic      | `FlagMosaic`      |
| Copy control     | `CopyButton`      |
| Action link      | `LinkButton`      |
| Code highlighter | `HighlightedCode` |
| Size presets     | `FlagSizes`       |
