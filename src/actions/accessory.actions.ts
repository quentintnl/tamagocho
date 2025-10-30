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
 * - Create owned accessory record in database
 * - Equip accessory to monster
 * - Handle errors and return appropriate responses
 */

'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getAccessoryById } from '@/services/accessory.service'
import { subtractCoins, getOrCreateWallet } from '@/services/wallet.service'
import {
  createOwnedAccessory,
  userOwnsAccessory,
  getOwnedAccessoriesByUser,
  getOwnedAccessoriesByMonster,
  getOwnedAccessoryIds,
  equipAccessoryToMonster,
  unequipAccessory
} from '@/services/owned-accessory.service'
import { revalidatePath } from 'next/cache'
import type { OwnedAccessory } from '@/types/accessory'

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
  ownedAccessoryId?: string
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

    // Vérifier si l'utilisateur possède déjà cet accessoire
    const alreadyOwned = await userOwnsAccessory(session.user.id, accessoryId)

    if (alreadyOwned) {
      return {
        success: false,
        message: 'Vous possédez déjà cet accessoire'
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

    // Création de l'accessoire possédé et équipement automatique au monstre
    const ownedAccessory = await createOwnedAccessory(
      session.user.id,
      accessoryId,
      monsterId
    )

    // Revalidation du cache
    revalidatePath('/creature')
    revalidatePath('/dashboard')
    revalidatePath('/wallet')
    revalidatePath('/monster')

    return {
      success: true,
      message: `${accessory.name} acheté et équipé avec succès !`,
      remainingCoins: updatedWallet.coin,
      ownedAccessoryId: ownedAccessory._id.toString()
    }
  } catch (error) {
    console.error('Error purchasing accessory:', error)
    return {
      success: false,
      message: 'Erreur lors de l\'achat de l\'accessoire'
    }
  }
}

/**
 * Purchase an accessory without equipping it to a monster
 * Single Responsibility: Add accessory to user's inventory only
 *
 * @param accessoryId - ID of the accessory to purchase
 * @returns Success status and message
 */
export async function purchaseAccessoryOnly (accessoryId: string): Promise<{
  success: boolean
  message: string
  remainingCoins?: number
  ownedAccessoryId?: string
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

    // Vérifier si l'utilisateur possède déjà cet accessoire
    const alreadyOwned = await userOwnsAccessory(session.user.id, accessoryId)

    if (alreadyOwned) {
      return {
        success: false,
        message: 'Vous possédez déjà cet accessoire'
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

    // Création de l'accessoire possédé SANS équipement
    const ownedAccessory = await createOwnedAccessory(
      session.user.id,
      accessoryId
      // pas de monsterId = non équipé
    )

    // Revalidation du cache
    revalidatePath('/shop')
    revalidatePath('/wallet')
    revalidatePath('/accessories-demo')

    return {
      success: true,
      message: `${accessory.name} acheté avec succès ! Vous pouvez maintenant l'équiper à vos monstres.`,
      remainingCoins: updatedWallet.coin,
      ownedAccessoryId: ownedAccessory._id.toString()
    }
  } catch (error) {
    console.error('Error purchasing accessory:', error)
    return {
      success: false,
      message: 'Erreur lors de l\'achat de l\'accessoire'
    }
  }
}

/**
 * Get all owned accessories for the current user
 *
 * @returns Array of owned accessories or null if not authenticated
 */
export async function getUserOwnedAccessories (): Promise<OwnedAccessory[] | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session === null || session === undefined) {
      return null
    }

    const ownedAccessories = await getOwnedAccessoriesByUser(session.user.id)
    return JSON.parse(JSON.stringify(ownedAccessories))
  } catch (error) {
    console.error('Error getting owned accessories:', error)
    return null
  }
}

/**
 * Get owned accessory IDs for the current user
 *
 * @returns Array of accessory IDs
 */
export async function getUserOwnedAccessoryIds (): Promise<string[]> {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session === null || session === undefined) {
      return []
    }

    return await getOwnedAccessoryIds(session.user.id)
  } catch (error) {
    console.error('Error getting owned accessory IDs:', error)
    return []
  }
}

/**
 * Get accessories equipped to a specific monster
 *
 * @param monsterId - Monster ID
 * @returns Array of owned accessories
 */
export async function getMonsterAccessories (monsterId: string): Promise<OwnedAccessory[]> {
  try {
    const accessories = await getOwnedAccessoriesByMonster(monsterId)
    return JSON.parse(JSON.stringify(accessories))
  } catch (error) {
    console.error('Error getting monster accessories:', error)
    return []
  }
}

/**
 * Equip an accessory to a monster
 *
 * @param ownedAccessoryId - Owned accessory ID
 * @param monsterId - Monster ID
 * @returns Success status and message
 */
export async function equipAccessory (
  ownedAccessoryId: string,
  monsterId: string
): Promise<{ success: boolean, message: string }> {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session === null || session === undefined) {
      return {
        success: false,
        message: 'Vous devez être connecté'
      }
    }

    const result = await equipAccessoryToMonster(ownedAccessoryId, monsterId)

    if (result === null) {
      return {
        success: false,
        message: 'Accessoire introuvable'
      }
    }

    revalidatePath('/creature')
    revalidatePath('/monster')

    return {
      success: true,
      message: 'Accessoire équipé avec succès'
    }
  } catch (error) {
    console.error('Error equipping accessory:', error)
    return {
      success: false,
      message: 'Erreur lors de l\'équipement'
    }
  }
}

/**
 * Unequip an accessory from a monster
 *
 * @param ownedAccessoryId - Owned accessory ID
 * @returns Success status and message
 */
export async function removeAccessory (
  ownedAccessoryId: string
): Promise<{ success: boolean, message: string }> {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session === null || session === undefined) {
      return {
        success: false,
        message: 'Vous devez être connecté'
      }
    }

    const result = await unequipAccessory(ownedAccessoryId)

    if (result === null) {
      return {
        success: false,
        message: 'Accessoire introuvable'
      }
    }

    revalidatePath('/creature')
    revalidatePath('/monster')

    return {
      success: true,
      message: 'Accessoire retiré avec succès'
    }
  } catch (error) {
    console.error('Error removing accessory:', error)
    return {
      success: false,
      message: 'Erreur lors du retrait'
    }
  }
}

