// components/GastronomieSection.tsx
import type { Gastronomie } from '@/types/itineraire'

export default function GastronomieSection({ gastronomie }: { gastronomie: Gastronomie }) {
  return (
    <section className="mt-10">
      <div className="flex items-center gap-3 mb-4">
        <h2
          className="text-lg font-bold"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-cream)' }}
        >
          Gastronomie
        </h2>
        <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-border)' }} />
      </div>

      <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--color-cream)', opacity: 0.8 }}>
        {gastronomie.description}
      </p>

      {/* Plats incontournables */}
      <div className="mb-6">
        <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--color-gold)' }}>
          Plats incontournables
        </p>
        <ul className="space-y-2">
          {gastronomie.platsIncontournables.map((plat, i) => (
            <li key={i} className="flex gap-2 text-sm" style={{ color: 'var(--color-cream)' }}>
              <span style={{ color: 'var(--color-gold)' }}>✦</span>
              <span>{plat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Restaurants */}
      {gastronomie.restaurants && gastronomie.restaurants.length > 0 && (
        <div>
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--color-gold)' }}>
            Où manger
          </p>
          <div className="space-y-3">
            {gastronomie.restaurants.map(restaurant => (
              <div
                key={restaurant.nom}
                className="rounded-lg p-4"
                style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
              >
                <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--color-cream)' }}>
                  {restaurant.nom}
                </h3>
                <p className="text-xs mb-2" style={{ color: 'var(--color-muted)' }}>
                  {restaurant.description}
                </p>
                <p className="text-xs italic" style={{ color: 'var(--color-gold)' }}>
                  {restaurant.specialite}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
