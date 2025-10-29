/**
 * useMonsterData Hook
 *
 * Application Layer: Gestion de l'état et du rafraîchissement des données du monstre
 *
 * Responsabilités:
 * - Gérer l'état actuel du monstre
 * - Rafraîchir les données du monstre depuis le serveur
 * - Gérer l'XP requis pour le niveau suivant
 *
 * Single Responsibility Principle: Isoler la logique de gestion des données du monstre
 * Dependency Inversion: Dépend d'abstractions (API) plutôt que d'implémentations
 *
 * @module hooks/monsters/use-monster-data
 */

'use client'

import { useState, useEffect } from 'react'
import type { PopulatedMonster } from '@/types/monster'

/**
 * Interface de retour du hook useMonsterData
 */
interface UseMonsterDataReturn {
  /** Données actuelles du monstre */
  currentMonster: PopulatedMonster
  /** XP requis pour le niveau suivant */
  xpToNextLevel: number
  /** Fonction pour rafraîchir les données du monstre */
  refreshMonster: () => Promise<void>
}

/**
 * Hook personnalisé pour gérer les données du monstre
 *
 * Encapsule la logique de récupération et de rafraîchissement des données
 * du monstre, incluant le calcul de l'XP au niveau suivant.
 *
 * @param {PopulatedMonster} initialMonster - Données initiales du monstre
 * @returns {UseMonsterDataReturn} État et fonctions de gestion des données
 *
 * @example
 * const { currentMonster, xpToNextLevel, refreshMonster } = useMonsterData(monster)
 *
 * // Rafraîchir après une action
 * await refreshMonster()
 */
export function useMonsterData (initialMonster: PopulatedMonster): UseMonsterDataReturn {
  const [currentMonster, setCurrentMonster] = useState<PopulatedMonster>(initialMonster)
  const [xpToNextLevel, setXpToNextLevel] = useState<number>(0)

  /**
   * Récupère l'XP requis pour le niveau suivant
   */
  const fetchNextLevelXp = async (): Promise<void> => {
    try {
      if (currentMonster.level_id.isMaxLevel) {
        setXpToNextLevel(0)
        return
      }

      const response = await fetch(`/api/xp-levels?level=${currentMonster.level_id.level + 1}`)
      if (response.ok) {
        const nextLevel = await response.json()
        setXpToNextLevel(nextLevel?.xpRequired ?? 0)
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du niveau suivant :', error)
    }
  }

  /**
   * Rafraîchit toutes les données du monstre depuis le serveur
   */
  const refreshMonster = async (): Promise<void> => {
    try {
      const response = await fetch(`/api/monster?id=${currentMonster._id}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      if (response.ok) {
        const updatedMonster: PopulatedMonster = await response.json()
        setCurrentMonster(updatedMonster)
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du monstre :', error)
    }
  }

  // Charger l'XP du niveau suivant au montage et à chaque changement de niveau
  useEffect(() => {
    void fetchNextLevelXp()
  }, [currentMonster.level_id.level, currentMonster.level_id.isMaxLevel])

  return {
    currentMonster,
    xpToNextLevel,
    refreshMonster
  }
}

