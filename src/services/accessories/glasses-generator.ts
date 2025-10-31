/**
 * Glasses Generator Service
 *
 * Domain Layer: Pure business logic for generating glasses accessories
 *
 * Responsibilities:
 * - Generate SVG representations of sunglasses
 * - Generate SVG representations of nerd glasses
 *
 * Clean Architecture: This service contains pure domain logic
 * No dependencies on UI frameworks or external APIs
 */

/**
 * Type de lunettes disponibles
 */
export type GlassesType = 'sunglasses' | 'nerd' | 'reading' | 'monocle' | 'cyber' | 'laser'

/**
 * Configuration pour les lunettes de soleil
 */
interface SunglassesConfig {
  frameColor: string
  lensColor: string
  hasReflection: boolean
}

/**
 * Configuration pour les lunettes de génie
 */
interface NerdGlassesConfig {
  frameColor: string
  lensOpacity: number
  hasTape: boolean
}

/**
 * Configuration pour les lunettes de lecture
 */
interface ReadingGlassesConfig {
  frameColor: string
  lensOpacity: number
  hasChain: boolean
}

/**
 * Configuration pour le monocle
 */
interface MonocleConfig {
  frameColor: string
  glassOpacity: number
  hasChain: boolean
}

/**
 * Configuration pour les lunettes cybernétiques
 */
interface CyberGlassesConfig {
  frameColor: string
  glowColor: string
  hasHUD: boolean
}

/**
 * Configuration pour les lunettes laser
 */
interface LaserGlassesConfig {
  frameColor: string
  laserColor: string
  isActive: boolean
}

/**
 * Generate sunglasses SVG
 *
 * @param config - Configuration des lunettes de soleil
 * @returns SVG string
 */
export function generateSunglasses (config: SunglassesConfig = {
  frameColor: '#2C2C2C',
  lensColor: '#1A1A1A',
  hasReflection: true
}): string {
  const { frameColor, lensColor, hasReflection } = config

  return `
    <svg 
      viewBox="0 0 200 80" 
      xmlns="http://www.w3.org/2000/svg"
      style="width: 100%; height: auto;"
    >
      <defs>
        <!-- Dégradé pour les verres -->
        <linearGradient id="lens-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:${lensColor};stop-opacity:0.9" />
          <stop offset="100%" style="stop-color:${lensColor};stop-opacity:1" />
        </linearGradient>
        
        <!-- Dégradé pour les reflets -->
        ${hasReflection
? `
        <linearGradient id="reflection-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:white;stop-opacity:0.6" />
          <stop offset="100%" style="stop-color:white;stop-opacity:0" />
        </linearGradient>
        `
: ''}
      </defs>

      <!-- Verre gauche -->
      <ellipse 
        cx="50" 
        cy="40" 
        rx="35" 
        ry="30" 
        fill="url(#lens-gradient)"
        stroke="${frameColor}"
        stroke-width="3"
      />
      
      <!-- Verre droit -->
      <ellipse 
        cx="150" 
        cy="40" 
        rx="35" 
        ry="30" 
        fill="url(#lens-gradient)"
        stroke="${frameColor}"
        stroke-width="3"
      />
      
      <!-- Pont entre les deux verres -->
      <rect 
        x="85" 
        y="37" 
        width="30" 
        height="6" 
        fill="${frameColor}"
        rx="3"
      />
      
      ${hasReflection
? `
      <!-- Reflets sur les verres -->
      <ellipse 
        cx="40" 
        cy="30" 
        rx="15" 
        ry="12" 
        fill="url(#reflection-gradient)"
        opacity="0.7"
      />
      <ellipse 
        cx="140" 
        cy="30" 
        rx="15" 
        ry="12" 
        fill="url(#reflection-gradient)"
        opacity="0.7"
      />
      `
: ''}
      
      <!-- Branches gauche -->
      <line 
        x1="15" 
        y1="40" 
        x2="0" 
        y2="40" 
        stroke="${frameColor}" 
        stroke-width="3"
        stroke-linecap="round"
      />
      
      <!-- Branches droite -->
      <line 
        x1="185" 
        y1="40" 
        x2="200" 
        y2="40" 
        stroke="${frameColor}" 
        stroke-width="3"
        stroke-linecap="round"
      />
    </svg>
  `.trim()
}

/**
 * Generate nerd glasses SVG
 *
 * @param config - Configuration des lunettes de génie
 * @returns SVG string
 */
export function generateNerdGlasses (config: NerdGlassesConfig = {
  frameColor: '#2C2C2C',
  lensOpacity: 0.1,
  hasTape: true
}): string {
  const { frameColor, lensOpacity, hasTape } = config

  return `
    <svg 
      viewBox="0 0 200 80" 
      xmlns="http://www.w3.org/2000/svg"
      style="width: 100%; height: auto;"
    >
      <defs>
        <!-- Dégradé pour les verres transparents -->
        <radialGradient id="glass-shine">
          <stop offset="0%" style="stop-color:white;stop-opacity:0.3" />
          <stop offset="100%" style="stop-color:white;stop-opacity:0" />
        </radialGradient>
      </defs>

      <!-- Monture épaisse gauche -->
      <rect 
        x="15" 
        y="20" 
        width="70" 
        height="50" 
        rx="8"
        fill="none"
        stroke="${frameColor}"
        stroke-width="6"
      />
      
      <!-- Monture épaisse droite -->
      <rect 
        x="115" 
        y="20" 
        width="70" 
        height="50" 
        rx="8"
        fill="none"
        stroke="${frameColor}"
        stroke-width="6"
      />
      
      <!-- Verres semi-transparents gauche -->
      <rect 
        x="18" 
        y="23" 
        width="64" 
        height="44" 
        rx="6"
        fill="white"
        opacity="${lensOpacity}"
      />
      
      <!-- Verres semi-transparents droit -->
      <rect 
        x="118" 
        y="23" 
        width="64" 
        height="44" 
        rx="6"
        fill="white"
        opacity="${lensOpacity}"
      />
      
      <!-- Reflets sur les verres -->
      <circle 
        cx="35" 
        cy="35" 
        r="12" 
        fill="url(#glass-shine)"
      />
      <circle 
        cx="135" 
        cy="35" 
        r="12" 
        fill="url(#glass-shine)"
      />
      
      <!-- Pont entre les verres -->
      <rect 
        x="85" 
        y="42" 
        width="30" 
        height="6" 
        fill="${frameColor}"
        rx="3"
      />
      
      ${hasTape
? `
      <!-- Scotch de réparation sur le pont -->
      <g opacity="0.8">
        <rect 
          x="92" 
          y="38" 
          width="16" 
          height="14" 
          fill="#E8E8E8"
          rx="1"
        />
        <line 
          x1="92" 
          y1="40" 
          x2="108" 
          y2="50" 
          stroke="#D0D0D0" 
          stroke-width="0.5"
        />
        <line 
          x1="92" 
          y1="45" 
          x2="108" 
          y2="45" 
          stroke="#D0D0D0" 
          stroke-width="0.5"
        />
      </g>
      `
: ''}
      
      <!-- Branches gauche -->
      <line 
        x1="15" 
        y1="45" 
        x2="0" 
        y2="45" 
        stroke="${frameColor}" 
        stroke-width="4"
        stroke-linecap="round"
      />
      
      <!-- Branches droite -->
      <line 
        x1="185" 
        y1="45" 
        x2="200" 
        y2="45" 
        stroke="${frameColor}" 
        stroke-width="4"
        stroke-linecap="round"
      />
    </svg>
  `.trim()
}

/**
 * Generate reading glasses SVG
 *
 * @param config - Configuration des lunettes de lecture
 * @returns SVG string
 */
export function generateReadingGlasses (config: ReadingGlassesConfig = {
  frameColor: '#8B4513',
  lensOpacity: 0.15,
  hasChain: true
}): string {
  const { frameColor, lensOpacity, hasChain } = config

  return `
    <svg 
      viewBox="0 0 200 100" 
      xmlns="http://www.w3.org/2000/svg"
      style="width: 100%; height: auto;"
    >
      <!-- Verre gauche oval -->
      <ellipse 
        cx="50" 
        cy="35" 
        rx="30" 
        ry="25" 
        fill="white"
        opacity="${lensOpacity}"
        stroke="${frameColor}"
        stroke-width="2.5"
      />
      
      <!-- Verre droit oval -->
      <ellipse 
        cx="150" 
        cy="35" 
        rx="30" 
        ry="25" 
        fill="white"
        opacity="${lensOpacity}"
        stroke="${frameColor}"
        stroke-width="2.5"
      />
      
      <!-- Pont -->
      <path 
        d="M 80 35 Q 100 30 120 35"
        fill="none"
        stroke="${frameColor}"
        stroke-width="2.5"
      />
      
      <!-- Branches -->
      <line x1="20" y1="35" x2="5" y2="35" stroke="${frameColor}" stroke-width="2" />
      <line x1="180" y1="35" x2="195" y2="35" stroke="${frameColor}" stroke-width="2" />
      
      ${hasChain
? `
      <!-- Chaînette -->
      <path 
        d="M 5 35 Q 5 60 15 70"
        fill="none"
        stroke="#C0C0C0"
        stroke-width="1"
        stroke-dasharray="2,2"
      />
      <path 
        d="M 195 35 Q 195 60 185 70"
        fill="none"
        stroke="#C0C0C0"
        stroke-width="1"
        stroke-dasharray="2,2"
      />
      <line x1="15" y1="70" x2="185" y2="70" stroke="#C0C0C0" stroke-width="1" stroke-dasharray="2,2" />
      `
: ''}
    </svg>
  `.trim()
}

/**
 * Generate monocle SVG
 *
 * @param config - Configuration du monocle
 * @returns SVG string
 */
export function generateMonocle (config: MonocleConfig = {
  frameColor: '#FFD700',
  glassOpacity: 0.1,
  hasChain: true
}): string {
  const { frameColor, glassOpacity, hasChain } = config

  return `
    <svg 
      viewBox="0 0 200 150" 
      xmlns="http://www.w3.org/2000/svg"
      style="width: 100%; height: auto;"
    >
      <!-- Verre unique -->
      <circle 
        cx="100" 
        cy="60" 
        r="35" 
        fill="white"
        opacity="${glassOpacity}"
        stroke="${frameColor}"
        stroke-width="3"
      />
      
      <!-- Reflet sur le verre -->
      <ellipse 
        cx="90" 
        cy="50" 
        rx="12" 
        ry="15" 
        fill="white"
        opacity="0.4"
      />
      
      ${hasChain
? `
      <!-- Anneau d'attache -->
      <circle 
        cx="135" 
        cy="60" 
        r="5" 
        fill="none"
        stroke="${frameColor}"
        stroke-width="2"
      />
      
      <!-- Chaînette dorée -->
      <path 
        d="M 140 60 Q 160 80 160 110"
        fill="none"
        stroke="${frameColor}"
        stroke-width="1.5"
      />
      <circle cx="160" cy="115" r="4" fill="${frameColor}" />
      `
: ''}
    </svg>
  `.trim()
}

/**
 * Generate cyber glasses SVG
 *
 * @param config - Configuration des lunettes cybernétiques
 * @returns SVG string
 */
export function generateCyberGlasses (config: CyberGlassesConfig = {
  frameColor: '#00FFFF',
  glowColor: '#00FFFF',
  hasHUD: true
}): string {
  const { frameColor, glowColor, hasHUD } = config

  return `
    <svg 
      viewBox="0 0 200 80" 
      xmlns="http://www.w3.org/2000/svg"
      style="width: 100%; height: auto;"
    >
      <defs>
        <linearGradient id="cyber-glow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:${glowColor};stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:${glowColor};stop-opacity:0.3" />
        </linearGradient>
        <filter id="cyber-blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
        </filter>
      </defs>

      <!-- Verre gauche futuriste -->
      <rect 
        x="15" 
        y="25" 
        width="70" 
        height="35" 
        rx="3"
        fill="url(#cyber-glow)"
        stroke="${frameColor}"
        stroke-width="2"
      />
      
      <!-- Verre droit futuriste -->
      <rect 
        x="115" 
        y="25" 
        width="70" 
        height="35" 
        rx="3"
        fill="url(#cyber-glow)"
        stroke="${frameColor}"
        stroke-width="2"
      />
      
      <!-- Pont technologique -->
      <rect 
        x="85" 
        y="40" 
        width="30" 
        height="5" 
        fill="${frameColor}"
      />
      
      ${hasHUD
? `
      <!-- Affichage HUD gauche -->
      <g opacity="0.9">
        <line x1="25" y1="35" x2="75" y2="35" stroke="${glowColor}" stroke-width="0.5" />
        <line x1="25" y1="40" x2="60" y2="40" stroke="${glowColor}" stroke-width="0.5" />
        <line x1="25" y1="45" x2="70" y2="45" stroke="${glowColor}" stroke-width="0.5" />
        <text x="28" y="52" font-family="monospace" font-size="6" fill="${glowColor}">SCANNING...</text>
      </g>
      
      <!-- Affichage HUD droit -->
      <g opacity="0.9">
        <line x1="125" y1="35" x2="175" y2="35" stroke="${glowColor}" stroke-width="0.5" />
        <line x1="125" y1="40" x2="160" y2="40" stroke="${glowColor}" stroke-width="0.5" />
        <circle cx="170" cy="45" r="8" fill="none" stroke="${glowColor}" stroke-width="0.5" />
        <circle cx="170" cy="45" r="5" fill="none" stroke="${glowColor}" stroke-width="0.5" />
      </g>
      `
: ''}
      
      <!-- Branches futuristes -->
      <line x1="15" y1="42" x2="0" y2="42" stroke="${frameColor}" stroke-width="3" />
      <line x1="185" y1="42" x2="200" y2="42" stroke="${frameColor}" stroke-width="3" />
    </svg>
  `.trim()
}

/**
 * Generate laser glasses SVG
 *
 * @param config - Configuration des lunettes laser
 * @returns SVG string
 */
export function generateLaserGlasses (config: LaserGlassesConfig = {
  frameColor: '#FF0000',
  laserColor: '#FF0000',
  isActive: true
}): string {
  const { frameColor, laserColor, isActive } = config

  return `
    <svg 
      viewBox="0 0 200 100" 
      xmlns="http://www.w3.org/2000/svg"
      style="width: 100%; height: auto;"
    >
      <defs>
        <radialGradient id="laser-glow">
          <stop offset="0%" style="stop-color:${laserColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${laserColor};stop-opacity:0" />
        </radialGradient>
      </defs>

      <!-- Monture gauche -->
      <rect 
        x="20" 
        y="30" 
        width="60" 
        height="30" 
        rx="5"
        fill="#1A1A1A"
        stroke="${frameColor}"
        stroke-width="2.5"
      />
      
      <!-- Monture droite -->
      <rect 
        x="120" 
        y="30" 
        width="60" 
        height="30" 
        rx="5"
        fill="#1A1A1A"
        stroke="${frameColor}"
        stroke-width="2.5"
      />
      
      <!-- Pont renforcé -->
      <rect 
        x="80" 
        y="42" 
        width="40" 
        height="8" 
        fill="${frameColor}"
      />
      
      ${isActive
? `
      <!-- Rayons laser gauche -->
      <g opacity="0.8">
        <line x1="50" y1="45" x2="50" y2="80" stroke="${laserColor}" stroke-width="2" />
        <circle cx="50" cy="80" r="3" fill="url(#laser-glow)" />
        <ellipse cx="50" cy="80" rx="8" ry="4" fill="${laserColor}" opacity="0.3" />
      </g>
      
      <!-- Rayons laser droit -->
      <g opacity="0.8">
        <line x1="150" y1="45" x2="150" y2="80" stroke="${laserColor}" stroke-width="2" />
        <circle cx="150" cy="80" r="3" fill="url(#laser-glow)" />
        <ellipse cx="150" cy="80" rx="8" ry="4" fill="${laserColor}" opacity="0.3" />
      </g>
      
      <!-- LEDs d'activation -->
      <circle cx="75" cy="35" r="2" fill="#00FF00" />
      <circle cx="125" cy="35" r="2" fill="#00FF00" />
      `
: ''}
      
      <!-- Branches -->
      <line x1="20" y1="45" x2="5" y2="45" stroke="${frameColor}" stroke-width="3" />
      <line x1="180" y1="45" x2="195" y2="45" stroke="${frameColor}" stroke-width="3" />
    </svg>
  `.trim()
}

/**
 * Generate glasses by type
 *
 * @param type - Type de lunettes à générer
 * @returns SVG string
 */
export function generateGlasses (type: GlassesType): string {
  switch (type) {
    case 'sunglasses':
      return generateSunglasses()
    case 'nerd':
      return generateNerdGlasses()
    case 'reading':
      return generateReadingGlasses()
    case 'monocle':
      return generateMonocle()
    case 'cyber':
      return generateCyberGlasses()
    case 'laser':
      return generateLaserGlasses()
    default:
      return generateSunglasses()
  }
}
