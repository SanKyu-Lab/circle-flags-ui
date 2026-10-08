import { withBasePath } from '../../routing/paths'

const footerLinks = [
  { label: 'Documentation', href: withBasePath('docs/guides/getting-started/') },
  { label: 'llms.txt', href: withBasePath('llms.txt') },
  { label: 'npm', href: 'https://www.npmjs.com/package/@sankyu/react-circle-flags' },
  { label: 'GitHub', href: 'https://github.com/SanKyu-Lab/circle-flags-ui' },
] as const

export default function AppFooter() {
  return (
    <footer className="border-t border-rule py-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-body text-ink-3">
          Circle Flags UI · MIT License · © {new Date().getFullYear()} Sankyu Lab
        </p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {footerLinks.map(link => (
            <li key={link.label}>
              <a
                href={link.href}
                className="inline-block rounded-sm py-1.5 text-body text-ink-2 outline-none hover:text-accent focus-visible:ring-2 focus-visible:ring-accent"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
