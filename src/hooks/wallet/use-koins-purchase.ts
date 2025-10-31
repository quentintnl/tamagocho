/**
 * useKoinsPurchase Hook
 *
 * Application Layer: Gestion de l'achat de koins via Stripe
 *
 * Responsabilités:
 * - Créer une session de paiement Stripe
 * - Gérer l'état de chargement pendant la création
 * - Rediriger vers Stripe Checkout
 * - Gérer les erreurs de paiement
 *
 * Single Responsibility Principle: Isoler la logique d'achat de koins
 * Dependency Inversion: Dépend de l'API (abstraction) plutôt que d'implémentation directe
 *
 * @module hooks/wallet/use-koins-purchase
 */

'use client'

import { useState } from 'react'
import { showErrorToast } from '@/lib/toast'

/**
 * Type de message de feedback
 */
interface FeedbackMessage {
  type: 'success' | 'error'
  text: string
}

/**
 * Interface de retour du hook useKoinsPurchase
 */
interface UseKoinsPurchaseReturn {
  /** Indique si un achat est en cours */
  isProcessing: boolean
  /** Message de feedback à afficher */
  message: FeedbackMessage | null
  /** Fonction pour initier l'achat de koins */
  buyKoins: (amount: number) => Promise<void>
}

/**
 * Hook personnalisé pour gérer l'achat de koins
 *
 * Encapsule toute la logique de création de session Stripe et de redirection
 * pour respecter le principe de responsabilité unique.
 *
 * @returns {UseKoinsPurchaseReturn} État et fonctions de gestion de l'achat
 *
 * @example
 * const { isProcessing, message, buyKoins } = useKoinsPurchase()
 *
 * // Acheter 100 koins
 * await buyKoins(100)
 */
export function useKoinsPurchase (): UseKoinsPurchaseReturn {
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState<FeedbackMessage | null>(null)

  /**
   * Initie l'achat de koins via Stripe
   *
   * @param {number} amount - Montant de koins à acheter
   */
  const buyKoins = async (amount: number): Promise<void> => {
    setIsProcessing(true)
    setMessage(null)

    try {
      const response = await fetch('/api/checkout/sessions', {
        method: 'POST',
        body: JSON.stringify({ amount })
      })
      const data = await response.json()

      if (data.url !== null && data.url !== undefined) {
        // Redirection vers Stripe Checkout
        window.location.href = data.url
      } else {
        const errorMsg = 'Erreur lors de la création de la session de paiement'
        setMessage({
          type: 'error',
          text: errorMsg
        })
        showErrorToast(errorMsg)
        setIsProcessing(false)
      }
    } catch (error) {
      console.error('Erreur lors de l\'achat de koins :', error)
      const errorMsg = 'Une erreur est survenue lors de la redirection vers Stripe'
      setMessage({
        type: 'error',
        text: errorMsg
      })
      showErrorToast(errorMsg)
      setIsProcessing(false)
    }
  }

  return {
    isProcessing,
    message,
    buyKoins
  }
}
