import type { Metadata, Viewport } from 'next'
import { Inter, Libre_Baskerville } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-sans',
});
const libreBaskerville = Libre_Baskerville({ 
  subsets: ["latin"],
  variable: '--font-serif',
  weight: ['400', '700']
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
      <body className={`${inter.variable} ${libreBaskerville.variable} font-sans antialiased bg-background`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
