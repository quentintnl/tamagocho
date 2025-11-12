import mongoose, { type Model } from 'mongoose'

const { Schema } = mongoose

/**
 * Interface pour le document Wallet
 */
export interface IWallet {
  ownerId: string
  coin: number
  createdAt: Date
  updatedAt: Date
}

/**
 * Schema Mongoose pour Wallet
 */
const walletSchema = new Schema<IWallet>({
  ownerId: {
    type: String,
    required: true,
    unique: true
  },
  coin: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
})

/**
 * Type du modèle Mongoose
 */
type WalletModelType = Model<IWallet>

/**
 * Modèle Mongoose pour Wallet
 * Utilise le pattern singleton pour éviter la redéfinition en développement
 */
const Wallet: WalletModelType = (mongoose.models.Wallet as WalletModelType) ?? mongoose.model<IWallet>('Wallet', walletSchema)

export default Wallet
