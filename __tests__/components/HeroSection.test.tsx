// __tests__/components/HeroSection.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import HeroSection from '@/components/HeroSection'

describe('HeroSection', () => {
  it('affiche le titre principal', () => {
    render(<HeroSection selectedSlug={null} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Road Trip Italie')
  })

  it('affiche les dates du voyage', () => {
    render(<HeroSection selectedSlug={null} />)
    expect(screen.getByText(/8 Avril/)).toBeInTheDocument()
    expect(screen.getByText(/21 Avril/)).toBeInTheDocument()
  })

  it('affiche les sections Parcourus et Restants', () => {
    render(<HeroSection selectedSlug="venise" />)
    expect(screen.getByText('Parcourus')).toBeInTheDocument()
    expect(screen.getByText('Restants')).toBeInTheDocument()
  })

  it('affiche les stats écoulées pour venise (5 villes)', () => {
    render(<HeroSection selectedSlug="venise" />)
    // 5 étapes visited up to venise (bellinzona, menaggio, bergame, verone, venise)
    expect(screen.getAllByText('5').length).toBeGreaterThanOrEqual(1)
  })
})
