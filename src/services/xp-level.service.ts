import XpLevel from '@/db/models/xp-level.model'
import type { XpLevel as XpLevelType } from '@/types/monster'

/**
 * Service de gestion des niveaux XP
 *
 * Responsabilité unique : gérer la logique métier des niveaux d'expérience
 * en respectant le principe de séparation des responsabilités (Clean Architecture).
 */

/**
 * Récupère tous les niveaux XP triés par ordre croissant
 *
 * @returns {Promise<XpLevelType[]>} Liste des niveaux XP
 */
export async function getAllXpLevels (): Promise<XpLevelType[]> {
  const levels = await XpLevel.find().sort({ level: 1 }).exec()
  return JSON.parse(JSON.stringify(levels))
}

/**
 * Récupère un niveau XP par son numéro
 *
 * @param {number} levelNumber - Numéro du niveau (1-5)
 * @returns {Promise<XpLevelType | null>} Niveau XP ou null si non trouvé
 */
export async function getXpLevelByNumber (levelNumber: number): Promise<XpLevelType | null> {
  const level = await XpLevel.findOne({ level: levelNumber }).exec()
  return level != null ? JSON.parse(JSON.stringify(level)) : null
}

/**
 * Récupère un niveau XP par son ID
 *
 * @param {string} levelId - ID du niveau
 * @returns {Promise<XpLevelType | null>} Niveau XP ou null si non trouvé
 */
export async function getXpLevelById (levelId: string): Promise<XpLevelType | null> {
  const level = await XpLevel.findById(levelId).exec()
  return level != null ? JSON.parse(JSON.stringify(level)) : null
}

/**
 * Calcule le nouveau niveau basé sur l'XP actuel
 *
 * Cette fonction parcourt les niveaux pour déterminer quel niveau
 * correspond à l'XP total accumulé.
 *
 * @param {number} totalXp - XP total accumulé
 * @returns {Promise<{ level: XpLevelType, remainingXp: number }>} Niveau atteint et XP restant
 */
export async function calculateLevelFromXp (
  totalXp: number
): Promise<{ level: XpLevelType, remainingXp: number }> {
  const levels = await getAllXpLevels()

  let accumulatedXp = 0
  let currentLevel = levels[0]

  for (const level of levels) {
    if (totalXp < accumulatedXp + level.xpRequired) {
      break
    }
    currentLevel = level
    accumulatedXp += level.xpRequired
  }

    const remainingXp = totalXp - accumulatedXp

  return {
    level: currentLevel,
    remainingXp
  }
}

/**
 * Calcule l'XP nécessaire pour atteindre le niveau suivant
 *
 * @param {number} currentLevelNumber - Numéro du niveau actuel
 * @returns {Promise<number | null>} XP requis pour le prochain niveau, ou null si niveau max
 */
export async function getXpRequiredForNextLevel (
  currentLevelNumber: number
): Promise<number | null> {
  const nextLevel = await getXpLevelByNumber(currentLevelNumber + 1)
  return nextLevel?.xpRequired ?? null
}

/**
 * Vérifie si un niveau est le niveau maximum
 *
 * @param {number} levelNumber - Numéro du niveau
 * @returns {Promise<boolean>} True si c'est le niveau maximum
 */
export async function isMaxLevel (levelNumber: number): Promise<boolean> {
  const level = await getXpLevelByNumber(levelNumber)
  return level?.isMaxLevel ?? false
}

