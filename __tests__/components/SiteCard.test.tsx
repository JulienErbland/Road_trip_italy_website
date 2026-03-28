// __tests__/components/SiteCard.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import SiteCard from '@/components/SiteCard'
import type { SiteHistorique } from '@/types/itineraire'

const siteAvecReservation: SiteHistorique = {
  nom: 'Palais des Doges',
  description: 'Symbole de Venise',
  dureeVisite: '2h30',
  reservation: { requise: true, lien: 'https://palazzoducale.visitmuve.it' },
}

const siteSansReservation: SiteHistorique = {
  nom: 'Castelgrande',
  description: 'Château médiéval',
  dureeVisite: '1h',
  reservation: { requise: false },
}

describe('SiteCard', () => {
  it('affiche le nom du site', () => {
    render(<SiteCard site={siteAvecReservation} />)
    expect(screen.getByText('Palais des Doges')).toBeInTheDocument()
  })

  it('affiche la durée de visite', () => {
    render(<SiteCard site={siteAvecReservation} />)
    expect(screen.getByText('2h30')).toBeInTheDocument()
  })

  it('affiche un lien de réservation si requis', () => {
    render(<SiteCard site={siteAvecReservation} />)
    const link = screen.getByRole('link', { name: /réserver/i })
    expect(link).toHaveAttribute('href', 'https://palazzoducale.visitmuve.it')
  })

  it('n\'affiche pas de lien si pas de réservation', () => {
    render(<SiteCard site={siteSansReservation} />)
    expect(screen.queryByRole('link', { name: /réserver/i })).not.toBeInTheDocument()
  })
})
