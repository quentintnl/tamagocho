import { getStateLabel } from '@/lib/utils'

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
    <div className='flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0'>
      <span className='text-gray-600 font-medium'>{label}</span>
      <span className='text-gray-900 font-bold'>{value}</span>
    </div>
  )
}

/**
 * Props pour le composant CreatureStatsPanel
 */
interface CreatureStatsPanelProps {
  /** Niveau du monstre */
  level: number
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
 * du monstre dans un panneau formaté.
 *
 * Applique SRP en déléguant l'affichage de chaque stat à StatItem.
 *
 * @param {CreatureStatsPanelProps} props - Props du composant
 * @returns {React.ReactNode} Panneau de statistiques
 *
 * @example
 * <CreatureStatsPanel
 *   level={5}
 *   state="happy"
 *   createdAt="2025-10-27T10:00:00Z"
 *   updatedAt="2025-10-27T12:00:00Z"
 * />
 */
export function CreatureStatsPanel ({
  level,
  state,
  createdAt,
  updatedAt
}: CreatureStatsPanelProps): React.ReactNode {
  return (
    <div className='bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border-4 border-moccaccino-200'>
      <h2 className='text-2xl font-bold text-moccaccino-600 mb-4'>
        Statistiques
      </h2>
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
  )
}
