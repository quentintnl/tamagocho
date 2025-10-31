import { getStateLabel } from '@/lib/utils'
import { XpProgressBar } from './xp-progress-bar'

/**
 * Props pour le composant StatItem
 */
interface StatItemProps {
  /** Label de la statistique */
  label: string
  /** Valeur de la statistique */
  value: string
}

/**
 * Élément de statistique (ligne label/valeur)
 *
 * Responsabilité unique : afficher une paire label/valeur
 * dans un format de ligne de statistique.
 *
 * @param {StatItemProps} props - Props du composant
 * @returns {React.ReactNode} Ligne de statistique
 *
 * @example
 * <StatItem label="Niveau" value="5" />
 */
export function StatItem ({ label, value }: StatItemProps): React.ReactNode {
  return (
    <div className='flex justify-between items-center py-3 px-4 rounded-xl bg-white/60 backdrop-blur-sm border-2 border-meadow-200/40 hover:border-meadow-300/60 transition-all'>
      <span className='text-forest-600 font-bold text-sm'>{label}</span>
      <span className='text-forest-800 font-black text-base'>{value}</span>
    </div>
  )
}

/**
 * Props pour le composant CreatureStatsPanel
 */
interface CreatureStatsPanelProps {
  /** Niveau du monstre */
  level: number
  /** XP actuel du monstre */
  xp: number
  /** XP nécessaire pour le niveau suivant */
  xpToNextLevel: number
  /** Indique si c'est le niveau maximum */
  isMaxLevel: boolean
  /** État du monstre */
  state: string
  /** Date de création (timestamp ou string) */
  createdAt: string | Date
  /** Date de dernière mise à jour (timestamp ou string) */
  updatedAt: string | Date
}

/**
 * Panneau d'affichage des statistiques du monstre
 *
 * Responsabilité unique : afficher toutes les statistiques
 * du monstre dans un panneau formaté, incluant la barre XP.
 *
 * Applique SRP en déléguant l'affichage de chaque stat à StatItem
 * et la barre XP à XpProgressBar.
 *
 * @param {CreatureStatsPanelProps} props - Props du composant
 * @returns {React.ReactNode} Panneau de statistiques
 *
 * @example
 * <CreatureStatsPanel
 *   level={5}
 *   xp={75}
 *   xpToNextLevel={100}
 *   state="happy"
 *   createdAt="2025-10-27T10:00:00Z"
 *   updatedAt="2025-10-27T12:00:00Z"
 * />
 */
export function CreatureStatsPanel ({
  level,
  xp,
  xpToNextLevel,
  isMaxLevel,
  state,
  createdAt,
  updatedAt
}: CreatureStatsPanelProps): React.ReactNode {
  return (
    <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-meadow-100 via-white to-forest-50 p-6 shadow-xl border-4 border-white/90'>
      {/* Motif décoratif */}
      <div className='absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/30 blur-xl' aria-hidden='true' />

      <div className='relative'>
        {/* En-tête */}
        <div className='flex items-center gap-3 mb-6'>
          <div className='flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-br from-meadow-400 to-forest-500 shadow-lg border-2 border-white text-2xl'>
            📊
          </div>
          <h2 className='text-2xl font-black text-forest-800'>
            Statistiques
          </h2>
        </div>

        {/* Barre de progression XP */}
        <div className='mb-6'>
          <XpProgressBar
            currentXp={xp}
            xpToNextLevel={xpToNextLevel}
            currentLevel={level}
            isMaxLevel={isMaxLevel}
          />
        </div>

        <div className='space-y-3'>
          <StatItem label='Niveau' value={level.toString()} />
          <StatItem label='État' value={getStateLabel(state)} />
          <StatItem
            label='Date de création'
            value={new Date(createdAt).toLocaleDateString('fr-FR')}
          />
          <StatItem
            label='Dernière mise à jour'
            value={new Date(updatedAt).toLocaleDateString('fr-FR')}
          />
        </div>
      </div>
    </div>
  )
}
