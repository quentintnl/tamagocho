'use server'

import { connectMongooseToDatabase } from '@/db'
import Monster from '@/db/models/monster.model'
import '@/db/models/xp-level.model'
import { auth } from '@/lib/auth'
import type { CreateMonsterFormValues } from '@/types/forms/create-monster-form'
import type { PopulatedMonster } from '@/types/monster'
import { XP_GAIN_CORRECT_ACTION, XP_GAIN_INCORRECT_ACTION } from '@/types/monster'
import { getXpLevelByNumber, calculateLevelFromXp } from '@/services/xp-level.service'
import { revalidatePath } from 'next/cache'
import { Types } from 'mongoose'
import { MonsterAction } from '@/hooks/monsters'
import {headers} from "next/headers";
import { getActionReward, type MonsterActionType } from '@/config/rewards'
import { addCoins } from '@/services/wallet.service'

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

/**
 * Résultat d'une action sur un monstre
 * Contient les informations de récompense pour afficher les notifications
 */
export interface ActionResult {
  success: boolean
  koinsEarned: number
  isCorrectAction: boolean
  action: MonsterActionType
  error?: string
}

const actionsStatesMap: Record<Exclude<MonsterAction, null>, string> = {
  feed: 'hungry',
  comfort: 'angry',
  hug: 'sad',
  wake: 'sleepy'
}

/**
 * Effectue une action sur un monstre
 *
 * Cette server action :
 * 1. Vérifie l'authentification
 * 2. Récupère le monstre
 * 3. Met à jour l'état du monstre
 * 4. Calcule et ajoute l'XP
 * 5. Calcule et ajoute les Koins gagnés
 * 6. Retourne les informations de récompense
 *
 * Responsabilité unique : Orchestrer l'exécution d'une action sur un monstre
 * et coordonner les systèmes de récompenses (XP + Koins).
 *
 * @param id - Identifiant du monstre
 * @param action - Action à effectuer
 * @returns Résultat de l'action avec les informations de récompense
 */
export async function doActionOnMonster (id: string, action: MonsterAction): Promise<ActionResult> {
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
      let isCorrectAction = false

      // Si l'action correspond à l'état actuel, c'est une action correcte
      if (monster.state === actionsStatesMap[action]) {
        monster.state = 'happy'
        xpGained = XP_GAIN_CORRECT_ACTION
        isCorrectAction = true
      }

      // Calcul de l'XP total en additionnant l'XP de tous les niveaux précédents
      const currentLevelNumber = monster.level_id.level
      const currentXpInLevel = Number(monster.xp ?? 0)

      // Récupérer tous les niveaux pour calculer l'XP total accumulé
      const { getAllXpLevels } = await import('@/services/xp-level.service')
      const allLevels = await getAllXpLevels()


      // Calculer l'XP total = somme des xpRequired pour ATTEINDRE le niveau actuel + XP actuel du niveau
      // Note: xpRequired du niveau 1 est 0 (c'est le niveau de départ)
      // xpRequired du niveau 2 est 50 (il faut 50 XP pour passer de 1 à 2)
      // Donc pour être au niveau 2 avec 10 XP, on a : 0 + 50 + 10 = 60 XP total
      let totalXpBeforeCurrentLevel = 0
      for (const level of allLevels) {
        if (level.level <= currentLevelNumber) {
          totalXpBeforeCurrentLevel += level.xpRequired
          console.log(`  - Niveau ${level.level}: +${level.xpRequired} XP requis`)
        }
      }

      const currentTotalXp = totalXpBeforeCurrentLevel + currentXpInLevel
      const newTotalXp = currentTotalXp + xpGained

      // Calcul du nouveau niveau basé sur l'XP total
      const { level: newLevel, remainingXp } = await calculateLevelFromXp(newTotalXp)

      // Vérification si le niveau a changé
      const currentLevelId = String(monster.level_id._id ?? monster.level_id)
      const newLevelId = String(newLevel._id)

      if (currentLevelId !== newLevelId) {
        // Level up !
        monster.level_id = newLevel._id as any
        monster.xp = remainingXp
      } else {
        // Même niveau, on ajoute juste l'XP gagné
        monster.xp = currentXpInLevel + xpGained
      }

      monster.markModified('state')
      monster.markModified('xp')
      monster.markModified('level_id')
      await monster.save()

      // Calcul et attribution des Koins
      const koinsEarned = getActionReward(action as MonsterActionType, isCorrectAction)
      await addCoins({
        ownerId: user.id,
        amount: koinsEarned
      })

      // Revalidation du cache pour rafraîchir la page
      revalidatePath(`/creature/${id}`)
      revalidatePath('/wallet')

      return {
        success: true,
        koinsEarned,
        isCorrectAction,
        action: action as MonsterActionType
      }
    }

    return {
      success: false,
      koinsEarned: 0,
      isCorrectAction: false,
      action: action as MonsterActionType,
      error: 'Invalid action'
    }
  } catch (error) {
    console.error('Error updating monster state:', error)
    return {
      success: false,
      koinsEarned: 0,
      isCorrectAction: false,
      action: action as MonsterActionType,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

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

/**
 * Filtres pour la galerie communautaire
 */
export interface GalleryFilters {
  level?: number
  state?: string
  sortBy?: 'createdAt' | 'level' | 'name'
  sortOrder?: 'asc' | 'desc'
}

/**
 * Options de pagination
 */
export interface PaginationOptions {
  page?: number
  limit?: number
}

/**
 * Monstre public avec informations du créateur
 */
export interface PublicMonsterWithOwner extends PopulatedMonster {
  ownerName: string
}

/**
 * Résultat paginé de la galerie
 */
export interface GalleryResult {
  monsters: PublicMonsterWithOwner[]
  totalCount: number
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

/**
 * Récupère tous les monstres publics pour la galerie communautaire
 *
 * Cette server action :
 * 1. Se connecte à la base de données
 * 2. Applique les filtres demandés (niveau, état, tri)
 * 3. Récupère uniquement les monstres avec isPublic: true
 * 4. Popule les informations du propriétaire (nom anonymisé)
 * 5. Applique la pagination
 * 6. Retourne les résultats avec les métadonnées de pagination
 *
 * Responsabilité unique : récupérer les monstres publics
 * avec pagination et filtrage pour la galerie communautaire.
 *
 * @async
 * @param {GalleryFilters} filters - Filtres à appliquer
 * @param {PaginationOptions} pagination - Options de pagination
 * @returns {Promise<GalleryResult>} Résultat paginé de la galerie
 *
 * @example
 * const result = await getPublicMonsters({ level: 3, state: 'happy' }, { page: 1, limit: 12 })
 * // { monsters: [...], totalCount: 45, currentPage: 1, totalPages: 4, ... }
 */
export async function getPublicMonsters (
  filters: GalleryFilters = {},
  pagination: PaginationOptions = {}
): Promise<GalleryResult> {
  try {
    // Connexion à la base de données
    await connectMongooseToDatabase()

    // Construction de la query MongoDB
    const query: any = { isPublic: true }

    // Filtre par niveau
    if (filters.level !== undefined && filters.level !== null) {
      const levelDoc = await getXpLevelByNumber(filters.level)
      if (levelDoc !== null) {
        query.level_id = levelDoc._id
      }
    }

    // Filtre par état
    if (filters.state !== undefined && filters.state !== null && filters.state !== '') {
      query.state = filters.state
    }

    // Configuration de la pagination
    const page = pagination.page ?? 1
    const limit = pagination.limit ?? 12
    const skip = (page - 1) * limit

    // Configuration du tri
    const sortBy = filters.sortBy ?? 'createdAt'
    const sortOrder = filters.sortOrder ?? 'desc'
    const sort: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 }

    // Compte total pour la pagination
    const totalCount = await Monster.countDocuments(query)
    const totalPages = Math.ceil(totalCount / limit)

    // Récupération des monstres avec population du niveau uniquement
    const monsters = await Monster.find(query)
      .populate('level_id')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec()

    // Transformation des données avec anonymisation du créateur
    // Pour l'instant, on anonymise tous les créateurs car nous n'avons pas accès aux données utilisateur
    const publicMonsters: PublicMonsterWithOwner[] = monsters.map((monster: any) => {
      const monsterObj = monster.toObject()

      // Anonymisation du propriétaire (on pourrait récupérer le vrai nom via better-auth si nécessaire)
      // Pour l'instant, on génère un nom anonymisé basé sur l'ID
      const ownerIdStr = String(monsterObj.ownerId)
      const ownerName = `Dresseur-${ownerIdStr.slice(-6)}`

      return {
        ...monsterObj,
        ownerName,
        ownerId: ownerIdStr
      }
    })

    // Sérialisation JSON pour éviter les problèmes de typage Next.js
    const serializedMonsters = JSON.parse(JSON.stringify(publicMonsters))

    return {
      monsters: serializedMonsters,
      totalCount,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  } catch (error) {
    console.error('Error fetching public monsters:', error)
    return {
      monsters: [],
      totalCount: 0,
      currentPage: 1,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false
    }
  }
}
