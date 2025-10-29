/**
 * useAccessoryEquipment Hook
 *
 * Application Layer: Gestion de l'équipement/déséquipement des accessoires
 *
 * Responsabilités:
 * - Gérer l'état de traitement (en cours d'équipement/déséquipement)
 * - Gérer les messages de feedback utilisateur
 * - Coordonner les actions d'équipement avec le serveur
 *
 * Single Responsibility Principle: Isoler la logique d'équipement des accessoires
 * Dependency Inversion: Dépend d'abstractions (actions) plutôt que d'implémentations
 *
 * @module hooks/accessories/use-accessory-equipment
 */

'use client'

import { useState } from 'react'
import { equipAccessory, removeAccessory } from '@/actions/accessory.actions'

/**
 * Type de message de feedback
 */
interface FeedbackMessage {
  type: 'success' | 'error'
  text: string
}

/**
 * Interface de retour du hook useAccessoryEquipment
 */
interface UseAccessoryEquipmentReturn {
  /** ID de l'accessoire en cours de traitement */
  processingId: string | null
  /** Message de feedback à afficher */
  message: FeedbackMessage | null
  /** Fonction pour équiper/déséquiper un accessoire */
  toggleEquip: (ownedAccessoryId: string, shouldEquip: boolean, monsterId: string) => Promise<boolean>
  /** Fonction pour effacer le message */
  clearMessage: () => void
}

/**
 * Hook personnalisé pour gérer l'équipement des accessoires
 *
 * Sépare la logique métier de l'équipement de la présentation UI,
 * respectant ainsi le principe de responsabilité unique.
 *
 * @returns {UseAccessoryEquipmentReturn} État et fonctions de gestion de l'équipement
 *
 * @example
 * const { processingId, message, toggleEquip, clearMessage } = useAccessoryEquipment()
 *
 * // Équiper un accessoire
 * const success = await toggleEquip('accessory-123', true, 'monster-456')
 *
 * // Effacer le message après affichage
 * clearMessage()
 */
export function useAccessoryEquipment (): UseAccessoryEquipmentReturn {
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [message, setMessage] = useState<FeedbackMessage | null>(null)

  /**
   * Équipe ou déséquipe un accessoire
   *
   * @param {string} ownedAccessoryId - ID de l'accessoire possédé
   * @param {boolean} shouldEquip - true pour équiper, false pour déséquiper
   * @param {string} monsterId - ID du monstre concerné
   * @returns {Promise<boolean>} true si l'opération a réussi, false sinon
   */
  const toggleEquip = async (
    ownedAccessoryId: string,
    shouldEquip: boolean,
    monsterId: string
  ): Promise<boolean> => {
    setProcessingId(ownedAccessoryId)
    setMessage(null)

    try {
      // Appel de l'action appropriée selon le cas
      const result = shouldEquip
        ? await equipAccessory(ownedAccessoryId, monsterId)
        : await removeAccessory(ownedAccessoryId)

      if (result.success) {
        setMessage({ type: 'success', text: result.message })
        return true
      } else {
        setMessage({ type: 'error', text: result.message })
        return false
      }
    } catch (error) {
      console.error('Erreur lors de l\'équipement/déséquipement :', error)
      setMessage({ type: 'error', text: 'Une erreur est survenue' })
      return false
    } finally {
      setProcessingId(null)
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
    processingId,
    message,
    toggleEquip,
    clearMessage
  }
}

