// components/HeroSection.tsx
import { itineraire, getElapsedStats, getRemainingStats } from '@/data/itineraire'

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h${m.toString().padStart(2, '0')}` : `${h}h`
}

type Props = {
  selectedSlug: string | null
}

export default function HeroSection({ selectedSlug }: Props) {
  const activeSlug = selectedSlug ?? itineraire[0].slug
  const elapsed = getElapsedStats(activeSlug)
  const remaining = getRemainingStats(activeSlug)

  return (
    <header className="px-6 py-10 text-center border-b" style={{ borderColor: 'var(--color-border)' }}>
      <p className="text-sm tracking-[0.3em] uppercase mb-3" style={{ color: 'var(--color-gold)' }}>
        Road Trip
      </p>
      <h1
        className="text-4xl md:text-6xl font-bold mb-3"
        style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-cream)' }}
      >
        Road Trip Italie
      </h1>
      <p className="text-lg mb-6" style={{ color: 'var(--color-muted)' }}>
        8 Avril — 21 Avril 2025
      </p>

      {/* Stats row: Parcourus */}
      <div className="mb-3">
        <p className="text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--color-gold)' }}>
          Parcourus
        </p>
        <div className="flex justify-center gap-6 text-sm">
          <Stat value={`${elapsed.jours}`} label="jours" />
          <Stat value={`${elapsed.km} km`} label="parcourus" />
          <Stat value={`${elapsed.villes}`} label="étapes" />
          <Stat value={formatDuration(elapsed.tempsRoute)} label="de route" />
        </div>
      </div>

      {/* Divider */}
      <div className="w-16 mx-auto my-3" style={{ borderTop: '1px solid var(--color-border)' }} />

      {/* Stats row: Restants */}
      <div>
        <p className="text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--color-muted)' }}>
          Restants
        </p>
        <div className="flex justify-center gap-6 text-sm">
          <Stat value={`${remaining.jours}`} label="jours" muted />
          <Stat value={`${remaining.km} km`} label="restants" muted />
          <Stat value={`${remaining.villes}`} label="étapes" muted />
          <Stat value={formatDuration(remaining.tempsRoute)} label="de route" muted />
        </div>
      </div>
    </header>
  )
}

function Stat({ value, label, muted = false }: { value: string; label: string; muted?: boolean }) {
  return (
    <div className="text-center">
      <div
        className="text-xl font-bold"
        style={{
          color: muted ? 'var(--color-muted)' : 'var(--color-gold)',
          fontFamily: 'var(--font-serif)',
        }}
      >
        {value}
      </div>
      <div className="text-xs" style={{ color: 'var(--color-muted)' }}>{label}</div>
    </div>
  )
}
