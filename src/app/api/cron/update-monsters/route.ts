/**
 * API Route pour mettre à jour automatiquement les états des monstres
 *
 * Cette route peut être appelée :
 * - Automatiquement par le frontend via le composant MonstersAutoUpdater
 * - Manuellement via curl/Postman pour tester
 * - Par un service externe de ping (optionnel)
 *
 * @endpoint GET/POST /api/cron/update-monsters
 */
import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import clientPromise from '@/db'

const MONSTER_STATES = ['sad', 'angry', 'hungry', 'sleepy'] as const

export const dynamic = 'force-dynamic'
export const maxDuration = 60 // 60 secondes max d'exécution


export async function GET (request: NextRequest): Promise<NextResponse> {
    const startTime = Date.now()

    // Récupérer l'userId depuis les query params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    try {
        // 1. Sécurité optionnelle : vérifier un token secret
        const authHeader = request.headers.get('authorization')
        const expectedToken = process.env.CRON_SECRET_TOKEN

        if ((expectedToken ?? '') !== '') {
            if (authHeader !== `Bearer ${expectedToken ?? ''}`) {
                return NextResponse.json(
                    { error: 'Unauthorized', message: 'Invalid or missing token' },
                    { status: 401 }
                )
            }
        }

        const client = await clientPromise
        const db = client.db()
        const monstersCollection = db.collection('monsters')

        // 3. Récupération des monstres (filtrés par userId si fourni)
        // Le champ dans MongoDB s'appelle 'ownerId' (pas 'userId') et est un ObjectId
        const query = (userId !== null) ? { ownerId: new ObjectId(userId) } : {}
        const monsters = await monstersCollection.find(query).toArray()

        if (monsters.length === 0) {
            const message = userId !== null
                ? `Aucun monstre trouvé pour l'utilisateur ${userId}`
                : 'Aucun monstre à mettre à jour'
            return NextResponse.json({
                success: true,
                updated: 0,
                message,
                timestamp: new Date().toISOString(),
                duration: Date.now() - startTime
            })
        }

        // 4. Mise à jour des monstres
        let updatedCount = 0
        const updates: Array<{ id: string, oldState?: string, newState: string }> = []

        for (const monster of monsters) {
            const oldState = (monster.state ?? 'unknown') as string
            const newState = MONSTER_STATES[Math.floor(Math.random() * MONSTER_STATES.length)]

            await monstersCollection.updateOne(
                { _id: monster._id },
                {
                    $set: {
                        state: newState,
                        updatedAt: new Date(),
                        lastCronUpdate: new Date()
                    }
                }
            )

            updatedCount++
            updates.push({
                id: String(monster._id),
                oldState,
                newState
            })

        }

        // 5. Logs finaux
        const duration = Date.now() - startTime

        return NextResponse.json({
            success: true,
            updated: updatedCount,
            timestamp: new Date().toISOString(),
            duration,
            details: updates
        })
    } catch (error) {
        const duration = Date.now() - startTime
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        const errorStack = error instanceof Error ? error.stack : undefined

        return NextResponse.json(
            {
                success: false,
                error: 'Internal server error',
                message: errorMessage,
                timestamp: new Date().toISOString(),
                duration
            },
            { status: 500 }
        )
    }
}

// Support pour POST aussi (pour compatibilité)
export async function POST (request: NextRequest): Promise<NextResponse> {
    return await GET(request)
}
