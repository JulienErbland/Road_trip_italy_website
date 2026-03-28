'use client'

import type { Etape } from '@/types/itineraire'
import BadgeReserve from './BadgeReserve'

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

type Props = {
  etapes: Etape[]
  selectedSlug: string | null
  onSelect: (slug: string) => void
}

export default function TimelineEtapes({ etapes, selectedSlug, onSelect }: Props) {
  return (
    <nav className="h-full overflow-y-auto py-4">
      {etapes.map((etape, index) => {
        const isSelected = etape.slug === selectedSlug
        return (
          <button
            key={etape.slug}
            data-selected={isSelected}
            onClick={() => onSelect(etape.slug)}
            className="w-full text-left px-4 py-3 flex items-start gap-3 transition-colors"
            style={{
              backgroundColor: isSelected ? 'var(--color-surface)' : 'transparent',
              borderLeft: isSelected ? '2px solid var(--color-gold)' : '2px solid transparent',
            }}
          >
            <div className="shrink-0 mt-0.5">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  backgroundColor: isSelected ? 'var(--color-gold)' : 'var(--color-surface)',
                  color: isSelected ? 'var(--color-background)' : 'var(--color-muted)',
                }}
              >
                {index + 1}
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="font-semibold text-sm"
                  style={{ color: isSelected ? 'var(--color-gold)' : 'var(--color-cream)' }}
                >
                  {etape.ville}
                </span>
                {etape.reservee && <BadgeReserve />}
              </div>
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
                {formatDate(etape.dates.debut)}
                {etape.dates.debut !== etape.dates.fin && ` – ${formatDate(etape.dates.fin)}`}
              </p>
            </div>
          </button>
        )
      })}
    </nav>
  )
}
