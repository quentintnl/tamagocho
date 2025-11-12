/**
 * useMonsterAccessories Hook
 *
 * Application Layer: Gestion des accessoires équipés sur un monstre
 *
 * Responsabilités:
 * - Charger les accessoires équipés sur le monstre
 * - Charger les IDs des accessoires possédés par l'utilisateur
 * - Fournir une fonction de rafraîchissement
 *
 * Single Responsibility Principle: Isoler la logique de gestion des accessoires du monstre
 * Interface Segregation: Expose uniquement ce qui est nécessaire
 *
 * @module hooks/monsters/use-monster-accessories
 */

'use client'

import { useState, useEffect } from 'react'
import type { OwnedAccessory } from '@/types/accessory'
import { getMonsterAccessories } from '@/actions/accessory.actions'

/**
 * Interface de retour du hook useMonsterAccessories
 */
interface UseMonsterAccessoriesReturn {
  /** Accessoires équipés sur le monstre */
  equippedAccessories: OwnedAccessory[]
  /** Fonction pour rafraîchir les accessoires */
  refreshAccessories: () => Promise<void>
  /** Indique si le chargement est en cours */
  loading: boolean
}

/**
 * Hook personnalisé pour gérer les accessoires d'un monstre
 *
 * Encapsule la logique de récupération des accessoires équipés sur le monstre.
 *
 * @param {string} monsterId - ID du monstre
 * @param {number} [refreshTrigger] - Trigger optionnel pour forcer le rafraîchissement
 * @returns {UseMonsterAccessoriesReturn} État et fonctions de gestion des accessoires
 *
 * @example
 * const { equippedAccessories, refreshAccessories, loading } = useMonsterAccessories('monster-123')
 *
 * // Rafraîchir après un achat
 * await refreshAccessories()
 *
 * // Ou avec trigger externe
 * const [trigger, setTrigger] = useState(0)
 * const { equippedAccessories } = useMonsterAccessories('monster-123', trigger)
 * setTrigger(t => t + 1) // Force le rafraîchissement
 */
export function useMonsterAccessories (
  monsterId: string,
  refreshTrigger?: number
): UseMonsterAccessoriesReturn {
  const [equippedAccessories, setEquippedAccessories] = useState<OwnedAccessory[]>([])
  const [loading, setLoading] = useState(true)

  /**
   * Récupère les accessoires équipés sur le monstre
   */
  const fetchEquippedAccessories = async (): Promise<void> => {
    try {
      const accessories = await getMonsterAccessories(monsterId)
      setEquippedAccessories(accessories)
    } catch (error) {
      console.error('Erreur lors de la récupération des accessoires équipés :', error)
    }
  }

  /**
   * Rafraîchit les accessoires équipés
   */
  const refreshAccessories = async (): Promise<void> => {
    setLoading(true)
    try {
      await fetchEquippedAccessories()
    } finally {
      setLoading(false)
    }
  }

  // Chargement initial et rafraîchissement sur changement de monsterId ou trigger
  useEffect(() => {
    void refreshAccessories()
  }, [monsterId, refreshTrigger])

  return {
    equippedAccessories,
    refreshAccessories,
    loading
  }
}
