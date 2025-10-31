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
 *
 * SOLID Principles Applied:
 * - Dependency Inversion: Depends on IWalletRepository abstraction, not MongoDB
 * - Single Responsibility: Each function has one reason to change
 */

import type { Wallet as WalletType, CreateWalletDTO, UpdateWalletBalanceDTO } from '@/types/wallet'
import { walletRepository, type IWalletRepository } from '@/repositories/wallet.repository'

/**
 * Creates a new wallet for a user
 * Single Responsibility: Handle wallet creation logic
 *
 * @param data - Wallet creation data
 * @param repository - Wallet repository (injectable for testing)
 * @returns The created wallet
 */
export async function createWallet (
  data: CreateWalletDTO,
  repository: IWalletRepository = walletRepository
): Promise<WalletType> {
  return await repository.create(data)
}

/**
 * Retrieves a wallet by owner ID
 * Single Responsibility: Fetch wallet data
 *
 * @param ownerId - The user's ID
 * @param repository - Wallet repository (injectable for testing)
 * @returns The wallet or null if not found
 */
export async function getWalletByOwnerId (
  ownerId: string,
  repository: IWalletRepository = walletRepository
): Promise<WalletType | null> {
  return await repository.findByOwnerId(ownerId)
}

/**
 * Gets or creates a wallet for a user
 * Single Responsibility: Ensure user has a wallet
 *
 * @param ownerId - The user's ID
 * @param repository - Wallet repository (injectable for testing)
 * @returns The wallet (existing or newly created)
 */
export async function getOrCreateWallet (
  ownerId: string,
  repository: IWalletRepository = walletRepository
): Promise<WalletType> {
  const existingWallet = await repository.findByOwnerId(ownerId)

  if (existingWallet !== null) {
    return existingWallet
  }

  return await repository.create({ ownerId, coin: 0 })
}

/**
 * Adds coins to a user's wallet
 * Single Responsibility: Handle coin addition logic
 *
 * @param data - Update data with ownerId and amount to add
 * @param repository - Wallet repository (injectable for testing)
 * @returns Updated wallet
 * @throws Error if wallet not found or amount is negative
 */
export async function addCoins (
  data: UpdateWalletBalanceDTO,
  repository: IWalletRepository = walletRepository
): Promise<WalletType> {
  if (data.amount < 0) {
    throw new Error('Amount to add must be positive')
  }

  return await repository.updateBalance(data.ownerId, data.amount)
}

/**
 * Subtracts coins from a user's wallet
 * Single Responsibility: Handle coin subtraction logic with balance validation
 *
 * @param data - Update data with ownerId and amount to subtract
 * @param repository - Wallet repository (injectable for testing)
 * @returns Updated wallet
 * @throws Error if wallet not found, amount is negative, or insufficient balance
 */
export async function subtractCoins (
  data: UpdateWalletBalanceDTO,
  repository: IWalletRepository = walletRepository
): Promise<WalletType> {
  if (data.amount < 0) {
    throw new Error('Amount to subtract must be positive')
  }

  const wallet = await repository.findByOwnerId(data.ownerId)

  if (wallet === null) {
    throw new Error('Wallet not found')
  }

  if (wallet.coin < data.amount) {
    throw new Error('Insufficient balance')
  }

  return await repository.updateBalance(data.ownerId, -data.amount)
}

/**
 * Checks if user has sufficient balance
 * Single Responsibility: Validate balance
 *
 * @param ownerId - The user's ID
 * @param amount - Amount to check
 * @param repository - Wallet repository (injectable for testing)
 * @returns True if user has sufficient balance
 */
export async function hasSufficientBalance (
  ownerId: string,
  amount: number,
  repository: IWalletRepository = walletRepository
): Promise<boolean> {
  const wallet = await repository.findByOwnerId(ownerId)

  if (wallet === null) {
    return false
  }

  return wallet.coin >= amount
}



