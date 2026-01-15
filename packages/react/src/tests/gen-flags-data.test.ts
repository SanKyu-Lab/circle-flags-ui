import { readdirSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { getCountryNameMap } from '../../../../scripts/gen-flags/names'

describe('flag metadata coverage', () => {
  it('covers all generated flag codes', () => {
    const names = getCountryNameMap()
    const flagsDir = resolve(__dirname, '../../generated/flags')
    const codes = readdirSync(flagsDir)
      .filter(file => file.endsWith('.tsx') && file !== 'index.ts')
      .map(file => basename(file, '.tsx'))

    const missing = codes.filter(code => !Object.prototype.hasOwnProperty.call(names, code))

    expect(missing).toEqual([])
  })
})
