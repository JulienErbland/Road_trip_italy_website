// components/HeroSection.tsx
import { itineraire } from '@/data/itineraire'

export default function HeroSection() {
  return (
    <header className="px-6 py-12 text-center border-b" style={{ borderColor: 'var(--color-border)' }}>
      <p className="text-sm tracking-[0.3em] uppercase mb-3" style={{ color: 'var(--color-gold)' }}>
        Road Trip
      </p>
      <h1
        className="text-5xl md:text-7xl font-bold mb-4"
        style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-cream)' }}
      >
        Road Trip Italie
      </h1>
      <p className="text-xl mb-8" style={{ color: 'var(--color-muted)' }}>
        8 Avril — 21 Avril 2025
      </p>
      <div className="flex justify-center gap-8 text-sm">
        <Stat value="14" label="jours" />
        <Stat value={`${itineraire.length}`} label="étapes" />
        <Stat value="~2 500 km" label="parcourus" />
      </div>
    </header>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p style={{ color: 'var(--color-muted)' }}>
        <span className="text-2xl font-bold" style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-serif)' }}>
          {value}
        </span>
        {' '}
        {label}
      </p>
    </div>
  )
}
