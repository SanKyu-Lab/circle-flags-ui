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

Defined in: [react/src/index.tsx:229](https://github.com/SanKyu-Lab/circle-flags-ui/blob/main/packages/react/src/index.tsx#L229)
