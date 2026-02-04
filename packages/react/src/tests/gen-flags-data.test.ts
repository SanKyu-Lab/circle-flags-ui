import { readdirSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { COUNTRY_NAMES, SUBDIVISION_NAMES } from '@sankyu/circle-flags-core'
import { describe, expect, it } from 'vitest'

describe('flag metadata coverage', () => {
  it('covers all generated flag codes', () => {
    const subdivisionNames: Record<string, string> = {}
    for (const [code, meta] of Object.entries(SUBDIVISION_NAMES)) {
      subdivisionNames[code] = `${meta.country} - ${meta.region}`
    }

    const allNames: Record<string, string> = {
      ...COUNTRY_NAMES,
      ...subdivisionNames,
    }

    const flagsDir = resolve(__dirname, '../../generated/flags')
    const codes = readdirSync(flagsDir)
      .filter(file => file.endsWith('.tsx') && file !== 'index.ts')
      .map(file => basename(file, '.tsx'))

    const missing = codes.filter(code => !Object.prototype.hasOwnProperty.call(allNames, code))

    expect(missing).toEqual([])
  })
})
