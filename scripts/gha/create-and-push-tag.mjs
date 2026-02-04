import { Command } from 'commander'
import { simpleGit } from 'simple-git'
import { appendFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { resolve } from 'node:path'

const program = new Command()
  .name('create-and-push-tag')
  .description('Create an annotated git tag and push it to origin.')
  .requiredOption('--tag <tag>', 'Tag name')
  .requiredOption('--message <message>', 'Annotated tag message')
  .option('--github-output <path>', 'GitHub Actions $GITHUB_OUTPUT path (defaults to env)')

program.parse()
const options = program.opts()

const githubOutput = options.githubOutput ?? process.env.GITHUB_OUTPUT
const writeOutput = (key, value) => {
  if (!githubOutput) return
  appendFileSync(githubOutput, `${key}=${value}\n`, 'utf8')
}

const git = simpleGit()

await git.addConfig('user.name', 'github-actions[bot]')
await git.addConfig('user.email', 'github-actions[bot]@users.noreply.github.com')

const tag = options.tag
const message = options.message

let exists = false
try {
  await git.raw(['rev-parse', tag])
  exists = true
} catch {
  exists = false
}

if (exists) {
  process.stdout.write(`Tag already exists: ${tag}\n`)
  writeOutput('created', 'false')
  process.exit(0)
}

await git.raw(['tag', '-a', tag, '-m', message])

// Format CHANGELOG.md files before push to avoid pre-push hook failures
try {
  const repoRoot = resolve(process.cwd())
  const prettierPath = resolve(repoRoot, 'node_modules', '.bin', 'prettier')
  execSync(`"${prettierPath}" --write packages/*/CHANGELOG.md`, {
    cwd: repoRoot,
    stdio: 'pipe',
  })
  // Stage the formatted CHANGELOG.md files
  await git.add(['packages/*/CHANGELOG.md'])
} catch {
  // Prettier not found or no CHANGELOG.md files, continue
}

await git.raw(['push', 'origin', tag])

process.stdout.write(`Tag created and pushed: ${tag}\n`)
writeOutput('created', 'true')
