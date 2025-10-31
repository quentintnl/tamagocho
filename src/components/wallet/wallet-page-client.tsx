/**
 * Wallet Page Client Component
 *
 * Presentation Layer: Page de gestion du wallet
 *
 * Responsabilités:
 * - Orchestrer l'affichage du solde et des options d'achat
 * - Coordonner les hooks pour la gestion du paiement
 * - Gérer les redirections après paiement Stripe
 *
 * Single Responsibility Principle: Orchestre uniquement l'interface de gestion du wallet
 * Open/Closed Principle: Extensible via les composants enfants
 * Dependency Inversion: Dépend des hooks (abstractions) pour la logique métier
 *
 * @module components/wallet/wallet-page-client
 */

'use client'

import { useEffect } from 'react'
import { useWallet } from '@/hooks/useWallet'
import { usePaymentRedirect, useKoinsPurchase } from '@/hooks/wallet'
import PageHeaderWithWallet from '@/components/page-header-with-wallet'
import SuccessModal from '@/components/wallet/success-modal'
import { WalletBalance } from './wallet-balance'
import { AddCoinsPanel } from './add-coins-panel'
import { pricingTable } from '@/config/pricing'
import type { authClient } from '@/lib/auth-client'
import { showErrorToast } from '@/lib/toast'

type Session = typeof authClient.$Infer.Session

/**
 * Props pour le composant WalletPageClient
 */
interface WalletPageClientProps {
  /** Session utilisateur Better Auth */
  session: Session
}

/**
 * Composant client de la page wallet
 *
 * Orchestre l'affichage du solde, des options d'achat et gère les redirections
 * après paiement. Délègue la logique métier aux hooks personnalisés.
 *
 * @param {WalletPageClientProps} props - Props du composant
 * @returns {React.ReactNode} Page complète de gestion du wallet
 *
 * @example
 * <WalletPageClient session={session} />
 */
export default function WalletPageClient ({ session }: WalletPageClientProps): React.ReactNode {
  // Hooks pour la gestion de l'état
  const { wallet, isLoading, refresh } = useWallet()
  const { showSuccessModal, showErrorMessage, closeSuccessModal, onPaymentSuccess } = usePaymentRedirect()
  const { isProcessing, message, buyKoins } = useKoinsPurchase()

  // Montants prédéfinis (récupérés dynamiquement depuis pricing.ts)
  const presetAmounts = Object.keys(pricingTable).map(Number)

  /**
   * Configure le rafraîchissement du wallet après un paiement réussi
   */
  useEffect(() => {
    onPaymentSuccess(refresh)
  }, [showSuccessModal])

  /**
   * Affiche un toast lorsque le paiement est annulé
   */
  useEffect(() => {
    if (showErrorMessage) {
      showErrorToast('Paiement annulé', { autoClose: 5000 })
    }
  }, [showErrorMessage])

  /**
   * Gère le clic sur un montant pour acheter des koins
   *
   * @param {number} amount - Montant de koins à acheter
   */
  const handleBuyKoins = async (amount: number): Promise<void> => {
    await buyKoins(amount)
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-moccaccino-50 via-white to-lochinvar-50'>
      {/* Modal de succès avec confettis */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={closeSuccessModal}
        title='Paiement réussi !'
        message='Vos coins seront ajoutés dans quelques instants. Merci pour votre achat ! 🎉'
      />

      {/* Header avec wallet */}
      <PageHeaderWithWallet title='Mon Wallet' />

      <main className='container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl'>
        {/* Message de notification pour les erreurs générales */}
        {(message !== null && message.type === 'error') && (
          <div className='mb-6 p-4 rounded-lg border bg-red-50 border-red-200 text-red-800'>
            <p className='font-medium'>
              {message.text}
            </p>
          </div>
        )}

        <div className='grid gap-8 md:grid-cols-2'>
          {/* Carte d'affichage du solde */}
          <WalletBalance
            wallet={wallet}
            session={session}
            isLoading={isLoading}
          />

          {/* Carte d'ajout de monnaie */}
          <AddCoinsPanel
            presetAmounts={presetAmounts}
            onAmountClick={handleBuyKoins}
            isProcessing={isProcessing}
          />
        </div>
      </main>
    </div>
  )
}
