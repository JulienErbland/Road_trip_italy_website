// components/CarteEtapeDetail.tsx
import Link from 'next/link'
import type { Etape } from '@/types/itineraire'
import BadgeReserve from './BadgeReserve'
import SiteCard from './SiteCard'

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
}

export default function CarteEtapeDetail({ etape }: { etape: Etape }) {
  const sameDay = etape.dates.debut === etape.dates.fin
  const dateLabel = sameDay
    ? formatDate(etape.dates.debut)
    : `${formatDate(etape.dates.debut)} – ${formatDate(etape.dates.fin)}`

  return (
    <div className="h-full overflow-y-auto p-5">
      <div className="mb-4">
        <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--color-gold)' }}>
          {etape.pays}
        </p>
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-cream)' }}>
            {etape.ville}
          </h2>
          {etape.reservee && <BadgeReserve />}
        </div>
        <p className="text-sm mb-3" style={{ color: 'var(--color-muted)' }}>{dateLabel}</p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-cream)', opacity: 0.8 }}>
          {etape.description}
        </p>
      </div>

      <div>
        <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--color-gold)' }}>
          Sites à visiter
        </p>
        {etape.sites.map(site => (
          <SiteCard key={site.nom} site={site} />
        ))}
      </div>

      <Link
        href={`/etape/${etape.slug}`}
        className="mt-5 flex items-center justify-center gap-2 w-full py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
        style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-gold)' }}
      >
        Gastronomie, carte locale &amp; plus →
      </Link>
    </div>
  )
}
