/**
 * useOwnedAccessories Hook
 *
 * Application Layer: Gestion de l'état des accessoires possédés par l'utilisateur
 *
 * Responsabilités:
 * - Charger les accessoires possédés depuis le serveur
 * - Gérer l'état de chargement
 * - Fournir une fonction de rafraîchissement
 *
 * Single Responsibility Principle: Isoler la logique de récupération des accessoires
 * Interface Segregation: Expose uniquement ce qui est nécessaire aux composants
 *
 * @module hooks/accessories/use-owned-accessories
 */

'use client'

import { useState, useEffect } from 'react'
import type { OwnedAccessory } from '@/types/accessory'
import { getUserOwnedAccessories } from '@/actions/accessory.actions'

/**
 * Interface de retour du hook useOwnedAccessories
 */
interface UseOwnedAccessoriesReturn {
  /** Liste des accessoires possédés */
  ownedAccessories: OwnedAccessory[]
  /** État de chargement */
  loading: boolean
  /** Fonction pour rafraîchir la liste */
  refresh: () => Promise<void>
}

/**
 * Hook personnalisé pour gérer les accessoires possédés
 *
 * Encapsule la logique de récupération et de mise à jour des accessoires
 * pour respecter le principe de responsabilité unique.
 *
 * @returns {UseOwnedAccessoriesReturn} État et fonctions de gestion des accessoires
 *
 * @example
 * const { ownedAccessories, loading, refresh } = useOwnedAccessories()
 *
 * // Rafraîchir après un achat
 * await refresh()
 */
export function useOwnedAccessories (): UseOwnedAccessoriesReturn {
  const [ownedAccessories, setOwnedAccessories] = useState<OwnedAccessory[]>([])
  const [loading, setLoading] = useState(true)

  /**
   * Récupère les accessoires possédés depuis le serveur
   * Fonction réutilisable pour le chargement initial et le rafraîchissement
   */
  const fetchOwnedAccessories = async (): Promise<void> => {
    try {
      setLoading(true)
      const accessories = await getUserOwnedAccessories()
      if (accessories !== null) {
        setOwnedAccessories(accessories)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des accessoires :', error)
    } finally {
      setLoading(false)
    }
  }

  // Chargement initial
  useEffect(() => {
    void fetchOwnedAccessories()
  }, [])

  return {
    ownedAccessories,
    loading,
    refresh: fetchOwnedAccessories
  }
}

