'use client'

import { useState } from 'react'
import { DynamicFlag } from '@sankyu/react-circle-flags'

export function FlagSwitch() {
  const [code, setCode] = useState('jp')

  return (
    <div className="picker">
      <DynamicFlag code={code} width={48} height={48} data-testid="switched-flag" />
      <button
        type="button"
        data-testid="flag-switch"
        onClick={() => setCode(current => (current === 'jp' ? 'br' : 'jp'))}
      >
        Switch flag after hydration
      </button>
    </div>
  )
}
