/**
 * Quests Footer - Footer informatif pour les quêtes
 *
 * Composant réutilisable pour afficher le footer avec support skeleton
 */

interface QuestsFooterProps {
  text: string | null
}

/**
 * Composant pour afficher le footer des quêtes
 *
 * @param {QuestsFooterProps} props - Props du composant
 * @returns {React.ReactNode} Footer des quêtes
 */
export function QuestsFooter ({ text }: QuestsFooterProps): React.ReactNode {
  return (
    <div className="mt-8">
      {text === null
        ? (
          <div className="bg-gradient-to-r from-lavender-200/50 to-sky-200/50 rounded-2xl p-4 animate-pulse">
            <div className="h-5 bg-lavender-300/50 rounded w-80 mx-auto" />
          </div>
        )
        : (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-lavender-100 via-sky-100 to-meadow-100 p-4 border-2 border-white shadow-md">
            <div className='absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/30 blur-xl' aria-hidden='true' />
            <p className="relative text-center text-base font-bold text-forest-700 flex items-center justify-center gap-2">
              <span className='text-xl'>🌙</span>
              {text}
            </p>
          </div>
        )}
    </div>
  )
}

