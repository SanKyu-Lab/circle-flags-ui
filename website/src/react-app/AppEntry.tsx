import './index.css'
import { StrictMode } from 'react'
import App from './App'
import { NuqsAdapter } from 'nuqs/adapters/react'

export default function AppEntry() {
  return (
    <StrictMode>
      <NuqsAdapter>
        <App />
      </NuqsAdapter>
    </StrictMode>
  )
}
