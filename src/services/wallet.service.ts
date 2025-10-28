/**
 * Wallet Service
 *
 * Domain Layer: Business logic for wallet management
 *
 * Responsibilities:
 * - Create wallet for new users
 * - Retrieve wallet by ownerId
 * - Add coins to wallet
 * - Subtract coins from wallet
 * - Check if user has sufficient balance
 *
 * Clean Architecture: This service contains pure business logic
 * and can be tested without database dependencies
 */

import Wallet from '@/db/models/wallet.model'
import type { Wallet as WalletType, CreateWalletDTO, UpdateWalletBalanceDTO } from '@/types/wallet'
import { connectMongooseToDatabase } from '@/db'

/**
 * Creates a new wallet for a user
 * Single Responsibility: Handle wallet creation logic
 *
 * @param data - Wallet creation data
 * @returns The created wallet
 */
export async function createWallet (data: CreateWalletDTO): Promise<WalletType> {
  await connectMongooseToDatabase()

  const wallet = await Wallet.create({
    ownerId: data.ownerId,
    coin: data.coin ?? 0
  })

  return wallet.toObject() as WalletType
}

/**
 * Retrieves a wallet by owner ID
 * Single Responsibility: Fetch wallet data
 *
 * @param ownerId - The user's ID
 * @returns The wallet or null if not found
 */
export async function getWalletByOwnerId (ownerId: string): Promise<WalletType | null> {
  await connectMongooseToDatabase()

  const wallet = await Wallet.findOne({ ownerId })

  if (wallet === null) {
    return null
  }

  return wallet.toObject() as WalletType
}

/**
 * Gets or creates a wallet for a user
 * Single Responsibility: Ensure user has a wallet
 *
 * @param ownerId - The user's ID
 * @returns The wallet (existing or newly created)
 */
export async function getOrCreateWallet (ownerId: string): Promise<WalletType> {
  await connectMongooseToDatabase()

  let wallet = await Wallet.findOne({ ownerId })

  if (wallet === null) {
    wallet = await Wallet.create({ ownerId, coin: 0 })
  }

  return wallet.toObject() as WalletType
}

/**
 * Adds coins to a user's wallet
 * Single Responsibility: Handle coin addition logic
 *
 * @param data - Update data with ownerId and amount to add
 * @returns Updated wallet
 * @throws Error if wallet not found or amount is negative
 */
export async function addCoins (data: UpdateWalletBalanceDTO): Promise<WalletType> {
  await connectMongooseToDatabase()

  if (data.amount < 0) {
    throw new Error('Amount to add must be positive')
  }

  const wallet = await Wallet.findOneAndUpdate(
    { ownerId: data.ownerId },
    { $inc: { coin: data.amount } },
    { new: true }
  )

  if (wallet === null) {
    throw new Error('Wallet not found')
  }

  return wallet.toObject() as WalletType
}

/**
 * Subtracts coins from a user's wallet
 * Single Responsibility: Handle coin subtraction logic with balance validation
 *
 * @param data - Update data with ownerId and amount to subtract
 * @returns Updated wallet
 * @throws Error if wallet not found, amount is negative, or insufficient balance
 */
export async function subtractCoins (data: UpdateWalletBalanceDTO): Promise<WalletType> {
  await connectMongooseToDatabase()

  if (data.amount < 0) {
    throw new Error('Amount to subtract must be positive')
  }

  const wallet = await Wallet.findOne({ ownerId: data.ownerId })

  if (wallet === null) {
    throw new Error('Wallet not found')
  }

  if (wallet.coin < data.amount) {
    throw new Error('Insufficient balance')
  }

  wallet.coin -= data.amount
  await wallet.save()

  return wallet.toObject() as WalletType
}

/**
 * Checks if user has sufficient balance
 * Single Responsibility: Validate balance
 *
 * @param ownerId - The user's ID
 * @param amount - Amount to check
 * @returns True if user has sufficient balance
 */
export async function hasSufficientBalance (ownerId: string, amount: number): Promise<boolean> {
  await connectMongooseToDatabase()

  const wallet = await Wallet.findOne({ ownerId })

  if (wallet === null) {
    return false
  }

  return wallet.coin >= amount
}

