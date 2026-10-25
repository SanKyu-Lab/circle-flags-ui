<div align="center">
  <a href="https://react-circle-flags.js.org/">
    <img src="https://raw.githubusercontent.com/SanKyu-Lab/circle-flags-ui/main/.github/assets/favicon.svg" alt="@sankyu/vue-circle-flags" width="120" height="120" />
  </a>
</div>

<div align="center">

# @sankyu/vue-circle-flags

[![npm 版本](https://img.shields.io/npm/v/%40sankyu%2Fvue-circle-flags?style=flat-square&label=%40sankyu%2Fvue-circle-flags)](https://www.npmjs.com/package/@sankyu/vue-circle-flags) [![打包大小](https://img.shields.io/bundlephobia/minzip/@sankyu/vue-circle-flags?style=flat-square&label=打包大小)](https://bundlephobia.com/package/@sankyu/vue-circle-flags) [![npm 下载量](https://img.shields.io/npm/dm/@sankyu/vue-circle-flags.svg?style=flat-square&label=NPM%20下载量)](https://www.npmjs.com/package/@sankyu/vue-circle-flags) [![最后提交](https://img.shields.io/github/last-commit/SanKyu-Lab/circle-flags-ui?style=flat-square&label=最后提交)](https://github.com/SanKyu-Lab/circle-flags-ui/commits/main)

<!-- CI/CD 与质量 -->

[![CI](https://github.com/SanKyu-Lab/circle-flags-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/SanKyu-Lab/circle-flags-ui/actions/workflows/ci.yml) [![发布](https://github.com/SanKyu-Lab/circle-flags-ui/actions/workflows/release.yml/badge.svg)](https://github.com/SanKyu-Lab/circle-flags-ui/actions/workflows/release.yml) [![codecov](https://codecov.io/gh/SanKyu-Lab/circle-flags-ui/branch/main/graph/badge.svg)](https://codecov.io/gh/SanKyu-Lab/circle-flags-ui)

[![支持 TypeScript](https://img.shields.io/badge/TypeScript-支持-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/) [![Tree-shakable](https://badgen.net/bundlephobia/tree-shaking/@sankyu/vue-circle-flags)](https://bundlephobia.com/package/@sankyu/vue-circle-flags) [![MIT 许可证](https://img.shields.io/badge/许可证-MIT-green?style=flat-square&logo=opensourceinitiative)](./LICENSE)

---

简体中文 | [English Version](./README.md)

:star: **在 [GitHub](https://github.com/Sankyu-Lab/circle-flags-ui) 上 Star 我们** | :bug: **在此 [提交问题](https://github.com/Sankyu-Lab/circle-flags-ui/issues)**

:rocket: **探索 [演示图库](https://react-circle-flags.js.org/browse)** | :book: **[阅读文档](https://react-circle-flags.js.org/docs/guides/getting-started/)**

</div>

---

## 📖 概述

本库为 Vue 3 提供 **400+ 个圆形 SVG 国旗组件**，具备 **完整的 TypeScript 支持** 以及 **Tree-shaking 优化**。

专为需要快速、清晰显示国旗且无需外部图片请求的应用而设计。

## :world_map: 在线演示

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/SanKyu-Lab/circle-flags-ui/tree/main/examples/example-vue?file=src%2FApp.vue&terminal=dev)

## ✨ 核心特性

> [!TIP]
> 欲了解更多信息，请参阅 [文档](https://react-circle-flags.js.org/docs/guides/getting-started/#-key-features)。

- 🎯 **支持 Tree-shaking 优化** - 仅打包您使用的国旗
- 📦 **TypeScript** - 包含完整的类型定义
- ⚡ **零依赖** - 仅需 Vue 3 作为对等依赖
- 🎨 **内联 SVG** - 无需外部请求，支持离线使用
- 🔧 **完全可定制** - 支持所有标准 SVG 属性
- 📱 **SSR 兼容** - 适用于 `Nuxt.js`、`Quasar` 等框架
- 🪶 **轻量级** - 每个国旗约 1KB

## 📦 安装

```bash
npm install @sankyu/vue-circle-flags
# 或
pnpm add @sankyu/vue-circle-flags
# 或
yarn add @sankyu/vue-circle-flags
# 或
bun add @sankyu/vue-circle-flags
```

> [!TIP]
> 欲了解更多信息，请参阅 [安装指南](https://react-circle-flags.js.org/docs/guides/getting-started/installation/)。

### 🤖 正在 Vibe Coding?

<details>
<summary>AI Agent 提示词</summary>

```txt
你是一位资深 Web 开发专家。请参考文档：https://react-circle-flags.js.org/llms.txt

1. **项目审计**：检查我项目中的国旗图标使用情况，找出：
   - 指向 `HatScripts/circle-flags` 的原始 `<img>` 标签。
   - 旧版 `react-circle-flags` 第三方库的使用。
2. **迁移建议**：根据我当前的框架（React/Vue/Solid），提供向 `@sankyu/{framework}-circle-flags` 家族库迁移的方案。
3. **极致优化**：根据文档规范，将通用的 `CircleFlag` 组件或原始 `<img>` 标签替换为**具名导入**（例如 `import { FlagUs, FlagDe } from '...'`），以确保 Tree-shaking 达到最小 Bundle 体积。
```

</details>

## 🚀 使用

### 导入单个国旗（推荐）

```vue
<script setup lang="ts">
import { FlagUs, FlagCn, FlagGb } from '@sankyu/vue-circle-flags'
</script>

<template>
  <div>
    <FlagUs :width="48" :height="48" />
    <FlagCn :width="48" :height="48" />
    <FlagGb :width="48" :height="48" />
  </div>
</template>
```

### 使用 `FlagSizes` 预设

```vue
<script setup lang="ts">
import { FlagJp, FlagDe, FlagFr, FlagSizes } from '@sankyu/vue-circle-flags'
</script>

<template>
  <div>
    <FlagJp :width="FlagSizes.sm" :height="FlagSizes.sm" />
    <!-- 24px -->
    <FlagDe :width="FlagSizes.md" :height="FlagSizes.md" />
    <!-- 32px -->
    <FlagFr :width="FlagSizes.lg" :height="FlagSizes.lg" />
    <!-- 48px -->
  </div>
</template>
```

### 动态选择国旗

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DynamicFlag } from '@sankyu/vue-circle-flags'

const countryCode = ref('us')
</script>

<template>
  <DynamicFlag :code="countryCode" :width="48" :height="48" />
</template>
```

> [!CAUTION]
> `DynamicFlag` 适合离线优先且需要同步渲染运行时代码的场景，但会打包全部 400+ 国旗
> （约 ~600 KB，无法 tree-shaking）。若代码集合有限，优先使用具名导入或“具名导入 + map”。

### 其他使用示例

> [!TIP]
> 欲了解更多信息，请参阅 [使用指南](https://react-circle-flags.js.org/docs/guides/getting-started/usage/)。

## 📚 API

### 属性

| 属性        | 类型               | 默认值 | 描述                |
| ----------- | ------------------ | ------ | ------------------- |
| `width`     | `number \| string` | `48`   | 国旗宽度            |
| `height`    | `number \| string` | `48`   | 国旗高度            |
| `title`     | `string`           | code   | SVG 的无障碍标题    |
| `class`     | `string`           | -      | Vue 标准 class 绑定 |
| `className` | `string`           | -      | 可选 className 别名 |

### 尺寸预设

| 尺寸   | 像素  |
| ------ | ----- |
| `xs`   | 16px  |
| `sm`   | 24px  |
| `md`   | 32px  |
| `lg`   | 48px  |
| `xl`   | 64px  |
| `xxl`  | 96px  |
| `xxxl` | 128px |

### 构建元信息

您可以通过 `buildMeta` 导出项访问库的构建元信息：

```vue
<script setup lang="ts">
import { buildMeta } from '@sankyu/vue-circle-flags'

console.log(buildMeta.version) // 例如："0.0.1"
console.log(buildMeta.builtTimestamp) // 例如：1760000000000
console.log(buildMeta.commitHash) // 例如：<示例-sha256-哈希值>
console.log(buildMeta.circleFlagsCommitHash) // 例如：<示例-sha256-哈希值>
</script>
```

### 可用的国旗

每个国旗均按 `Flag{帕斯卡命名法 ISO_CODE}` 模式导出（例如 `FlagUs`、`FlagCn`）。为常见的双字母代码提供了便捷别名：`FlagUs`、`FlagCn`、`FlagGb`、`FlagJp`。

- `FlagUs` - 美国
- `FlagCn` - 中国
- `FlagGb` - 英国
- `FlagJp` - 日本
- ... 以及更多

请在图库中查看 [国旗完整列表](https://react-circle-flags.js.org/browse)。

## 🎨 样式

国旗组件接受所有标准 SVG 属性，可使用 Vue 的 class 和 style 绑定轻松设置样式。

> [!TIP]
> 欲了解更多信息，请参阅 [样式指南](https://react-circle-flags.js.org/docs/guides/getting-started/styling/)。

```vue
<script setup lang="ts">
import { FlagUs } from '@sankyu/vue-circle-flags'
</script>

<template>
  <!-- 使用 class -->
  <FlagUs class="rounded-full shadow-lg hover:scale-110 transition-transform" />

  <!-- 使用内联样式 -->
  <FlagUs :style="{ filter: 'grayscale(100%)' }" />

  <!-- 自定义属性 -->
  <FlagUs aria-label="美国国旗" role="img" />
</template>
```

## 🔧 TypeScript

所有国旗组件均使用 TypeScript 完全类型化，开箱即用提供自动完成和类型安全。

> [!TIP]
> 欲了解更多信息，请参阅 [TypeScript 指南](https://react-circle-flags.js.org/docs/guides/getting-started/typescript/)。

```typescript
import type { FlagComponentProps, FlagCode } from '@sankyu/vue-circle-flags'

// FlagCode 是所有有效国旗代码的联合类型
const code: FlagCode = 'us' // ✓ 有效
const invalid: FlagCode = 'xyz' // ✗ 类型错误
```

## 📦 打包大小与 Tree-shaking 优化

`@sankyu/vue-circle-flags` 专为 Tree-shaking 优化而设计。

导入单个国旗可确保只有使用到的国旗被包含在您的打包文件中。

> [!TIP]
> 欲了解更多信息，请参阅 [打包大小与 Tree-shaking 优化指南](https://react-circle-flags.js.org/docs/guides/getting-started/bundle-size/)。

```vue
<script setup lang="ts">
// ✓ 推荐 - 仅打包 FlagUs 和 FlagCn
import { FlagUs, FlagCn } from '@sankyu/vue-circle-flags'
</script>
```

## 🤝 贡献

请参阅 [CONTRIBUTING.md](https://github.com/SanKyu-Lab/circle-flags-ui/blob/main/CONTRIBUTING.md) 了解贡献指南。

## 📄 许可证

`@sankyu/vue-circle-flags` 基于 MIT 许可证授权，© [Sankyu Lab](https://github.com/Sankyu-Lab)

## 🙏 致谢

- 国旗设计源自 [HatScripts/circle-flags](https://github.com/HatScripts/circle-flags)
- 使用 [tsup](https://github.com/egoist/tsup) 构建
