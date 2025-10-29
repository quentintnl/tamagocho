/**
 * usePurchaseAccessory Hook
 *
 * Application Layer: Gestion de l'achat d'accessoires
 *
 * Responsabilités:
 * - Gérer l'état d'achat (en cours, succès, erreur)
 * - Coordonner l'achat avec le serveur
 * - Gérer les messages de feedback
 *
 * Single Responsibility Principle: Isoler la logique d'achat des accessoires
 * Dependency Inversion: Dépend d'abstractions (actions) plutôt que d'implémentations
 *
 * @module hooks/accessories/use-purchase-accessory
 */

'use client'

import { useState } from 'react'
import { purchaseAccessory } from '@/actions/accessory.actions'

/**
 * Type de message de feedback
 */
interface FeedbackMessage {
  type: 'success' | 'error'
  text: string
}

/**
 * Interface de retour du hook usePurchaseAccessory
 */
interface UsePurchaseAccessoryReturn {
  /** ID de l'accessoire en cours d'achat */
  purchasingId: string | null
  /** Message de feedback à afficher */
  message: FeedbackMessage | null
  /** Fonction pour acheter un accessoire */
  handlePurchase: (accessoryId: string, monsterId: string) => Promise<boolean>
  /** Fonction pour effacer le message */
  clearMessage: () => void
}

/**
 * Hook personnalisé pour gérer l'achat d'accessoires
 *
 * Encapsule toute la logique d'achat pour respecter le principe
 * de responsabilité unique et faciliter les tests.
 *
 * @returns {UsePurchaseAccessoryReturn} État et fonctions de gestion de l'achat
 *
 * @example
 * const { purchasingId, message, handlePurchase } = usePurchaseAccessory()
 *
 * // Acheter un accessoire
 * const success = await handlePurchase('accessory-123', 'monster-456')
 */
export function usePurchaseAccessory (): UsePurchaseAccessoryReturn {
  const [purchasingId, setPurchasingId] = useState<string | null>(null)
  const [message, setMessage] = useState<FeedbackMessage | null>(null)

  /**
   * Effectue l'achat d'un accessoire
   *
   * @param {string} accessoryId - ID de l'accessoire à acheter
   * @param {string} monsterId - ID du monstre concerné
   * @returns {Promise<boolean>} true si l'achat a réussi, false sinon
   */
  const handlePurchase = async (accessoryId: string, monsterId: string): Promise<boolean> => {
    setPurchasingId(accessoryId)
    setMessage(null)

    try {
      const result = await purchaseAccessory(accessoryId, monsterId)

      if (result.success) {
        setMessage({ type: 'success', text: result.message })
        return true
      } else {
        setMessage({ type: 'error', text: result.message })
        return false
      }
    } catch (error) {
      console.error('Erreur lors de l\'achat :', error)
      setMessage({ type: 'error', text: 'Une erreur est survenue lors de l\'achat' })
      return false
    } finally {
      setPurchasingId(null)
      // Auto-effacement du message après 3 secondes
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
  }

  /**
   * Efface le message de feedback
   */
  const clearMessage = (): void => {
    setMessage(null)
  }

  return {
    purchasingId,
    message,
    handlePurchase,
    clearMessage
  }
}

