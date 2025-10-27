/**
 * Barrel export pour tous les hooks du dashboard
 *
 * Facilite l'import centralisé des hooks personnalisés
 * utilisés dans les composants du dashboard.
 */

export { useUserDisplay } from './use-user-display'
export type { UserDisplay } from './use-user-display'

export {
  useMonsterStats,
  useLatestAdoptionLabel,
  useFavoriteMoodMessage
} from './use-monster-stats'
export type { MonsterStats } from './use-monster-stats'

export { useQuests } from './use-quests'
export type { Quest } from './use-quests'
