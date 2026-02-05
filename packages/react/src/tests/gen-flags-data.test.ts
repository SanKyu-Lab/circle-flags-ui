import { readdirSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import * as core from '@sankyu/circle-flags-core'
import { describe, expect, it } from 'vitest'

describe('core metadata', () => {
  it('FLAG_REGISTRY covers all generated flag codes', () => {
    const flagsDir = resolve(__dirname, '../../generated/flags')
    const codes = readdirSync(flagsDir)
      .filter(file => file.endsWith('.tsx') && file !== 'index.ts')
      .map(file => basename(file, '.tsx'))

    const missing = codes.filter(
      code => !Object.prototype.hasOwnProperty.call(core.FLAG_REGISTRY, code)
    )

    expect(missing).toEqual([])
  })

  it('does not export COUNTRY_NAMES / SUBDIVISION_NAMES', () => {
    expect('COUNTRY_NAMES' in core).toBe(false)
    expect('SUBDIVISION_NAMES' in core).toBe(false)
  })
})
