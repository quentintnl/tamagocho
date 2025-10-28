import { connectMongooseToDatabase } from '@/db'
import Monster from '@/db/models/monster.model'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { NextRequest } from 'next/server'

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

    await connectMongooseToDatabase()
    const monster = await Monster.findOne({ ownerId: session.user.id, _id: monsterId }).exec()

    // Sérialisation JSON pour éviter les problèmes de typage Next.js
    return Response.json(monster)
}
