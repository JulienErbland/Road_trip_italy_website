# Road Trip Italy — Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 7 enhancements to the existing road trip Italy website: fix Mapbox marker drift bug, add progressive route display (Basel → selected étape), add gold SVG car marker, add Basel as start/end of route, add photos to historical sites, expand descriptions with historical context, dynamic dual-row hero stats (elapsed + remaining), and gastronomy section on étape pages.

**Architecture:** All data lives in `data/itineraire.ts` (typed TypeScript). Mapbox map is a `'use client'` component loaded via `next/dynamic({ ssr: false })`. Hero stats computed from cumulative distance/time data per étape. Gastronomy is a new section on `/etape/[slug]` pages only (not homepage).

**Tech Stack:** Next.js 16 (App Router), Tailwind CSS v4, Mapbox GL JS, Vitest + React Testing Library, Node.js 20 (nvm)

**Note:** All bash commands must be prefixed with `source ~/.nvm/nvm.sh && nvm use 20 &&` to use Node 20.

---

## File Structure

```
types/
  itineraire.ts             ← add imageUrl? to SiteHistorique, distanceKm/driveTimeMin/gastronomie to Etape, new Gastronomie type
data/
  itineraire.ts             ← add BALE_COORDONNEES, distances, gastronomy, site images, long descriptions, getElapsedStats/getRemainingStats
components/
  CarteGlobale.tsx          ← fix absolute inset-0 container, progressive route, car SVG marker, Basel markers
  HeroSection.tsx           ← accept selectedSlug prop, show elapsed + remaining stats rows
  GastronomieSection.tsx    ← new component: local dishes + restaurants
app/
  page.tsx                  ← add relative to map parent div, pass selectedSlug to HeroSection
  etape/[slug]/page.tsx     ← add site imageUrl display, add GastronomieSection
__tests__/
  components/HeroSection.test.tsx   ← update for new selectedSlug prop
  components/GastronomieSection.test.tsx ← new test
```

---

## Task 1: Update TypeScript types

**Files:**
- Modify: `types/itineraire.ts`

- [ ] **Step 1: Read current types file**

Read `types/itineraire.ts` to understand current structure.

- [ ] **Step 2: Update `types/itineraire.ts`**

```typescript
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
```

- [ ] **Step 3: Commit**

```bash
source ~/.nvm/nvm.sh && nvm use 20 && cd /home/julienerbland/Documents/Privé/Projets_persos/Road_trip_italy_website && git add types/itineraire.ts && git commit -m "feat: expand types with gastronomy, distances, site images"
```

---

## Task 2: Expand itinerary data

**Files:**
- Modify: `data/itineraire.ts`

This is the largest task. It adds driving distances, gastronomy data, longer descriptions, and site images to each étape.

- [ ] **Step 1: Read current data file**

Read `data/itineraire.ts` to understand current structure before modifying.

- [ ] **Step 2: Replace `data/itineraire.ts` with full expanded version**

```typescript
// data/itineraire.ts
import { Etape, ElapsedStats, RemainingStats } from '@/types/itineraire'

export const BALE_COORDONNEES: [number, number] = [7.5886, 47.5596]
export const RETOUR_BALE_KM = 305
export const RETOUR_BALE_TIME = 210

export const itineraire: Etape[] = [
  {
    slug: 'bellinzona',
    ville: 'Bellinzona',
    pays: 'Suisse',
    dates: { debut: '2025-04-08', fin: '2025-04-08' },
    coordonnees: [9.0233, 46.1947],
    distanceKm: 200,
    driveTimeMin: 165,
    description: "Carrefour stratégique des Alpes depuis l'Antiquité, Bellinzona a été disputée pendant des siècles entre les cantons suisses, le duché de Milan et les évêques de Côme. Ses trois châteaux — Castelgrande, Montebello et Sasso Corbaro — forment un système défensif unique qui a valu à la ville son inscription au Patrimoine mondial de l'UNESCO en 2000. La vieille ville, avec ses arcades et ses ruelles pavées, conserve un caractère médiéval authentique où l'influence italienne se mêle harmonieusement à la rigueur suisse.",
    reservee: false,
    imageUrl: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=800&auto=format',
    gastronomie: {
      description: "Bellinzona se situe au carrefour de la cuisine suisse alémanique et de la tradition lombarde. Le Tessin possède une identité culinaire propre, marquée par la polenta, les fromages de montagne et les vins locaux comme le Merlot du Tessin.",
      platsIncontournables: [
        "Polenta e luganiga — polenta crémeuse avec saucisse tessinoise fumée",
        "Risotto al Merlot — risotto mijoté au vin rouge local",
        "Formaggini del Ticino — petits fromages frais de montagne à l'huile d'olive",
        "Amaretti di Bellinzona — biscuits aux amandes, spécialité locale"
      ],
      restaurants: [
        {
          nom: "Osteria Bellinzonese",
          description: "Institution de la vieille ville, nichée sous les arcades médiévales. Décor en pierre apparente, cuisine tessinoise authentique.",
          specialite: "Polenta con spezzatino di manzo"
        },
        {
          nom: "Grotto Broggini",
          description: "Grotto typiquement tessinois en dehors du centre, avec terrasse ombragée sous les châtaigniers. Vins du Tessin à la ficelle.",
          specialite: "Risotto ai funghi porcini del bosco"
        }
      ]
    },
    sites: [
      {
        nom: 'Castelgrande',
        description: "Édifié sur un éperon rocheux qui domine la ville depuis 2 000 ans, Castelgrande est le plus ancien et le plus monumental des trois châteaux de Bellinzona. Ses origines remontent à l'époque romaine, mais c'est au Moyen Âge que la forteresse prend sa forme actuelle. Le château abrite un musée archéologique remarquable avec des fresques médiévales préservées, ainsi que deux tours emblématiques — la Tour Blanche et la Tour Noire — dont les remparts offrent un panorama saisissant sur toute la vallée du Tessin.",
        dureeVisite: '1h30',
        imageUrl: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&auto=format',
        reservation: { requise: false },
      },
      {
        nom: 'Château de Montebello',
        description: "Perché sur une colline adjacente à Castelgrande, Montebello est la résidence des anciens gouverneurs milanais de la ville. Son musée archéologique et historique retrace 2 000 ans d'histoire du Tessin, des Romains aux Visconti. La passerelle couverte qui relie les deux châteaux est un vestige unique de l'architecture défensive médiévale. Du sommet des remparts, la vue sur la ville basse et les Alpes environnantes est exceptionnelle par temps clair.",
        dureeVisite: '1h',
        imageUrl: 'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?w=800&auto=format',
        reservation: { requise: false },
      },
    ],
  },
  {
    slug: 'menaggio',
    ville: 'Menaggio',
    pays: 'Italie',
    dates: { debut: '2025-04-09', fin: '2025-04-12' },
    coordonnees: [9.2369, 46.0178],
    distanceKm: 80,
    driveTimeMin: 75,
    description: "Menaggio occupe une position idéale sur la rive occidentale du lac de Côme, face aux sommets enneigés des Alpes. Ce village de carte postale, avec ses maisons colorées qui se reflètent dans les eaux claires du lac, est l'un des plus beaux du Côme. Le lac de Côme lui-même est le troisième plus grand lac d'Italie et le plus profond d'Europe (410 m). Ses rives ont accueilli au fil des siècles des artistes, des écrivains et des aristocrates venus chercher l'inspiration : Stendhal, Shelley, Liszt et Napoléon III ont tous séjourné dans ces parages. En avril, les jardins en terrasse explosent de couleurs avec les azalées et les camélias.",
    reservee: true,
    imageUrl: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=800&auto=format',
    gastronomie: {
      description: "La cuisine du lac de Côme est une gastronomie lacustre raffinée, centrée sur les poissons du lac et les saveurs de Lombardie. Le lac de Côme est réputé pour ses agoni (aloses) séchés et son missoltino, spécialité unique au monde.",
      platsIncontournables: [
        "Missoltino — agoni du lac séchés au soleil, puis grillés à l'huile et servi avec polenta",
        "Risotto al pesce persico — risotto à la perche du lac, plat emblématique des restaurants du bord du lac",
        "Lavarello in carpione — lavaret mariné à l'huile, vinaigre et aromates",
        "Sciatt — beignets frits de farine de sarrasin farcis de fromage Bitto fondu"
      ],
      restaurants: [
        {
          nom: "Ristorante Il Vapore",
          description: "Sur la promenade du lac, spécialisé dans les poissons lacustres depuis trois générations. Tables en terrasse avec vue directe sur l'eau.",
          specialite: "Filetti di pesce persico dorati al burro"
        },
        {
          nom: "La Piazzetta",
          description: "Pizzeria-trattoria de la vieille ville, ambiance animée le soir. Idéal pour un repas décontracté après une journée de bateau.",
          specialite: "Risotto al radicchio e Bitto"
        }
      ]
    },
    sites: [
      {
        nom: 'Villa Carlotta (Tremezzo)',
        description: "La Villa Carlotta, sur la rive opposée à Menaggio (accessible en ferry en 10 minutes), est l'une des merveilles du lac de Côme. Construite à la fin du XVIIe siècle et agrandie au XVIIIe, elle doit son nom à la princesse Charlotte de Prusse qui en hérita en 1843. Ses 8 hectares de jardins en terrasses abritent la plus grande collection de rhododendrons et azalées d'Italie — en avril, leur floraison est un spectacle d'une beauté absolument exceptionnelle. Les intérieurs du palais conservent des sculptures de Thorvaldsen et des tableaux d'artistes lombards du XIXe siècle.",
        dureeVisite: '2h',
        imageUrl: 'https://images.unsplash.com/photo-1558618047-f4e90b3aa521?w=800&auto=format',
        reservation: { requise: true, lien: 'https://www.villacarlotta.it' },
      },
      {
        nom: 'Bellagio',
        description: "Juchée sur le promontoire triangulaire qui divise le lac en deux branches, Bellagio est surnommée la « Perle du lac de Côme ». Ses ruelles escarpées bordées de boutiques d'artisanat, ses villas aristocratiques aux jardins suspendus et ses cafés animés en font l'un des bourgs les plus pittoresques d'Italie. La Villa Melzi, construite en 1808 pour le vice-président de la République italienne napoléonienne, possède des jardins romantiques à l'anglaise classés monument historique. Le ferry depuis Menaggio dure 15 minutes.",
        dureeVisite: 'Demi-journée',
        imageUrl: 'https://images.unsplash.com/photo-1580137189272-c9379f8864fd?w=800&auto=format',
        reservation: { requise: false },
      },
      {
        nom: 'Varenna',
        description: "Varenna est peut-être le village le plus romantique du lac de Côme. Accroché à la rive orientale, il est accessible uniquement par bateau ou par une route sinueuse, ce qui lui a conservé une authenticité rare. La Passeggiata degli Innamorati (Promenade des Amoureux), qui longe le lac sur pilotis, est l'une des plus belles balades du nord de l'Italie. La Villa Monastero, ancienne abbaye cistercienne du XIIe siècle convertie en villa baroque, et ses 2 km de jardins botaniques en terrasse sont absolument remarquables.",
        dureeVisite: 'Demi-journée',
        imageUrl: 'https://images.unsplash.com/photo-1586516476143-7ed6e56a5940?w=800&auto=format',
        reservation: { requise: false },
      },
    ],
  },
  {
    slug: 'bergame',
    ville: 'Bergame',
    pays: 'Italie',
    dates: { debut: '2025-04-13', fin: '2025-04-13' },
    coordonnees: [9.6773, 45.6983],
    distanceKm: 80,
    driveTimeMin: 90,
    description: "Bergame est l'une des villes les mieux conservées de Lombardie, et pourtant l'une des moins touristiques du nord de l'Italie. Son dualisme est saisissant : la Città Bassa, ville moderne et industrieuse dans la plaine du Pô, et la Città Alta, cité médiévale perchée sur une colline à 350 mètres d'altitude, reliées par un funiculaire centenaire. La ville haute est ceinte de 6 kilomètres de remparts vénitiens construits au XVIe siècle, classés UNESCO en 2017 avec les autres forteresses vénitiennes d'Italie du Nord. Bergame est aussi la ville natale de Gaetano Donizetti et le berceau des Arlequin de la commedia dell'arte.",
    reservee: false,
    imageUrl: 'https://images.unsplash.com/photo-1569880153113-76e33fc52d5f?w=800&auto=format',
    gastronomie: {
      description: "Bergame est la capitale gastronomique de la Lombardie orientale, réputée pour sa cuisine roborative de montagne. La polenta est omniprésente, mais c'est la casoncelli qui fait la fierté de la ville — ces pâtes farcies au beurre noisette et sauge sont un incontournable.",
      platsIncontournables: [
        "Casoncelli alla bergamasca — pâtes farcies à la viande et amaretti, servies au beurre noisette et sauge",
        "Polenta e osei — traditionnel de fête : polenta avec petits oiseaux rôtis (ou version sucrée en pâtisserie)",
        "Salame di Bergamo — charcuterie locale à l'ail, produite dans la vallée depuis le Moyen Âge",
        "Stracchino di Taleggio — fromage DOP des vallées bergamasques, crémeux et puissant"
      ],
      restaurants: [
        {
          nom: "Ristorante Colleoni & Dell'Angelo",
          description: "L'adresse de référence en Città Alta, sur la Piazza Vecchia face à la Cappella Colleoni. Décor Renaissance, cuisine bergamasque gastronomique.",
          specialite: "Casoncelli alla bergamasca con burro e salvia"
        },
        {
          nom: "Trattoria Tre Torri",
          description: "Trattoria familiale dans les ruelles de la ville haute. Menu à l'ardoise, produits du marché, ambiance authentique sans prétention.",
          specialite: "Polenta taragna con formai de Mut"
        }
      ]
    },
    sites: [
      {
        nom: 'Città Alta — Remparts vénitiens',
        description: "Les remparts de Bergame sont un chef-d'œuvre de l'ingénierie militaire de la Renaissance. Construits entre 1561 et 1588 par la Sérénissime République de Venise pour protéger cette ville frontière contre les Milanais et les Espagnols, ils s'étendent sur 6 kilomètres autour de la ville haute avec 14 bastions en étoile — une innovation défensive qui rendait les murs quasiment imprenables face aux canons de l'époque. Classés au Patrimoine mondial UNESCO en 2017, ils sont aujourd'hui un lieu de promenade exceptionnel avec des vues panoramiques sur la plaine du Pô.",
        dureeVisite: '1h30',
        imageUrl: 'https://images.unsplash.com/photo-1592565578149-42a5763c3900?w=800&auto=format',
        reservation: { requise: false },
      },
      {
        nom: 'Basilique Santa Maria Maggiore',
        description: "Fondée en 1137 par les habitants de Bergame en remerciement d'une délivrance de la peste, la basilique Santa Maria Maggiore est l'un des joyaux du roman lombard. Son portail nord, surmonté d'un lion en porphyre rouge qui porte la statue équestre du condottiere Bartolomeo Colleoni, est l'une des sculptures les plus impressionnantes du Quattrocento. À l'intérieur, les 52 intarsie (marqueteries en bois) du chœur — réalisées par Lorenzo Lotto d'après des cartons de la Bible — sont considérées comme parmi les plus belles d'Italie. Gaetano Donizetti, né à Bergame en 1797, y est inhumé.",
        dureeVisite: '45min',
        imageUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&auto=format',
        reservation: { requise: false },
      },
      {
        nom: 'Cappella Colleoni',
        description: "Érigée entre 1470 et 1476 par le mercenaire Bartolomeo Colleoni — l'un des condottieri les plus puissants du XVe siècle — cette chapelle funéraire est un manifeste de l'architecture Renaissance lombarde. La façade en marbres polychromes blanc, rose et rouge de Carrare, conçue par Giovanni Antonio Amadeo, est considérée comme l'un des plus beaux exemples d'art de la Renaissance en Italie du Nord. Colleoni avait légué une fortune à Venise à condition qu'on lui érige une statue équestre sur la place Saint-Marc — obtenant à la place une statue devant la Scuola Grande di San Marco, et cette chapelle à Bergame.",
        dureeVisite: '30min',
        imageUrl: 'https://images.unsplash.com/photo-1573832032946-da26f3cabed2?w=800&auto=format',
        reservation: { requise: false },
      },
    ],
  },
  {
    slug: 'verone',
    ville: 'Vérone',
    pays: 'Italie',
    dates: { debut: '2025-04-14', fin: '2025-04-15' },
    coordonnees: [10.9916, 45.4384],
    distanceKm: 125,
    driveTimeMin: 90,
    description: "Inscrite au Patrimoine mondial de l'UNESCO en 2000, Vérone est l'une des villes les plus séduisantes d'Italie. Fondée par les Romains au Ier siècle avant J.-C. au carrefour de deux axes commerciaux majeurs, elle conserve un centre historique d'une densité monumentale exceptionnelle : un amphithéâtre romain parmi les mieux conservés au monde, un forum antique (la Piazza delle Erbe), des palais médiévaux et Renaissance... Shakespeare l'a immortalisée en y situant Roméo et Juliette (1597), alors qu'il n'y avait probablement jamais mis les pieds. Les Véronais ont longtemps protesté de cette « imposture », avant de comprendre que la légende était une aubaine touristique inestimable.",
    reservee: false,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format',
    gastronomie: {
      description: "Vérone est au cœur d'une région viticole mondialement connue : l'Amarone della Valpolicella, le Soave et le Bardolino sont produits dans un rayon de 30 km. La cuisine véronaise reflète cette richesse — le risotto à l'Amarone est un plat emblématique.",
      platsIncontournables: [
        "Risotto all'Amarone — risotto mijoté dans l'Amarone, le roi des vins véronais",
        "Pastissada de caval — daube de cheval mijotée au vin rouge pendant 24h, recette médiévale d'origine ostrogothique",
        "Pearà — sauce au pain grillé, moelle de bœuf et poivre noir, servie avec le bollito",
        "Pandoro — brioche en étoile à la vanille, spécialité de Noël véronaise mais vendue toute l'année"
      ],
      restaurants: [
        {
          nom: "Osteria Sottoriva",
          description: "Sous les arcades médiévales de la Via Sottoriva, l'une des plus belles osterie de Vérone. Fréquentée par les Véronais depuis le XVe siècle.",
          specialite: "Pastissada de caval avec polenta morbida"
        },
        {
          nom: "Il Desco",
          description: "Une étoile Michelin, cuisine créative inspirée de la tradition véronaise. Sur la Via Dietro San Sebastiano, à 5 minutes de l'Arena.",
          specialite: "Risotto all'Amarone con riduzione di Recioto"
        }
      ]
    },
    sites: [
      {
        nom: 'Arena di Verona',
        description: "Construite entre 30 et 30 après J.-C., l'Arena di Verona est le troisième plus grand amphithéâtre romain du monde, après le Colisée de Rome et l'amphithéâtre de Capoue. Avec une capacité de 15 000 spectateurs, elle servait de scène aux combats de gladiateurs, aux chasses d'animaux sauvages et aux exécutions publiques. Miraculeusement préservée, elle est aujourd'hui l'une des plus grandes scènes d'opéra à ciel ouvert au monde : depuis 1913, son festival d'opéra estival attire chaque été plus de 500 000 spectateurs. La nuit, éclairée aux flambeaux, l'Arena est un spectacle à couper le souffle.",
        dureeVisite: '1h30',
        imageUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&auto=format',
        reservation: { requise: true, lien: 'https://www.arena.it/it/arena/biglietti' },
      },
      {
        nom: "Casa di Giulietta",
        description: "La maison de Juliette est l'un des mensonges les plus charmants de l'histoire du tourisme. La famille Del Cappello (Cappelletti = petit chapeau → Capulet) a bien existé à Vérone au XIIIe siècle, et une maison médiévale du quartier porta leur nom. Le célèbre balcon, lui, a été ajouté en 1935 par la municipalité pour alimenter le mythe. Peu importe : chaque année, des millions d'amoureux viennent toucher le sein de la statue de bronze de Juliette (censé porter bonheur) et couvrir les murs de l'entrée de messages d'amour. L'intérieur reconstituté présente des tableaux d'époque.",
        dureeVisite: '30min',
        imageUrl: 'https://images.unsplash.com/photo-1535514503536-b2cedf291a8a?w=800&auto=format',
        reservation: { requise: true, lien: 'https://www.tourism.verona.it' },
      },
      {
        nom: 'Castelvecchio',
        description: "Érigé en 1354 par Cangrande II della Scala, le seigneur le plus puissant de Vérone, Castelvecchio était à la fois forteresse militaire, résidence princière et trésor d'État. Son pont à créneaux (Ponte Scaligero) sur l'Adige, avec ses trois arches inégales, est l'un des plus beaux ponts médiévaux d'Italie. Au XXe siècle, le musée qu'il abrite a été rénové par Carlo Scarpa dans une intervention d'architecture muséale considérée comme un chef-d'œuvre mondial — le dialogue entre l'architecture médiévale et le béton, l'acier et le verre est d'une subtilité extraordinaire.",
        dureeVisite: '1h30',
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format',
        reservation: { requise: false },
      },
    ],
  },
  {
    slug: 'venise',
    ville: 'Venise',
    pays: 'Italie',
    dates: { debut: '2025-04-16', fin: '2025-04-18' },
    coordonnees: [12.3155, 45.4408],
    distanceKm: 120,
    driveTimeMin: 90,
    description: "Venise est peut-être la ville la plus extraordinaire du monde : construite sur 118 îlots reliés par 400 ponts, sans une seule voiture, avec 150 canaux comme artères. La Sérénissime République de Venise a dominé le commerce méditerranéen et les routes de la soie pendant mille ans (697-1797), accumulant une richesse artistique et architecturale sans équivalent. Inscrite au Patrimoine mondial de l'UNESCO, elle est aujourd'hui menacée par le changement climatique, le tourisme de masse et le dépeuplement — sa population est passée de 175 000 habitants en 1950 à moins de 50 000 aujourd'hui. Chaque visite est un acte de témoignage face à une civilisation en sursis.",
    reservee: false,
    imageUrl: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&auto=format',
    gastronomie: {
      description: "La cuisine vénitienne est l'une des plus originales d'Italie, mêlant influences byzantines, orientales et méditerranéennes. Venise a importé les épices du monde entier pendant des siècles — cannelle, safran, poivre — et ce métissage culinaire se ressent encore aujourd'hui.",
      platsIncontournables: [
        "Sarde in saor — sardines marinées à l'oignon, vinaigre, raisins et pignons, recette du XIVe siècle",
        "Baccalà mantecato — morue salée fouettée à l'huile d'olive jusqu'à obtenir une crème aérienne, servi sur polenta ou crostini",
        "Risi e bisi — riz aux petits pois frais, plat de printemps traditionnel servi au Doge le jour de la Saint-Marc",
        "Fegato alla veneziana — foie de veau sauté aux oignons dorés, l'un des plats les plus célèbres d'Italie"
      ],
      restaurants: [
        {
          nom: "Osteria alle Testiere",
          description: "Minuscule restaurant de 22 couverts dans le sestiere de Castello, loin des sentiers touristiques. La meilleure table de poissons de Venise selon beaucoup de Vénitiens. Réservation indispensable plusieurs semaines à l'avance.",
          specialite: "Granseola (araignée de mer) à la vénitienne"
        },
        {
          nom: "Bacaro Do Mori",
          description: "Le plus vieux bacaro de Venise (1462), sous les Rialto. Cicchetti (tapas vénitiennes) debout au comptoir, vins au verre. L'expérience vénitienne authentique.",
          specialite: "Cicchetti assortis : baccalà, sarde in saor, mozzarella"
        }
      ]
    },
    sites: [
      {
        nom: 'Palais des Doges',
        description: "Siège du gouvernement de la République de Venise pendant neuf siècles, le Palais des Doges est l'expression ultime de la puissance et du raffinement de la Sérénissime. Son architecture gothique vénitienne — avec ses colonnes aériennes, sa façade en losanges de marbre rose et blanc, et sa loggia ouverte — est unique au monde. À l'intérieur, la Salle du Grand Conseil (52 × 25 m) possède le plus grand tableau de chevalet du monde : Le Paradis de Tintoret. Le circuit des prisons des Plombs (Piombi), situées sous les toits de plomb d'où Casanova s'est évadé en 1756, est l'une des visites les plus fascinantes de Venise.",
        dureeVisite: '2h30',
        imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&auto=format',
        reservation: { requise: true, lien: 'https://palazzoducale.visitmuve.it' },
      },
      {
        nom: 'Basilique Saint-Marc',
        description: "La Basilique Saint-Marc est le symbole de la puissance impériale de Venise. Construite au IXe siècle pour abriter les reliques de saint Marc (volées à Alexandrie en 828 par deux marchands vénitiens), elle a été reconstruite et agrandie jusqu'au XIIIe siècle dans un style byzantin unique en Occident. Ses cinq coupoles dorées, visibles depuis la lagune, sont couvertes de 8 000 m² de mosaïques dorées représentant toute l'histoire sainte. Les fameux Chevaux de Saint-Marc — quatre statues équestres en bronze doré rapportées de Constantinople en 1204 — trônent sur la façade (les originaux sont à l'intérieur).",
        dureeVisite: '1h30',
        imageUrl: 'https://images.unsplash.com/photo-1515542706656-8e4f53022b0e?w=800&auto=format',
        reservation: { requise: true, lien: 'https://www.basilicasanmarco.it' },
      },
      {
        nom: "Galerie de l'Académie",
        description: "Les Gallerie dell'Accademia abritent la plus importante collection de peinture vénitienne au monde, couvrant du XIVe au XVIIIe siècle. C'est ici que se trouve Le Vieil Homme de Giorgione, tableau mystérieux et inclassable qui a révolutionné l'art occidental. On y trouve aussi le cycle des Miracles de la vraie Croix de Carpaccio, La Tempête de Giorgione, L'Annonciation de Titien et surtout la Chambre de Léonard de Vinci — l'Homme de Vitruve, chef-d'œuvre de la Renaissance, y est conservé (rarement exposé). Avec le Titien, le Tintoret et le Véronèse, les Accademia est une plongée dans l'âge d'or vénitien.",
        dureeVisite: '2h',
        imageUrl: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&auto=format',
        reservation: { requise: true, lien: 'https://www.gallerieaccademia.it' },
      },
    ],
  },
  {
    slug: 'padoue',
    ville: 'Padoue',
    pays: 'Italie',
    dates: { debut: '2025-04-19', fin: '2025-04-19' },
    coordonnees: [11.8768, 45.4064],
    distanceKm: 45,
    driveTimeMin: 45,
    description: "Padoue est l'une des plus vieilles villes d'Italie — selon la tradition, elle aurait été fondée par le Troyen Anténor en 1183 avant J.-C. Son université, fondée en 1222, est l'une des plus anciennes d'Occident et la première au monde à avoir accordé un doctorat à une femme (Elena Cornaro Piscopia, en 1678). C'est à Padoue que Galilée a enseigné pendant 18 ans et que William Harvey a découvert la circulation sanguine. Mais la gloire artistique de Padoue repose avant tout sur les fresques que Giotto a peintes entre 1304 et 1306 dans la Chapelle des Scrovegni — un tournant absolu dans l'histoire de l'art occidental.",
    reservee: false,
    imageUrl: 'https://images.unsplash.com/photo-1515542706656-8e4f53022b0e?w=800&auto=format',
    gastronomie: {
      description: "Padoue bénéficie de la richesse agricole de la plaine du Pô et des produits de la lagune vénitienne. La ville est particulièrement réputée pour ses légumes — le radicchio de Trévise et les asperges blanches de Bassano sont des délices printaniers.",
      platsIncontournables: [
        "Bigoli in salsa — pâtes épaisses et rugueuses avec sauce aux anchois et oignons, plat de carême traditonnel",
        "Asparagi bianchi di Bassano — asperges blanches IGP servies avec des œufs mollets et sauce mousseline",
        "Faraona alla padovana — pintade braisée au citron et herbes aromatiques, recette du XVe siècle",
        "Zaleto — biscuits à la farine de maïs et raisins secs, typiques de la pâtisserie padouane"
      ],
      restaurants: [
        {
          nom: "Osteria Dal Capo",
          description: "Osteria historique dans le centre médiéval, fréquentée par les professeurs de l'université depuis des générations. Carte courte mais irréprochable.",
          specialite: "Baccalà alla vicentina con polenta bianca"
        },
        {
          nom: "Caffè Pedrocchi",
          description: "Monument historique inauguré en 1831, surnommé le 'café sans portes' car il n'a jamais fermé au XIXe siècle. Stendhal, Napoléon et Casanova y ont laissé des traces.",
          specialite: "Caffè Pedrocchi (café avec crème de menthe, spécialité maison)"
        }
      ]
    },
    sites: [
      {
        nom: 'Chapelle des Scrovegni',
        description: "En 1300, Enrico Scrovegni — fils d'un usurier condamné par Dante en personne dans l'Enfer — commanda à Giotto une chapelle pour expier les péchés de son père. Le résultat fut une révolution absolue : pour la première fois dans l'histoire de l'art occidental, Giotto peint des êtres humains avec une humanité, une psychologie et une présence physique totalement inédites. Les 38 scènes de la vie de Marie et du Christ sur les trois murs, le Jugement Dernier sur le contre-façade et le plafond étoilé sur fond bleu lapis-lazuli constituent ce que Vasari, Ruskin et Baudelaire ont unanimement qualifié de tournant absolu de la peinture européenne, annonçant la Renaissance de 150 ans. La visite est strictement limitée à 25 personnes à la fois — réservation indispensable bien à l'avance.",
        dureeVisite: '45min',
        imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format',
        reservation: { requise: true, lien: 'https://www.cappelladegliscrovegni.it' },
      },
      {
        nom: 'Basilique Saint-Antoine',
        description: "La Basilique Sant'Antonio di Padova est l'un des grands lieux de pèlerinage du monde catholique — plus de 6 millions de pèlerins par an. Antoine de Padoue, né à Lisbonne en 1195, est mort à Padoue en 1231 à 36 ans. Il fut canonisé moins d'un an après sa mort, délai record dans l'histoire de l'Église. Sa basilique mêle architecture romane, gothique et byzantine dans un ensemble majestueux. Les douze chapelles du déambulatoire abritent des chefs-d'œuvre de Donatello. Le tombeau du saint, dans la chapelle de l'Arca, est couvert de milliers d'ex-voto témoignant de miracles.",
        dureeVisite: '1h',
        imageUrl: 'https://images.unsplash.com/photo-1597975388073-9e8de3bba59e?w=800&auto=format',
        reservation: { requise: false },
      },
    ],
  },
  {
    slug: 'sirmione',
    ville: 'Sirmione',
    pays: 'Italie',
    dates: { debut: '2025-04-20', fin: '2025-04-20' },
    coordonnees: [10.6086, 45.4957],
    distanceKm: 100,
    driveTimeMin: 75,
    description: "Sirmione s'avance sur une péninsule de 4 km de long dans le Lac de Garde, le plus grand lac d'Italie (370 km²) et le plus chaud — ses eaux douces et thermales attirent depuis l'Antiquité. Le poète latin Catulle, qui y possédait une villa au Ier siècle avant J.-C., l'a immortalisée dans ses poèmes (« gem of all peninsulas », paeninsulaRum ocelle) . Le Lago di Garda bénéficie d'un microclimat méditerranéen unique — oliviers, citronniers et lauriers-roses poussent sur ses rives — alors qu'il est encaissé entre les Alpes au nord. Sirmione, avec ses thermes thermaux encore en activité, est un lieu hors du temps.",
    reservee: false,
    imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&auto=format',
    gastronomie: {
      description: "Le Lago di Garda possède une gastronomie lacustre propre, mêlant les poissons du lac (carpione, truite, perche) et les produits méditerranéens de ses rives. L'huile d'olive du Garda, produite sur les rives sud et est du lac, est l'une des huiles les plus réputées d'Italie.",
      platsIncontournables: [
        "Carpione del Garda in carpione — le carpione est un poisson unique au monde, endémique du Lac de Garde, mariné au vin blanc et aux aromates",
        "Bigoli con le sardelle — bigoli (pâtes épaisses) avec sardines du lac et oignons",
        "Luccio in salsa — brochet du lac à la sauce aux câpres et anchois",
        "Olive di Sirmione — olives marinées aux herbes, produites sur la péninsule même"
      ],
      restaurants: [
        {
          nom: "Ristorante La Rucola",
          description: "Sur la péninsule même, une étoile Michelin avec vue sur le lac et la Rocca Scaligera. Cuisine lacustre et méditerranéenne raffinée.",
          specialite: "Carpione del Garda al burro di Malga con capperi di Pantelleria"
        },
        {
          nom: "Trattoria Vecchia Lugana",
          description: "En bordure du lac, dans le hameau de Lugana, spécialisée dans les poissons lacustres depuis 1965. Terrasse ombragée les pieds dans l'eau.",
          specialite: "Trota di lago in crosta di erbe aromatiche"
        }
      ]
    },
    sites: [
      {
        nom: 'Rocca Scaligera',
        description: "Construite au XIIIe siècle par les Scaliger, les seigneurs de Vérone qui ont dominé l'Italie du Nord pendant un siècle, la Rocca Scaligera est une forteresse unique au monde : ses murs plongent directement dans les eaux du Lac de Garde et son enceinte ceint entièrement le vieux village médiéval de Sirmione. Les trois tours crénelées, dont la tour de guet qui culmine à 47 mètres, offrent une vue panoramique exceptionnelle sur tout le lac. C'est l'une des forteresses médiévales les mieux conservées d'Italie du Nord.",
        dureeVisite: '1h',
        imageUrl: 'https://images.unsplash.com/photo-1565003423688-3d14613fd0cd?w=800&auto=format',
        reservation: { requise: false },
      },
      {
        nom: 'Grotte di Catullo',
        description: "Les « Grottes de Catulle » sont en réalité les ruines de la plus grande villa romaine d'Italie du Nord — 167 mètres de long, construite sur deux niveaux, avec vue sur le lac. Attribuée par tradition au poète Catulle (84-54 av. J.-C.), elle date en réalité de la fin du Ier siècle après J.-C., soit un siècle après sa mort. Le musée archéologique adjacent expose des mosaïques et fresques retrouvées sur le site. Depuis la pointe de la péninsule, par temps clair, on aperçoit les Alpes suisses. C'est l'endroit idéal pour comprendre pourquoi le Lac de Garde était la villégiature préférée de l'aristocratie romaine.",
        dureeVisite: '1h30',
        imageUrl: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&auto=format',
        reservation: { requise: false },
      },
    ],
  },
  {
    slug: 'milan',
    ville: 'Milan',
    pays: 'Italie',
    dates: { debut: '2025-04-20', fin: '2025-04-20' },
    coordonnees: [9.1900, 45.4654],
    distanceKm: 140,
    driveTimeMin: 90,
    description: "Milan est la deuxième ville d'Italie et sa capitale économique, financière et de la mode. Mais derrière la façade moderne se cache une ville d'une richesse historique et artistique considérable : le Duomo gothique, l'un des plus grands au monde, a nécessité six siècles de travaux (1386-1965). C'est à Milan que Léonard de Vinci a passé vingt ans et peint La Cène (1495-1498), considérée comme le tableau le plus étudié du monde. C'est aussi à Milan que Verdi a triomphé à la Scala et que Mussolini a lancé le fascisme en 1919. Étape de transition vers Bâle, mais pas une étape mineure.",
    reservee: false,
    imageUrl: 'https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?w=800&auto=format',
    gastronomie: {
      description: "La cuisine milanaise est la plus influente d'Italie après la romaine et la napolitaine. Le risotto alla milanese, le cotoletta et l'ossobuco sont connus dans le monde entier — et pourtant, ils sont souvent méconnaissables en dehors de Milan.",
      platsIncontournables: [
        "Risotto alla milanese — risotto safranné, recette du XVIe siècle liée à la construction du Duomo, servi avec ossobuco",
        "Cotoletta alla milanese — côtelette de veau panée dans le beurre clarifié, plus épaisse et plus noble que la Wiener Schnitzel autrichienne",
        "Ossobuco in gremolata — jarret de veau braisé au vin blanc avec gremolata (persil, zeste de citron, ail)",
        "Panettone artigianale — la brioche levée aux fruits confits de Noël, inventée à Milan selon la légende par un apprenti boulanger amoureux"
      ],
      restaurants: [
        {
          nom: "Trattoria Milanese",
          description: "La plus ancienne trattoria de Milan (1933), en plein centre historique. Décor en bois ciré, serveurs en tablier blanc, recettes inchangées depuis des décennies.",
          specialite: "Cotoletta alla milanese con insalata di stagione"
        },
        {
          nom: "Brera Aperitivo",
          description: "Dans le quartier bohème de Brera, un bar à aperitivo typiquement milanais. L'Aperol Spritz a été inventé dans le Veneto mais c'est Milan qui l'a popularisé.",
          specialite: "Aperol Spritz avec buffet de cicchetti gratuit"
        }
      ]
    },
    sites: [
      {
        nom: 'Duomo di Milano',
        description: "La cathédrale gothique de Milan est le résultat de six siècles de travaux continus (1386-1965), le projet collectif le plus long de l'histoire de l'architecture européenne. Elle est la troisième plus grande église catholique du monde, après Saint-Pierre de Rome et la Cathédrale de Séville. Avec ses 135 flèches, ses 3 400 statues extérieures et son pinacle central de 108 m surmonté de la Madonnina dorée, c'est un monument d'une complexité baroque inouïe. La montée sur les toits — à pied ou par ascenseur — offre une promenade entre les flèches et une vue sur les Alpes par temps clair, expérience unique en Europe.",
        dureeVisite: '2h',
        imageUrl: 'https://images.unsplash.com/photo-1561948955-570b270e7c36?w=800&auto=format',
        reservation: { requise: true, lien: 'https://www.duomomilano.it' },
      },
      {
        nom: 'Santa Maria delle Grazie — La Cène',
        description: "La Cène de Léonard de Vinci, peinte entre 1495 et 1498 sur le mur du réfectoire du couvent dominicain Santa Maria delle Grazie, est l'une des œuvres d'art les plus célèbres et les plus étudiées de l'histoire. Contrairement à la fresque traditionnelle, Léonard a peint sur un enduit sec avec des temperas et huiles, permettant un niveau de détail et de sfumato impossible en fresque — mais rendant l'œuvre extrêmement fragile. Le tableau mesure 4,6 × 8,8 mètres. Les 12 apôtres sont représentés au moment où Jésus annonce que l'un d'eux le trahira. La restauration (1978-1999) a révélé des détails inconnus. La visite est limitée à 30 personnes par groupe de 15 minutes — réservation obligatoire des mois à l'avance.",
        dureeVisite: '45min',
        imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format',
        reservation: { requise: true, lien: 'https://www.vivaticket.com/it/biglietto/cenacolo-vinciano/1279' },
      },
    ],
  },
]

export function getEtapeBySlug(slug: string): Etape | undefined {
  return itineraire.find(e => e.slug === slug)
}

export function getElapsedStats(selectedSlug: string): ElapsedStats {
  const idx = itineraire.findIndex(e => e.slug === selectedSlug)
  if (idx === -1) return { jours: 0, km: 0, villes: 0, tempsRoute: 0 }

  const etapesElapsed = itineraire.slice(0, idx + 1)
  const firstDate = new Date(itineraire[0].dates.debut)
  const lastDate = new Date(etapesElapsed[etapesElapsed.length - 1].dates.fin)
  const jours = Math.round((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

  const km = etapesElapsed.reduce((acc, e) => acc + e.distanceKm, 0)
  const tempsRoute = etapesElapsed.reduce((acc, e) => acc + e.driveTimeMin, 0)

  return { jours, km, villes: idx + 1, tempsRoute }
}

export function getRemainingStats(selectedSlug: string): RemainingStats {
  const idx = itineraire.findIndex(e => e.slug === selectedSlug)
  if (idx === -1) return { jours: 0, km: RETOUR_BALE_KM, villes: 0, tempsRoute: RETOUR_BALE_TIME }

  const etapesRemaining = itineraire.slice(idx + 1)
  const lastEtapeDate = new Date(itineraire[itineraire.length - 1].dates.fin)
  const selectedDate = new Date(itineraire[idx].dates.fin)
  const joursTotal = 14
  const joursEcoules = Math.round((selectedDate.getTime() - new Date(itineraire[0].dates.debut).getTime()) / (1000 * 60 * 60 * 24)) + 1
  const jours = joursTotal - joursEcoules

  const km = etapesRemaining.reduce((acc, e) => acc + e.distanceKm, 0) + RETOUR_BALE_KM
  const tempsRoute = etapesRemaining.reduce((acc, e) => acc + e.driveTimeMin, 0) + RETOUR_BALE_TIME

  return { jours, km, villes: etapesRemaining.length, tempsRoute }
}
```

- [ ] **Step 3: Run the itineraire tests to verify**

```bash
source ~/.nvm/nvm.sh && nvm use 20 && cd /home/julienerbland/Documents/Privé/Projets_persos/Road_trip_italy_website && npm run test:run -- __tests__/data/itineraire.test.ts
```

Expected: PASS — all 4 tests green (lengths, required fields, menaggio reserved, reservation links).

- [ ] **Step 4: Commit**

```bash
source ~/.nvm/nvm.sh && nvm use 20 && cd /home/julienerbland/Documents/Privé/Projets_persos/Road_trip_italy_website && git add data/itineraire.ts && git commit -m "feat: expand itinerary data with distances, gastronomy, site images, and rich descriptions"
```

---

## Task 3: Fix CarteGlobale — marker positioning + progressive route + car marker + Basel

**Files:**
- Modify: `components/CarteGlobale.tsx`
- Modify: `app/page.tsx` (add `relative` to map container)

- [ ] **Step 1: Read current files**

Read `components/CarteGlobale.tsx` and `app/page.tsx`.

- [ ] **Step 2: Replace `components/CarteGlobale.tsx`**

```tsx
// components/CarteGlobale.tsx
'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import type { Etape } from '@/types/itineraire'
import { BALE_COORDONNEES } from '@/data/itineraire'

const CAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#c9a84c">
  <path d="M5 11l1.5-4.5h11L19 11M17 16a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-8 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM3 11h18v5H3z"/>
  <path d="M6.5 6.5L5 11h14l-1.5-4.5H6.5z" fill="#1a1a2e"/>
  <rect x="3" y="11" width="18" height="5" rx="1"/>
  <circle cx="7" cy="16" r="1.5" fill="#1a1a2e"/>
  <circle cx="17" cy="16" r="1.5" fill="#1a1a2e"/>
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
      // Route source (will be updated dynamically)
      const initialCoords = [BALE_COORDONNEES, etapes[0].coordonnees]
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

      // Car marker (positioned on first étape initially)
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
```

- [ ] **Step 3: Update map container in `app/page.tsx`**

In `app/page.tsx`, find the map center column div and ensure it has `relative` positioning. The div currently has `className="flex-1 min-h-[300px] md:min-h-0"`. Change it to:

```tsx
{/* Center: map */}
<div className="flex-1 min-h-[300px] md:min-h-0 relative">
  <CarteGlobale
    etapes={itineraire}
    selectedSlug={selectedSlug}
    onEtapeSelect={setSelectedSlug}
  />
</div>
```

- [ ] **Step 4: Run the CarteGlobale test**

```bash
source ~/.nvm/nvm.sh && nvm use 20 && cd /home/julienerbland/Documents/Privé/Projets_persos/Road_trip_italy_website && npm run test:run -- __tests__/components/CarteGlobale.test.tsx
```

Expected: PASS — the container test passes.

- [ ] **Step 5: Commit**

```bash
source ~/.nvm/nvm.sh && nvm use 20 && cd /home/julienerbland/Documents/Privé/Projets_persos/Road_trip_italy_website && git add components/CarteGlobale.tsx app/page.tsx && git commit -m "fix: absolute inset-0 on CarteGlobale, progressive route, car marker, Basel start point"
```

---

## Task 4: Update HeroSection with dynamic dual-row stats

**Files:**
- Modify: `components/HeroSection.tsx`
- Modify: `__tests__/components/HeroSection.test.tsx`
- Modify: `app/page.tsx` (pass selectedSlug to HeroSection)

- [ ] **Step 1: Read current files**

Read `components/HeroSection.tsx`, `__tests__/components/HeroSection.test.tsx`, and `app/page.tsx`.

- [ ] **Step 2: Update `__tests__/components/HeroSection.test.tsx`**

```tsx
// __tests__/components/HeroSection.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import HeroSection from '@/components/HeroSection'

describe('HeroSection', () => {
  it('affiche le titre principal', () => {
    render(<HeroSection selectedSlug={null} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Road Trip Italie')
  })

  it('affiche les dates du voyage', () => {
    render(<HeroSection selectedSlug={null} />)
    expect(screen.getByText(/8 Avril/)).toBeInTheDocument()
    expect(screen.getByText(/21 Avril/)).toBeInTheDocument()
  })

  it('affiche les sections Parcourus et Restants', () => {
    render(<HeroSection selectedSlug="venise" />)
    expect(screen.getByText(/parcourus/i)).toBeInTheDocument()
    expect(screen.getByText(/restants/i)).toBeInTheDocument()
  })

  it('affiche les stats écoulées pour venise', () => {
    render(<HeroSection selectedSlug="venise" />)
    // 5 étapes visited up to venise (bellinzona, menaggio, bergame, verone, venise)
    expect(screen.getByText('5')).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run to verify fail**

```bash
source ~/.nvm/nvm.sh && nvm use 20 && cd /home/julienerbland/Documents/Privé/Projets_persos/Road_trip_italy_website && npm run test:run -- __tests__/components/HeroSection.test.tsx
```

Expected: FAIL — HeroSection doesn't accept selectedSlug prop yet.

- [ ] **Step 4: Replace `components/HeroSection.tsx`**

```tsx
// components/HeroSection.tsx
import { itineraire, getElapsedStats, getRemainingStats } from '@/data/itineraire'

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h${m.toString().padStart(2, '0')}` : `${h}h`
}

type Props = {
  selectedSlug: string | null
}

export default function HeroSection({ selectedSlug }: Props) {
  const activeSlug = selectedSlug ?? itineraire[0].slug
  const elapsed = getElapsedStats(activeSlug)
  const remaining = getRemainingStats(activeSlug)

  return (
    <header className="px-6 py-10 text-center border-b" style={{ borderColor: 'var(--color-border)' }}>
      <p className="text-sm tracking-[0.3em] uppercase mb-3" style={{ color: 'var(--color-gold)' }}>
        Road Trip
      </p>
      <h1
        className="text-4xl md:text-6xl font-bold mb-3"
        style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-cream)' }}
      >
        Road Trip Italie
      </h1>
      <p className="text-lg mb-6" style={{ color: 'var(--color-muted)' }}>
        8 Avril — 21 Avril 2025
      </p>

      {/* Stats row: Parcourus */}
      <div className="mb-3">
        <p className="text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--color-gold)' }}>
          Parcourus
        </p>
        <div className="flex justify-center gap-6 text-sm">
          <Stat value={`${elapsed.jours}`} label="jours" />
          <Stat value={`${elapsed.km} km`} label="parcourus" />
          <Stat value={`${elapsed.villes}`} label="étapes" />
          <Stat value={formatDuration(elapsed.tempsRoute)} label="de route" />
        </div>
      </div>

      {/* Divider */}
      <div className="w-16 mx-auto my-3" style={{ borderTop: '1px solid var(--color-border)' }} />

      {/* Stats row: Restants */}
      <div>
        <p className="text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--color-muted)' }}>
          Restants
        </p>
        <div className="flex justify-center gap-6 text-sm">
          <Stat value={`${remaining.jours}`} label="jours" muted />
          <Stat value={`${remaining.km} km`} label="restants" muted />
          <Stat value={`${remaining.villes}`} label="étapes" muted />
          <Stat value={formatDuration(remaining.tempsRoute)} label="de route" muted />
        </div>
      </div>
    </header>
  )
}

function Stat({ value, label, muted = false }: { value: string; label: string; muted?: boolean }) {
  return (
    <div className="text-center">
      <div
        className="text-xl font-bold"
        style={{
          color: muted ? 'var(--color-muted)' : 'var(--color-gold)',
          fontFamily: 'var(--font-serif)',
        }}
      >
        {value}
      </div>
      <div className="text-xs" style={{ color: 'var(--color-muted)' }}>{label}</div>
    </div>
  )
}
```

- [ ] **Step 5: Update `app/page.tsx` to pass selectedSlug to HeroSection**

In `app/page.tsx`, find `<HeroSection />` and change it to:

```tsx
<HeroSection selectedSlug={selectedSlug} />
```

- [ ] **Step 6: Run tests**

```bash
source ~/.nvm/nvm.sh && nvm use 20 && cd /home/julienerbland/Documents/Privé/Projets_persos/Road_trip_italy_website && npm run test:run -- __tests__/components/HeroSection.test.tsx
```

Expected: PASS (4 tests green).

- [ ] **Step 7: Commit**

```bash
source ~/.nvm/nvm.sh && nvm use 20 && cd /home/julienerbland/Documents/Privé/Projets_persos/Road_trip_italy_website && git add components/HeroSection.tsx __tests__/components/HeroSection.test.tsx app/page.tsx && git commit -m "feat: dynamic hero stats showing elapsed and remaining journey data"
```

---

## Task 5: GastronomieSection component + étape page integration

**Files:**
- Create: `components/GastronomieSection.tsx`
- Create: `__tests__/components/GastronomieSection.test.tsx`
- Modify: `app/etape/[slug]/page.tsx`

- [ ] **Step 1: Write failing test**

Create `__tests__/components/GastronomieSection.test.tsx`:

```tsx
// __tests__/components/GastronomieSection.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import GastronomieSection from '@/components/GastronomieSection'
import type { Gastronomie } from '@/types/itineraire'

const gastronomie: Gastronomie = {
  description: "Cuisine lacustre raffinée du Lac de Côme.",
  platsIncontournables: [
    "Missoltino — agoni du lac séchés",
    "Risotto al pesce persico"
  ],
  restaurants: [
    {
      nom: "Ristorante Il Vapore",
      description: "Sur la promenade du lac.",
      specialite: "Filetti di pesce persico"
    }
  ]
}

const gastronomieNoRestaurants: Gastronomie = {
  description: "Cuisine simple.",
  platsIncontournables: ["Polenta"],
}

describe('GastronomieSection', () => {
  it('affiche le titre Gastronomie', () => {
    render(<GastronomieSection gastronomie={gastronomie} />)
    expect(screen.getByRole('heading', { name: /gastronomie/i })).toBeInTheDocument()
  })

  it('affiche la description', () => {
    render(<GastronomieSection gastronomie={gastronomie} />)
    expect(screen.getByText(/Cuisine lacustre/)).toBeInTheDocument()
  })

  it('affiche tous les plats incontournables', () => {
    render(<GastronomieSection gastronomie={gastronomie} />)
    expect(screen.getByText(/Missoltino/)).toBeInTheDocument()
    expect(screen.getByText(/Risotto al pesce persico/)).toBeInTheDocument()
  })

  it('affiche les restaurants si présents', () => {
    render(<GastronomieSection gastronomie={gastronomie} />)
    expect(screen.getByText('Ristorante Il Vapore')).toBeInTheDocument()
    expect(screen.getByText(/Filetti di pesce persico/)).toBeInTheDocument()
  })

  it('ne crash pas sans restaurants', () => {
    render(<GastronomieSection gastronomie={gastronomieNoRestaurants} />)
    expect(screen.getByText(/Cuisine simple/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run to verify fail**

```bash
source ~/.nvm/nvm.sh && nvm use 20 && cd /home/julienerbland/Documents/Privé/Projets_persos/Road_trip_italy_website && npm run test:run -- __tests__/components/GastronomieSection.test.tsx
```

Expected: FAIL — `Cannot find module '@/components/GastronomieSection'`

- [ ] **Step 3: Create `components/GastronomieSection.tsx`**

```tsx
// components/GastronomieSection.tsx
import type { Gastronomie } from '@/types/itineraire'

export default function GastronomieSection({ gastronomie }: { gastronomie: Gastronomie }) {
  return (
    <section className="mt-10">
      <div className="flex items-center gap-3 mb-4">
        <h2
          className="text-lg font-bold"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-cream)' }}
        >
          Gastronomie
        </h2>
        <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-border)' }} />
      </div>

      <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--color-cream)', opacity: 0.8 }}>
        {gastronomie.description}
      </p>

      {/* Plats incontournables */}
      <div className="mb-6">
        <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--color-gold)' }}>
          Plats incontournables
        </p>
        <ul className="space-y-2">
          {gastronomie.platsIncontournables.map((plat, i) => (
            <li key={i} className="flex gap-2 text-sm" style={{ color: 'var(--color-cream)' }}>
              <span style={{ color: 'var(--color-gold)' }}>✦</span>
              <span>{plat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Restaurants */}
      {gastronomie.restaurants && gastronomie.restaurants.length > 0 && (
        <div>
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--color-gold)' }}>
            Où manger
          </p>
          <div className="space-y-3">
            {gastronomie.restaurants.map(restaurant => (
              <div
                key={restaurant.nom}
                className="rounded-lg p-4"
                style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
              >
                <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--color-cream)' }}>
                  {restaurant.nom}
                </h3>
                <p className="text-xs mb-2" style={{ color: 'var(--color-muted)' }}>
                  {restaurant.description}
                </p>
                <p className="text-xs italic" style={{ color: 'var(--color-gold)' }}>
                  {restaurant.specialite}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
```

- [ ] **Step 4: Run tests**

```bash
source ~/.nvm/nvm.sh && nvm use 20 && cd /home/julienerbland/Documents/Privé/Projets_persos/Road_trip_italy_website && npm run test:run -- __tests__/components/GastronomieSection.test.tsx
```

Expected: PASS (5 tests green).

- [ ] **Step 5: Update `app/etape/[slug]/page.tsx`**

Read the current page file, then:
1. Import `GastronomieSection` from `@/components/GastronomieSection`
2. Add optional site image display in each SiteCard area (display imageUrl if present above the SiteCard)
3. Add `<GastronomieSection gastronomie={etape.gastronomie} />` after the sites section

The updated page structure (relevant additions only — keep all existing code):

```tsx
// At top, add import:
import GastronomieSection from '@/components/GastronomieSection'

// In the sites section, wrap SiteCard with optional image:
{etape.sites.map(site => (
  <div key={site.nom} className="mb-4">
    {site.imageUrl && (
      <div className="relative w-full h-40 rounded-t-lg overflow-hidden">
        <Image
          src={site.imageUrl}
          alt={site.nom}
          fill
          className="object-cover"
        />
      </div>
    )}
    <div className={site.imageUrl ? 'rounded-b-lg overflow-hidden' : ''}>
      <SiteCard site={site} />
    </div>
  </div>
))}

// After the sites section, add:
<GastronomieSection gastronomie={etape.gastronomie} />
```

- [ ] **Step 6: Commit**

```bash
source ~/.nvm/nvm.sh && nvm use 20 && cd /home/julienerbland/Documents/Privé/Projets_persos/Road_trip_italy_website && git add components/GastronomieSection.tsx __tests__/components/GastronomieSection.test.tsx app/etape/ && git commit -m "feat: add GastronomieSection component and integrate into étape pages with site images"
```

---

## Task 6: Final verification

- [ ] **Step 1: Run full test suite**

```bash
source ~/.nvm/nvm.sh && nvm use 20 && cd /home/julienerbland/Documents/Privé/Projets_persos/Road_trip_italy_website && npm run test:run
```

Expected: all tests PASS, no failures.

- [ ] **Step 2: Run production build**

```bash
source ~/.nvm/nvm.sh && nvm use 20 && cd /home/julienerbland/Documents/Privé/Projets_persos/Road_trip_italy_website && npm run build
```

Expected: build succeeds, 9 static pages generated (/ + 8 étapes).

- [ ] **Step 3: Push to GitHub**

```bash
source ~/.nvm/nvm.sh && nvm use 20 && cd /home/julienerbland/Documents/Privé/Projets_persos/Road_trip_italy_website && git push origin main
```

---

## Verification Checklist

1. `npm run test:run` → all tests green
2. `npm run build` → no errors, 9 static pages
3. Homepage: map markers stay fixed when panning (no drift)
4. Selecting an étape in timeline: route line grows from Basel to that étape only
5. Car SVG marker moves to the selected étape
6. Hero shows two rows: "Parcourus" (elapsed) and "Restants" (remaining), updating per selected étape
7. `/etape/venise` → site cards with photos above them, GastronomieSection at bottom
8. `/etape/menaggio` → badge "Réservé ✓", gastronomy with restaurants
