/**
 * usePaymentRedirect Hook
 *
 * Application Layer: Gestion des redirections après paiement Stripe
 *
 * Responsabilités:
 * - Détecter les paramètres de retour de paiement dans l'URL
 * - Gérer l'affichage des modaux de succès/erreur
 * - Nettoyer les paramètres URL
 *
 * Single Responsibility Principle: Isoler la logique de gestion des redirections de paiement
 * Interface Segregation: Expose uniquement l'état nécessaire aux composants
 *
 * @module hooks/wallet/use-payment-redirect
 */

'use client'

import { useState, useEffect } from 'react'

/**
 * Interface de retour du hook usePaymentRedirect
 */
interface UsePaymentRedirectReturn {
  /** Indique si le modal de succès doit être affiché */
  showSuccessModal: boolean
  /** Indique si un message d'erreur doit être affiché */
  showErrorMessage: boolean
  /** Fonction pour fermer le modal de succès */
  closeSuccessModal: () => void
  /** Callback appelé après un paiement réussi pour rafraîchir les données */
  onPaymentSuccess: (refreshCallback: () => Promise<void>) => void
}

/**
 * Hook personnalisé pour gérer les redirections après paiement Stripe
 *
 * Détecte les paramètres `success` et `canceled` dans l'URL et gère
 * l'affichage approprié des feedbacks utilisateur.
 *
 * @returns {UsePaymentRedirectReturn} État et fonctions de gestion des redirections
 *
 * @example
 * const { showSuccessModal, closeSuccessModal, onPaymentSuccess } = usePaymentRedirect()
 *
 * onPaymentSuccess(async () => {
 *   await refreshWallet()
 * })
 */
export function usePaymentRedirect (): UsePaymentRedirectReturn {
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorMessage, setShowErrorMessage] = useState(false)

  /**
   * Ferme le modal de succès
   */
  const closeSuccessModal = (): void => {
    setShowSuccessModal(false)
  }

  /**
   * Configure le callback à exécuter après un paiement réussi
   *
   * @param {Function} refreshCallback - Fonction de rafraîchissement à appeler
   */
  const onPaymentSuccess = (refreshCallback: () => Promise<void>): void => {
    if (showSuccessModal) {
      setTimeout(() => {
        void refreshCallback()
      }, 2000)
    }
  }

  // Vérification des paramètres URL au montage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)

    if (urlParams.get('success') === 'true') {
      setShowSuccessModal(true)
      // Nettoyer l'URL
      window.history.replaceState({}, '', '/wallet')
    } else if (urlParams.get('canceled') === 'true') {
      setShowErrorMessage(true)
      // Nettoyer l'URL
      window.history.replaceState({}, '', '/wallet')
    }
  }, [])

  return {
    showSuccessModal,
    showErrorMessage,
    closeSuccessModal,
    onPaymentSuccess
  }
}

