/**
 * Wallet Repository Interface & Implementation
 *
 * Infrastructure Layer: Data access abstraction
 *
 * Dependency Inversion Principle:
 * - Services depend on IWalletRepository abstraction
 * - This file provides MongoDB implementation
 * - Allows easy mocking for tests
 * - Enables switching database without changing services
 */

import Wallet from '@/db/models/wallet.model'
import type { Wallet as WalletType, CreateWalletDTO, WalletDocument } from '@/types/wallet'
import { connectMongooseToDatabase } from '@/db'

/**
 * Wallet Repository Interface
 * Abstraction for wallet data access
 */
export interface IWalletRepository {
  /**
   * Find wallet by owner ID
   */
  findByOwnerId: (ownerId: string) => Promise<WalletType | null>

  /**
   * Create a new wallet
   */
  create: (data: CreateWalletDTO) => Promise<WalletType>

  /**
   * Update wallet balance
   */
  updateBalance: (ownerId: string, amount: number) => Promise<WalletType>

  /**
   * Check if wallet exists
   */
  exists: (ownerId: string) => Promise<boolean>
}

/**
 * Serializes a Mongoose wallet document to a plain object
 * Converts ObjectId and Dates to strings for Client Component compatibility
 *
 * @param doc - Mongoose wallet document or lean object
 * @returns Plain wallet object
 */
function serializeWallet (doc: WalletDocument | any): WalletType {
  // Si c'est un document Mongoose avec toObject(), on l'utilise
  // Sinon, on traite doc comme un objet simple (lean)
  const obj = typeof doc.toObject === 'function' ? doc.toObject() : doc
  return {
    _id: String(obj._id),
    ownerId: obj.ownerId,
    coin: obj.coin,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt
  }
}

/**
 * MongoDB implementation of Wallet Repository
 * Implements IWalletRepository using Mongoose
 */
export class MongoWalletRepository implements IWalletRepository {
  /**
   * Find wallet by owner ID
   */
  async findByOwnerId (ownerId: string): Promise<WalletType | null> {
    await connectMongooseToDatabase()
    const wallet = await Wallet.findOne({ ownerId }).lean()
    if (wallet === null) return null
    return serializeWallet(wallet as unknown as WalletDocument)
  }

  /**
   * Create a new wallet
   */
  async create (data: CreateWalletDTO): Promise<WalletType> {
    await connectMongooseToDatabase()
    const wallet = await Wallet.create({
      ownerId: data.ownerId,
      coin: data.coin ?? 0
    })
    return serializeWallet(wallet)
  }

  /**
   * Update wallet balance (add or subtract)
   */
  async updateBalance (ownerId: string, amount: number): Promise<WalletType> {
    await connectMongooseToDatabase()
    const wallet = await Wallet.findOneAndUpdate(
      { ownerId },
      { $inc: { coin: amount } },
      { new: true, upsert: false }
    )

    if (wallet === null) {
      throw new Error(`Wallet not found for owner ${ownerId}`)
    }

    return serializeWallet(wallet)
  }

  /**
   * Check if wallet exists for owner
   */
  async exists (ownerId: string): Promise<boolean> {
    await connectMongooseToDatabase()
    const count = await Wallet.countDocuments({ ownerId })
    return count > 0
  }
}

/**
 * Default repository instance
 * Can be replaced with mock for testing
 */
export const walletRepository: IWalletRepository = new MongoWalletRepository()
