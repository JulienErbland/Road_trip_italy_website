// app/etape/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { itineraire, getEtapeBySlug } from '@/data/itineraire'
import SiteCard from '@/components/SiteCard'
import BadgeReserve from '@/components/BadgeReserve'
import CarteLocaleClient from '@/components/CarteLocaleClient'

export function generateStaticParams() {
  return itineraire.map(etape => ({ slug: etape.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const etape = getEtapeBySlug(slug)
  if (!etape) return {}
  return {
    title: `${etape.ville} — Road Trip Italie`,
    description: etape.description,
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function EtapePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const etape = getEtapeBySlug(slug)
  if (!etape) notFound()

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm mb-8 transition-colors"
        style={{ color: 'var(--color-muted)' }}
      >
        ← Retour à l'itinéraire
      </Link>

      {/* Hero image */}
      <div className="relative w-full h-64 rounded-xl overflow-hidden mb-6">
        <Image
          src={etape.imageUrl}
          alt={etape.ville}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,26,46,0.8), transparent)' }} />
        <div className="absolute bottom-4 left-4">
          <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--color-gold)' }}>
            {etape.pays}
          </p>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-cream)' }}>
              {etape.ville}
            </h1>
            {etape.reservee && <BadgeReserve />}
          </div>
        </div>
      </div>

      {/* Dates */}
      <p className="text-sm mb-4" style={{ color: 'var(--color-muted)' }}>
        {formatDate(etape.dates.debut)}
        {etape.dates.debut !== etape.dates.fin && ` – ${formatDate(etape.dates.fin)}`}
      </p>

      {/* Description */}
      <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--color-cream)', opacity: 0.85 }}>
        {etape.description}
      </p>

      {/* Map */}
      <CarteLocaleClient coordonnees={etape.coordonnees} ville={etape.ville} />

      {/* Sites */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-4 tracking-widest uppercase text-xs" style={{ color: 'var(--color-gold)' }}>
          Sites à visiter
        </h2>
        {etape.sites.map(site => (
          <SiteCard key={site.nom} site={site} />
        ))}
      </section>
    </main>
  )
}
