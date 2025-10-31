/**
 * API Route pour renouveler les quêtes quotidiennes à minuit
 *
 * Cette route peut être appelée :
 * - Automatiquement par le frontend via le composant QuestsAutoRenewer
 * - Par un service externe de cron (Vercel Cron Jobs, etc.)
 * - Manuellement pour tester le renouvellement
 *
 * @endpoint GET/POST /api/cron/renew-quests
 */
import { NextRequest, NextResponse } from 'next/server'
import clientPromise, { connectMongooseToDatabase } from '@/db'

import DailyQuest from '@/db/models/daily-quest.model'
import { getRandomQuestTemplates } from '@/config/quests'

export const dynamic = 'force-dynamic'
export const maxDuration = 60 // 60 secondes max d'exécution

const QUESTS_PER_DAY = 5

/**
 * Logger avec timestamp pour un meilleur suivi
 */
function log (level: 'info' | 'warn' | 'error', message: string, data?: Record<string, unknown>): void {
  const timestamp = new Date().toISOString()
  const prefix = `[${timestamp}] [CRON-RENEW-QUESTS] [${level.toUpperCase()}]`

  if (data !== undefined) {
    console[level](`${prefix} ${message}`, data)
  } else {
    console[level](`${prefix} ${message}`)
  }
}

/**
 * Obtient le prochain minuit (00:00:00 du jour suivant)
 */
function getNextMidnight (): Date {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  return tomorrow
}

/**
 * Vérifie si c'est minuit (entre 00:00:00 et 00:05:00)
 */
function isMidnightWindow (): boolean {
  const now = new Date()
  const hours = now.getHours()
  const minutes = now.getMinutes()

  // Fenêtre de 5 minutes après minuit pour permettre l'exécution
  return hours === 0 && minutes < 5
}

export async function GET (request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now()

  // Récupérer l'userId depuis les query params (optionnel)
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const forceRenew = searchParams.get('force') === 'true' // Pour les tests

  log('info', `🌙 Démarrage du renouvellement des quêtes${userId !== null ? ` pour l'utilisateur ${userId}` : ' (tous les utilisateurs)'}...`)

  try {
    // 1. Sécurité optionnelle : vérifier un token secret
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.CRON_SECRET_TOKEN

    if ((expectedToken ?? '') !== '') {
      if (authHeader !== `Bearer ${expectedToken ?? ''}`) {
        log('warn', '🔒 Tentative d\'accès non autorisée', {
          ip: request.headers.get('x-forwarded-for') ?? 'unknown',
          userAgent: request.headers.get('user-agent') ?? 'unknown'
        })

        return NextResponse.json(
          { error: 'Unauthorized', message: 'Invalid or missing token' },
          { status: 401 }
        )
      }
    }

    // 2. Vérifier si c'est l'heure de minuit (sauf si force=true)
    if (!forceRenew && !isMidnightWindow()) {
      const now = new Date()
      log('info', `⏰ Pas encore l'heure de renouvellement (${now.getHours()}:${now.getMinutes()}). Minuit requis.`)

      return NextResponse.json({
        success: true,
        renewed: 0,
        message: 'Pas encore l\'heure de renouvellement',
        nextRenewal: getNextMidnight().toISOString(),
        timestamp: new Date().toISOString(),
        duration: Date.now() - startTime
      })
    }

    // 3. Connexion à MongoDB
    log('info', '🔌 Connexion à MongoDB...')
    await connectMongooseToDatabase()
    const client = await clientPromise
    const db = client.db()
    const usersCollection = db.collection('user')
    log('info', '✅ Connecté à MongoDB')

    // 4. Récupération des utilisateurs (un seul si userId fourni)
    log('info', '👥 Récupération des utilisateurs...')
    const query = (userId !== null) ? { id: userId } : {}
    const users = await usersCollection.find(query).toArray()
    log('info', `👥 ${users.length} utilisateur(s) trouvé(s)`, { query })

    if (users.length === 0) {
      const message = userId !== null
        ? `Aucun utilisateur trouvé avec l'ID ${userId}`
        : 'Aucun utilisateur à traiter'
      log('warn', `⚠️ ${message}`)
      return NextResponse.json({
        success: true,
        renewed: 0,
        message,
        timestamp: new Date().toISOString(),
        duration: Date.now() - startTime
      })
    }

    // 5. Renouveler les quêtes pour chaque utilisateur
    log('info', '🔄 Démarrage du renouvellement des quêtes...')
    let totalQuestsExpired = 0
    let totalQuestsCreated = 0
    let usersProcessed = 0
    const errors: Array<{ userId: string, error: string }> = []

    const now = new Date()
    const nextMidnight = getNextMidnight()

    for (const user of users) {
      try {
        const ownerId = user.id

        // Étape 1 : Marquer les quêtes actives expirées
        const expireResult = await DailyQuest.updateMany(
          {
            ownerId,
            status: { $in: ['active', 'completed'] },
            expiresAt: { $lte: now }
          },
          {
            $set: {
              status: 'expired',
              updatedAt: now
            }
          }
        )

        totalQuestsExpired += expireResult.modifiedCount

        // Étape 2 : Vérifier s'il reste des quêtes actives
        const activeQuests = await DailyQuest.countDocuments({
          ownerId,
          status: { $in: ['active', 'completed'] },
          expiresAt: { $gt: now }
        })

        // Étape 3 : Générer de nouvelles quêtes si nécessaire
        if (activeQuests === 0) {
          const templates = getRandomQuestTemplates(QUESTS_PER_DAY)

          const questsData = templates.map(template => ({
            ownerId,
            type: template.type,
            difficulty: template.difficulty,
            title: template.title,
            description: template.description,
            targetCount: template.targetCount,
            currentProgress: 0,
            coinReward: template.coinReward,
            xpReward: template.xpReward,
            status: 'active',
            expiresAt: nextMidnight,
            createdAt: now,
            updatedAt: now
          }))

          const createdQuests = await DailyQuest.insertMany(questsData)
          totalQuestsCreated += createdQuests.length

          log('info', `✅ Utilisateur ${String(ownerId)}: ${expireResult.modifiedCount} quête(s) expirée(s), ${createdQuests.length} quête(s) créée(s)`)
        } else {
          log('info', `ℹ️ Utilisateur ${String(ownerId)}: ${activeQuests} quête(s) encore active(s), pas de renouvellement`)
        }

        usersProcessed++
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
        log('error', `❌ Erreur pour l'utilisateur ${String(user.id)}`, { error: errorMessage })
        errors.push({ userId: user.id, error: errorMessage })
      }
    }

    // 6. Résumé des opérations
    const duration = Date.now() - startTime
    log('info', '✅ Renouvellement terminé', {
      usersProcessed,
      totalQuestsExpired,
      totalQuestsCreated,
      errors: errors.length,
      duration
    })

    return NextResponse.json({
      success: true,
      usersProcessed,
      totalQuestsExpired,
      totalQuestsCreated,
      errors: errors.length > 0 ? errors : undefined,
      nextRenewal: nextMidnight.toISOString(),
      timestamp: new Date().toISOString(),
      duration
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    log('error', '❌ Erreur critique lors du renouvellement', { error: errorMessage })

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: errorMessage,
        timestamp: new Date().toISOString(),
        duration: Date.now() - startTime
      },
      { status: 500 }
    )
  }
}

// Support POST pour les webhooks externes
export async function POST (request: NextRequest): Promise<NextResponse> {
  return await GET(request)
}
