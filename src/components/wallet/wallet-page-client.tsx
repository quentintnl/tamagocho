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
import { addCoinsToWallet } from '@/actions/wallet.actions'
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
  const { wallet, isLoading, refresh } = useWallet()
  const [addAmount, setAddAmount] = useState<number>(10)
  const [isAdding, setIsAdding] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Montants prédéfinis
  const presetAmounts = [10, 25, 50, 100, 500]

  /**
   * Ajoute de la monnaie au wallet
   */
  const handleAddCoins = async (): Promise<void> => {
    if (addAmount <= 0) {
      setMessage({ type: 'error', text: 'Le montant doit être positif' })
      return
    }

    setIsAdding(true)
    setMessage(null)

    try {
      const result = await addCoinsToWallet(addAmount)

      if (result !== null) {
        setMessage({ type: 'success', text: `${addAmount} pièces ajoutées avec succès !` })
        await refresh()

        // Effacer le message après 3 secondes
        setTimeout(() => {
          setMessage(null)
        }, 3000)
      } else {
        setMessage({ type: 'error', text: 'Erreur lors de l\'ajout des pièces' })
      }
    } catch (error) {
      console.error('Erreur:', error)
      setMessage({ type: 'error', text: 'Une erreur est survenue' })
    } finally {
      setIsAdding(false)
    }
  }

  /**
   * Sélectionne un montant prédéfini
   */
  const handlePresetAmount = (amount: number): void => {
    setAddAmount(amount)
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
                  Montants suggérés
                </label>
                <div className='grid grid-cols-3 gap-2'>
                  {presetAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handlePresetAmount(amount)}
                      className={`px-4 py-3 rounded-lg border-2 font-medium transition-all duration-200 ${
                        addAmount === amount
                          ? 'border-moccaccino-500 bg-moccaccino-50 text-moccaccino-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-moccaccino-300 hover:bg-moccaccino-50'
                      }`}
                    >
                      +{amount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input personnalisé */}
              <div>
                <label htmlFor='custom-amount' className='block text-sm font-medium text-gray-700 mb-2'>
                  Montant personnalisé
                </label>
                <div className='relative'>
                  <input
                    id='custom-amount'
                    type='number'
                    min='1'
                    value={addAmount}
                    onChange={(e) => setAddAmount(parseInt(e.target.value) || 0)}
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-moccaccino-500 focus:ring-2 focus:ring-moccaccino-200 transition-all outline-none'
                    placeholder='Entrez un montant'
                  />
                  <span className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium'>
                    pièces
                  </span>
                </div>
              </div>

              {/* Bouton d'ajout */}
              <Button
                onClick={handleAddCoins}
                disabled={isAdding || addAmount <= 0}
                variant='primary'
                size='lg'
              >
                {isAdding ? 'Ajout en cours...' : `Ajouter ${addAmount} pièces`}
              </Button>

              {/* Note explicative */}
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                <p className='text-sm text-blue-800'>
                  <span className='font-medium'>💡 Astuce :</span> Vous pouvez gagner des pièces en prenant soin de vos monstres !
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section statistiques (optionnelle) */}
        <div className='mt-8 bg-white rounded-2xl shadow-lg p-8 border border-gray-100'>
          <h2 className='text-2xl font-bold text-gray-800 mb-6'>
            Statistiques
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg text-center'>
              <p className='text-3xl mb-2'>🎯</p>
              <p className='text-sm text-gray-600'>Capacité d'achat</p>
              <p className='text-2xl font-bold text-gray-800'>
                {Math.floor((wallet?.coin ?? 0) / 5)} items
              </p>
            </div>

            <div className='p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg text-center'>
              <p className='text-3xl mb-2'>⭐</p>
              <p className='text-sm text-gray-600'>Statut</p>
              <p className='text-2xl font-bold text-gray-800'>
                {(wallet?.coin ?? 0) > 1000 ? 'Riche' : (wallet?.coin ?? 0) > 100 ? 'Aisé' : 'Normal'}
              </p>
            </div>

            <div className='p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg text-center'>
              <p className='text-3xl mb-2'>📊</p>
              <p className='text-sm text-gray-600'>Rang</p>
              <p className='text-2xl font-bold text-gray-800'>
                {(wallet?.coin ?? 0) > 500 ? 'Or' : (wallet?.coin ?? 0) > 100 ? 'Argent' : 'Bronze'}
              </p>
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

