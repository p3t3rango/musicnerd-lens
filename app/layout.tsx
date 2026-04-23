import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-sans'
});
const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-mono'
});

export const metadata: Metadata = {
  title: 'MusicNerd Lens',
  description: 'Point your phone at any record, concert poster, or setlist and get the full MusicNerd treatment. Deep cuts, gear facts, and obscure trivia delivered with Nardwuar energy.',
  generator: 'musicnerd.xyz',
  icons: {
    icon: '/favicon-32x32.png',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'MusicNerd Lens',
    description: 'Scan any music artifact and get the full nerd treatment',
    siteName: 'MusicNerd',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1a1625',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
