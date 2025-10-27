import type { MonsterTraits, MonsterStyle, EyeStyle, AntennaStyle, AccessoryStyle } from '@/types/monster'

// Couleurs pastels pour les monstres
const pastelColors = [
  ['#FFB5E8', '#FF9CEE'],
  ['#B5E8FF', '#9CD8FF'],
  ['#E8FFB5', '#D8FF9C'],
  ['#FFE8B5', '#FFD89C'],
  ['#E8B5FF', '#D89CFF'],
  ['#FFB5C5', '#FF9CB5'],
  ['#B5FFE8', '#9CFFD8'],
  ['#FFC5B5', '#FFB59C']
]

const antennaColors = ['#FFE66D', '#FF6B9D', '#6BDBFF', '#B4FF6B', '#FF9CEE', '#FFB347']
const eyeColors = ['#2C2C2C', '#4A4A4A', '#1A1A1A', '#3D3D3D']

const bodyStyles: MonsterStyle[] = ['round', 'square', 'tall', 'wide']
const eyeStyles: EyeStyle[] = ['big', 'small', 'star', 'sleepy']
const antennaStyles: AntennaStyle[] = ['single', 'double', 'curly', 'none']
const accessories: AccessoryStyle[] = ['horns', 'ears', 'tail', 'none']

export function generateRandomTraits (): MonsterTraits {
  const randomPalette = pastelColors[Math.floor(Math.random() * pastelColors.length)]
  const randomAntenna = antennaColors[Math.floor(Math.random() * antennaColors.length)]
  const randomEye = eyeColors[Math.floor(Math.random() * eyeColors.length)]

  return {
    bodyColor: randomPalette[0],
    accentColor: randomPalette[1],
    eyeColor: randomEye,
    antennaColor: randomAntenna,
    bobbleColor: randomAntenna,
    cheekColor: adjustColorOpacity(randomPalette[0], 0.7),
    bodyStyle: bodyStyles[Math.floor(Math.random() * bodyStyles.length)],
    eyeStyle: eyeStyles[Math.floor(Math.random() * eyeStyles.length)],
    antennaStyle: antennaStyles[Math.floor(Math.random() * antennaStyles.length)],
    accessory: accessories[Math.floor(Math.random() * accessories.length)]
  }
}

function adjustColorOpacity (hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  const adjustedR = Math.round(r + (255 - r) * (1 - opacity))
  const adjustedG = Math.round(g + (255 - g) * (1 - opacity))
  const adjustedB = Math.round(b + (255 - b) * (1 - opacity))

  return `#${adjustedR.toString(16).padStart(2, '0')}${adjustedG.toString(16).padStart(2, '0')}${adjustedB.toString(16).padStart(2, '0')}`
}
