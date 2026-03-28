// types/itineraire.ts
export type SiteHistorique = {
  nom: string
  description: string
  dureeVisite: string
  reservation: {
    requise: boolean
    lien?: string
  }
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
  sites: SiteHistorique[]
}
