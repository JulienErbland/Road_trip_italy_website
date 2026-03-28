// components/CarteGlobale.tsx
'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import type { Etape } from '@/types/itineraire'

type Props = {
  etapes: Etape[]
  selectedSlug: string | null
  onEtapeSelect: (slug: string) => void
}

export default function CarteGlobale({ etapes, selectedSlug, onEtapeSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [10.5, 45.5],
      zoom: 5.5,
    })

    map.addControl(new mapboxgl.NavigationControl(), 'top-right')
    mapRef.current = map

    map.on('load', () => {
      // Route line
      const coordinates = etapes.map(e => e.coordonnees)
      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates },
        },
      })
      map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        paint: {
          'line-color': '#c9a84c',
          'line-width': 2,
          'line-dasharray': [2, 2],
          'line-opacity': 0.7,
        },
      })

      // Markers
      etapes.forEach(etape => {
        const el = document.createElement('div')
        el.className = 'mapbox-marker'
        el.style.cssText = `
          width: 12px; height: 12px;
          border-radius: 50%;
          background: #c9a84c;
          border: 2px solid #1a1a2e;
          cursor: pointer;
          transition: transform 0.2s;
        `
        el.addEventListener('mouseenter', () => { el.style.transform = 'scale(1.5)' })
        el.addEventListener('mouseleave', () => { el.style.transform = 'scale(1)' })
        el.addEventListener('click', () => onEtapeSelect(etape.slug))

        const marker = new mapboxgl.Marker(el)
          .setLngLat(etape.coordonnees)
          .addTo(map)

        markersRef.current.push(marker)
      })
    })

    return () => {
      markersRef.current.forEach(m => m.remove())
      markersRef.current = []
      map.remove()
      mapRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Fly to selected étape
  useEffect(() => {
    if (!mapRef.current || !selectedSlug) return
    const etape = etapes.find(e => e.slug === selectedSlug)
    if (!etape) return
    mapRef.current.flyTo({ center: etape.coordonnees, zoom: 9, duration: 1200 })
  }, [selectedSlug, etapes])

  return (
    <div
      ref={containerRef}
      data-testid="carte-globale"
      className="w-full h-full"
    />
  )
}
