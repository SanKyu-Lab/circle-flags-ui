---
editUrl: false
next: false
prev: false
title: "CircleFlagProps"
---

Defined in: [react/src/circle-flag.tsx:62](https://github.com/SanKyu-Lab/circle-flags-ui/blob/main/packages/react/src/circle-flag.tsx#L62)

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

Defined in: [react/src/circle-flag.tsx:66](https://github.com/SanKyu-Lab/circle-flags-ui/blob/main/packages/react/src/circle-flag.tsx#L66)

***

### ~~code?~~

```ts
optional code: string;
```

Defined in: [react/src/circle-flag.tsx:65](https://github.com/SanKyu-Lab/circle-flags-ui/blob/main/packages/react/src/circle-flag.tsx#L65)

:::caution[Deprecated]
Use 'countryCode' instead
:::

***

### ~~countryCode?~~

```ts
optional countryCode: string;
```

Defined in: [react/src/circle-flag.tsx:63](https://github.com/SanKyu-Lab/circle-flags-ui/blob/main/packages/react/src/circle-flag.tsx#L63)

***

### ~~title?~~

```ts
optional title: string;
```

Defined in: [react/src/circle-flag.tsx:67](https://github.com/SanKyu-Lab/circle-flags-ui/blob/main/packages/react/src/circle-flag.tsx#L67)
