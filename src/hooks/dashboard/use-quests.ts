import { useMemo } from 'react'
import type { MonsterStats } from './use-monster-stats'

/**
 * Interface définissant une quête du dashboard
 */
export interface Quest {
  /** Identifiant unique de la quête */
  id: string
  /** Libellé descriptif de la quête */
  label: string
  /** Statut de complétion de la quête */
  complete: boolean
}

/**
 * Hook personnalisé pour générer les quêtes quotidiennes du dashboard
 *
 * Responsabilité unique : transformer les statistiques des monstres
 * en liste de quêtes avec leur état de complétion.
 *
 * Les quêtes motivent l'utilisateur à interagir avec l'application :
 * - Créer des monstres
 * - Faire évoluer un monstre
 * - Découvrir différentes humeurs
 *
 * @param {MonsterStats} stats - Statistiques des monstres de l'utilisateur
 * @returns {Quest[]} Liste des quêtes avec leur état de complétion
 *
 * @example
 * const quests = useQuests(stats)
 * // [
 * //   { id: 'create', label: '...', complete: true },
 * //   { id: 'level', label: '...', complete: false },
 * //   { id: 'moods', label: '...', complete: false }
 * // ]
 */
export function useQuests (stats: MonsterStats): Quest[] {
  return useMemo(() => [
    {
      id: 'create',
      label: stats.totalMonsters > 0
        ? 'Imagine une nouvelle créature multicolore'
        : 'Crée ta toute première créature magique',
      complete: stats.totalMonsters > 0
    },
    {
      id: 'level',
      label: "Fais évoluer un compagnon jusqu'au niveau 5",
      complete: stats.highestLevel >= 5
    },
    {
      id: 'moods',
      label: 'Découvre au moins 3 humeurs différentes',
      complete: stats.moodVariety >= 3
    }
  ], [stats.highestLevel, stats.moodVariety, stats.totalMonsters])
}
