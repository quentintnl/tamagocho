export const MONSTER_STATES = ['happy', 'sad', 'angry', 'hungry', 'sleepy'] as const

export type MonsterState = typeof MONSTER_STATES[number]

export const DEFAULT_MONSTER_LEVEL = 1
export const DEFAULT_MONSTER_STATE: MonsterState = MONSTER_STATES[0]

export type MonsterVariantId = 'cat' | 'dog' | 'rabbit' | 'panda'

export type MonsterBodyShape = 'round' | 'oval' | 'bean' | 'square' | 'pear'

export type MonsterDesignStyle = 'illustrated' | 'pixel'

export interface MonsterPalette {
  primary: string
  secondary: string
  detail: string
  cheeks: string
  background: string
  accent: string
}

export interface MonsterFeatures {
  earShape: 'pointy' | 'droopy' | 'long' | 'round'
  tailShape: 'long' | 'short' | 'puff' | 'none'
  whiskers: boolean
  muzzle: 'small' | 'medium' | 'flat'
  markings: 'plain' | 'mask' | 'patch'
}

export type MonsterAnimationKey = 'happyBounce' | 'sadDroop' | 'angryShake' | 'hungryNibble' | 'sleepyFloat' | 'pixelIdle'

export interface MonsterAnimationSpec {
  svgClassName: MonsterAnimationKey
}

export interface MonsterDesign {
  id: string
  variant: MonsterVariantId
  palette: MonsterPalette
  features: MonsterFeatures
  bodyShape: MonsterBodyShape
  style: MonsterDesignStyle
  animations: Record<MonsterState, MonsterAnimationSpec>
}

export interface MonsterGenerationOptions {
  seed?: string
  paletteOverride?: Partial<MonsterPalette>
  variantOverride?: MonsterVariantId
  bodyShapeOverride?: MonsterBodyShape
  style?: MonsterDesignStyle
}
