import { useEffect, useState } from 'react'
import auroraX from '@shikijs/themes/aurora-x'
import { createHighlighterCore, type ThemedToken } from 'shiki/core'
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

export type HighlightLanguage = keyof typeof languageLoaders

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

interface HighlightResult {
  code: string
  lines: ThemedToken[][]
}

export function useShikiTokens(code: string, lang: HighlightLanguage) {
  const [result, setResult] = useState<HighlightResult | null>(null)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      const highlighter = await ensureLanguage(lang)
      const { tokens } = highlighter.codeToTokens(code, { lang, theme: auroraX })
      if (!cancelled) setResult({ code, lines: tokens })
    }
    run().catch((error: Error) => {
      console.error(`Failed to highlight ${lang} code with Shiki`, error)
    })

    return () => {
      cancelled = true
    }
  }, [code, lang])

  return result?.code === code ? result.lines : null
}
