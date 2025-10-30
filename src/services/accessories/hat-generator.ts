/**
 * Hat Generator Service
 *
 * Domain Layer: Pure business logic for generating hat accessories
 *
 * Responsibilities:
 * - Generate SVG representations of party hats
 * - Generate SVG representations of crowns
 * - Generate SVG representations of wizard hats
 *
 * Clean Architecture: This service contains pure domain logic
 * No dependencies on UI frameworks or external APIs
 */

/**
 * Type de chapeau disponible
 */
export type HatType = 'party' | 'crown' | 'wizard' | 'baseball' | 'cowboy' | 'top'

/**
 * Configuration pour les chapeaux de fête
 */
interface PartyHatConfig {
  primaryColor: string
  secondaryColor: string
  hasConfetti: boolean
}

/**
 * Configuration pour les couronnes
 */
interface CrownConfig {
  goldColor: string
  gemColor: string
  gemCount: number
}

/**
 * Configuration pour les chapeaux de sorcier
 */
interface WizardHatConfig {
  hatColor: string
  starColor: string
  hasMoon: boolean
}

/**
 * Configuration pour les casquettes de baseball
 */
interface BaseballCapConfig {
  capColor: string
  logoColor: string
  hasLogo: boolean
}

/**
 * Configuration pour les chapeaux de cowboy
 */
interface CowboyHatConfig {
  hatColor: string
  bandColor: string
  hasStar: boolean
}

/**
 * Configuration pour les hauts-de-forme
 */
interface TopHatConfig {
  hatColor: string
  bandColor: string
  hasRibbon: boolean
}

/**
 * Generate party hat SVG
 *
 * @param config - Configuration du chapeau de fête
 * @returns SVG string
 */
export function generatePartyHat (config: PartyHatConfig = {
  primaryColor: '#FF6B9D',
  secondaryColor: '#FFE66D',
  hasConfetti: true
}): string {
  const { primaryColor, secondaryColor, hasConfetti } = config

  return `
    <svg 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg"
      style="width: 100%; height: auto;"
    >
      <defs>
        <linearGradient id="party-hat-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:1" />
        </linearGradient>
      </defs>

      <!-- Chapeau conique -->
      <path
        d="M 100 30 L 50 130 L 150 130 Z"
        fill="url(#party-hat-gradient)"
        stroke="#2C2C2C"
        stroke-width="3"
        stroke-linejoin="round"
      />

      <!-- Rayures décoratives -->
      <path
        d="M 85 60 Q 100 65 115 60"
        fill="none"
        stroke="${secondaryColor}"
        stroke-width="4"
        opacity="0.8"
      />
      <path
        d="M 75 90 Q 100 95 125 90"
        fill="none"
        stroke="${secondaryColor}"
        stroke-width="4"
        opacity="0.8"
      />

      <!-- Pompon en haut -->
      <circle
        cx="100"
        cy="25"
        r="8"
        fill="${secondaryColor}"
        stroke="#2C2C2C"
        stroke-width="2"
      />

      <!-- Base du chapeau -->
      <ellipse
        cx="100"
        cy="130"
        rx="52"
        ry="10"
        fill="${primaryColor}"
        stroke="#2C2C2C"
        stroke-width="3"
      />

      ${hasConfetti ? `
      <!-- Confettis -->
      <rect x="60" y="50" width="4" height="8" fill="#FF9CEE" transform="rotate(20 62 54)" />
      <rect x="130" y="70" width="4" height="8" fill="#6BDBFF" transform="rotate(-15 132 74)" />
      <circle cx="80" cy="100" r="3" fill="#FFE66D" />
      <circle cx="120" cy="80" r="3" fill="#B4FF6B" />
      <rect x="110" y="110" width="4" height="8" fill="#FF6B9D" transform="rotate(45 112 114)" />
      ` : ''}
    </svg>
  `.trim()
}

/**
 * Generate crown SVG
 *
 * @param config - Configuration de la couronne
 * @returns SVG string
 */
export function generateCrown (config: CrownConfig = {
  goldColor: '#FFD700',
  gemColor: '#FF1493',
  gemCount: 5
}): string {
  const { goldColor, gemColor, gemCount } = config

  return `
    <svg 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg"
      style="width: 100%; height: auto;"
    >
      <defs>
        <linearGradient id="crown-gold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#FFF4B0;stop-opacity:1" />
          <stop offset="50%" style="stop-color:${goldColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#DAA520;stop-opacity:1" />
        </linearGradient>
        <radialGradient id="gem-shine">
          <stop offset="0%" style="stop-color:white;stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:${gemColor};stop-opacity:1" />
        </radialGradient>
      </defs>

      <!-- Base de la couronne -->
      <path
        d="M 40 130 L 50 90 L 75 110 L 100 70 L 125 110 L 150 90 L 160 130 Z"
        fill="url(#crown-gold)"
        stroke="#DAA520"
        stroke-width="3"
      />

      <!-- Bande inférieure -->
      <ellipse
        cx="100"
        cy="130"
        rx="65"
        ry="12"
        fill="url(#crown-gold)"
        stroke="#DAA520"
        stroke-width="3"
      />

      <!-- Pointes décoratives -->
      <path
        d="M 50 90 L 55 75 L 60 90"
        fill="url(#crown-gold)"
        stroke="#DAA520"
        stroke-width="2"
      />
      <path
        d="M 100 70 L 100 50 L 105 70"
        fill="url(#crown-gold)"
        stroke="#DAA520"
        stroke-width="2"
      />
      <path
        d="M 150 90 L 145 75 L 140 90"
        fill="url(#crown-gold)"
        stroke="#DAA520"
        stroke-width="2"
      />

      <!-- Gemmes -->
      ${Array.from({ length: gemCount }, (_, i) => {
        const positions = [
          { x: 55, y: 110 },
          { x: 80, y: 120 },
          { x: 100, y: 105 },
          { x: 120, y: 120 },
          { x: 145, y: 110 }
        ]
        const pos = positions[i] ?? { x: 100, y: 110 }
        return `
          <circle cx="${pos.x}" cy="${pos.y}" r="6" fill="url(#gem-shine)" stroke="#8B008B" stroke-width="1.5" />
        `
      }).join('')}

      <!-- Croix royale au sommet -->
      <g transform="translate(100, 50)">
        <rect x="-2" y="-8" width="4" height="16" fill="${goldColor}" />
        <rect x="-6" y="-2" width="12" height="4" fill="${goldColor}" />
      </g>
    </svg>
  `.trim()
}

/**
 * Generate wizard hat SVG
 *
 * @param config - Configuration du chapeau de sorcier
 * @returns SVG string
 */
export function generateWizardHat (config: WizardHatConfig = {
  hatColor: '#4B0082',
  starColor: '#FFD700',
  hasMoon: true
}): string {
  const { hatColor, starColor, hasMoon } = config

  return `
    <svg 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg"
      style="width: 100%; height: auto;"
    >
      <defs>
        <linearGradient id="wizard-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#6A0DAD;stop-opacity:1" />
          <stop offset="100%" style="stop-color:${hatColor};stop-opacity:1" />
        </linearGradient>
      </defs>

      <!-- Chapeau pointu courbé -->
      <path
        d="M 100 20 Q 110 80 120 120 L 80 120 Q 90 80 100 20"
        fill="url(#wizard-gradient)"
        stroke="#2C2C2C"
        stroke-width="3"
      />

      <!-- Bord du chapeau -->
      <ellipse
        cx="100"
        cy="120"
        rx="60"
        ry="15"
        fill="${hatColor}"
        stroke="#2C2C2C"
        stroke-width="3"
      />

      <!-- Étoiles dorées -->
      <g transform="translate(95, 60)">
        <path
          d="M 0,-6 L 1.8,-1.8 L 6.5,-1.2 L 3.2,2 L 4,6.5 L 0,4.2 L -4,6.5 L -3.2,2 L -6.5,-1.2 L -1.8,-1.8 Z"
          fill="${starColor}"
          stroke="#DAA520"
          stroke-width="1"
        />
      </g>
      <g transform="translate(110, 85)">
        <path
          d="M 0,-4 L 1.2,-1.2 L 4.3,-0.8 L 2.1,1.3 L 2.7,4.3 L 0,2.8 L -2.7,4.3 L -2.1,1.3 L -4.3,-0.8 L -1.2,-1.2 Z"
          fill="${starColor}"
          stroke="#DAA520"
          stroke-width="0.8"
          opacity="0.8"
        />
      </g>

      ${hasMoon ? `
      <!-- Croissant de lune -->
      <g transform="translate(85, 90)">
        <path
          d="M 0,-8 A 8 8 0 1 0 0,8 A 6 6 0 1 1 0,-8"
          fill="#F0E68C"
          stroke="#DAA520"
          stroke-width="1"
        />
      </g>
      ` : ''}

      <!-- Reflets magiques -->
      <path
        d="M 105 40 Q 108 50 110 60"
        fill="none"
        stroke="white"
        stroke-width="2"
        opacity="0.3"
        stroke-linecap="round"
      />
    </svg>
  `.trim()
}

/**
 * Generate baseball cap SVG
 *
 * @param config - Configuration de la casquette
 * @returns SVG string
 */
export function generateBaseballCap (config: BaseballCapConfig = {
  capColor: '#FF0000',
  logoColor: '#FFFFFF',
  hasLogo: true
}): string {
  const { capColor, logoColor, hasLogo } = config

  return `
    <svg 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg"
      style="width: 100%; height: auto;"
    >
      <defs>
        <linearGradient id="cap-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:${capColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#AA0000;stop-opacity:1" />
        </linearGradient>
      </defs>

      <!-- Visière -->
      <ellipse
        cx="100"
        cy="120"
        rx="70"
        ry="20"
        fill="#2C2C2C"
        stroke="#1A1A1A"
        stroke-width="2"
      />

      <!-- Partie principale de la casquette -->
      <ellipse
        cx="100"
        cy="90"
        rx="50"
        ry="40"
        fill="url(#cap-gradient)"
        stroke="#AA0000"
        stroke-width="2"
      />

      <!-- Bouton au sommet -->
      <circle
        cx="100"
        cy="60"
        r="5"
        fill="${capColor}"
        stroke="#AA0000"
        stroke-width="1.5"
      />

      ${hasLogo ? `
      <!-- Logo -->
      <text
        x="100"
        y="95"
        font-family="Arial, sans-serif"
        font-size="24"
        font-weight="bold"
        text-anchor="middle"
        fill="${logoColor}"
      >M</text>
      ` : ''}
    </svg>
  `.trim()
}

/**
 * Generate cowboy hat SVG
 *
 * @param config - Configuration du chapeau de cowboy
 * @returns SVG string
 */
export function generateCowboyHat (config: CowboyHatConfig = {
  hatColor: '#8B4513',
  bandColor: '#654321',
  hasStar: true
}): string {
  const { hatColor, bandColor, hasStar } = config

  return `
    <svg 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg"
      style="width: 100%; height: auto;"
    >
      <defs>
        <linearGradient id="cowboy-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#A0522D;stop-opacity:1" />
          <stop offset="100%" style="stop-color:${hatColor};stop-opacity:1" />
        </linearGradient>
      </defs>

      <!-- Grand bord -->
      <ellipse
        cx="100"
        cy="130"
        rx="80"
        ry="20"
        fill="url(#cowboy-gradient)"
        stroke="${bandColor}"
        stroke-width="3"
      />

      <!-- Courbe du bord relevé -->
      <path
        d="M 30 130 Q 50 110 80 115"
        fill="url(#cowboy-gradient)"
        stroke="${bandColor}"
        stroke-width="2"
      />
      <path
        d="M 170 130 Q 150 110 120 115"
        fill="url(#cowboy-gradient)"
        stroke="${bandColor}"
        stroke-width="2"
      />

      <!-- Couronne du chapeau -->
      <ellipse
        cx="100"
        cy="90"
        rx="40"
        ry="35"
        fill="url(#cowboy-gradient)"
        stroke="${bandColor}"
        stroke-width="2"
      />

      <!-- Dent au sommet -->
      <path
        d="M 90 70 Q 100 60 110 70"
        fill="${hatColor}"
        stroke="${bandColor}"
        stroke-width="2"
      />

      <!-- Bande décorative -->
      <ellipse
        cx="100"
        cy="110"
        rx="42"
        ry="8"
        fill="${bandColor}"
        stroke="#4A3020"
        stroke-width="2"
      />

      ${hasStar ? `
      <!-- Étoile de shérif -->
      <g transform="translate(100, 110)">
        <path
          d="M 0,-5 L 1.5,-1.5 L 5.5,-1 L 2.7,1.5 L 3.4,5.5 L 0,3.5 L -3.4,5.5 L -2.7,1.5 L -5.5,-1 L -1.5,-1.5 Z"
          fill="#FFD700"
          stroke="#DAA520"
          stroke-width="1"
        />
      </g>
      ` : ''}
    </svg>
  `.trim()
}

/**
 * Generate top hat SVG
 *
 * @param config - Configuration du haut-de-forme
 * @returns SVG string
 */
export function generateTopHat (config: TopHatConfig = {
  hatColor: '#1A1A1A',
  bandColor: '#8B0000',
  hasRibbon: true
}): string {
  const { hatColor, bandColor, hasRibbon } = config

  return `
    <svg 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg"
      style="width: 100%; height: auto;"
    >
      <defs>
        <linearGradient id="tophat-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#000000;stop-opacity:1" />
          <stop offset="50%" style="stop-color:${hatColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#333333;stop-opacity:1" />
        </linearGradient>
      </defs>

      <!-- Bord du chapeau -->
      <ellipse
        cx="100"
        cy="130"
        rx="70"
        ry="15"
        fill="url(#tophat-gradient)"
        stroke="#000000"
        stroke-width="3"
      />

      <!-- Cylindre principal -->
      <rect
        x="60"
        y="50"
        width="80"
        height="80"
        rx="5"
        fill="url(#tophat-gradient)"
        stroke="#000000"
        stroke-width="3"
      />

      <!-- Sommet du chapeau -->
      <ellipse
        cx="100"
        cy="50"
        rx="40"
        ry="10"
        fill="${hatColor}"
        stroke="#000000"
        stroke-width="2"
      />

      ${hasRibbon ? `
      <!-- Ruban décoratif -->
      <rect
        x="60"
        y="105"
        width="80"
        height="15"
        fill="${bandColor}"
        stroke="#660000"
        stroke-width="2"
      />
      <!-- Nœud du ruban -->
      <circle cx="140" cy="112" r="8" fill="${bandColor}" stroke="#660000" stroke-width="2" />
      <circle cx="152" cy="112" r="8" fill="${bandColor}" stroke="#660000" stroke-width="2" />
      <rect x="144" y="108" width="4" height="8" fill="${bandColor}" />
      ` : ''}

      <!-- Reflet -->
      <ellipse
        cx="80"
        cy="75"
        rx="8"
        ry="20"
        fill="white"
        opacity="0.2"
      />
    </svg>
  `.trim()
}

/**
 * Generate hat by type
 *
 * @param type - Type de chapeau à générer
 * @returns SVG string
 */
export function generateHat (type: HatType): string {
  switch (type) {
    case 'party':
      return generatePartyHat()
    case 'crown':
      return generateCrown()
    case 'wizard':
      return generateWizardHat()
    case 'baseball':
      return generateBaseballCap()
    case 'cowboy':
      return generateCowboyHat()
    case 'top':
      return generateTopHat()
    default:
      return generatePartyHat()
  }
}

