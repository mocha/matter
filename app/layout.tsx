import type { Metadata } from 'next'
import './globals.css'

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
        <div className="main-container">
          {children}
        </div>
      </body>
    </html>
  )
}
