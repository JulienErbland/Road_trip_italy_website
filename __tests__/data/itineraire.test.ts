// __tests__/data/itineraire.test.ts
import { describe, it, expect } from 'vitest'
import { itineraire } from '@/data/itineraire'

describe('itineraire data', () => {
  it('contient au moins 8 étapes', () => {
    expect(itineraire.length).toBeGreaterThanOrEqual(8)
  })

  it('chaque étape a les champs requis', () => {
    for (const etape of itineraire) {
      expect(etape.slug).toBeTruthy()
      expect(etape.ville).toBeTruthy()
      expect(etape.coordonnees).toHaveLength(2)
      expect(etape.sites).toBeInstanceOf(Array)
    }
  })

  it('Menaggio est marquée comme réservée', () => {
    const menaggio = itineraire.find(e => e.slug === 'menaggio')
    expect(menaggio?.reservee).toBe(true)
  })

  it('les étapes avec réservation ont un lien', () => {
    for (const etape of itineraire) {
      for (const site of etape.sites) {
        if (site.reservation.requise) {
          expect(site.reservation.lien).toBeTruthy()
        }
      }
    }
  })
})
