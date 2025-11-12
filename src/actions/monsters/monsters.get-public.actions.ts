'use server'

import { connectMongooseToDatabase } from '@/db'
import Monster from '@/db/models/monster.model'
import '@/db/models/xp-level.model'
import type { MonsterDocument, PopulatedMonster } from '@/types/monster'
import { getXpLevelByNumber } from '@/services/xp-level.service'
import { FilterQuery, SortOrder } from 'mongoose'

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
    const query: FilterQuery<MonsterDocument> = { isPublic: true }

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
    const sort: Record<string, SortOrder> = { [sortBy]: sortOrder === 'asc' ? 1 : -1 }

    // Compte total pour la pagination
    const totalCount = await Monster.countDocuments(query)
    const totalPages = Math.ceil(totalCount / limit)

    console.log('[getPublicMonsters] Total public monsters found:', totalCount)
    console.log('[getPublicMonsters] Total pages:', totalPages)

    // Récupération des monstres avec population du niveau uniquement
    // Utilisation de .lean() pour obtenir des objets JavaScript purs
    const monsters = await Monster.find(query)
      .populate('level_id')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec()

    console.log('[getPublicMonsters] Monsters fetched:', monsters.length)
    console.log('[getPublicMonsters] First monster (if any):', monsters.length > 0 ? JSON.stringify(monsters[0], null, 2) : 'none')

    // Transformation des données avec anonymisation du créateur
    // Pour l'instant, on anonymise tous les créateurs car nous n'avons pas accès aux données utilisateur
    const publicMonsters: PublicMonsterWithOwner[] = (monsters as unknown as PopulatedMonster[]).map((monster) => {
      // Anonymisation du propriétaire (on pourrait récupérer le vrai nom via better-auth si nécessaire)
      // Pour l'instant, on génère un nom anonymisé basé sur l'ID
      const ownerIdStr = String(monster.ownerId)
      const ownerName = `Dresseur-${ownerIdStr.slice(-6)}`

      // S'assurer que level_id est présent et valide
      const levelId = monster.level_id ?? { level: 1, xpRequired: 0, isMaxLevel: false, _id: '', createdAt: new Date(), updatedAt: new Date() }

      return {
        ...monster,
        level_id: levelId,
        ownerName,
        ownerId: ownerIdStr
      }
    })

    console.log('[getPublicMonsters] Public monsters transformed:', publicMonsters.length)
    console.log('[getPublicMonsters] First public monster:', publicMonsters.length > 0 ? JSON.stringify(publicMonsters[0], null, 2) : 'none')

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
