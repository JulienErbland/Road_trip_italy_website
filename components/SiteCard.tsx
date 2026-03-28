// components/SiteCard.tsx
import type { SiteHistorique } from '@/types/itineraire'

export default function SiteCard({ site }: { site: SiteHistorique }) {
  return (
    <div
      className="rounded-lg p-4 mb-3"
      style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-sm" style={{ color: 'var(--color-cream)' }}>
          {site.nom}
        </h3>
        <span className="text-xs shrink-0 px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-gold)' }}>
          {site.dureeVisite}
        </span>
      </div>
      <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--color-muted)' }}>
        {site.description}
      </p>
      {site.reservation.requise && site.reservation.lien && (
        <a
          href={site.reservation.lien}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded transition-colors"
          style={{ backgroundColor: 'var(--color-gold)', color: 'var(--color-background)' }}
        >
          Réserver →
        </a>
      )}
    </div>
  )
}
