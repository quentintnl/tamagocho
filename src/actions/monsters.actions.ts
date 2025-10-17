'use server'

import { connectMongooseToDatabase } from '@/db'
import Monster from '@/db/models/monster.model'
import { auth } from '@/lib/auth'
import { CreateMonsterFormValues } from '@/types/forms/create-monster-form'
import { headers } from 'next/headers'

export async function createMonster (monsterData: CreateMonsterFormValues): Promise<void> {
  await connectMongooseToDatabase()

  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (session === null || session === undefined) throw new Error('User not authenticated')

  console.log(session)
  console.log(monsterData)

  const monster = new Monster({
    ownerId: session.user.id,
    ...monsterData
  })

  await monster.save()
}

export async function getMonsters (): Promise<Monster[]> {
  try {
    await connectMongooseToDatabase()

    const session = await auth.api.getSession({
      headers: await headers()
    })
    if (session === null || session === undefined) throw new Error('User not authenticated')

    const { user } = session

    const monsters = await Monster.find({ ownerId: user.id }).exec()
    return JSON.parse(JSON.stringify(monsters))
  } catch (error) {
    console.error('Error fetching monsters:', error)
    return []
  }
}
