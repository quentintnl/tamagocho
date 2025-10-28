/**
 * Wallet Management Page
 *
 * Page dédiée à la gestion du wallet de l'utilisateur
 * Affiche le solde et permet d'ajouter de la monnaie
 */

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import WalletPageClient from '@/components/wallet/wallet-page-client'

/**
 * Page de gestion du wallet
 *
 * @async
 * @returns {Promise<React.ReactNode>} Page wallet ou redirection
 */
export default async function WalletPage (): Promise<React.ReactNode> {
  // Vérification de l'authentification
  const session = await auth.api.getSession({
    headers: await headers()
  })

  // Protection de la route
  if (session === null || session === undefined) {
    redirect('/sign-in')
  }

  return <WalletPageClient session={session} />
}

