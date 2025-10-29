/**
 * Wallet Page Client Component
 *
 * Presentation Layer: Page de gestion du wallet
 *
 * Responsibilities:
 * - Afficher le solde actuel
 * - Permettre d'ajouter de la monnaie
 * - Afficher l'historique des transactions (optionnel)
 *
 * Single Responsibility: Interface de gestion du wallet
 */

'use client'

import { useState } from 'react'
import { useWallet } from '@/hooks/useWallet'
import Button from '@/components/button'
import PageHeaderWithWallet from '@/components/page-header-with-wallet'
import type { authClient } from '@/lib/auth-client'

type Session = typeof authClient.$Infer.Session

interface WalletPageClientProps {
  session: Session
}

/**
 * Composant client de la page wallet
 */
export default function WalletPageClient ({ session }: WalletPageClientProps): React.ReactNode {
  const { wallet, isLoading } = useWallet()
  const [isAdding, setIsAdding] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Montants prédéfinis
  const presetAmounts = [10, 25, 50, 100, 500]

  /**
   * Redirige vers Stripe pour acheter des koins
   */
  const handleBuyKoins = async (amount: number): Promise<void> => {
    setIsAdding(true)
    setMessage(null)

    try {
      const response = await fetch('/api/checkout/sessions', {
        method: 'POST',
        body: JSON.stringify({ amount })
      })
      const data = await response.json()

      if (data.url !== null && data.url !== undefined) {
        // Redirection vers Stripe
        window.location.href = data.url
      } else {
        setMessage({ type: 'error', text: 'Erreur lors de la création de la session de paiement' })
        setIsAdding(false)
      }
    } catch (error) {
      console.error('Erreur:', error)
      setMessage({ type: 'error', text: 'Une erreur est survenue lors de la redirection vers Stripe' })
      setIsAdding(false)
    }
  }


  return (
    <div className='min-h-screen bg-gradient-to-br from-moccaccino-50 via-white to-lochinvar-50'>
      {/* Header avec wallet */}
      <PageHeaderWithWallet
        title='Mon Wallet'
        showBackButton={true}
        backUrl='/dashboard'
      />

      <main className='container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl'>
        {/* Message de notification */}
        {message !== null && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <p className='font-medium'>{message.text}</p>
          </div>
        )}

        <div className='grid gap-8 md:grid-cols-2'>
          {/* Carte d'affichage du solde */}
          <div className='bg-white rounded-2xl shadow-lg p-8 border border-gray-100'>
            <h2 className='text-2xl font-bold text-gray-800 mb-6'>
              Solde actuel
            </h2>

            {isLoading ? (
              <div className='animate-pulse'>
                <div className='h-20 bg-gray-200 rounded-lg mb-4' />
                <div className='h-4 bg-gray-200 rounded w-3/4' />
              </div>
            ) : (
              <>
                {/* Affichage du solde */}
                <div className='mb-6'>
                  <div className='flex items-center justify-center gap-4 p-6 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl border-2 border-yellow-300 shadow-inner'>
                    <div className='flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-lg'>
                      <span className='text-3xl'>💰</span>
                    </div>
                    <div className='text-center'>
                      <p className='text-5xl font-bold text-gray-800'>
                        {wallet?.coin.toLocaleString() ?? 0}
                      </p>
                      <p className='text-sm text-gray-600 mt-1'>pièces</p>
                    </div>
                  </div>
                </div>

                {/* Informations utilisateur */}
                <div className='space-y-2 text-sm text-gray-600'>
                  <p>
                    <span className='font-medium'>Compte :</span> {session.user.name ?? session.user.email}
                  </p>
                  <p>
                    <span className='font-medium'>Dernière mise à jour :</span>{' '}
                    {wallet?.updatedAt
                      ? new Date(wallet.updatedAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'N/A'
                    }
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Carte d'ajout de monnaie */}
          <div className='bg-white rounded-2xl shadow-lg p-8 border border-gray-100'>
            <h2 className='text-2xl font-bold text-gray-800 mb-6'>
              Ajouter de la monnaie
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
                      onClick={async () => { await handleBuyKoins(amount) }}
                      disabled={isAdding}
                      variant='outline'
                      size='md'
                    >
                      {isAdding ? '...' : `${amount} 💰`}
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
        </div>


        {/* Bouton retour vers le dashboard */}
        <div className='mt-8 text-center'>
          <Button
            variant='ghost'
            size='md'
            onClick={() => { window.location.href = '/dashboard' }}
          >
            ← Retour au Dashboard
          </Button>
        </div>
      </main>
    </div>
  )
}

