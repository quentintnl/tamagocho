'use server'

import { unstable_cache } from 'next/cache'
import { connectMongooseToDatabase } from '@/db'
import Monster from '@/db/models/monster.model'
import '@/db/models/xp-level.model'
import { auth } from '@/lib/auth'
import type { PopulatedMonster } from '@/types/monster'
import { Types } from 'mongoose'
import { headers } from 'next/headers'

/**
 * Récupère tous les monstres de l'utilisateur authentifié
 *
 * Cette server action :
 * 1. Vérifie l'authentification de l'utilisateur
 * 2. Récupère tous les monstres appartenant à l'utilisateur (avec cache)
 * 3. Popule les données de niveau XP
 * 4. Retourne un tableau vide en cas d'erreur (résilience)
 *
 * Optimisation : Utilise un cache Next.js avec revalidation de 30 secondes
 * pour éviter les requêtes DB répétées lors des navigations.
 *
 * Responsabilité unique : récupérer la liste complète des monstres
 * de l'utilisateur depuis la base de données.
 *
 * @async
 * @returns {Promise<PopulatedMonster[]>} Liste des monstres ou tableau vide en cas d'erreur
 *
 * @example
 * const monsters = await getMonsters()
 * // [{ _id: "...", name: "Pikachu", level_id: { level: 1, ... }, ... }, ...]
 */
export async function getMonsters (): Promise<PopulatedMonster[]> {
  try {
    // Vérification de l'authentification
    const session = await auth.api.getSession({
      headers: await headers()
    })
    if (session === null || session === undefined) {
      throw new Error('User not authenticated')
    }

    const { user } = session

    // Fonction cachée pour récupérer les monstres
    const getCachedMonsters = unstable_cache(
      async (userId: string) => {
        // Connexion à la base de données
        await connectMongooseToDatabase()

        // Récupération des monstres de l'utilisateur avec population du level_id
        const monsters = await Monster.find({ ownerId: userId }).populate('level_id').exec()

        // Sérialisation JSON pour éviter les problèmes de typage Next.js
        return JSON.parse(JSON.stringify(monsters))
      },
      [`monsters-${user.id}`], // Cache key unique par utilisateur
      {
        revalidate: 30, // Revalidation toutes les 30 secondes
        tags: [`monsters-${user.id}`] // Tag pour invalidation ciblée
      }
    )

    return await getCachedMonsters(user.id)
  } catch (error) {
    console.error('Error fetching monsters:', error)
    return []
  }
}

/**
 * Récupère un monstre spécifique par son identifiant
 *
 * Cette server action :
 * 1. Vérifie l'authentification de l'utilisateur
 * 2. Valide le format de l'identifiant MongoDB
 * 3. Récupère le monstre s'il appartient à l'utilisateur (avec cache)
 * 4. Popule les données de niveau XP
 * 5. Retourne null si le monstre n'existe pas ou n'appartient pas à l'utilisateur
 *
 * Optimisation : Utilise un cache Next.js avec revalidation de 60 secondes
 * pour éviter les requêtes DB répétées lors des navigations rapides.
 *
 * Responsabilité unique : récupérer un monstre spécifique
 * en garantissant la propriété et l'existence.
 *
 * @async
 * @param {string} id - Identifiant du monstre (premier élément du tableau de route dynamique)
 * @returns {Promise<PopulatedMonster | null>} Le monstre trouvé ou null
 * @throws {Error} Si l'utilisateur n'est pas authentifié
 *
 * @example
 * const monster = await getMonsterById("507f1f77bcf86cd799439011")
 * // { _id: "507f1f77bcf86cd799439011", name: "Pikachu", level_id: { level: 2, ... }, ... }
 *
 * const notFound = await getMonsterById("invalid-id")
 * // null
 */
export async function getMonsterById (id: string): Promise<PopulatedMonster | null> {
  try {
    // Vérification de l'authentification
    const session = await auth.api.getSession({
      headers: await headers()
    })
    if (session === null || session === undefined) {
      throw new Error('User not authenticated')
    }

    const { user } = session

    // Extraction de l'ID depuis le tableau de route dynamique
    const _id = id

    // Validation du format ObjectId MongoDB
    if (!Types.ObjectId.isValid(_id)) {
      console.error('Invalid monster ID format')
      return null
    }

    // Fonction cachée pour récupérer le monstre
    const getCachedMonsterById = unstable_cache(
      async (monsterId: string, userId: string) => {
        // Connexion à la base de données
        await connectMongooseToDatabase()

        // Récupération du monstre avec vérification de propriété et population du level_id
        const monster = await Monster.findOne({ ownerId: userId, _id: monsterId }).populate('level_id').exec()

        // Sérialisation JSON pour éviter les problèmes de typage Next.js
        return JSON.parse(JSON.stringify(monster))
      },
      [`monster-${_id}-${user.id}`], // Cache key unique par monstre et utilisateur
      {
        revalidate: 60, // Revalidation toutes les 60 secondes
        tags: [`monster-${_id}`, `monsters-${user.id}`] // Tags pour invalidation ciblée
      }
    )

    return await getCachedMonsterById(_id, user.id)
  } catch (error) {
    console.error('Error fetching monster by ID:', error)
    return null
  }
}
