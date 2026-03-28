// app/page.tsx
'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import HeroSection from '@/components/HeroSection'
import TimelineEtapes from '@/components/TimelineEtapes'
import CarteEtapeDetail from '@/components/CarteEtapeDetail'
import { itineraire } from '@/data/itineraire'

const CarteGlobale = dynamic(() => import('@/components/CarteGlobale'), { ssr: false })

export default function HomePage() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(itineraire[0].slug)
  const selectedEtape = itineraire.find(e => e.slug === selectedSlug) ?? itineraire[0]

  return (
    <main>
      <HeroSection selectedSlug={selectedSlug} />

      {/* Desktop: 3-column split. Mobile: stacked */}
      <div className="flex flex-col md:flex-row" style={{ height: '600px' }}>

        {/* Left: timeline */}
        <aside
          className="md:w-56 shrink-0 border-r overflow-hidden"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <TimelineEtapes
            etapes={itineraire}
            selectedSlug={selectedSlug}
            onSelect={setSelectedSlug}
          />
        </aside>

        {/* Center: map */}
        <div className="flex-1 relative h-full">
          <CarteGlobale
            etapes={itineraire}
            selectedSlug={selectedSlug}
            onEtapeSelect={setSelectedSlug}
          />
        </div>

        {/* Right: detail panel */}
        <aside
          className="md:w-80 shrink-0 border-l overflow-y-auto"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
        >
          <CarteEtapeDetail etape={selectedEtape} />
        </aside>
      </div>
    </main>
  )
}
