# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Interactive road trip website for a 14-day Italy trip (Basel → Italy → Basel, April 2025). Built with Next.js 16 App Router, Tailwind CSS v4, Mapbox GL JS, deployed on Vercel. All text is in French.

## Requirements

- **Node.js**: >=20.9.0 (use `nvm use 20` if on an older version — see `.nvmrc`)
- **Mapbox token**: Copy `.env.local.example` to `.env.local` and fill in `NEXT_PUBLIC_MAPBOX_TOKEN`

## Commands

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Vitest watch mode
npm run test:run     # Vitest single run
```

## Architecture

- `data/itineraire.ts` — single source of truth for all étapes, sites, GPS coordinates, booking links
- `types/itineraire.ts` — TypeScript types: `Etape`, `SiteHistorique`
- `app/page.tsx` — homepage: 3-column layout (Timeline | Mapbox map | CarteEtapeDetail), `'use client'`
- `app/etape/[slug]/page.tsx` — static per-étape pages, pre-rendered via `generateStaticParams()`
- `components/CarteGlobale.tsx` — full itinerary Mapbox map, client-only
- `components/CarteLocale.tsx` — single-city Mapbox map, client-only
- `components/CarteLocaleClient.tsx` — thin `'use client'` wrapper required to use dynamic import in server pages

## Key Patterns

- Mapbox components: always `'use client'` + loaded in pages via `dynamic(() => import(...), { ssr: false })`
- `NEXT_PUBLIC_MAPBOX_TOKEN` is in `.env.local` (never commit — already in `.gitignore`)
- Theme colors via CSS custom properties in `app/globals.css` (`@theme` block, Tailwind v4)
- All UI text is in French
