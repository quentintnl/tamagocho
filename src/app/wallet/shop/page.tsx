/**
 * Accessory Shop Page
 *
 * Page dédiée à l'achat d'accessoires pour les monstres
 */

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import AccessoryShopClient from '@/components/wallet/accessory-shop-client'

/**
 * Page de la boutique d'accessoires
 *
 * @async
 * @returns {Promise<React.ReactNode>} Page boutique ou redirection
 */
export default async function AccessoryShopPage (): Promise<React.ReactNode> {
  // Vérification de l'authentification
  const session = await auth.api.getSession({
    headers: await headers()
  })

  // Protection de la route
  if (session === null || session === undefined) {
    redirect('/sign-in')
  }

  return <AccessoryShopClient session={session} />
}

