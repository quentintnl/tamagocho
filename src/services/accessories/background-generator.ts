/**
 * Background Generator Service
 *
 * Domain Layer: Pure business logic for generating background accessories
 *
 * Responsibilities:
 * - Generate SVG representations of starry backgrounds
 * - Generate SVG representations of rainbow backgrounds
 *
 * Clean Architecture: This service contains pure domain logic
 */

/**
 * Type d'arrière-plan disponible
 */
export type BackgroundType = 'stars' | 'rainbow'

/**
 * Configuration pour le fond étoilé
 */
interface StarsBackgroundConfig {
  skyColor: string
  starCount: number
  hasMoon: boolean
}

/**
 * Configuration pour l'arc-en-ciel
 */
interface RainbowBackgroundConfig {
  colors: string[]
  hasClouds: boolean
  arcHeight: number
}

/**
 * Generate starry background SVG
 *
 * @param config - Configuration du fond étoilé
 * @returns SVG string
 */
export function generateStarsBackground (config: StarsBackgroundConfig = {
  skyColor: '#191970',
  starCount: 50,
  hasMoon: true
}): string {
  const { skyColor, starCount, hasMoon } = config

  const stars = Array.from({ length: starCount }, () => ({
    x: Math.random() * 200,
    y: Math.random() * 200,
    size: 0.5 + Math.random() * 2.5,
    opacity: 0.3 + Math.random() * 0.7,
    twinkle: 0.5 + Math.random() * 1.5
  }))

  return `
    <svg 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg"
      style="width: 100%; height: auto;"
    >
      <defs>
        <radialGradient id="sky-gradient">
          <stop offset="0%" style="stop-color:#000033;stop-opacity:1" />
          <stop offset="100%" style="stop-color:${skyColor};stop-opacity:1" />
        </radialGradient>
        <radialGradient id="star-glow">
          <stop offset="0%" style="stop-color:white;stop-opacity:1" />
          <stop offset="100%" style="stop-color:white;stop-opacity:0" />
        </radialGradient>
        <radialGradient id="moon-glow">
          <stop offset="70%" style="stop-color:#F0E68C;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#FFD700;stop-opacity:0.3" />
        </radialGradient>
      </defs>

      <!-- Ciel nocturne -->
      <rect
        x="0"
        y="0"
        width="200"
        height="200"
        fill="url(#sky-gradient)"
      />

      ${hasMoon ? `
      <!-- Lune -->
      <g transform="translate(150, 50)">
        <!-- Halo lunaire -->
        <circle
          cx="0"
          cy="0"
          r="25"
          fill="url(#moon-glow)"
          opacity="0.4"
        />
        <!-- Lune -->
        <circle
          cx="0"
          cy="0"
          r="18"
          fill="#F0E68C"
          stroke="#DAA520"
          stroke-width="0.5"
        />
        <!-- Cratères -->
        <circle cx="-5" cy="-3" r="3" fill="#E6D68A" opacity="0.6" />
        <circle cx="4" cy="2" r="2" fill="#E6D68A" opacity="0.6" />
        <circle cx="2" cy="-6" r="2.5" fill="#E6D68A" opacity="0.6" />
      </g>
      ` : ''}

      <!-- Étoiles scintillantes -->
      ${stars.map((star, i) => `
        <g transform="translate(${star.x}, ${star.y})">
          <!-- Halo -->
          <circle
            cx="0"
            cy="0"
            r="${star.size * 2}"
            fill="url(#star-glow)"
            opacity="${star.opacity * 0.3}"
          >
            <animate
              attributeName="opacity"
              values="${star.opacity * 0.1};${star.opacity * 0.5};${star.opacity * 0.1}"
              dur="${star.twinkle}s"
              repeatCount="indefinite"
              begin="${Math.random() * 2}s"
            />
          </circle>
          
          <!-- Étoile -->
          <path
            d="M 0,-${star.size} L ${star.size * 0.3},-${star.size * 0.3} L ${star.size},0 L ${star.size * 0.3},${star.size * 0.3} L 0,${star.size} L -${star.size * 0.3},${star.size * 0.3} L -${star.size},0 L -${star.size * 0.3},-${star.size * 0.3} Z"
            fill="white"
            opacity="${star.opacity}"
          >
            <animate
              attributeName="opacity"
              values="${star.opacity * 0.5};${star.opacity};${star.opacity * 0.5}"
              dur="${star.twinkle}s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      `).join('')}

      <!-- Constellation (Grande Ourse) -->
      <g stroke="white" stroke-width="0.5" opacity="0.6">
        <line x1="30" y1="70" x2="40" y2="60" />
        <line x1="40" y1="60" x2="50" y2="65" />
        <line x1="50" y1="65" x2="60" y2="60" />
        <line x1="60" y1="60" x2="65" y2="50" />
        <line x1="50" y1="65" x2="55" y2="75" />
        <line x1="55" y1="75" x2="65" y2="80" />
        <circle cx="30" cy="70" r="1.5" fill="white" />
        <circle cx="40" cy="60" r="1.5" fill="white" />
        <circle cx="50" cy="65" r="1.5" fill="white" />
        <circle cx="60" cy="60" r="1.5" fill="white" />
        <circle cx="65" cy="50" r="1.5" fill="white" />
        <circle cx="55" cy="75" r="1.5" fill="white" />
        <circle cx="65" cy="80" r="1.5" fill="white" />
      </g>
    </svg>
  `.trim()
}

/**
 * Generate rainbow background SVG
 *
 * @param config - Configuration de l'arc-en-ciel
 * @returns SVG string
 */
export function generateRainbowBackground (config: RainbowBackgroundConfig = {
  colors: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'],
  hasClouds: true,
  arcHeight: 0.6
}): string {
  const { colors, hasClouds, arcHeight } = config

  return `
    <svg 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg"
      style="width: 100%; height: auto;"
    >
      <defs>
        <linearGradient id="sky-blue" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#E0F6FF;stop-opacity:1" />
        </linearGradient>
        <radialGradient id="cloud-gradient">
          <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#F0F0F0;stop-opacity:0.8" />
        </radialGradient>
      </defs>

      <!-- Ciel bleu -->
      <rect
        x="0"
        y="0"
        width="200"
        height="200"
        fill="url(#sky-blue)"
      />

      <!-- Arc-en-ciel -->
      <g transform="translate(100, 180)">
        ${colors.map((color, i) => {
          const radius = 140 - (i * 10)
          const strokeWidth = 12
          return `
            <path
              d="M -${radius} 0 A ${radius} ${radius} 0 0 1 ${radius} 0"
              fill="none"
              stroke="${color}"
              stroke-width="${strokeWidth}"
              opacity="0.8"
            />
          `
        }).join('')}
      </g>

      ${hasClouds ? `
      <!-- Nuages -->
      <!-- Nuage gauche -->
      <g transform="translate(40, 50)">
        <ellipse cx="0" cy="0" rx="20" ry="12" fill="url(#cloud-gradient)" />
        <ellipse cx="15" cy="-3" rx="18" ry="14" fill="url(#cloud-gradient)" />
        <ellipse cx="30" cy="0" rx="16" ry="11" fill="url(#cloud-gradient)" />
        <ellipse cx="15" cy="5" rx="22" ry="10" fill="url(#cloud-gradient)" />
      </g>

      <!-- Nuage droit -->
      <g transform="translate(140, 60)">
        <ellipse cx="0" cy="0" rx="18" ry="11" fill="url(#cloud-gradient)" />
        <ellipse cx="15" cy="-2" rx="20" ry="13" fill="url(#cloud-gradient)" />
        <ellipse cx="28" cy="0" rx="15" ry="10" fill="url(#cloud-gradient)" />
        <ellipse cx="14" cy="4" rx="19" ry="9" fill="url(#cloud-gradient)" />
      </g>

      <!-- Petit nuage central -->
      <g transform="translate(100, 40)">
        <ellipse cx="0" cy="0" rx="12" ry="8" fill="url(#cloud-gradient)" />
        <ellipse cx="10" cy="-1" rx="13" ry="9" fill="url(#cloud-gradient)" />
        <ellipse cx="18" cy="0" rx="11" ry="7" fill="url(#cloud-gradient)" />
      </g>
      ` : ''}

      <!-- Soleil -->
      <g transform="translate(160, 40)">
        <circle cx="0" cy="0" r="18" fill="#FFD700" opacity="0.3" />
        <circle cx="0" cy="0" r="12" fill="#FFED4E" />
        ${Array.from({ length: 12 }, (_, i) => {
          const angle = (i / 12) * Math.PI * 2
          const x1 = Math.cos(angle) * 15
          const y1 = Math.sin(angle) * 15
          const x2 = Math.cos(angle) * 22
          const y2 = Math.sin(angle) * 22
          return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#FFD700" stroke-width="2" stroke-linecap="round" />`
        }).join('')}
      </g>

      <!-- Étoiles scintillantes -->
      ${Array.from({ length: 8 }, (_, i) => {
        const x = 20 + Math.random() * 160
        const y = 20 + Math.random() * 80
        return `
          <g transform="translate(${x}, ${y})">
            <path
              d="M 0,-2 L 0.6,-0.6 L 2,0 L 0.6,0.6 L 0,2 L -0.6,0.6 L -2,0 L -0.6,-0.6 Z"
              fill="white"
              opacity="0.6"
            >
              <animate
                attributeName="opacity"
                values="0.3;0.8;0.3"
                dur="${1 + Math.random()}s"
                repeatCount="indefinite"
              />
            </path>
          </g>
        `
      }).join('')}
    </svg>
  `.trim()
}

/**
 * Generate background by type
 *
 * @param type - Type d'arrière-plan à générer
 * @returns SVG string
 */
export function generateBackground (type: BackgroundType): string {
  switch (type) {
    case 'stars':
      return generateStarsBackground()
    case 'rainbow':
      return generateRainbowBackground()
    default:
      return generateStarsBackground()
  }
}

