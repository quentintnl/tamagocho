/**
 * Props pour le composant ModalOverlay
 */
interface ModalOverlayProps {
  /** Callback appelé lors du clic sur l'overlay (en dehors du contenu) */
  onClose: () => void
  /** Contenu du modal */
  children: React.ReactNode
}

/**
 * Overlay de fond pour les modaux
 *
 * Responsabilité unique : gérer l'overlay de fond cliquable
 * qui permet de fermer le modal en cliquant en dehors.
 *
 * @param {ModalOverlayProps} props - Props du composant
 * @returns {React.ReactNode} Overlay avec gestion du clic
 *
 * @example
 * <ModalOverlay onClose={handleClose}>
 *   <div>Modal content</div>
 * </ModalOverlay>
 */
export function ModalOverlay ({ onClose, children }: ModalOverlayProps): React.ReactNode {
  /**
   * Ferme le modal uniquement si on clique sur l'overlay
   * et pas sur le contenu du modal
   */
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4'
      onClick={handleOverlayClick}
      role='dialog'
      aria-modal='true'
      aria-labelledby='modal-title'
    >
      {children}
    </div>
  )
}
