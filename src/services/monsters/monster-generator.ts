import type { MonsterTraits, MonsterStyle, EyeStyle, AntennaStyle, AccessoryStyle } from '@/types/monster'

// Couleurs inspirées des légumes pour les monstres
const vegetableColors = [
  ['#FF6B6B', '#FF4444'], // Tomate - rouge vif
  ['#FFA500', '#FF8C00'], // Carotte - orange
  ['#9B59B6', '#8E44AD'], // Aubergine - violet
  ['#27AE60', '#229954'], // Brocoli/Courgette - vert
  ['#F39C12', '#E67E22'], // Potiron/Courge - orange foncé
  ['#E74C3C', '#C0392B'], // Poivron rouge
  ['#F1C40F', '#F39C12'], // Poivron jaune/Maïs
  ['#8B4513', '#A0522D'], // Champignon - brun
  ['#98D8C8', '#6BCF7E'], // Concombre - vert clair
  ['#DDA0DD', '#BA55D3']  // Chou rouge - violet/rose
]

// Couleurs pour les feuilles et tiges (antennes)
const leafColors = ['#2ECC71', '#27AE60', '#52BE80', '#7DCEA0', '#82E0AA', '#A9DFBF']
const eyeColors = ['#2C2C2C', '#4A4A4A', '#1A1A1A', '#3D3D3D', '#654321']

// Styles de corps inspirés des formes de légumes
const bodyStyles: MonsterStyle[] = ['round', 'square', 'tall', 'wide'] // rond=tomate/potiron, square=poivron, tall=carotte/aubergine, wide=courge
const eyeStyles: EyeStyle[] = ['big', 'small', 'star', 'sleepy']
const antennaStyles: AntennaStyle[] = ['single', 'double', 'curly', 'none'] // représentent les feuilles/tiges
const accessories: AccessoryStyle[] = ['horns', 'ears', 'tail', 'none'] // peuvent représenter des racines, feuilles supplémentaires

export function generateRandomTraits (): MonsterTraits {
  const randomPalette = vegetableColors[Math.floor(Math.random() * vegetableColors.length)]
  const randomLeaf = leafColors[Math.floor(Math.random() * leafColors.length)]
  const randomEye = eyeColors[Math.floor(Math.random() * eyeColors.length)]

  return {
    bodyColor: randomPalette[0],
    accentColor: randomPalette[1],
    eyeColor: randomEye,
    antennaColor: randomLeaf,
    bobbleColor: randomLeaf,
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
