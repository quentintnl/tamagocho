export const MONSTER_STATES = ['happy', 'sad', 'angry', 'hungry', 'sleepy'] as const

export type MonsterState = typeof MONSTER_STATES[number]

export const DEFAULT_MONSTER_LEVEL = 1
export const DEFAULT_MONSTER_STATE: MonsterState = MONSTER_STATES[0]

// Pixel Monster Types (from GitHub v0-tamagotcho)
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
  level: number
  traits: string // JSON serialized MonsterTraits
  state: MonsterState
  ownerId: string
  createdAt: Date
  updatedAt: Date
}
