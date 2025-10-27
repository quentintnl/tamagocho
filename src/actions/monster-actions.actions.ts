'use server'

import {revalidatePath} from 'next/cache'
import {MonsterAction} from '@/types/monster-actions'
import mongoose from 'mongoose'
import {connectToDatabase} from '@/db'
import {getMonsterById} from './monsters.actions'

export async function performMonsterAction(monsterId: string, action: MonsterAction): Promise<void> {
    await connectToDatabase()
    const monster = await getMonsterById(monsterId)

    if (!monster) {
        throw new Error('Monster not found')
    }

    // Mettre à jour l'état du monstre en fonction de l'action
    let newState = 'happy'

    switch (action) {
        case 'feed':
            newState = 'happy'
            break
        case 'comfort':
            newState = 'happy'
            break
        case 'cuddle':
            newState = 'happy'
            break
        case 'wake':
            newState = 'happy'
            break
        default:
            newState = monster.state
    }

    await mongoose.connection.collection('monsters').updateOne(
        {id: monsterId},
        {$set: {state: newState}}
    )

    revalidatePath(`/creature/${monsterId}`)
}
