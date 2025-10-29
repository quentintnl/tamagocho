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
export type GlassesType = 'sunglasses' | 'nerd'

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
        ${hasReflection ? `
        <linearGradient id="reflection-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:white;stop-opacity:0.6" />
          <stop offset="100%" style="stop-color:white;stop-opacity:0" />
        </linearGradient>
        ` : ''}
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
      
      ${hasReflection ? `
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
      ` : ''}
      
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
      
      ${hasTape ? `
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
      ` : ''}
      
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
    default:
      return generateSunglasses()
  }
}

