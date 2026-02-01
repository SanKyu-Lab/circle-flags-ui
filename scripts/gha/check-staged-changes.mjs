import { Command } from 'commander'
import { appendFileSync } from 'node:fs'
import { simpleGit } from 'simple-git'

const program = new Command()
  .name('check-staged-changes')
  .description('Stage paths and report whether there are staged changes.')
  .requiredOption('--path <path...>', 'Path(s) to git add (supports globs)')
  .option('--github-output <path>', 'GitHub Actions $GITHUB_OUTPUT path (defaults to env)')

program.parse()
const options = program.opts()

const githubOutput = options.githubOutput ?? process.env.GITHUB_OUTPUT
const writeOutput = (key, value) => {
  if (!githubOutput) return
  appendFileSync(githubOutput, `${key}=${value}\n`, 'utf8')
}

const git = simpleGit()

await git.add(options.path)

const staged = await git.diff(['--staged', '--name-only'])
const changed = Boolean(staged.trim())

writeOutput('changed', changed ? 'true' : 'false')
process.stdout.write(changed ? 'Changes detected.\n' : 'No changes detected.\n')
