// Builds an example app, starts its production server and checks it in Chromium.
import { spawn } from 'node:child_process'
import { createWriteStream } from 'node:fs'
import { check, record } from './report.mjs'
import { run } from './project.mjs'

const delay = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds))

const startServer = ({ command, cwd, port, log }) => {
  const output = createWriteStream(log, { flags: 'a' })
  const child = spawn(command[0], command.slice(1), {
    cwd,
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: {
      ...process.env,
      HOST: '127.0.0.1',
      PORT: String(port),
      NITRO_HOST: '127.0.0.1',
      NITRO_PORT: String(port),
      NODE_ENV: 'production',
    },
  })
  child.stdout.pipe(output)
  child.stderr.pipe(output)
  const stop = async () => {
    if (child.exitCode !== null) return
    process.kill(-child.pid, 'SIGTERM')
    await new Promise(resolve => child.once('close', resolve))
  }
  return { child, stop }
}

const waitForServer = async (url, child) => {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`server exited with code ${child.exitCode}`)
    const response = await fetch(url, { signal: AbortSignal.timeout(2000) }).catch(() => undefined)
    if (response?.ok) return response.text()
    await delay(500)
  }
  throw new Error(`server did not answer at ${url}`)
}

// Collects console errors, uncaught exceptions and hydration warnings. Requests that leave
// 127.0.0.1 (logos on raw.githubusercontent.com and similar) get an empty response, so the
// check does not depend on the network.
const openPage = async (browser, url) => {
  const page = await browser.newPage()
  const problems = []
  await page.route(
    url => url.hostname !== '127.0.0.1',
    route => route.fulfill({ status: 204, body: '' })
  )
  page.on('console', message => {
    const text = message.text()
    if (message.type() === 'error' || /hydrat|mismatch/i.test(text)) {
      problems.push(`${message.type()}: ${text.slice(0, 200)}`)
    }
  })
  page.on('pageerror', error => problems.push(`pageerror: ${error.message.slice(0, 200)}`))
  await page.goto(url, { waitUntil: 'networkidle' })
  return { page, problems }
}

const countRenderedFlags = page =>
  page.evaluate(() => document.querySelectorAll('svg[role="img"]').length)

export const checkApp = async ({ app, dir, port, log, browser }) => {
  const id = app.id
  const build = run('pnpm', ['run', 'build'], { cwd: dir, log, env: { NODE_ENV: 'production' } })
  record({
    id: `${id}/build`,
    title: 'production build',
    expected: 'exit 0',
    actual: `exit ${build.status}`,
    pass: build.status === 0,
  })
  if (build.status !== 0) return

  const url = `http://127.0.0.1:${port}${app.path ?? '/'}`
  const server = startServer({ command: app.start(port), cwd: dir, port, log })
  try {
    const html = await waitForServer(url, server.child)

    if (app.ssr) {
      await check(
        { id: `${id}/ssr`, title: 'first HTML response', expected: app.ssr.description },
        async () => {
          const svgCount = (html.match(/<svg/g) ?? []).length
          const missing = app.ssr.contains.filter(text => !html.includes(text))
          return {
            actual: `${svgCount} <svg>${missing.length ? `, missing ${missing.join(', ')}` : ''}`,
            pass: svgCount >= app.minFlags && missing.length === 0,
          }
        }
      )
    }

    await check(
      {
        id: `${id}/browser`,
        title: 'Chromium render',
        expected: `>= ${app.minFlags} flags, no errors`,
      },
      async () => {
        const { page, problems } = await openPage(browser, url)
        await page
          .waitForFunction(
            min => document.querySelectorAll('svg[role="img"]').length >= min,
            app.minFlags,
            {
              timeout: 15000,
            }
          )
          .catch(() => undefined)
        const flags = await countRenderedFlags(page)
        await page.close()
        return {
          actual: `${flags} flags${problems.length ? `, ${problems.join(' | ')}` : ''}`,
          pass: flags >= app.minFlags && problems.length === 0,
        }
      }
    )

    if (app.interact) {
      await check(
        {
          id: `${id}/interact`,
          title: 'flag switch after hydration',
          expected: `aria-label becomes ${app.interact.label}`,
        },
        async () => {
          const { page, problems } = await openPage(browser, url)
          await page.click(app.interact.click)
          const label = await page
            .waitForFunction(
              ([selector, expected]) =>
                document.querySelector(selector)?.getAttribute('aria-label') === expected &&
                expected,
              [app.interact.target, app.interact.label],
              { timeout: 10000 }
            )
            .then(handle => handle.jsonValue())
            .catch(() => page.locator(app.interact.target).first().getAttribute('aria-label'))
          await page.close()
          return {
            actual: `aria-label ${label}${problems.length ? `, ${problems.join(' | ')}` : ''}`,
            pass: label === app.interact.label && problems.length === 0,
          }
        }
      )
    }
  } catch (error) {
    record({
      id: `${id}/server`,
      title: 'production server',
      expected: 'answers',
      actual: error.message,
      pass: false,
    })
  } finally {
    await server.stop()
  }
}
