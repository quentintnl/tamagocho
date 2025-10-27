import {NextResponse} from 'next/server'
import {auth} from '@/lib/auth'
import MonsterModel from '@/db/models/monster.model'
import {headers} from "next/headers";

export async function POST(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })
        if (session == null) {
            return NextResponse.json({error: 'Non autorisé'}, {status: 401})
        }

        const data = await request.json()

        const monster = await MonsterModel.create({
            name: data.name,
            draw: data.draw,
            level: 1, // Niveau initial
            state: 'happy', // État initial
            ownerId: session.user.id
        })

        return NextResponse.json(monster)
    } catch (error) {
        console.error('Erreur création monstre:', error)
        return NextResponse.json(
            {error: 'Erreur lors de la création du monstre'},
            {status: 500}
        )
    }
}
