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

// Shoes
export { generateShoes, generateSneakers, generateBoots } from './shoes-generator'
export type { ShoesType } from './shoes-generator'

// Effects
export { generateEffect, generateSparkles, generateFire } from './effect-generator'
export type { EffectType } from './effect-generator'

// Backgrounds
export { generateBackground, generateStarsBackground, generateRainbowBackground } from './background-generator'
export type { BackgroundType } from './background-generator'

