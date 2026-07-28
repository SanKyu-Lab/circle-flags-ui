---
editUrl: false
next: false
prev: false
title: "DynamicFlagProps"
---

```ts
type DynamicFlagProps = DynamicFlagPropsBase & object | DynamicFlagPropsBase & object;
```

Defined in: [react/src/dynamic-flag.tsx:22](https://github.com/SanKyu-Lab/circle-flags-ui/blob/main/packages/react/src/dynamic-flag.tsx#L22)

Props for `DynamicFlag`.

When `strict` is `true`, `code` must already be a valid `CountryCode`. Otherwise any string is
accepted and unknown values render the `xx` placeholder.
