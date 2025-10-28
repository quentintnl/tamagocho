import { connectMongooseToDatabase } from '@/db'
import XpLevel from '@/db/models/xp-level.model'

const XP_LEVELS_DATA = [
  { level: 1, xpRequired: 0, isMaxLevel: false },
  { level: 2, xpRequired: 50, isMaxLevel: false },
  { level: 3, xpRequired: 100, isMaxLevel: false },
  { level: 4, xpRequired: 150, isMaxLevel: false },
  { level: 5, xpRequired: 200, isMaxLevel: true }
]

/**
 * API route pour initialiser les niveaux XP
 *
 * GET /api/seed-xp - Crée ou réinitialise les 5 niveaux XP dans la base de données
 *
 * @returns {Promise<Response>} Résultat de l'opération avec les niveaux créés
 */
export async function GET (): Promise<Response> {
  try {
    // Connexion à la base de données
    await connectMongooseToDatabase()

    // Suppression des anciens niveaux XP
    await XpLevel.deleteMany({})

    // Création des niveaux XP
    const createdLevels = await XpLevel.insertMany(XP_LEVELS_DATA)

    return Response.json({
      success: true,
      message: 'Niveaux XP initialisés avec succès',
      levels: createdLevels.map(level => ({
        level: level.level,
        xpRequired: level.xpRequired,
        isMaxLevel: level.isMaxLevel
      }))
    })
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des niveaux XP:', error)
    return Response.json({
      success: false,
      message: 'Erreur lors de l\'initialisation des niveaux XP',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

