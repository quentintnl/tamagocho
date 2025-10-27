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
    <div className='rounded-3xl bg-gradient-to-br from-fuchsia-blue-100/90 via-white to-lochinvar-100/80 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.14)] ring-1 ring-white/60 backdrop-blur'>
      <p className='text-sm font-semibold uppercase tracking-[0.2em] text-fuchsia-blue-500'>
        Astuce mood
      </p>
      <p className='mt-3 text-base font-medium text-slate-800'>{message}</p>
      <p className='mt-2 text-xs text-slate-600'>
        Observe tes créatures pour débloquer toutes les humeurs et récolter des surprises.
      </p>
    </div>
  )
}
