import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { simpleGit } from 'simple-git'
import { fmt, c } from './lib/format.mjs'
import { collectPackages } from './lib/packages.mjs'
import { checkGitStatus, getChangedPackages } from './lib/git.mjs'
import { bumpVersion, hasPrerelease, isValidVersion } from './lib/version.mjs'
import {
  confirmChanges,
  createInteractive,
  selectBumpType,
  selectPackages,
} from './lib/prompts.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '../..')

const syncInternalDeps = (allPackages, changes) => {
  const versionMap = new Map()

  for (const { package: pkg, newVersion } of changes) {
    versionMap.set(pkg.name, newVersion)
  }

  const syncChanges = []

  for (const pkg of allPackages) {
    const packageJsonPath = pkg.packageJsonPath
    const json = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
    let modified = false

    for (const [depName, depVersion] of Object.entries(json.dependencies || {})) {
      if (!versionMap.has(depName)) continue
      const newVersion = versionMap.get(depName)
      const newDepVersion = `^${newVersion}`
      if (depVersion !== newDepVersion) {
        json.dependencies[depName] = newDepVersion
        modified = true
        syncChanges.push({
          package: pkg.name,
          dependency: depName,
          oldVersion: depVersion,
          newVersion: newDepVersion,
        })
      }
    }

    for (const [depName, depVersion] of Object.entries(json.peerDependencies || {})) {
      if (!versionMap.has(depName)) continue
      const newVersion = versionMap.get(depName)
      const newDepVersion = `^${newVersion}`
      if (depVersion !== newDepVersion) {
        json.peerDependencies[depName] = newDepVersion
        modified = true
        syncChanges.push({
          package: pkg.name,
          dependency: depName,
          oldVersion: depVersion,
          newVersion: newDepVersion,
          isPeer: true,
        })
      }
    }

    if (modified) {
      writeFileSync(packageJsonPath, JSON.stringify(json, null, 2) + '\n')
    }
  }

  return syncChanges
}

const interactiveMode = async (git, options) => {
  const ui = createInteractive()

  try {
    const allPackages = collectPackages(repoRoot)

    if (allPackages.length === 0) {
      console.log(fmt.error('No packages found to bump.'))
      ui.close()
      process.exit(1)
    }

    const gitStatus = await checkGitStatus(git)
    if (!gitStatus.isClean) {
      console.log('')
      console.log(
        fmt.warn(
          `Uncommitted changes detected: ${gitStatus.modified} modified, ${gitStatus.staged} staged, ${gitStatus.untracked} untracked`
        )
      )
    }

    const changedPackages = await getChangedPackages(git, allPackages)

    if (changedPackages.length > 0 && changedPackages.length < allPackages.length) {
      console.log(
        fmt.info(
          `${changedPackages.length}/${allPackages.length} packages have changes since their latest tag`
        )
      )
    }

    const selectedPackages = await selectPackages(ui.rl, allPackages, changedPackages)

    if (selectedPackages.length === 0) {
      console.log(fmt.error('No packages selected.'))
      ui.close()
      process.exit(1)
    }

    const anyPrerelease = selectedPackages.some(p => hasPrerelease(p.version))
    const bumpChoice = await selectBumpType(ui.rl, anyPrerelease)

    const changes = []
    for (const pkg of selectedPackages) {
      const oldVersion = pkg.version
      const newVersion =
        bumpChoice.type === 'custom' ? bumpChoice.version : bumpVersion(oldVersion, bumpChoice.type)
      changes.push({ package: pkg, oldVersion, newVersion })
    }

    const confirmed = await confirmChanges(ui.rl, changes)
    if (!confirmed) {
      console.log(fmt.warn('Aborted by user.'))
      ui.close()
      process.exit(0)
    }

    ui.close()
    return { packages: selectedPackages, changes, allPackages }
  } catch (error) {
    ui.close()
    throw error
  }
}

const nonInteractiveMode = async (git, options) => {
  const allPackages = collectPackages(repoRoot)

  let targetPackages = allPackages
  if (options.packages && options.packages.length > 0) {
    targetPackages = allPackages.filter(
      p => options.packages.includes(p.slug) || options.packages.includes(p.name)
    )
  } else if (options.autoDetect) {
    targetPackages = await getChangedPackages(git, allPackages)
  }

  if (targetPackages.length === 0) {
    console.log(fmt.error('No packages found to bump.'))
    process.exit(1)
  }

  const type = options.type || 'patch'
  if (!['patch', 'minor', 'major', 'prerelease', 'graduate'].includes(type)) {
    console.log(
      fmt.error(`Invalid --type: ${type}. Must be patch, minor, major, prerelease, or graduate.`)
    )
    process.exit(1)
  }

  if (options.versionOverride && !isValidVersion(options.versionOverride)) {
    console.log(fmt.error(`Invalid --version-override: ${options.versionOverride}`))
    process.exit(1)
  }

  const changes = []
  for (const pkg of targetPackages) {
    const oldVersion = pkg.version
    const newVersion = options.versionOverride
      ? options.versionOverride
      : bumpVersion(oldVersion, type)
    changes.push({ package: pkg, oldVersion, newVersion })
  }

  return { packages: targetPackages, changes, allPackages }
}

export const runBumpVersion = async options => {
  const git = simpleGit({ baseDir: repoRoot })

  console.log('')
  console.log(`${c.bold}${c.cyan}🚀 Smart Version Bumper${c.reset}`)
  console.log(fmt.dim('─'.repeat(50)))

  const { changes, allPackages } = options.interactive
    ? await interactiveMode(git, options)
    : await nonInteractiveMode(git, options)

  console.log(fmt.header('📋 Version Bump Summary'))
  console.log(`   ${c.bold}Packages:${c.reset} ${changes.length}`)
  console.log('')

  const maxNameLen = Math.max(...changes.map(ch => ch.package.name.length))
  for (const { package: pkg, oldVersion, newVersion } of changes) {
    const name = pkg.name.padEnd(maxNameLen)
    console.log(
      `   ${fmt.pkg(name)}  ${fmt.version(oldVersion)} ${fmt.arrow()} ${fmt.version(newVersion)}`
    )
  }

  if (options.dryRun) {
    console.log('')
    console.log(fmt.warn('Dry run - no files will be modified.'))
    console.log('')
    return
  }

  console.log(fmt.header('✏️  Updating Files'))

  for (const { package: pkg, newVersion } of changes) {
    const packageJsonPath = pkg.packageJsonPath
    const json = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
    json.version = newVersion
    writeFileSync(packageJsonPath, JSON.stringify(json, null, 2) + '\n')
    console.log(fmt.success(`Updated ${fmt.dim(pkg.dir + '/package.json')}`))
  }

  if (options.syncDeps) {
    console.log(fmt.header('🔗 Syncing Internal Dependencies'))
    const syncChanges = syncInternalDeps(allPackages, changes)

    if (syncChanges.length > 0) {
      for (const sc of syncChanges) {
        const depType = sc.isPeer ? 'peerDep' : 'dep'
        console.log(
          fmt.success(
            `${fmt.pkg(sc.package)} ${fmt.dim(depType + ':')} ${sc.dependency} ${fmt.version(sc.oldVersion)} ${fmt.arrow()} ${fmt.version(sc.newVersion)}`
          )
        )
      }
    } else {
      console.log(fmt.dim('   No internal dependencies to sync.'))
    }
  }

  if (options.commit) {
    console.log(fmt.header('📝 Creating Git Commit'))

    const files = changes.map(ch => ch.package.packageJsonPath)
    if (options.syncDeps) {
      for (const pkg of allPackages) {
        if (!files.includes(pkg.packageJsonPath)) {
          files.push(pkg.packageJsonPath)
        }
      }
    }

    await git.add(files)

    let commitMsg = options.gitMessage
    if (commitMsg === 'chore: bump versions') {
      const pkgNames = changes.map(ch => ch.package.slug).join(', ')
      const versions = [...new Set(changes.map(ch => ch.newVersion))]
      if (versions.length === 1) {
        commitMsg = `chore(release): bump ${pkgNames} to ${versions[0]}`
      } else {
        commitMsg = `chore(release): bump ${pkgNames}`
      }
    }

    await git.commit(commitMsg)
    console.log(fmt.success(`Commit created: ${fmt.dim(commitMsg)}`))
  }

  console.log('')
  console.log(`${c.green}${c.bold}✅ Done!${c.reset}`)
  console.log('')
}
