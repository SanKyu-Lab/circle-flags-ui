import type { JSX } from 'solid-js'

interface InfoLinkProps extends JSX.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
}

export function InfoLink(props: InfoLinkProps) {
  return (
    <a
      href={props.href}
      target="_blank"
      rel="noreferrer"
      class={`text-indigo-500 no-underline font-medium hover:text-indigo-600 hover:underline ${props.class ?? ''}`}
    >
      {props.children}
    </a>
  )
}
