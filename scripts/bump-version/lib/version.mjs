import { inc, parse, valid } from 'semver'

export const isValidVersion = version => Boolean(valid(version))

const getPrerelease = parsed => {
  const tag = typeof parsed.prerelease?.[0] === 'string' ? parsed.prerelease[0] : null
  const num = typeof parsed.prerelease?.[1] === 'number' ? parsed.prerelease[1] : null
  return { tag, num }
}

/**
 * Bump version with prerelease handling compatible with the old script.
 * Types: patch, minor, major, prerelease, graduate
 */
export const bumpVersion = (version, type, prereleaseTag = 'beta') => {
  const parsed = parse(version)
  if (!parsed) return version

  const stable = `${parsed.major}.${parsed.minor}.${parsed.patch}`
  const { tag: existingTag, num: existingNum } = getPrerelease(parsed)

  switch (type) {
    case 'major':
      return inc(version, 'major') ?? version
    case 'minor':
      return inc(version, 'minor') ?? version
    case 'patch': {
      if (existingTag) {
        const nextPatch = inc(stable, 'patch') ?? stable
        if (existingNum === null) return `${nextPatch}-${existingTag}`
        return `${nextPatch}-${existingTag}.${existingNum + 1}`
      }
      return inc(version, 'patch') ?? version
    }
    case 'prerelease': {
      if (existingTag) {
        if (existingNum === null) return `${stable}-${existingTag}.1`
        return `${stable}-${existingTag}.${existingNum + 1}`
      }
      const nextPatch = inc(version, 'patch') ?? stable
      return `${nextPatch}-${prereleaseTag}.1`
    }
    case 'graduate':
      return stable
    default:
      return inc(version, 'patch') ?? version
  }
}

export const hasPrerelease = version => {
  const parsed = parse(version)
  return Boolean(parsed?.prerelease?.length)
}
