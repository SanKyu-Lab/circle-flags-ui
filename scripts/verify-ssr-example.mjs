import { spawn } from 'node:child_process'

const args = process.argv.slice(2)
const commandSeparator = args.indexOf('--')

if (commandSeparator === -1 || commandSeparator === args.length - 1) {
  throw new Error('Usage: verify-ssr-example --url <url> --expect <text> -- <command> [...args]')
}

const options = args.slice(0, commandSeparator)
const command = args.slice(commandSeparator + 1)
const expected = []
let url

for (let index = 0; index < options.length; index += 1) {
  const option = options[index]
  const value = options[index + 1]

  if ((option === '--url' || option === '--expect') && value === undefined) {
    throw new Error(`${option} requires a value`)
  }

  if (option === '--url') {
    url = value
    index += 1
    continue
  }

  if (option === '--expect') {
    expected.push(value)
    index += 1
    continue
  }

  throw new Error(`Unknown option: ${option}`)
}

if (!url || expected.length === 0) {
  throw new Error('--url and at least one --expect value are required')
}

const target = new URL(url)
const output = []
let childError
const child = spawn(command[0], command.slice(1), {
  stdio: ['ignore', 'pipe', 'pipe'],
  detached: process.platform !== 'win32',
  env: {
    ...process.env,
    HOST: target.hostname,
    PORT: target.port,
    NITRO_HOST: target.hostname,
    NITRO_PORT: target.port,
    NEXT_TELEMETRY_DISABLED: '1',
    NUXT_TELEMETRY_DISABLED: '1',
  },
})
const childClosed = new Promise(resolve => child.once('close', resolve))

const rememberOutput = chunk => {
  output.push(String(chunk))
  if (output.length > 100) output.shift()
}

child.stdout.on('data', rememberOutput)
child.stderr.on('data', rememberOutput)
child.on('error', error => {
  childError = error
})

const delay = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds))
const isChildRunning = () =>
  child.pid !== undefined && child.exitCode === null && child.signalCode === null

const signalServer = signal => {
  if (!isChildRunning()) return

  try {
    if (process.platform === 'win32') {
      child.kill(signal)
      return
    }

    process.kill(-child.pid, signal)
  } catch (error) {
    if (!(error instanceof Error) || !('code' in error) || error.code !== 'ESRCH') throw error
  }
}

const stopServer = async () => {
  signalServer('SIGTERM')
  if (!isChildRunning()) return

  await Promise.race([childClosed, delay(5_000)])
  if (!isChildRunning()) return

  signalServer('SIGKILL')
  await Promise.race([childClosed, delay(1_000)])
}

for (const [signal, exitCode] of [
  ['SIGINT', 130],
  ['SIGTERM', 143],
]) {
  process.once(signal, () => {
    void stopServer().finally(() => process.exit(exitCode))
  })
}

const deadline = Date.now() + 45_000
let lastError

try {
  while (Date.now() < deadline) {
    if (childError) throw childError

    if (child.exitCode !== null || child.signalCode !== null) {
      const status =
        child.exitCode !== null ? `code ${child.exitCode}` : `signal ${child.signalCode}`
      throw new Error(`SSR server exited with ${status}`)
    }

    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const html = await response.text()
      for (const marker of expected) {
        if (!html.includes(marker)) {
          throw new Error(`SSR response did not include expected marker: ${marker}`)
        }
      }

      process.stdout.write(`Verified SSR HTML from ${url}\n`)
      process.exitCode = 0
      break
    } catch (error) {
      lastError = error
      await delay(250)
    }
  }

  if (Date.now() >= deadline) {
    throw lastError ?? new Error(`Timed out waiting for ${url}`)
  }
} catch (error) {
  process.stderr.write(`${output.join('')}\n`)
  throw error
} finally {
  await stopServer()
}
