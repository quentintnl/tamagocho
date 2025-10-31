import type { MonsterTraits, MonsterStyle, EyeStyle, AntennaStyle, AccessoryStyle } from '@/types/monster'

// Couleurs inspirées des différentes variétés de tomates
const tomatoColors = [
  ['#FF6347', '#E53935'], // Tomate rouge classique - rouge vif
  ['#DC143C', '#B71C1C'], // Tomate rouge foncé - rouge profond
  ['#FF4500', '#D84315'], // Tomate rouge-orange - rouge orangé
  ['#FFD700', '#FFC107'], // Tomate jaune/golden - jaune doré
  ['#FFA500', '#FF8C00'], // Tomate orange - orange
  ['#8B4513', '#6D4C41'], // Tomate noire/kumato - brun foncé
  ['#98D8C8', '#26A69A'], // Tomate verte - vert clair
  ['#FF69B4', '#EC407A'], // Tomate rose - rose vif
  ['#9B59B6', '#8E44AD'], // Tomate pourpre - violet
  ['#F4A460', '#D2691E'] // Tomate zébrée - brun sable
]

// Couleurs pour les feuilles et tiges de tomates (antennes)
const leafColors = ['#2ECC71', '#27AE60', '#52BE80', '#7DCEA0', '#82E0AA', '#A9DFBF']
const eyeColors = ['#2C2C2C', '#4A4A4A', '#1A1A1A', '#3D3D3D', '#654321']

// Styles de corps inspirés des formes de tomates
const bodyStyles: MonsterStyle[] = ['round', 'square', 'tall', 'wide'] // round=tomate ronde, square=tomate carrée, tall=tomate allongée/roma, wide=tomate côtelée
const eyeStyles: EyeStyle[] = ['big', 'small', 'star', 'sleepy']
const antennaStyles: AntennaStyle[] = ['single', 'double', 'curly', 'none'] // représentent les tiges et feuilles de tomates
const accessories: AccessoryStyle[] = ['horns', 'ears', 'tail', 'none'] // peuvent représenter des feuilles supplémentaires ou pédoncules

export function generateRandomTraits (): MonsterTraits {
  const randomPalette = tomatoColors[Math.floor(Math.random() * tomatoColors.length)]
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
