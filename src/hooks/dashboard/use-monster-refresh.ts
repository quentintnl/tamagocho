/**
 * useMonsterRefresh Hook
 *
 * Application Layer: Gestion du rafraîchissement automatique des monstres
 *
 * Responsabilités:
 * - Rafraîchir périodiquement la liste des monstres depuis le serveur
 * - Nettoyer l'intervalle lors du démontage du composant
 *
 * Single Responsibility Principle: Isoler la logique de rafraîchissement automatique
 * Interface Segregation: Expose uniquement la fonction de mise à jour nécessaire
 *
 * @module hooks/dashboard/use-monster-refresh
 */

'use client'

import { useState, useEffect } from 'react'
import type { PopulatedMonster } from '@/types/monster'

/**
 * Interface de retour du hook useMonsterRefresh
 */
interface UseMonsterRefreshReturn {
  /** Liste actuelle des monstres */
  monsters: PopulatedMonster[]
}

/**
 * Hook personnalisé pour rafraîchir périodiquement les monstres
 *
 * Met en place un intervalle pour récupérer les monstres mis à jour
 * depuis le serveur toutes les secondes.
 *
 * @param {PopulatedMonster[]} initialMonsters - Liste initiale des monstres
 * @param {number} intervalMs - Intervalle de rafraîchissement en millisecondes (défaut: 1000)
 * @returns {UseMonsterRefreshReturn} Liste mise à jour des monstres
 *
 * @example
 * const { monsters } = useMonsterRefresh(initialMonsters, 1000)
 */
export function useMonsterRefresh (
  initialMonsters: PopulatedMonster[],
  intervalMs: number = 1000
): UseMonsterRefreshReturn {
  const [monsters, setMonsters] = useState<PopulatedMonster[]>(initialMonsters)

  /**
   * Récupère la liste mise à jour des monstres depuis le serveur
   */
  const fetchMonsters = async (): Promise<void> => {
    try {
      const response = await fetch('/api/monsters')
      if (response.ok) {
        const updatedMonsters: PopulatedMonster[] = await response.json()
        setMonsters(updatedMonsters)
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement des monstres :', error)
    }
  }

  // Met en place l'intervalle de rafraîchissement
  useEffect(() => {
    const interval = setInterval(() => {
      void fetchMonsters()
    }, intervalMs)

    // Nettoyage de l'intervalle lors du démontage
    return () => clearInterval(interval)
  }, [intervalMs])

  return { monsters }
}

