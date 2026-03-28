// app/layout.tsx
import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import 'mapbox-gl/dist/mapbox-gl.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Road Trip Italie — Avril 2025',
  description: 'Itinéraire interactif : Bâle → Bellinzona → Lac de Côme → Bergame → Vérone → Venise → Padoue → Sirmione → Milan → Bâle',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
        {children}
      </body>
    </html>
  )
}
