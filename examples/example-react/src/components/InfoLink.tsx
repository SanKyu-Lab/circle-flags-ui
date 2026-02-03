interface InfoLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export function InfoLink({ href, children, className = '' }: InfoLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`text-indigo-500 no-underline font-medium hover:text-indigo-600 hover:underline ${className}`}
    >
      {children}
    </a>
  )
}
