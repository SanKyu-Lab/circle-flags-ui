import './index.css'
import { StrictMode } from 'react'
import App from './App'
import { NuqsAdapter } from 'nuqs/adapters/react'
import type { Route } from './routing/paths'

interface AppEntryProps {
  initialRoute?: Route
}

export default function AppEntry({ initialRoute = 'home' }: AppEntryProps) {
  return (
    <StrictMode>
      <NuqsAdapter>
        <App initialRoute={initialRoute} />
      </NuqsAdapter>
    </StrictMode>
  )
}
