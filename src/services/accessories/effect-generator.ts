/**
 * Effect Generator Service
 *
 * Domain Layer: Pure business logic for generating effect accessories
 *
 * Responsibilities:
 * - Generate SVG representations of sparkle effects
 * - Generate SVG representations of fire auras
 *
 * Clean Architecture: This service contains pure domain logic
 */

/**
 * Type d'effet disponible
 */
export type EffectType = 'sparkles' | 'fire'

/**
 * Configuration pour les paillettes
 */
interface SparklesConfig {
  sparkleColor: string
  particleCount: number
  animated: boolean
}

/**
 * Configuration pour l'aura de feu
 */
interface FireConfig {
  flameColors: string[]
  intensity: number
  animated: boolean
}

/**
 * Generate sparkles effect SVG
 *
 * @param config - Configuration des paillettes
 * @returns SVG string
 */
export function generateSparkles (config: SparklesConfig = {
  sparkleColor: '#FFD700',
  particleCount: 12,
  animated: false
}): string {
  const { sparkleColor, particleCount, animated } = config

  const sparkles = Array.from({ length: particleCount }, (_, i) => {
    const angle = (i / particleCount) * Math.PI * 2
    const radius = 60 + Math.random() * 20
    const x = 100 + Math.cos(angle) * radius
    const y = 100 + Math.sin(angle) * radius
    const size = 3 + Math.random() * 4
    const rotation = Math.random() * 360

    return {
      x,
      y,
      size,
      rotation,
      delay: i * 0.1
    }
  })

  return `
    <svg 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg"
      style="width: 100%; height: auto;"
    >
      <defs>
        <radialGradient id="sparkle-glow">
          <stop offset="0%" style="stop-color:${sparkleColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${sparkleColor};stop-opacity:0" />
        </radialGradient>

        ${animated ? `
        <animate
          id="sparkle-animation"
          attributeName="opacity"
          values="0.3;1;0.3"
          dur="2s"
          repeatCount="indefinite"
        />
        ` : ''}
      </defs>

      <!-- Particules brillantes -->
      ${sparkles.map((s, i) => `
        <g transform="translate(${s.x}, ${s.y}) rotate(${s.rotation})">
          <!-- Halo de lumière -->
          <circle
            cx="0"
            cy="0"
            r="${s.size * 2}"
            fill="url(#sparkle-glow)"
            opacity="0.5"
          />
          
          <!-- Étoile scintillante -->
          <path
            d="M 0,-${s.size} L ${s.size * 0.3},-${s.size * 0.3} L ${s.size},0 L ${s.size * 0.3},${s.size * 0.3} L 0,${s.size} L -${s.size * 0.3},${s.size * 0.3} L -${s.size},0 L -${s.size * 0.3},-${s.size * 0.3} Z"
            fill="${sparkleColor}"
            stroke="white"
            stroke-width="0.5"
            opacity="${0.6 + Math.random() * 0.4}"
          >
            ${animated ? `<animate attributeName="opacity" values="0.3;1;0.3" dur="${1.5 + Math.random()}s" repeatCount="indefinite" begin="${s.delay}s" />` : ''}
          </path>

          <!-- Croix de lumière -->
          <line x1="0" y1="-${s.size * 1.5}" x2="0" y2="${s.size * 1.5}" stroke="white" stroke-width="1" opacity="0.6" />
          <line x1="-${s.size * 1.5}" y1="0" x2="${s.size * 1.5}" y2="0" stroke="white" stroke-width="1" opacity="0.6" />
        </g>
      `).join('')}

      <!-- Particules centrales -->
      <circle cx="100" cy="100" r="4" fill="${sparkleColor}" opacity="0.8">
        ${animated ? '<animate attributeName="r" values="3;6;3" dur="1.5s" repeatCount="indefinite" />' : ''}
      </circle>
      <circle cx="100" cy="100" r="8" fill="none" stroke="${sparkleColor}" stroke-width="2" opacity="0.5">
        ${animated ? '<animate attributeName="r" values="5;10;5" dur="2s" repeatCount="indefinite" />' : ''}
      </circle>
    </svg>
  `.trim()
}

/**
 * Generate fire aura effect SVG
 *
 * @param config - Configuration de l'aura de feu
 * @returns SVG string
 */
export function generateFire (config: FireConfig = {
  flameColors: ['#FF4500', '#FF6347', '#FFD700'],
  intensity: 3,
  animated: false
}): string {
  const { flameColors, intensity, animated } = config

  const flames = Array.from({ length: 8 * intensity }, (_, i) => {
    const angle = (i / (8 * intensity)) * Math.PI * 2
    const baseRadius = 70
    const x = 100 + Math.cos(angle) * baseRadius
    const y = 100 + Math.sin(angle) * baseRadius
    const height = 20 + Math.random() * 30
    const width = 10 + Math.random() * 15
    const colorIndex = Math.floor(Math.random() * flameColors.length)

    return {
      x,
      y,
      height,
      width,
      color: flameColors[colorIndex],
      delay: Math.random() * 2
    }
  })

  return `
    <svg 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg"
      style="width: 100%; height: auto;"
    >
      <defs>
        <radialGradient id="fire-core">
          <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:1" />
          <stop offset="30%" style="stop-color:#FFD700;stop-opacity:1" />
          <stop offset="60%" style="stop-color:#FF6347;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#FF4500;stop-opacity:0" />
        </radialGradient>

        <filter id="fire-blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
        </filter>
      </defs>

      <!-- Halo de feu central -->
      <circle
        cx="100"
        cy="100"
        r="60"
        fill="url(#fire-core)"
        opacity="0.6"
        filter="url(#fire-blur)"
      >
        ${animated ? '<animate attributeName="r" values="55;65;55" dur="1.5s" repeatCount="indefinite" />' : ''}
      </circle>

      <!-- Flammes individuelles -->
      ${flames.map((f, i) => `
        <g transform="translate(${f.x}, ${f.y})">
          <ellipse
            cx="0"
            cy="-${f.height / 2}"
            rx="${f.width / 2}"
            ry="${f.height / 2}"
            fill="${f.color}"
            opacity="${0.7 + Math.random() * 0.3}"
          >
            ${animated ? `
              <animate 
                attributeName="ry" 
                values="${f.height / 2};${f.height / 2 + 10};${f.height / 2}" 
                dur="${1 + Math.random()}s" 
                repeatCount="indefinite"
                begin="${f.delay}s"
              />
              <animate 
                attributeName="opacity" 
                values="0.5;0.9;0.5" 
                dur="${0.8 + Math.random() * 0.4}s" 
                repeatCount="indefinite"
                begin="${f.delay}s"
              />
            ` : ''}
          </ellipse>
        </g>
      `).join('')}

      <!-- Flammes principales (plus grandes) -->
      ${Array.from({ length: 4 }, (_, i) => {
        const angle = (i / 4) * Math.PI * 2 + Math.PI / 4
        const x = 100 + Math.cos(angle) * 75
        const y = 100 + Math.sin(angle) * 75
        return `
          <g transform="translate(${x}, ${y})">
            <path
              d="M 0,0 Q -8,-20 0,-40 Q 8,-20 0,0"
              fill="${flameColors[0]}"
              opacity="0.8"
            >
              ${animated ? `
                <animateTransform
                  attributeName="transform"
                  type="scale"
                  values="1,1;1.2,1.3;1,1"
                  dur="1.5s"
                  repeatCount="indefinite"
                  begin="${i * 0.3}s"
                />
              ` : ''}
            </path>
            <path
              d="M 0,0 Q -5,-15 0,-30 Q 5,-15 0,0"
              fill="${flameColors[1]}"
              opacity="0.9"
            />
          </g>
        `
      }).join('')}

      <!-- Particules de braise -->
      ${Array.from({ length: 15 }, (_, i) => {
        const x = 70 + Math.random() * 60
        const y = 70 + Math.random() * 60
        return `
          <circle
            cx="${x}"
            cy="${y}"
            r="${1 + Math.random() * 2}"
            fill="#FFD700"
            opacity="${0.5 + Math.random() * 0.5}"
          >
            ${animated ? `<animate attributeName="cy" values="${y};${y - 20};${y}" dur="${2 + Math.random()}s" repeatCount="indefinite" />` : ''}
          </circle>
        `
      }).join('')}
    </svg>
  `.trim()
}

/**
 * Generate effect by type
 *
 * @param type - Type d'effet à générer
 * @returns SVG string
 */
export function generateEffect (type: EffectType): string {
  switch (type) {
    case 'sparkles':
      return generateSparkles()
    case 'fire':
      return generateFire()
    default:
      return generateSparkles()
  }
}

