import type { Metadata } from 'next'
import './globals.css'
import { GithubIcon } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Matterparty! ',
  description: 'A comprehensive, community-owned directory of Matter-compatible smart home devices.',
  keywords: ['matter', 'smart home', 'iot', 'connected devices', 'home automation'],
  metadataBase: new URL('https://matter.party'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Matter Device Directory',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col min-h-screen">
          <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 bg-black text-white">
            <div className="font-bold text-xl">🥳 matter.party!</div>
            <a href="https://github.com/mocha/matter" target="_blank" rel="noopener noreferrer">
              <GithubIcon className="h-6 w-6 ml-2 inline-block" />
            </a>
          </nav>
          <div className="main-container pt-14">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
