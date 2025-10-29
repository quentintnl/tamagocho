/**
 * Accessories Services Barrel Export
 *
 * Clean Architecture: Facilite les imports depuis le dossier accessories
 */

// Glasses
export { generateGlasses, generateSunglasses, generateNerdGlasses } from './glasses-generator'
export type { GlassesType } from './glasses-generator'

// Hats
export { generateHat, generatePartyHat, generateCrown, generateWizardHat } from './hat-generator'
export type { HatType } from './hat-generator'

// Necklaces
export { generateNecklace, generateHeartNecklace, generateDiamondNecklace } from './necklace-generator'
export type { NecklaceType } from './necklace-generator'

// Effects
export { generateEffect, generateSparkles, generateFire } from './effect-generator'
export type { EffectType } from './effect-generator'

// Backgrounds
export { generateBackground, generateStarsBackground, generateRainbowBackground } from './background-generator'
export type { BackgroundType } from './background-generator'

