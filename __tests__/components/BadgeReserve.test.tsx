// __tests__/components/BadgeReserve.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import BadgeReserve from '@/components/BadgeReserve'

describe('BadgeReserve', () => {
  it('affiche le texte Réservé', () => {
    render(<BadgeReserve />)
    expect(screen.getByText(/réservé/i)).toBeInTheDocument()
  })
})
