/**
 * Composant de barre de progression XP
 *
 * Responsabilité unique : afficher visuellement la progression de l'XP
 * du monstre vers le niveau suivant.
 *
 * Applique les principes :
 * - SRP : Uniquement l'affichage de la barre d'XP
 * - OCP : Extensible via des props pour personnaliser les couleurs
 * - DIP : Dépend des abstractions (props typés)
 */

interface XpProgressBarProps {
  /** XP actuel du monstre */
  currentXp: number
  /** XP nécessaire pour le niveau suivant */
  xpToNextLevel: number
  /** Niveau actuel du monstre */
  currentLevel: number
  /** Indique si c'est le niveau maximum */
  isMaxLevel: boolean
}

/**
 * Calcule le pourcentage de progression vers le niveau suivant
 *
 * @param {number} currentXp - XP actuel
 * @param {number} xpToNextLevel - XP nécessaire pour level up
 * @returns {number} Pourcentage entre 0 et 100
 */
function calculateXpPercentage (currentXp: number, xpToNextLevel: number): number {
  if (xpToNextLevel <= 0) return 100
  return Math.min(100, Math.max(0, (currentXp / xpToNextLevel) * 100))
}

/**
 * Barre de progression XP avec animation fluide
 *
 * @param {XpProgressBarProps} props - Props du composant
 * @returns {React.ReactNode} Barre de progression stylisée
 *
 * @example
 * <XpProgressBar currentXp={75} xpToNextLevel={100} currentLevel={5} isMaxLevel={false} />
 */
export function XpProgressBar ({
  currentXp,
  xpToNextLevel,
  currentLevel,
  isMaxLevel
}: XpProgressBarProps): React.ReactNode {
  // Si niveau max, toujours afficher 100%
  const percentage = isMaxLevel ? 100 : calculateXpPercentage(currentXp, xpToNextLevel)

  return (
    <div className='w-full'>
      {/* En-tête avec label et stats */}
      <div className='flex justify-between items-center mb-2'>
        <span className='text-sm font-semibold text-gray-700'>
          Expérience (Niveau {currentLevel}{isMaxLevel ? ' - MAX' : ''})
        </span>
        {!isMaxLevel && (
          <span className='text-xs text-gray-600'>
            {currentXp} / {xpToNextLevel} XP
          </span>
        )}
        {isMaxLevel && (
          <span className='text-xs text-fuchsia-blue-600 font-bold'>
            ⭐ NIVEAU MAX
          </span>
        )}
      </div>

      {/* Conteneur de la barre de progression */}
      <div className='w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner'>
        {/* Barre de progression animée */}
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out flex items-center justify-end px-2 ${
            isMaxLevel
              ? 'bg-gradient-to-r from-fuchsia-blue-400 to-fuchsia-blue-600'
              : 'bg-gradient-to-r from-lochinvar-400 to-lochinvar-600'
          }`}
          style={{ width: `${percentage}%` }}
        >
          {/* Pourcentage affiché dans la barre si suffisamment de place */}
          {percentage > 15 && (
            <span className='text-xs font-bold text-white drop-shadow-md'>
              {isMaxLevel ? 'MAX' : `${Math.floor(percentage)}%`}
            </span>
          )}
        </div>
      </div>

      {/* Message de progression */}
      {!isMaxLevel && percentage >= 90 && (
        <p className='text-xs text-fuchsia-blue-600 font-semibold mt-1 animate-pulse'>
          🎉 Presque au niveau suivant !
        </p>
      )}
      {isMaxLevel && (
        <p className='text-xs text-fuchsia-blue-600 font-semibold mt-1'>
          🏆 Votre créature a atteint le niveau maximum !
        </p>
      )}
    </div>
  )
}
