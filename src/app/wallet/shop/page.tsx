/**
 * Accessory Shop Page
 *
 * Page dédiée à l'achat d'accessoires pour les monstres.
 */

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import AccessoryShopClient from '@/components/wallet/accessory-shop-client'

/**
 * Page de la boutique d'accessoires
 *
 * @async
 * @returns {Promise<React.ReactNode>} Page boutique ou redirection vers /sign-in
 */
export default async function AccessoryShopPage (): Promise<React.ReactNode> {
  // Récupération de la session utilisateur via Better Auth
  const session = await auth.api.getSession({
    headers: await headers()
  })

  // Protection de la route : redirection si non authentifié
  if (session === null || session === undefined) {
    redirect('/sign-in')
  }

  return <AccessoryShopClient session={session} />
}

