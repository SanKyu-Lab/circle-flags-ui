import { Command } from 'commander'
import { appendFileSync } from 'node:fs'
import { simpleGit } from 'simple-git'

const program = new Command()
  .name('stage-commit-push')
  .description('Stage paths, commit if changed, and push.')
  .requiredOption('--message <message>', 'Commit message')
  .option('--path <path...>', 'Path(s) to git add (supports globs)')
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

const paths = options.path?.length ? options.path : []
if (!paths.length) {
  throw new Error('Missing --path (at least one)')
}

await git.add(paths)

const staged = await git.diff(['--staged', '--name-only'])
if (!staged.trim()) {
  process.stdout.write('No staged changes.\n')
  writeOutput('committed', 'false')
  process.exit(0)
}

await git.commit(options.message)
await git.push()
writeOutput('committed', 'true')
