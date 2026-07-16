import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'circle-flags-ui Next.js SSR example',
  description: 'Server-rendered @sankyu/react-circle-flags with the latest Next.js App Router',
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
