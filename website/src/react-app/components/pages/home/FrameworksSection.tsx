import { ArrowUpRight } from 'lucide-react'
import CopyButton from '../../ui/CopyButton'
import RuledSection from '../../ui/RuledSection'
import { withBasePath } from '../../../routing/paths'
import { frameworks } from '../../../utils/frameworks'

export default function FrameworksSection() {
  return (
    <RuledSection
      id="frameworks"
      title="Same API in four frameworks."
      intro={
        <>
          React is stable. Vue, Solid, and Svelte are in beta and follow the same names and props.{' '}
          <a
            href={withBasePath('docs/guides/getting-started/installation/')}
            className="inline-flex items-center gap-1 rounded-sm font-medium text-ink underline decoration-rule-strong underline-offset-4 outline-none hover:text-accent hover:decoration-accent focus-visible:ring-2 focus-visible:ring-accent"
          >
            Installation guide
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>
        </>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-left">
          <thead>
            <tr className="border-y border-rule">
              <th scope="col" className="py-3 pr-4 text-label font-mono uppercase text-ink-3">
                Framework
              </th>
              <th scope="col" className="py-3 pr-4 text-label font-mono uppercase text-ink-3">
                Package
              </th>
              <th scope="col" className="py-3 text-label font-mono uppercase text-ink-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {frameworks.map(framework => (
              <tr key={framework.id} className="border-b border-rule">
                <td className="py-4 pr-4">
                  <span className="inline-flex items-center gap-3 text-body font-medium text-ink">
                    <img
                      src={withBasePath(framework.icon)}
                      alt=""
                      width={20}
                      height={20}
                      className="h-5 w-5 object-contain"
                    />
                    {framework.label}
                  </span>
                </td>
                <td className="py-4 pr-4">
                  <span className="inline-flex items-center gap-1">
                    <code className="text-body text-ink-2">{framework.packageName}</code>
                    <CopyButton
                      text={`pnpm add ${framework.packageName}`}
                      label={`Copy ${framework.label} install command`}
                    />
                  </span>
                </td>
                <td
                  className={`py-4 text-body ${framework.status === 'Stable' ? 'text-ink' : 'text-ink-3'}`}
                >
                  {framework.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </RuledSection>
  )
}
