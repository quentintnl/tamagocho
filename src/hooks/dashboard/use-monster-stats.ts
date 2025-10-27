import { useMemo } from 'react'
import type { DBMonster } from '@/types/monster'

/**
 * Labels français pour les différentes humeurs des monstres
 */
const MOOD_LABELS: Record<string, string> = {
  happy: 'Heureux',
  sad: 'Triste',
  angry: 'Fâché',
  hungry: 'Affamé',
  sleepy: 'Somnolent'
}

/**
 * Interface définissant les statistiques calculées des monstres
 */
export interface MonsterStats {
  /** Nombre total de monstres */
  totalMonsters: number
  /** Niveau le plus élevé parmi tous les monstres */
  highestLevel: number
  /** Date de la dernière adoption/mise à jour de monstre */
  latestAdoption: Date | null
  /** Humeur la plus fréquente parmi les monstres */
  favoriteMood: string | null
  /** Nombre d'humeurs différentes rencontrées */
  moodVariety: number
}

/**
 * Hook personnalisé pour calculer les statistiques des monstres
 *
 * Responsabilité unique : agréger et calculer les statistiques
 * à partir de la liste des monstres de l'utilisateur.
 *
 * @param {DBMonster[]} monsters - Liste des monstres de l'utilisateur
 * @returns {MonsterStats} Statistiques calculées
 *
 * @example
 * const stats = useMonsterStats(monsters)
 * // { totalMonsters: 5, highestLevel: 8, latestAdoption: Date, ... }
 */
export function useMonsterStats (monsters: DBMonster[]): MonsterStats {
  return useMemo(() => {
    if (!Array.isArray(monsters) || monsters.length === 0) {
      return {
        totalMonsters: 0,
        highestLevel: 1,
        latestAdoption: null,
        favoriteMood: null,
        moodVariety: 0
      }
    }

    let highestLevel = 1
    let latestAdoption: Date | null = null
    const moodCounter: Record<string, number> = {}
    const moodSet = new Set<string>()

    monsters.forEach((monster) => {
      // Calcul du niveau le plus élevé
      const level = monster.level ?? 1
      if (level > highestLevel) {
        highestLevel = level
      }

      // Détermination de la dernière adoption
      const rawDate = monster.updatedAt ?? monster.createdAt
      if (rawDate !== undefined) {
        const parsed = new Date(rawDate)
        if (!Number.isNaN(parsed.getTime()) && (latestAdoption === null || parsed > latestAdoption)) {
          latestAdoption = parsed
        }
      }

      // Comptage des humeurs
      const mood = typeof monster.state === 'string' ? monster.state : null
      if (mood !== null && mood.length > 0) {
        moodCounter[mood] = (moodCounter[mood] ?? 0) + 1
        moodSet.add(mood)
      }
    })

    // Détermination de l'humeur favorite (la plus fréquente)
    const favoriteMood = Object.entries(moodCounter)
      .sort((a, b) => b[1] - a[1])[0]?.[0] ?? null

    return {
      totalMonsters: monsters.length,
      highestLevel,
      latestAdoption,
      favoriteMood,
      moodVariety: moodSet.size
    }
  }, [monsters])
}

/**
 * Hook pour formater la date de dernière adoption
 *
 * Responsabilité unique : formater l'affichage de la date d'adoption
 *
 * @param {Date | null} latestAdoption - Date de dernière adoption
 * @returns {string} Message formaté pour l'affichage
 *
 * @example
 * useLatestAdoptionLabel(new Date()) // "27 octobre 2025"
 * useLatestAdoptionLabel(null) // "À toi de créer ton premier compagnon ✨"
 */
export function useLatestAdoptionLabel (latestAdoption: Date | null): string {
  return useMemo(() => {
    if (latestAdoption === null) {
      return 'À toi de créer ton premier compagnon ✨'
    }

    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(latestAdoption)
  }, [latestAdoption])
}

/**
 * Hook pour formater le message de l'humeur favorite
 *
 * Responsabilité unique : générer le message d'humeur contextuel
 *
 * @param {string | null} favoriteMood - Clé de l'humeur favorite
 * @param {number} totalMonsters - Nombre total de monstres
 * @returns {string} Message formaté pour l'affichage
 *
 * @example
 * useFavoriteMoodMessage('happy', 3) // "Aujourd'hui, ta bande est plutôt heureux..."
 */
export function useFavoriteMoodMessage (favoriteMood: string | null, totalMonsters: number): string {
  return useMemo(() => {
    if (totalMonsters === 0) {
      return 'Pas encore de vibe détectée. Crée ton premier monstre pour lancer la fête !'
    }

    const moodLabel = favoriteMood !== null ? (MOOD_LABELS[favoriteMood] ?? favoriteMood) : null

    if (moodLabel === null) {
      return 'Tes créatures attendent encore de montrer leur humeur préférée. Essaie de les cajoler ou de leur donner un snack !'
    }

    return `Aujourd'hui, ta bande est plutôt ${moodLabel.toLowerCase()}. Prévois une activité assortie pour maintenir la bonne humeur !`
  }, [favoriteMood, totalMonsters])
}
