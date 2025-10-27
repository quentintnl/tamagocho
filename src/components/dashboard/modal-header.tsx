import Button from '../button'

/**
 * Props pour le composant ModalHeader
 */
interface ModalHeaderProps {
  /** Titre du modal */
  title: string
  /** Callback appelé lors du clic sur le bouton de fermeture */
  onClose: () => void
}

/**
 * En-tête de modal avec titre et bouton de fermeture
 *
 * Responsabilité unique : afficher le titre du modal
 * et fournir un bouton de fermeture.
 *
 * @param {ModalHeaderProps} props - Props du composant
 * @returns {React.ReactNode} En-tête de modal
 *
 * @example
 * <ModalHeader
 *   title="Créer une nouvelle créature"
 *   onClose={handleClose}
 * />
 */
export function ModalHeader ({ title, onClose }: ModalHeaderProps): React.ReactNode {
  return (
    <div className='mb-6 flex items-center justify-between gap-4'>
      <h2 className='text-2xl font-bold text-gray-900' id='modal-title'>
        {title}
      </h2>
      <Button onClick={onClose} size='sm' type='button' variant='ghost'>
        Fermer
      </Button>
    </div>
  )
}
