---
editUrl: false
next: false
prev: false
title: "CircleFlagProps"
---

Defined in: [react/src/index.tsx:75](https://github.com/SanKyu-Lab/circle-flags-ui/blob/main/packages/react/src/index.tsx#L75)

:::caution[Deprecated]
`CircleFlag` is deprecated and not recommended for new code.

It fetches SVG at runtime and renders a wrapper with injected SVG HTML, so many SVG-only props won’t apply.

Prefer `named imports` or `DynamicFlag` instead.

Read more: https://react-circle-flags.js.org/docs/deprecated/circleflag
:::

## Extends

- `Omit`\<[`FlagComponentProps`](/reference/api/interfaceflagcomponentprops/), `"title"`\>

## Properties

### ~~cdnUrl?~~

```ts
optional cdnUrl: string;
```

Defined in: [react/src/index.tsx:79](https://github.com/SanKyu-Lab/circle-flags-ui/blob/main/packages/react/src/index.tsx#L79)

***

### ~~code?~~

```ts
optional code: string;
```

Defined in: [react/src/index.tsx:78](https://github.com/SanKyu-Lab/circle-flags-ui/blob/main/packages/react/src/index.tsx#L78)

:::caution[Deprecated]
Use 'countryCode' instead
:::

***

### ~~countryCode?~~

```ts
optional countryCode: string;
```

Defined in: [react/src/index.tsx:76](https://github.com/SanKyu-Lab/circle-flags-ui/blob/main/packages/react/src/index.tsx#L76)

***

### ~~title?~~

```ts
optional title: string;
```

Defined in: [react/src/index.tsx:80](https://github.com/SanKyu-Lab/circle-flags-ui/blob/main/packages/react/src/index.tsx#L80)
