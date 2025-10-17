import { generateMonsterDesign } from '@/services/monsters/monster-generator'
import { type MonsterDesign } from '@/types/monster'
import { useCallback, useState } from 'react'

export const useMonsterGenerator = () => {
  const [monster, setMonster] = useState<MonsterDesign | null>(null)

  const generateMonster = useCallback(() => {
    // Pour l'instant, on utilise un design simple avec fox.svg
    const newMonster = generateMonsterDesign({
      style: 'illustrated',
      seed: Date.now().toString()
    })

    setMonster(newMonster)
    return newMonster
  }, [])

  return {
    monster,
    generateMonster
  }
}
