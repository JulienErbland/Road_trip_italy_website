// __tests__/components/TimelineEtapes.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TimelineEtapes from '@/components/TimelineEtapes'
import { itineraire } from '@/data/itineraire'

describe('TimelineEtapes', () => {
  it('affiche toutes les villes', () => {
    render(<TimelineEtapes etapes={itineraire} selectedSlug={null} onSelect={() => {}} />)
    expect(screen.getByText('Bellinzona')).toBeInTheDocument()
    expect(screen.getByText('Venise')).toBeInTheDocument()
  })

  it('appelle onSelect avec le bon slug au clic', () => {
    const onSelect = vi.fn()
    render(<TimelineEtapes etapes={itineraire} selectedSlug={null} onSelect={onSelect} />)
    fireEvent.click(screen.getByText('Bergame'))
    expect(onSelect).toHaveBeenCalledWith('bergame')
  })

  it('marque visuellement l\'étape sélectionnée', () => {
    render(<TimelineEtapes etapes={itineraire} selectedSlug="venise" onSelect={() => {}} />)
    const veniseItem = screen.getByText('Venise').closest('[data-selected]')
    expect(veniseItem).toHaveAttribute('data-selected', 'true')
  })
})
