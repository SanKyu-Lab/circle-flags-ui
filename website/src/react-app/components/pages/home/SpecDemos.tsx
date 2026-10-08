import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { DynamicFlag, FlagSizes, isFlagCode } from '@sankyu/react-circle-flags'
import { FlagBr } from '@sankyu/react-circle-flags/flags/br'
import { FlagDe } from '@sankyu/react-circle-flags/flags/de'
import { FlagKe } from '@sankyu/react-circle-flags/flags/ke'
import { FlagSc } from '@sankyu/react-circle-flags/flags/sc'
import CopyButton from '../../ui/CopyButton'
import HighlightedCode from '../../ui/HighlightedCode'

interface DemoFrameProps {
  stage: ReactNode
  controls?: ReactNode
  code: string
}

function DemoFrame({ stage, controls, code }: DemoFrameProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-rule bg-card">
      <div className="flex min-h-72 items-center justify-center bg-sunken p-8">{stage}</div>
      {controls ? (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-rule px-5 py-4">
          {controls}
        </div>
      ) : null}
      <div className="relative bg-code text-code-ink">
        <div className="absolute top-2 right-3">
          <CopyButton text={code} label="Copy example" tone="code" />
        </div>
        <div className="min-h-40 overflow-x-auto px-5 py-5 pr-14">
          <HighlightedCode code={code} lang="tsx" />
        </div>
      </div>
    </div>
  )
}

interface SegmentedProps<Value extends string | number> {
  label: string
  value: Value
  options: ReadonlyArray<{ value: Value; label: string }>
  onChange: (value: Value) => void
}

function Segmented<Value extends string | number>({
  label,
  value,
  options,
  onChange,
}: SegmentedProps<Value>) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-label font-mono uppercase text-ink-3">{label}</span>
      <div role="group" aria-label={label} className="flex rounded-md border border-rule p-0.5">
        {options.map(option => (
          <button
            key={option.label}
            type="button"
            aria-pressed={option.value === value}
            onClick={() => onChange(option.value)}
            className={`min-h-8 rounded-sm px-2.5 font-mono text-label outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent ${
              option.value === value ? 'bg-ink text-paper' : 'text-ink-3 hover:text-ink'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function RenderDemo() {
  const stageRef = useRef<HTMLDivElement>(null)
  const [markup, setMarkup] = useState('')

  useEffect(() => {
    const svg = stageRef.current?.querySelector('svg')
    if (!svg) throw new Error('RenderDemo expects the flag to render an <svg> element')
    const attributes = Array.from(svg.attributes)
      .map(attribute => `  ${attribute.name}="${attribute.value}"`)
      .join('\n')
    setMarkup(`<svg\n${attributes}\n>\n  {/* ${svg.children.length} child elements */}\n</svg>`)
  }, [])

  return (
    <DemoFrame
      stage={
        <div ref={stageRef}>
          <FlagBr width={FlagSizes.xxxl} height={FlagSizes.xxxl} />
        </div>
      }
      code={`<FlagBr width={128} height={128} />\n\n// Rendered element, read from this page\n${markup}`}
    />
  )
}

const importedFlags = [
  { code: 'br', name: 'FlagBr', Component: FlagBr },
  { code: 'sc', name: 'FlagSc', Component: FlagSc },
  { code: 'ke', name: 'FlagKe', Component: FlagKe },
] as const

export function ImportDemo() {
  return (
    <DemoFrame
      stage={
        <ul className="flex flex-wrap items-end justify-center gap-8">
          {importedFlags.map(({ code, Component }) => (
            <li key={code} className="flex flex-col items-center gap-3">
              <Component width={FlagSizes.xl} height={FlagSizes.xl} aria-hidden />
              <code className="text-label text-ink-3">flags/{code}</code>
            </li>
          ))}
        </ul>
      }
      code={importedFlags
        .map(
          ({ code, name }) => `import { ${name} } from '@sankyu/react-circle-flags/flags/${code}'`
        )
        .join('\n')
        .concat('\n\n// The bundle contains these three flags and nothing else.')}
    />
  )
}

const sizeOptions = (['md', 'lg', 'xl', 'xxl'] as const).map(name => ({
  value: FlagSizes[name],
  label: name,
}))

const styleOptions = [
  { value: '', label: 'none' },
  { value: 'grayscale', label: 'grayscale' },
  { value: 'opacity-50', label: 'opacity-50' },
] as const

type StyleClass = (typeof styleOptions)[number]['value']

export function StyleDemo() {
  const [size, setSize] = useState<number>(FlagSizes.xl)
  const [styleClass, setStyleClass] = useState<StyleClass>('')
  const classProp = styleClass ? ` className="${styleClass}"` : ''

  return (
    <DemoFrame
      stage={
        <FlagDe
          width={size}
          height={size}
          title="Germany"
          className={`transition-[width,height,filter,opacity] duration-200 ${styleClass}`}
        />
      }
      controls={
        <>
          <Segmented label="Size" value={size} options={sizeOptions} onChange={setSize} />
          <Segmented
            label="Class"
            value={styleClass}
            options={styleOptions}
            onChange={setStyleClass}
          />
        </>
      }
      code={`<FlagDe\n  width={${size}}\n  height={${size}}\n  title="Germany"${classProp ? `\n ${classProp}` : ''}\n/>`}
    />
  )
}

const dynamicExamples = ['sc', 'gb-sct', 'eu', 'zz'] as const

export function DynamicDemo() {
  const [input, setInput] = useState('gb-sct')
  const normalized = input.trim().toLowerCase()
  const valid = isFlagCode(normalized)

  return (
    <DemoFrame
      stage={
        <div className="flex flex-col items-center gap-4">
          <DynamicFlag code={input} width={FlagSizes.xxxl} height={FlagSizes.xxxl} />
          <p className="text-label font-mono uppercase text-ink-3">
            {valid ? `Rendered ${normalized}` : 'Unknown code: placeholder flag'}
          </p>
        </div>
      }
      controls={
        <>
          <label className="flex items-center gap-3">
            <span className="text-label font-mono uppercase text-ink-3">Code</span>
            <input
              value={input}
              onChange={event => setInput(event.target.value)}
              spellCheck={false}
              className="h-9 w-32 rounded-md border border-rule-strong bg-card px-3 font-mono text-body text-ink outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/30"
            />
          </label>
          <div className="flex flex-wrap gap-1">
            {dynamicExamples.map(code => (
              <button
                key={code}
                type="button"
                onClick={() => setInput(code)}
                className="min-h-8 rounded-md px-2 font-mono text-label text-ink-3 underline decoration-rule-strong underline-offset-4 outline-none hover:text-ink focus-visible:ring-2 focus-visible:ring-accent"
              >
                {code}
              </button>
            ))}
          </div>
        </>
      }
      code={`import { DynamicFlag, isFlagCode } from '@sankyu/react-circle-flags'\n\nisFlagCode('${normalized}') // ${valid}\n\n<DynamicFlag code="${input}" width={128} height={128} />`}
    />
  )
}
