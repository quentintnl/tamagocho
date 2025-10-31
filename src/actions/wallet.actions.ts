
/**
 * Wallet Server Actions
 *
 * Application Layer: Orchestrates wallet operations
 * Coordinates authentication, business logic, and cache invalidation
 *
 * Responsibilities:
 * - Verify user authentication
 * - Delegate to wallet service
 * - Handle errors and return appropriate responses
 * - Revalidate cache when needed
 */

'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getOrCreateWallet, addCoins, subtractCoins } from '@/services/wallet.service'
import type { Wallet } from '@/types/wallet'
import { revalidatePath } from 'next/cache'

/**
 * Gets the current user's wallet
 * Creates one if it doesn't exist
 *
 * Single Responsibility: Orchestrate wallet retrieval with authentication
 *
 * @returns The user's wallet or null if not authenticated
 */
export async function getUserWallet (): Promise<Wallet | null> {
  try {
    // Vérification de l'authentification
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session === null || session === undefined) {
      return null
    }

    // Récupération ou création du wallet
    const wallet = await getOrCreateWallet(session.user.id)

    // Sérialisation pour Client Components (convertit ObjectId et Dates)
    return JSON.parse(JSON.stringify(wallet))
  } catch (error) {
    console.error('Error getting user wallet:', error)
    return null
  }
}

/**
 * Adds coins to the current user's wallet
 *
 * Single Responsibility: Orchestrate coin addition with authentication and cache invalidation
 *
 * @param amount - Amount of coins to add
 * @returns Updated wallet or null if operation failed
 */
export async function addCoinsToWallet (amount: number): Promise<Wallet | null> {
  try {
    // Vérification de l'authentification
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session === null || session === undefined) {
      throw new Error('User not authenticated')
    }

    // Ajout des coins
    const wallet = await addCoins({
      ownerId: session.user.id,
      amount
    })

    // Revalidation du cache
    revalidatePath('/dashboard')
    revalidatePath('/creature')

    // Sérialisation pour Client Components
    return JSON.parse(JSON.stringify(wallet))
  } catch (error) {
    console.error('Error adding coins to wallet:', error)
    return null
  }
}

/**
 * Subtracts coins from the current user's wallet
 *
 * Single Responsibility: Orchestrate coin subtraction with authentication and validation
 *
 * @param amount - Amount of coins to subtract
 * @returns Updated wallet or null if operation failed
 */
export async function subtractCoinsFromWallet (amount: number): Promise<Wallet | null> {
  try {
    // Vérification de l'authentification
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session === null || session === undefined) {
      throw new Error('User not authenticated')
    }

    // Soustraction des coins
    const wallet = await subtractCoins({
      ownerId: session.user.id,
      amount
    })

    // Revalidation du cache
    revalidatePath('/dashboard')
    revalidatePath('/creature')

    // Sérialisation pour Client Components
    return JSON.parse(JSON.stringify(wallet))
  } catch (error) {
    console.error('Error subtracting coins from wallet:', error)
    return null
  }
}
