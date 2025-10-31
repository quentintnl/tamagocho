/**
 * Type definitions for Wallet domain
 *
 * Domain Layer: Pure TypeScript types representing the Wallet entity
 * No dependencies on external libraries or frameworks
 */

/**
 * Wallet entity representing user's in-game currency
 */
export interface Wallet {
  _id: string
  ownerId: string
  coin: number
  createdAt: Date | string
  updatedAt: Date | string
}

/**
 * DTO for creating a new wallet
 */
export interface CreateWalletDTO {
  ownerId: string
  coin?: number
}

/**
 * Mongoose document type for Wallet
 */
export interface WalletDocument {
  _id: unknown
  ownerId: string
  coin: number
  createdAt: Date
  updatedAt: Date
  toObject: () => {
    _id: unknown
    ownerId: string
    coin: number
    createdAt: Date
    updatedAt: Date
  }
}

/**
 * DTO for updating wallet balance
 */
export interface UpdateWalletBalanceDTO {
  ownerId: string
  amount: number
}
