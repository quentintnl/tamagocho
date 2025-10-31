import { connectMongooseToDatabase } from '@/db'
import Monster from '@/db/models/monster.model'
import '@/db/models/xp-level.model'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { NextRequest } from 'next/server'
import { unstable_cache } from 'next/cache'

// Cache court pour les données dynamiques
export const revalidate = 10

export async function GET (request: NextRequest): Promise<Response> {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session === null || session === undefined) {
    return new Response('Unauthorized', { status: 401 })
  }

  const monsterId = request.nextUrl.searchParams.get('id')
  if (monsterId === null || monsterId === undefined) {
    return new Response('Missing monster id', { status: 400 })
  }

  // Fonction cachée pour récupérer le monstre
  const getCachedMonster = unstable_cache(
    async (id: string, userId: string) => {
      await connectMongooseToDatabase()
      const monster = await Monster.findOne({ ownerId: userId, _id: id }).populate('level_id').exec()
      return JSON.parse(JSON.stringify(monster))
    },
    [`api-monster-${monsterId}-${session.user.id}`],
    {
      revalidate: 10,
      tags: [`monster-${monsterId}`, `monsters-${session.user.id}`]
    }
  )

  const monster = await getCachedMonster(monsterId, session.user.id)

  // Sérialisation JSON pour éviter les problèmes de typage Next.js
  return Response.json(monster)
}
