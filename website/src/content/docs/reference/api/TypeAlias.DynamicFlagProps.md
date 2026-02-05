---
editUrl: false
next: false
prev: false
title: "DynamicFlagProps"
---

```ts
type DynamicFlagProps = 
  | DynamicFlagPropsBase & {
  code: string;
  strict?: false;
}
  | DynamicFlagPropsBase & {
  code: CountryCode;
  strict: true;
};
```

Defined in: [react/src/dynamic-flag.tsx:15](https://github.com/SanKyu-Lab/circle-flags-ui/blob/main/packages/react/src/dynamic-flag.tsx#L15)
