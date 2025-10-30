/**
 * Props pour le composant StatsCard
 */
interface StatsCardProps {
  /** Titre de la statistique */
  title: string
  /** Valeur numérique ou textuelle de la statistique */
  value: number | string
  /** Description complémentaire */
  description: string
  /** Couleur thématique pour la bordure (lochinvar, fuchsia-blue, moccaccino) */
  color: 'lochinvar' | 'fuchsia-blue' | 'moccaccino'
  /** Si true, la carte prend toute la largeur disponible */
  fullWidth?: boolean
}

/**
 * Carte d'affichage d'une statistique
 *
 * Responsabilité unique : afficher une statistique avec son titre,
 * sa valeur et sa description dans un style cohérent.
 *
 * @param {StatsCardProps} props - Props du composant
 * @returns {React.ReactNode} Carte de statistique stylisée
 *
 * @example
 * <StatsCard
 *   title="Compagnons"
 *   value={5}
 *   description="Monstres prêts pour l'aventure"
 *   color="lochinvar"
 * />
 */
export function StatsCard ({
  title,
  value,
  description,
  color,
  fullWidth = false
}: StatsCardProps): React.ReactNode {
  // Mapping des couleurs aux classes Tailwind - thème nature
  const ringColorClass = {
    lochinvar: 'ring-meadow-200/60',
    'fuchsia-blue': 'ring-sky-200/60',
    moccaccino: 'ring-lavender-200/60'
  }[color]

  const textColorClass = {
    lochinvar: 'text-meadow-600',
    'fuchsia-blue': 'text-sky-600',
    moccaccino: 'text-lavender-600'
  }[color]

  const widthClass = fullWidth ? 'sm:col-span-2' : ''

  return (
    <div
      className={`rounded-2xl bg-white/90 backdrop-blur-sm p-4 shadow-[0_12px_30px_rgba(22,101,52,0.1)] ring-1 ${ringColorClass} hover:shadow-lg transition-shadow ${widthClass}`}
    >
      <p className={`text-xs font-semibold uppercase tracking-wide ${textColorClass}`}>
        {title}
      </p>
      <p className='mt-2 text-3xl font-black text-forest-800'>
        {value}
      </p>
      <p className='text-xs text-forest-600'>
        {description}
      </p>
    </div>
  )
}
