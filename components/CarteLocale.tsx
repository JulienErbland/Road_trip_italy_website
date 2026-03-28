'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

type Props = {
  coordonnees: [number, number]
  ville: string
}

export default function CarteLocale({ coordonnees, ville }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: coordonnees,
      zoom: 12,
      interactive: true,
    })

    map.addControl(new mapboxgl.NavigationControl(), 'top-right')
    mapRef.current = map

    map.on('load', () => {
      const el = document.createElement('div')
      el.style.cssText = `
        width: 16px; height: 16px;
        border-radius: 50%;
        background: #c9a84c;
        border: 3px solid #1a1a2e;
        box-shadow: 0 0 12px rgba(201,168,76,0.6);
      `
      new mapboxgl.Marker(el).setLngLat(coordonnees).addTo(map)
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [coordonnees])

  return (
    <div
      ref={containerRef}
      data-testid="carte-locale"
      className="w-full h-48 rounded-lg overflow-hidden"
      aria-label={`Carte de ${ville}`}
    />
  )
}
