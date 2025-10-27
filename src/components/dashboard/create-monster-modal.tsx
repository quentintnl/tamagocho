'use client'

import CreateMonsterForm from '../forms/create-monster-form'
import type { CreateMonsterFormValues } from '@/types/forms/create-monster-form'
import { ModalOverlay } from './modal-overlay'
import { ModalHeader } from './modal-header'

/**
 * Props pour le composant CreateMonsterModal
 */
interface CreateMonsterModalProps {
  /** État d'ouverture du modal */
  isOpen: boolean
  /** Callback appelé lors de la fermeture du modal */
  onClose: () => void
  /** Callback appelé lors de la soumission du formulaire */
  onSubmit: (values: CreateMonsterFormValues) => void
}

/**
 * Modal de création d'un nouveau monstre
 *
 * Responsabilité unique : afficher le formulaire de création de monstre
 * dans un modal avec overlay cliquable.
 *
 * Applique le principe SRP en déléguant :
 * - La gestion de l'overlay à ModalOverlay
 * - La gestion de l'en-tête à ModalHeader
 * - La gestion du formulaire à CreateMonsterForm
 *
 * @param {CreateMonsterModalProps} props - Props du composant
 * @returns {React.ReactNode | null} Modal ou null si fermé
 *
 * @example
 * <CreateMonsterModal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   onSubmit={handleSubmit}
 * />
 */
function CreateMonsterModal ({ isOpen, onClose, onSubmit }: CreateMonsterModalProps): React.ReactNode {
  // Ne pas rendre le modal s'il est fermé
  if (!isOpen) return null

  /**
   * Gère la soumission du formulaire et ferme le modal
   * @param {CreateMonsterFormValues} values - Valeurs du formulaire validées
   */
  const handleSubmit = (values: CreateMonsterFormValues): void => {
    onSubmit(values)
    onClose()
  }

  return (
    <ModalOverlay onClose={onClose}>
      <div className='w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-moccaccino-100'>
        <ModalHeader
          title='Créer une nouvelle créature'
          onClose={onClose}
        />
        <CreateMonsterForm
          onCancel={onClose}
          onSubmit={handleSubmit}
        />
      </div>
    </ModalOverlay>
  )
}

export type { CreateMonsterFormValues }
export default CreateMonsterModal
