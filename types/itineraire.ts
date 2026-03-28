// types/itineraire.ts
export type SiteHistorique = {
  nom: string
  description: string
  dureeVisite: string
  imageUrl?: string
  reservation: {
    requise: boolean
    lien?: string
  }
}

export type Gastronomie = {
  description: string
  platsIncontournables: string[]
  restaurants?: {
    nom: string
    description: string
    specialite: string
  }[]
}

export type Etape = {
  slug: string
  ville: string
  pays: string
  dates: { debut: string; fin: string }
  coordonnees: [number, number]  // [longitude, latitude]
  description: string
  reservee: boolean
  imageUrl: string
  distanceKm: number        // km from previous étape (or Basel for first)
  driveTimeMin: number      // driving minutes from previous étape
  gastronomie: Gastronomie
  sites: SiteHistorique[]
}

export type ElapsedStats = {
  jours: number
  km: number
  villes: number
  tempsRoute: number  // minutes
}

export type RemainingStats = {
  jours: number
  km: number
  villes: number
  tempsRoute: number  // minutes
}
