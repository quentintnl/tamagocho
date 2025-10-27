'use server'

import {connectMongooseToDatabase} from '@/db'
import Monster from '@/db/models/monster.model'
import {auth} from '@/lib/auth'
import type {CreateMonsterFormValues} from '@/types/forms/create-monster-form'
import type {DBMonster} from '@/types/monster'
import {revalidatePath} from 'next/cache'
import {headers} from 'next/headers'
import {Types} from "mongoose";

export async function createMonster(monsterData: CreateMonsterFormValues): Promise<void> {
    await connectMongooseToDatabase()

    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (session === null || session === undefined) throw new Error('User not authenticated')

    const monster = new Monster({
        ownerId: session.user.id,
        name: monsterData.name,
        state: monsterData.state,
        level: monsterData.level
    })

    await monster.save()
    revalidatePath('/dashboard')
}

export async function getMonsters(): Promise<DBMonster[]> {
    try {
        await connectMongooseToDatabase()

        const session = await auth.api.getSession({
            headers: await headers()
        })
        if (session === null || session === undefined) throw new Error('User not authenticated')

        const {user} = session

        const monsters = await Monster.find({ownerId: user.id}).exec()
        return JSON.parse(JSON.stringify(monsters))
    } catch (error) {
        console.error('Error fetching monsters:', error)
        return []
    }
}

export async function getMonsterById(id: string): Promise<DBMonster | null> {
    try {
        await connectMongooseToDatabase()

        const session = await auth.api.getSession({
            headers: await headers()
        })
        if (session === null || session === undefined) throw new Error('User not authenticated')

        const {user} = session

        const _id = id[0]

        if (!Types.ObjectId.isValid(_id)) {
            console.error('Invalid monster ID format')
            return null
        }

        const monster = await Monster.findOne({ownerId: user.id, _id: id}).exec()
        return JSON.parse(JSON.stringify(monster))
    } catch (error) {
        console.error('Error fetching monster by ID:', error)
        return null
    }
}
