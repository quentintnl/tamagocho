'use server'

import { connectMongooseToDatabase } from '@/db'
import Monster from '@/db/models/monster.model'
import { auth } from '@/lib/auth'
import { revalidatePath, revalidateTag } from 'next/cache'
import { Types } from 'mongoose'
import { headers } from 'next/headers'

/**
 * Bascule le statut public/privé d'un monstre
 *
 * Cette server action :
 * 1. Vérifie l'authentification de l'utilisateur
 * 2. Valide le format de l'identifiant MongoDB
 * 3. Récupère le monstre s'il appartient à l'utilisateur
 * 4. Inverse la valeur du champ isPublic
 * 5. Sauvegarde et revalide le cache
 *
 * Responsabilité unique : gérer le basculement du statut de visibilité publique
 * d'un monstre en garantissant la propriété et la sécurité.
 *
 * @async
 * @param {string} id - Identifiant du monstre
 * @returns {Promise<{ success: boolean, isPublic?: boolean, error?: string }>} Résultat de l'opération
 * @throws {Error} Si l'utilisateur n'est pas authentifié
 *
 * @example
 * const result = await toggleMonsterPublicStatus("507f1f77bcf86cd799439011")
 * // { success: true, isPublic: true }
 */
export async function toggleMonsterPublicStatus (id: string): Promise<{ success: boolean, isPublic?: boolean, error?: string }> {
  try {
    // Connexion à la base de données
    await connectMongooseToDatabase()

    // Vérification de l'authentification
    const session = await auth.api.getSession({
      headers: await headers()
    })
    if (session === null || session === undefined) {
      throw new Error('User not authenticated')
    }

    const { user } = session

    // Validation du format ObjectId MongoDB
    if (!Types.ObjectId.isValid(id)) {
      return {
        success: false,
        error: 'Invalid monster ID format'
      }
    }

    // Récupération du monstre avec vérification de propriété
    const monster = await Monster.findOne({ ownerId: user.id, _id: id }).exec()

    if (monster === null || monster === undefined) {
      return {
        success: false,
        error: 'Monster not found'
      }
    }

    // Basculement du statut public
    monster.isPublic = !(monster.isPublic ?? false)
    await monster.save()

    // Invalidation du cache des monstres pour cet utilisateur
    revalidateTag(`monsters-${user.id}`)
    revalidateTag(`monster-${id}`) // Invalide le cache du monstre spécifique

    // Revalidation du cache pour rafraîchir la page
    revalidatePath(`/creature/${id}`)
    revalidatePath('/monsters')
    revalidatePath('/dashboard')

    return {
      success: true,
      isPublic: monster.isPublic
    }
  } catch (error) {
    console.error('Error toggling monster public status:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

