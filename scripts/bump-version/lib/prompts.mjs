import readline from 'node:readline'
import { fmt, c } from './format.mjs'
import { hasPrerelease, isValidVersion } from './version.mjs'

const createPrompt = () => {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
}

const question = (rl, query) => {
  return new Promise(resolve => {
    rl.question(query, answer => {
      resolve(answer)
    })
  })
}

export const selectPackages = async (rl, packages, changedPackages = []) => {
  console.log(fmt.header('📦 Available Packages'))

  const changedSet = new Set(changedPackages.map(p => p.name))

  for (let i = 0; i < packages.length; i++) {
    const pkg = packages[i]
    const isChanged = changedSet.has(pkg.name)
    const prerelease = hasPrerelease(pkg.version)

    let badges = ''
    if (isChanged) badges += fmt.badge('CHANGED', c.bgYellow)
    if (prerelease) badges += ` ${fmt.badge('PRERELEASE', c.bgBlue)}`

    const line = `   [${c.bold}${i + 1}${c.reset}] ${fmt.pkg(pkg.name)} ${fmt.version(`v${pkg.version}`)} ${badges}`
    console.log(line)
  }

  console.log('')
  console.log(`   [${c.bold}a${c.reset}] All packages`)
  if (changedPackages.length > 0 && changedPackages.length < packages.length) {
    console.log(`   [${c.bold}c${c.reset}] Only changed packages (${changedPackages.length})`)
  }
  console.log(`   [${c.bold}q${c.reset}] Quit`)
  console.log('')

  const answer = await question(rl, `${c.cyan}Select packages${c.reset} (e.g. 1,3,4 or a/c): `)
  const trimmed = String(answer).trim().toLowerCase()

  if (trimmed === 'q') {
    rl.close()
    process.exit(0)
  }

  if (trimmed === 'a') {
    return packages
  }

  if (trimmed === 'c' && changedPackages.length > 0) {
    return changedPackages
  }

  const indices = trimmed
    .split(',')
    .map(s => parseInt(s.trim(), 10) - 1)
    .filter(i => i >= 0 && i < packages.length)

  return indices.map(i => packages[i])
}

export const selectBumpType = async (rl, anyPrerelease = false) => {
  console.log(fmt.header('🔢 Select Bump Type'))

  console.log(`   [${c.bold}1${c.reset}] ${c.green}Patch${c.reset}   ${fmt.dim('1.0.0 → 1.0.1')}`)
  console.log(`   [${c.bold}2${c.reset}] ${c.yellow}Minor${c.reset}   ${fmt.dim('1.0.0 → 1.1.0')}`)
  console.log(`   [${c.bold}3${c.reset}] ${c.red}Major${c.reset}   ${fmt.dim('1.0.0 → 2.0.0')}`)
  console.log(
    `   [${c.bold}4${c.reset}] ${c.blue}Prerelease${c.reset}   ${fmt.dim('1.0.0 → 1.0.1-beta.1')}`
  )
  if (anyPrerelease) {
    console.log(
      `   [${c.bold}5${c.reset}] ${c.magenta}Graduate${c.reset}   ${fmt.dim('1.0.0-beta → 1.0.0 (remove prerelease)')}`
    )
  }
  console.log(
    `   [${c.bold}v${c.reset}] ${c.cyan}Custom${c.reset}   ${fmt.dim('Enter a specific version')}`
  )
  console.log(`   [${c.bold}q${c.reset}] Quit`)
  console.log('')

  const answer = await question(
    rl,
    `${c.cyan}Choose bump type${c.reset} (1-${anyPrerelease ? 5 : 4} or v): `
  )
  const trimmed = String(answer).trim().toLowerCase()

  if (trimmed === 'q') {
    rl.close()
    process.exit(0)
  }

  if (trimmed === 'v') {
    const customVersion = await question(rl, `${c.cyan}Enter custom version${c.reset}: `)
    const v = String(customVersion).trim()
    if (!isValidVersion(v)) {
      console.log(fmt.error(`Invalid version format: ${customVersion}`))
      return selectBumpType(rl, anyPrerelease)
    }
    return { type: 'custom', version: v }
  }

  const choice = parseInt(trimmed, 10)
  switch (choice) {
    case 2:
      return { type: 'minor' }
    case 3:
      return { type: 'major' }
    case 4:
      return { type: 'prerelease' }
    case 5:
      return anyPrerelease ? { type: 'graduate' } : { type: 'patch' }
    case 1:
    default:
      return { type: 'patch' }
  }
}

export const confirmChanges = async (rl, changes) => {
  console.log(fmt.header('📋 Version Bump Preview'))

  const maxNameLen = Math.max(...changes.map(c => c.package.name.length))

  for (const { package: pkg, oldVersion, newVersion } of changes) {
    const name = pkg.name.padEnd(maxNameLen)
    console.log(
      `   ${fmt.pkg(name)}  ${fmt.version(oldVersion)} ${fmt.arrow()} ${fmt.version(newVersion)}`
    )
  }

  console.log('')
  const answer = await question(rl, `${c.yellow}Confirm changes?${c.reset} [Y/n]: `)
  return String(answer).trim().toLowerCase() !== 'n'
}

export const createInteractive = () => {
  const rl = createPrompt()
  return {
    rl,
    close: () => rl.close(),
  }
}
