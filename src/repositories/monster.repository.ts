/**
 * Monster Repository Interface & Implementation
 *
 * Infrastructure Layer: Data access abstraction
 *
 * Dependency Inversion Principle:
 * - Services depend on IMonsterRepository abstraction
 * - This file provides MongoDB implementation
 * - Allows easy mocking for tests
 * - Enables switching database without changing services
 */

import Monster from '@/db/models/monster.model'
import '@/db/models/xp-level.model'
import type { PopulatedMonster, XpLevel } from '@/types/monster'
import { connectMongooseToDatabase } from '@/db'
import type { Document } from 'mongoose'

/**
 * Mongoose Document type for Monster with populated level
 * Combines PopulatedMonster data with Mongoose Document methods
 */
export interface MongooseMonsterDocument extends Document {
  _id: string
  name: string
  level_id: XpLevel | string
  xp: number
  traits: string
  state: string
  ownerId: string
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
  markModified: (path: string) => void
  save: () => Promise<this>
}

/**
 * Monster Repository Interface
 * Abstraction for monster data access
 */
export interface IMonsterRepository {
  /**
   * Find monster by ID and owner, with level populated
   */
  findByIdAndOwner: (monsterId: string, ownerId: string) => Promise<PopulatedMonster | null>

  /**
   * Update monster data (state, xp, level)
   */
  updateMonsterData: (monster: PopulatedMonster, updates: {
    state?: string
    xp?: number
    levelId?: string
  }) => void

  /**
   * Save monster changes
   */
  save: (monster: PopulatedMonster) => Promise<PopulatedMonster>

  /**
   * Find all monsters for owner
   */
  findByOwner: (ownerId: string) => Promise<PopulatedMonster[]>

  /**
   * Delete monster by ID
   */
  deleteById: (monsterId: string, ownerId: string) => Promise<boolean>
}

/**
 * MongoDB implementation of Monster Repository
 * Implements IMonsterRepository using Mongoose
 */
export class MongoMonsterRepository implements IMonsterRepository {
  /**
   * Find monster by ID and owner, with level populated
   */
  async findByIdAndOwner (monsterId: string, ownerId: string): Promise<PopulatedMonster | null> {
    await connectMongooseToDatabase()
    const monster = await Monster.findOne({
      _id: monsterId,
      ownerId
    })
      .populate('level_id')
      .exec()

    if (monster === null) return null
    return monster as unknown as PopulatedMonster
  }

  /**
   * Update monster data (state, xp, level)
   * Properly handles type casting for Mongoose document mutation
   */
  updateMonsterData (monster: PopulatedMonster, updates: {
    state?: string
    xp?: number
    levelId?: string
  }): void {
    const monsterDoc = monster as unknown as MongooseMonsterDocument

    if (updates.state !== undefined) {
      monsterDoc.state = updates.state
    }
    if (updates.xp !== undefined) {
      monsterDoc.xp = updates.xp
    }
    if (updates.levelId !== undefined) {
      monsterDoc.level_id = updates.levelId
    }
  }

  /**
   * Save monster changes
   * The monster parameter is a Mongoose document with proper typing
   */
  async save (monster: PopulatedMonster): Promise<PopulatedMonster> {
    await connectMongooseToDatabase()

    // Cast to MongooseMonsterDocument to access Mongoose document methods
    // This is safe because monster comes from Mongoose queries (findOne, find, etc.)
    const monsterDoc = monster as unknown as MongooseMonsterDocument

    // Mark fields as modified (important for Mongoose)
    monsterDoc.markModified('state')
    monsterDoc.markModified('xp')
    monsterDoc.markModified('level_id')

    await monsterDoc.save()
    return monster
  }

  /**
   * Find all monsters for owner
   */
  async findByOwner (ownerId: string): Promise<PopulatedMonster[]> {
    await connectMongooseToDatabase()
    const monsters = await Monster.find({ ownerId })
      .populate('level_id')
      .exec()
    return monsters as unknown as PopulatedMonster[]
  }

  /**
   * Delete monster by ID
   */
  async deleteById (monsterId: string, ownerId: string): Promise<boolean> {
    await connectMongooseToDatabase()
    const result = await Monster.deleteOne({ _id: monsterId, ownerId })
    return result.deletedCount > 0
  }
}

/**
 * Default repository instance
 * Can be replaced with mock for testing
 */
export const monsterRepository: IMonsterRepository = new MongoMonsterRepository()
