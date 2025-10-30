'use client'

import { useEffect, useRef } from 'react'
import type { OwnedAccessory } from '@/types/accessory'

type MonsterState = 'happy' | 'sad' | 'hungry' | 'sleepy' | 'angry'
type MonsterAction = 'feed' | 'comfort' | 'hug' | 'wake' | null

export type MonsterStyle = 'round' | 'square' | 'tall' | 'wide'
export type EyeStyle = 'big' | 'small' | 'star' | 'sleepy'
export type AntennaStyle = 'single' | 'double' | 'curly' | 'none'
export type AccessoryStyle = 'horns' | 'ears' | 'tail' | 'none'

export interface MonsterTraits {
  bodyColor: string
  accentColor: string
  eyeColor: string
  antennaColor: string
  bobbleColor: string
  cheekColor: string
  bodyStyle: MonsterStyle
  eyeStyle: EyeStyle
  antennaStyle: AntennaStyle
  accessory: AccessoryStyle
}

interface PixelMonsterProps {
  state: MonsterState
  traits?: MonsterTraits
  level?: number
  currentAction?: MonsterAction
  equippedAccessories?: OwnedAccessory[]
}

const defaultTraits: MonsterTraits = {
  bodyColor: '#FFB5E8',
  accentColor: '#FF9CEE',
  eyeColor: '#2C2C2C',
  antennaColor: '#FFE66D',
  bobbleColor: '#FFE66D',
  cheekColor: '#FFB5D5',
  bodyStyle: 'round',
  eyeStyle: 'big',
  antennaStyle: 'single',
  accessory: 'none'
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  emoji: string
  size: number
  rotation: number
  rotationSpeed: number
}

export function PixelMonster ({
  state,
  traits = defaultTraits,
  level = 1,
  currentAction = null,
  equippedAccessories = []
}: PixelMonsterProps): React.ReactNode {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)
  const actionFrameRef = useRef(0)
  const particlesRef = useRef<Particle[]>([])
  const currentActionRef = useRef<MonsterAction>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas == null) return

    const ctx = canvas.getContext('2d')
    if (ctx == null) return

    canvas.width = 160
    canvas.height = 160

    let animationId: number

    const animate = (): void => {
      frameRef.current += 1

      if (currentActionRef.current !== null) {
        actionFrameRef.current += 1
        if (actionFrameRef.current > 150) { // ~2.5 secondes à 60fps
          currentActionRef.current = null
          actionFrameRef.current = 0
          particlesRef.current = []
        }
      }

      drawMonster(ctx, state, frameRef.current, traits, level, currentActionRef.current, actionFrameRef.current, particlesRef.current, equippedAccessories)
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationId !== undefined) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [state, traits, level, equippedAccessories])

  useEffect(() => {
    if (currentAction !== null && currentAction !== currentActionRef.current) {
      currentActionRef.current = currentAction
      actionFrameRef.current = 0
      particlesRef.current = createParticles(currentAction)
    }
  }, [currentAction])

  return <canvas ref={canvasRef} className='pixel-art w-full h-full mx-auto' style={{ imageRendering: 'pixelated' }} />
}

function createParticles (action: MonsterAction): Particle[] {
  const particles: Particle[] = []
  const centerX = 80
  const centerY = 80

  const emojis = {
    feed: ['🍎', '✨', '🍏', '⭐', '🍎', '✨'],
    comfort: ['💙', '💜', '💚', '🩵', '💛', '💙'],
    hug: ['💖', '💕', '💗', '💓', '💝', '💞'],
    wake: ['⭐', '✨', '💫', '🌟', '⚡', '✨']
  }

  const particleEmojis = action !== null ? emojis[action] : []
  const count = particleEmojis.length

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count
    const speed = 1.5 + Math.random() * 1
    particles.push({
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0,
      maxLife: 100 + Math.random() * 50,
      emoji: particleEmojis[i],
      size: 12 + Math.random() * 8,
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 0.3
    })
  }

  return particles
}

function drawMonster (
  ctx: CanvasRenderingContext2D,
  state: MonsterState,
  frame: number,
  traits: MonsterTraits,
  level: number,
  currentAction: MonsterAction,
  actionFrame: number,
  particles: Particle[],
  equippedAccessories: OwnedAccessory[]
): void {
  const pixelSize = 6
  const bounce = Math.sin(frame * 0.05) * 3
  let offsetX = 0
  let offsetY = 0
  let rotation = 0
  let scale = 1

  ctx.clearRect(0, 0, 160, 160)

  // Animations selon l'action
  if (currentAction !== null && actionFrame < 150) {
    const progress = actionFrame / 150

    switch (currentAction) {
      case 'feed': {
        // Sauts joyeux multiples
        const jumpCycle = (actionFrame % 30) / 30
        if (jumpCycle < 0.5) {
          offsetY = -Math.sin(jumpCycle * Math.PI * 2) * 25
          scale = 1 + Math.sin(jumpCycle * Math.PI * 2) * 0.1
        }
        break
      }
      case 'comfort': {
        // Balancement doux
        offsetX = Math.sin(actionFrame * 0.08) * 10
        rotation = Math.sin(actionFrame * 0.08) * 0.1
        break
      }
      case 'hug': {
        // Rotation excitée avec agrandissement
        rotation = Math.sin(actionFrame * 0.15) * 0.3
        scale = 1 + Math.sin(actionFrame * 0.1) * 0.15
        offsetY = Math.sin(actionFrame * 0.2) * 5
        break
      }
      case 'wake': {
        // Secousses intenses
        offsetX = Math.sin(actionFrame * 0.5) * (5 - progress * 5)
        offsetY = Math.cos(actionFrame * 0.7) * (5 - progress * 5)
        rotation = Math.sin(actionFrame * 0.6) * (0.15 - progress * 0.15)
        break
      }
    }
  }

  ctx.save()
  ctx.translate(80, 80)
  ctx.rotate(rotation)
  ctx.scale(scale, scale)
  ctx.translate(-80 + offsetX, -80 + offsetY)

  let bodyColor = traits.bodyColor
  let accentColor = traits.accentColor

  if (state === 'sad') {
    bodyColor = adjustColorBrightness(traits.bodyColor, -20)
    accentColor = adjustColorBrightness(traits.accentColor, -20)
  }
  if (state === 'hungry') {
    bodyColor = adjustColorBrightness(traits.bodyColor, 10)
    accentColor = adjustColorBrightness(traits.accentColor, 10)
  }
  if (state === 'sleepy') {
    bodyColor = adjustColorBrightness(traits.bodyColor, -10)
    accentColor = adjustColorBrightness(traits.accentColor, -10)
  }
  if (state === 'angry') {
    bodyColor = adjustColorBrightness(traits.bodyColor, 15)
    accentColor = adjustColorBrightness(traits.accentColor, 15)
  }

  let extraBounce = 0
  if (state === 'happy') {
    extraBounce = Math.abs(Math.sin(frame * 0.2)) * -8
  }

  const bodyY = 55 + bounce + extraBounce

  drawBody(ctx, traits.bodyStyle, bodyColor, accentColor, bodyY, pixelSize)

  drawEyes(ctx, traits.eyeStyle, traits.eyeColor, state, bodyY, pixelSize, frame)

  drawMouth(ctx, state, traits.eyeColor, traits.cheekColor, bodyY, pixelSize, frame)

  const armWave = Math.sin(frame * 0.1) * 5
  ctx.fillStyle = bodyColor
  ctx.fillRect(33, bodyY + 30 + armWave, pixelSize, pixelSize * 3)
  ctx.fillRect(27, bodyY + 33 + armWave, pixelSize, pixelSize * 2)

  ctx.fillRect(123, bodyY + 30 - armWave, pixelSize, pixelSize * 3)
  ctx.fillRect(129, bodyY + 33 - armWave, pixelSize, pixelSize * 2)

  ctx.fillRect(57, bodyY + 54, pixelSize * 3, pixelSize * 2)
  ctx.fillRect(105, bodyY + 54, pixelSize * 3, pixelSize * 2)

  drawAntenna(ctx, traits.antennaStyle, traits.antennaColor, traits.bobbleColor, bodyY, pixelSize, frame)

  drawAccessory(ctx, traits.accessory, traits.accentColor, bodyY, pixelSize, frame)

  // Dessiner les accessoires achetés équipés
  drawEquippedAccessories(ctx, equippedAccessories, bodyY, pixelSize, frame)

  drawStateEffects(ctx, state, bodyY, pixelSize, frame)

  ctx.restore()

  // Dessiner les particules
  if (currentAction !== null && particles.length > 0) {
    drawParticles(ctx, particles, actionFrame)
  }

  // Dessiner effet de fond lumineux
  if (currentAction !== null && actionFrame < 150) {
    drawActionBackground(ctx, currentAction, actionFrame)
  }
}

function drawParticles (ctx: CanvasRenderingContext2D, particles: Particle[], actionFrame: number): void {
  particles.forEach(particle => {
    particle.life = actionFrame
    if (particle.life >= particle.maxLife) return

    const progress = particle.life / particle.maxLife
    const alpha = 1 - progress

    particle.x += particle.vx
    particle.y += particle.vy
    particle.rotation += particle.rotationSpeed

    ctx.save()
    ctx.translate(particle.x, particle.y)
    ctx.rotate(particle.rotation)
    ctx.globalAlpha = alpha
    ctx.font = `${particle.size * (1 + progress * 0.5)}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(particle.emoji, 0, 0)
    ctx.restore()
  })
}

function drawActionBackground (ctx: CanvasRenderingContext2D, action: MonsterAction, actionFrame: number): void {
  if (action === null) return

  const centerX = 80
  const centerY = 80

  const colors = {
    feed: ['rgba(247, 83, 60, 0.3)', 'rgba(247, 83, 60, 0)'],
    comfort: ['rgba(70, 144, 134, 0.3)', 'rgba(70, 144, 134, 0)'],
    hug: ['rgba(143, 114, 224, 0.4)', 'rgba(143, 114, 224, 0)'],
    wake: ['rgba(255, 230, 109, 0.4)', 'rgba(255, 230, 109, 0)']
  }

  const colorSet = colors[action]
  const pulseScale = 1 + Math.sin(actionFrame * 0.15) * 0.2

  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 60 * pulseScale)
  gradient.addColorStop(0, colorSet[0])
  gradient.addColorStop(1, colorSet[1])

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 160, 160)

  // Cercle expansif
  if (actionFrame < 50) {
    const rippleProgress = actionFrame / 50
    const rippleRadius = 30 + rippleProgress * 50
    const rippleAlpha = 0.5 * (1 - rippleProgress)

    ctx.strokeStyle = `rgba(247, 83, 60, ${rippleAlpha})`
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(centerX, centerY, rippleRadius, 0, Math.PI * 2)
    ctx.stroke()
  }
}

function drawBody (
  ctx: CanvasRenderingContext2D,
  style: MonsterStyle,
  bodyColor: string,
  accentColor: string,
  bodyY: number,
  pixelSize: number
): void {
  ctx.fillStyle = accentColor

  switch (style) {
    case 'round':
      for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 11; x++) {
          if (
            (y === 0 && x >= 3 && x <= 7) ||
            (y === 1 && x >= 2 && x <= 8) ||
            (y >= 2 && y <= 7 && x >= 1 && x <= 9) ||
            (y === 8 && x >= 2 && x <= 8)
          ) {
            ctx.fillRect(45 + x * pixelSize, bodyY + y * pixelSize, pixelSize, pixelSize)
          }
        }
      }
      ctx.fillStyle = bodyColor
      for (let y = 1; y < 8; y++) {
        for (let x = 2; x < 9; x++) {
          if (y >= 2 && y <= 6) {
            ctx.fillRect(45 + x * pixelSize, bodyY + y * pixelSize, pixelSize, pixelSize)
          } else if (y === 1 && x >= 3 && x <= 7) {
            ctx.fillRect(45 + x * pixelSize, bodyY + y * pixelSize, pixelSize, pixelSize)
          } else if (y === 7 && x >= 3 && x <= 7) {
            ctx.fillRect(45 + x * pixelSize, bodyY + y * pixelSize, pixelSize, pixelSize)
          }
        }
      }
      break

    case 'square':
      for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 11; x++) {
          if (x >= 1 && x <= 9) {
            ctx.fillRect(45 + x * pixelSize, bodyY + y * pixelSize, pixelSize, pixelSize)
          }
        }
      }
      ctx.fillStyle = bodyColor
      for (let y = 1; y < 8; y++) {
        for (let x = 2; x < 9; x++) {
          ctx.fillRect(45 + x * pixelSize, bodyY + y * pixelSize, pixelSize, pixelSize)
        }
      }
      break

    case 'tall':
      for (let y = 0; y < 11; y++) {
        for (let x = 0; x < 9; x++) {
          if (
            (y === 0 && x >= 2 && x <= 6) ||
            (y === 1 && x >= 1 && x <= 7) ||
            (y >= 2 && y <= 9 && x >= 1 && x <= 7) ||
            (y === 10 && x >= 2 && x <= 6)
          ) {
            ctx.fillRect(51 + x * pixelSize, bodyY - 12 + y * pixelSize, pixelSize, pixelSize)
          }
        }
      }
      ctx.fillStyle = bodyColor
      for (let y = 1; y < 10; y++) {
        for (let x = 2; x < 7; x++) {
          if (y >= 2 && y <= 8) {
            ctx.fillRect(51 + x * pixelSize, bodyY - 12 + y * pixelSize, pixelSize, pixelSize)
          } else if (y === 1 && x >= 3 && x <= 5) {
            ctx.fillRect(51 + x * pixelSize, bodyY - 12 + y * pixelSize, pixelSize, pixelSize)
          } else if (y === 9 && x >= 3 && x <= 5) {
            ctx.fillRect(51 + x * pixelSize, bodyY - 12 + y * pixelSize, pixelSize, pixelSize)
          }
        }
      }
      break

    case 'wide':
      for (let y = 0; y < 7; y++) {
        for (let x = 0; x < 13; x++) {
          if (
            (y === 0 && x >= 3 && x <= 9) ||
            (y === 1 && x >= 2 && x <= 10) ||
            (y >= 2 && y <= 5 && x >= 1 && x <= 11) ||
            (y === 6 && x >= 2 && x <= 10)
          ) {
            ctx.fillRect(39 + x * pixelSize, bodyY + 6 + y * pixelSize, pixelSize, pixelSize)
          }
        }
      }
      ctx.fillStyle = bodyColor
      for (let y = 1; y < 6; y++) {
        for (let x = 2; x < 11; x++) {
          if (y >= 2 && y <= 4) {
            ctx.fillRect(39 + x * pixelSize, bodyY + 6 + y * pixelSize, pixelSize, pixelSize)
          } else if (y === 1 && x >= 3 && x <= 9) {
            ctx.fillRect(39 + x * pixelSize, bodyY + 6 + y * pixelSize, pixelSize, pixelSize)
          } else if (y === 5 && x >= 3 && x <= 9) {
            ctx.fillRect(39 + x * pixelSize, bodyY + 6 + y * pixelSize, pixelSize, pixelSize)
          }
        }
      }
      break
  }
}

function drawEyes (
  ctx: CanvasRenderingContext2D,
  style: EyeStyle,
  eyeColor: string,
  state: MonsterState,
  bodyY: number,
  pixelSize: number,
  frame: number
): void {
  ctx.fillStyle = eyeColor

  if (state === 'sleepy') {
    ctx.fillRect(63, bodyY + 24, pixelSize * 2, pixelSize)
    ctx.fillRect(93, bodyY + 24, pixelSize * 2, pixelSize)
    return
  }

  const eyeBlink = Math.floor(frame / 80) % 12 === 0

  if (eyeBlink) {
    ctx.fillRect(63, bodyY + 24, pixelSize * 2, pixelSize)
    ctx.fillRect(93, bodyY + 24, pixelSize * 2, pixelSize)
    return
  }

  switch (style) {
    case 'big':
      ctx.fillRect(63, bodyY + 21, pixelSize * 2, pixelSize * 2)
      ctx.fillRect(93, bodyY + 21, pixelSize * 2, pixelSize * 2)
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(66, bodyY + 21, pixelSize, pixelSize)
      ctx.fillRect(96, bodyY + 21, pixelSize, pixelSize)
      ctx.fillRect(69, bodyY + 24, pixelSize / 2, pixelSize / 2)
      ctx.fillRect(99, bodyY + 24, pixelSize / 2, pixelSize / 2)
      break

    case 'small':
      ctx.fillRect(66, bodyY + 24, pixelSize, pixelSize)
      ctx.fillRect(96, bodyY + 24, pixelSize, pixelSize)
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(66, bodyY + 24, pixelSize / 2, pixelSize / 2)
      ctx.fillRect(96, bodyY + 24, pixelSize / 2, pixelSize / 2)
      break

    case 'star':
      ctx.fillRect(66, bodyY + 21, pixelSize, pixelSize * 2)
      ctx.fillRect(63, bodyY + 24, pixelSize * 2, pixelSize)
      ctx.fillRect(96, bodyY + 21, pixelSize, pixelSize * 2)
      ctx.fillRect(93, bodyY + 24, pixelSize * 2, pixelSize)
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(66, bodyY + 24, pixelSize / 2, pixelSize / 2)
      ctx.fillRect(96, bodyY + 24, pixelSize / 2, pixelSize / 2)
      break

    case 'sleepy':
      ctx.fillRect(63, bodyY + 24, pixelSize * 2, pixelSize)
      ctx.fillRect(93, bodyY + 24, pixelSize * 2, pixelSize)
      ctx.fillRect(63, bodyY + 21, pixelSize * 2, pixelSize / 2)
      ctx.fillRect(93, bodyY + 21, pixelSize * 2, pixelSize / 2)
      break
  }
}

function drawMouth (
  ctx: CanvasRenderingContext2D,
  state: MonsterState,
  eyeColor: string,
  cheekColor: string,
  bodyY: number,
  pixelSize: number,
  frame: number
): void {
  ctx.fillStyle = eyeColor

  if (state === 'happy') {
    ctx.fillRect(75, bodyY + 42, pixelSize * 3, pixelSize)
    ctx.fillRect(69, bodyY + 39, pixelSize, pixelSize)
    ctx.fillRect(105, bodyY + 39, pixelSize, pixelSize)

    ctx.fillStyle = cheekColor
    ctx.fillRect(57, bodyY + 36, pixelSize * 2, pixelSize)
    ctx.fillRect(111, bodyY + 36, pixelSize * 2, pixelSize)
  } else if (state === 'sad') {
    ctx.fillRect(75, bodyY + 39, pixelSize * 3, pixelSize)
    ctx.fillRect(69, bodyY + 42, pixelSize, pixelSize)
    ctx.fillRect(105, bodyY + 42, pixelSize, pixelSize)
  } else if (state === 'hungry') {
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 4; x++) {
        if ((y === 0 && x >= 1 && x <= 2) || y === 1 || (y === 2 && x >= 1 && x <= 2)) {
          ctx.fillRect(75 + x * pixelSize, bodyY + 36 + y * pixelSize, pixelSize, pixelSize)
        }
      }
    }
  } else if (state === 'sleepy') {
    ctx.fillRect(78, bodyY + 42, pixelSize * 2, pixelSize)
  } else if (state === 'angry') {
    ctx.fillRect(72, bodyY + 42, pixelSize * 4, pixelSize)
  }
}

function drawAntenna (
  ctx: CanvasRenderingContext2D,
  style: AntennaStyle,
  antennaColor: string,
  bobbleColor: string,
  bodyY: number,
  pixelSize: number,
  frame: number
): void {
  const bobbleY = bodyY - 18 + Math.sin(frame * 0.08) * 3

  switch (style) {
    case 'single':
      ctx.fillStyle = antennaColor
      ctx.fillRect(75, bodyY - 6, pixelSize, pixelSize * 3)
      ctx.fillStyle = bobbleColor
      ctx.fillRect(72, bobbleY, pixelSize * 3, pixelSize * 3)
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(75, bobbleY + 3, pixelSize, pixelSize)
      break

    case 'double':
      ctx.fillStyle = antennaColor
      ctx.fillRect(63, bodyY - 6, pixelSize, pixelSize * 3)
      ctx.fillRect(87, bodyY - 12, pixelSize, pixelSize * 3)
      ctx.fillStyle = bobbleColor
      ctx.fillRect(63, bobbleY, pixelSize * 3, pixelSize * 3)
      ctx.fillRect(81, bobbleY, pixelSize * 3, pixelSize * 3)
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(66, bobbleY + 3, pixelSize, pixelSize)
      ctx.fillRect(84, bobbleY + 3, pixelSize, pixelSize)
      break

    case 'curly': {
      ctx.fillStyle = antennaColor
      const curvePoints = [
        { x: 78, y: bodyY - 12 },
        { x: 84, y: bodyY - 15 },
        { x: 84, y: bodyY - 21 },
        { x: 78, y: bodyY - 24 }
      ]
      curvePoints.forEach((point) => {
        ctx.fillRect(point.x, point.y, pixelSize, pixelSize)
      })
      ctx.fillStyle = bobbleColor
      ctx.fillRect(72, bobbleY, pixelSize * 3, pixelSize * 3)
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(75, bobbleY + 3, pixelSize, pixelSize)
      break
    }

    case 'none':
      break
  }
}

function drawAccessory (
  ctx: CanvasRenderingContext2D,
  accessory: AccessoryStyle,
  accentColor: string,
  bodyY: number,
  pixelSize: number,
  frame: number
): void {
  ctx.fillStyle = accentColor

  switch (accessory) {
    case 'horns':
      ctx.fillRect(51, bodyY - 6, pixelSize, pixelSize * 2)
      ctx.fillRect(45, bodyY - 12, pixelSize, pixelSize * 2)
      ctx.fillRect(105, bodyY - 6, pixelSize, pixelSize * 2)
      ctx.fillRect(111, bodyY - 12, pixelSize, pixelSize * 2)
      break

    case 'ears':
      ctx.fillRect(51, bodyY, pixelSize * 2, pixelSize)
      ctx.fillRect(51, bodyY - 6, pixelSize, pixelSize * 2)
      ctx.fillRect(105, bodyY, pixelSize * 2, pixelSize)
      ctx.fillRect(111, bodyY - 6, pixelSize, pixelSize * 2)
      break

    case 'tail': {
      const tailWag = Math.sin(frame * 0.12) * 4
      ctx.fillRect(126, bodyY + 42 + tailWag, pixelSize, pixelSize * 3)
      ctx.fillRect(132, bodyY + 48 + tailWag, pixelSize, pixelSize * 2)
      break
    }

    case 'none':
      break
  }
}

/**
 * Dessine les accessoires achetés équipés sur le monstre
 */
function drawEquippedAccessories (
  ctx: CanvasRenderingContext2D,
  equippedAccessories: OwnedAccessory[],
  bodyY: number,
  pixelSize: number,
  frame: number
): void {
  if (equippedAccessories.length === 0) return

  equippedAccessories.forEach(ownedAccessory => {
    const { accessoryId } = ownedAccessory

    // Dessiner selon le type d'accessoire
    if (accessoryId.startsWith('hat-')) {
      drawPurchasedHat(ctx, accessoryId, bodyY, pixelSize, frame)
    } else if (accessoryId.startsWith('glasses-')) {
      drawPurchasedGlasses(ctx, accessoryId, bodyY, pixelSize)
    } else if (accessoryId.startsWith('shoes-')) {
      drawPurchasedShoes(ctx, accessoryId, bodyY, pixelSize)
    } else if (accessoryId.startsWith('effect-')) {
      drawPurchasedEffect(ctx, accessoryId, bodyY, pixelSize, frame)
    } else if (accessoryId.startsWith('bg-')) {
      drawPurchasedBackground(ctx, accessoryId, frame)
    }
  })
}

/**
 * Dessine un chapeau acheté sur le monstre
 */
function drawPurchasedHat (
  ctx: CanvasRenderingContext2D,
  hatId: string,
  bodyY: number,
  pixelSize: number,
  frame: number
): void {
  const hatBounce = Math.sin(frame * 0.05) * 1

  switch (hatId) {
    case 'hat-party': {
      // Chapeau de fête - cône coloré
      ctx.fillStyle = '#FF6B9D'
      const points = [
        [75, bodyY - 18 + hatBounce],
        [69, bodyY - 6 + hatBounce],
        [81, bodyY - 6 + hatBounce]
      ]
      ctx.beginPath()
      ctx.moveTo(points[0][0], points[0][1])
      ctx.lineTo(points[1][0], points[1][1])
      ctx.lineTo(points[2][0], points[2][1])
      ctx.closePath()
      ctx.fill()
      // Pompon
      ctx.fillStyle = '#FFD700'
      ctx.fillRect(72, bodyY - 21 + hatBounce, pixelSize * 2, pixelSize * 2)
      break
    }
    case 'hat-crown': {
      // Couronne royale
      ctx.fillStyle = '#FFD700'
      ctx.fillRect(60, bodyY - 12 + hatBounce, pixelSize * 7, pixelSize)
      ctx.fillRect(63, bodyY - 15 + hatBounce, pixelSize, pixelSize * 2)
      ctx.fillRect(69, bodyY - 18 + hatBounce, pixelSize, pixelSize * 3)
      ctx.fillRect(75, bodyY - 15 + hatBounce, pixelSize, pixelSize * 2)
      ctx.fillRect(81, bodyY - 18 + hatBounce, pixelSize, pixelSize * 3)
      ctx.fillRect(87, bodyY - 15 + hatBounce, pixelSize, pixelSize * 2)
      // Gemmes
      ctx.fillStyle = '#FF1493'
      ctx.fillRect(69, bodyY - 15 + hatBounce, pixelSize, pixelSize)
      ctx.fillRect(81, bodyY - 15 + hatBounce, pixelSize, pixelSize)
      break
    }
    case 'hat-wizard': {
      // Chapeau de sorcier
      ctx.fillStyle = '#6B4C9A'
      const wizPoints = [
        [75, bodyY - 24 + hatBounce],
        [63, bodyY - 6 + hatBounce],
        [87, bodyY - 6 + hatBounce]
      ]
      ctx.beginPath()
      ctx.moveTo(wizPoints[0][0], wizPoints[0][1])
      ctx.lineTo(wizPoints[1][0], wizPoints[1][1])
      ctx.lineTo(wizPoints[2][0], wizPoints[2][1])
      ctx.closePath()
      ctx.fill()
      // Bord du chapeau
      ctx.fillRect(57, bodyY - 9 + hatBounce, pixelSize * 6, pixelSize)
      // Étoiles magiques
      ctx.fillStyle = '#FFD700'
      ctx.font = '12px Arial'
      ctx.fillText('✨', 72, bodyY - 15 + hatBounce)
      break
    }
  }
}

/**
 * Dessine des lunettes achetées sur le monstre
 */
function drawPurchasedGlasses (
  ctx: CanvasRenderingContext2D,
  glassesId: string,
  bodyY: number,
  pixelSize: number
): void {
  switch (glassesId) {
    case 'glasses-cool': {
      // Lunettes de soleil
      ctx.fillStyle = '#2C2C2C'
      ctx.fillRect(60, bodyY + 21, pixelSize * 3, pixelSize * 2)
      ctx.fillRect(90, bodyY + 21, pixelSize * 3, pixelSize * 2)
      ctx.fillRect(63, bodyY + 22, pixelSize, pixelSize)
      ctx.fillRect(93, bodyY + 22, pixelSize, pixelSize)
      break
    }
    case 'glasses-nerd': {
      // Lunettes de génie
      ctx.strokeStyle = '#2C2C2C'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(66, bodyY + 24, 6, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(96, bodyY + 24, 6, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(72, bodyY + 24)
      ctx.lineTo(90, bodyY + 24)
      ctx.stroke()
      break
    }
  }
}

/**
 * Dessine des chaussures achetées sur le monstre
 */
function drawPurchasedShoes (
  ctx: CanvasRenderingContext2D,
  shoesId: string,
  bodyY: number,
  pixelSize: number
): void {
  switch (shoesId) {
    case 'shoes-sneakers': {
      // Baskets rouges
      // Semelle gauche
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(45, bodyY + 84, pixelSize * 4, pixelSize)
      // Basket gauche (rouge)
      ctx.fillStyle = '#FF4444'
      ctx.fillRect(45, bodyY + 78, pixelSize * 4, pixelSize * 2)
      // Lacets
      ctx.fillStyle = '#2C2C2C'
      ctx.fillRect(48, bodyY + 81, pixelSize / 2, pixelSize / 2)
      ctx.fillRect(54, bodyY + 81, pixelSize / 2, pixelSize / 2)
      // Étoile blanche
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(51, bodyY + 78, pixelSize, pixelSize)

      // Semelle droite
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(111, bodyY + 84, pixelSize * 4, pixelSize)
      // Basket droite (rouge)
      ctx.fillStyle = '#FF4444'
      ctx.fillRect(111, bodyY + 78, pixelSize * 4, pixelSize * 2)
      // Lacets
      ctx.fillStyle = '#2C2C2C'
      ctx.fillRect(114, bodyY + 81, pixelSize / 2, pixelSize / 2)
      ctx.fillRect(120, bodyY + 81, pixelSize / 2, pixelSize / 2)
      // Étoile blanche
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(117, bodyY + 78, pixelSize, pixelSize)
      break
    }
    case 'shoes-boots': {
      // Bottes marron
      // Botte gauche
      ctx.fillStyle = '#8B4513'
      ctx.fillRect(45, bodyY + 66, pixelSize * 4, pixelSize * 6)
      // Semelle épaisse
      ctx.fillStyle = '#2C2C2C'
      ctx.fillRect(45, bodyY + 84, pixelSize * 4, pixelSize * 2)
      // Boucle argentée
      ctx.fillStyle = '#C0C0C0'
      ctx.fillRect(48, bodyY + 75, pixelSize * 2, pixelSize)
      // Reflet sur le cuir
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
      ctx.fillRect(48, bodyY + 69, pixelSize, pixelSize * 2)

      // Botte droite
      ctx.fillStyle = '#8B4513'
      ctx.fillRect(111, bodyY + 66, pixelSize * 4, pixelSize * 6)
      // Semelle épaisse
      ctx.fillStyle = '#2C2C2C'
      ctx.fillRect(111, bodyY + 84, pixelSize * 4, pixelSize * 2)
      // Boucle argentée
      ctx.fillStyle = '#C0C0C0'
      ctx.fillRect(114, bodyY + 75, pixelSize * 2, pixelSize)
      // Reflet sur le cuir
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
      ctx.fillRect(114, bodyY + 69, pixelSize, pixelSize * 2)
      break
    }
  }
}

/**
 * Dessine un effet acheté autour du monstre
 */
function drawPurchasedEffect (
  ctx: CanvasRenderingContext2D,
  effectId: string,
  bodyY: number,
  pixelSize: number,
  frame: number
): void {
  switch (effectId) {
    case 'effect-sparkles': {
      // Paillettes magiques qui tournent autour
      const sparklePositions = [
        { angle: frame * 0.05, radius: 45 },
        { angle: frame * 0.05 + Math.PI / 2, radius: 40 },
        { angle: frame * 0.05 + Math.PI, radius: 45 },
        { angle: frame * 0.05 + Math.PI * 1.5, radius: 40 }
      ]
      ctx.fillStyle = '#FFD700'
      ctx.font = '16px Arial'
      sparklePositions.forEach(pos => {
        const x = 80 + Math.cos(pos.angle) * pos.radius
        const y = bodyY + 30 + Math.sin(pos.angle) * pos.radius
        ctx.fillText('✨', x, y)
      })
      break
    }
    case 'effect-fire': {
      // Aura de feu
      const fireIntensity = Math.sin(frame * 0.1) * 0.3 + 0.7
      ctx.save()
      ctx.globalAlpha = fireIntensity
      ctx.fillStyle = '#FF4500'
      ctx.font = '20px Arial'
      ctx.fillText('🔥', 50, bodyY + 30)
      ctx.fillText('🔥', 100, bodyY + 30)
      ctx.fillText('🔥', 75, bodyY + 15)
      ctx.restore()
      break
    }
  }
}

/**
 * Dessine un arrière-plan acheté
 */
function drawPurchasedBackground (
  ctx: CanvasRenderingContext2D,
  bgId: string,
  frame: number
): void {
  ctx.save()
  ctx.globalAlpha = 0.3

  switch (bgId) {
    case 'bg-stars': {
      // Fond étoilé
      ctx.fillStyle = '#FFD700'
      const stars = [
        { x: 20, y: 20 + Math.sin(frame * 0.03) * 3 },
        { x: 140, y: 30 + Math.sin(frame * 0.04) * 3 },
        { x: 30, y: 120 + Math.sin(frame * 0.05) * 3 },
        { x: 130, y: 100 + Math.sin(frame * 0.035) * 3 },
        { x: 80, y: 15 + Math.sin(frame * 0.045) * 3 }
      ]
      ctx.font = '14px Arial'
      stars.forEach(star => {
        ctx.fillText('⭐', star.x, star.y)
      })
      break
    }
    case 'bg-rainbow': {
      // Arc-en-ciel
      const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3']
      colors.forEach((color, i) => {
        ctx.strokeStyle = color
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(80, 180, 60 + i * 8, Math.PI, 0)
        ctx.stroke()
      })
      break
    }
  }

  ctx.restore()
}

function drawStateEffects (
  ctx: CanvasRenderingContext2D,
  state: MonsterState,
  bodyY: number,
  pixelSize: number,
  frame: number
): void {
  if (state === 'hungry') {
    ctx.strokeStyle = '#2C2C2C'
    ctx.lineWidth = 2
    const rumble = Math.sin(frame * 0.2) * 2
    ctx.beginPath()
    ctx.moveTo(51 + rumble, bodyY + 45)
    ctx.lineTo(39 + rumble, bodyY + 45)
    ctx.stroke()
  }

  if (state === 'sleepy') {
    ctx.fillStyle = '#9B8FD4'
    const zOffset = (frame * 2) % 50
    ctx.font = 'bold 20px monospace'
    ctx.fillText('z', 130, bodyY - zOffset)
    ctx.font = 'bold 24px monospace'
    ctx.fillText('Z', 138, bodyY - zOffset - 15)
  }

  if (state === 'sad') {
    if (Math.floor(frame / 30) % 4 === 0) {
      ctx.fillStyle = '#7DD3FC'
      const tearY = bodyY + 30 + (frame % 30) * 2
      ctx.fillRect(66, tearY, pixelSize, pixelSize * 2)
    }
  }

  if (state === 'angry') {
    ctx.fillStyle = '#FF6B6B'
    ctx.fillRect(45, bodyY + 12, pixelSize, pixelSize)
    ctx.fillRect(111, bodyY + 15, pixelSize, pixelSize)
  }
}

function adjustColorBrightness (hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = ((num >> 8) & 0x00ff) + amt
  const B = (num & 0x0000ff) + amt
  return (
    '#' +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  )
}
