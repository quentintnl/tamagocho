/**
 * Accessory Server Actions
 *
 * Application Layer: Orchestrates accessory purchase operations
 * Coordinates authentication, wallet validation, and business logic
 *
 * Responsibilities:
 * - Verify user authentication
 * - Validate accessory purchase
 * - Deduct coins from wallet
 * - Handle errors and return appropriate responses
 */

'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getAccessoryById } from '@/services/accessory.service'
import { subtractCoins, getOrCreateWallet } from '@/services/wallet.service'
import { revalidatePath } from 'next/cache'

/**
 * Purchase an accessory for the user's monster
 * Single Responsibility: Orchestrate accessory purchase with authentication and wallet validation
 *
 * @param accessoryId - ID of the accessory to purchase
 * @param monsterId - ID of the monster for which the accessory is purchased
 * @returns Success status and message
 */
export async function purchaseAccessory (accessoryId: string, monsterId: string): Promise<{
  success: boolean
  message: string
  remainingCoins?: number
}> {
  try {
    // Vérification de l'authentification
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session === null || session === undefined) {
      return {
        success: false,
        message: 'Vous devez être connecté pour acheter un accessoire'
      }
    }

    // Récupération de l'accessoire
    const accessory = getAccessoryById(accessoryId)

    if (accessory === null) {
      return {
        success: false,
        message: 'Accessoire introuvable'
      }
    }

    // Récupération du wallet
    const wallet = await getOrCreateWallet(session.user.id)

    // Vérification du solde
    if (wallet.coin < accessory.price) {
      return {
        success: false,
        message: `Solde insuffisant. Vous avez ${wallet.coin} gochoCoins, il en faut ${accessory.price}`
      }
    }

    // Déduction des coins
    const updatedWallet = await subtractCoins({
      ownerId: session.user.id,
      amount: accessory.price
    })

    // Revalidation du cache
    revalidatePath('/creature')
    revalidatePath('/dashboard')

    return {
      success: true,
      message: `${accessory.name} acheté avec succès !`,
      remainingCoins: updatedWallet.coin
    }
  } catch (error) {
    console.error('Error purchasing accessory:', error)
    return {
      success: false,
      message: 'Erreur lors de l\'achat de l\'accessoire'
    }
  }
}

