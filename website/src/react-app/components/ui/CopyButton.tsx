import { useEffect, useState } from 'react'
import { Check, Copy } from 'lucide-react'

type Tone = 'paper' | 'code'

interface CopyButtonProps {
  text: string
  label: string
  tone?: Tone
}

const toneStyles: Record<Tone, string> = {
  paper: 'text-ink-3 hover:bg-sunken hover:text-ink',
  code: 'text-code-muted hover:bg-code-surface hover:text-code-ink',
}

export default function CopyButton({ text, label, tone = 'paper' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 1400)
    return () => window.clearTimeout(timer)
  }, [copied])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch (error) {
      console.error(`Failed to copy "${label}" to the clipboard`, error)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? `${label} copied` : label}
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent ${toneStyles[tone]}`}
    >
      {copied ? (
        <Check className="h-4 w-4" aria-hidden />
      ) : (
        <Copy className="h-4 w-4" aria-hidden />
      )}
    </button>
  )
}
