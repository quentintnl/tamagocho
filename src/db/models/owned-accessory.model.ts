/**
 * Owned Accessory Model
 *
 * Infrastructure Layer: MongoDB model for purchased accessories
 *
 * Responsibilities:
 * - Define schema for owned accessories
 * - Provide database operations for accessory ownership
 *
 * Clean Architecture: Infrastructure layer - handles data persistence
 */

import mongoose, { type Model } from 'mongoose'
import type { OwnedAccessory } from '@/types/accessory'

/**
 * Mongoose schema for owned accessories
 */
const ownedAccessorySchema = new mongoose.Schema({
  ownerId: {
    type: String,
    required: true,
    index: true
  },
  accessoryId: {
    type: String,
    required: true
  },
  monsterId: {
    type: String,
    required: false,
    default: null
  },
  purchasedAt: {
    type: Date,
    default: Date.now
  },
  isEquipped: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

// Index composé pour éviter les doublons
ownedAccessorySchema.index({ ownerId: 1, accessoryId: 1 })

// Index pour rechercher rapidement les accessoires d'un monstre
ownedAccessorySchema.index({ monsterId: 1, isEquipped: 1 })

/**
 * Type du modèle Mongoose
 */
type OwnedAccessoryModelType = Model<OwnedAccessory>

/**
 * Mongoose model for owned accessories
 * Uses singleton pattern to prevent model redefinition in development
 */
export const OwnedAccessoryModel: OwnedAccessoryModelType =
  (mongoose.models.OwnedAccessory as OwnedAccessoryModelType) ??
  mongoose.model<OwnedAccessory>('OwnedAccessory', ownedAccessorySchema)
