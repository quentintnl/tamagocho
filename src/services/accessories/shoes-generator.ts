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
export type ShoesType = 'sneakers' | 'boots' | 'sandals' | 'heels' | 'rollers' | 'rocket'

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
 * Configuration pour les sandales
 */
interface SandalsConfig {
  strapColor: string
  soleColor: string
  hasFlower: boolean
}

/**
 * Configuration pour les talons hauts
 */
interface HeelsConfig {
  heelColor: string
  strapColor: string
  hasGlitter: boolean
}

/**
 * Configuration pour les rollers
 */
interface RollersConfig {
  skateColor: string
  wheelColor: string
  hasFlames: boolean
}

/**
 * Configuration pour les bottes fusées
 */
interface RocketBootsConfig {
  bootColor: string
  flameColor: string
  isFlying: boolean
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
 * Generate sandals SVG
 *
 * @param config - Configuration des sandales
 * @returns SVG string
 */
export function generateSandals (config: SandalsConfig = {
  strapColor: '#8B4513',
  soleColor: '#D2B48C',
  hasFlower: true
}): string {
  const { strapColor, soleColor, hasFlower } = config

  return `
    <svg 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg"
      style="width: 100%; height: auto;"
    >
      <!-- Semelle gauche -->
      <ellipse
        cx="65"
        cy="145"
        rx="35"
        ry="15"
        fill="${soleColor}"
        stroke="#A0826D"
        stroke-width="2"
      />

      <!-- Semelle droite -->
      <ellipse
        cx="135"
        cy="145"
        rx="35"
        ry="15"
        fill="${soleColor}"
        stroke="#A0826D"
        stroke-width="2"
      />

      <!-- Lanières gauche -->
      <path
        d="M 40 145 Q 50 130 65 125 Q 80 130 90 145"
        fill="none"
        stroke="${strapColor}"
        stroke-width="5"
        stroke-linecap="round"
      />
      <ellipse
        cx="65"
        cy="145"
        rx="28"
        ry="3"
        fill="${strapColor}"
      />

      <!-- Lanières droite -->
      <path
        d="M 110 145 Q 120 130 135 125 Q 150 130 160 145"
        fill="none"
        stroke="${strapColor}"
        stroke-width="5"
        stroke-linecap="round"
      />
      <ellipse
        cx="135"
        cy="145"
        rx="28"
        ry="3"
        fill="${strapColor}"
      />

      ${hasFlower ? `
      <!-- Fleur décorative gauche -->
      <g transform="translate(65, 125)">
        <circle cx="0" cy="0" r="6" fill="#FFB6C1" />
        <circle cx="-5" cy="-3" r="5" fill="#FFB6C1" />
        <circle cx="5" cy="-3" r="5" fill="#FFB6C1" />
        <circle cx="-5" cy="3" r="5" fill="#FFB6C1" />
        <circle cx="5" cy="3" r="5" fill="#FFB6C1" />
        <circle cx="0" cy="0" r="3" fill="#FFD700" />
      </g>
      
      <!-- Fleur décorative droite -->
      <g transform="translate(135, 125)">
        <circle cx="0" cy="0" r="6" fill="#FFB6C1" />
        <circle cx="-5" cy="-3" r="5" fill="#FFB6C1" />
        <circle cx="5" cy="-3" r="5" fill="#FFB6C1" />
        <circle cx="-5" cy="3" r="5" fill="#FFB6C1" />
        <circle cx="5" cy="3" r="5" fill="#FFB6C1" />
        <circle cx="0" cy="0" r="3" fill="#FFD700" />
      </g>
      ` : ''}
    </svg>
  `.trim()
}

/**
 * Generate heels SVG
 *
 * @param config - Configuration des talons hauts
 * @returns SVG string
 */
export function generateHeels (config: HeelsConfig = {
  heelColor: '#FF1493',
  strapColor: '#C71585',
  hasGlitter: true
}): string {
  const { heelColor, strapColor, hasGlitter } = config

  return `
    <svg 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg"
      style="width: 100%; height: auto;"
    >
      <defs>
        <linearGradient id="heel-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:${heelColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#8B0045;stop-opacity:1" />
        </linearGradient>
      </defs>

      <!-- Talon gauche (haut) -->
      <path
        d="M 45 130 L 42 150 L 48 150 L 55 130 Z"
        fill="url(#heel-gradient)"
        stroke="#8B0045"
        stroke-width="2"
      />

      <!-- Talon droit (haut) -->
      <path
        d="M 145 130 L 142 150 L 148 150 L 155 130 Z"
        fill="url(#heel-gradient)"
        stroke="#8B0045"
        stroke-width="2"
      />

      <!-- Semelle gauche -->
      <ellipse
        cx="60"
        cy="135"
        rx="25"
        ry="8"
        fill="url(#heel-gradient)"
        stroke="#8B0045"
        stroke-width="2"
      />

      <!-- Semelle droite -->
      <ellipse
        cx="150"
        cy="135"
        rx="25"
        ry="8"
        fill="url(#heel-gradient)"
        stroke="#8B0045"
        stroke-width="2"
      />

      <!-- Partie avant gauche -->
      <path
        d="M 45 130 Q 50 115 60 110 Q 70 115 75 130"
        fill="url(#heel-gradient)"
        stroke="#8B0045"
        stroke-width="2"
      />

      <!-- Partie avant droite -->
      <path
        d="M 135 130 Q 140 115 150 110 Q 160 115 165 130"
        fill="url(#heel-gradient)"
        stroke="#8B0045"
        stroke-width="2"
      />

      <!-- Lanière gauche -->
      <path
        d="M 50 125 Q 55 120 60 120 Q 65 120 70 125"
        fill="none"
        stroke="${strapColor}"
        stroke-width="3"
      />

      <!-- Lanière droite -->
      <path
        d="M 140 125 Q 145 120 150 120 Q 155 120 160 125"
        fill="none"
        stroke="${strapColor}"
        stroke-width="3"
      />

      ${hasGlitter ? `
      <!-- Paillettes gauche -->
      <circle cx="52" cy="122" r="1.5" fill="#FFD700" opacity="0.8" />
      <circle cx="60" cy="118" r="1.5" fill="#FFD700" opacity="0.8" />
      <circle cx="68" cy="122" r="1.5" fill="#FFD700" opacity="0.8" />
      <circle cx="56" cy="127" r="1.5" fill="#FFD700" opacity="0.8" />
      <circle cx="64" cy="127" r="1.5" fill="#FFD700" opacity="0.8" />
      
      <!-- Paillettes droite -->
      <circle cx="142" cy="122" r="1.5" fill="#FFD700" opacity="0.8" />
      <circle cx="150" cy="118" r="1.5" fill="#FFD700" opacity="0.8" />
      <circle cx="158" cy="122" r="1.5" fill="#FFD700" opacity="0.8" />
      <circle cx="146" cy="127" r="1.5" fill="#FFD700" opacity="0.8" />
      <circle cx="154" cy="127" r="1.5" fill="#FFD700" opacity="0.8" />
      ` : ''}
    </svg>
  `.trim()
}

/**
 * Generate rollers SVG
 *
 * @param config - Configuration des rollers
 * @returns SVG string
 */
export function generateRollers (config: RollersConfig = {
  skateColor: '#00BFFF',
  wheelColor: '#FFD700',
  hasFlames: true
}): string {
  const { skateColor, wheelColor, hasFlames } = config

  return `
    <svg 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg"
      style="width: 100%; height: auto;"
    >
      <defs>
        <linearGradient id="skate-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
          <stop offset="100%" style="stop-color:${skateColor};stop-opacity:1" />
        </linearGradient>
      </defs>

      <!-- Patin gauche -->
      <path
        d="M 50 110 L 45 70 Q 45 60 53 58 L 75 58 L 80 110 Z"
        fill="url(#skate-gradient)"
        stroke="#0080C0"
        stroke-width="2.5"
      />

      <!-- Patin droit -->
      <path
        d="M 120 110 L 125 58 L 147 58 Q 155 60 155 70 L 150 110 Z"
        fill="url(#skate-gradient)"
        stroke="#0080C0"
        stroke-width="2.5"
      />

      <!-- Roues gauche -->
      <circle cx="50" cy="125" r="8" fill="${wheelColor}" stroke="#DAA520" stroke-width="2" />
      <circle cx="65" cy="125" r="8" fill="${wheelColor}" stroke="#DAA520" stroke-width="2" />
      <circle cx="80" cy="125" r="8" fill="${wheelColor}" stroke="#DAA520" stroke-width="2" />

      <!-- Roues droite -->
      <circle cx="120" cy="125" r="8" fill="${wheelColor}" stroke="#DAA520" stroke-width="2" />
      <circle cx="135" cy="125" r="8" fill="${wheelColor}" stroke="#DAA520" stroke-width="2" />
      <circle cx="150" cy="125" r="8" fill="${wheelColor}" stroke="#DAA520" stroke-width="2" />

      <!-- Châssis gauche -->
      <rect
        x="48"
        y="118"
        width="34"
        height="6"
        rx="2"
        fill="#2C2C2C"
      />

      <!-- Châssis droit -->
      <rect
        x="118"
        y="118"
        width="34"
        height="6"
        rx="2"
        fill="#2C2C2C"
      />

      ${hasFlames ? `
      <!-- Flammes de vitesse gauche -->
      <path
        d="M 30 115 Q 25 110 30 105 Q 28 110 30 115"
        fill="#FF4500"
        opacity="0.7"
      />
      <path
        d="M 25 120 Q 20 115 25 110 Q 23 115 25 120"
        fill="#FF6347"
        opacity="0.7"
      />
      
      <!-- Flammes de vitesse droite -->
      <path
        d="M 170 115 Q 175 110 170 105 Q 172 110 170 115"
        fill="#FF4500"
        opacity="0.7"
      />
      <path
        d="M 175 120 Q 180 115 175 110 Q 177 115 175 120"
        fill="#FF6347"
        opacity="0.7"
      />
      ` : ''}
    </svg>
  `.trim()
}

/**
 * Generate rocket boots SVG
 *
 * @param config - Configuration des bottes fusées
 * @returns SVG string
 */
export function generateRocketBoots (config: RocketBootsConfig = {
  bootColor: '#C0C0C0',
  flameColor: '#FF4500',
  isFlying: true
}): string {
  const { bootColor, flameColor, isFlying } = config

  return `
    <svg 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg"
      style="width: 100%; height: auto;"
    >
      <defs>
        <linearGradient id="rocket-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#E8E8E8;stop-opacity:1" />
          <stop offset="100%" style="stop-color:${bootColor};stop-opacity:1" />
        </linearGradient>
        <linearGradient id="flame-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
          <stop offset="50%" style="stop-color:${flameColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#FF6347;stop-opacity:0.5" />
        </linearGradient>
      </defs>

      <!-- Botte fusée gauche -->
      <path
        d="M 50 90 L 45 50 Q 45 45 50 43 L 75 43 L 78 90 Z"
        fill="url(#rocket-gradient)"
        stroke="#A0A0A0"
        stroke-width="2.5"
      />

      <!-- Botte fusée droite -->
      <path
        d="M 122 90 L 125 43 L 150 43 Q 155 45 155 50 L 150 90 Z"
        fill="url(#rocket-gradient)"
        stroke="#A0A0A0"
        stroke-width="2.5"
      />

      <!-- Réacteur gauche -->
      <ellipse
        cx="64"
        cy="95"
        rx="15"
        ry="8"
        fill="#FF6347"
        stroke="#A0A0A0"
        stroke-width="2"
      />

      <!-- Réacteur droit -->
      <ellipse
        cx="136"
        cy="95"
        rx="15"
        ry="8"
        fill="#FF6347"
        stroke="#A0A0A0"
        stroke-width="2"
      />

      <!-- Détails technologiques gauche -->
      <circle cx="55" cy="60" r="3" fill="#00FF00" />
      <circle cx="65" cy="55" r="3" fill="#FF0000" />
      <rect x="52" y="70" width="20" height="2" fill="#FFD700" />
      <rect x="52" y="75" width="20" height="2" fill="#FFD700" />

      <!-- Détails technologiques droite -->
      <circle cx="135" cy="60" r="3" fill="#00FF00" />
      <circle cx="145" cy="55" r="3" fill="#FF0000" />
      <rect x="128" y="70" width="20" height="2" fill="#FFD700" />
      <rect x="128" y="75" width="20" height="2" fill="#FFD700" />

      ${isFlying ? `
      <!-- Flammes de propulsion gauche -->
      <path
        d="M 54 103 Q 58 115 54 125 Q 60 115 64 125 Q 68 115 74 125 Q 70 115 64 103"
        fill="url(#flame-gradient)"
        opacity="0.9"
      />
      
      <!-- Flammes de propulsion droite -->
      <path
        d="M 126 103 Q 130 115 126 125 Q 132 115 136 125 Q 140 115 146 125 Q 142 115 136 103"
        fill="url(#flame-gradient)"
        opacity="0.9"
      />
      
      <!-- Étincelles -->
      <circle cx="60" cy="130" r="2" fill="#FFD700" opacity="0.8" />
      <circle cx="68" cy="135" r="2" fill="#FFD700" opacity="0.8" />
      <circle cx="132" cy="130" r="2" fill="#FFD700" opacity="0.8" />
      <circle cx="140" cy="135" r="2" fill="#FFD700" opacity="0.8" />
      ` : ''}
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
    case 'sandals':
      return generateSandals()
    case 'heels':
      return generateHeels()
    case 'rollers':
      return generateRollers()
    case 'rocket':
      return generateRocketBoots()
    default:
      return generateSneakers()
  }
}

