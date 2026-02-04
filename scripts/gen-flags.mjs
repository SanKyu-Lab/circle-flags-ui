#!/usr/bin/env node
import { isMain } from './lib/is-main.mjs'
import { generateFlags } from './gen-flags/generate.mjs'

if (isMain(import.meta.url)) {
  generateFlags().catch(error => {
    console.error(error)
    process.exitCode = 1
  })
}

export { generateFlags }
