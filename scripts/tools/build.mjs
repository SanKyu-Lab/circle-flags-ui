#!/usr/bin/env node
// Wrapper script that invokes tsup.
import { spawn } from 'node:child_process'

const tsup = spawn('pnpm', ['exec', 'tsup'], {
  stdio: 'inherit',
})

tsup.on('close', code => {
  process.exit(code ?? 0)
})
