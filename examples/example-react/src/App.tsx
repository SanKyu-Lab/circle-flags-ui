import {
  FlagUs,
  FlagGb,
  FlagNo,
  FlagSe,
  FlagGr,
  FlagEu,
  FlagAqTrueSouth,
  FlagCn,
  FlagTr,
  FlagCh,
  FlagDk,
  FlagCa,
  FlagPl,
  FlagJp,
  FlagDe,
  FlagFr,
  FlagIt,
  FlagIn,
  FlagBr,
  FlagAr,
  FlagKr,
  buildMeta,
} from '@sankyu/react-circle-flags'
import type { ComponentType, SVGProps } from 'react'
import { FlagGrid } from './components/FlagGrid'
import { BuildInfoCard } from './components/BuildInfoCard'
import { createFlagGridRows, type FlagGridCode } from './libs/shared/flag-grid'

const FLAG_COMPONENTS = {
  US: FlagUs,
  GB: FlagGb,
  NO: FlagNo,
  SE: FlagSe,
  GR: FlagGr,
  EU: FlagEu,
  AQ: FlagAqTrueSouth,
  CN: FlagCn,
  TR: FlagTr,
  CH: FlagCh,
  DK: FlagDk,
  CA: FlagCa,
  PL: FlagPl,
  JP: FlagJp,
  DE: FlagDe,
  FR: FlagFr,
  IT: FlagIt,
  IN: FlagIn,
  BR: FlagBr,
  AR: FlagAr,
  KR: FlagKr,
} as const satisfies Record<FlagGridCode, ComponentType<SVGProps<SVGSVGElement>>>

const FLAG_ROWS = createFlagGridRows(code => ({
  Component: FLAG_COMPONENTS[code],
  code,
}))

const PKG_NAME = '@sankyu/react-circle-flags'

export default function App() {
  const {
    version = 'unknown',
    commitHash = 'ffffffffffffffff',
    builtTimestamp = 0,
  } = buildMeta || {}

  return (
    <div className="min-h-screen grid place-items-center bg-white font-sans text-gray-700">
      <div className="flex flex-col gap-5 items-center w-95">
        <FlagGrid rows={FLAG_ROWS} />
        <BuildInfoCard
          packageName={PKG_NAME}
          version={version}
          commitHash={commitHash}
          builtTimestamp={builtTimestamp}
        />
      </div>
    </div>
  )
}
