/**
 * Owned Accessory Service
 *
 * Domain Layer: Business logic for owned accessories management
 *
 * Responsibilities:
 * - Create owned accessory records
 * - Retrieve owned accessories by user/monster
 * - Equip/unequip accessories
 * - Validate ownership before operations
 *
 * Clean Architecture: Pure business logic with database abstraction
 */

import { OwnedAccessoryModel } from '@/db/models/owned-accessory.model'
import type { OwnedAccessory } from '@/types/accessory'
import { connectMongooseToDatabase } from '@/db'

/**
 * Create a new owned accessory record
 *
 * @param ownerId - User ID who owns the accessory
 * @param accessoryId - Accessory ID that was purchased
 * @param monsterId - Optional monster ID to equip to
 * @returns Created owned accessory
 */
export async function createOwnedAccessory (
  ownerId: string,
  accessoryId: string,
  monsterId?: string
): Promise<OwnedAccessory> {
  await connectMongooseToDatabase()

  const ownedAccessory = await OwnedAccessoryModel.create({
    ownerId,
    accessoryId,
    monsterId: monsterId ?? null,
    purchasedAt: new Date(),
    isEquipped: monsterId !== undefined
  })

  return ownedAccessory.toObject()
}

/**
 * Get all owned accessories for a user
 *
 * @param ownerId - User ID
 * @returns Array of owned accessories
 */
export async function getOwnedAccessoriesByUser (ownerId: string): Promise<OwnedAccessory[]> {
  await connectMongooseToDatabase()

  return await OwnedAccessoryModel.find({ ownerId }).lean()
}

/**
 * Get owned accessories for a specific monster
 *
 * @param monsterId - Monster ID
 * @returns Array of owned accessories equipped to the monster
 */
export async function getOwnedAccessoriesByMonster (monsterId: string): Promise<OwnedAccessory[]> {
  await connectMongooseToDatabase()

  return await OwnedAccessoryModel.find({
    monsterId,
    isEquipped: true
  }).lean()
}

/**
 * Check if user owns a specific accessory
 *
 * @param ownerId - User ID
 * @param accessoryId - Accessory ID to check
 * @returns True if user owns the accessory
 */
export async function userOwnsAccessory (ownerId: string, accessoryId: string): Promise<boolean> {
  await connectMongooseToDatabase()

  const count = await OwnedAccessoryModel.countDocuments({
    ownerId,
    accessoryId
  })

  return count > 0
}

/**
 * Equip an accessory to a monster
 *
 * @param ownedAccessoryId - Owned accessory ID
 * @param monsterId - Monster ID to equip to
 * @returns Updated owned accessory
 */
export async function equipAccessoryToMonster (
  ownedAccessoryId: string,
  monsterId: string
): Promise<OwnedAccessory | null> {
  await connectMongooseToDatabase()

  return await OwnedAccessoryModel.findByIdAndUpdate(
    ownedAccessoryId,
    {
      monsterId,
      isEquipped: true
    },
    { new: true }
  ).lean()
}

/**
 * Unequip an accessory from a monster
 *
 * @param ownedAccessoryId - Owned accessory ID
 * @returns Updated owned accessory
 */
export async function unequipAccessory (ownedAccessoryId: string): Promise<OwnedAccessory | null> {
  await connectMongooseToDatabase()

  return await OwnedAccessoryModel.findByIdAndUpdate(
    ownedAccessoryId,
    {
      monsterId: null,
      isEquipped: false
    },
    { new: true }
  ).lean()
}

/**
 * Get IDs of accessories owned by a user
 *
 * @param ownerId - User ID
 * @returns Array of accessory IDs
 */
export async function getOwnedAccessoryIds (ownerId: string): Promise<string[]> {
  await connectMongooseToDatabase()

  return await OwnedAccessoryModel.find({ ownerId })
    .distinct('accessoryId')
    .lean()
}

/**
 * Delete an owned accessory
 *
 * @param ownedAccessoryId - Owned accessory ID
 * @returns True if deleted successfully
 */
export async function deleteOwnedAccessory (ownedAccessoryId: string): Promise<boolean> {
  await connectMongooseToDatabase()

  const result = await OwnedAccessoryModel.findByIdAndDelete(ownedAccessoryId)
  return result !== null
}

