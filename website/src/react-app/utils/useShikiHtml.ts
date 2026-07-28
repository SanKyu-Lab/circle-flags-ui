import { useEffect, useState } from 'react'
import auroraX from '@shikijs/themes/aurora-x'
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

const highlighterPromise = createHighlighterCore({
  themes: [auroraX],
  langs: [],
  engine: createJavaScriptRegexEngine(),
})

const languageLoaders = {
  tsx: async () => (await import('@shikijs/langs/tsx')).default,
  vue: async () => (await import('@shikijs/langs/vue')).default,
  svelte: async () => (await import('@shikijs/langs/svelte')).default,
} as const

type HighlightLanguage = keyof typeof languageLoaders

const languageLoadPromises = new Map<HighlightLanguage, Promise<void>>()

const ensureLanguage = async (language: HighlightLanguage) => {
  const highlighter = await highlighterPromise
  if (highlighter.getLoadedLanguages().includes(language)) return highlighter

  let loadPromise = languageLoadPromises.get(language)
  if (!loadPromise) {
    loadPromise = highlighter.loadLanguage(languageLoaders[language])
    languageLoadPromises.set(language, loadPromise)
  }

  await loadPromise
  return highlighter
}

export function useShikiHtml(code: string, lang: string) {
  const [html, setHtml] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        const language = lang in languageLoaders ? (lang as HighlightLanguage) : 'text'
        const highlighter =
          language === 'text' ? await highlighterPromise : await ensureLanguage(language)
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
