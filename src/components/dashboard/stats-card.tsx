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
  /** Emoji icon pour la carte */
  icon?: string
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
 *   icon="🌱"
 * />
 */
export function StatsCard ({
  title,
  value,
  description,
  color,
  fullWidth = false,
  icon = '✨'
}: StatsCardProps): React.ReactNode {
  // Mapping des couleurs aux classes Tailwind - thème nature/fruits
  const bgGradientClass = {
    lochinvar: 'from-meadow-100 via-white to-forest-50',
    'fuchsia-blue': 'from-sky-100 via-white to-lavender-50',
    moccaccino: 'from-sunset-100 via-white to-gold-50'
  }[color]

  const borderColorClass = {
    lochinvar: 'border-meadow-200/80',
    'fuchsia-blue': 'border-sky-200/80',
    moccaccino: 'border-sunset-200/80'
  }[color]

  const iconBgClass = {
    lochinvar: 'from-meadow-400 to-forest-500',
    'fuchsia-blue': 'from-sky-400 to-lavender-500',
    moccaccino: 'from-sunset-400 to-gold-500'
  }[color]

  const textColorClass = {
    lochinvar: 'text-meadow-700',
    'fuchsia-blue': 'text-sky-700',
    moccaccino: 'text-sunset-700'
  }[color]

  const widthClass = fullWidth ? 'col-span-2 md:col-span-3' : ''

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${bgGradientClass} p-5 shadow-lg border-2 ${borderColorClass} hover:shadow-xl hover:scale-105 transition-all duration-300 ${widthClass}`}
    >
      {/* Motif de fond subtil */}
      <div className='absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/30 blur-xl' aria-hidden='true' />

      <div className='relative flex items-start gap-4'>
        {/* Icône */}
        <div className={`flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br ${iconBgClass} shadow-lg text-2xl border-2 border-white/80 transform hover:rotate-12 transition-transform`}>
          {icon}
        </div>

        {/* Contenu */}
        <div className='flex-1 min-w-0'>
          <p className={`text-xs font-bold uppercase tracking-wider ${textColorClass}`}>
            {title}
          </p>
          <p className='mt-1.5 text-3xl font-black text-forest-800 leading-none truncate'>
            {value}
          </p>
          <p className='mt-1.5 text-xs text-forest-600 font-medium leading-tight'>
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}
