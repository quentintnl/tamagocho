import mongoose from 'mongoose'

const { Schema } = mongoose

/**
 * Schéma pour les niveaux XP
 *
 * Responsabilité unique : définir la structure des niveaux d'expérience
 * avec leurs seuils requis.
 *
 * Structure :
 * - level: Numéro du niveau (1-5)
 * - xpRequired: XP nécessaire pour atteindre CE niveau depuis le précédent
 * - isMaxLevel: Indique si c'est le niveau maximum
 */
const xpLevelSchema = new Schema({
  level: {
    type: Number,
    required: true,
    unique: true,
    min: 1,
    max: 5
  },
  xpRequired: {
    type: Number,
    required: true,
    min: 0
  },
  isMaxLevel: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: true,
  collection: 'xp_levels'
})

export default mongoose.models.XpLevel ?? mongoose.model('XpLevel', xpLevelSchema)

