/**
 * Toast Utilities
 *
 * Infrastructure Layer: Centralized toast notification system
 *
 * Responsibilities:
 * - Provide consistent toast styling and behavior
 * - Abstract toast library implementation
 * - Apply consistent options across the app
 *
 * Single Responsibility: Toast notifications configuration and helpers
 */

import { toast, type ToastOptions, type Id } from 'react-toastify'

/**
 * Options par défaut pour tous les toasts
 */
const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'light'
}

/**
 * Affiche un toast de succès
 *
 * @param message - Message à afficher
 * @param options - Options supplémentaires pour personnaliser le toast
 * @returns ID du toast pour pouvoir le manipuler si nécessaire
 */
export function showSuccessToast (message: string, options?: ToastOptions): Id {
  return toast.success(message, {
    ...defaultOptions,
    ...options
  })
}

/**
 * Affiche un toast d'erreur
 *
 * @param message - Message d'erreur à afficher
 * @param options - Options supplémentaires pour personnaliser le toast
 * @returns ID du toast pour pouvoir le manipuler si nécessaire
 */
export function showErrorToast (message: string, options?: ToastOptions): Id {
  return toast.error(message, {
    ...defaultOptions,
    autoClose: 5000, // Les erreurs restent un peu plus longtemps
    ...options
  })
}

/**
 * Affiche un toast d'information
 *
 * @param message - Message informatif à afficher
 * @param options - Options supplémentaires pour personnaliser le toast
 * @returns ID du toast pour pouvoir le manipuler si nécessaire
 */
export function showInfoToast (message: string, options?: ToastOptions): Id {
  return toast.info(message, {
    ...defaultOptions,
    ...options
  })
}

/**
 * Affiche un toast d'avertissement
 *
 * @param message - Message d'avertissement à afficher
 * @param options - Options supplémentaires pour personnaliser le toast
 * @returns ID du toast pour pouvoir le manipuler si nécessaire
 */
export function showWarningToast (message: string, options?: ToastOptions): Id {
  return toast.warning(message, {
    ...defaultOptions,
    ...options
  })
}

/**
 * Affiche un toast de chargement
 *
 * @param message - Message de chargement à afficher
 * @returns ID du toast pour pouvoir le mettre à jour
 */
export function showLoadingToast (message: string): Id {
  return toast.loading(message, {
    ...defaultOptions
  })
}

/**
 * Met à jour un toast existant
 *
 * @param toastId - ID du toast à mettre à jour
 * @param message - Nouveau message
 * @param type - Type de toast ('success' | 'error' | 'info' | 'warning')
 */
export function updateToast (
  toastId: Id,
  message: string,
  type: 'success' | 'error' | 'info' | 'warning' = 'success'
): void {
  toast.update(toastId, {
    render: message,
    type,
    isLoading: false,
    autoClose: type === 'error' ? 5000 : 3000,
    ...defaultOptions
  })
}

/**
 * Ferme un toast spécifique
 *
 * @param toastId - ID du toast à fermer
 */
export function dismissToast (toastId: Id): void {
  toast.dismiss(toastId)
}

/**
 * Ferme tous les toasts
 */
export function dismissAllToasts (): void {
  toast.dismiss()
}

/**
 * Affiche un toast d'erreur à partir d'une exception
 * Extrait le message de l'erreur de manière sûre
 *
 * @param error - Erreur à afficher
 * @param fallbackMessage - Message par défaut si l'erreur n'a pas de message
 */
export function showErrorFromException (
  error: unknown,
  fallbackMessage: string = 'Une erreur inattendue est survenue'
): Id {
  const message = error instanceof Error ? error.message : fallbackMessage
  return showErrorToast(message)
}

