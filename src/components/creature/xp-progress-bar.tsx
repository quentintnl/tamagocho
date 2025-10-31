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
      <div className='flex justify-between items-center mb-3'>
        <span className='text-sm font-black text-forest-800'>
          Expérience{isMaxLevel ? ' - NIVEAU MAX' : ` (Niveau ${currentLevel})`}
        </span>
        {!isMaxLevel && (
          <span className='text-xs font-bold text-forest-600 bg-white/60 px-3 py-1 rounded-full border-2 border-meadow-200/60'>
            {currentXp} / {xpToNextLevel} XP
          </span>
        )}
        {isMaxLevel && (
          <span className='text-xs font-black text-gold-600 bg-gradient-to-r from-gold-100 to-sunset-100 px-3 py-1 rounded-full border-2 border-gold-300/60'>
            ⭐ MAX
          </span>
        )}
      </div>

      {/* Conteneur de la barre de progression */}
      <div className='relative w-full bg-forest-100/50 rounded-full h-5 overflow-hidden shadow-inner border-2 border-white'>
        {/* Barre de progression animée */}
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out flex items-center justify-end px-2 ${
            isMaxLevel
              ? 'bg-gradient-to-r from-gold-400 to-sunset-500'
              : 'bg-gradient-to-r from-meadow-400 to-forest-500'
          }`}
          style={{ width: `${percentage}%` }}
        >
          {/* Effet de brillance */}
          {percentage > 0 && (
            <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse' style={{ animationDuration: '2s' }} />
          )}

          {/* Pourcentage affiché dans la barre si suffisamment de place */}
          {percentage > 20 && (
            <span className='relative text-xs font-black text-white drop-shadow-md'>
              {isMaxLevel ? 'MAX' : `${Math.floor(percentage)}%`}
            </span>
          )}
        </div>
      </div>

      {/* Message de progression */}
      {!isMaxLevel && percentage >= 90 && (
        <p className='text-xs text-gold-600 font-black mt-2 animate-pulse flex items-center gap-1'>
          <span className='text-base'>🎉</span> Presque au niveau suivant !
        </p>
      )}
      {isMaxLevel && (
        <p className='text-xs text-gold-600 font-black mt-2 flex items-center gap-1'>
          <span className='text-base'>🏆</span> Ta créature a atteint le niveau maximum !
        </p>
      )}
    </div>
  )
}
