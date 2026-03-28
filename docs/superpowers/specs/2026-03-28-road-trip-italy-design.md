# Spec : Site Road Trip Italie

**Date :** 2026-03-28
**Stack :** Next.js 15 (App Router) · Tailwind CSS · Mapbox GL JS · Vercel
**Langue :** Français intégral

---

## Itinéraire

| Jour | Date | Étape | Notes |
|------|------|-------|-------|
| J1 | 8 Avril | Bâle → Bellinzona | Châteaux UNESCO |
| J2 | 9 Avril | Bellinzona → Menaggio | Arrivée lac de Côme |
| J3–J5 | 10–12 Avril | Menaggio | **Réservé** |
| J6 | 13 Avril | Menaggio → Bergame | Ville haute médiévale |
| J7 | 14 Avril | Bergame → Vérone | |
| J8 | 15 Avril | Vérone | Arena, Juliette |
| J9 | 16 Avril | Vérone → Venise | |
| J10–J11 | 17–18 Avril | Venise | Palais des Doges, St-Marc |
| J12 | 19 Avril | Venise → Padoue | Chapelle des Scrovegni |
| J13 | 20 Avril | Padoue → Lago di Garda → Milan | Sirmione |
| J14 | 21 Avril | Milan → Bâle | Retour impératif le soir |

---

## Architecture

### Pages (App Router)
- `/` — Accueil : hero + carte globale Mapbox + timeline des étapes
- `/etape/[slug]` — Détail d'une étape (générée statiquement via `generateStaticParams`)

### Données
Fichier unique `data/itineraire.ts` — tableau TypeScript typé, pas de base de données.

```typescript
type SiteHistorique = {
  nom: string
  description: string       // contexte historique
  dureeVisite: string       // ex: "1h30"
  reservation: { requise: boolean; lien?: string }
}

type Etape = {
  slug: string
  ville: string
  pays: string
  dates: { debut: string; fin: string }
  coordonnees: [number, number]   // [lng, lat]
  description: string
  reservee: boolean
  sites: SiteHistorique[]
  imageUrl: string
}
```

### Composants
| Composant | Rôle |
|-----------|------|
| `CarteGlobale` | Carte Mapbox plein itinéraire, marqueurs cliquables |
| `CarteLocale` | Carte Mapbox zoomée sur une ville (page étape) |
| `TimelineEtapes` | Liste verticale scrollable des étapes |
| `CarteEtapeDetail` | Panneau latéral avec détails de l'étape sélectionnée |
| `SiteCard` | Un site historique : nom, durée, bouton réservation |
| `BadgeReserve` | Badge "Réservé ✓" |
| `HeroSection` | Titre, dates, statistiques du voyage |

La carte Mapbox est un composant `"use client"` chargé via `next/dynamic` (pas de SSR).
Synchronisation bidirectionnelle : clic timeline ↔ clic marqueur carte via state React partagé.

### Responsive / Mobile
- Desktop : carte à droite, timeline à gauche (layout split)
- Mobile : carte en haut, timeline empilée en dessous, `CarteEtapeDetail` en bottom sheet

---

## Design

- **Palette :** Fond `#1a1a2e` (bleu nuit), accent `#c9a84c` (doré), texte `#f5f0e8` (crème)
- **Typographie :** `Playfair Display` (titres serif) + `Inter` (corps sans-serif) via `next/font`
- **Style :** Élégant sombre, inspiré guide de luxe / magazine voyage

---

## Déploiement

- **Vercel** — zéro config, intégration native Next.js
- **Variable d'env :** `NEXT_PUBLIC_MAPBOX_TOKEN` (Vercel dashboard + `.env.local` local)
- **Sécurité Mapbox :** restriction d'URL dans le dashboard Mapbox (domaine Vercel uniquement)
- **Images :** `next/image` avec `remotePatterns` pour `images.unsplash.com`
- **Génération :** 100% statique (`generateStaticParams`), zéro coût serveur Vercel free tier

---

## Fonctionnalités par étape

Pour chaque étape, le site affiche :
- Sites historiques principaux avec contexte historique
- Durée estimée de visite
- Bouton de réservation (lien officiel) si requis
- Badge "Réservé ✓" si hébergement déjà réservé
- Image placeholder (Unsplash)
- Carte locale centrée sur la ville
