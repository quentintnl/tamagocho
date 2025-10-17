'use client'

import { useMemo } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import styles from './monster-preview.module.css'
import type { MonsterBodyShape, MonsterDesign, MonsterPalette, MonsterState } from '@/types/monster'

interface MonsterPreviewProps {
  design: MonsterDesign | null
  state: MonsterState
  width?: number
  height?: number
}

const DEFAULT_DIMENSION = 240

const FALLBACK_PALETTE: MonsterPalette = {
  primary: '#f1f5f9',
  secondary: '#ffffff',
  detail: '#94a3b8',
  cheeks: '#fda4af',
  background: '#f8fafc',
  accent: '#bfdbfe'
}

const CLOSED_MOUTH_PATHS: Record<MonsterState, string> = {
  happy: 'M80 134 Q100 150 120 134',
  sad: 'M80 140 Q100 124 120 140',
  angry: 'M82 132 Q100 138 118 132',
  hungry: 'M84 134 Q100 152 116 134',
  sleepy: 'M82 138 Q100 136 118 138'
}

const OPEN_MOUTH_PATHS: Partial<Record<MonsterState, string>> = {
  angry: 'M84 130 L116 130 L116 144 Q100 152 84 144 Z',
  hungry: 'M86 132 Q100 162 114 132 L114 146 Q100 166 86 146 Z'
}

const LIP_HIGHLIGHT_PATHS: Record<MonsterState, string> = {
  happy: 'M84 130 Q100 142 116 130',
  sad: 'M84 138 Q100 126 116 138',
  angry: 'M86 128 Q100 134 114 128',
  hungry: 'M86 130 Q100 148 114 130',
  sleepy: 'M84 136 Q100 134 116 136'
}

const INNER_MOUTH_PATHS: Partial<Record<MonsterState, string>> = {
  angry: 'M86 132 L114 132 Q118 138 112 150 Q100 156 88 150 Q82 138 86 132 Z',
  hungry: 'M84 134 Q100 164 116 134 L116 152 Q100 170 84 152 Z'
}

const TONGUE_PATHS: Partial<Record<MonsterState, string>> = {
  hungry: 'M92 146 Q100 160 108 146 Q100 156 92 146 Z'
}

const FANG_PATHS: Partial<Record<MonsterState, [string, string]>> = {
  angry: [
    'M92 138 L96 152 L88 150 Z',
    'M108 138 L104 152 L112 150 Z'
  ]
}

const DROOL_PATHS: Partial<Record<MonsterState, string>> = {
  hungry: 'M120 150 Q124 162 118 170 Q112 160 114 148 Z'
}

const STATE_EMOJI: Record<MonsterState, string> = {
  happy: '✨',
  sad: '💧',
  angry: '💢',
  hungry: '🍽️',
  sleepy: '💤'
}

const STATE_BADGE_CLASS: Record<MonsterState, string> = {
  happy: styles.stateBadgeHappy,
  sad: styles.stateBadgeSad,
  angry: styles.stateBadgeAngry,
  hungry: styles.stateBadgeHungry,
  sleepy: styles.stateBadgeSleepy
}

const BODY_PATHS: Record<MonsterBodyShape, string> = {
  round: 'M100 48 C64 56 52 110 60 158 C68 200 132 200 140 158 C148 110 136 56 100 48 Z',
  oval: 'M100 40 C70 48 56 112 62 168 C68 210 132 210 138 168 C144 112 130 48 100 40 Z',
  bean: 'M96 42 C60 60 52 118 66 168 C76 202 140 196 144 150 C148 104 136 52 100 46 Z',
  square: 'M70 56 H130 C138 56 140 74 140 120 C140 168 138 182 124 188 H76 C62 182 60 168 60 120 C60 74 62 56 70 56 Z',
  pear: 'M100 46 C70 56 56 112 64 150 C70 190 130 198 140 162 C148 132 140 86 114 66 C108 56 104 46 100 46 Z'
}

const BELLY_PATHS: Record<MonsterBodyShape, string> = {
  round: 'M100 94 C80 104 76 142 88 164 C98 182 102 182 112 164 C124 142 120 104 100 94 Z',
  oval: 'M100 92 C82 102 76 148 90 170 C102 186 108 186 118 170 C132 148 126 102 100 92 Z',
  bean: 'M102 108 C84 114 78 150 90 170 C102 186 120 182 126 164 C132 144 130 118 116 108 Z',
  square: 'M82 104 H118 C122 104 124 116 124 144 C124 170 122 174 116 176 H84 C78 174 76 170 76 144 C76 116 78 104 82 104 Z',
  pear: 'M100 102 C86 112 80 146 90 166 C100 182 108 182 120 166 C130 146 124 112 110 102 Z'
}

const COMPOSITION_TRANSFORMS: Record<MonsterBodyShape, string> = {
  round: 'translate(0 6) scale(0.82)',
  oval: 'translate(0 2) scale(0.8)',
  bean: 'translate(-4 8) scale(0.8)',
  square: 'translate(0 10) scale(0.78)',
  pear: 'translate(0 6) scale(0.8)'
}

const PIXEL_UNIT = 6
const PIXEL_GRID_SIZE = 16
const PIXEL_CANVAS = PIXEL_UNIT * PIXEL_GRID_SIZE

interface PixelBodySpec {
  x: number
  y: number
  width: number
  height: number
}

const PIXEL_BODY_SPECS: Record<MonsterBodyShape, PixelBodySpec> = {
  round: { x: 4, y: 4, width: 8, height: 8 },
  oval: { x: 4, y: 3, width: 8, height: 9 },
  bean: { x: 5, y: 4, width: 7, height: 9 },
  square: { x: 4, y: 4, width: 8, height: 8 },
  pear: { x: 4, y: 5, width: 8, height: 8 }
}

const renderEars = (palette: MonsterPalette, earShape: MonsterDesign['features']['earShape']): ReactNode => {
  switch (earShape) {
    case 'pointy':
      return (
        <g fill={palette.secondary} stroke={palette.detail} strokeWidth='3'>
          <path d='M52 94 L70 46 L88 96 Z' />
          <path d='M148 94 L130 46 L112 96 Z' />
        </g>
      )
    case 'droopy':
      return (
        <g fill={palette.secondary} stroke={palette.detail} strokeWidth='3'>
          <path d='M58 98 C46 74 50 58 68 70 C78 78 80 96 74 110 Z' />
          <path d='M142 98 C154 74 150 58 132 70 C122 78 120 96 126 110 Z' />
        </g>
      )
    case 'long':
      return (
        <g fill={palette.secondary} stroke={palette.detail} strokeWidth='3'>
          <path d='M62 112 C50 66 66 42 82 74 C90 90 86 108 76 122 Z' />
          <path d='M138 112 C150 66 134 42 118 74 C110 90 114 108 124 122 Z' />
        </g>
      )
    case 'round':
    default:
      return (
        <g fill={palette.secondary} stroke={palette.detail} strokeWidth='3'>
          <circle cx='64' cy='82' r='20' />
          <circle cx='136' cy='82' r='20' />
        </g>
      )
  }
}

const renderTail = (palette: MonsterPalette, tailShape: MonsterDesign['features']['tailShape']): ReactNode => {
  switch (tailShape) {
    case 'none':
      return null
    case 'puff':
      return (
        <circle className={styles.tailPuff} cx='156' cy='166' r='16' fill={palette.secondary} stroke={palette.detail} strokeWidth='3' />
      )
    case 'short':
      return (
        <path className={styles.tail} d='M150 162 C166 158 170 176 156 182 C146 186 144 176 144 170' fill={palette.secondary} stroke={palette.detail} strokeWidth='3' />
      )
    case 'long':
    default:
      return (
        <path className={styles.tail} d='M150 158 C178 150 186 198 154 194 C144 192 140 178 142 170' fill='none' stroke={palette.detail} strokeWidth='5' strokeLinecap='round' />
      )
  }
}

const renderArms = (palette: MonsterPalette): ReactNode => (
  <>
    <rect
      className={`${styles.arm} ${styles.armLeft}`}
      x='56'
      y='130'
      width='20'
      height='38'
      rx='7'
      fill={palette.secondary}
      stroke={palette.detail}
      strokeWidth='3'
    />
    <rect
      className={`${styles.arm} ${styles.armRight}`}
      x='124'
      y='130'
      width='20'
      height='38'
      rx='7'
      fill={palette.secondary}
      stroke={palette.detail}
      strokeWidth='3'
    />
  </>
)

const renderLegs = (palette: MonsterPalette): ReactNode => (
  <>
    <rect
      className={`${styles.leg} ${styles.legLeft}`}
      x='80'
      y='166'
      width='20'
      height='28'
      rx='6'
      fill={palette.secondary}
      stroke={palette.detail}
      strokeWidth='3'
    />
    <rect
      className={`${styles.leg} ${styles.legRight}`}
      x='110'
      y='166'
      width='20'
      height='28'
      rx='6'
      fill={palette.secondary}
      stroke={palette.detail}
      strokeWidth='3'
    />
  </>
)

const renderEyes = (palette: MonsterPalette, state: MonsterState): ReactNode => {
  const isSleepy = state === 'sleepy'
  const ry = isSleepy ? 4 : 11
  const eyeFill = '#1f2937'

  return (
    <g>
      <ellipse className={styles.eye} cx='82' cy='104' rx='11' ry={ry} fill={eyeFill} />
      <ellipse className={styles.eye} cx='118' cy='104' rx='11' ry={ry} fill={eyeFill} />
      {!isSleepy && (
        <>
          <circle cx='78' cy='100' r='3' fill='#ffffff' />
          <circle cx='114' cy='100' r='3' fill='#ffffff' />
        </>
      )}
    </g>
  )
}

const renderBrows = (palette: MonsterPalette, state: MonsterState): ReactNode => {
  if (state !== 'angry') return null
  return (
    <g stroke={palette.detail} strokeWidth='4' strokeLinecap='round' className={styles.brow}>
      <path d='M70 92 Q84 86 92 96' />
      <path d='M130 92 Q116 86 108 96' />
    </g>
  )
}

const renderCheeks = (palette: MonsterPalette): ReactNode => (
  <g>
    <ellipse className={styles.cheek} cx='70' cy='132' rx='14' ry='10' fill={palette.cheeks} />
    <ellipse className={styles.cheek} cx='130' cy='132' rx='14' ry='10' fill={palette.cheeks} />
  </g>
)

interface VariantLayers {
  beforeEyes?: ReactNode
  afterMuzzle?: ReactNode
  afterMouth?: ReactNode
}

const buildVariantLayers = (design: MonsterDesign, state: MonsterState): VariantLayers => {
  const { palette, variant } = design

  switch (variant) {
    case 'cat':
      return {
        afterMuzzle: (
          <g>
            <path className={styles.nose} d='M96 128 L104 128 L100 134 Z' fill={palette.detail} />
            <circle className={styles.muzzleMark} cx='88' cy='132' r='2' fill={palette.detail} />
            <circle className={styles.muzzleMark} cx='112' cy='132' r='2' fill={palette.detail} />
          </g>
        )
      }
    case 'dog':
      return {
        afterMuzzle: (
          <g>
            <path className={styles.nose} d='M92 126 Q100 136 108 126 L108 132 Q100 138 92 132 Z' fill={palette.detail} />
          </g>
        ),
        afterMouth: state === 'hungry'
          ? (
            <path className={styles.tongue} d='M100 150 L110 150 Q110 162 100 168 Q90 162 90 150 Z' fill={palette.accent} />
            )
          : undefined
      }
    case 'rabbit':
      return {
        beforeEyes: (
          <g fill={palette.accent} opacity='0.45'>
            <path className={styles.innerEar} d='M66 70 C60 52 70 42 80 60 C84 68 80 84 72 96 Z' />
            <path className={styles.innerEar} d='M134 70 C140 52 130 42 120 60 C116 68 120 84 128 96 Z' />
          </g>
        ),
        afterMouth: (
          <rect className={styles.rabbitTeeth} x='96' y='152' width='8' height='10' rx='2' fill='#ffffff' stroke={palette.detail} strokeWidth='1.5' />
        )
      }
    case 'panda':
      return {
        beforeEyes: (
          <g fill={palette.detail} opacity='0.55'>
            <ellipse className={styles.eyePatch} cx='82' cy='104' rx='18' ry='20' />
            <ellipse className={styles.eyePatch} cx='118' cy='104' rx='18' ry='20' />
          </g>
        ),
        afterMuzzle: (
          <path className={styles.nose} d='M94 132 Q100 126 106 132 L100 138 Z' fill={palette.detail} />
        )
      }
    default:
      return {}
  }
}

const renderStateAccents = (palette: MonsterPalette, state: MonsterState): ReactNode => {
  switch (state) {
    case 'happy':
      return (
        <g className={`${styles.stateDecor} ${styles.stateDecorHappy}`} fill={palette.accent} stroke={palette.detail}>
          <path d='M100 34 L106 48 L122 50 L110 60 L114 74 L100 66 L86 74 L90 60 L78 50 L94 48 Z' />
          <circle cx='70' cy='54' r='6' />
          <circle cx='132' cy='60' r='5' />
        </g>
      )
    case 'sad':
      return (
        <g className={`${styles.stateDecor} ${styles.stateDecorSad}`}>
          <path d='M62 118 Q58 134 68 150 Q78 134 74 118 Z' fill={palette.accent} />
          <path d='M138 118 Q134 134 144 150 Q154 134 150 118 Z' fill={palette.accent} />
        </g>
      )
    case 'angry':
      return (
        <g className={`${styles.stateDecor} ${styles.stateDecorAngry}`}>
          <text x='72' y='72' fontSize='22'>💢</text>
          <text x='126' y='78' fontSize='20'>💢</text>
        </g>
      )
    case 'hungry':
      return (
        <g className={`${styles.stateDecor} ${styles.stateDecorHungry}`}>
          <text x='66' y='150' fontSize='20'>🍗</text>
          <text x='132' y='146' fontSize='18'>🥐</text>
        </g>
      )
    case 'sleepy':
      return (
        <g className={`${styles.stateDecor} ${styles.stateDecorSleepy}`}>
          <text x='150' y='70' fontSize='20'>Z</text>
          <text x='156' y='54' fontSize='16'>Z</text>
          <text x='162' y='42' fontSize='12'>Z</text>
        </g>
      )
    default:
      return null
  }
}

const renderWhiskers = (palette: MonsterPalette, hasWhiskers: boolean): ReactNode => {
  if (!hasWhiskers) return null
  return (
    <g stroke={palette.detail} strokeWidth='2.2' strokeLinecap='round' className={styles.whiskers}>
      <line x1='70' y1='132' x2='44' y2='126' />
      <line x1='70' y1='138' x2='44' y2='144' />
      <line x1='130' y1='132' x2='156' y2='126' />
      <line x1='130' y1='138' x2='156' y2='144' />
    </g>
  )
}

const renderMarkings = (palette: MonsterPalette, markings: MonsterDesign['features']['markings']): ReactNode => {
  switch (markings) {
    case 'mask':
      return (
        <path
          className={styles.marking}
          d='M62 106 Q100 80 138 106 L138 118 Q100 130 62 118 Z'
          fill={palette.detail}
          opacity='0.28'
        />
      )
    case 'patch':
      return (
        <path
          className={styles.marking}
          d='M116 144 Q140 142 142 168 Q128 176 116 170 Z'
          fill={palette.accent}
          opacity='0.35'
        />
      )
    case 'plain':
    default:
      return null
  }
}

const renderMuzzle = (palette: MonsterPalette, muzzle: MonsterDesign['features']['muzzle']): ReactNode => {
  switch (muzzle) {
    case 'flat':
      return (
        <rect x='84' y='134' width='32' height='18' rx='6' fill={palette.secondary} stroke={palette.detail} strokeWidth='3' />
      )
    case 'medium':
      return (
        <rect x='86' y='136' width='28' height='20' rx='6' fill={palette.secondary} stroke={palette.detail} strokeWidth='3' />
      )
    case 'small':
    default:
      return (
        <rect x='88' y='138' width='24' height='18' rx='6' fill={palette.secondary} stroke={palette.detail} strokeWidth='3' />
      )
  }
}

const renderMouth = (palette: MonsterPalette, state: MonsterState): ReactNode => {
  const closedPath = CLOSED_MOUTH_PATHS[state]
  const highlightPath = LIP_HIGHLIGHT_PATHS[state]
  const openPath = OPEN_MOUTH_PATHS[state]
  const innerPath = openPath !== undefined ? INNER_MOUTH_PATHS[state] : undefined
  const tonguePath = TONGUE_PATHS[state]
  const fangs = FANG_PATHS[state]
  const droolPath = DROOL_PATHS[state]

  return (
    <g className={styles.mouthGroup}>
      <path
        className={`${styles.mouth} ${styles.mouthClosed}`}
        d={closedPath}
        fill='none'
        stroke={state === 'sad' ? '#475569' : palette.detail}
        strokeWidth={state === 'angry' ? 5 : 4}
        strokeLinecap='round'
      />
      <path
        className={styles.mouthHighlight}
        d={highlightPath}
        fill='none'
        stroke={state === 'sad' ? '#94a3b8' : palette.accent}
        strokeWidth={2.2}
        strokeLinecap='round'
        strokeOpacity={0.7}
      />
      {openPath !== undefined && (
        <path
          className={`${styles.mouth} ${styles.mouthOpen}`}
          d={openPath}
          fill={palette.detail}
          stroke='none'
        />
      )}
      {innerPath !== undefined && (
        <path
          className={`${styles.mouthOpen} ${styles.mouthInner}`}
          d={innerPath}
          fill='#1f2937'
          stroke='none'
        />
      )}
      {tonguePath !== undefined && (
        <path
          className={`${styles.mouthOpen} ${styles.mouthTongue}`}
          d={tonguePath}
          fill={palette.accent}
          stroke='none'
        />
      )}
      {fangs !== undefined && (
        <g
          className={`${styles.mouthOpen} ${styles.fangs}`}
          fill='#ffffff'
          stroke={palette.detail}
          strokeWidth='1.4'
        >
          <path d={fangs[0]} />
          <path d={fangs[1]} />
        </g>
      )}
      {droolPath !== undefined && (
        <path
          className={`${styles.mouthOpen} ${styles.drool}`}
          d={droolPath}
          fill='#ffffff'
          stroke={palette.accent}
          strokeWidth='1.2'
          strokeLinecap='round'
        />
      )}
    </g>
  )
}

const renderVariant = (design: MonsterDesign, state: MonsterState): ReactNode => {
  const { palette, features, bodyShape } = design
  const bodyGradientId = `${design.id}-body-gradient`
  const bellyGradientId = `${design.id}-belly-gradient`
  const layers = buildVariantLayers(design, state)
  const compositionTransform = COMPOSITION_TRANSFORMS[bodyShape] ?? COMPOSITION_TRANSFORMS.round

  return (
    <>
      <defs>
        <radialGradient id={bodyGradientId} cx='50%' cy='35%' r='65%'>
          <stop offset='0%' stopColor={palette.secondary} />
          <stop offset='100%' stopColor={palette.primary} />
        </radialGradient>
        <radialGradient id={bellyGradientId} cx='50%' cy='30%' r='70%'>
          <stop offset='0%' stopColor='#ffffff' stopOpacity='0.9' />
          <stop offset='100%' stopColor={palette.secondary} stopOpacity='0.88' />
        </radialGradient>
      </defs>
      <g transform={compositionTransform}>
        {renderStateAccents(palette, state)}
        {renderTail(palette, features.tailShape)}

        <g stroke={palette.detail} strokeWidth='3'>
          <path d={BODY_PATHS[bodyShape]} fill={`url(#${bodyGradientId})`} />
          <path d={BELLY_PATHS[bodyShape]} fill={`url(#${bellyGradientId})`} />
        </g>

        {renderEars(palette, features.earShape)}
        {layers.beforeEyes}
        {renderMarkings(palette, features.markings)}
        {renderArms(palette)}
        {renderLegs(palette)}
        {renderWhiskers(palette, features.whiskers)}
        {renderEyes(palette, state)}
        {renderBrows(palette, state)}
        {renderCheeks(palette)}
        {renderMuzzle(palette, features.muzzle)}
        {layers.afterMuzzle}
        {renderMouth(palette, state)}
        {layers.afterMouth}
      </g>
    </>
  )
}

const renderPixelVariant = (design: MonsterDesign, state: MonsterState): ReactNode => {
  const { palette, features, variant, bodyShape } = design
  const spec = PIXEL_BODY_SPECS[bodyShape] ?? PIXEL_BODY_SPECS.round
  const blocks: ReactNode[] = []

  const addBlock = (
    key: string,
    x: number,
    y: number,
    width = 1,
    height = 1,
    color: string = palette.primary,
    opacity = 1
  ): void => {
    if (width <= 0 || height <= 0) return
    const adjustedX = Math.max(0, x)
    const adjustedY = Math.max(0, y)
    const widthAdjustment = x < 0 ? width + x : width
    const heightAdjustment = y < 0 ? height + y : height
    const finalWidth = Math.max(0, widthAdjustment)
    const finalHeight = Math.max(0, heightAdjustment)
    if (finalWidth === 0 || finalHeight === 0) return
    blocks.push(
      <rect
        key={`${key}-${blocks.length}`}
        x={adjustedX * PIXEL_UNIT}
        y={adjustedY * PIXEL_UNIT}
        width={finalWidth * PIXEL_UNIT}
        height={finalHeight * PIXEL_UNIT}
        fill={color}
        opacity={opacity}
      />
    )
  }

  const centerX = spec.x + Math.floor(spec.width / 2) - 1
  const groundY = PIXEL_GRID_SIZE - 2
  const mouthY = spec.y + spec.height - 4
  const leftEyeX = spec.x + 2
  const rightEyeX = spec.x + spec.width - 3
  const eyeY = spec.y + 3
  const leftEarX = spec.x + 1
  const rightEarX = spec.x + spec.width - 3
  const earBaseY = spec.y - 2

  addBlock('ground-shadow', 3, groundY, PIXEL_GRID_SIZE - 6, 1, palette.detail, 0.1)

  addBlock('body-outline-top', spec.x, spec.y - 1, spec.width, 1, palette.detail, 0.25)
  addBlock('body-outline-left', spec.x - 1, spec.y, 1, spec.height, palette.detail, 0.18)
  addBlock('body-outline-right', spec.x + spec.width, spec.y, 1, spec.height, palette.detail, 0.18)
  addBlock('body-core', spec.x, spec.y, spec.width, spec.height, palette.primary)
  addBlock('body-highlight', spec.x + 1, spec.y + 1, spec.width - 2, 1, palette.secondary, 0.45)

  const bellyHeight = Math.max(2, spec.height - 5)
  addBlock('belly', spec.x + 2, spec.y + spec.height - bellyHeight - 1, Math.max(2, spec.width - 4), bellyHeight, palette.secondary, 0.88)

  addBlock('arm-left', spec.x - 1, spec.y + 4, 1, 3, palette.secondary, 0.95)
  addBlock('arm-right', spec.x + spec.width, spec.y + 4, 1, 3, palette.secondary, 0.95)

  addBlock('leg-left', spec.x + 2, spec.y + spec.height, 1, 2, palette.secondary, 0.95)
  addBlock('leg-right', spec.x + spec.width - 3, spec.y + spec.height, 1, 2, palette.secondary, 0.95)
  addBlock('foot-left', spec.x + 2, spec.y + spec.height + 1, 1, 1, palette.detail, 0.35)
  addBlock('foot-right', spec.x + spec.width - 3, spec.y + spec.height + 1, 1, 1, palette.detail, 0.35)

  switch (features.tailShape) {
    case 'long':
      addBlock('tail-long', spec.x + spec.width, spec.y + 2, 1, spec.height, palette.detail, 0.7)
      addBlock('tail-tip', spec.x + spec.width + 1, spec.y + 1, 1, 2, palette.accent, 0.7)
      break
    case 'short':
      addBlock('tail-short', spec.x + spec.width, spec.y + spec.height - 3, 1, 2, palette.detail, 0.6)
      break
    case 'puff':
      addBlock('tail-puff-base', spec.x + spec.width, spec.y + spec.height - 3, 1, 2, palette.secondary, 0.85)
      addBlock('tail-puff-highlight', spec.x + spec.width + 1, spec.y + spec.height - 4, 1, 1, palette.secondary, 0.65)
      break
    case 'none':
    default:
      break
  }

  if (features.markings === 'mask') {
    addBlock('marking-mask', spec.x + 1, eyeY, spec.width - 2, 2, palette.detail, 0.45)
  } else if (features.markings === 'patch') {
    addBlock('marking-patch', spec.x + spec.width - 3, spec.y + spec.height - 4, 2, 2, palette.accent, 0.48)
  }

  if (variant === 'panda') {
    addBlock('panda-patch-left', spec.x + 1, eyeY - 1, 3, 3, palette.detail, 0.78)
    addBlock('panda-patch-right', spec.x + spec.width - 4, eyeY - 1, 3, 3, palette.detail, 0.78)
  }

  switch (features.earShape) {
    case 'pointy': {
      const tipY = Math.max(0, earBaseY - 1)
      addBlock('ear-left-base', leftEarX, earBaseY, 2, 2)
      addBlock('ear-right-base', rightEarX, earBaseY, 2, 2)
      addBlock('ear-left-tip', leftEarX + 1, tipY, 1, 1, palette.detail, 0.7)
      addBlock('ear-right-tip', rightEarX + 1, tipY, 1, 1, palette.detail, 0.7)
      break
    }
    case 'long': {
      const top = Math.max(0, earBaseY - 2)
      const height = earBaseY - top + 2
      addBlock('ear-left-long', leftEarX, top, 2, height)
      addBlock('ear-right-long', rightEarX, top, 2, height)
      addBlock('ear-left-inner', leftEarX + 1, top + 1, 1, Math.max(1, height - 1), palette.accent, 0.55)
      addBlock('ear-right-inner', rightEarX + 1, top + 1, 1, Math.max(1, height - 1), palette.accent, 0.55)
      break
    }
    case 'droopy':
      addBlock('ear-left-droop', spec.x - 1, spec.y + 1, 1, 3)
      addBlock('ear-right-droop', spec.x + spec.width, spec.y + 1, 1, 3)
      addBlock('ear-left-tip', spec.x - 1, spec.y + 4, 1, 1, palette.detail, 0.6)
      addBlock('ear-right-tip', spec.x + spec.width, spec.y + 4, 1, 1, palette.detail, 0.6)
      break
    case 'round':
    default:
      addBlock('ear-left-round', leftEarX, earBaseY + 1, 2, 1)
      addBlock('ear-right-round', rightEarX, earBaseY + 1, 2, 1)
      break
  }

  if (variant === 'cat') {
    addBlock('ear-left-inner-accent', leftEarX + 1, Math.max(0, earBaseY), 1, 1, palette.accent, 0.6)
    addBlock('ear-right-inner-accent', rightEarX + 1, Math.max(0, earBaseY), 1, 1, palette.accent, 0.6)
  }

  if (variant === 'panda') {
    addBlock('ear-left-overlay', leftEarX, earBaseY, 2, 2, palette.detail, 0.85)
    addBlock('ear-right-overlay', rightEarX, earBaseY, 2, 2, palette.detail, 0.85)
  }

  if (features.whiskers) {
    const whiskerY = mouthY - 1
    addBlock('whisker-left-top', spec.x - 2, whiskerY, 1, 1, palette.detail, 0.6)
    addBlock('whisker-left-bottom', spec.x - 2, whiskerY + 1, 1, 1, palette.detail, 0.6)
    addBlock('whisker-right-top', spec.x + spec.width + 1, whiskerY, 1, 1, palette.detail, 0.6)
    addBlock('whisker-right-bottom', spec.x + spec.width + 1, whiskerY + 1, 1, 1, palette.detail, 0.6)
  }

  const muzzleWidth = features.muzzle === 'flat' ? 4 : features.muzzle === 'medium' ? 3 : 2
  addBlock('muzzle', centerX - Math.floor(muzzleWidth / 2), mouthY - 1, muzzleWidth, 1, palette.secondary, 0.9)
  addBlock('nose', centerX, mouthY - 2, 2, 1, palette.detail)

  if (variant === 'dog') {
    addBlock('muzzle-shadow', centerX - Math.floor(muzzleWidth / 2), mouthY, muzzleWidth, 1, palette.detail, 0.15)
    addBlock('collar', spec.x + 1, spec.y + spec.height - 2, spec.width - 2, 1, palette.accent, 0.4)
  }

  if (variant === 'rabbit') {
    addBlock('tooth-left', centerX, mouthY + 1, 1, 1, '#ffffff', 0.95)
    addBlock('tooth-right', centerX + 1, mouthY + 1, 1, 1, '#ffffff', 0.95)
  }

  if (variant === 'cat') {
    addBlock('tail-tip', spec.x + spec.width + 1, spec.y + spec.height - 3, 1, 1, palette.accent, 0.55)
  }

  if (variant === 'panda') {
    addBlock('belly-rim', spec.x + 2, spec.y + spec.height - bellyHeight - 2, Math.max(2, spec.width - 4), 1, palette.detail, 0.18)
  }

  if (features.markings === 'mask' || variant === 'panda') {
    addBlock('mask-highlight', spec.x + 2, eyeY, spec.width - 4, 1, palette.secondary, 0.2)
  }

  switch (state) {
    case 'sleepy':
      addBlock('eye-left-sleepy', leftEyeX, eyeY + 1, 2, 1, '#1f2937')
      addBlock('eye-right-sleepy', rightEyeX - 1, eyeY + 1, 2, 1, '#1f2937')
      addBlock('sleepy-bubble', spec.x + spec.width, spec.y, 1, 1, palette.accent, 0.4)
      addBlock('sleepy-bubble-2', spec.x + spec.width + 1, spec.y - 1, 1, 1, palette.accent, 0.3)
      break
    case 'angry':
      addBlock('eye-left-angry', leftEyeX, eyeY, 1, 2, '#1f2937')
      addBlock('eye-right-angry', rightEyeX, eyeY, 1, 2, '#1f2937')
      addBlock('brow-left-angry', leftEyeX - 1, eyeY - 1, 3, 1, palette.detail, 0.85)
      addBlock('brow-right-angry', rightEyeX - 1, eyeY - 1, 3, 1, palette.detail, 0.85)
      addBlock('anger-spark-left', spec.x - 2, spec.y + 1, 1, 1, palette.accent, 0.55)
      addBlock('anger-spark-right', spec.x + spec.width + 1, spec.y + 2, 1, 1, palette.accent, 0.55)
      break
    default:
      addBlock('eye-left-default', leftEyeX, eyeY, 1, 2, '#1f2937')
      addBlock('eye-right-default', rightEyeX, eyeY, 1, 2, '#1f2937')
      addBlock('eye-left-highlight', leftEyeX, eyeY, 1, 1, '#f8fafc', 0.75)
      addBlock('eye-right-highlight', rightEyeX, eyeY, 1, 1, '#f8fafc', 0.75)
      break
  }

  if (state === 'sad') {
    addBlock('tear-left', leftEyeX, eyeY + 2, 1, 2, palette.accent, 0.7)
    addBlock('tear-right', rightEyeX, eyeY + 2, 1, 2, palette.accent, 0.55)
  }

  switch (state) {
    case 'happy':
      addBlock('mouth-happy', centerX, mouthY, 2, 1, palette.detail)
      break
    case 'sad':
      addBlock('mouth-sad-left', centerX, mouthY, 1, 1, palette.detail)
      addBlock('mouth-sad-right', centerX + 1, mouthY + 1, 1, 1, palette.detail)
      break
    case 'angry':
      addBlock('mouth-angry', centerX - 1, mouthY, 4, 1, palette.detail)
      addBlock('fang-left', centerX, mouthY + 1, 1, 1, '#ffffff')
      addBlock('fang-right', centerX + 1, mouthY + 1, 1, 1, '#ffffff')
      break
    case 'hungry':
      addBlock('mouth-hungry', centerX - 1, mouthY, 4, 2, '#1f2937')
      addBlock('tongue', centerX, mouthY + 1, 2, 1, palette.accent)
      addBlock('snack-spark', spec.x + spec.width + 1, spec.y + spec.height - 2, 1, 1, palette.accent, 0.8)
      break
    case 'sleepy':
      addBlock('mouth-sleepy', centerX, mouthY, 2, 1, palette.detail, 0.6)
      break
    default:
      break
  }

  const cheekY = spec.y + spec.height - 4
  addBlock('cheek-left', spec.x + 1, cheekY, 2, 1, palette.cheeks, 0.85)
  addBlock('cheek-right', spec.x + spec.width - 3, cheekY, 2, 1, palette.cheeks, 0.85)

  if (state === 'sleepy') {
    addBlock('sleepy-glow', spec.x + spec.width - 1, spec.y + spec.height - bellyHeight - 3, 1, 1, palette.accent, 0.22)
  }

  return blocks
}

function MonsterPreview ({ design, state, width = DEFAULT_DIMENSION, height = DEFAULT_DIMENSION }: MonsterPreviewProps): ReactNode {
  const palette = useMemo(() => design?.palette ?? FALLBACK_PALETTE, [design])
  const stateBadgeClass = STATE_BADGE_CLASS[state]
  const isPixelStyle = design?.style === 'pixel'

  const wrapperStyle = useMemo<CSSProperties>(() => ({
    width,
    height,
    '--preview-base': palette.background,
    '--preview-accent': palette.accent,
    '--preview-shadow': palette.detail
  }), [height, palette, width])

  const animationClass = design !== null ? styles[design.animations[state].svgClassName] ?? '' : ''
  const svgClassName = design !== null && isPixelStyle
    ? `${styles.svgBase} ${styles.pixelSvg} ${animationClass}`
    : `${styles.svgBase} ${animationClass}`

  const monsterVisual = design !== null
    ? (
      <svg
        key={`${design.id}-${design.style}`}
        viewBox={isPixelStyle ? `0 0 ${PIXEL_CANVAS} ${PIXEL_CANVAS}` : '0 0 200 200'}
        className={svgClassName}
        role='img'
        aria-label='Aperçu du monstre généré'
        {...(isPixelStyle ? { shapeRendering: 'crispEdges' as const } : {})}
      >
        {isPixelStyle
          ? (
            <>
              <rect width={PIXEL_CANVAS} height={PIXEL_CANVAS} fill={palette.background} />
              {renderPixelVariant(design, state)}
            </>
            )
          : renderVariant(design, state)}
      </svg>
      )
    : (
      <div className={styles.placeholder}>
        <div className={styles.placeholderEmoji}>✨</div>
        <div className={styles.placeholderText}>Générez votre créature pour la voir prendre vie.</div>
      </div>
      )

  return (
    <div className={styles.wrapper} style={wrapperStyle}>
      <div className={styles.svgContainer}>
        {monsterVisual}
        {design !== null && (
          <div className={`${styles.stateBadge} ${stateBadgeClass}`} aria-hidden='true'>
            {STATE_EMOJI[state]}
          </div>
        )}
      </div>
    </div>
  )
}

export default MonsterPreview
