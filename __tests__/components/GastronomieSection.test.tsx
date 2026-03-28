// __tests__/components/GastronomieSection.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import GastronomieSection from '@/components/GastronomieSection'
import type { Gastronomie } from '@/types/itineraire'

const gastronomie: Gastronomie = {
  description: "Cuisine lacustre raffinée du Lac de Côme.",
  platsIncontournables: [
    "Missoltino — agoni du lac séchés",
    "Risotto al pesce persico"
  ],
  restaurants: [
    {
      nom: "Ristorante Il Vapore",
      description: "Sur la promenade du lac.",
      specialite: "Filetti di pesce persico"
    }
  ]
}

const gastronomieNoRestaurants: Gastronomie = {
  description: "Cuisine simple.",
  platsIncontournables: ["Polenta"],
}

describe('GastronomieSection', () => {
  it('affiche le titre Gastronomie', () => {
    render(<GastronomieSection gastronomie={gastronomie} />)
    expect(screen.getByRole('heading', { name: /gastronomie/i })).toBeInTheDocument()
  })

  it('affiche la description', () => {
    render(<GastronomieSection gastronomie={gastronomie} />)
    expect(screen.getByText(/Cuisine lacustre/)).toBeInTheDocument()
  })

  it('affiche tous les plats incontournables', () => {
    render(<GastronomieSection gastronomie={gastronomie} />)
    expect(screen.getByText(/Missoltino/)).toBeInTheDocument()
    expect(screen.getByText(/Risotto al pesce persico/)).toBeInTheDocument()
  })

  it('affiche les restaurants si présents', () => {
    render(<GastronomieSection gastronomie={gastronomie} />)
    expect(screen.getByText('Ristorante Il Vapore')).toBeInTheDocument()
    expect(screen.getByText(/Filetti di pesce persico/)).toBeInTheDocument()
  })

  it('ne crash pas sans restaurants', () => {
    render(<GastronomieSection gastronomie={gastronomieNoRestaurants} />)
    expect(screen.getByText(/Cuisine simple/)).toBeInTheDocument()
  })
})
