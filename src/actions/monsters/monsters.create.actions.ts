'use server'

import { connectMongooseToDatabase } from '@/db'
import Monster from '@/db/models/monster.model'
import '@/db/models/xp-level.model'
import { auth } from '@/lib/auth'
import type { CreateMonsterFormValues } from '@/types/forms/create-monster-form'
import { getXpLevelByNumber } from '@/services/xp-level.service'
import { revalidatePath, revalidateTag } from 'next/cache'
import { headers } from 'next/headers'

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

  // Invalidation du cache des monstres pour cet utilisateur
  revalidateTag(`monsters-${session.user.id}`)

  // Revalidation du cache pour rafraîchir le dashboard
  revalidatePath('/dashboard')
  revalidatePath('/monsters')
}

