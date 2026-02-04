import { readFileSync } from 'node:fs'

const readJson = url => JSON.parse(readFileSync(url, 'utf8'))

const isoEntries = readJson(new URL('./libs/iso-3166.json', import.meta.url))
const otherNames = readJson(new URL('./libs/others.json', import.meta.url))

const isoNameMap = isoEntries.reduce((acc, entry) => {
  const code = String(entry.alpha2).toLowerCase()
  acc[code] = entry.name
  return acc
}, {})

const otherNameMap = otherNames.reduce((acc, entry) => {
  const code = String(entry.alpha2).toLowerCase()
  acc[code] = entry.name
  return acc
}, {})

const stringMap = {
  ...isoNameMap,
  ...otherNameMap,
}

export const getString = code => {
  const codeLower = String(code).toLowerCase()
  return stringMap[codeLower] || String(code).toUpperCase()
}

export const getStringMap = () => stringMap

export const getCountryNameMap = () => stringMap

export const getCountryName = code => getString(code)
