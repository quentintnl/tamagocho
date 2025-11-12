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

  // Dessiner l'arrière-plan en premier (s'il y en a un équipé)
  const backgroundAccessory = equippedAccessories.find(acc => acc.accessoryId.startsWith('bg-'))
  if (backgroundAccessory !== undefined) {
    drawPurchasedBackground(ctx, backgroundAccessory.accessoryId, frame)
  }

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

    // Dessiner selon le type d'accessoire (sauf les arrière-plans qui sont dessinés au début)
    if (accessoryId.startsWith('hat-')) {
      drawPurchasedHat(ctx, accessoryId, bodyY, pixelSize, frame)
    } else if (accessoryId.startsWith('glasses-')) {
      drawPurchasedGlasses(ctx, accessoryId, bodyY, pixelSize)
    } else if (accessoryId.startsWith('shoes-')) {
      drawPurchasedShoes(ctx, accessoryId, bodyY, pixelSize)
    } else if (accessoryId.startsWith('effect-')) {
      drawPurchasedEffect(ctx, accessoryId, bodyY, pixelSize, frame)
    }
    // Les arrière-plans (bg-*) sont dessinés au début de drawMonster
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

  switch (bgId) {
    case 'bg-stars': {
      // Ciel nocturne dégradé
      const skyGradient = ctx.createRadialGradient(80, 80, 0, 80, 80, 120)
      skyGradient.addColorStop(0, '#000033')
      skyGradient.addColorStop(1, '#191970')
      ctx.fillStyle = skyGradient
      ctx.fillRect(0, 0, 160, 160)

      // Lune avec halo
      ctx.save()
      ctx.globalAlpha = 0.4
      const moonGlow = ctx.createRadialGradient(130, 35, 0, 130, 35, 25)
      moonGlow.addColorStop(0, '#FFD700')
      moonGlow.addColorStop(1, 'rgba(255, 215, 0, 0)')
      ctx.fillStyle = moonGlow
      ctx.fillRect(105, 10, 50, 50)
      ctx.restore()

      // Lune principale
      ctx.fillStyle = '#F0E68C'
      ctx.beginPath()
      ctx.arc(130, 35, 14, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#DAA520'
      ctx.lineWidth = 0.5
      ctx.stroke()

      // Cratères lunaires
      ctx.fillStyle = '#E6D68A'
      ctx.globalAlpha = 0.6
      ctx.beginPath()
      ctx.arc(126, 33, 2.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(133, 37, 1.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(132, 31, 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1

      // Étoiles scintillantes améliorées
      const starPositions = [
        { x: 20, y: 25, size: 2.5, twinkle: 0.03 },
        { x: 45, y: 15, size: 1.8, twinkle: 0.04 },
        { x: 35, y: 45, size: 2.2, twinkle: 0.05 },
        { x: 70, y: 20, size: 1.5, twinkle: 0.035 },
        { x: 140, y: 70, size: 2, twinkle: 0.045 },
        { x: 25, y: 95, size: 1.6, twinkle: 0.038 },
        { x: 55, y: 80, size: 2.3, twinkle: 0.042 },
        { x: 100, y: 15, size: 1.7, twinkle: 0.05 },
        { x: 145, y: 110, size: 2.1, twinkle: 0.036 },
        { x: 115, y: 90, size: 1.9, twinkle: 0.048 }
      ]

      starPositions.forEach(star => {
        const twinkle = Math.sin(frame * star.twinkle) * 0.5 + 0.5

        // Halo de l'étoile
        ctx.save()
        ctx.globalAlpha = twinkle * 0.3
        const starGlow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 2)
        starGlow.addColorStop(0, 'white')
        starGlow.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.fillStyle = starGlow
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        // Étoile principale (forme à 4 branches)
        ctx.save()
        ctx.globalAlpha = 0.7 + twinkle * 0.3
        ctx.fillStyle = 'white'
        ctx.translate(star.x, star.y)
        ctx.beginPath()
        for (let i = 0; i < 8; i++) {
          const radius = i % 2 === 0 ? star.size : star.size * 0.4
          const angle = (i / 8) * Math.PI * 2 - Math.PI / 2
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.fill()
        ctx.restore()
      })

      // Constellation (Grande Ourse)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'
      ctx.lineWidth = 0.8
      ctx.globalAlpha = 0.7
      const constellation = [
        [25, 120], [32, 115], [40, 118], [48, 115],
        [52, 108], [40, 125], [48, 130]
      ]
      ctx.beginPath()
      ctx.moveTo(constellation[0][0], constellation[0][1])
      for (let i = 1; i < 5; i++) {
        ctx.lineTo(constellation[i][0], constellation[i][1])
      }
      ctx.moveTo(constellation[2][0], constellation[2][1])
      ctx.lineTo(constellation[5][0], constellation[5][1])
      ctx.lineTo(constellation[6][0], constellation[6][1])
      ctx.stroke()

      constellation.forEach(([x, y]) => {
        ctx.fillStyle = 'white'
        ctx.beginPath()
        ctx.arc(x, y, 1.2, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1

      break
    }

    case 'bg-rainbow': {
      // Ciel bleu dégradé
      const skyGradient = ctx.createLinearGradient(0, 0, 0, 160)
      skyGradient.addColorStop(0, '#87CEEB')
      skyGradient.addColorStop(1, '#E0F6FF')
      ctx.fillStyle = skyGradient
      ctx.fillRect(0, 0, 160, 160)

      // Soleil brillant
      ctx.save()
      ctx.globalAlpha = 0.3
      const sunGlow = ctx.createRadialGradient(135, 30, 0, 135, 30, 20)
      sunGlow.addColorStop(0, '#FFD700')
      sunGlow.addColorStop(1, 'rgba(255, 215, 0, 0)')
      ctx.fillStyle = sunGlow
      ctx.fillRect(115, 10, 40, 40)
      ctx.restore()

      ctx.fillStyle = '#FFED4E'
      ctx.beginPath()
      ctx.arc(135, 30, 10, 0, Math.PI * 2)
      ctx.fill()

      // Rayons du soleil
      ctx.strokeStyle = '#FFD700'
      ctx.lineWidth = 1.5
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2
        const x1 = 135 + Math.cos(angle) * 13
        const y1 = 30 + Math.sin(angle) * 13
        const x2 = 135 + Math.cos(angle) * 18
        const y2 = 30 + Math.sin(angle) * 18
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }

      // Arc-en-ciel magnifique
      const rainbowColors = [
        '#FF0000', '#FF7F00', '#FFFF00',
        '#00FF00', '#0000FF', '#4B0082', '#9400D3'
      ]
      ctx.globalAlpha = 0.85
      rainbowColors.forEach((color, i) => {
        const radius = 120 - i * 8
        ctx.strokeStyle = color
        ctx.lineWidth = 9
        ctx.beginPath()
        ctx.arc(80, 160, radius, Math.PI, 0, false)
        ctx.stroke()
      })
      ctx.globalAlpha = 1

      // Nuages moelleux
      const drawCloud = (x: number, y: number, scale: number): void => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
        ctx.beginPath()
        ctx.arc(x, y, 12 * scale, 0, Math.PI * 2)
        ctx.arc(x + 10 * scale, y - 3 * scale, 10 * scale, 0, Math.PI * 2)
        ctx.arc(x + 18 * scale, y, 11 * scale, 0, Math.PI * 2)
        ctx.arc(x + 10 * scale, y + 4 * scale, 13 * scale, 0, Math.PI * 2)
        ctx.fill()

        // Ombre douce du nuage
        ctx.fillStyle = 'rgba(220, 220, 220, 0.3)'
        ctx.beginPath()
        ctx.ellipse(x + 9 * scale, y + 8 * scale, 15 * scale, 5 * scale, 0, 0, Math.PI * 2)
        ctx.fill()
      }

      drawCloud(25, 35, 0.8)
      drawCloud(110, 45, 1)
      drawCloud(70, 28, 0.6)

      break
    }

    case 'bg-clouds': {
      // Ciel avec nuages
      const skyGradient = ctx.createRadialGradient(80, 80, 0, 80, 80, 120)
      skyGradient.addColorStop(0, '#B0E0E6')
      skyGradient.addColorStop(1, '#87CEEB')
      ctx.fillStyle = skyGradient
      ctx.fillRect(0, 0, 160, 160)

      // Fonction pour dessiner un nuage détaillé
      const drawFluffyCloud = (x: number, y: number, scale: number, drift: number): void => {
        const offsetX = Math.sin(frame * 0.01 + drift) * 2

        const cloudGradient = ctx.createRadialGradient(
          x + offsetX, y, 0,
          x + offsetX, y, 20 * scale
        )
        cloudGradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
        cloudGradient.addColorStop(1, 'rgba(240, 240, 240, 0.85)')

        ctx.fillStyle = cloudGradient
        ctx.beginPath()
        ctx.arc(x + offsetX, y, 13 * scale, 0, Math.PI * 2)
        ctx.arc(x + 12 * scale + offsetX, y - 2 * scale, 11 * scale, 0, Math.PI * 2)
        ctx.arc(x + 22 * scale + offsetX, y, 12 * scale, 0, Math.PI * 2)
        ctx.arc(x + 12 * scale + offsetX, y + 4 * scale, 14 * scale, 0, Math.PI * 2)
        ctx.fill()
      }

      drawFluffyCloud(15, 30, 0.9, 0)
      drawFluffyCloud(90, 25, 1.1, 1)
      drawFluffyCloud(40, 70, 0.7, 2)
      drawFluffyCloud(110, 80, 0.95, 3)
      drawFluffyCloud(25, 115, 0.85, 4)
      drawFluffyCloud(100, 130, 1, 5)

      break
    }

    case 'bg-sunset': {
      // Dégradé de coucher de soleil
      const sunsetGradient = ctx.createLinearGradient(0, 0, 0, 160)
      sunsetGradient.addColorStop(0, '#FF6B35')
      sunsetGradient.addColorStop(0.25, '#FF8C42')
      sunsetGradient.addColorStop(0.5, '#FFA07A')
      sunsetGradient.addColorStop(0.75, '#FFB6C1')
      sunsetGradient.addColorStop(1, '#DDA0DD')
      ctx.fillStyle = sunsetGradient
      ctx.fillRect(0, 0, 160, 160)

      // Soleil couchant avec halos
      ctx.save()
      ctx.globalAlpha = 0.3
      const sunHalo1 = ctx.createRadialGradient(80, 120, 0, 80, 120, 35)
      sunHalo1.addColorStop(0, '#FFD700')
      sunHalo1.addColorStop(1, 'rgba(255, 215, 0, 0)')
      ctx.fillStyle = sunHalo1
      ctx.fillRect(45, 85, 70, 70)
      ctx.restore()

      ctx.fillStyle = '#FF8C00'
      ctx.globalAlpha = 0.9
      ctx.beginPath()
      ctx.arc(80, 120, 22, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#FF6347'
      ctx.beginPath()
      ctx.arc(80, 120, 18, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1

      // Reflets sur l'eau
      ctx.fillStyle = 'rgba(255, 140, 0, 0.4)'
      ctx.beginPath()
      ctx.ellipse(80, 135, 45, 8, 0, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = 'rgba(255, 140, 0, 0.3)'
      ctx.beginPath()
      ctx.ellipse(80, 145, 30, 6, 0, 0, Math.PI * 2)
      ctx.fill()

      // Oiseaux en vol
      const drawBird = (x: number, y: number, scale: number): void => {
        ctx.strokeStyle = '#2C2C2C'
        ctx.lineWidth = 1.2 * scale
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(x - 6 * scale, y)
        ctx.quadraticCurveTo(x - 3 * scale, y - 2 * scale, x, y)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.quadraticCurveTo(x + 3 * scale, y - 2 * scale, x + 6 * scale, y)
        ctx.stroke()
      }

      drawBird(40, 50, 1)
      drawBird(115, 42, 0.8)
      drawBird(95, 60, 0.9)

      break
    }

    case 'bg-galaxy': {
      // Espace profond
      ctx.fillStyle = '#0a0a2e'
      ctx.fillRect(0, 0, 160, 160)

      // Nébuleuses colorées
      const nebulas = [
        { x: 50, y: 60, rx: 40, ry: 30, color: '#8B00FF' },
        { x: 115, y: 100, rx: 48, ry: 35, color: '#FF00FF' },
        { x: 80, y: 40, rx: 32, ry: 24, color: '#00BFFF' }
      ]

      nebulas.forEach(nebula => {
        const nebulaGradient = ctx.createRadialGradient(
          nebula.x, nebula.y, 0,
          nebula.x, nebula.y, nebula.rx
        )
        nebulaGradient.addColorStop(0, `${nebula.color}99`)
        nebulaGradient.addColorStop(1, `${nebula.color}00`)
        ctx.fillStyle = nebulaGradient
        ctx.beginPath()
        ctx.ellipse(nebula.x, nebula.y, nebula.rx, nebula.ry, 0, 0, Math.PI * 2)
        ctx.fill()
      })

      // Étoiles de la galaxie
      for (let i = 0; i < 60; i++) {
        const x = Math.random() * 160
        const y = Math.random() * 160
        const size = 0.5 + Math.random() * 1.5
        const opacity = 0.3 + Math.random() * 0.7

        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }

      // Galaxie spirale centrale
      ctx.save()
      ctx.translate(80, 80)
      ctx.rotate(Math.PI / 6)

      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.beginPath()
      ctx.ellipse(0, 0, 32, 12, 0, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.beginPath()
      ctx.ellipse(0, 0, 25, 9, 0, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#FFD700'
      ctx.globalAlpha = 0.8
      ctx.beginPath()
      ctx.arc(0, 0, 6, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()

      break
    }

    case 'bg-aurora': {
      // Ciel nocturne arctique
      ctx.fillStyle = '#001a33'
      ctx.fillRect(0, 0, 160, 160)

      // Étoiles arctiques
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * 160
        const y = Math.random() * 120
        const size = 0.5 + Math.random() * 1.2
        const opacity = 0.5 + Math.random() * 0.5

        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }

      // Aurores boréales ondulantes
      const auroraColors = [
        { color: '#00FF88', offset: 0 },
        { color: '#00FFFF', offset: 20 },
        { color: '#00AAFF', offset: 40 }
      ]

      auroraColors.forEach(({ color, offset }) => {
        const waveOffset = Math.sin(frame * 0.02 + offset * 0.1) * 5

        ctx.fillStyle = color + 'AA'
        ctx.beginPath()
        ctx.moveTo(0, 65 + offset + waveOffset)
        ctx.quadraticCurveTo(40, 50 + offset + waveOffset, 80, 58 + offset + waveOffset)
        ctx.quadraticCurveTo(120, 65 + offset + waveOffset, 160, 55 + offset + waveOffset)
        ctx.lineTo(160, 85 + offset + waveOffset)
        ctx.quadraticCurveTo(120, 75 + offset + waveOffset, 80, 82 + offset + waveOffset)
        ctx.quadraticCurveTo(40, 90 + offset + waveOffset, 0, 75 + offset + waveOffset)
        ctx.closePath()
        ctx.fill()
      })

      // Rideaux verticaux d'aurore
      for (let i = 0; i < 6; i++) {
        const x = i * 25 + 10
        const wave = Math.sin(frame * 0.03 + i) * 3

        const gradient = ctx.createLinearGradient(x, 50, x, 140)
        gradient.addColorStop(0, 'rgba(0, 255, 136, 0)')
        gradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.3)')
        gradient.addColorStop(1, 'rgba(0, 170, 255, 0)')

        ctx.fillStyle = gradient
        ctx.fillRect(x + wave, 50, 3, 90)
      }

      // Horizon montagneux
      ctx.fillStyle = 'rgba(0, 10, 26, 0.8)'
      ctx.beginPath()
      ctx.moveTo(0, 145)
      ctx.lineTo(30, 130)
      ctx.lineTo(60, 138)
      ctx.lineTo(95, 125)
      ctx.lineTo(125, 135)
      ctx.lineTo(160, 128)
      ctx.lineTo(160, 160)
      ctx.lineTo(0, 160)
      ctx.closePath()
      ctx.fill()

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
