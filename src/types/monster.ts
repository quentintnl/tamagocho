export const MONSTER_STATES = ['happy', 'sad', 'angry', 'hungry', 'sleepy'] as const

export type MonsterState = typeof MONSTER_STATES[number]

export const DEFAULT_MONSTER_LEVEL = 1
export const DEFAULT_MONSTER_STATE: MonsterState = MONSTER_STATES[0]

// XP System Constants
export const XP_GAIN_CORRECT_ACTION = 20
export const XP_GAIN_INCORRECT_ACTION = 5
export const MAX_LEVEL = 5

// Pixel Monster Types (from GitHub v0-tomatgotchi)
export type MonsterStyle = 'round' | 'square' | 'tall' | 'wide'
export type EyeStyle = 'big' | 'small' | 'star' | 'sleepy'
export type AntennaStyle = 'single' | 'double' | 'curly' | 'none'
export type AccessoryStyle = 'horns' | 'ears' | 'tail' | 'none'

export interface MonsterTraits {
  bodyColor: string
  accentColor: string
  eyeColor: string
  antennaColor: string
  bobbleColor: string
  cheekColor: string
  bodyStyle: MonsterStyle
  eyeStyle: EyeStyle
  antennaStyle: AntennaStyle
  accessory: AccessoryStyle
}

// Database Monster type (serialized version)
export interface DBMonster {
  _id: string
  name: string
  level_id: string
  xp: number
  traits: string // JSON serialized MonsterTraits
  state: MonsterState
  ownerId: string
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

// XP Level type
export interface XpLevel {
  _id: string
  level: number
  xpRequired: number
  isMaxLevel: boolean
  createdAt: Date
  updatedAt: Date
}

// Monster with populated level
export interface PopulatedMonster extends Omit<DBMonster, 'level_id'> {
  level_id: XpLevel
  equippedAccessories?: Array<{
    _id: string
    ownerId: string
    accessoryId: string
    monsterId?: string
    purchasedAt: Date | string
    isEquipped: boolean
  }>
}

// Mongoose document type for Monster (for internal use in queries)
export interface MonsterDocument {
  _id: unknown
  name: string
  level_id: unknown | XpLevel
  xp: number
  traits: string
  state: MonsterState
  ownerId: string
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
  toObject: () => {
    _id: unknown
    name: string
    level_id: unknown | XpLevel
    xp: number
    traits: string
    state: MonsterState
    ownerId: string
    isPublic: boolean
    createdAt: Date
    updatedAt: Date
  }
}
