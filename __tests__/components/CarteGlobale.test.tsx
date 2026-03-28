// __tests__/components/CarteGlobale.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('mapbox-gl/dist/mapbox-gl.css', () => ({}))
vi.mock('mapbox-gl', () => {
  function MockMap() {
    return {
      on: vi.fn((event: string, cb: () => void) => { if (event === 'load') cb() }),
      remove: vi.fn(),
      addControl: vi.fn(),
      addSource: vi.fn(),
      addLayer: vi.fn(),
      flyTo: vi.fn(),
    }
  }
  function MockNavigationControl() {}
  function MockMarker() {
    return {
      setLngLat: vi.fn().mockReturnThis(),
      addTo: vi.fn().mockReturnThis(),
      getElement: vi.fn(() => {
        const el = document.createElement('div')
        return el
      }),
      remove: vi.fn(),
    }
  }
  return {
    default: {
      accessToken: '',
      Map: MockMap,
      NavigationControl: MockNavigationControl,
      Marker: MockMarker,
    },
  }
})

import CarteGlobale from '@/components/CarteGlobale'
import { itineraire } from '@/data/itineraire'

describe('CarteGlobale', () => {
  it('rend le conteneur de la carte', () => {
    render(
      <CarteGlobale
        etapes={itineraire}
        selectedSlug={null}
        onEtapeSelect={() => {}}
      />
    )
    expect(screen.getByTestId('carte-globale')).toBeInTheDocument()
  })
})
