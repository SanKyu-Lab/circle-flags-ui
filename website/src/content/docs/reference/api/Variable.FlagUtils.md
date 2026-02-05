---
editUrl: false
next: false
prev: false
title: "FlagUtils"
---

```ts
const FlagUtils: {
  formatCountryCode: (code) => string;
  getComponentName: (code) => string;
  getSizeName: (pixels) => FlagSizeName | null;
  isValidCountryCode: (code) => boolean;
  sizes: typeof FlagSizes;
};
```

Defined in: [react/src/flag-utils.ts:12](https://github.com/SanKyu-Lab/circle-flags-ui/blob/main/packages/react/src/flag-utils.ts#L12)

## Type Declaration

### formatCountryCode()

```ts
formatCountryCode: (code) => string;
```

#### Parameters

##### code

`string`

#### Returns

`string`

### getComponentName()

```ts
getComponentName: (code) => string;
```

#### Parameters

##### code

`string`

#### Returns

`string`

### getSizeName()

```ts
getSizeName: (pixels) => FlagSizeName | null;
```

#### Parameters

##### pixels

`number`

#### Returns

`FlagSizeName` \| `null`

### isValidCountryCode()

```ts
isValidCountryCode: (code) => boolean;
```

#### Parameters

##### code

`string`

#### Returns

`boolean`

### sizes

```ts
sizes: typeof FlagSizes;
```
