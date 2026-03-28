// data/itineraire.ts
import { Etape } from '@/types/itineraire'

export const itineraire: Etape[] = [
  {
    slug: 'bellinzona',
    ville: 'Bellinzona',
    pays: 'Suisse',
    dates: { debut: '2025-04-08', fin: '2025-04-08' },
    coordonnees: [9.0233, 46.1947],
    description: "Carrefour des Alpes suisses, Bellinzona est gardée par trois châteaux médiévaux classés au Patrimoine mondial de l'UNESCO. Une étape de transition entre la Suisse alémanique et l'Italie.",
    reservee: false,
    imageUrl: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=800&auto=format',
    sites: [
      {
        nom: 'Castelgrande',
        description: "Le plus ancien et le plus imposant des trois châteaux de Bellinzona, dominant la ville depuis un éperon rocheux. Vestige d'une longue histoire de contrôle du passage alpin entre Italie et Europe du Nord.",
        dureeVisite: '1h',
        reservation: { requise: false },
      },
      {
        nom: 'Château de Montebello',
        description: "Second château du site UNESCO, offrant une vue panoramique sur la vallée du Tessin. Son musée archéologique retrace l'histoire médiévale de la région.",
        dureeVisite: '45min',
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
    description: "Niché sur la rive occidentale du lac de Côme, Menaggio est l'un des plus beaux villages du lac. Ses ruelles colorées, sa promenade lacustre et la vue sur les sommets enneigés en font un cadre idyllique.",
    reservee: true,
    imageUrl: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=800&auto=format',
    sites: [
      {
        nom: 'Villa Carlotta (Tremezzo)',
        description: "L'une des plus belles villas du lac de Côme, célèbre pour ses jardins en terrasses. En avril, les azalées et rhododendrons sont en pleine floraison — spectacle exceptionnel.",
        dureeVisite: '2h',
        reservation: { requise: true, lien: 'https://www.villacarlotta.it' },
      },
      {
        nom: 'Bellagio',
        description: "Surnommée la « Perle du lac de Côme », Bellagio se dresse sur le promontoire qui sépare les deux branches du lac. Ses ruelles escarpées et ses villas aristocratiques en font l'un des bourgs les plus romantiques d'Italie.",
        dureeVisite: 'Demi-journée',
        reservation: { requise: false },
      },
      {
        nom: 'Varenna',
        description: 'Pittoresque village de pêcheurs sur la rive orientale du lac, accessible en ferry depuis Menaggio. La Villa Monastero et ses jardins botaniques sont incontournables.',
        dureeVisite: 'Demi-journée',
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
    description: "Bergame est une ville double : la Città Bassa moderne en plaine et la Città Alta médiévale perchée sur une colline, ceinte de remparts vénitiens classés UNESCO. Un bijou méconnu du nord de l'Italie.",
    reservee: false,
    imageUrl: 'https://images.unsplash.com/photo-1569880153113-76e33fc52d5f?w=800&auto=format',
    sites: [
      {
        nom: 'Città Alta — Remparts vénitiens',
        description: "Classés au Patrimoine mondial UNESCO en 2017, les remparts du XVIe siècle construits par la République de Venise ceinturent la ville haute sur 6 kilomètres. La balade sur les murailles offre une vue sur la plaine du Pô.",
        dureeVisite: '1h30',
        reservation: { requise: false },
      },
      {
        nom: 'Basilique Santa Maria Maggiore',
        description: "Chef-d'œuvre de l'art roman lombard du XIIe siècle. L'intérieur est recouvert de tapisseries et de fresques somptueuses. Gaetano Donizetti y est enterré.",
        dureeVisite: '45min',
        reservation: { requise: false },
      },
      {
        nom: 'Cappella Colleoni',
        description: "Joyau de la Renaissance lombarde érigé au XVe siècle. La façade polychrome en marbre blanc, rose et rouge est l'une des plus belles d'Italie du Nord.",
        dureeVisite: '30min',
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
    description: "Vérone est une ville d'une beauté exceptionnelle, inscrite au Patrimoine mondial UNESCO. Immortalisée par Shakespeare comme le cadre de Roméo et Juliette, elle possède l'un des amphithéâtres romains les mieux conservés au monde.",
    reservee: false,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format',
    sites: [
      {
        nom: 'Arena di Verona',
        description: "Amphithéâtre romain du Ier siècle, troisième plus grand du monde avec 15 000 places. Encore utilisé aujourd'hui pour un festival d'opéra en plein air mondialement célèbre chaque été.",
        dureeVisite: '1h30',
        reservation: { requise: true, lien: 'https://www.arena.it/it/arena/biglietti' },
      },
      {
        nom: "Casa di Giulietta",
        description: "La maison de Juliette avec son célèbre balcon est le site le plus visité de Vérone. Le lieu est chargé de la magie du mythe shakespearien.",
        dureeVisite: '30min',
        reservation: { requise: true, lien: 'https://www.tourism.verona.it' },
      },
      {
        nom: 'Castelvecchio',
        description: "Forteresse médiévale du XIVe siècle des Scaliger, reconvertie en musée d'art par Carlo Scarpa. Un chef-d'œuvre d'architecture muséale qui dialogue avec l'histoire du bâtiment.",
        dureeVisite: '1h30',
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
    description: "Venise, la Sérénissime, est une ville unique au monde : construite sur 118 îlots reliés par 400 ponts, sans voiture, avec ses canaux comme rues. Chef-d'œuvre de l'art et de l'architecture, inscrite au Patrimoine mondial UNESCO.",
    reservee: false,
    imageUrl: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&auto=format',
    sites: [
      {
        nom: 'Palais des Doges',
        description: "Symbole de la puissance de la République de Venise pendant mille ans. Ce chef-d'œuvre gothique abrite les appartements des Doges, les salles du Conseil et les célèbres Prisons des Plombs où Casanova fut enfermé.",
        dureeVisite: '2h30',
        reservation: { requise: true, lien: 'https://palazzoducale.visitmuve.it' },
      },
      {
        nom: 'Basilique Saint-Marc',
        description: "Édifiée au IXe siècle pour abriter les reliques de Saint Marc, cette basilique est un éblouissant mélange de styles byzantin, roman et gothique. Ses mosaïques dorées couvrent 8 000 m² de voûtes.",
        dureeVisite: '1h30',
        reservation: { requise: true, lien: 'https://www.basilicasanmarco.it' },
      },
      {
        nom: "Galerie de l'Académie",
        description: "Le plus grand musée d'art de Venise réunit les chefs-d'œuvre de la peinture vénitienne du XIVe au XVIIIe siècle : Bellini, Giorgione, Titien, Tintoret, Véronèse.",
        dureeVisite: '2h',
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
    description: "Padoue est une ville universitaire d'une grande richesse artistique, avec la plus ancienne université du monde occidental (1222). Elle abrite l'un des plus grands chefs-d'œuvre de l'histoire de l'art : les fresques de Giotto à la Chapelle des Scrovegni.",
    reservee: false,
    imageUrl: 'https://images.unsplash.com/photo-1515542706656-8e4f53022b0e?w=800&auto=format',
    sites: [
      {
        nom: 'Chapelle des Scrovegni',
        description: "Les fresques peintes par Giotto entre 1304 et 1306 représentent une révolution dans l'histoire de l'art : pour la première fois, les personnages sont représentés avec humanité et émotion, annonçant la Renaissance. La visite est limitée à 25 personnes à la fois — réservation indispensable.",
        dureeVisite: '45min',
        reservation: { requise: true, lien: 'https://www.cappelladegliscrovegni.it' },
      },
      {
        nom: 'Basilique Saint-Antoine',
        description: "L'une des plus importantes basiliques du monde catholique, lieu de pèlerinage majeur abritant le tombeau de Saint Antoine de Padoue. Le complexe mêle roman, gothique et byzantin.",
        dureeVisite: '1h',
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
    description: "Sirmione s'avance sur une étroite péninsule de 4 km au cœur du Lac de Garde, le plus grand lac d'Italie. Ce site habité depuis l'Antiquité abrite des vestiges romains, un château médiéval et des sources thermales.",
    reservee: false,
    imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&auto=format',
    sites: [
      {
        nom: 'Rocca Scaligera',
        description: "Forteresse médiévale du XIIIe siècle des Scaliger, construite directement sur l'eau du lac. Depuis ses tours, la vue panoramique sur le Lac de Garde est exceptionnelle.",
        dureeVisite: '1h',
        reservation: { requise: false },
      },
      {
        nom: 'Grotte di Catullo',
        description: "Les plus grandes ruines romaines d'Italie du Nord, attribuées à la villa du poète latin Catulle (Ier siècle av. J.-C.). Le site archéologique surplombe le lac depuis la pointe de la péninsule.",
        dureeVisite: '1h30',
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
    description: "Capitale économique et culturelle de l'Italie, Milan est une étape de transition entre le Lac de Garde et Bâle. Sa cathédrale gothique, la plus grande d'Italie, est incontournable.",
    reservee: false,
    imageUrl: 'https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?w=800&auto=format',
    sites: [
      {
        nom: 'Duomo di Milano',
        description: "La cathédrale gothique de Milan est la deuxième plus grande église catholique du monde. Sa façade ornée de 3 400 statues et ses 135 flèches constituent un spectacle unique. La montée sur les toits offre une vue sur les Alpes par temps clair.",
        dureeVisite: '1h30',
        reservation: { requise: true, lien: 'https://www.duomomilano.it' },
      },
      {
        nom: 'Quartier des Navigli',
        description: "L'ancien réseau de canaux de Milan, conçu par Léonard de Vinci, est aujourd'hui le quartier le plus animé de la ville. Les Navigli Grande et Pavese sont bordés de restaurants et galeries d'art.",
        dureeVisite: '1h',
        reservation: { requise: false },
      },
    ],
  },
]

export function getEtapeBySlug(slug: string): Etape | undefined {
  return itineraire.find(e => e.slug === slug)
}
