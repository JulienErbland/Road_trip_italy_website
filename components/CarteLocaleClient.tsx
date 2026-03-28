'use client'

import dynamic from 'next/dynamic'

const CarteLocale = dynamic(() => import('@/components/CarteLocale'), { ssr: false })

type Props = {
  coordonnees: [number, number]
  ville: string
}

export default function CarteLocaleClient({ coordonnees, ville }: Props) {
  return <CarteLocale coordonnees={coordonnees} ville={ville} />
}
