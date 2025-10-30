/**
 * Shoes Generator Service
 *
 * Domain Layer: Pure business logic for generating shoes accessories
 *
 * Responsibilities:
 * - Generate SVG representations of sneakers
 * - Generate SVG representations of boots
 *
 * Clean Architecture: This service contains pure domain logic
 */

/**
 * Type de chaussures disponible
 */
export type ShoesType = 'sneakers' | 'boots'

/**
 * Configuration pour les baskets
 */
interface SneakersConfig {
  primaryColor: string
  secondaryColor: string
  hasStar: boolean
}

/**
 * Configuration pour les bottes
 */
interface BootsConfig {
  bootColor: string
  laceColor: string
  hasBuckle: boolean
}

/**
 * Generate sneakers SVG
 *
 * @param config - Configuration des baskets
 * @returns SVG string
 */
export function generateSneakers (config: SneakersConfig = {
  primaryColor: '#FF4444',
  secondaryColor: '#FFFFFF',
  hasStar: true
}): string {
  const { primaryColor, secondaryColor, hasStar } = config

  return `
    <svg 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg"
      style="width: 100%; height: auto;"
    >
      <defs>
        <linearGradient id="sneaker-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#CC0000;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="sole-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#E0E0E0;stop-opacity:1" />
        </linearGradient>
      </defs>

      <!-- Semelle -->
      <ellipse
        cx="100"
        cy="140"
        rx="55"
        ry="20"
        fill="url(#sole-gradient)"
        stroke="#999999"
        stroke-width="2"
      />

      <!-- Corps de la chaussure gauche -->
      <path
        d="M 60 120 L 55 100 Q 55 85 65 80 L 85 80 L 90 120 Z"
        fill="url(#sneaker-gradient)"
        stroke="#2C2C2C"
        stroke-width="2"
      />

      <!-- Corps de la chaussure droite -->
      <path
        d="M 110 120 L 115 80 L 135 80 Q 145 85 145 100 L 140 120 Z"
        fill="url(#sneaker-gradient)"
        stroke="#2C2C2C"
        stroke-width="2"
      />

      <!-- Bande blanche gauche -->
      <path
        d="M 62 110 Q 65 95 72 90 L 82 90 L 85 110 Z"
        fill="${secondaryColor}"
        opacity="0.9"
      />

      <!-- Bande blanche droite -->
      <path
        d="M 115 90 L 128 90 Q 135 95 138 110 L 135 110 L 118 110 Z"
        fill="${secondaryColor}"
        opacity="0.9"
      />

      ${hasStar ? `
      <!-- Étoile décorative gauche -->
      <g transform="translate(72, 95)">
        <path
          d="M 0,-5 L 1.5,-1.5 L 5.5,-1 L 2.7,1.5 L 3.5,5.5 L 0,3.5 L -3.5,5.5 L -2.7,1.5 L -5.5,-1 L -1.5,-1.5 Z"
          fill="${secondaryColor}"
          stroke="#2C2C2C"
          stroke-width="0.5"
        />
      </g>
      
      <!-- Étoile décorative droite -->
      <g transform="translate(128, 95)">
        <path
          d="M 0,-5 L 1.5,-1.5 L 5.5,-1 L 2.7,1.5 L 3.5,5.5 L 0,3.5 L -3.5,5.5 L -2.7,1.5 L -5.5,-1 L -1.5,-1.5 Z"
          fill="${secondaryColor}"
          stroke="#2C2C2C"
          stroke-width="0.5"
        />
      </g>
      ` : ''}

      <!-- Lacets gauche -->
      <path
        d="M 65 85 Q 70 88 75 85"
        fill="none"
        stroke="#2C2C2C"
        stroke-width="1.5"
      />
      <path
        d="M 67 90 Q 72 93 77 90"
        fill="none"
        stroke="#2C2C2C"
        stroke-width="1.5"
      />

      <!-- Lacets droite -->
      <path
        d="M 125 85 Q 130 88 135 85"
        fill="none"
        stroke="#2C2C2C"
        stroke-width="1.5"
      />
      <path
        d="M 123 90 Q 128 93 133 90"
        fill="none"
        stroke="#2C2C2C"
        stroke-width="1.5"
      />

      <!-- Languette gauche -->
      <rect
        x="68"
        y="75"
        width="10"
        height="8"
        rx="1"
        fill="${secondaryColor}"
        stroke="#2C2C2C"
        stroke-width="1"
      />

      <!-- Languette droite -->
      <rect
        x="122"
        y="75"
        width="10"
        height="8"
        rx="1"
        fill="${secondaryColor}"
        stroke="#2C2C2C"
        stroke-width="1"
      />

      <!-- Détails de semelle (rainures) -->
      <line x1="70" y1="140" x2="75" y2="140" stroke="#999999" stroke-width="1" />
      <line x1="80" y1="142" x2="85" y2="142" stroke="#999999" stroke-width="1" />
      <line x1="115" y1="142" x2="120" y2="142" stroke="#999999" stroke-width="1" />
      <line x1="125" y1="140" x2="130" y2="140" stroke="#999999" stroke-width="1" />
    </svg>
  `.trim()
}

/**
 * Generate boots SVG
 *
 * @param config - Configuration des bottes
 * @returns SVG string
 */
export function generateBoots (config: BootsConfig = {
  bootColor: '#8B4513',
  laceColor: '#2C2C2C',
  hasBuckle: true
}): string {
  const { bootColor, laceColor, hasBuckle } = config

  return `
    <svg 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg"
      style="width: 100%; height: auto;"
    >
      <defs>
        <linearGradient id="boot-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#A0522D;stop-opacity:1" />
          <stop offset="50%" style="stop-color:${bootColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#654321;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="boot-sole" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#4A4A4A;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#2C2C2C;stop-opacity:1" />
        </linearGradient>
      </defs>

      <!-- Semelle épaisse -->
      <ellipse
        cx="100"
        cy="145"
        rx="58"
        ry="18"
        fill="url(#boot-sole)"
        stroke="#1C1C1C"
        stroke-width="2"
      />

      <!-- Botte gauche -->
      <path
        d="M 55 130 L 50 70 Q 50 60 58 58 L 80 58 L 88 130 Z"
        fill="url(#boot-gradient)"
        stroke="#654321"
        stroke-width="2.5"
      />

      <!-- Botte droite -->
      <path
        d="M 112 130 L 120 58 L 142 58 Q 150 60 150 70 L 145 130 Z"
        fill="url(#boot-gradient)"
        stroke="#654321"
        stroke-width="2.5"
      />

      <!-- Coutures gauche -->
      <path
        d="M 56 125 L 54 75"
        fill="none"
        stroke="${laceColor}"
        stroke-width="1"
        stroke-dasharray="3,3"
      />
      <path
        d="M 87 125 L 79 65"
        fill="none"
        stroke="${laceColor}"
        stroke-width="1"
        stroke-dasharray="3,3"
      />

      <!-- Coutures droite -->
      <path
        d="M 113 125 L 121 65"
        fill="none"
        stroke="${laceColor}"
        stroke-width="1"
        stroke-dasharray="3,3"
      />
      <path
        d="M 144 125 L 146 75"
        fill="none"
        stroke="${laceColor}"
        stroke-width="1"
        stroke-dasharray="3,3"
      />

      ${hasBuckle ? `
      <!-- Boucle gauche -->
      <g>
        <rect
          x="58"
          y="85"
          width="20"
          height="8"
          rx="2"
          fill="#C0C0C0"
          stroke="#808080"
          stroke-width="1.5"
        />
        <rect
          x="61"
          y="87"
          width="5"
          height="4"
          fill="#808080"
        />
      </g>

      <!-- Boucle droite -->
      <g>
        <rect
          x="122"
          y="85"
          width="20"
          height="8"
          rx="2"
          fill="#C0C0C0"
          stroke="#808080"
          stroke-width="1.5"
        />
        <rect
          x="134"
          y="87"
          width="5"
          height="4"
          fill="#808080"
        />
      </g>
      ` : ''}

      <!-- Reflets sur le cuir gauche -->
      <ellipse
        cx="63"
        cy="75"
        rx="8"
        ry="15"
        fill="white"
        opacity="0.15"
      />

      <!-- Reflets sur le cuir droit -->
      <ellipse
        cx="137"
        cy="75"
        rx="8"
        ry="15"
        fill="white"
        opacity="0.15"
      />

      <!-- Talons -->
      <rect
        x="66"
        y="138"
        width="12"
        height="10"
        fill="url(#boot-sole)"
        stroke="#1C1C1C"
        stroke-width="1.5"
      />
      <rect
        x="122"
        y="138"
        width="12"
        height="10"
        fill="url(#boot-sole)"
        stroke="#1C1C1C"
        stroke-width="1.5"
      />

      <!-- Bord supérieur renforcé gauche -->
      <ellipse
        cx="69"
        cy="58"
        rx="12"
        ry="3"
        fill="#654321"
        stroke="#4A3621"
        stroke-width="1"
      />

      <!-- Bord supérieur renforcé droit -->
      <ellipse
        cx="131"
        cy="58"
        rx="12"
        ry="3"
        fill="#654321"
        stroke="#4A3621"
        stroke-width="1"
      />
    </svg>
  `.trim()
}

/**
 * Generate shoes by type
 *
 * @param type - Type de chaussures à générer
 * @returns SVG string
 */
export function generateShoes (type: ShoesType): string {
  switch (type) {
    case 'sneakers':
      return generateSneakers()
    case 'boots':
      return generateBoots()
    default:
      return generateSneakers()
  }
}

