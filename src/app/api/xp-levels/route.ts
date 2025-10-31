import { connectMongooseToDatabase } from '@/db'
import XpLevel from '@/db/models/xp-level.model'
import { NextRequest } from 'next/server'
import { unstable_cache } from 'next/cache'

// Force dynamic rendering because we use searchParams
export const dynamic = 'force-dynamic'

// Cache long pour les données statiques (les niveaux XP ne changent jamais)
export const revalidate = 3600 // 1 heure

/**
 * API route pour récupérer un niveau XP spécifique
 *
 * GET /api/xp-levels?level=2 - Récupère le niveau XP par son numéro
 *
 * @returns {Promise<Response>} Données du niveau XP ou erreur
 */
export async function GET (request: NextRequest): Promise<Response> {
  try {
    const searchParams = request.nextUrl.searchParams
    const levelNumber = searchParams.get('level')

    if (levelNumber === null || levelNumber === undefined) {
      return Response.json({
        success: false,
        message: 'Le paramètre level est requis'
      }, { status: 400 })
    }

    const levelNum = parseInt(levelNumber, 10)
    if (isNaN(levelNum) || levelNum < 1 || levelNum > 5) {
      return Response.json({
        success: false,
        message: 'Le niveau doit être un nombre entre 1 et 5'
      }, { status: 400 })
    }

    // Fonction cachée pour récupérer le niveau XP (cache très long car statique)
    const getCachedXpLevel = unstable_cache(
      async (level: number) => {
        await connectMongooseToDatabase()
        const xpLevel = await XpLevel.findOne({ level }).exec()
        return JSON.parse(JSON.stringify(xpLevel))
      },
      [`xp-level-${levelNum}`],
      {
        revalidate: 3600, // 1 heure - les niveaux XP sont statiques
        tags: ['xp-levels']
      }
    )

    // Récupération du niveau XP
    const xpLevel = await getCachedXpLevel(levelNum)

    if (xpLevel === null || xpLevel === undefined) {
      return Response.json({
        success: false,
        message: `Niveau ${levelNum} non trouvé. Avez-vous exécuté le seed ?`
      }, { status: 404 })
    }

    return Response.json(xpLevel)
  } catch (error) {
    console.error('Erreur lors de la récupération du niveau XP:', error)
    return Response.json({
      success: false,
      message: 'Erreur lors de la récupération du niveau XP',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
