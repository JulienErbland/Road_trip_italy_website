// __tests__/components/HeroSection.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import HeroSection from '@/components/HeroSection'

describe('HeroSection', () => {
  it('affiche le titre principal', () => {
    render(<HeroSection />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Road Trip Italie')
  })

  it('affiche les dates du voyage', () => {
    render(<HeroSection />)
    expect(screen.getByText(/8 Avril/)).toBeInTheDocument()
    expect(screen.getByText(/21 Avril/)).toBeInTheDocument()
  })

  it('affiche le nombre d\'étapes', () => {
    render(<HeroSection />)
    const elements = screen.getAllByText((content, element) => {
      return element?.textContent?.trim() === '8 étapes'
    })
    expect(elements.length).toBeGreaterThan(0)
  })
})
