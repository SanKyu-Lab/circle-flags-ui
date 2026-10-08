import type { AnchorHTMLAttributes, ReactNode } from 'react'

type Variant = 'ghost' | 'solid'

interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode
  variant?: Variant
}

const variantStyles: Record<Variant, string> = {
  solid: 'border-ink bg-ink text-paper hover:bg-ink-2 hover:border-ink-2',
  ghost: 'border-rule-strong bg-transparent text-ink hover:border-ink-3 hover:bg-sunken',
}

export default function LinkButton({
  children,
  variant = 'ghost',
  className = '',
  ...rest
}: LinkButtonProps) {
  const rel =
    rest.target === '_blank'
      ? [rest.rel, 'noopener', 'noreferrer'].filter(Boolean).join(' ')
      : rest.rel

  return (
    <a
      {...rest}
      rel={rel}
      className={`inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md border px-4 text-body font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${variantStyles[variant]} ${className}`.trim()}
    >
      {children}
    </a>
  )
}
