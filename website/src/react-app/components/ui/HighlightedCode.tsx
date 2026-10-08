import { useShikiTokens, type HighlightLanguage } from '../../utils/useShikiTokens'

interface HighlightedCodeProps {
  code: string
  lang: HighlightLanguage
}

export default function HighlightedCode({ code, lang }: HighlightedCodeProps) {
  const lines = useShikiTokens(code, lang)

  return (
    <pre className="m-0 text-body leading-relaxed">
      <code>
        {lines
          ? lines.map((line, lineIndex) => (
              <span key={lineIndex} className="block min-h-[1lh]">
                {line.map((token, tokenIndex) => (
                  <span key={tokenIndex} style={{ color: token.color }}>
                    {token.content}
                  </span>
                ))}
              </span>
            ))
          : code}
      </code>
    </pre>
  )
}
