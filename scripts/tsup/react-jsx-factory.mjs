// Classic JSX factory for the React package build. esbuild imports these names from `react`
// wherever JSX is used, so the published code does not depend on `react/jsx-runtime`.
export { createElement, Fragment } from 'react'
