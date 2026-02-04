import { Command } from 'commander'
import { runBumpVersion } from './bump-version/run.mjs'
import { fmt } from './bump-version/lib/format.mjs'

const program = new Command()
  .name('bump-version')
  .description('Smart version bumper for monorepo packages 🚀')
  .option('--no-interactive', 'Run in non-interactive mode')
  .option('--type <type>', 'Version bump type: patch, minor, major, prerelease, or graduate')
  .option('--packages <pkgs...>', 'Package slugs or names to bump')
  .option('--dry-run', 'Show what would be changed without writing files')
  .option('--commit', 'Create a git commit after bumping')
  .option('--git-message <msg>', 'Git commit message', 'chore: bump versions')
  .option('--auto-detect', 'Auto-detect packages with changes since last tag')
  .option('--sync-deps', 'Sync internal dependency versions after bump')
  .option('--version-override <ver>', 'Set exact version (non-interactive only)')
  .parse(process.argv.filter(arg => arg !== '--'))

const options = program.opts()

runBumpVersion(options).catch(err => {
  console.error(fmt.error(`Error: ${err.message}`))
  process.exit(1)
})
