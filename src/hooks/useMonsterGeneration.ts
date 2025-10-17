'use client'

import { useState } from 'react'
import { MONSTER_STATES, MonsterState } from '@/types/monster.types'

interface MonsterDisplay {
  state: MonsterState
  imagePath: string
}

export const useMonsterGeneration = () => {
  const getRandomState = (): MonsterState => {
    const states = MONSTER_STATES
    const randomIndex = Math.floor(Math.random() * states.length)
    return states[randomIndex]
  }

  const getImagePathForState = (state: MonsterState): string => {
    switch (state) {
      case 'happy':
        return '/fox.svg'
      case 'sad':
        // Nous utilisons le même SVG pour l'instant mais en pratique,
        // on utiliserait des variantes différentes
        return '/fox.svg'
      case 'angry':
        return '/fox.svg'
      case 'hungry':
        return '/fox.svg'
      case 'neutral':
        return '/fox.svg'
      default:
        return '/fox.svg'
    }
  }

  const [monsterDisplay, setMonsterDisplay] = useState<MonsterDisplay>({
    state: 'happy',
    imagePath: '/fox.svg'
  })

  const generateNewMonster = () => {
    const newState = getRandomState()
    setMonsterDisplay({
      state: newState,
      imagePath: getImagePathForState(newState)
    })
  }

  return {
    monsterDisplay,
    generateNewMonster
  }
}
