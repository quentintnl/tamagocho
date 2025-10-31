/**
 * WalletBalance Component
 *
 * Presentation Layer: Affichage du solde du wallet
 *
 * Responsabilités:
 * - Afficher le solde actuel en koins
 * - Afficher les informations utilisateur
 * - Gérer l'état de chargement
 *
 * Single Responsibility Principle: Affichage du solde uniquement
 * Open/Closed Principle: Extensible via les props
 *
 * @module components/wallet/wallet-balance
 */

import type React from 'react'
import type { Wallet } from '@/types/wallet'
import type { authClient } from '@/lib/auth-client'
import TomatokenIcon from '@/components/tomatoken-icon'

type Session = typeof authClient.$Infer.Session

/**
 * Props pour le composant WalletBalance
 */
interface WalletBalanceProps {
  /** Données du wallet */
  wallet: Wallet | null
  /** Session utilisateur */
  session: Session
  /** État de chargement */
  isLoading: boolean
}

/**
 * Composant d'affichage du solde du wallet
 *
 * Affiche le solde en koins avec les informations de compte et la date
 * de dernière mise à jour. Gère l'affichage du skeleton pendant le chargement.
 *
 * @param {WalletBalanceProps} props - Props du composant
 * @returns {React.ReactNode} Carte d'affichage du solde
 *
 * @example
 * <WalletBalance
 *   wallet={walletData}
 *   session={session}
 *   isLoading={false}
 * />
 */
export function WalletBalance ({ wallet, session, isLoading }: WalletBalanceProps): React.ReactNode {
  return (
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
                <TomatokenIcon size='3xl' />
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
              <span className='font-medium'>Compte :</span>{' '}
              {session.user.name ?? session.user.email}
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
  )
}

