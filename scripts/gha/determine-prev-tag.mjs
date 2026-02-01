import { Command } from 'commander'
import { simpleGit } from 'simple-git'
import { appendFileSync } from 'node:fs'

const program = new Command()
  .name('determine-prev-tag')
  .description('Determine previous tag for a given package slug.')
  .requiredOption('--slug <slug>', 'Package slug, used for tag prefix `${slug}-v*`')
  .option('--current-tag <tag>', 'Current tag to exclude from candidates')
  .option('--github-output <path>', 'GitHub Actions $GITHUB_OUTPUT path (defaults to env)')

program.parse()
const options = program.opts()

const githubOutput = options.githubOutput ?? process.env.GITHUB_OUTPUT
const writeOutput = (key, value) => {
  if (!githubOutput) return
  appendFileSync(githubOutput, `${key}=${value}\n`, 'utf8')
}

const git = simpleGit()

const slug = options.slug
const currentTag = options.currentTag ?? ''
const tagsRaw = (await git.raw(['tag', '--list', `${slug}-v*`, '--sort=-v:refname'])).trim()
const tags = tagsRaw ? tagsRaw.split('\n').filter(Boolean) : []

const prevTag = tags.find(tag => tag !== currentTag) ?? ''
writeOutput('prev_tag', prevTag)
process.stdout.write(`prev_tag=${prevTag || '(none)'}\n`)
