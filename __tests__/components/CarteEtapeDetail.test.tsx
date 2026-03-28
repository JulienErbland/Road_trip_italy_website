// __tests__/components/CarteEtapeDetail.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import CarteEtapeDetail from '@/components/CarteEtapeDetail'
import { itineraire } from '@/data/itineraire'

const venise = itineraire.find(e => e.slug === 'venise')!
const menaggio = itineraire.find(e => e.slug === 'menaggio')!

describe('CarteEtapeDetail', () => {
  it('affiche le nom de la ville', () => {
    render(<CarteEtapeDetail etape={venise} />)
    expect(screen.getByRole('heading', { name: /venise/i })).toBeInTheDocument()
  })

  it('affiche tous les sites de l\'étape', () => {
    render(<CarteEtapeDetail etape={venise} />)
    expect(screen.getByText('Palais des Doges')).toBeInTheDocument()
    expect(screen.getByText('Basilique Saint-Marc')).toBeInTheDocument()
  })

  it('affiche le badge Réservé si l\'étape est réservée', () => {
    render(<CarteEtapeDetail etape={menaggio} />)
    expect(screen.getByText(/réservé/i)).toBeInTheDocument()
  })

  it('n\'affiche pas le badge si l\'étape n\'est pas réservée', () => {
    render(<CarteEtapeDetail etape={venise} />)
    expect(screen.queryByText(/réservé/i)).not.toBeInTheDocument()
  })
})
