/**
 * Necklace Generator Service
 *
 * Domain Layer: Pure business logic for generating necklace accessories
 *
 * Responsibilities:
 * - Generate SVG representations of heart necklaces
 * - Generate SVG representations of diamond necklaces
 *
 * Clean Architecture: This service contains pure domain logic
 */

/**
 * Type de collier disponible
 */
export type NecklaceType = 'heart' | 'diamond'

/**
 * Configuration pour les colliers cœur
 */
interface HeartNecklaceConfig {
  heartColor: string
  chainColor: string
  hasShine: boolean
}

/**
 * Configuration pour les colliers diamant
 */
interface DiamondNecklaceConfig {
  diamondColor: string
  chainColor: string
  facetCount: number
}

/**
 * Generate heart necklace SVG
 *
 * @param config - Configuration du collier cœur
 * @returns SVG string
 */
export function generateHeartNecklace (config: HeartNecklaceConfig = {
  heartColor: '#FF1493',
  chainColor: '#C0C0C0',
  hasShine: true
}): string {
  const { heartColor, chainColor, hasShine } = config

  return `
    <svg 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg"
      style="width: 100%; height: auto;"
    >
      <defs>
        <linearGradient id="heart-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#FF69B4;stop-opacity:1" />
          <stop offset="100%" style="stop-color:${heartColor};stop-opacity:1" />
        </linearGradient>
        <radialGradient id="heart-shine">
          <stop offset="0%" style="stop-color:white;stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:${heartColor};stop-opacity:0" />
        </radialGradient>
      </defs>

      <!-- Chaîne du collier -->
      <path
        d="M 40 60 Q 100 80 160 60"
        fill="none"
        stroke="${chainColor}"
        stroke-width="4"
        stroke-linecap="round"
      />

      <!-- Maillons décoratifs -->
      ${Array.from({ length: 7 }, (_, i) => {
        const x = 55 + i * 15
        const y = 65 + Math.sin(i * 0.5) * 5
        return `<circle cx="${x}" cy="${y}" r="3" fill="${chainColor}" stroke="#808080" stroke-width="1" />`
      }).join('')}

      <!-- Cœur pendentif -->
      <path
        d="M 100 140 
           C 100 140, 85 120, 85 105 
           C 85 95, 90 85, 100 85 
           C 110 85, 115 95, 115 105 
           C 115 120, 100 140, 100 140 Z"
        fill="url(#heart-gradient)"
        stroke="#C71585"
        stroke-width="3"
      />

      ${hasShine ? `
      <!-- Reflets brillants -->
      <ellipse
        cx="95"
        cy="95"
        rx="8"
        ry="12"
        fill="url(#heart-shine)"
        opacity="0.6"
      />
      <circle
        cx="105"
        cy="110"
        r="4"
        fill="white"
        opacity="0.4"
      />
      ` : ''}

      <!-- Attache du pendentif -->
      <ellipse
        cx="100"
        cy="75"
        rx="5"
        ry="3"
        fill="${chainColor}"
        stroke="#808080"
        stroke-width="1.5"
      />
      <line
        x1="100"
        y1="75"
        x2="100"
        y2="85"
        stroke="${chainColor}"
        stroke-width="3"
        stroke-linecap="round"
      />
    </svg>
  `.trim()
}

/**
 * Generate diamond necklace SVG
 *
 * @param config - Configuration du collier diamant
 * @returns SVG string
 */
export function generateDiamondNecklace (config: DiamondNecklaceConfig = {
  diamondColor: '#00CED1',
  chainColor: '#FFD700',
  facetCount: 6
}): string {
  const { diamondColor, chainColor, facetCount } = config

  return `
    <svg 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg"
      style="width: 100%; height: auto;"
    >
      <defs>
        <linearGradient id="diamond-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#E0FFFF;stop-opacity:1" />
          <stop offset="50%" style="stop-color:${diamondColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#4682B4;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="chain-gold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#FFFACD;stop-opacity:1" />
          <stop offset="50%" style="stop-color:${chainColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#DAA520;stop-opacity:1" />
        </linearGradient>
      </defs>

      <!-- Chaîne en or -->
      <path
        d="M 40 55 Q 100 75 160 55"
        fill="none"
        stroke="url(#chain-gold)"
        stroke-width="5"
        stroke-linecap="round"
      />

      <!-- Maillons dorés -->
      ${Array.from({ length: 9 }, (_, i) => {
        const x = 50 + i * 12.5
        const y = 60 + Math.sin(i * 0.6) * 6
        return `
          <ellipse 
            cx="${x}" 
            cy="${y}" 
            rx="4" 
            ry="5" 
            fill="url(#chain-gold)" 
            stroke="#DAA520" 
            stroke-width="1.5" 
          />
        `
      }).join('')}

      <!-- Diamant principal (forme géométrique) -->
      <path
        d="M 100 80 
           L 85 100 
           L 90 125 
           L 100 140 
           L 110 125 
           L 115 100 
           Z"
        fill="url(#diamond-gradient)"
        stroke="#4682B4"
        stroke-width="3"
        stroke-linejoin="bevel"
      />

      <!-- Facettes du diamant -->
      <path d="M 100 80 L 100 140" stroke="#B0E0E6" stroke-width="1.5" opacity="0.6" />
      <path d="M 85 100 L 115 100" stroke="#B0E0E6" stroke-width="1.5" opacity="0.6" />
      <path d="M 90 125 L 110 125" stroke="#B0E0E6" stroke-width="1.5" opacity="0.6" />
      <path d="M 85 100 L 100 140" stroke="#4682B4" stroke-width="1" opacity="0.4" />
      <path d="M 115 100 L 100 140" stroke="#4682B4" stroke-width="1" opacity="0.4" />

      <!-- Partie supérieure du diamant -->
      <path
        d="M 85 100 L 100 80 L 115 100 L 100 90 Z"
        fill="#E0FFFF"
        opacity="0.7"
      />

      <!-- Reflets brillants -->
      <circle cx="95" cy="95" r="4" fill="white" opacity="0.8" />
      <circle cx="105" cy="110" r="3" fill="white" opacity="0.6" />
      <path
        d="M 92 115 L 94 118 L 92 121"
        stroke="white"
        stroke-width="2"
        fill="none"
        opacity="0.5"
        stroke-linecap="round"
      />

      <!-- Attache dorée -->
      <rect
        x="95"
        y="72"
        width="10"
        height="8"
        rx="2"
        fill="url(#chain-gold)"
        stroke="#DAA520"
        stroke-width="1.5"
      />
    </svg>
  `.trim()
}

/**
 * Generate necklace by type
 *
 * @param type - Type de collier à générer
 * @returns SVG string
 */
export function generateNecklace (type: NecklaceType): string {
  switch (type) {
    case 'heart':
      return generateHeartNecklace()
    case 'diamond':
      return generateDiamondNecklace()
    default:
      return generateHeartNecklace()
  }
}

