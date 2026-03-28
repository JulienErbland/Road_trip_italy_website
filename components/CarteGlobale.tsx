// components/CarteGlobale.tsx
'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import type { Etape } from '@/types/itineraire'
import { BALE_COORDONNEES } from '@/data/itineraire'

const CAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
  <rect x="2" y="10" width="20" height="7" rx="2" fill="#c9a84c"/>
  <path d="M5 10 L7 5 L17 5 L19 10 Z" fill="#c9a84c"/>
  <rect x="3" y="8" width="18" height="2" fill="#1a1a2e" opacity="0.3"/>
  <circle cx="7" cy="17" r="2.2" fill="#1a1a2e"/>
  <circle cx="7" cy="17" r="1" fill="#c9a84c"/>
  <circle cx="17" cy="17" r="2.2" fill="#1a1a2e"/>
  <circle cx="17" cy="17" r="1" fill="#c9a84c"/>
  <rect x="8" y="6" width="3" height="3" rx="0.5" fill="#1a1a2e" opacity="0.4"/>
  <rect x="13" y="6" width="3" height="3" rx="0.5" fill="#1a1a2e" opacity="0.4"/>
</svg>`

type Props = {
  etapes: Etape[]
  selectedSlug: string | null
  onEtapeSelect: (slug: string) => void
}

export default function CarteGlobale({ etapes, selectedSlug, onEtapeSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const carMarkerRef = useRef<mapboxgl.Marker | null>(null)

  // Initialize map once
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
      // Route source (updated dynamically)
      const initialCoords: [number, number][] = [BALE_COORDONNEES, etapes[0].coordonnees]
      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates: initialCoords },
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
          'line-opacity': 0.8,
        },
      })

      // Basel start marker
      const baleEl = document.createElement('div')
      baleEl.style.cssText = `
        width: 10px; height: 10px;
        border-radius: 50%;
        background: #c9a84c;
        border: 2px solid #1a1a2e;
        opacity: 0.6;
      `
      new mapboxgl.Marker(baleEl).setLngLat(BALE_COORDONNEES).addTo(map)

      // Étape markers
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

      // Car marker
      const carEl = document.createElement('div')
      carEl.innerHTML = CAR_SVG
      carEl.style.cssText = `
        cursor: pointer;
        filter: drop-shadow(0 0 6px rgba(201,168,76,0.7));
        transition: all 0.3s ease;
      `
      const carMarker = new mapboxgl.Marker(carEl)
        .setLngLat(etapes[0].coordonnees)
        .addTo(map)
      carMarkerRef.current = carMarker
    })

    return () => {
      markersRef.current.forEach(m => m.remove())
      markersRef.current = []
      carMarkerRef.current?.remove()
      carMarkerRef.current = null
      map.remove()
      mapRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Update route and car position when selectedSlug changes
  useEffect(() => {
    if (!mapRef.current || !selectedSlug) return
    const map = mapRef.current

    const selectedIdx = etapes.findIndex(e => e.slug === selectedSlug)
    if (selectedIdx === -1) return

    const selectedEtape = etapes[selectedIdx]

    // Fly to selected étape
    map.flyTo({ center: selectedEtape.coordonnees, zoom: 9, duration: 1200 })

    // Move car marker to selected étape
    carMarkerRef.current?.setLngLat(selectedEtape.coordonnees)

    // Update progressive route: Basel → selected étape
    const routeCoords: [number, number][] = [
      BALE_COORDONNEES,
      ...etapes.slice(0, selectedIdx + 1).map(e => e.coordonnees),
    ]

    if (map.isStyleLoaded()) {
      const source = map.getSource('route') as mapboxgl.GeoJSONSource
      source?.setData({
        type: 'Feature',
        properties: {},
        geometry: { type: 'LineString', coordinates: routeCoords },
      })
    }
  }, [selectedSlug, etapes])

  return (
    <div
      ref={containerRef}
      data-testid="carte-globale"
      className="absolute inset-0"
    />
  )
}
