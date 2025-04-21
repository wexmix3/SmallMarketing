import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Customer Service Assistant',
  description: 'An AI-powered customer service assistant for small businesses',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
