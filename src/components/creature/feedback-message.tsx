/**
 * FeedbackMessage Component
 *
 * Presentation Layer: Affiche un message de feedback utilisateur
 *
 * Responsabilités:
 * - Afficher un message de succès ou d'erreur avec le style approprié
 * - Fournir un retour visuel clair à l'utilisateur
 *
 * Single Responsibility Principle: Affichage unique de messages de feedback
 * Open/Closed Principle: Extensible via les props sans modification du composant
 *
 * @module components/creature/feedback-message
 */

import type React from 'react'

/**
 * Props pour le composant FeedbackMessage
 */
interface FeedbackMessageProps {
  /** Type de message (succès ou erreur) */
  type: 'success' | 'error'
  /** Texte du message à afficher */
  text: string
}

/**
 * Composant d'affichage de message de feedback
 *
 * Affiche un message avec le style approprié selon le type (succès/erreur).
 * Respecte le principe de responsabilité unique en ne gérant que l'affichage.
 *
 * @param {FeedbackMessageProps} props - Props du composant
 * @returns {React.ReactNode} Message stylisé
 *
 * @example
 * <FeedbackMessage type="success" text="Accessoire équipé avec succès !" />
 * <FeedbackMessage type="error" text="Solde insuffisant" />
 */
export function FeedbackMessage ({ type, text }: FeedbackMessageProps): React.ReactNode {
  const isSuccess = type === 'success'

  return (
    <div
      className={`mb-4 p-3 rounded-lg border-2 ${
        isSuccess
          ? 'bg-lochinvar-50 border-lochinvar-300 text-lochinvar-800'
          : 'bg-moccaccino-50 border-moccaccino-300 text-moccaccino-800'
      }`}
      role='alert'
      aria-live='polite'
    >
      {text}
    </div>
  )
}

