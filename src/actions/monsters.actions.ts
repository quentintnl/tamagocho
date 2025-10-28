'use server'

import { connectMongooseToDatabase } from '@/db'
import Monster from '@/db/models/monster.model'
import { auth } from '@/lib/auth'
import type { CreateMonsterFormValues } from '@/types/forms/create-monster-form'
import type { PopulatedMonster } from '@/types/monster'
import { XP_GAIN_CORRECT_ACTION, XP_GAIN_INCORRECT_ACTION } from '@/types/monster'
import { getXpLevelByNumber, calculateLevelFromXp } from '@/services/xp-level.service'
import { revalidatePath } from 'next/cache'
import { Types } from 'mongoose'
import { MonsterAction } from '@/hooks/monsters'
import {headers} from "next/headers";

/**
 * Crée un nouveau monstre pour l'utilisateur authentifié
 *
 * Cette server action :
 * 1. Vérifie l'authentification de l'utilisateur
 * 2. Crée un nouveau document Monster dans MongoDB
 * 3. Revalide le cache de la page dashboard
 *
 * Responsabilité unique : orchestrer la création d'un monstre
 * en coordonnant l'authentification, la persistence et le cache.
 *
 * @async
 * @param {CreateMonsterFormValues} monsterData - Données validées du monstre à créer
 * @returns {Promise<void>} Promise résolue une fois le monstre créé
 * @throws {Error} Si l'utilisateur n'est pas authentifié
 *
 * @example
 * await createMonster({
 *   name: "Pikachu",
 *   traits: '{"bodyColor": "#FFB5E8", ...}',
 *   state: "happy",
 *   level: 1
 * })
 */
export async function createMonster (monsterData: CreateMonsterFormValues): Promise<void> {
    // Connexion à la base de données
    await connectMongooseToDatabase()

    // Vérification de l'authentification
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (session === null || session === undefined) {
        throw new Error('User not authenticated')
    }

    // Récupération du niveau 1 (niveau de départ)
    const level1 = await getXpLevelByNumber(1)
    if (level1 === null) {
        throw new Error('XP levels not initialized. Please run seed script.')
    }

    // Création et sauvegarde du monstre
    const monster = new Monster({
        ownerId: session.user.id,
        name: monsterData.name,
        traits: monsterData.traits,
        state: monsterData.state,
        level_id: level1._id,
        xp: 0
    })

    await monster.save()

    // Revalidation du cache pour rafraîchir le dashboard
    revalidatePath('/dashboard')
}

/**
 * Récupère tous les monstres de l'utilisateur authentifié
 *
 * Cette server action :
 * 1. Vérifie l'authentification de l'utilisateur
 * 2. Récupère tous les monstres appartenant à l'utilisateur
 * 3. Popule les données de niveau XP
 * 4. Retourne un tableau vide en cas d'erreur (résilience)
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

        // Récupération des monstres de l'utilisateur avec population du level_id
        const monsters = await Monster.find({ ownerId: user.id }).populate('level_id').exec()

        // Sérialisation JSON pour éviter les problèmes de typage Next.js
        return JSON.parse(JSON.stringify(monsters))
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
 * 3. Récupère le monstre s'il appartient à l'utilisateur
 * 4. Popule les données de niveau XP
 * 5. Retourne null si le monstre n'existe pas ou n'appartient pas à l'utilisateur
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

        // Extraction de l'ID depuis le tableau de route dynamique
        const _id = id

        // Validation du format ObjectId MongoDB
        if (!Types.ObjectId.isValid(_id)) {
            console.error('Invalid monster ID format')
            return null
        }

        // Récupération du monstre avec vérification de propriété et population du level_id
        const monster = await Monster.findOne({ ownerId: user.id, _id }).populate('level_id').exec()

        // Sérialisation JSON pour éviter les problèmes de typage Next.js
        return JSON.parse(JSON.stringify(monster))
    } catch (error) {
        console.error('Error fetching monster by ID:', error)
        return null
    }
}

const actionsStatesMap: Record<Exclude<MonsterAction, null>, string> = {
  feed: 'hungry',
  comfort: 'angry',
  hug: 'sad',
  wake: 'sleepy'
}

export async function doActionOnMonster (id: string, action: MonsterAction): Promise<void> {
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
      throw new Error('Invalid monster ID format')
    }

    // Récupération du monstre avec vérification de propriété et population du level
    const monster = await Monster.findOne({ ownerId: user.id, _id: id }).populate('level_id').exec()

    if (monster === null || monster === undefined) {
      throw new Error('Monster not found')
    }

    // Mise à jour de l'état du monstre en fonction de l'action
    if (action !== null && action !== undefined && action in actionsStatesMap) {
      let xpGained = XP_GAIN_INCORRECT_ACTION

      // Si l'action correspond à l'état actuel, c'est une action correcte
      if (monster.state === actionsStatesMap[action]) {
        monster.state = 'happy'
        xpGained = XP_GAIN_CORRECT_ACTION
      }

      // Ajout de l'XP au monstre
      const currentXp = Number(monster.xp ?? 0)
      const newTotalXp = currentXp + xpGained

      // Calcul du nouveau niveau basé sur l'XP total
      const { level: newLevel, remainingXp } = await calculateLevelFromXp(newTotalXp)

      // Vérification si le niveau a changé
      const currentLevelId = String(monster.level_id._id ?? monster.level_id)
      const newLevelId = String(newLevel._id)

      if (currentLevelId !== newLevelId) {
        // Level up !
        monster.level_id = newLevel._id as any
        monster.xp = remainingXp
        console.log(`🎉 Level up! Nouveau niveau: ${newLevel.level}, XP restant: ${remainingXp}`)
      } else {
        // Même niveau, on ajoute juste l'XP
        monster.xp = newTotalXp
      }

      monster.markModified('state')
      monster.markModified('xp')
      monster.markModified('level_id')
      await monster.save()
    }

    // Revalidation du cache pour rafraîchir la page
    revalidatePath(`/creature/${id}`)
  } catch (error) {
    console.error('Error updating monster state:', error)
  }
}
