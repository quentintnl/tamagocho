/**
 * Quests Tips - Section astuces pour les quêtes
 *
 * Composant réutilisable pour afficher les astuces avec support skeleton
 */

interface QuestsTipsProps {
  show: boolean | null
}

/**
 * Composant pour afficher les astuces
 *
 * @param {QuestsTipsProps} props - Props du composant
 * @returns {React.ReactNode} Section astuces
 */
export function QuestsTips ({ show }: QuestsTipsProps): React.ReactNode {
  if (show === null) {
    // Skeleton mode
    return (
      <div className="mt-12 relative overflow-hidden rounded-3xl bg-gradient-to-br from-lavender-100 via-white to-fuchsia-blue-100 p-6 shadow-xl border-4 border-white/80 animate-pulse">
        <div className="h-7 bg-lavender-200/50 rounded w-32 mb-3" />
        <ul className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-lavender-500 mt-1">•</span>
              <div className="h-4 bg-lavender-200/50 rounded w-full" />
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (!show) return null

  return (
    <div className="mt-12 relative overflow-hidden rounded-3xl bg-gradient-to-br from-lavender-100 via-white to-fuchsia-blue-100 p-6 shadow-xl border-4 border-white/80">
      {/* Motif décoratif de fond */}
      <div className='absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br from-lavender-300/40 to-fuchsia-blue-300/30 blur-2xl' aria-hidden='true' />
      <div className='absolute -left-8 -bottom-8 h-24 w-24 rounded-full bg-gradient-to-tr from-sky-300/30 to-meadow-300/20 blur-2xl' aria-hidden='true' />

      <div className='relative space-y-4'>
        {/* En-tête avec icône */}
        <div className='flex items-center gap-3'>
          <div className='flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-br from-lavender-400 to-fuchsia-blue-500 shadow-lg border-2 border-white text-2xl transform hover:rotate-12 transition-transform'>
            💡
          </div>
          <h3 className="text-xl font-black text-forest-800">
            Astuces & Conseils
          </h3>
        </div>

        {/* Liste des astuces */}
        <ul className="space-y-3 text-sm">
          <li className="flex items-start gap-3 bg-white/80 backdrop-blur-sm rounded-xl p-3 border-2 border-lavender-200/60 shadow-sm">
            <span className="flex-shrink-0 text-lg">🔄</span>
            <span className='text-forest-700 font-medium'>Les quêtes se renouvellent automatiquement chaque jour à <strong className='text-gold-600'>minuit</strong></span>
          </li>
          <li className="flex items-start gap-3 bg-white/80 backdrop-blur-sm rounded-xl p-3 border-2 border-lavender-200/60 shadow-sm">
            <span className="flex-shrink-0 text-lg">🎯</span>
            <span className='text-forest-700 font-medium'>Plus la difficulté est élevée, plus les <strong className='text-gold-600'>récompenses</strong> sont importantes</span>
          </li>
          <li className="flex items-start gap-3 bg-white/80 backdrop-blur-sm rounded-xl p-3 border-2 border-lavender-200/60 shadow-sm">
            <span className="flex-shrink-0 text-lg">💾</span>
            <span className='text-forest-700 font-medium'>Votre progression est <strong className='text-meadow-600'>sauvegardée automatiquement</strong></span>
          </li>
          <li className="flex items-start gap-3 bg-white/80 backdrop-blur-sm rounded-xl p-3 border-2 border-lavender-200/60 shadow-sm">
            <span className="flex-shrink-0 text-lg">⏰</span>
            <span className='text-forest-700 font-medium'>N'oubliez pas de réclamer vos récompenses avant <strong className='text-sunset-600'>minuit</strong> !</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

