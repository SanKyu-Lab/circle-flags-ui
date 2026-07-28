---
editUrl: false
next: false
prev: false
title: "FlagUtils"
---

```ts
const FlagUtils: object;
```

Defined in: [react/src/flag-utils.ts:13](https://github.com/SanKyu-Lab/circle-flags-ui/blob/main/packages/react/src/flag-utils.ts#L13)

Framework-neutral helpers for validating, formatting, and sizing flag codes.

## Type Declaration

### formatCountryCode

```ts
formatCountryCode: (code) => string;
```

#### Parameters

##### code

`string`

#### Returns

`string`

### getComponentName

```ts
getComponentName: (code) => string;
```

#### Parameters

##### code

`string`

#### Returns

`string`

### getSizeName

```ts
getSizeName: (pixels) => FlagSizeName | null;
```

#### Parameters

##### pixels

`number`

#### Returns

[`FlagSizeName`](/reference/api/typealiasflagsizename/) \| `null`

### isValidCountryCode

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
