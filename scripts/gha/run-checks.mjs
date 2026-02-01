import { Command } from 'commander'
import { spawnSync } from 'node:child_process'

const run = (command, args, env = {}) => {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    env: { ...process.env, ...env },
  })

  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(' ')}`)
  }
}

const program = new Command()
  .name('run-checks')
  .description('Run CI checks for the monorepo.')
  .requiredOption('--check-id <id>', 'format | lint-typecheck | test | build')
  .option('--ensure-generated-clean', 'Fail if generated files changed', false)

program.parse()
const options = program.opts()

switch (options.checkId) {
  case 'format':
    run('pnpm', ['run', 'format:check'])
    break

  case 'lint-typecheck':
    run('pnpm', ['run', 'gen:flags'])
    if (options.ensureGeneratedClean) {
      run('git', ['diff', '--exit-code'])
    }
    run('pnpm', ['run', 'lint'])
    run('pnpm', ['run', 'typecheck'])
    break

  case 'test':
    run('pnpm', ['run', 'gen:flags'])
    run('pnpm', ['run', 'test:coverage'])
    break

  case 'build':
    run('pnpm', ['run', 'build'], { NODE_ENV: 'production' })
    run('ls', ['-la', 'packages/react/dist/'])
    run('ls', ['-la', 'packages/vue/dist/'])
    break

  default:
    throw new Error(`Unknown check-id: ${options.checkId}`)
}
