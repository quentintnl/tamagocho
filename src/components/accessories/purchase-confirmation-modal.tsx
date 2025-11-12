/**
 * Purchase Confirmation Modal
 *
 * Modal de confirmation pour l'achat d'accessoires
 * Responsabilité unique : afficher les détails de l'achat et demander confirmation
 */

import { ModalOverlay } from '@/components/dashboard/modal-overlay'
import Button from '@/components/button'
import type { Accessory } from '@/types/accessory'
import TomatokenIcon from '@/components/tomatoken-icon'

/**
 * Props pour le composant PurchaseConfirmationModal
 */
interface PurchaseConfirmationModalProps {
  /** Accessoire à acheter */
  accessory: Accessory
  /** Callback appelé lors de la confirmation */
  onConfirm: () => void
  /** Callback appelé lors de l'annulation */
  onCancel: () => void
  /** Solde actuel de l'utilisateur */
  currentBalance: number
  /** Indique si l'achat est en cours */
  isLoading?: boolean
}

/**
 * Modal de confirmation d'achat d'accessoire
 *
 * Applique SRP en se concentrant uniquement sur l'affichage
 * et la confirmation de l'achat.
 *
 * @param {PurchaseConfirmationModalProps} props - Props du composant
 * @returns {React.ReactNode} Modal de confirmation
 *
 * @example
 * <PurchaseConfirmationModal
 *   accessory={accessory}
 *   onConfirm={handleConfirm}
 *   onCancel={handleCancel}
 *   currentBalance={500}
 * />
 */
export function PurchaseConfirmationModal ({
  accessory,
  onConfirm,
  onCancel,
  currentBalance,
  isLoading = false
}: PurchaseConfirmationModalProps): React.ReactNode {
  const canAfford = currentBalance >= accessory.price
  const remainingBalance = currentBalance - accessory.price

  return (
    <ModalOverlay onClose={onCancel}>
      <div className='w-full max-w-md transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all'>
        {/* Header */}
        <div className='bg-gradient-to-br from-moccaccino-500 to-moccaccino-600 px-6 py-6'>
          <div className='flex items-center justify-center mb-4'>
            <div className='text-6xl'>{accessory.icon}</div>
          </div>
          <h3
            id='modal-title'
            className='text-center text-2xl font-bold text-white'
          >
            Confirmer l&apos;achat
          </h3>
        </div>

        {/* Content */}
        <div className='px-6 py-6'>
          {/* Accessory Info */}
          <div className='mb-6 text-center'>
            <p className='text-xl font-semibold text-slate-900 mb-2'>
              {accessory.name}
            </p>
            <p className='text-sm text-slate-600 mb-4'>
              {accessory.description}
            </p>
            <div className='inline-flex items-center gap-2 px-4 py-2 bg-moccaccino-50 rounded-full'>
              <TomatokenIcon size='lg' />
              <span className='text-xl font-bold text-moccaccino-600'>
                {accessory.price}
              </span>
              <span className='text-sm text-slate-600'>gochoCoins</span>
            </div>
          </div>

          {/* Balance Info */}
          <div className='mb-6 space-y-2 bg-slate-50 rounded-xl p-4'>
            <div className='flex justify-between text-sm'>
              <span className='text-slate-600'>Solde actuel</span>
              <span className='font-semibold text-slate-900 flex items-center gap-1'>
                {currentBalance} <TomatokenIcon size='sm' />
              </span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-slate-600'>Prix</span>
              <span className='font-semibold text-moccaccino-600 flex items-center gap-1'>
                - {accessory.price} <TomatokenIcon size='sm' />
              </span>
            </div>
            <div className='h-px bg-slate-200' />
            <div className='flex justify-between text-sm'>
              <span className='font-semibold text-slate-700'>Solde restant</span>
              <span
                className={`font-bold flex items-center gap-1 ${
                  canAfford ? 'text-lochinvar-600' : 'text-red-600'
                }`}
              >
                {remainingBalance} <TomatokenIcon size='sm' />
              </span>
            </div>
          </div>

          {/* Info Message */}
          <div className='mb-6 rounded-xl bg-blue-50 p-4 border border-blue-100'>
            <div className='flex gap-3'>
              <span className='text-2xl'>ℹ️</span>
              <p className='text-sm text-blue-900'>
                L&apos;accessoire sera ajouté à votre inventaire et pourra être équipé à vos monstres depuis la page monstre.
              </p>
            </div>
          </div>

          {/* Insufficient Balance Warning */}
          {!canAfford && (
            <div className='mb-6 rounded-xl bg-red-50 p-4 border border-red-100'>
              <div className='flex gap-3'>
                <span className='text-2xl'>⚠️</span>
                <p className='text-sm text-red-900 font-medium'>
                  Solde insuffisant ! Il vous manque {accessory.price - currentBalance} gochoCoins.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className='flex gap-3'>
            <Button
              onClick={onCancel}
              variant='outline'
              size='lg'
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              onClick={onConfirm}
              variant='primary'
              size='lg'
              disabled={!canAfford || isLoading}
            >
              {isLoading
                ? (
                  <span className='flex items-center gap-2'>
                    <span className='inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                    Achat en cours...
                  </span>
                  )
                : (
                    canAfford ? 'Acheter' : 'Solde insuffisant'
                  )}
            </Button>
          </div>
        </div>
      </div>
    </ModalOverlay>
  )
}
