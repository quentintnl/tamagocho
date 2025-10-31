/**
 * Quests Header - En-tête de la section quêtes
 *
 * Composant réutilisable pour afficher l'en-tête avec bouton actualiser
 */

interface QuestsHeaderProps {
  title: string | null
  onRefresh?: () => void
  isLoading?: boolean
}

/**
 * Composant pour afficher l'en-tête des quêtes
 *
 * @param {QuestsHeaderProps} props - Props du composant
 * @returns {React.ReactNode} En-tête des quêtes
 */
export function QuestsHeader ({ title, onRefresh, isLoading = false }: QuestsHeaderProps): React.ReactNode {
  return (
    <div className='flex items-center justify-between mb-6'>
      {title === null
        ? <div className='h-10 bg-gradient-to-r from-gold-200/50 to-sunset-200/50 rounded-xl w-64 animate-pulse' />
        : (
          <div className='flex items-center gap-3'>
            <div className='flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-br from-gold-400 to-sunset-500 shadow-lg border-2 border-white text-2xl'>
              🎯
            </div>
            <h2 className='text-3xl font-black text-forest-800'>{title}</h2>
          </div>
          )}

      {onRefresh !== undefined && (
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className={`
            px-4 py-2 rounded-xl font-bold text-white shadow-md transition-all duration-200
            ${isLoading
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-meadow-400 to-forest-500 hover:from-meadow-500 hover:to-forest-600 hover:shadow-lg hover:scale-105 border-2 border-white/60'
            }
          `}
        >
          {isLoading ? '⏳ Chargement...' : '🔄 Actualiser'}
        </button>
      )}
    </div>
  )
}
