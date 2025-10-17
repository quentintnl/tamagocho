import {
  MONSTER_STATES,
  type MonsterAnimationSpec,
  type MonsterDesign,
  type MonsterDesignStyle,
  type MonsterFeatures,
  type MonsterGenerationOptions,
  type MonsterPalette,
  type MonsterState,
  type MonsterBodyShape,
  type MonsterVariantId
} from '@/types/monster'

interface MonsterVariantDefinition {
  id: MonsterVariantId
  basePalette: MonsterPalette
  baseFeatures: MonsterFeatures
  featurePool: {
    earShape: Array<MonsterFeatures['earShape']>
    tailShape: Array<MonsterFeatures['tailShape']>
    muzzle: Array<MonsterFeatures['muzzle']>
    markings: Array<MonsterFeatures['markings']>
    whiskers: boolean[]
  }
  furVariations?: Array<Partial<MonsterPalette>>
  bodyShapes: MonsterBodyShape[]
}

const VARIANT_LIBRARY: MonsterVariantDefinition[] = [
  {
    id: 'cat',
    basePalette: {
      primary: '#f5cfc0',
      secondary: '#ffe8db',
      detail: '#c07a62',
      cheeks: '#f8b9c9',
      background: '#fff6f1',
      accent: '#f6a9b6'
    },
    baseFeatures: {
      earShape: 'pointy',
      tailShape: 'long',
      whiskers: true,
      muzzle: 'small',
      markings: 'plain'
    },
    featurePool: {
      earShape: ['pointy', 'round'],
      tailShape: ['long', 'puff'],
      muzzle: ['small', 'medium'],
      markings: ['plain', 'patch'],
      whiskers: [true]
    },
    furVariations: [
      {
        primary: '#f4b796',
        secondary: '#ffe1ca',
        detail: '#b26549',
        accent: '#f39fb0'
      },
      {
        primary: '#f1d6b6',
        secondary: '#fff0dc',
        detail: '#ad7a52',
        cheeks: '#f8b9c9'
      }
    ],
    bodyShapes: ['round', 'oval', 'bean']
  },
  {
    id: 'dog',
    basePalette: {
      primary: '#e4c9a5',
      secondary: '#f5e5cf',
      detail: '#a37a58',
      cheeks: '#f4c7a3',
      background: '#f9efe3',
      accent: '#f0b37e'
    },
    baseFeatures: {
      earShape: 'droopy',
      tailShape: 'short',
      whiskers: false,
      muzzle: 'medium',
      markings: 'patch'
    },
    featurePool: {
      earShape: ['droopy', 'round'],
      tailShape: ['short', 'long'],
      muzzle: ['medium', 'flat'],
      markings: ['patch', 'plain'],
      whiskers: [false, true]
    },
    furVariations: [
      {
        primary: '#dcbc94',
        secondary: '#f3e2c8',
        detail: '#8f6846'
      },
      {
        primary: '#cda57a',
        secondary: '#f2e0c8',
        detail: '#7b5638',
        background: '#f4e7d6'
      }
    ],
    bodyShapes: ['square', 'pear', 'round']
  },
  {
    id: 'rabbit',
    basePalette: {
      primary: '#f3e8ef',
      secondary: '#fff4fb',
      detail: '#c4a1b5',
      cheeks: '#f8c9dc',
      background: '#fff8fd',
      accent: '#f5b6d1'
    },
    baseFeatures: {
      earShape: 'long',
      tailShape: 'puff',
      whiskers: true,
      muzzle: 'small',
      markings: 'plain'
    },
    featurePool: {
      earShape: ['long', 'droopy'],
      tailShape: ['puff', 'short'],
      muzzle: ['small', 'medium'],
      markings: ['plain'],
      whiskers: [true]
    },
    furVariations: [
      {
        primary: '#f2dee9',
        secondary: '#fff1f9',
        detail: '#bfa0b3',
        accent: '#f3aecd'
      },
      {
        primary: '#efd4dc',
        secondary: '#fef1f4',
        detail: '#c3a1aa',
        cheeks: '#f7c1d0'
      }
    ],
    bodyShapes: ['oval', 'pear', 'round']
  },
  {
    id: 'panda',
    basePalette: {
      primary: '#f4f4f4',
      secondary: '#ffffff',
      detail: '#58595b',
      cheeks: '#f9c5cb',
      background: '#f2f5f9',
      accent: '#9ad0f0'
    },
    baseFeatures: {
      earShape: 'round',
      tailShape: 'short',
      whiskers: false,
      muzzle: 'flat',
      markings: 'mask'
    },
    featurePool: {
      earShape: ['round'],
      tailShape: ['short', 'none'],
      muzzle: ['flat'],
      markings: ['mask'],
      whiskers: [false]
    },
    furVariations: [
      {
        primary: '#f6f6f6',
        secondary: '#ffffff',
        detail: '#4a4a4a',
        accent: '#8fc4e8'
      },
      {
        primary: '#ededed',
        secondary: '#fafafa',
        detail: '#3f3f3f',
        cheeks: '#f7bfc5'
      }
    ],
    bodyShapes: ['round', 'square', 'oval']
  }
]

const BASE_ANIMATIONS: Record<typeof MONSTER_STATES[number], MonsterAnimationSpec> = {
  happy: { svgClassName: 'happyBounce' },
  sad: { svgClassName: 'sadDroop' },
  angry: { svgClassName: 'angryShake' },
  hungry: { svgClassName: 'hungryNibble' },
  sleepy: { svgClassName: 'sleepyFloat' }
}

const PIXEL_ANIMATIONS: Record<typeof MONSTER_STATES[number], MonsterAnimationSpec> = {
  happy: { svgClassName: 'pixelIdle' },
  sad: { svgClassName: 'pixelIdle' },
  angry: { svgClassName: 'pixelIdle' },
  hungry: { svgClassName: 'pixelIdle' },
  sleepy: { svgClassName: 'pixelIdle' }
}

interface SeededRandom {
  nextFloat: () => number
  nextInt: (max: number) => number
}

const MAX_UINT32 = 0xffffffff

const createSeed = (seedSource: string): number => {
  let hash = 2166136261
  for (let index = 0; index < seedSource.length; index += 1) {
    hash ^= seedSource.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

const createSeededRandom = (seed: number): SeededRandom => {
  let state = seed === 0 ? 1 : seed
  const nextUInt = (): number => {
    state ^= state << 13
    state ^= state >>> 17
    state ^= state << 5
    const unsigned = state >>> 0
    return unsigned === 0 ? 1 : unsigned
  }
  return {
    nextFloat: () => nextUInt() / MAX_UINT32,
    nextInt: (max: number) => nextUInt() % max
  }
}

const cloneAnimations = (): Record<MonsterState, MonsterAnimationSpec> => ({
  happy: { ...BASE_ANIMATIONS.happy },
  sad: { ...BASE_ANIMATIONS.sad },
  angry: { ...BASE_ANIMATIONS.angry },
  hungry: { ...BASE_ANIMATIONS.hungry },
  sleepy: { ...BASE_ANIMATIONS.sleepy }
})

const clonePixelAnimations = (): Record<MonsterState, MonsterAnimationSpec> => ({
  happy: { ...PIXEL_ANIMATIONS.happy },
  sad: { ...PIXEL_ANIMATIONS.sad },
  angry: { ...PIXEL_ANIMATIONS.angry },
  hungry: { ...PIXEL_ANIMATIONS.hungry },
  sleepy: { ...PIXEL_ANIMATIONS.sleepy }
})

const buildAnimationsForStyle = (style: MonsterDesignStyle): Record<MonsterState, MonsterAnimationSpec> => (
  style === 'pixel' ? clonePixelAnimations() : cloneAnimations()
)

const HEX_COLOR_REGEX = /^#?([0-9a-f]{6})$/i

const clampChannel = (value: number): number => {
  if (value < 0) return 0
  if (value > 255) return 255
  return value
}

const adjustHexColor = (hexColor: string, factor: number): string => {
  const match = HEX_COLOR_REGEX.exec(hexColor)
  if (match === null) return hexColor

  const raw = match[1]
  const red = parseInt(raw.slice(0, 2), 16)
  const green = parseInt(raw.slice(2, 4), 16)
  const blue = parseInt(raw.slice(4, 6), 16)

  const adjust = (channel: number): number => clampChannel(Math.round(channel * (1 + factor)))

  const toHex = (channel: number): string => channel.toString(16).padStart(2, '0')

  return `#${toHex(adjust(red))}${toHex(adjust(green))}${toHex(adjust(blue))}`
}

const buildPalette = (variant: MonsterVariantDefinition, overrides: Partial<MonsterPalette> | undefined, rng: SeededRandom): MonsterPalette => {
  const base = variant.basePalette
  const variation = variant.furVariations !== undefined && variant.furVariations.length > 0
    ? variant.furVariations[rng.nextInt(variant.furVariations.length)]
    : undefined

  const primary = variation?.primary ?? base.primary
  const secondary = variation?.secondary ?? base.secondary
  const detail = variation?.detail ?? base.detail
  const cheeks = variation?.cheeks ?? base.cheeks

  const subtleVariation = (rng.nextFloat() * 0.18) - 0.09
  const backgroundBase = variation?.background ?? base.background
  const background = overrides?.background ?? adjustHexColor(backgroundBase, subtleVariation)
  const accentTwist = (rng.nextFloat() * 0.16) - 0.08
  const accentBase = variation?.accent ?? base.accent
  const accent = overrides?.accent ?? adjustHexColor(accentBase, accentTwist)

  return {
    primary: overrides?.primary ?? primary,
    secondary: overrides?.secondary ?? secondary,
    detail: overrides?.detail ?? detail,
    cheeks: overrides?.cheeks ?? cheeks,
    background,
    accent
  }
}

const pickFromPool = <T>(baseValue: T, pool: T[], rng: SeededRandom, variationChance: number): T => {
  if (pool.length <= 1 || rng.nextFloat() > variationChance) return baseValue
  const alternatives = pool.filter(option => option !== baseValue)
  if (alternatives.length === 0) return baseValue
  return alternatives[rng.nextInt(alternatives.length)]
}

const deriveFeatures = (variant: MonsterVariantDefinition, rng: SeededRandom): MonsterFeatures => {
  const { baseFeatures, featurePool } = variant

  const earShape = pickFromPool(baseFeatures.earShape, featurePool.earShape, rng, 0.35)
  const tailShape = pickFromPool(baseFeatures.tailShape, featurePool.tailShape, rng, 0.4)
  const muzzle = pickFromPool(baseFeatures.muzzle, featurePool.muzzle, rng, 0.45)
  const markings = pickFromPool(baseFeatures.markings, featurePool.markings, rng, 0.5)

  const whiskerOptions = featurePool.whiskers
  const whiskers = whiskerOptions.length === 0
    ? baseFeatures.whiskers
    : rng.nextFloat() > 0.75
      ? whiskerOptions[rng.nextInt(whiskerOptions.length)]
      : baseFeatures.whiskers

  return {
    earShape,
    tailShape,
    whiskers,
    muzzle,
    markings
  }
}

export const generateMonsterDesign = (options: MonsterGenerationOptions = {}): MonsterDesign => {
  const seedSource = options.seed !== undefined && options.seed.trim().length > 0
    ? options.seed.trim().toLowerCase()
    : `${Date.now()}`
  const seed = createSeed(seedSource)
  const rng = createSeededRandom(seed)
  const style: MonsterDesignStyle = options.style ?? 'illustrated'

  const resolvedVariant = options.variantOverride !== undefined
    ? VARIANT_LIBRARY.find(variant => variant.id === options.variantOverride) ?? VARIANT_LIBRARY[seed % VARIANT_LIBRARY.length]
    : VARIANT_LIBRARY[seed % VARIANT_LIBRARY.length]

  const bodyShape = options.bodyShapeOverride ?? resolvedVariant.bodyShapes[rng.nextInt(resolvedVariant.bodyShapes.length)]
  const palette = buildPalette(resolvedVariant, options.paletteOverride, rng)
  const features = deriveFeatures(resolvedVariant, rng)

  return {
    id: `${resolvedVariant.id}-${seed.toString(16)}`,
    variant: resolvedVariant.id,
    palette,
    features,
    bodyShape,
    style,
    animations: buildAnimationsForStyle(style)
  }
}

export const serializeMonsterDesign = (design: MonsterDesign): string => JSON.stringify(design)

export const createMonsterSeed = (seedSource: string): number => createSeed(seedSource)

export const createMonsterRandomizer = (seed: number): SeededRandom => createSeededRandom(seed)
