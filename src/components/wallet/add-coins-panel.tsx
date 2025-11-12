/**
 * AddCoinsPanel Component
 *
 * Presentation Layer: Panneau d'ajout de monnaie
 *
 * Responsabilités:
 * - Afficher les montants prédéfinis disponibles à l'achat
 * - Gérer le clic sur un montant pour initier l'achat
 * - Afficher l'état de chargement pendant le traitement
 *
 * Single Responsibility Principle: Affichage du panneau d'achat uniquement
 * Open/Closed Principle: Extensible via les props
 *
 * @module components/wallet/add-coins-panel
 */

import type React from 'react'
import Button from '@/components/button'
import TomatokenIcon from '@/components/tomatoken-icon'

/**
 * Props pour le composant AddCoinsPanel
 */
interface AddCoinsPanelProps {
  /** Montants prédéfinis disponibles à l'achat */
  presetAmounts: number[]
  /** Callback appelé lors du clic sur un montant */
  onAmountClick: (amount: number) => Promise<void>
  /** Indique si un achat est en cours de traitement */
  isProcessing: boolean
}

/**
 * Composant de panneau d'ajout de monnaie
 *
 * Affiche une grille de boutons avec les montants prédéfinis disponibles
 * pour l'achat de koins. Désactive les boutons pendant le traitement.
 *
 * @param {AddCoinsPanelProps} props - Props du composant
 * @returns {React.ReactNode} Panneau d'achat de koins
 *
 * @example
 * <AddCoinsPanel
 *   presetAmounts={[100, 500, 1000]}
 *   onAmountClick={handleBuyKoins}
 *   isProcessing={false}
 * />
 */
export function AddCoinsPanel ({
  presetAmounts,
  onAmountClick,
  isProcessing
}: AddCoinsPanelProps): React.ReactNode {
  return (
    <div className='bg-white rounded-2xl shadow-lg p-8 border border-gray-100'>
      <h2 className='text-2xl font-bold text-gray-800 mb-6'>
        Ajouter des Tomatokens
      </h2>

      <div className='space-y-6'>
        {/* Montants prédéfinis */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-3'>
            Choisissez un montant pour acheter
          </label>
          <div className='grid grid-cols-3 gap-2'>
            {presetAmounts.map((amount) => (
              <Button
                key={amount}
                onClick={() => { void onAmountClick(amount) }}
                disabled={isProcessing}
                variant='outline'
                size='md'
              >
                {isProcessing
                  ? '...'
                  : (
                    <span className='flex items-center gap-1'>
                      {amount} <TomatokenIcon size='sm' />
                    </span>
                    )}
              </Button>
            ))}
          </div>
        </div>

        {/* Note explicative */}
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
          <p className='text-sm text-blue-800'>
            <span className='font-medium'>💡 Info :</span> Cliquez sur un montant pour être redirigé vers le paiement sécurisé Stripe.
          </p>
        </div>
      </div>
    </div>
  )
}
