import { useEffect, useState } from 'react'
import auroraX from '@shikijs/themes/aurora-x'
import { createHighlighter } from 'shiki'

const highlighterPromise = createHighlighter({
  themes: [auroraX],
  langs: ['tsx', 'typescript', 'javascript', 'bash', 'shell', 'json', 'markdown', 'plaintext'],
})

export function useShikiHtml(code: string, lang: string) {
  const [html, setHtml] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        const highlighter = await highlighterPromise
        const loadedLanguages = highlighter.getLoadedLanguages()
        const language = loadedLanguages.includes(lang) ? lang : 'plaintext'
        const highlighted = highlighter.codeToHtml(code, { lang: language, theme: auroraX })
        const normalized = highlighted.replace(
          /background-color:\s*[^;"]+;?/g,
          'background-color: transparent;'
        )
        if (!cancelled) {
          setHtml(normalized)
        }
      } catch (error) {
        console.error('Failed to highlight with Shiki', error)
        if (!cancelled) {
          setHtml(null)
        }
      }
    }
    run()

    return () => {
      cancelled = true
    }
  }, [code, lang])

  return html
}
