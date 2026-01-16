import { readdirSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { getCountryNameMap } from '../../../../scripts/gen-flags/names'
import { COUNTRY_NAMES, SUBDIVISION_NAMES } from '@sankyu/circle-flags-core'

describe('flag metadata coverage', () => {
  it('covers all generated flag codes', () => {
    const countryNames = getCountryNameMap()
    const allNames = {
      ...countryNames,
      ...Object.keys(SUBDIVISION_NAMES).reduce((acc, key) => {
        acc[key] = `${SUBDIVISION_NAMES[key as keyof typeof SUBDIVISION_NAMES].country} - ${SUBDIVISION_NAMES[key as keyof typeof SUBDIVISION_NAMES].region}`
        return acc
      }, {} as Record<string, string>),
      ...Object.keys(COUNTRY_NAMES).reduce((acc, key) => {
        acc[key] = COUNTRY_NAMES[key as keyof typeof COUNTRY_NAMES]
        return acc
      }, {} as Record<string, string>),
    }

    const flagsDir = resolve(__dirname, '../../generated/flags')
    const codes = readdirSync(flagsDir)
      .filter(file => file.endsWith('.tsx') && file !== 'index.ts')
      .map(file => basename(file, '.tsx'))

    const missing = codes.filter(code => !Object.prototype.hasOwnProperty.call(allNames, code))

    expect(missing).toEqual([])
  })
})
