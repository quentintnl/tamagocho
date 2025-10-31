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
import { getMonsterAccessories, getUserOwnedAccessoryIds } from '@/actions/accessory.actions'

/**
 * Interface de retour du hook useMonsterAccessories
 */
interface UseMonsterAccessoriesReturn {
  /** Accessoires équipés sur le monstre */
  equippedAccessories: OwnedAccessory[]
  /** IDs des accessoires possédés par l'utilisateur */
  ownedAccessoryIds: string[]
  /** Fonction pour rafraîchir les accessoires */
  refreshAccessories: () => Promise<void>
}

/**
 * Hook personnalisé pour gérer les accessoires d'un monstre
 *
 * Encapsule la logique de récupération des accessoires équipés
 * et des accessoires possédés par l'utilisateur.
 *
 * @param {string} monsterId - ID du monstre
 * @returns {UseMonsterAccessoriesReturn} État et fonctions de gestion des accessoires
 *
 * @example
 * const { equippedAccessories, ownedAccessoryIds, refreshAccessories } = useMonsterAccessories('monster-123')
 *
 * // Rafraîchir après un achat
 * await refreshAccessories()
 */
export function useMonsterAccessories (monsterId: string): UseMonsterAccessoriesReturn {
  const [equippedAccessories, setEquippedAccessories] = useState<OwnedAccessory[]>([])
  const [ownedAccessoryIds, setOwnedAccessoryIds] = useState<string[]>([])

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
   * Récupère les IDs des accessoires possédés par l'utilisateur
   */
  const fetchOwnedAccessoryIds = async (): Promise<void> => {
    try {
      const ids = await getUserOwnedAccessoryIds()
      setOwnedAccessoryIds(ids)
    } catch (error) {
      console.error('Erreur lors de la récupération des accessoires possédés :', error)
    }
  }

  /**
   * Rafraîchit tous les accessoires (équipés et possédés)
   */
  const refreshAccessories = async (): Promise<void> => {
    await Promise.all([
      fetchEquippedAccessories(),
      fetchOwnedAccessoryIds()
    ])
  }

  // Chargement initial
  useEffect(() => {
    void refreshAccessories()
  }, [monsterId])

  return {
    equippedAccessories,
    ownedAccessoryIds,
    refreshAccessories
  }
}
