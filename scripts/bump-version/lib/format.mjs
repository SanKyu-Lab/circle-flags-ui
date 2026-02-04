// ANSI colors + small formatting helpers for CLI output
export const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
}

export const fmt = {
  success: msg => `${c.green}✓${c.reset} ${msg}`,
  error: msg => `${c.red}✗${c.reset} ${msg}`,
  warn: msg => `${c.yellow}⚠${c.reset} ${msg}`,
  info: msg => `${c.blue}ℹ${c.reset} ${msg}`,
  pkg: name => `${c.cyan}${name}${c.reset}`,
  version: v => `${c.magenta}${v}${c.reset}`,
  arrow: () => `${c.dim}→${c.reset}`,
  header: msg => `\n${c.bold}${c.blue}${msg}${c.reset}\n`,
  dim: msg => `${c.dim}${msg}${c.reset}`,
  badge: (label, color) => `${color}${c.bold} ${label} ${c.reset}`,
}
