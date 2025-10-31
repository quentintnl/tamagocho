/**
 * Daily Quest Model
 *
 * Infrastructure Layer: Mongoose schema for daily quests
 *
 * Responsibilities:
 * - Define quest data structure in MongoDB
 * - Handle automatic timestamps
 * - Validate quest data
 * - Index for efficient queries (ownerId, expiresAt, status)
 */

import mongoose from 'mongoose'
import { QUEST_TYPES, QUEST_DIFFICULTIES, QUEST_STATUSES } from '@/types/quest'

const { Schema } = mongoose

const dailyQuestSchema = new Schema({
  ownerId: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: QUEST_TYPES,
    required: true
  },
  difficulty: {
    type: String,
    enum: QUEST_DIFFICULTIES,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  targetCount: {
    type: Number,
    required: true,
    min: 1
  },
  currentProgress: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  coinReward: {
    type: Number,
    required: true,
    min: 0
  },
  xpReward: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: QUEST_STATUSES,
    default: 'active'
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  }
}, {
  timestamps: true
})

// Compound index for efficient querying of active quests by user
dailyQuestSchema.index({ ownerId: 1, status: 1, expiresAt: 1 })

const DailyQuest = mongoose.models.DailyQuest ?? mongoose.model('DailyQuest', dailyQuestSchema)

export default DailyQuest
