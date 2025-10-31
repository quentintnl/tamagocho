/**
 * Props pour le composant MoodTipSection
 */
interface MoodTipSectionProps {
  /** Message personnalisé basé sur l'humeur favorite */
  message: string
}

/**
 * Section affichant l'astuce d'humeur personnalisée
 *
 * Responsabilité unique : afficher un conseil basé sur
 * l'humeur dominante des monstres de l'utilisateur.
 *
 * @param {MoodTipSectionProps} props - Props du composant
 * @returns {React.ReactNode} Section d'astuce mood
 *
 * @example
 * <MoodTipSection message={favoriteMoodMessage} />
 */
export function MoodTipSection ({ message }: MoodTipSectionProps): React.ReactNode {
  return (
    <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-lavender-100 via-fuchsia-blue-50 to-sky-100 p-6 shadow-xl border-4 border-white/80 hover:shadow-2xl transition-shadow duration-300'>
      {/* Motifs décoratifs de fond */}
      <div className='absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-lavender-300/40 to-fuchsia-blue-300/30 blur-2xl' aria-hidden='true' />
      <div className='absolute -left-8 -bottom-8 h-28 w-28 rounded-full bg-gradient-to-tr from-sky-300/30 to-meadow-300/20 blur-2xl' aria-hidden='true' />

      <div className='relative space-y-4'>
        {/* En-tête avec icône */}
        <div className='flex items-center gap-3'>
          <div className='flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-br from-lavender-400 to-fuchsia-blue-500 shadow-lg border-2 border-white text-2xl transform hover:rotate-12 transition-transform'>
            💡
          </div>
          <div>
            <p className='text-xs font-bold uppercase tracking-wider text-lavender-700'>
              Astuce du jour
            </p>
            <p className='text-sm font-black text-forest-800'>
              État d'Humeur
            </p>
          </div>
        </div>

        {/* Message principal */}
        <div className='rounded-2xl bg-white/80 backdrop-blur-sm p-4 border-2 border-lavender-200/60 shadow-md'>
          <p className='text-base font-bold text-forest-800 leading-relaxed'>
            {message}
          </p>
        </div>

        {/* Sous-texte informatif */}
        <div className='flex items-start gap-2 text-xs text-forest-600'>
          <span className='text-base flex-shrink-0'>🎯</span>
          <p className='leading-relaxed'>
            Observe tes créatures pour débloquer toutes les humeurs et récolter des <strong className='text-gold-600'>surprises</strong> !
          </p>
        </div>
      </div>
    </div>
  )
}
