<div align="center">
  <a href="https://react-circle-flags.js.org/">
    <img src="https://raw.githubusercontent.com/SanKyu-Lab/react-circle-flags/main/.github/assets/favicon.svg" alt="@sankyu/react-circle-flags" width="120" height="120" />
  </a>
</div>

<div align="center">

# @sankyu/react-circle-flags

[![npm 版本](https://img.shields.io/npm/v/%40sankyu%2Freact-circle-flags?style=flat-square&label=%40sankyu%2Freact-circle-flags)](https://www.npmjs.com/package/@sankyu/react-circle-flags) [![打包大小](https://img.shields.io/bundlephobia/minzip/@sankyu/react-circle-flags?style=flat-square&label=打包大小)](https://bundlephobia.com/package/@sankyu/react-circle-flags) [![npm 下载量](https://img.shields.io/npm/dm/@sankyu/react-circle-flags.svg?style=flat-square&label=NPM%20下载量)](https://www.npmjs.com/package/@sankyu/react-circle-flags) [![最后提交](https://img.shields.io/github/last-commit/SanKyu-Lab/react-circle-flags?style=flat-square&label=最后提交)](https://github.com/SanKyu-Lab/react-circle-flags/commits/main)

<!-- CI/CD 与质量 -->

[![CI](https://github.com/SanKyu-Lab/react-circle-flags/actions/workflows/ci.yml/badge.svg)](https://github.com/SanKyu-Lab/react-circle-flags/actions/workflows/ci.yml) [![发布](https://github.com/SanKyu-Lab/react-circle-flags/actions/workflows/release.yml/badge.svg)](https://github.com/SanKyu-Lab/react-circle-flags/actions/workflows/release.yml) [![codecov](https://codecov.io/gh/SanKyu-Lab/react-circle-flags/branch/main/graph/badge.svg?token=YHZ46T51AG)](https://codecov.io/gh/SanKyu-Lab/react-circle-flags)

[![支持 TypeScript](https://img.shields.io/badge/TypeScript-支持-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/) [![Tree-shakable](https://badgen.net/bundlephobia/tree-shaking/@sankyu/react-circle-flags)](https://bundlephobia.com/package/@sankyu/react-circle-flags) [![MIT 许可证](https://img.shields.io/badge/许可证-MIT-green?style=flat-square&logo=opensourceinitiative)](./LICENSE)

---

简体中文 | [English Version](./README.md)

:star: **在 [GitHub](https://github.com/Sankyu-Lab/react-circle-flags) 上 Star 我们** | :bug: **在此 [提交问题](https://github.com/Sankyu-Lab/react-circle-flags/issues)**

:rocket: **探索 [演示图库](https://react-circle-flags.js.org/browse)** | :book: **[阅读文档](https://react-circle-flags.js.org/docs/guides/getting-started/)**

</div>

---

## 📖 概述

本库提供 **400+ 个圆形 SVG 国旗组件**，具备 **完整的 TypeScript 支持** 以及 **Tree-shaking 优化**。

专为需要快速、清晰显示国旗且无需外部图片请求的应用而设计。

## :world_map: 在线演示

[![在 CodeSandbox 中编辑 react-circle-flags-demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/sandbox/nyy6vp) [![在 StackBlitz 中打开](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/edit/react-circle-flags?file=src%2FApp.tsx&terminal=dev)

## ✨ 核心特性

> [!TIP]
> 欲了解更多信息，请参阅 [文档](https://react-circle-flags.js.org/docs/guides/getting-started/#-key-features)。

- 🎯 **支持 Tree-shaking 优化** - 仅打包您使用的国旗
- 📦 **TypeScript** - 包含完整的类型定义
- ⚡ **零依赖** - 仅需 React 作为对等依赖
- 🎨 **内联 SVG** - 无需外部请求，支持离线使用
- 🔧 **完全可定制** - 支持所有标准 SVG 属性
- 📱 **SSR 兼容** - 适用于 `Next.js`、`Remix` 等框架
- 🪶 **轻量级** - 每个国旗约 1KB

## 📦 安装

```bash
npm install @sankyu/react-circle-flags
# 或
pnpm add @sankyu/react-circle-flags
# 或
yarn add @sankyu/react-circle-flags
# 或
bun add @sankyu/react-circle-flags
```

> [!TIP]
> 欲了解更多信息，请参阅 [安装指南](https://react-circle-flags.js.org/docs/guides/getting-started/installation/)。

## 🚀 使用

### 导入单个国旗（推荐）

```tsx
import { FlagUs, FlagCn, FlagGb } from '@sankyu/react-circle-flags'

export default function App() {
  return (
    <div>
      <FlagUs width={48} height={48} />
      <FlagCn width={48} height={48} />
      <FlagGb width={48} height={48} />
    </div>
  )
}
```

### 其他使用示例

> [!TIP]
> 欲了解更多信息，请参阅 [使用指南](https://react-circle-flags.js.org/docs/guides/getting-started/usage/)。

## 📚 API

### 构建元信息

您可以通过 `buildMeta` 导出项访问库的构建元信息：

```tsx
import { buildMeta } from '@sankyu/react-circle-flags'

console.log(buildMeta.version) // 例如："1.2.3"
console.log(buildMeta.builtTimestamp) // 例如：1760000000000
console.log(buildMeta.commitHash) // 例如：<示例-sha256-哈希值>
console.log(buildMeta.circleFlagsCommitHash) // 例如：<示例-sha256-哈希值>
```

### 其他属性

...欲了解更多信息，请参阅 [API 参考](https://react-circle-flags.js.org/reference/api/interfaceflagcomponentprops/)。

### 可用的国旗

每个国旗均按 `Flag{帕斯卡命名法 ISO_CODE}` 模式导出（例如 `FlagUs`、`FlagCn`）。为常见的双字母代码提供了便捷别名：`FlagUs`、`FlagCn`、`FlagGb`、`FlagJp`。

- `FlagUs` - 美国
- `FlagCn` - 中国
- `FlagGb` - 英国
- `FlagJp` - 日本
- ... 以及更多

请在 react-circle-flags 图库中查看 [国旗完整列表](https://react-circle-flags.js.org/browse)。

## 🎨 样式

国旗组件接受所有标准 SVG 属性，因此可使用任何 CSS 方法轻松设置样式。

> [!TIP]
> 欲了解更多信息，请参阅 [样式指南](https://react-circle-flags.js.org/docs/guides/getting-started/styling/)。

## 🔧 TypeScript

所有国旗组件均使用 TypeScript 完全类型化，开箱即用提供自动完成和类型安全。

> [!TIP]
> 欲了解更多信息，请参阅 [TypeScript 指南](https://react-circle-flags.js.org/docs/guides/getting-started/typescript/)。

## 📖 示例

> [!TIP]
> 欲了解更多信息，请参阅 [指南 - 基础用法](https://react-circle-flags.js.org/docs/guides/getting-started/usage/)。

## 📦 打包大小与 Tree-shaking 优化

`@sankyu/react-circle-flags` 专为 Tree-shaking 优化而设计。

导入单个国旗可确保只有使用到的国旗被包含在您的打包文件中。

> [!TIP]
> 欲了解更多信息，请参阅 [打包大小与 Tree-shaking 优化指南](https://react-circle-flags.js.org/docs/guides/getting-started/bundle-size/)。

## 🤝 贡献

请参阅 [CONTRIBUTING.md](CONTRIBUTING.md) 了解贡献指南。

## 📄 许可证

`@sankyu/react-circle-flags` 基于 MIT 许可证授权，© [Sankyu Lab](https://github.com/Sankyu-Lab)

[官网](./website/) 基于 GPL-3.0 许可证授权，© [Sankyu Lab](https://github.com/Sankyu-Lab)

## 🙏 致谢

- 国旗设计源自 [HatScripts/circle-flags](https://github.com/HatScripts/circle-flags)
- 使用 [tsup](https://github.com/egoist/tsup) 构建
