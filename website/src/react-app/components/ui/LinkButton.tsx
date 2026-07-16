import type { AnchorHTMLAttributes, ReactNode } from 'react'

type Variant = 'ghost' | 'solid'

interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode
  variant?: Variant
}

export default function LinkButton({
  children,
  variant = 'ghost',
  className = '',
  ...rest
}: LinkButtonProps) {
  const base =
    'inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold outline-none transition-[background-color,border-color,color,transform] focus-visible:ring-2 focus-visible:ring-(--accent) active:translate-y-px'

  const styles =
    variant === 'solid'
      ? 'border border-(--ink) bg-(--ink) text-(--bg) hover:bg-(--ink-secondary)'
      : 'border border-(--border-strong) bg-transparent text-(--ink) hover:border-(--muted-light) hover:bg-(--surface)'

  const rel =
    rest.target === '_blank'
      ? [rest.rel, 'noopener', 'noreferrer'].filter(Boolean).join(' ')
      : rest.rel

  return (
    <a className={`${base} ${styles} ${className}`.trim()} rel={rel} {...rest}>
      {children}
    </a>
  )
}
